"use client";

import { ThemeToggle } from "@/components/ui/theme-toggle";
import Link from "next/link";
import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
      <div className="glow-orb animate-pulse-glow pointer-events-none absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-primary" />
      <div className="glow-orb animate-pulse-glow pointer-events-none absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-accent" />

      <header className="relative z-10 flex items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          &larr; Back to home
        </Link>
        <ThemeToggle />
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-8">
        {children}
      </main>
    </div>
  );
}
