import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const signInURL = new URL("/", request.url);
  const dashboardURL = new URL("/dashboard", request.url);

  const isDashboardRoute = request.nextUrl.pathname.startsWith("/dashboard");
  const isPublicRoute =
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname === "/register";

  if (!token && isDashboardRoute) {
    return NextResponse.redirect(signInURL);
  }

  if (token && isPublicRoute) {
    return NextResponse.redirect(dashboardURL);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
