import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : null;

  if (!token) {
    return NextResponse.json(
      { error: "Missing Authorization header with Bearer token" },
      { status: 401 }
    );
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data?.user) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }

  return NextResponse.json({ user: data.user });
}

