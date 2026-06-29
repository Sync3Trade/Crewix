import { AuthCard } from "@/components/auth/auth-card";
import { AuthHeader } from "@/components/auth/auth-header";
import { AuthLayout } from "@/components/auth/auth-layout";
import { LoginForm } from "@/components/auth/login-form";
import { Suspense } from "react";

export const metadata = {
  title: "Sign In — Crewix",
  description: "Sign in to your Crewix account",
};

function LoginFormFallback() {
  return (
    <div className="flex justify-center py-8">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader
          title="Welcome back"
          description="Sign in to manage your AI workforce"
        />
        <Suspense fallback={<LoginFormFallback />}>
          <LoginForm />
        </Suspense>
      </AuthCard>
    </AuthLayout>
  );
}
