import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES = ["/dashboard", "/scripts", "/planner", "/settings"];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const protectedRoute = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (!protectedRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get("access");

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/scripts/:path*",
    "/planner/:path*",
    "/settings/:path*",
  ],
};
