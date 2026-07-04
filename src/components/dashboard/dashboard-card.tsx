import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}

export function DashboardCard({
  title,
  description,
  children,
  className,
  action,
}: DashboardCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card",
        className
      )}
    >
      <div className="flex items-start justify-between border-b border-border px-6 py-4">
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground">
            {title}
          </h3>
          {description && (
            <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {action}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}
