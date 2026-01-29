import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { normalizeEmail } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const emailNormalized = normalizeEmail(email);

    // Resend confirmation email
    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email: emailNormalized,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
      },
    });

    if (resendError) {
      return NextResponse.json(
        { error: resendError.message ?? "Failed to resend confirmation email" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Confirmation email sent. Please check your inbox." },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unexpected error while resending confirmation email" },
      { status: 500 }
    );
  }
}
