import { NextResponse } from "next/server";
import { COOKIE, verifyToken } from "@/lib/token";

// نخستین لایه محافظت؛ بررسی نهایی نقش و وضعیت کاربر در سرور و APIها از روی دیتابیس انجام می‌شود.
export async function middleware(req) {
  const { pathname, search } = req.nextUrl;
  const token = req.cookies.get(COOKIE)?.value;
  const payload = token ? await verifyToken(token) : null;

  if (!payload) {
    const url = new URL("/login", req.url);
    url.searchParams.set("next", pathname + search);
    return NextResponse.redirect(url);
  }
  if (pathname.startsWith("/admin") && payload.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/transactions/:path*", "/wallet/:path*", "/reserves/:path*", "/admin/:path*"],
};
