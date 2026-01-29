"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { normalizeEmail } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [login, setLogin] = useState("");
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
  const [resendingEmail, setResendingEmail] = useState(false);
  /** Email da usare per "Resend confirmation", quando login con username e email non confermata. */
  const [emailForResend, setEmailForResend] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    setEmailForResend(null);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login: login.trim(), password }),
      });

      const body = await res.json().catch(() => null);

      if (!res.ok) {
        setError(body?.error ?? "Login failed");
        if (body?.emailNotConfirmed && body?.email) setEmailForResend(body.email);
        return;
      }

      const { access_token, refresh_token } = body;
      const { error: sessionError } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });

      if (sessionError) {
        setError("Session error. Please try again.");
        return;
      }

      router.push("/dashboard");
    } catch (e) {
      console.error(e);
      setError("Unexpected error during login");
    } finally {
      setLoading(false);
    }
  };

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
        setError(body?.error ?? "Registration failed");
        return;
      }

      // Mostra messaggio appropriato in base allo stato della conferma email
      if (body.requiresEmailConfirmation) {
        setSuccess("Registration successful! Please check your email to confirm your account before signing in.");
      } else {
        setSuccess("Registration completed. You can now sign in.");
      }
      
      setRegisterUsername("");
      setRegisterFullName("");
      setRegisterAvatarUrl("");
      setRegisterEmail("");
      setRegisterPassword("");
      console.log("Registrazione completata:", body);
    } catch (e) {
      console.error(e);
      setError("Unexpected error during registration");
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
              Sign in to the competitive platform for esports tournaments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">

            <label className="flex flex-col gap-1 text-sm font-medium">
              Email or username
              <input
                type="text"
                autoComplete="username"
                className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="you@example.com or username"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm font-medium">
              Password
              <input
                type="password"
                autoComplete="current-password"
                className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </label>

            {error && (
              <div className="rounded-md bg-destructive/10 border border-destructive/50 p-3">
                <p className="text-sm text-destructive">{error}</p>
                {error.includes("verify your email") && (() => {
                  const emailToResend = emailForResend ?? (login.includes("@") ? normalizeEmail(login) : null);
                  return emailToResend ? (
                    <button
                      onClick={async () => {
                        setResendingEmail(true);
                        try {
                          const res = await fetch("/api/resend-confirmation", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ email: emailToResend }),
                          });
                          const data = await res.json();
                          if (res.ok) {
                            setSuccess(data.message);
                            setError(null);
                          } else {
                            setError(data.error ?? "Failed to resend confirmation email");
                          }
                        } catch (e) {
                          setError("Failed to resend confirmation email");
                        } finally {
                          setResendingEmail(false);
                        }
                      }}
                      disabled={resendingEmail}
                      className="mt-2 text-sm text-primary hover:underline disabled:opacity-50"
                    >
                      {resendingEmail ? "Sending..." : "Resend confirmation email"}
                    </button>
                  ) : null;
                })()}
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
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            <Button
              type="button"
              onClick={() => setShowRegisterForm((prev) => !prev)}
              variant="outline"
              className="w-full"
            >
              {showRegisterForm ? "Hide registration" : "Create new account"}
            </Button>

            {showRegisterForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-col gap-4 border-t border-border pt-4 mt-4"
              >
                <h2 className="text-lg font-semibold text-foreground">
                  New Account Registration
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
                    placeholder="Full name"
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
                      Submitting...
                    </>
                  ) : (
                    "Confirm Registration"
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
