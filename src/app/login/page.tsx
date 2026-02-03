"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Trophy, Swords, Shield, Zap, Mail, Lock, User, Image } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { normalizeEmail } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/contexts/LocaleContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

// Gaming-style input component with colorful effects
const GamingInput = ({
  icon: Icon,
  ...props
}: {
  icon?: React.ElementType;
} & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="relative group">
    {Icon && (
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500/60 group-focus-within:text-cyan-400 transition-colors">
        <Icon className="w-4 h-4" />
      </div>
    )}
    <input
      {...props}
      className={`
        w-full rounded-lg border-2 border-violet-500/30 bg-violet-500/5 backdrop-blur-sm
        px-3 py-2.5 text-sm text-foreground
        placeholder:text-violet-300/40
        outline-none transition-all duration-300
        focus:border-cyan-400 focus:bg-cyan-500/5
        focus:shadow-[0_0_0_3px_hsl(190,95%,55%,0.15),0_0_25px_hsl(190,95%,55%,0.15)]
        hover:border-violet-400/50 hover:bg-violet-500/10
        ${Icon ? "pl-10" : ""}
        ${props.className ?? ""}
      `}
    />
    {/* Glow effect on focus */}
    <div className="absolute inset-0 rounded-lg opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none">
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/10 via-transparent to-violet-500/10" />
    </div>
  </div>
);

