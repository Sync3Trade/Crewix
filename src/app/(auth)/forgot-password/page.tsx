import { AuthCard } from "@/components/auth/auth-card";
import { AuthHeader } from "@/components/auth/auth-header";
import { AuthLayout } from "@/components/auth/auth-layout";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata = {
  title: "Forgot Password — VertexWork",
  description: "Reset your VertexWork account password",
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader
          title="Forgot your password?"
          description="No worries — we'll send you reset instructions"
        />
        <ForgotPasswordForm />
      </AuthCard>
    </AuthLayout>
  );
}
