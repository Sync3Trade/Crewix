"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Car,
  Check,
  Gavel,
  Home,
  Loader2,
  Phone,
  Smile,
  Sparkles,
  Target,
  Users,
  Wrench,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const industries = [
  { id: "law", label: "Law Firms", icon: Gavel },
  { id: "hvac", label: "HVAC", icon: Wrench },
  { id: "roofing", label: "Roofing", icon: Home },
  { id: "dental", label: "Dental", icon: Smile },
  { id: "real-estate", label: "Real Estate", icon: Building2 },
  { id: "auto", label: "Auto Dealerships", icon: Car },
  { id: "other", label: "Other", icon: Building2 },
];

const teamSizes = [
  { id: "solo", label: "Just me", description: "Solo operator" },
  { id: "2-10", label: "2–10", description: "Small team" },
  { id: "11-50", label: "11–50", description: "Growing business" },
  { id: "51-200", label: "51–200", description: "Mid-size company" },
  { id: "200+", label: "200+", description: "Enterprise" },
];

const goals = [
  { id: "calls", label: "Answer phone calls", icon: Phone },
  { id: "leads", label: "Qualify leads", icon: Target },
  { id: "appointments", label: "Book appointments", icon: Check },
  { id: "followups", label: "Send follow-ups", icon: Sparkles },
];

const totalSteps = 5;

interface OnboardingData {
  companyName: string;
  website: string;
  industry: string;
  teamSize: string;
  primaryGoals: string[];
  phoneNumber: string;
}

const initialData: OnboardingData = {
  companyName: "",
  website: "",
  industry: "",
  teamSize: "",
  primaryGoals: [],
  phoneNumber: "",
};

