import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PREFIXES = [
  "/login",
  "/register",
  "/kiosk",
  "/api/v1/auth/login",
  "/api/v1/auth/register",
  "/api/v1/kiosks/pair",
  "/api/v1/kiosk",
  "/api/v1/jobs",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const isPublic = PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  if (isPublic || pathname === "/") {
    return NextResponse.next();
  }

  const session = request.cookies.get("atelier_session")?.value;
  const kiosk = request.cookies.get("atelier_kiosk")?.value;
  if (pathname.startsWith("/app") && !session) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  if (pathname.startsWith("/kiosk/board") && !kiosk) {
    const url = request.nextUrl.clone();
    url.pathname = "/kiosk";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
