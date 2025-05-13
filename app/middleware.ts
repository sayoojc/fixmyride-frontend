import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken");
  const refreshToken = req.cookies.get("refreshToken");

  if (accessToken) {
    console.log('The accesstoken exists')
    // ✅ Token exists, let user in
    return NextResponse.next();
  }

  if (refreshToken) {
        console.log('The refreshtoken exists')

    // ⏳ Try refreshing the token
    const res = await fetch(`${process.env.API_URL}/auth/refresh-token`, {
      method: "POST",
      credentials: "include",
    });

    if (res.ok) {
      // ✅ Token refreshed. Let user in.
      return NextResponse.next();
    } else {
      // ❌ Refresh token is invalid/expired. Redirect to login
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // ❌ No tokens at all
  return NextResponse.redirect(new URL("/login", req.url));
}
