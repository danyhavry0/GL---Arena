"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import ProtectedRoute from "@/components/ProtectedRoute";

type ExchangeOk = {
  ok: true;
  puuid: string;
  riotId: string;
};

type ExchangeErr = {
  ok: false;
  error: string;
};

export default function RiotCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"working" | "error">("working");
  const [error, setError] = useState<string | null>(null);

  const code = useMemo(() => searchParams.get("code"), [searchParams]);
  const state = useMemo(() => searchParams.get("state"), [searchParams]);
  const oauthError = useMemo(() => searchParams.get("error"), [searchParams]);

  useEffect(() => {
    const run = async () => {
      try {
        if (oauthError) throw new Error(oauthError);
        if (!code) throw new Error("Missing code from Riot callback.");
        if (!state) throw new Error("Missing state from Riot callback.");

        const expectedState = sessionStorage.getItem("riot_oauth_state");
        if (!expectedState || expectedState !== state) {
          throw new Error("Invalid OAuth state. Please try connecting again.");
        }
        sessionStorage.removeItem("riot_oauth_state");

        const redirectUri = `${window.location.origin}/dashboard/links/riot/callback`;
        const res = await fetch("/api/riot/oauth/exchange", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, redirectUri }),
        });

        const body = (await res.json().catch(() => null)) as ExchangeOk | ExchangeErr | null;
        if (!res.ok || !body || body.ok !== true) {
          throw new Error((body as ExchangeErr | null)?.error ?? "Failed to exchange Riot code.");
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user?.id) throw new Error("You must be logged in to link Riot.");

        const { error: updErr } = await supabase
          .from("users")
          .update({
            riot_puuid: body.puuid,
            riot_summoner_name: body.riotId,
          })
          .eq("id", session.user.id);

        if (updErr) throw new Error("Failed to save Riot link to profile.");

        router.replace("/dashboard/links?linked=riot");
      } catch (e: unknown) {
        console.error(e);
        setStatus("error");
        setError(e instanceof Error ? e.message : "Unexpected error linking Riot.");
      }
    };

    run();
  }, [code, oauthError, router, state]);

  return (
    <ProtectedRoute>
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="max-w-md w-full">
          {status === "working" ? (
            <div className="rounded-lg border border-border p-6 text-center">
              <div className="mx-auto mb-3 h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <p className="text-sm text-muted-foreground">Linking Riot account…</p>
            </div>
          ) : (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-6 text-center">
              <p className="text-sm text-destructive">{error ?? "Failed to link Riot account."}</p>
              <button
                className="mt-4 text-sm text-primary hover:underline"
                onClick={() => router.replace("/dashboard/links")}
              >
                Back to Links
              </button>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

