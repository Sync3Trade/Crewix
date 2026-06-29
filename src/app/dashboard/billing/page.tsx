import { BillingPlans } from "@/components/dashboard/billing-plans";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { PlanBadge } from "@/components/dashboard/plan-badge";
import { ensureBusinessForUser } from "@/lib/business";
import { formatPlanStatus, getPlanById } from "@/lib/plans";
import { auth } from "@/lib/auth";
import { isStripeConfigured } from "@/lib/stripe";
import { redirect } from "next/navigation";

export const metadata = { title: "Billing — Crewix" };

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; canceled?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const business = await ensureBusinessForUser(session.user.id);
  if (!business) redirect("/onboarding");

  const params = await searchParams;
  const subscription = business.subscription;
  const plan = subscription ? getPlanById(subscription.plan) : null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Billing</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your subscription and billing details.
        </p>
      </div>

      {params.success && (
        <div className="rounded-xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400">
          Subscription activated successfully! Welcome to Crewix.
        </div>
      )}

      {params.canceled && (
        <div className="rounded-xl bg-amber-500/10 px-4 py-3 text-sm text-amber-600 dark:text-amber-400">
          Checkout was canceled. You can try again when you&apos;re ready.
        </div>
      )}

      {subscription && (
        <DashboardCard title="Current Subscription">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <PlanBadge plan={subscription.plan} status={subscription.status} />
              <p className="mt-2 text-sm text-muted-foreground">
                {plan?.description}
              </p>
              {subscription.trialEndsAt && subscription.status === "trialing" && (
                <p className="mt-1 text-sm text-amber-600 dark:text-amber-400">
                  Trial ends{" "}
                  {subscription.trialEndsAt.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              )}
              {subscription.currentPeriodEnd && subscription.status === "active" && (
                <p className="mt-1 text-sm text-muted-foreground">
                  Renews{" "}
                  {subscription.currentPeriodEnd.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>
            <div className="text-right">
              {plan?.monthlyPrice && (
                <p className="font-display text-3xl font-bold text-foreground">
                  ${plan.monthlyPrice}
                  <span className="text-base font-normal text-muted-foreground">/mo</span>
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                Status: {formatPlanStatus(subscription.status)}
              </p>
            </div>
          </div>
        </DashboardCard>
      )}

      {!isStripeConfigured() && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
          Stripe is not configured. Set <code className="rounded bg-muted px-1">STRIPE_SECRET_KEY</code> and
          price IDs in your environment to enable subscriptions.
        </div>
      )}

      <DashboardCard
        title="Plans"
        description="All plans include a 14-day free trial. Upgrade or downgrade anytime."
      >
        <BillingPlans
          currentPlan={subscription?.plan}
          subscriptionStatus={subscription?.status}
        />
      </DashboardCard>
    </div>
  );
}
