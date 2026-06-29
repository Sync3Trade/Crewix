"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const token = searchParams.get("token");
  const justSent = searchParams.get("sent") === "true";

  const [status, setStatus] = useState<"idle" | "verifying" | "success" | "error">(
    token ? "verifying" : "idle"
  );
  const [error, setError] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  useEffect(() => {
    if (!token) return;

    async function verify() {
      try {
        const response = await fetch(
          `/api/auth/verify-email?token=${encodeURIComponent(token as string)}`
        );
        const result = await response.json();

        if (!response.ok) {
          setStatus("error");
          setError(result.error ?? "Verification failed");
          return;
        }

        setStatus("success");
        setTimeout(() => {
          router.push("/login?verified=true");
        }, 2500);
      } catch {
        setStatus("error");
        setError("Something went wrong. Please try again.");
      }
    }

    verify();
  }, [token, router]);

  async function handleResend() {
    if (!email) return;
    setResending(true);

    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) setResent(true);
    } finally {
      setResending(false);
    }
  }

  if (status === "verifying") {
    return (
      <div className="space-y-6 text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Verifying your email...</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10">
          <CheckCircle2 className="h-7 w-7 text-emerald-500" />
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold text-foreground">
            Email verified!
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Redirecting you to sign in...
          </p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
          <AlertCircle className="h-7 w-7 text-red-500" />
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold text-foreground">
            Verification failed
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
        </div>
        {email && (
          <Button onClick={handleResend} disabled={resending} className="w-full">
            {resending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Resend verification email"
            )}
          </Button>
        )}
        <Button variant="outline" href="/login" className="w-full">
          Back to sign in
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
        <Mail className="h-7 w-7 text-primary" />
      </div>
      <div>
        <h2 className="font-display text-lg font-semibold text-foreground">
          {justSent ? "Check your inbox" : "Verify your email"}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {justSent ? (
            <>
              We sent a verification link to{" "}
              <span className="font-medium text-foreground">{email}</span>.
              Click the link to activate your account.
            </>
          ) : (
            "Enter the email you used to sign up and we'll send you a new verification link."
          )}
        </p>
      </div>

      {resent && (
        <div className="rounded-xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400">
          Verification email sent!
        </div>
      )}

      {email && (
        <Button onClick={handleResend} disabled={resending} className="w-full">
          {resending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Resend verification email"
          )}
        </Button>
      )}

      <p className="text-sm text-muted-foreground">
        Already verified?{" "}
        <Link href="/login" className="font-medium text-primary hover:text-primary/80">
          Sign in
        </Link>
      </p>
    </div>
  );
}
