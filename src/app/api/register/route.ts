import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, password, username, full_name, avatar_url } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e password sono obbligatorie" },
        { status: 400 }
      );
    }

    // 1) Crea l'utente in Supabase Auth (gestisce lui hash e sessioni)
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
      {
        email,
        password,
      }
    );

    if (signUpError || !signUpData.user) {
      return NextResponse.json(
        { error: signUpError?.message ?? "Registrazione fallita" },
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
        email,
        username: username ?? null,
        full_name: full_name ?? null,
        avatar_url: avatar_url ?? null,
        password_hash: passwordHash, // qui salviamo già l'hash, NON la password in chiaro
      });

    if (insertError) {
      return NextResponse.json(
        {
          error: "Utente creato in Auth ma non in public.users",
          details: insertError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Registrazione completata", userId: authUser.id },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Errore imprevisto durante la registrazione" },
      { status: 500 }
    );
  }
}

