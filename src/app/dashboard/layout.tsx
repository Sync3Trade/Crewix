import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { auth } from "@/lib/auth";
import { ensureBusinessForUser } from "@/lib/business";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (!session.user.onboardingCompleted) {
    redirect("/onboarding");
  }

  const business = await ensureBusinessForUser(session.user.id);

  if (!business) {
    redirect("/onboarding");
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar
        businessName={business.name}
        plan={business.subscription?.plan}
        subscriptionStatus={business.subscription?.status}
        userName={session.user.name}
      />
      <div className="flex flex-1 flex-col lg:pl-0">
        <main className="flex-1 overflow-auto p-4 pt-16 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
