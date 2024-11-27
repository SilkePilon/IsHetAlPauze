import { createServerSupabaseClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient();

  try {
    const { email, password } = await request.json();

    // Input validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Authenticate with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    // Return user data
    return NextResponse.json({
      id: data.user?.id,
      email: data.user?.email,
      name: data.user?.user_metadata?.name,
      role: data.user?.user_metadata?.role,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
