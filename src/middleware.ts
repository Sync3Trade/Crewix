import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const session = req.auth;
  const isLoggedIn = !!session?.user;
  const { pathname } = req.nextUrl;

  const authRoutes = ["/login", "/signup", "/forgot-password"];
  const isAuthRoute = authRoutes.some((route) => pathname === route);
  const isVerifyEmail = pathname.startsWith("/verify-email");
  const isOnboarding = pathname.startsWith("/onboarding");
  const isDashboard = pathname.startsWith("/dashboard");

  if ((isOnboarding || isDashboard) && !isLoggedIn) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoggedIn && session.user) {
    const emailVerified = session.user.emailVerified;
    const onboardingCompleted = session.user.onboardingCompleted;

    if (!emailVerified && !isVerifyEmail) {
      const verifyUrl = new URL("/verify-email", req.url);
      if (session.user.email) {
        verifyUrl.searchParams.set("email", session.user.email);
      }
      return NextResponse.redirect(verifyUrl);
    }

    if (emailVerified && isAuthRoute) {
      return NextResponse.redirect(
        new URL(onboardingCompleted ? "/dashboard" : "/onboarding", req.url)
      );
    }

    if (emailVerified && isOnboarding && onboardingCompleted) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (emailVerified && isDashboard && !onboardingCompleted) {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
    "/onboarding",
    "/dashboard",
  ],
};
