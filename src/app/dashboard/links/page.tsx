"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Link2, Check, ExternalLink, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useTranslation } from "@/contexts/LocaleContext";

type PlatformId = "riot";

type Platform = {
  id: PlatformId;
  name: string;
  tagline?: string;
  descriptionKey: string;
  iconSrc: string;
  accent: string;
  bgGradient: string;
  borderGlow: string;
  badge?: string;
  connected: boolean;
  accountLabel?: string;
};

export default function LinksPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState<PlatformId | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showRiotFlow, setShowRiotFlow] = useState(false);
  const [riotStep, setRiotStep] = useState<"summoner" | "email" | "code" | "success">("summoner");
  const [riotSummonerName, setRiotSummonerName] = useState("");
  const [riotEmail, setRiotEmail] = useState("");
  const [riotCode, setRiotCode] = useState("");
  const [riotGeneratedCode, setRiotGeneratedCode] = useState("");
  const [riotFlowLoading, setRiotFlowLoading] = useState(false);
  const [riotFlowMessage, setRiotFlowMessage] = useState<string | null>(null);
  const [riotFlowError, setRiotFlowError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        return;
      }

      const { data: profile, error: profileErr } = await supabase
        .from("users")
        .select("riot_puuid, riot_summoner_name")
        .eq("id", session.user.id)
        .maybeSingle();

      if (profileErr) console.error(profileErr);

      setPlatforms((prev) =>
        prev.map((p) =>
          p.id === "riot"
            ? {
                ...p,
                connected: !!profile?.riot_puuid,
                accountLabel: profile?.riot_summoner_name ?? undefined,
              }
            : p
        )
      );

      setLoading(false);
    };
    fetchUser();
  }, []);

  const [platforms, setPlatforms] = useState<Platform[]>([
    {
      id: "riot",
      name: "Riot Games",
      tagline: "League of Legends",
      descriptionKey: "links.riotDescription",
      iconSrc: "/images/riot-icon.png",
      accent: "from-red-600 to-red-800",
      bgGradient: "from-red-500/10 via-transparent to-red-600/5",
      borderGlow: "hover:border-red-500/50 hover:shadow-[0_0_20px_rgba(220,38,38,0.15)]",
      badge: "LoL",
      connected: false,
    },
  ]);

  const handleConnect = async (id: PlatformId) => {
    setError(null);

    if (id !== "riot") return;

    // Start Riot email verification flow instead of OAuth redirect
    setShowRiotFlow(true);
    setRiotStep("summoner");
    setRiotSummonerName("");
    setRiotEmail("");
    setRiotCode("");
    setRiotGeneratedCode("");
    setRiotFlowError(null);
    setRiotFlowMessage(null);
  };

  const handleRiotSummonerSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setRiotFlowLoading(true);
    setRiotFlowError(null);
    setRiotFlowMessage(null);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const token = session?.access_token;
      if (!token) {
        setRiotFlowError("You must be logged in to connect your Riot account.");
        return;
      }

      // Parse Riot ID in the form "Name#TAG"
      const parts = riotSummonerName.split("#");
      const gameName = parts[0]?.trim();
      const tagLine = parts[1]?.trim();

      if (!gameName || !tagLine) {
        setRiotFlowError("Please enter your Riot ID in the format Name#TAG (e.g. The Brave#6464).");
        return;
      }

      const res = await fetch("/api/riot/email-verification/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          gameName,
          tagLine,
          region: "euw1",
        }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error ?? "Failed to verify summoner with Riot API.");
      }

      setRiotGeneratedCode(data?.verificationCode ?? "");
      setRiotFlowMessage("Summoner verified. Now enter your Riot email.");
      setRiotStep("email");
    } catch (e: any) {
      setRiotFlowError(e?.message ?? "Unexpected error while verifying summoner.");
    } finally {
      setRiotFlowLoading(false);
    }
  };

  const handleRiotEmailSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setRiotFlowLoading(true);
    setRiotFlowError(null);
    setRiotFlowMessage(null);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const token = session?.access_token;
      if (!token) {
        setRiotFlowError("You must be logged in to connect your Riot account.");
        return;
      }

      const res = await fetch("/api/riot/email-verification/send-verification-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: riotEmail.trim(),
          verificationCode: riotGeneratedCode,
        }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error ?? "Failed to send verification email.");
      }

      setRiotFlowMessage(
        "Verification code sent to your email. Please check your inbox (and spam) and enter the code."
      );
      setRiotStep("code");
    } catch (e: any) {
      setRiotFlowError(e?.message ?? "Unexpected error while sending email.");
    } finally {
      setRiotFlowLoading(false);
    }
  };

  const handleRiotCodeSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setRiotFlowLoading(true);
    setRiotFlowError(null);
    setRiotFlowMessage(null);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const token = session?.access_token;
      if (!token) {
        setRiotFlowError("You must be logged in to connect your Riot account.");
        return;
      }

      const res = await fetch("/api/riot/email-verification/verify-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          verificationCode: riotCode.trim(),
        }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error ?? "Invalid or expired verification code.");
      }

      setRiotFlowMessage("Riot account verified successfully.");
      setRiotStep("success");

      // Mark Riot as connected locally
      setPlatforms((prev) =>
        prev.map((p) =>
          p.id === "riot"
            ? {
                ...p,
                connected: true,
                accountLabel: riotSummonerName || p.accountLabel,
              }
            : p
        )
      );
    } catch (e: any) {
      setRiotFlowError(e?.message ?? "Unexpected error while verifying code.");
    } finally {
      setRiotFlowLoading(false);
    }
  };

  const handleDisconnect = async (id: PlatformId) => {
    setConnecting(id);
    try {
      setError(null);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user?.id) {
        setError("You must be logged in to disconnect.");
        return;
      }

      const { error: updErr } = await supabase
        .from("users")
        .update({ riot_puuid: null, riot_summoner_name: null })
        .eq("id", session.user.id);

      if (updErr) {
        console.error(updErr);
        setError("Failed to disconnect Riot account.");
        return;
      }

      setPlatforms((prev) =>
        prev.map((p) => (p.id === id ? { ...p, connected: false, accountLabel: undefined } : p))
      );
    } finally {
      setConnecting(null);
    }
  };

  useEffect(() => {
    // optional: allow callback page to redirect back with ?linked=riot
    const linked = searchParams.get("linked");
    if (!linked) return;
    router.replace("/dashboard/links");
  }, [router, searchParams]);

  return (
    <ProtectedRoute>
      <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30">
              <Link2 className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">{t("links.title")}</h1>
              <p className="text-muted-foreground mt-0.5">
                {t("links.subtitle")}
              </p>
            </div>
            <Badge variant="outline" className="ml-auto gap-1 border-primary/40 text-primary">
              <Sparkles className="w-3.5 h-3.5" />
              {t("links.tournamentsValidation")}
            </Badge>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-16">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent"
            />
          </div>
        ) : (
          <div className="space-y-6 max-w-2xl">
            {error && (
              <div className="rounded-md bg-destructive/10 border border-destructive/50 p-3">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
            {platforms.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 * i }}
              >
                <Card
                  className={`
                    overflow-hidden border-2 transition-all duration-300
                    bg-gradient-to-br ${p.bgGradient}
                    border-border hover:border-primary/30 ${p.borderGlow}
                  `}
                >
                  <CardHeader className="pb-4">
                    <div className="flex flex-wrap items-start gap-4 sm:gap-6">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="relative shrink-0"
                      >
                        <div
                          className="p-4 rounded-2xl bg-white shadow-lg ring-1 ring-black/5"
                        >
                          <div className="relative w-16 h-16">
                            <Image
                              src={p.iconSrc}
                              alt=""
                              fill
                              className="object-contain drop-shadow-sm"
                              sizes="64px"
                            />
                          </div>
                        </div>
                        {p.badge && (
                          <Badge
                            className="absolute -top-1.5 -right-1.5 bg-foreground/90 text-background border-0 text-xs"
                          >
                            {p.badge}
                          </Badge>
                        )}
                      </motion.div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <CardTitle className="text-xl">{p.name}</CardTitle>
                          {p.tagline && (
                            <span className="text-sm text-muted-foreground font-medium">
                              · {p.tagline}
                            </span>
                          )}
                        </div>
                        <CardDescription className="text-base mt-1">
                          {t(p.descriptionKey)}
                        </CardDescription>
                        {p.connected && p.accountLabel && (
                          <motion.p
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="mt-3 text-sm text-success flex items-center gap-2 font-medium"
                          >
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-success/20">
                              <Check className="h-3.5 w-3.5" />
                            </span>
                            {p.accountLabel}
                          </motion.p>
                        )}
                      </div>
                      <div className="shrink-0 w-full sm:w-auto">
                        {p.connected ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDisconnect(p.id)}
                            disabled={connecting === p.id}
                            className="w-full sm:w-auto border-muted-foreground/30"
                          >
                            {connecting === p.id ? "…" : t("common.disconnect")}
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleConnect(p.id)}
                            disabled={connecting === p.id}
                            className="w-full sm:w-auto gap-2 bg-primary hover:bg-primary/90"
                          >
                            {connecting === p.id ? (
                              <>
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                {t("common.connecting")}
                              </>
                            ) : (
                              <>
                                <ExternalLink className="w-4 h-4" />
                                {t("common.connect")}
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {showRiotFlow && (
          <div className="mt-8 max-w-2xl space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Riot email verification</h2>
            <p className="text-sm text-muted-foreground">
              Link your Riot account by verifying your summoner and email with a one-time code.
            </p>

            {riotFlowError && (
              <div className="rounded-md bg-destructive/10 border border-destructive/50 p-3">
                <p className="text-sm text-destructive">{riotFlowError}</p>
              </div>
            )}
            {riotFlowMessage && (
              <div className="rounded-md bg-primary/10 border border-primary/40 p-3">
                <p className="text-sm text-primary">{riotFlowMessage}</p>
              </div>
            )}

            {riotStep === "summoner" && (
              <form onSubmit={handleRiotSummonerSubmit} className="space-y-3">
                <label className="flex flex-col gap-1 text-sm font-medium text-foreground">
                  Riot ID (Name#TAG)
                  <input
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    value={riotSummonerName}
                    onChange={(e) => setRiotSummonerName(e.target.value)}
                    placeholder="e.g. The Brave#6464"
                    disabled={riotFlowLoading}
                    required
                  />
                </label>
                <div className="flex gap-2">
                  <Button type="submit" disabled={riotFlowLoading || !riotSummonerName.trim()}>
                    {riotFlowLoading ? "Verifying..." : "Verify Riot ID"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={riotFlowLoading}
                    onClick={() => {
                      setShowRiotFlow(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            {riotStep === "email" && (
              <form onSubmit={handleRiotEmailSubmit} className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Summoner: <span className="font-semibold">{riotSummonerName}</span>
                </p>
                <label className="flex flex-col gap-1 text-sm font-medium text-foreground">
                  Riot email
                  <input
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    type="email"
                    value={riotEmail}
                    onChange={(e) => setRiotEmail(e.target.value)}
                    placeholder="your_riot_email@example.com"
                    disabled={riotFlowLoading}
                    required
                  />
                </label>
                <div className="flex gap-2">
                  <Button type="submit" disabled={riotFlowLoading || !riotEmail.trim()}>
                    {riotFlowLoading ? "Sending..." : "Send verification code"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={riotFlowLoading}
                    onClick={() => setRiotStep("summoner")}
                  >
                    Back
                  </Button>
                </div>
              </form>
            )}

            {riotStep === "code" && (
              <form onSubmit={handleRiotCodeSubmit} className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  We sent a 6-digit code to <span className="font-semibold">{riotEmail}</span>.
                </p>
                <label className="flex flex-col gap-1 text-sm font-medium text-foreground">
                  Verification code
                  <input
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-lg tracking-[0.4em] text-center outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    value={riotCode}
                    onChange={(e) => setRiotCode(e.target.value.slice(0, 6))}
                    maxLength={6}
                    placeholder="000000"
                    disabled={riotFlowLoading}
                    required
                  />
                </label>
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={riotFlowLoading || riotCode.trim().length !== 6}
                  >
                    {riotFlowLoading ? "Verifying..." : "Confirm code"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={riotFlowLoading}
                    onClick={() => setRiotStep("email")}
                  >
                    Back
                  </Button>
                </div>
              </form>
            )}

            {riotStep === "success" && (
              <div className="space-y-3">
                <p className="text-sm text-success font-medium">
                  Your Riot account has been linked successfully.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowRiotFlow(false);
                  }}
                >
                  Close
                </Button>
              </div>
            )}
          </div>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-10 text-sm text-muted-foreground max-w-2xl"
        >
          {t("links.morePlatforms")}
        </motion.p>
      </div>
    </ProtectedRoute>
  );
}
