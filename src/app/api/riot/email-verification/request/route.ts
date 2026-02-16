import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabaseClient";
import { getSummonerByName } from "@/lib/riot";

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function extractBearerToken(req: NextRequest): string | null {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  return authHeader.slice("Bearer ".length).trim() || null;
}

export async function POST(req: NextRequest) {
  try {
    const token = extractBearerToken(req);
    if (!token) {
      return jsonError("Missing Authorization Bearer token", 401);
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return jsonError("Invalid or expired token", 401);
    }

    const body = (await req.json().catch(() => null)) as
      | { gameName?: string; tagLine?: string; summonerName?: string; region?: string }
      | null;

    const region = body?.region?.trim() || "euw1";

    let gameName = body?.gameName?.trim();
    let tagLine = body?.tagLine?.trim();

    // Backward-compat: allow a single "summonerName" in the form "Name#TAG"
    if ((!gameName || !tagLine) && body?.summonerName) {
      const parts = body.summonerName.split("#");
      if (parts.length === 2) {
        gameName = parts[0]?.trim();
        tagLine = parts[1]?.trim();
      }
    }

    if (!gameName || !tagLine) {
      return jsonError(
        "gameName and tagLine are required (format: Name#TAG, e.g. The Brave#6464).",
        400
      );
    }

    // STEP 1: verifica che il Riot ID esista su Riot
    let summoner;
    try {
      summoner = await getSummonerByName(gameName, tagLine, region);
    } catch (e: any) {
      if (e?.message === "Summoner not found") {
        return jsonError(
          "Summoner not found. Check the name and region.",
          404
        );
      }
      console.error("[riot-email][request] Riot error:", e);
      return jsonError("Failed to verify summoner with Riot API", 502);
    }

    // STEP 2: genera codice (non ancora inviato per email)
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minuti
    const codeHash = await bcrypt.hash(code, 10);

    // STEP 3: salva info Riot e hash codice sul profilo Supabase dell'utente
    const { error: updateErr } = await supabase
      .from("users")
      .update({
        riot_summoner_name: `${summoner.summonerName}#${summoner.tagLine}`,
        riot_puuid: summoner.puuid,
        riot_verification_code_hash: codeHash,
        riot_verification_code_expiry: expiry.toISOString(),
        riot_verified: false,
      })
      .eq("id", user.id);

    if (updateErr) {
      console.error("[riot-email][request] DB update error:", updateErr);
      return jsonError("Failed to prepare verification. Try again later.", 500);
    }

    // Non inviamo ancora l'email: il codice viene restituito solo
    // per lo step successivo (in un contesto reale non lo restituiremmo al client).
    return NextResponse.json(
      {
        success: true,
        message: "Summoner verified. Now you can request the email with the code.",
        summonerName: summoner.summonerName,
        riotId: `${summoner.summonerName}#${summoner.tagLine}`,
        summonerLevel: summoner.summonerLevel,
        // ATTENZIONE: restituiamo il codice solo per seguire la guida
        // in un ambiente reale non dovresti mai restituirlo al client.
        verificationCode: code,
      },
      { status: 200 }
    );
  } catch (e) {
    console.error("[riot-email][request] Unexpected error:", e);
    return jsonError("Internal server error", 500);
  }
}

