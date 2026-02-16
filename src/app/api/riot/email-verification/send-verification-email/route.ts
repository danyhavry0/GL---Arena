import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { sendRiotVerificationEmail } from "@/lib/email";

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
      | { email?: string }
      | null;

    const email = body?.email?.trim();
    if (!email) {
      return jsonError("email is required", 400);
    }

    // Recupera info necessarie dal profilo utente
    const { data: profile, error: profileErr } = await supabase
      .from("users")
      .select(
        "riot_summoner_name, riot_verification_code_hash, riot_verification_code_expiry"
      )
      .eq("id", user.id)
      .maybeSingle();

    if (profileErr) {
      console.error("[riot-email][send] profile error:", profileErr);
      return jsonError("Failed to load user profile", 500);
    }

    if (
      !profile?.riot_verification_code_hash ||
      !profile?.riot_verification_code_expiry
    ) {
      return jsonError(
        "No verification code prepared. Call request-verification first.",
        400
      );
    }

    const expiryDate = new Date(profile.riot_verification_code_expiry);
    if (Number.isNaN(expiryDate.getTime()) || expiryDate < new Date()) {
      return jsonError("Verification code expired. Request a new one.", 400);
    }

    // In questa implementazione non rigeneriamo il codice:
    // lo step precedente l'ha già generato e salvato l'hash,
    // ma non possiamo conoscere il valore in chiaro qui in sicurezza.
    // Per allinearci alla guida e mantenere il flusso semplice,
    // ci aspettiamo che il client conservi il codice restituito
    // da /request e lo invii qui per l'email.
    const verificationCode =
      (body as any)?.verificationCode ??
      null;

    if (
      typeof verificationCode !== "string" ||
      verificationCode.trim().length !== 6
    ) {
      return jsonError(
        "verificationCode is required in body and must be 6 digits (kept client-side from request step).",
        400
      );
    }

    // Aggiorna l'email Riot dell'utente
    const { error: updateErr } = await supabase
      .from("users")
      .update({
        riot_email: email,
      })
      .eq("id", user.id);

    if (updateErr) {
      console.error("[riot-email][send] update error:", updateErr);
      return jsonError("Failed to store Riot email", 500);
    }

    // Invia email
    await sendRiotVerificationEmail(
      email,
      verificationCode,
      profile.riot_summoner_name || "Summoner"
    );

    return NextResponse.json(
      {
        success: true,
        message: "Verification code sent to your email",
      },
      { status: 200 }
    );
  } catch (e) {
    console.error("[riot-email][send] Unexpected error:", e);
    return jsonError("Failed to send email", 500);
  }
}

