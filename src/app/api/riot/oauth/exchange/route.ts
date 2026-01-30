import { NextRequest, NextResponse } from "next/server";

type RiotTokenOk = {
  access_token: string;
  token_type: string;
  expires_in?: number;
  scope?: string;
  refresh_token?: string;
  id_token?: string;
};

type RiotAccountMe = {
  puuid: string;
  gameName: string;
  tagLine: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function jsonError(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export async function POST(req: NextRequest) {
  try {
    const { code, redirectUri } = (await req.json().catch(() => null)) as
      | { code?: string; redirectUri?: string }
      | null;

    if (!code || !redirectUri) return jsonError("Missing code or redirectUri.", 400);

    const clientId = process.env.NEXT_PUBLIC_RIOT_OAUTH_CLIENT_ID;
    const clientSecret = process.env.RIOT_OAUTH_CLIENT_SECRET;
    if (!clientId) return jsonError("Missing NEXT_PUBLIC_RIOT_OAUTH_CLIENT_ID.", 500);
    if (!clientSecret) return jsonError("Missing RIOT_OAUTH_CLIENT_SECRET.", 500);

    const tokenBody = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    });

    const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    const tokenRes = await fetch("https://auth.riotgames.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${basic}`,
      },
      body: tokenBody.toString(),
      cache: "no-store",
    });

    const tokenRaw: unknown = await tokenRes.json().catch(() => null);
    const tokenJson = (isRecord(tokenRaw) ? tokenRaw : null) as (RiotTokenOk & Record<string, unknown>) | null;
    const accessToken = tokenJson?.access_token;
    if (!tokenRes.ok || typeof accessToken !== "string" || !accessToken) {
      return jsonError("Riot token exchange failed.", 401);
    }

    // Riot Account API (RSO): get current account (puuid + Riot ID)
    const meRes = await fetch("https://americas.api.riotgames.com/riot/account/v1/accounts/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    const meRaw: unknown = await meRes.json().catch(() => null);
    const meJson = (isRecord(meRaw) ? meRaw : null) as (RiotAccountMe & Record<string, unknown>) | null;
    if (!meRes.ok || !meJson || typeof meJson.puuid !== "string" || !meJson.puuid) {
      return jsonError("Failed to fetch Riot account profile.", 401);
    }

    const riotId =
      meJson.gameName && meJson.tagLine ? `${meJson.gameName}#${meJson.tagLine}` : meJson.gameName;

    return NextResponse.json(
      { ok: true, puuid: meJson.puuid, riotId: riotId ?? "Riot Account" },
      { status: 200 }
    );
  } catch (e) {
    console.error(e);
    return jsonError("Unexpected error during Riot OAuth exchange.", 500);
  }
}

