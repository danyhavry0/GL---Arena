"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  // Campi registrazione
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerFullName, setRegisterFullName] = useState("");
  const [registerAvatarUrl, setRegisterAvatarUrl] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // 1) Login -> Supabase crea una sessione con JWT (access_token)
      const { data, error: signInError } = await supabase.auth.signInWithPassword(
        {
          email,
          password,
        }
      );

      if (signInError || !data.session) {
        setError(signInError?.message ?? "Login fallito");
        return;
      }

      const accessToken = data.session.access_token;
      console.log("JWT access_token:", accessToken);

      // 2) Chiamata alla nostra API /api/current-user passando il JWT
      const res = await fetch("/api/current-user", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        console.error("Errore API current-user:", body ?? res.statusText);
        setError("Errore nel recupero dell'utente corrente");
        return;
      }

      const body = await res.json();
      console.log("Utente corrente:", body.user);
      
      // Redirect alla dashboard dopo login riuscito
      router.push("/dashboard");
    } catch (e) {
      console.error(e);
      setError("Errore imprevisto durante il login");
    } finally {
      setLoading(false);
    }
  };

  // Verifica se l'utente è già autenticato
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      
      if (session) {
        router.push("/dashboard");
      }
    };
    
    checkSession();
  }, [router]);

  const handleRegister = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: registerUsername,
          full_name: registerFullName,
          avatar_url: registerAvatarUrl,
          email: registerEmail,
          password: registerPassword,
        }),
      });

      const body = await res.json().catch(() => null);

      if (!res.ok) {
        setError(body?.error ?? "Registrazione fallita");
        return;
      }

      setSuccess("Registrazione completata. Ora puoi effettuare il login.");
      setRegisterUsername("");
      setRegisterFullName("");
      setRegisterAvatarUrl("");
      setRegisterEmail("");
      setRegisterPassword("");
      console.log("Registrazione completata:", body);
    } catch (e) {
      console.error(e);
      setError("Errore imprevisto durante la registrazione");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background font-sans">
      <motion.main
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex w-full max-w-md flex-col gap-6"
      >
        <Card className="border-primary/50 shadow-xl">
          <CardHeader className="text-center space-y-3">
            <div className="flex items-center justify-center gap-3">
              <Trophy className="w-7 h-7 text-primary" />
              <CardTitle className="text-2xl font-semibold tracking-tight">GL-Arena</CardTitle>
            </div>
            <CardDescription>
              Accedi alla piattaforma competitiva per tornei esports
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">

            <label className="flex flex-col gap-1 text-sm font-medium">
              Email
              <input
                type="email"
                className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm font-medium">
              Password
              <input
                type="password"
                className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </label>

            {error && (
              <div className="rounded-md bg-destructive/10 border border-destructive/50 p-3">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
            {success && (
              <div className="rounded-md bg-success/10 border border-success/50 p-3">
                <p className="text-sm text-success">{success}</p>
              </div>
            )}

            <Button
              type="button"
              onClick={handleLogin}
              disabled={loading}
              variant="gaming"
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                  Accesso in corso...
                </>
              ) : (
                "Accedi"
              )}
            </Button>

            <Button
              type="button"
              onClick={() => setShowRegisterForm((prev) => !prev)}
              variant="outline"
              className="w-full"
            >
              {showRegisterForm ? "Nascondi registrazione" : "Crea nuovo account"}
            </Button>

            {showRegisterForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-col gap-4 border-t border-border pt-4 mt-4"
              >
                <h2 className="text-lg font-semibold text-foreground">
                  Registrazione nuovo account
                </h2>

                <label className="flex flex-col gap-1 text-sm font-medium">
                  Username
                  <input
                    type="text"
                    className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    value={registerUsername}
                    onChange={(e) => setRegisterUsername(e.target.value)}
                    placeholder="username"
                  />
                </label>

                <label className="flex flex-col gap-1 text-sm font-medium">
                  Full name
                  <input
                    type="text"
                    className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    value={registerFullName}
                    onChange={(e) => setRegisterFullName(e.target.value)}
                    placeholder="Nome cognome"
                  />
                </label>

                <label className="flex flex-col gap-1 text-sm font-medium">
                  Avatar URL
                  <input
                    type="url"
                    className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    value={registerAvatarUrl}
                    onChange={(e) => setRegisterAvatarUrl(e.target.value)}
                    placeholder="https://example.com/avatar.png"
                  />
                </label>

                <label className="flex flex-col gap-1 text-sm font-medium">
                  Email
                  <input
                    type="email"
                    className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </label>

                <label className="flex flex-col gap-1 text-sm font-medium">
                  Password
                  <input
                    type="password"
                    className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </label>

                <Button
                  type="button"
                  onClick={handleRegister}
                  disabled={loading}
                  variant="gaming"
                  className="w-full"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      Invio dati...
                    </>
                  ) : (
                    "Conferma registrazione"
                  )}
                </Button>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.main>
    </div>
  );
}
