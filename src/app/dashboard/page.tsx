"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, User, BarChart3 } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
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
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="text-sm text-muted-foreground">
            Caricamento...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="mb-2">
          <h1 className="text-3xl font-bold text-foreground tracking-tight mb-4">
            Dashboard
          </h1>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative w-full h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden"
        >
          <Image
            src="/banner.jpg"
            alt="GL-Arena Banner"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
          />
          {/* Fade effect sui lati */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
          {/* Fade effect in alto e basso (opzionale, più leggero) */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-background/40" />
          
          {/* Testo overlay */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-center px-4"
            >
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2 drop-shadow-lg">
                La battaglia sta iniziando
              </h2>
              <p className="text-lg md:text-xl lg:text-2xl text-foreground/90 font-medium drop-shadow-md mb-6">
                Prenota il tuo posto
              </p>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Button
                  size="lg"
                  variant="gaming"
                  className="px-10 py-3 text-base md:text-lg font-semibold shadow-md"
                  onClick={() => {
                    // TODO: Implementare prenotazione ticket
                    console.log("Prenota ticket clicked");
                  }}
                >
                  Prenota Ticket
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* User Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8"
      >
        <Card className="border-border hover:border-primary/40 transition-colors metallic-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium">
              <User className="w-5 h-5 text-primary" />
              Informazioni Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <span className="text-sm font-medium text-muted-foreground">
                  Email:
                </span>
                <p className="text-sm font-semibold text-foreground mt-1">
                  {user?.email}
                </p>
              </div>
              {userData?.username && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">
                    Username:
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm font-semibold text-foreground">
                      {userData.username}
                    </p>
                    <Badge variant="secondary">Player</Badge>
                  </div>
                </div>
              )}
              {userData?.full_name && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">
                    Nome completo:
                  </span>
                  <p className="text-sm font-semibold text-foreground mt-1">
                    {userData.full_name}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link href="/dashboard/tournaments">
            <Card className="h-full border-border hover:border-primary/40 hover:shadow-md transition-all cursor-pointer group metallic-border">
              <CardHeader>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors">
                    <Trophy className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg font-medium">Tornei</CardTitle>
                </div>
                <CardDescription className="text-sm text-muted-foreground">
                  Visualizza e partecipa ai tornei disponibili
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
                  <CardTitle className="text-lg font-medium">Profilo</CardTitle>
                </div>
                <CardDescription className="text-sm text-muted-foreground">
                  Gestisci il tuo profilo e le impostazioni
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
                <CardTitle className="text-lg font-medium text-muted-foreground">Statistiche</CardTitle>
              </div>
              <CardDescription className="text-sm text-muted-foreground">
                Le tue statistiche di gioco (presto disponibile)
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
