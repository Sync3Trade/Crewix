import Link from "next/link";
import type { ReactNode } from "react";

interface AuthHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export function AuthHeader({ title, description, children }: AuthHeaderProps) {
  return (
    <div className="mb-8 text-center">
      <Link href="/" className="mb-6 inline-flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-brand shadow-lg shadow-primary/20">
          <span className="font-display text-sm font-bold text-white">V</span>
        </div>
        <span className="font-display text-xl font-bold tracking-tight text-foreground">
          VertexWork
        </span>
      </Link>
      <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
        {title}
      </h1>
      {description && (
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      )}
      {children}
    </div>
  );
}
