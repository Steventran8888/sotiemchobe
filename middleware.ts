import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const PROTECTED_PREFIXES = ["/children", "/profile"];
const AUTH_PAGES = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request);
  const path = request.nextUrl.pathname;

  if (!user && PROTECTED_PREFIXES.some((p) => path.startsWith(p))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (user && AUTH_PAGES.includes(path)) {
    return NextResponse.redirect(new URL("/children", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
