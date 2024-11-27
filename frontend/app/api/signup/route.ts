import { createServerSupabaseClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient();

  try {
    const { name, email, password, role = "user" } = await request.json();

    // Input validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into custom users table
    const { data, error } = await supabase
      .from("users")
      .insert({
        email,
        password: hashedPassword,
        name,
        role,
      })
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }

    // Return user data (excluding password)
    const { ...userWithoutPassword } = data[0];
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
