import { AuthCard } from "@/components/auth/auth-card";
import { AuthHeader } from "@/components/auth/auth-header";
import { AuthLayout } from "@/components/auth/auth-layout";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata = {
  title: "Sign Up — Crewix",
  description: "Create your Crewix account and hire AI employees",
};

export default function SignupPage() {
  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader
          title="Create your account"
          description="Start your 14-day free trial — no credit card required"
        />
        <SignupForm />
      </AuthCard>
    </AuthLayout>
  );
}
