import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Database } from "@/types/supabase";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req, res });

  // Optional: Check authentication for protected routes
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Redirect logic based on authentication status
  if (req.nextUrl.pathname.startsWith("/dashboard") && !session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};
