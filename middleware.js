import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req) {
  const token = req.cookies.get("access_token")?.value;
  const url = req.nextUrl.clone();

  // Skip login/register
  if (url.pathname.startsWith("/auth")) return NextResponse.next();

  if (!token) {
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  try {
    const secretKey = new TextEncoder().encode("defaultSecretKey");
    await jwtVerify(token, secretKey);
    return NextResponse.next();
  } catch {
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/", "/dashboard", "/master-data/:path*"],
};
