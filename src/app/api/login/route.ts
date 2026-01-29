import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { normalizeEmail } from "@/lib/utils";

function isEmail(value: string): boolean {
  return typeof value === "string" && value.includes("@");
}

export async function POST(req: NextRequest) {
  try {
    const { login, password } = await req.json();

    if (!login || !password) {
      return NextResponse.json(
        { error: "Email or username and password are required" },
        { status: 400 }
      );
    }

    const loginTrimmed = String(login).trim();
    let email: string;

    if (isEmail(loginTrimmed)) {
      email = normalizeEmail(loginTrimmed);
    } else {
      // Username: resolve to email via public.users (case-insensitive)
      const { data: userRow, error: lookupError } = await supabase
        .from("users")
        .select("email")
        .ilike("username", loginTrimmed)
        .limit(1)
        .maybeSingle();

      if (lookupError || !userRow?.email) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }
      email = normalizeEmail(userRow.email);
    }

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !data.session) {
      const msg = signInError?.message ?? "";
      const emailNotConfirmed =
        (msg.includes("email") && msg.includes("confirm")) || !data.session;
      const body: { error: string; emailNotConfirmed?: boolean; email?: string } = {
        error: emailNotConfirmed
          ? "Please verify your email address before signing in. Check your inbox for the confirmation email."
          : "Invalid email or password",
        emailNotConfirmed: !!emailNotConfirmed,
      };
      if (emailNotConfirmed) body.email = email;
      return NextResponse.json(body, { status: 401 });
    }

    return NextResponse.json(
      {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      },
      { status: 200 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Unexpected error during login" },
      { status: 500 }
    );
  }
}
