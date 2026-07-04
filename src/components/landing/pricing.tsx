"use client";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useState } from "react";

const plans = [
  {
    name: "Starter",
    description: "Perfect for solo operators and small teams getting started with AI.",
    monthlyPrice: 149,
    yearlyPrice: 119,
    features: [
      "1 AI employee",
      "500 minutes/month",
      "Call answering & lead qualification",
      "Appointment booking",
      "SMS follow-ups (100/month)",
      "Email notifications",
      "Basic analytics",
      "Email support",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Growth",
    description: "For growing businesses that need more capacity and automation.",
    monthlyPrice: 349,
    yearlyPrice: 279,
    features: [
      "3 AI employees",
      "2,000 minutes/month",
      "Everything in Starter",
      "Advanced lead scoring",
      "Unlimited SMS follow-ups",
      "Email automation sequences",
      "CRM integrations",
      "Custom scripts & workflows",
      "Priority support",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    description: "For multi-location businesses with complex communication needs.",
    monthlyPrice: null,
    yearlyPrice: null,
    features: [
      "Unlimited AI employees",
      "Unlimited minutes",
      "Everything in Growth",
      "Multi-location management",
      "Custom AI training",
      "Dedicated account manager",
      "SLA guarantee",
      "SSO & advanced security",
      "API access",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export function Pricing() {
  const [annual, setAnnual] = useState(true);

  return (
    <section
      id="pricing"
      className="relative overflow-hidden bg-muted/40 py-24 lg:py-32"
    >
      <div className="glow-orb pointer-events-none absolute -left-32 top-0 h-72 w-72 rounded-full bg-accent" />

      <Container className="relative">
        <SectionHeader
          badge="Pricing"
          title="Simple, transparent pricing"
          description="Start with a 14-day free trial on any plan. No hidden fees, no long-term contracts. Scale up as your business grows."
        />

        <div className="mb-12 flex items-center justify-center gap-3">
          <span
            className={cn(
              "text-sm font-medium transition-colors",
              !annual ? "text-foreground" : "text-muted-foreground"
            )}
          >
            Monthly
          </span>
          <button
            type="button"
            onClick={() => setAnnual(!annual)}
            className={cn(
              "relative h-7 w-12 rounded-full transition-colors",
              annual ? "bg-primary" : "bg-muted-foreground/30"
            )}
            aria-label="Toggle annual billing"
          >
            <span
              className={cn(
                "absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform",
                annual && "translate-x-5"
              )}
            />
          </button>
          <span
            className={cn(
              "text-sm font-medium transition-colors",
              annual ? "text-foreground" : "text-muted-foreground"
            )}
          >
            Annual
          </span>
          {annual && (
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              Save 20%
            </span>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className={cn(
                "relative flex flex-col rounded-2xl border bg-card p-8",
                plan.popular
                  ? "border-primary shadow-xl shadow-primary/10 ring-1 ring-primary/20"
                  : "border-border"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-gradient-brand px-4 py-1 text-xs font-semibold text-white shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}

              <div>
                <h3 className="font-display text-xl font-bold text-foreground">
                  {plan.name}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {plan.description}
                </p>
              </div>

              <div className="mt-6">
                {plan.monthlyPrice ? (
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-4xl font-bold text-foreground">
                      ${annual ? plan.yearlyPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                ) : (
                  <span className="font-display text-4xl font-bold text-foreground">
                    Custom
                  </span>
                )}
                {plan.monthlyPrice && annual && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Billed annually at ${(plan.yearlyPrice ?? 0) * 12}/year
                  </p>
                )}
              </div>

              <ul className="mt-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="text-sm text-muted-foreground">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                className="mt-8 w-full"
                variant={plan.popular ? "primary" : "outline"}
                href="#"
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
