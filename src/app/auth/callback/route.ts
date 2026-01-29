import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req: NextRequest) {
  const requestUrl = new URL(req.url);
  const token_hash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type");
  const next = requestUrl.searchParams.get("next") || "/dashboard";

  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type: type as any,
      token_hash,
    });

    if (!error) {
      // Email confirmed successfully, redirect to dashboard
      return NextResponse.redirect(new URL(next, req.url));
    }
  }

  // If there's an error or missing params, redirect to login with error
  return NextResponse.redirect(new URL(`/login?error=email_verification_failed`, req.url));
}
