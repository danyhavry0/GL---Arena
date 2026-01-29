"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Link2, Check, ExternalLink, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProtectedRoute from "@/components/ProtectedRoute";

type PlatformId = "riot";

type Platform = {
  id: PlatformId;
  name: string;
  tagline?: string;
  description: string;
  iconSrc: string;
  accent: string;
  bgGradient: string;
  borderGlow: string;
  badge?: string;
  connected: boolean;
  accountLabel?: string;
};

export default function LinksPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState<PlatformId | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) setUser(session.user);
      setLoading(false);
    };
    fetchUser();
  }, []);

  const [platforms, setPlatforms] = useState<Platform[]>([
    {
      id: "riot",
      name: "Riot Games",
      tagline: "League of Legends",
      description: "Link your Summoner account (name & PUUID) for tournaments, match validation, and bracket registration.",
      iconSrc: "/images/riot-icon.jpg",
      accent: "from-red-600 to-red-800",
      bgGradient: "from-red-500/10 via-transparent to-red-600/5",
      borderGlow: "hover:border-red-500/50 hover:shadow-[0_0_20px_rgba(220,38,38,0.15)]",
      badge: "LoL",
      connected: false,
    },
  ]);

  const handleConnect = async (id: PlatformId) => {
    setConnecting(id);
    try {
      await new Promise((r) => setTimeout(r, 800));
      setPlatforms((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, connected: true, accountLabel: "Account linked (placeholder)" } : p
        )
      );
    } finally {
      setConnecting(null);
    }
  };

  const handleDisconnect = async (id: PlatformId) => {
    setConnecting(id);
    try {
      await new Promise((r) => setTimeout(r, 400));
      setPlatforms((prev) =>
        prev.map((p) => (p.id === id ? { ...p, connected: false, accountLabel: undefined } : p))
      );
    } finally {
      setConnecting(null);
    }
  };

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
              <h1 className="text-3xl font-bold text-foreground tracking-tight">Links</h1>
              <p className="text-muted-foreground mt-0.5">
                Connect your accounts from supported platforms.
              </p>
            </div>
            <Badge variant="outline" className="ml-auto gap-1 border-primary/40 text-primary">
              <Sparkles className="w-3.5 h-3.5" />
              Tournaments & validation
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
                          {p.description}
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
                            {connecting === p.id ? "…" : "Disconnect"}
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
                                Connecting…
                              </>
                            ) : (
                              <>
                                <ExternalLink className="w-4 h-4" />
                                Connect
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

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-10 text-sm text-muted-foreground max-w-2xl"
        >
          More platforms will be added as we expand. Linked accounts are used only for tournament
          registration and match validation.
        </motion.p>
      </div>
    </ProtectedRoute>
  );
}
