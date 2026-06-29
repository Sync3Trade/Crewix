"use client";

import { cn } from "@/lib/utils";
import { formatPlanStatus, getPlanById } from "@/lib/plans";

interface PlanBadgeProps {
  plan: string;
  status?: string;
  className?: string;
}

export function PlanBadge({ plan, status, className }: PlanBadgeProps) {
  const planInfo = getPlanById(plan);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
        {planInfo?.name ?? plan}
      </span>
      {status && (
        <span
          className={cn(
            "rounded-full px-2.5 py-0.5 text-xs font-medium",
            status === "active" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
            status === "trialing" && "bg-amber-500/10 text-amber-600 dark:text-amber-400",
            status === "past_due" && "bg-red-500/10 text-red-600 dark:text-red-400",
            !["active", "trialing", "past_due"].includes(status) &&
              "bg-muted text-muted-foreground"
          )}
        >
          {formatPlanStatus(status)}
        </span>
      )}
    </div>
  );
}
