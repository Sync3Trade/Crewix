export type PlanId = "starter" | "professional" | "business" | "enterprise";

export interface Plan {
  id: PlanId;
  name: string;
  description: string;
  monthlyPrice: number | null;
  yearlyPrice: number | null;
  features: string[];
  aiEmployees: number | string;
  minutes: number | string;
  popular?: boolean;
  stripePriceIdMonthly?: string;
  stripePriceIdYearly?: string;
}

export const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for solo operators and small teams getting started with AI.",
    monthlyPrice: 149,
    yearlyPrice: 119,
    aiEmployees: 1,
    minutes: 500,
    features: [
      "1 AI employee",
      "500 minutes/month",
      "Call answering & lead qualification",
      "Appointment booking",
      "SMS follow-ups (100/month)",
      "Basic analytics",
      "Email support",
    ],
    stripePriceIdMonthly: process.env.STRIPE_PRICE_STARTER_MONTHLY,
    stripePriceIdYearly: process.env.STRIPE_PRICE_STARTER_YEARLY,
  },
  {
    id: "professional",
    name: "Professional",
    description: "For growing businesses that need more capacity and automation.",
    monthlyPrice: 349,
    yearlyPrice: 279,
    aiEmployees: 3,
    minutes: 2000,
    popular: true,
    features: [
      "3 AI employees",
      "2,000 minutes/month",
      "Everything in Starter",
      "Advanced lead scoring",
      "Unlimited SMS follow-ups",
      "Email automation sequences",
      "CRM integrations",
      "Priority support",
    ],
    stripePriceIdMonthly: process.env.STRIPE_PRICE_PROFESSIONAL_MONTHLY,
    stripePriceIdYearly: process.env.STRIPE_PRICE_PROFESSIONAL_YEARLY,
  },
  {
    id: "business",
    name: "Business",
    description: "For established teams managing high call volume across departments.",
    monthlyPrice: 699,
    yearlyPrice: 559,
    aiEmployees: 10,
    minutes: 10000,
    features: [
      "10 AI employees",
      "10,000 minutes/month",
      "Everything in Professional",
      "Multi-line phone support",
      "Advanced analytics & reporting",
      "Custom workflows",
      "Dedicated onboarding",
      "Phone support",
    ],
    stripePriceIdMonthly: process.env.STRIPE_PRICE_BUSINESS_MONTHLY,
    stripePriceIdYearly: process.env.STRIPE_PRICE_BUSINESS_YEARLY,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For multi-location businesses with complex communication needs.",
    monthlyPrice: null,
    yearlyPrice: null,
    aiEmployees: "Unlimited",
    minutes: "Unlimited",
    features: [
      "Unlimited AI employees",
      "Unlimited minutes",
      "Everything in Business",
      "Multi-location management",
      "Custom AI training",
      "Dedicated account manager",
      "SLA guarantee",
      "SSO & API access",
    ],
    stripePriceIdMonthly: process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY,
    stripePriceIdYearly: process.env.STRIPE_PRICE_ENTERPRISE_YEARLY,
  },
];

export function getPlanById(id: string): Plan | undefined {
  return PLANS.find((plan) => plan.id === id);
}

export function getPlanByPriceId(priceId: string): Plan | undefined {
  return PLANS.find(
    (plan) =>
      plan.stripePriceIdMonthly === priceId ||
      plan.stripePriceIdYearly === priceId
  );
}

export function getStripePriceId(
  planId: PlanId,
  interval: "monthly" | "yearly"
): string | undefined {
  const plan = getPlanById(planId);
  if (!plan) return undefined;
  return interval === "yearly"
    ? plan.stripePriceIdYearly
    : plan.stripePriceIdMonthly;
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPlanStatus(status: string) {
  const labels: Record<string, string> = {
    trialing: "Trial",
    active: "Active",
    past_due: "Past Due",
    canceled: "Canceled",
    incomplete: "Incomplete",
    unpaid: "Unpaid",
  };
  return labels[status] ?? status;
}