export default function LoginPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  // Registration fields
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerFullName, setRegisterFullName] = useState("");
  const [registerAvatarUrl, setRegisterAvatarUrl] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [resendingEmail, setResendingEmail] = useState(false);
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
        headers: { "Content-Type": "application/json" },
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

      if (body.requiresEmailConfirmation) {
        setSuccess("login.successConfirmEmail");
      } else {
        setSuccess("login.successRegistered");
      }
      
      setRegisterUsername("");
      setRegisterFullName("");
      setRegisterAvatarUrl("");
      setRegisterEmail("");
      setRegisterPassword("");
    } catch (e) {
      console.error(e);
      setError("Unexpected error during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gaming-radial font-sans relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating colorful orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, 80, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -60, 0],
            y: [0, -40, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/3 left-1/3 w-72 h-72 bg-gradient-to-r from-emerald-500/15 to-teal-500/15 rounded-full blur-3xl"
        />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 cyber-lines opacity-20" />
      </div>

      {/* Language Switcher */}
      <div className="absolute top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>

      <motion.main
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex w-full max-w-md flex-col gap-6 px-4 relative z-10"
      >
        <Card variant="gaming-neon" className="overflow-hidden relative">
          {/* Gradient border glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 opacity-20 blur-xl" />
          {/* Top accent line */}
          <div className="h-1.5 bg-gradient-to-r from-cyan-400 via-violet-500 to-pink-500" />
          
          <CardHeader className="text-center space-y-4 pt-8 relative">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="flex items-center justify-center gap-3"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/30 to-violet-500/20 border border-cyan-400/40 shadow-lg shadow-cyan-500/30"
              >
                <Trophy className="w-8 h-8 text-cyan-400 drop-shadow-[0_0_10px_hsl(190,95%,55%)]" />
              </motion.div>
              <CardTitle className="text-3xl font-black tracking-tight bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
                {t("login.title")}
              </CardTitle>
            </motion.div>
            <CardDescription className="text-base text-foreground/70">
              {t("login.subtitle")}
            </CardDescription>
            <div className="flex items-center justify-center gap-2">
              <Badge className="text-[10px] bg-cyan-500/20 text-cyan-400 border-cyan-500/50 shadow-[0_0_10px_hsl(190,95%,55%,0.3)]">
                <Swords className="w-3 h-3 mr-1" />
                ESPORTS
              </Badge>
              <Badge className="text-[10px] bg-violet-500/20 text-violet-400 border-violet-500/50 shadow-[0_0_10px_hsl(270,70%,60%,0.3)]">
                <Shield className="w-3 h-3 mr-1" />
                SECURE
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-5 pb-8">
            <div className="space-y-4">
              <label className="flex flex-col gap-2 text-sm font-semibold text-foreground">
                {t("login.emailOrUsername")}
                <GamingInput
                  icon={Mail}
                  type="text"
                  autoComplete="username"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  placeholder={t("login.emailOrUsernamePlaceholder")}
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-semibold text-foreground">
                {t("login.password")}
                <GamingInput
                  icon={Lock}
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("login.passwordPlaceholder")}
                />
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg bg-destructive/10 border border-destructive/30 p-4 shadow-lg shadow-destructive/10"
              >
                <p className="text-sm text-destructive font-medium">{error}</p>
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
                      className="mt-2 text-sm text-primary hover:underline disabled:opacity-50 font-semibold"
                    >
                      {resendingEmail ? t("common.sending") : t("common.resendConfirmation")}
                    </button>
                  ) : null;
                })()}
              </motion.div>
            )}

            {/* Success Message */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg bg-success/10 border border-success/30 p-4 shadow-lg shadow-success/10"
              >
                <p className="text-sm text-success font-medium">{t(success)}</p>
              </motion.div>
            )}

            <div className="space-y-3 pt-2">
              <Button
                type="button"
                onClick={handleLogin}
                disabled={loading}
                className="w-full group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-bold uppercase tracking-wider shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-violet-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
                size="lg"
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    {t("common.signingIn")}
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 group-hover:animate-pulse text-yellow-300" />
                    {t("common.signIn")}
                  </>
                )}
              </Button>

              <Button
                type="button"
                onClick={() => setShowRegisterForm((prev) => !prev)}
                className="w-full border-2 border-violet-500/50 bg-violet-500/10 text-violet-300 font-semibold hover:bg-violet-500/20 hover:border-violet-400 hover:text-violet-200 transition-all"
              >
                {showRegisterForm ? t("common.hideRegistration") : t("common.createAccount")}
              </Button>
            </div>

            {/* Registration Form */}
            {showRegisterForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-4 border-t-2 border-border/50 pt-6 mt-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent to-primary/30" />
                  <h2 className="text-lg font-bold text-foreground px-2">
                    {t("login.newAccountRegistration")}
                  </h2>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent to-primary/30" />
                </div>

                <label className="flex flex-col gap-2 text-sm font-semibold">
                  {t("login.username")}
                  <GamingInput
                    icon={User}
                    type="text"
                    value={registerUsername}
                    onChange={(e) => setRegisterUsername(e.target.value)}
                    placeholder={t("login.usernamePlaceholder")}
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm font-semibold">
                  {t("login.fullName")}
                  <GamingInput
                    type="text"
                    value={registerFullName}
                    onChange={(e) => setRegisterFullName(e.target.value)}
                    placeholder={t("login.fullNamePlaceholder")}
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm font-semibold">
                  {t("login.avatarUrl")}
                  <GamingInput
                    icon={Image}
                    type="url"
                    value={registerAvatarUrl}
                    onChange={(e) => setRegisterAvatarUrl(e.target.value)}
                    placeholder={t("login.avatarUrlPlaceholder")}
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm font-semibold">
                  {t("login.email")}
                  <GamingInput
                    icon={Mail}
                    type="email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    placeholder={t("login.emailPlaceholder")}
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm font-semibold">
                  {t("login.password")}
                  <GamingInput
                    icon={Lock}
                    type="password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    placeholder={t("login.passwordPlaceholder")}
                  />
                </label>

                <Button
                  type="button"
                  onClick={handleRegister}
                  disabled={loading}
                  className="w-full mt-2 relative overflow-hidden bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold uppercase tracking-wider shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-rose-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      {t("common.submitting")}
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5 text-white" />
                      {t("common.confirmRegistration")}
                    </>
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
