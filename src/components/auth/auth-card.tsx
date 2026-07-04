import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

interface AuthCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function AuthCard({ className, children, ...props }: AuthCardProps) {
  return (
    <div
      className={cn(
        "glass-card w-full max-w-md rounded-2xl p-8 shadow-xl shadow-primary/5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
