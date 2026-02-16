import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabaseClient";
import { sendRiotWelcomeEmail } from "@/lib/email";

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
      | { verificationCode?: string }
      | null;

    const verificationCode = body?.verificationCode?.trim();
    if (!verificationCode) {
      return jsonError("verificationCode is required", 400);
    }

    // Carica i dati necessari
    const { data: profile, error: profileErr } = await supabase
      .from("users")
      .select(
        "riot_email, riot_summoner_name, riot_verification_code_hash, riot_verification_code_expiry, riot_verified"
      )
      .eq("id", user.id)
      .maybeSingle();

    if (profileErr) {
      console.error("[riot-email][verify] profile error:", profileErr);
      return jsonError("Failed to load user profile", 500);
    }

    if (!profile) {
      return jsonError("User profile not found", 404);
    }

    if (!profile.riot_verification_code_hash) {
      return jsonError("No verification in progress", 400);
    }

    if (!profile.riot_verification_code_expiry) {
      return jsonError("Verification code has no expiry set", 400);
    }

    const expiryDate = new Date(profile.riot_verification_code_expiry);
    if (Number.isNaN(expiryDate.getTime()) || expiryDate < new Date()) {
      return jsonError("Verification code expired", 401);
    }

    const isValid = await bcrypt.compare(
      verificationCode,
      profile.riot_verification_code_hash
    );

    if (!isValid) {
      return jsonError("Invalid verification code", 401);
    }

    // Aggiorna utente come verificato e pulisce i campi del codice
    const { error: updateErr } = await supabase
      .from("users")
      .update({
        riot_verified: true,
        riot_verification_code_hash: null,
        riot_verification_code_expiry: null,
      })
      .eq("id", user.id);

    if (updateErr) {
      console.error("[riot-email][verify] update error:", updateErr);
      return jsonError("Failed to mark Riot email as verified", 500);
    }

    // Email di benvenuto (best effort)
    if (profile.riot_email) {
      try {
        await sendRiotWelcomeEmail(
          profile.riot_email,
          profile.riot_summoner_name || "Summoner"
        );
      } catch (e) {
        console.warn("[riot-email][verify] Failed to send welcome email:", e);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Email verified successfully!",
        riot: {
          email: profile.riot_email,
          summonerName: profile.riot_summoner_name,
          verified: true,
        },
      },
      { status: 200 }
    );
  } catch (e) {
    console.error("[riot-email][verify] Unexpected error:", e);
    return jsonError("Internal server error", 500);
  }
}

