import type { NextAuthConfig } from "next-auth";
import { getAuthSecret, shouldTrustAuthHost } from "@/lib/env";

const authSecret = getAuthSecret();

if (!authSecret && process.env.NODE_ENV === "production") {
  console.error(
    "AUTH_SECRET is not set. Generate one with: openssl rand -base64 32"
  );
}

export const authConfig = {
  secret: authSecret,
  trustHost: shouldTrustAuthHost(),
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.emailVerified = user.emailVerified ?? null;
      }

      if (trigger === "update" && token.id) {
        token.onboardingCompleted = true;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.emailVerified = (token.emailVerified as Date | null) ?? null;
        session.user.onboardingCompleted = Boolean(token.onboardingCompleted);
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
