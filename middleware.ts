import { NextRequest, NextResponse, userAgent } from "next/server";

export function middleware(req: NextRequest) {
  if (userAgent(req).isBot) {
    return new Response("plz don't be a bot");
  }
  if (!req.url.includes("/api")) {
    if (!req.url.includes("/enter") && !req.cookies.has("carrotsession")) {
      return NextResponse.redirect(new URL('/enter', req.url));
    }
  }
}

export const config = {
  matcher: ["/((?!_next|api/auth).*)(.+)"],
};
