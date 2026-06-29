import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { Badge } from "@/components/ui/badge";
import { ensureBusinessForUser } from "@/lib/business";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Bot, Pause, Play } from "lucide-react";
import { redirect } from "next/navigation";

export const metadata = { title: "AI Employees — Crewix" };

export default async function AiEmployeesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const business = await ensureBusinessForUser(session.user.id);
  if (!business) redirect("/onboarding");

  const employees = await prisma.aiEmployee.findMany({
    where: { businessId: business.id },
    orderBy: { callsHandled: "desc" },
  });

  const active = employees.filter((e) => e.status === "active").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">
          AI Employees
        </h1>
        <p className="mt-1 text-muted-foreground">
          Manage your AI workforce and monitor their performance.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Total Deployed</p>
          <p className="mt-1 font-display text-3xl font-bold">{employees.length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Active Now</p>
          <p className="mt-1 font-display text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            {active}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Total Calls Handled</p>
          <p className="mt-1 font-display text-3xl font-bold">
            {employees.reduce((s, e) => s + e.callsHandled, 0)}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {employees.map((employee) => (
          <DashboardCard key={employee.id} title={employee.name} description={employee.role}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-brand text-xl font-bold text-white">
                  {employee.name[0]}
                </div>
                <Badge
                  variant={employee.status === "active" ? "gradient" : "outline"}
                >
                  {employee.status === "active" ? (
                    <><Play className="mr-1 h-3 w-3" /> Active</>
                  ) : (
                    <><Pause className="mr-1 h-3 w-3" /> {employee.status}</>
                  )}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-muted/50 p-3 text-center">
                  <p className="font-display text-xl font-bold">{employee.callsHandled}</p>
                  <p className="text-xs text-muted-foreground">Calls</p>
                </div>
                <div className="rounded-xl bg-muted/50 p-3 text-center">
                  <p className="font-display text-xl font-bold">{employee.leadsQualified}</p>
                  <p className="text-xs text-muted-foreground">Leads</p>
                </div>
                <div className="rounded-xl bg-muted/50 p-3 text-center">
                  <p className="font-display text-xl font-bold">
                    {employee.appointmentsBooked}
                  </p>
                  <p className="text-xs text-muted-foreground">Booked</p>
                </div>
              </div>
            </div>
          </DashboardCard>
        ))}
      </div>

      {employees.length === 0 && (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-border py-16 text-center">
          <Bot className="mb-3 h-12 w-12 text-muted-foreground" />
          <p className="font-medium text-foreground">No AI employees deployed</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Subscribe to a plan to deploy your first AI employee.
          </p>
        </div>
      )}
    </div>
  );
}
