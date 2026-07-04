import { AuthCard } from "@/components/auth/auth-card";
import { AuthHeader } from "@/components/auth/auth-header";
import { AuthLayout } from "@/components/auth/auth-layout";
import { VerifyEmailContent } from "@/components/auth/verify-email-content";
import { Suspense } from "react";

export const metadata = {
  title: "Verify Email — VertexWork",
  description: "Verify your VertexWork account email address",
};

function VerifyEmailFallback() {
  return (
    <div className="flex justify-center py-8">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader title="Email verification" />
        <Suspense fallback={<VerifyEmailFallback />}>
          <VerifyEmailContent />
        </Suspense>
      </AuthCard>
    </AuthLayout>
  );
}
