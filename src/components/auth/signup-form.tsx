"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signupSchema, type SignupInput } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Check, Loader2, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

function PasswordRequirement({
  met,
  label,
}: {
  met: boolean;
  label: string;
}) {
  return (
    <li className="flex items-center gap-2 text-xs">
      {met ? (
        <Check className="h-3 w-3 text-emerald-500" />
      ) : (
        <X className="h-3 w-3 text-muted-foreground" />
      )}
      <span className={met ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}>
        {label}
      </span>
    </li>
  );
}

export function SignupForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  });

  const password = watch("password", "");

  const requirements = useMemo(
    () => [
      { met: password.length >= 8, label: "At least 8 characters" },
      { met: /[A-Z]/.test(password), label: "One uppercase letter" },
      { met: /[a-z]/.test(password), label: "One lowercase letter" },
      { met: /[0-9]/.test(password), label: "One number" },
    ],
    [password]
  );

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    setServerError(null);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setServerError(result.error ?? "Something went wrong");
        return;
      }

      router.push(
        `/verify-email?email=${encodeURIComponent(data.email)}&sent=true`
      );
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {serverError && (
        <div className="flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {serverError}
        </div>
      )}

      <div>
        <Label htmlFor="name">Full name</Label>
        <Input
          id="name"
          type="text"
          placeholder="Jane Smith"
          autoComplete="name"
          error={errors.name?.message}
          {...register("name")}
        />
      </div>

      <div>
        <Label htmlFor="email">Work email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Create a strong password"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password")}
        />
        {password && (
          <ul className="mt-2 space-y-1">
            {requirements.map((req) => (
              <PasswordRequirement key={req.label} {...req} />
            ))}
          </ul>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          "Create account"
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        By signing up, you agree to our{" "}
        <Link href="#" className="underline hover:text-foreground">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="#" className="underline hover:text-foreground">
          Privacy Policy
        </Link>
        .
      </p>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:text-primary/80">
          Sign in
        </Link>
      </p>
    </form>
  );
}
