"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, User, BarChart3 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import BannerCarousel from "@/components/BannerCarousel";
import { useTranslation } from "@/contexts/LocaleContext";

export default function DashboardPage() {
  const { t } = useTranslation();
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setUser(session.user);

        // Recupera dati aggiuntivi dalla tabella users
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (!error && data) {
          setUserData(data);
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="text-sm text-muted-foreground">
            {t("common.loading")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
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
          
          {/* Testo overlay */}
          <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-center px-4"
            >
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2 drop-shadow-lg">
                {t("dashboard.bannerTitle")}
              </h2>
              <p className="text-lg md:text-xl lg:text-2xl text-foreground/90 font-medium drop-shadow-md mb-6">
                {t("dashboard.bannerSubtitle")}
              </p>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="pointer-events-auto"
              >
                <button
                  onClick={() => {
                    // TODO: Implementare prenotazione ticket
                    console.log("Prenota ticket clicked");
                  }}
                  className="px-8 py-3 text-base md:text-lg font-medium text-foreground border-2 border-primary/60 bg-background/20 backdrop-blur-sm rounded-md hover:border-primary hover:bg-primary/10 transition-all"
                >
                  {t("dashboard.reserveTicket")}
                </button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Sezione Tornei */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8"
      >
        <Card className="border-border metallic-border">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Trophy className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-semibold">{t("dashboard.tournaments")}</CardTitle>
                  <CardDescription className="text-base mt-1">
                    {t("dashboard.tournamentsDescription")}
                  </CardDescription>
                </div>
              </div>
              <Link href="/dashboard/tournaments">
                <Button variant="outline" size="sm">
                  {t("common.viewAll")}
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">
                {t("dashboard.noTournaments")}
              </p>
              <p className="text-muted-foreground/70 text-sm mt-2">
                {t("dashboard.newTournamentsHere")}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link href="/dashboard/profile">
            <Card className="h-full border-border hover:border-secondary/40 hover:shadow-md transition-all cursor-pointer group metallic-border">
              <CardHeader>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 rounded-lg bg-secondary/10 group-hover:bg-secondary/15 transition-colors">
                    <User className="w-5 h-5 text-secondary" />
                  </div>
                  <CardTitle className="text-lg font-medium">{t("dashboard.profile")}</CardTitle>
                </div>
                <CardDescription className="text-sm text-muted-foreground">
                  {t("dashboard.profileDescription")}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link href="/dashboard/profile">
            <Card className="h-full border-border hover:border-secondary/40 hover:shadow-md transition-all cursor-pointer group metallic-border">
              <CardHeader>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 rounded-lg bg-secondary/10 group-hover:bg-secondary/15 transition-colors">
                    <User className="w-5 h-5 text-secondary" />
                  </div>
                  <CardTitle className="text-lg font-medium">{t("dashboard.profile")}</CardTitle>
                </div>
                <CardDescription className="text-sm text-muted-foreground">
                  {t("dashboard.profileDescription")}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="h-full border-border opacity-60 metallic-border">
            <CardHeader>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-lg bg-muted">
                  <BarChart3 className="w-5 h-5 text-muted-foreground" />
                </div>
                <CardTitle className="text-lg font-medium text-muted-foreground">{t("dashboard.statistics")}</CardTitle>
              </div>
              <CardDescription className="text-sm text-muted-foreground">
                {t("dashboard.statisticsDescription")}
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
