import { createServerSupabaseClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient();

  try {
    const { name, email, password, role } = await request.json();

    // Input validation
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Signup with Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role,
        },
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }

    // Return user data
    return NextResponse.json({
      id: data.user?.id,
      email: data.user?.email,
      name: data.user?.user_metadata?.name,
      role: data.user?.user_metadata?.role,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
