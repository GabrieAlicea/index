import { NextResponse, type NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/proxy";

/**
 * Next.js 16 renamed Middleware to Proxy (see next.config docs). This is an
 * optimistic auth/role check only, per Next's own guidance — it prevents an
 * obviously-wrong dashboard from flashing, but the actual authorization
 * boundary is Postgres RLS (see docs/REVVY_PRD.md §14 Security). Never trust
 * this layer alone to gate sensitive data or mutations.
 */
export async function proxy(request: NextRequest) {
  const { response, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/dashboard")) {
    return response;
  }

  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = (user.user_metadata?.role as string | undefined) ?? "customer";
  const dashboardHome = `/dashboard/${role === "mechanic" ? "mechanic" : role === "admin" ? "admin" : "customer"}`;

  if (pathname === "/dashboard") {
    return NextResponse.redirect(new URL(dashboardHome, request.url));
  }

  const inWrongSection =
    (pathname.startsWith("/dashboard/admin") && role !== "admin") ||
    (pathname.startsWith("/dashboard/mechanic") && role !== "mechanic" && role !== "admin") ||
    (pathname.startsWith("/dashboard/customer") && role !== "customer" && role !== "admin");

  if (inWrongSection) {
    return NextResponse.redirect(new URL(dashboardHome, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.svg|favicon.ico).*)",
  ],
};