export function OnboardingWizard() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadOnboarding() {
      try {
        const response = await fetch("/api/onboarding");
        if (response.ok) {
          const { onboarding } = await response.json();
          if (onboarding) {
            setData({
              companyName: onboarding.companyName ?? "",
              website: onboarding.website ?? "",
              industry: onboarding.industry ?? "",
              teamSize: onboarding.teamSize ?? "",
              primaryGoals: onboarding.primaryGoals ?? [],
              phoneNumber: onboarding.phoneNumber ?? "",
            });
            if (onboarding.currentStep && onboarding.currentStep > 1) {
              setStep(Math.min(onboarding.currentStep, totalSteps));
            }
          }
        }
      } finally {
        setIsLoading(false);
      }
    }
    loadOnboarding();
  }, []);

  async function saveProgress(
    nextStep: number,
    updates: Partial<OnboardingData>,
    complete = false
  ) {
    setIsSaving(true);
    setError(null);

    const merged = { ...data, ...updates };
    setData(merged);

    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: complete ? totalSteps + 1 : nextStep,
          data: merged,
          complete,
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        setError(result.error ?? "Failed to save progress");
        return false;
      }

      if (complete) {
        await update({ onboardingCompleted: true });
        router.push("/dashboard");
        router.refresh();
      } else {
        setStep(nextStep);
      }

      return true;
    } catch {
      setError("Something went wrong. Please try again.");
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  function toggleGoal(goalId: string) {
    setData((prev) => ({
      ...prev,
      primaryGoals: prev.primaryGoals.includes(goalId)
        ? prev.primaryGoals.filter((g) => g !== goalId)
        : prev.primaryGoals.length < 4
          ? [...prev.primaryGoals, goalId]
          : prev.primaryGoals,
    }));
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const progress = ((step - 1) / totalSteps) * 100;

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
      <div className="glow-orb pointer-events-none absolute -top-32 right-1/4 h-96 w-96 rounded-full bg-primary" />

      <header className="relative z-10 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand">
              <span className="font-display text-sm font-bold text-white">V</span>
            </div>
            <span className="font-display text-lg font-bold text-foreground">
              VertexWork
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Step {step} of {totalSteps}
            </span>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Sign out
            </button>
          </div>
        </div>
        <div className="h-1 bg-muted">
          <motion.div
            className="h-full bg-gradient-brand"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-2xl px-6 py-12">
        {error && (
          <div className="mb-6 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <StepWrapper key="step-1">
              <StepTitle
                title={`Welcome${session?.user?.name ? `, ${session.user.name.split(" ")[0]}` : ""}!`}
                description="Let's set up your AI workforce. First, tell us about your business."
              />
              <div className="space-y-5">
                <div>
                  <Label htmlFor="companyName">Company name</Label>
                  <Input
                    id="companyName"
                    placeholder="Acme Services Inc."
                    value={data.companyName}
                    onChange={(e) =>
                      setData({ ...data, companyName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website (optional)</Label>
                  <Input
                    id="website"
                    placeholder="https://yourcompany.com"
                    value={data.website}
                    onChange={(e) =>
                      setData({ ...data, website: e.target.value })
                    }
                  />
                </div>
              </div>
              <StepActions
                onNext={() => {
                  if (data.companyName.trim().length < 2) {
                    setError("Please enter your company name");
                    return;
                  }
                  saveProgress(2, {});
                }}
                isSaving={isSaving}
                showBack={false}
              />
            </StepWrapper>
          )}

          {step === 2 && (
            <StepWrapper key="step-2">
              <StepTitle
                title="What industry are you in?"
                description="We'll customize your AI employees for your industry's needs."
              />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {industries.map((industry) => (
                  <button
                    key={industry.id}
                    type="button"
                    onClick={() => setData({ ...data, industry: industry.id })}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all",
                      data.industry === industry.id
                        ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                        : "border-border bg-card hover:border-primary/30"
                    )}
                  >
                    <industry.icon
                      className={cn(
                        "h-6 w-6",
                        data.industry === industry.id
                          ? "text-primary"
                          : "text-muted-foreground"
                      )}
                    />
                    <span className="text-sm font-medium text-foreground">
                      {industry.label}
                    </span>
                  </button>
                ))}
              </div>
              <StepActions
                onBack={() => setStep(1)}
                onNext={() => {
                  if (!data.industry) {
                    setError("Please select an industry");
                    return;
                  }
                  saveProgress(3, {});
                }}
                isSaving={isSaving}
              />
            </StepWrapper>
          )}

          {step === 3 && (
            <StepWrapper key="step-3">
              <StepTitle
                title="How big is your team?"
                description="This helps us recommend the right plan and configuration."
              />
              <div className="space-y-3">
                {teamSizes.map((size) => (
                  <button
                    key={size.id}
                    type="button"
                    onClick={() => setData({ ...data, teamSize: size.id })}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl border p-4 text-left transition-all",
                      data.teamSize === size.id
                        ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                        : "border-border bg-card hover:border-primary/30"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Users
                        className={cn(
                          "h-5 w-5",
                          data.teamSize === size.id
                            ? "text-primary"
                            : "text-muted-foreground"
                        )}
                      />
                      <div>
                        <p className="font-medium text-foreground">{size.label}</p>
                        <p className="text-sm text-muted-foreground">
                          {size.description}
                        </p>
                      </div>
                    </div>
                    {data.teamSize === size.id && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </button>
                ))}
              </div>
              <StepActions
                onBack={() => setStep(2)}
                onNext={() => {
                  if (!data.teamSize) {
                    setError("Please select your team size");
                    return;
                  }
                  saveProgress(4, {});
                }}
                isSaving={isSaving}
              />
            </StepWrapper>
          )}

          {step === 4 && (
            <StepWrapper key="step-4">
              <StepTitle
                title="What do you need help with?"
                description="Select up to 4 goals. We'll prioritize these when setting up your AI employees."
              />
              <div className="grid grid-cols-2 gap-3">
                {goals.map((goal) => {
                  const selected = data.primaryGoals.includes(goal.id);
                  return (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => toggleGoal(goal.id)}
                      className={cn(
                        "flex flex-col items-start gap-3 rounded-xl border p-4 text-left transition-all",
                        selected
                          ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                          : "border-border bg-card hover:border-primary/30"
                      )}
                    >
                      <goal.icon
                        className={cn(
                          "h-5 w-5",
                          selected ? "text-primary" : "text-muted-foreground"
                        )}
                      />
                      <span className="text-sm font-medium text-foreground">
                        {goal.label}
                      </span>
                    </button>
                  );
                })}
              </div>
              <StepActions
                onBack={() => setStep(3)}
                onNext={() => {
                  if (data.primaryGoals.length === 0) {
                    setError("Please select at least one goal");
                    return;
                  }
                  saveProgress(5, {});
                }}
                isSaving={isSaving}
              />
            </StepWrapper>
          )}

          {step === 5 && (
            <StepWrapper key="step-5">
              <StepTitle
                title="Almost there!"
                description="Add your business phone number so your AI employees can start handling calls."
              />
              <div>
                <Label htmlFor="phoneNumber">Business phone number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={data.phoneNumber}
                  onChange={(e) =>
                    setData({ ...data, phoneNumber: e.target.value })
                  }
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  You can connect additional numbers later from your dashboard.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <h3 className="mb-3 text-sm font-semibold text-foreground">
                  Your setup summary
                </h3>
                <dl className="space-y-2 text-sm">
                  <SummaryRow label="Company" value={data.companyName} />
                  <SummaryRow
                    label="Industry"
                    value={
                      industries.find((i) => i.id === data.industry)?.label ??
                      data.industry
                    }
                  />
                  <SummaryRow
                    label="Team size"
                    value={
                      teamSizes.find((s) => s.id === data.teamSize)?.label ??
                      data.teamSize
                    }
                  />
                  <SummaryRow
                    label="Goals"
                    value={data.primaryGoals
                      .map((g) => goals.find((goal) => goal.id === g)?.label)
                      .filter(Boolean)
                      .join(", ")}
                  />
                </dl>
              </div>

              <StepActions
                onBack={() => setStep(4)}
                onNext={() => {
                  if (data.phoneNumber.trim().length < 10) {
                    setError("Please enter a valid phone number");
                    return;
                  }
                  saveProgress(6, {}, true);
                }}
                isSaving={isSaving}
                nextLabel="Launch VertexWork"
              />
            </StepWrapper>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function StepWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {children}
    </motion.div>
  );
}

function StepTitle({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
        {title}
      </h1>
      <p className="mt-2 text-muted-foreground">{description}</p>
    </div>
  );
}

function StepActions({
  onBack,
  onNext,
  isSaving,
  showBack = true,
  nextLabel = "Continue",
}: {
  onBack?: () => void;
  onNext: () => void;
  isSaving: boolean;
  showBack?: boolean;
  nextLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between pt-4">
      {showBack && onBack ? (
        <Button variant="ghost" onClick={onBack} disabled={isSaving}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      ) : (
        <div />
      )}
      <Button onClick={onNext} disabled={isSaving}>
        {isSaving ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            {nextLabel}
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground text-right">{value}</dd>
    </div>
  );
}
