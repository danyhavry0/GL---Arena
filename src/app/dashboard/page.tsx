"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, User, BarChart3, Link2, Users, Gamepad2, Zap, Swords, Sparkles, Target, Flame, Calendar, Euro } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { fetchTournaments } from "@/lib/data";
import type { Tournament } from "@/lib/data";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import BannerCarousel from "@/components/BannerCarousel";
import { useTranslation } from "@/contexts/LocaleContext";

// Animation variants for staggered children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function DashboardPage() {
  const { t } = useTranslation();
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setUser(session.user);

        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (!error && data) {
          setUserData(data);
        }
      }

      const tours = await fetchTournaments(6);
      setTournaments(tours);
      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="w-full px-4 py-8 sm:px-6 lg:px-8 min-h-[60vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="relative mb-6">
            <div className="h-14 w-14 mx-auto rounded-full border-4 border-primary/30 border-t-primary animate-spin shadow-[0_0_20px_hsl(var(--primary)/0.5)]" />
            <div className="absolute inset-0 h-14 w-14 mx-auto rounded-full border-4 border-transparent border-r-accent/60 animate-spin shadow-[0_0_15px_hsl(var(--accent)/0.4)]" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
          </div>
          <p className="text-base text-primary animate-pulse font-medium">
            {t("common.loading")}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8 min-h-screen relative overflow-hidden">
      {/* Animated Background Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary/8 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative z-10">
        {/* Hero Banner - Gaming Style */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="relative">
            <BannerCarousel
              images={[
                { src: "/images/banner3.png", alt: "GL-Arena Banner" },
              ]}
              autoPlay={false}
            />
            
            {/* Hero Overlay Content - Positioned bottom-left for gaming feel */}
            <div className="absolute inset-0 flex items-end justify-start z-20 p-8 md:p-12 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="max-w-lg"
              >
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-cyan-500/20 border border-cyan-500/50 backdrop-blur-sm"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">Live Event</span>
                </motion.div>

                {/* Title with cyber style */}
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="text-2xl md:text-3xl lg:text-4xl font-black mb-2 text-white"
                  style={{
                    textShadow: "0 0 20px hsl(190, 95%, 55%, 0.6), 0 0 40px hsl(190, 95%, 55%, 0.3), 0 2px 4px rgba(0,0,0,0.8)"
                  }}
                >
                  {t("dashboard.bannerTitle")}
                </motion.h2>

                {/* Subtitle */}
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="text-base md:text-lg font-semibold text-white mb-6"
                  style={{
                    textShadow: "0 2px 8px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.5)"
                  }}
                >
                  {t("dashboard.bannerSubtitle")}
                </motion.p>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 }}
                  className="pointer-events-auto"
                >
                  <Button
                    onClick={() => console.log("Reserve clicked")}
                    className="relative overflow-hidden bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-400 hover:to-violet-400 text-white font-bold uppercase tracking-wider px-6 py-3 rounded-lg border border-cyan-400/50 shadow-[0_0_20px_hsl(190,95%,55%,0.4)] hover:shadow-[0_0_30px_hsl(190,95%,55%,0.6)] transition-all group"
                  >
                    <Zap className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                    {t("dashboard.reserveTicket")}
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  </Button>
                </motion.div>
              </motion.div>
            </div>

            {/* Decorative elements on the right */}
            <div className="absolute top-8 right-8 z-20 hidden md:flex flex-col items-end gap-2 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card/60 backdrop-blur-sm border border-violet-500/40"
              >
                <Trophy className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-semibold text-violet-200">Season 2026</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card/60 backdrop-blur-sm border border-pink-500/40"
              >
                <Users className="w-4 h-4 text-pink-400" />
                <span className="text-xs font-semibold text-pink-200">128 Teams</span>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Tournaments Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-10"
        >
          <div className="relative rounded-2xl overflow-hidden">
            {/* Gradient border effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent p-[1px] rounded-2xl">
              <div className="absolute inset-[1px] bg-card rounded-2xl" />
            </div>
            
            <Card variant="gaming-glow" className="relative bg-gradient-to-br from-card via-card to-primary/5 border-0">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="p-4 rounded-2xl bg-gradient-to-br from-primary/30 to-secondary/20 border border-primary/40 shadow-lg shadow-primary/30"
                    >
                      <Trophy className="w-8 h-8 text-primary drop-shadow-[0_0_8px_hsl(var(--primary))]" />
                    </motion.div>
                <div>
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-2xl font-black text-cyan-400 drop-shadow-[0_0_10px_hsl(190,95%,55%,0.5)]">
                      {t("dashboard.tournaments")}
                    </CardTitle>
                    <Badge variant="neon-primary" className="text-[10px]">
                      <Swords className="w-3 h-3 mr-1" />
                      ESPORTS
                    </Badge>
                  </div>
                  <CardDescription className="text-base mt-1 text-cyan-200/60">
                    {t("dashboard.tournamentsDescription")}
                  </CardDescription>
                </div>
                  </div>
                  <Link href="/dashboard/tournaments">
                    <Button variant="neon-secondary" size="sm">
                      <Target className="w-4 h-4 mr-1" />
                      {t("common.viewAll")}
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {tournaments.length > 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                  >
                    {tournaments.map((tournament, i) => (
                      <motion.div
                        key={tournament.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * i }}
                      >
                        <Link href={`/dashboard/tournaments?t=${tournament.id}`}>
                          <div className="group p-4 rounded-xl bg-gradient-to-br from-primary/10 via-transparent to-accent/5 border border-primary/20 hover:border-primary/50 hover:bg-primary/15 transition-all cursor-pointer">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-bold text-cyan-300 group-hover:text-cyan-200 transition-colors line-clamp-1">
                                {tournament.name}
                              </h3>
                              <Badge
                                className={`text-[10px] shrink-0 ${
                                  tournament.status === "completed"
                                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                                    : tournament.status === "in_progress"
                                    ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                                    : tournament.status === "open_registration"
                                    ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/40"
                                    : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {tournament.status.replace("_", " ")}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                              {tournament.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-cyan-300/80">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                {tournament.start_date
                                  ? new Date(tournament.start_date).toLocaleDateString()
                                  : "-"}
                              </span>
                              <span className="flex items-center gap-1">
                                <Trophy className="w-3.5 h-3.5" />
                                {(tournament.teams_count ?? 0)}/{tournament.max_teams} teams
                              </span>
                              {tournament.prize_pool && (
                                <span className="flex items-center gap-1">
                                  <Euro className="w-3.5 h-3.5" />
                                  €{tournament.prize_pool}
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-center py-16 relative"
                  >
                    <div className="absolute inset-0">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-primary/20 via-secondary/10 to-accent/20 rounded-full blur-3xl" />
                    </div>
                    <motion.div
                      animate={{
                        y: [0, -10, 0],
                        filter: [
                          "drop-shadow(0 0 20px hsl(var(--primary)/0.3))",
                          "drop-shadow(0 0 40px hsl(var(--primary)/0.5))",
                          "drop-shadow(0 0 20px hsl(var(--primary)/0.3))",
                        ],
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="relative"
                    >
                      <Trophy className="w-24 h-24 text-primary/50 mx-auto mb-6" />
                    </motion.div>
                    <p className="text-foreground/80 text-lg font-semibold">
                      {t("dashboard.noTournaments")}
                    </p>
                    <p className="text-muted-foreground text-sm mt-2">
                      {t("dashboard.newTournamentsHere")}
                    </p>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Quick Actions Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {/* Profile Card */}
          <motion.div variants={itemVariants}>
            <Link href="/dashboard/profile">
              <div className="group h-full relative rounded-xl overflow-hidden">
                {/* Animated gradient border */}
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
                <div className="absolute inset-[2px] bg-card rounded-xl" />
                
                <Card variant="interactive" className="h-full relative bg-gradient-to-br from-violet-500/10 via-transparent to-purple-500/10 border-violet-500/30 group-hover:border-violet-500/60 transition-all">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-3">
                      <motion.div 
                        whileHover={{ scale: 1.1, rotate: -5 }}
                        className="p-3 rounded-xl bg-gradient-to-br from-violet-500/30 to-purple-500/20 border border-violet-500/40 shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-shadow"
                      >
                        <User className="w-6 h-6 text-violet-400 drop-shadow-[0_0_6px_hsl(270,70%,60%)]" />
                      </motion.div>
                      <CardTitle className="text-lg font-bold text-violet-300 group-hover:text-violet-200 transition-colors">
                        {t("dashboard.profile")}
                      </CardTitle>
                    </div>
                    <CardDescription className="text-sm text-violet-300/70">
                      {t("dashboard.profileDescription")}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </Link>
          </motion.div>

          {/* Game Links Card */}
          <motion.div variants={itemVariants}>
            <Link href="/dashboard/links">
              <div className="group h-full relative rounded-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
                <div className="absolute inset-[2px] bg-card rounded-xl" />
                
                <Card variant="interactive" className="h-full relative bg-gradient-to-br from-pink-500/10 via-transparent to-rose-500/10 border-pink-500/30 group-hover:border-pink-500/60 transition-all">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-3">
                      <motion.div 
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="p-3 rounded-xl bg-gradient-to-br from-pink-500/30 to-rose-500/20 border border-pink-500/40 shadow-lg shadow-pink-500/20 group-hover:shadow-pink-500/40 transition-shadow"
                      >
                        <Gamepad2 className="w-6 h-6 text-pink-400 drop-shadow-[0_0_6px_hsl(330,80%,60%)]" />
                      </motion.div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg font-bold text-pink-300 group-hover:text-pink-200 transition-colors">
                          {t("dashboard.gameLinks")}
                        </CardTitle>
                        <Badge className="text-[9px] bg-red-500/20 text-red-400 border-red-500/50">
                          <Flame className="w-3 h-3 mr-0.5" />
                          RIOT
                        </Badge>
                      </div>
                    </div>
                    <CardDescription className="text-sm text-pink-300/70">
                      {t("dashboard.gameLinksDescription")}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </Link>
          </motion.div>

          {/* Teams Card - Info card pointing to sidebar */}
          <motion.div variants={itemVariants}>
            <div className="group h-full relative rounded-xl overflow-hidden">
              {/* Animated gradient border */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 opacity-50 rounded-xl" />
              <div className="absolute inset-[2px] bg-card rounded-xl" />
              
              <Card className="h-full relative bg-gradient-to-br from-cyan-500/10 via-transparent to-teal-500/10 border-cyan-500/30">
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <Badge className="text-[9px] bg-emerald-500/20 text-emerald-400 border-emerald-500/40 animate-pulse">
                    <Sparkles className="w-3 h-3 mr-0.5" />
                    ACTIVE
                  </Badge>
                </div>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <motion.div 
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/30 to-teal-500/20 border border-cyan-500/40 shadow-lg shadow-cyan-500/20"
                    >
                      <Users className="w-6 h-6 text-cyan-400 drop-shadow-[0_0_6px_hsl(190,95%,55%)]" />
                    </motion.div>
                    <CardTitle className="text-lg font-bold text-cyan-300">
                      {t("dashboard.teams")}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-sm text-cyan-300/70">
                    Use the Team Manager panel on the right →
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </motion.div>

          {/* Statistics Card */}
          <motion.div variants={itemVariants}>
            <div className="group h-full relative rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 opacity-30 rounded-xl" />
              <div className="absolute inset-[2px] bg-card rounded-xl" />
              
              <Card className="h-full relative bg-gradient-to-br from-amber-500/10 via-transparent to-orange-500/10 border-amber-500/20 opacity-80">
                <div className="absolute top-3 right-3">
                  <Badge className="text-[9px] bg-amber-500/20 text-amber-400 border-amber-500/40">
                    <Sparkles className="w-3 h-3 mr-0.5" />
                    {t("common.comingSoon")}
                  </Badge>
                </div>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/30">
                      <BarChart3 className="w-6 h-6 text-amber-400/60" />
                    </div>
                    <CardTitle className="text-lg font-bold text-amber-300/80">
                      {t("dashboard.statistics")}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-sm text-amber-300/50">
                    {t("dashboard.statisticsDescription")}
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
