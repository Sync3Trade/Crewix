import { AuthCard } from "@/components/auth/auth-card";
import { AuthHeader } from "@/components/auth/auth-header";
import { AuthLayout } from "@/components/auth/auth-layout";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata = {
  title: "Reset Password — Crewix",
  description: "Create a new password for your Crewix account",
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;
  const token = params.token ?? "";

  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader
          title="Create new password"
          description="Choose a strong password for your account"
        />
        {token ? (
          <ResetPasswordForm token={token} />
        ) : (
          <p className="text-center text-sm text-muted-foreground">
            Invalid reset link. Please request a new one from the forgot password
            page.
          </p>
        )}
      </AuthCard>
    </AuthLayout>
  );
}
