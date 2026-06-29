"use client";

import { cn } from "@/lib/utils";
import { formatPlanStatus, getPlanById, type PlanId } from "@/lib/plans";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import { useState } from "react";

interface BillingPlansProps {
  currentPlan?: string;
  subscriptionStatus?: string;
}

export function BillingPlans({ currentPlan, subscriptionStatus }: BillingPlansProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [interval, setInterval] = useState<"monthly" | "yearly">("monthly");

  async function handleCheckout(planId: PlanId) {
    if (planId === "enterprise") return;
    setLoading(planId);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId, interval }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } finally {
      setLoading(null);
    }
  }

  async function handlePortal() {
    setLoading("portal");
    try {
      const response = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await response.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setLoading(null);
    }
  }

  const plans = ["starter", "professional", "business", "enterprise"] as const;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center gap-3">
        <span className={cn("text-sm font-medium", interval === "monthly" ? "text-foreground" : "text-muted-foreground")}>
          Monthly
        </span>
        <button
          type="button"
          onClick={() => setInterval(interval === "monthly" ? "yearly" : "monthly")}
          className={cn(
            "relative h-7 w-12 rounded-full transition-colors",
            interval === "yearly" ? "bg-primary" : "bg-muted-foreground/30"
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform",
              interval === "yearly" && "translate-x-5"
            )}
          />
        </button>
        <span className={cn("text-sm font-medium", interval === "yearly" ? "text-foreground" : "text-muted-foreground")}>
          Annual
        </span>
        {interval === "yearly" && (
          <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            Save 20%
          </span>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        {plans.map((planId) => {
          const plan = getPlanById(planId)!;
          const isCurrent = currentPlan === planId;
          const price = interval === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;

          return (
            <div
              key={planId}
              className={cn(
                "flex flex-col rounded-2xl border p-5",
                isCurrent ? "border-primary ring-1 ring-primary/20" : "border-border"
              )}
            >
              <div className="mb-4">
                <h4 className="font-display font-bold text-foreground">{plan.name}</h4>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                  {plan.description}
                </p>
              </div>

              <div className="mb-4">
                {price ? (
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-2xl font-bold">${price}</span>
                    <span className="text-sm text-muted-foreground">/mo</span>
                  </div>
                ) : (
                  <span className="font-display text-2xl font-bold">Custom</span>
                )}
              </div>

              <ul className="mb-5 flex-1 space-y-2">
                {plan.features.slice(0, 4).map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <Check className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>

              {isCurrent && subscriptionStatus ? (
                <div className="text-center text-xs font-medium text-primary">
                  Current plan · {formatPlanStatus(subscriptionStatus)}
                </div>
              ) : planId === "enterprise" ? (
                <Button variant="outline" size="sm" href="mailto:sales@crewix.com">
                  Contact Sales
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant={plan.popular ? "primary" : "outline"}
                  disabled={loading === planId}
                  onClick={() => handleCheckout(planId)}
                >
                  {loading === planId ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isCurrent ? (
                    "Upgrade"
                  ) : (
                    "Subscribe"
                  )}
                </Button>
              )}
            </div>
          );
        })}
      </div>

      {currentPlan && subscriptionStatus && ["active", "trialing", "past_due"].includes(subscriptionStatus) && (
        <div className="flex justify-center">
          <Button variant="outline" disabled={loading === "portal"} onClick={handlePortal}>
            {loading === "portal" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Manage Billing in Stripe"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
