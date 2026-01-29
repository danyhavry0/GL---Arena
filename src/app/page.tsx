"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
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
    } catch (e) {
      console.error(e);
      setError("Errore imprevisto durante il login");
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
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-md flex-col gap-6 rounded-xl bg-white p-8 shadow-lg dark:bg-zinc-900">
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
          Login Supabase (JWT)
        </h1>

        <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
          Email
          <input
            type="email"
            className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-black outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
          Password
          <input
            type="password"
            className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-black outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </label>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
        {success && (
          <p className="text-sm text-emerald-600 dark:text-emerald-400">
            {success}
          </p>
        )}

        <button
          type="button"
          onClick={handleLogin}
          disabled={loading}
          className="mt-2 h-11 rounded-md bg-black text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400 dark:bg-zinc-100 dark:text-black dark:hover:bg-white"
        >
          {loading ? "Accesso in corso..." : "Accedi"}
        </button>

        <button
          type="button"
          onClick={() => setShowRegisterForm((prev) => !prev)}
          className="h-11 text-sm font-medium text-zinc-700 underline-offset-4 hover:underline dark:text-zinc-300"
        >
          {showRegisterForm ? "Nascondi registrazione" : "Crea nuovo account"}
        </button>

        {showRegisterForm && (
          <section className="mt-4 flex flex-col gap-4 border-t border-zinc-200 pt-4 dark:border-zinc-800">
            <h2 className="text-lg font-semibold text-black dark:text-zinc-50">
              Registrazione nuovo account
            </h2>

            <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
              Username
              <input
                type="text"
                className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-black outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                value={registerUsername}
                onChange={(e) => setRegisterUsername(e.target.value)}
                placeholder="username"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
              Full name
              <input
                type="text"
                className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-black outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                value={registerFullName}
                onChange={(e) => setRegisterFullName(e.target.value)}
                placeholder="Nome cognome"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
              Avatar URL
              <input
                type="url"
                className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-black outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                value={registerAvatarUrl}
                onChange={(e) => setRegisterAvatarUrl(e.target.value)}
                placeholder="https://example.com/avatar.png"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
              Email
              <input
                type="email"
                className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-black outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
              Password
              <input
                type="password"
                className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-black outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                placeholder="••••••••"
              />
            </label>

            <button
              type="button"
              onClick={handleRegister}
              disabled={loading}
              className="mt-2 h-11 rounded-md bg-black text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400 dark:bg-zinc-100 dark:text-black dark:hover:bg-white"
            >
              {loading ? "Invio dati..." : "Conferma registrazione"}
            </button>
          </section>
        )}

        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Dopo il login vedrai il JWT e l&apos;utente corrente in{" "}
          <code>console.log</code> (DevTools del browser).
        </p>
      </main>
    </div>
  );
}
