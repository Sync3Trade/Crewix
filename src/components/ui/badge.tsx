import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: "default" | "gradient" | "outline";
}

export function Badge({
  className,
  children,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
        variant === "default" && "bg-muted text-muted-foreground",
        variant === "gradient" &&
          "border border-primary/20 bg-primary/10 text-primary dark:text-primary",
        variant === "outline" && "border border-border text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
