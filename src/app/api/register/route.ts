import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { normalizeEmail } from "@/lib/utils";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, password, username, full_name, avatar_url } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const emailNormalized = normalizeEmail(email);
    const usernameTrimmed = typeof username === "string" ? username.trim() : "";

    // 0) Username univoco: se fornito, verifica che non esista già (case-insensitive)
    if (usernameTrimmed) {
      const { data: existing } = await supabase
        .from("users")
        .select("id")
        .ilike("username", usernameTrimmed)
        .limit(1)
        .maybeSingle();

      if (existing) {
        return NextResponse.json(
          { error: "Username already taken" },
          { status: 400 }
        );
      }
    }

    // 1) Crea l'utente in Supabase Auth (gestisce lui hash e sessioni)
    // Con email confirmation abilitata, signUp() invia automaticamente l'email di conferma
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
      {
        email: emailNormalized,
        password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
        },
      }
    );

    if (signUpError || !signUpData.user) {
      return NextResponse.json(
        { error: signUpError?.message ?? "Registration failed" },
        { status: 400 }
      );
    }

    const authUser = signUpData.user;

    // 2) Calcola l'hash della password per la tabella public.users
    const passwordHash = await bcrypt.hash(password, 10);

    const { error: insertError } = await supabase
      .from("users")
      .insert({
        id: authUser.id, // usa lo stesso id di auth.users
        email: emailNormalized,
        username: usernameTrimmed || null,
        full_name: full_name ?? null,
        avatar_url: avatar_url ?? null,
        password_hash: passwordHash, // qui salviamo già l'hash, NON la password in chiaro
      });

    if (insertError) {
      return NextResponse.json(
        {
          error: "User created in Auth but not in public.users",
          details: insertError.message,
        },
        { status: 500 }
      );
    }

    // 3) Controlla se l'email è stata confermata
    // Se email confirmation è abilitata, session sarà null fino a conferma
    const emailConfirmed = signUpData.session !== null;
    const requiresEmailConfirmation = !emailConfirmed;

    return NextResponse.json(
      { 
        message: requiresEmailConfirmation 
          ? "Registration successful. Please check your email to confirm your account before signing in."
          : "Registration completed",
        userId: authUser.id,
        emailConfirmed,
        requiresEmailConfirmation,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unexpected error during registration" },
      { status: 500 }
    );
  }
}

