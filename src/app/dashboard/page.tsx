import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { DashboardLineChart } from "@/components/dashboard/charts";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { ensureBusinessForUser, getDashboardStats } from "@/lib/business";
import { formatCurrency } from "@/lib/plans";
import { auth } from "@/lib/auth";
import {
  Bot,
  Calendar,
  Clock,
  DollarSign,
  Phone,
  Target,
  TrendingUp,
} from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = {
  title: "Dashboard — Crewix",
};

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function formatOutcome(outcome: string | null) {
  const map: Record<string, string> = {
    qualified: "Qualified",
    appointment_booked: "Booked",
    transferred: "Transferred",
    follow_up: "Follow-up",
    voicemail: "Voicemail",
  };
  return map[outcome ?? ""] ?? "—";
}

export default async function DashboardOverviewPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const business = await ensureBusinessForUser(session.user.id);
  if (!business) redirect("/onboarding");

  const stats = await getDashboardStats(business.id);
  const recentCalls = await import("@/lib/business").then((m) =>
    m.getCalls(business.id, 5)
  );

  const revenueChartData = stats.revenueByDay.map((r) => ({
    date: new Date(r.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    amount: r.amount,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">
          Welcome back, {session.user.name?.split(" ")[0] ?? "there"}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Here&apos;s how {business.name} is performing today.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Calls"
          value={stats.totalCalls}
          change={`+${stats.recentCalls} this week`}
          changeType="positive"
          icon={Phone}
        />
        <StatCard
          title="Appointments"
          value={stats.upcomingAppointments}
          change={`${stats.totalAppointments} total booked`}
          changeType="neutral"
          icon={Calendar}
        />
        <StatCard
          title="AI Employees"
          value={stats.activeAiEmployees}
          change={`${stats.aiEmployees.length} deployed`}
          changeType="neutral"
          icon={Bot}
        />
        <StatCard
          title="Monthly Revenue"
          value={formatCurrency(stats.monthlyRevenue)}
          change={`${formatCurrency(stats.totalRevenue)} all time`}
          changeType="positive"
          icon={DollarSign}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <DashboardCard
          title="Revenue Trend"
          description="Last 30 days"
          className="lg:col-span-2"
        >
          <DashboardLineChart
            data={revenueChartData}
            dataKey="amount"
            color="#06b6d4"
            formatValue={(v) => formatCurrency(v)}
          />
        </DashboardCard>

        <DashboardCard title="Quick Stats" description="Last 30 days">
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4">
              <div className="flex items-center gap-3">
                <Target className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">Leads Qualified</span>
              </div>
              <span className="font-display text-xl font-bold">{stats.leadsQualified}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-accent" />
                <span className="text-sm text-muted-foreground">Avg Call Duration</span>
              </div>
              <span className="font-display text-xl font-bold">
                {formatDuration(stats.avgCallDuration)}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
                <span className="text-sm text-muted-foreground">Weekly Calls</span>
              </div>
              <span className="font-display text-xl font-bold">{stats.recentCalls}</span>
            </div>
          </div>
        </DashboardCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardCard
          title="Recent Calls"
          action={
            <Link href="/dashboard/calls" className="text-sm font-medium text-primary hover:text-primary/80">
              View all
            </Link>
          }
        >
          <div className="space-y-3">
            {recentCalls.map((call) => (
              <div
                key={call.id}
                className="flex items-center justify-between rounded-xl border border-border p-4"
              >
                <div>
                  <p className="font-medium text-foreground">
                    {call.callerName ?? "Unknown Caller"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {call.aiEmployee?.name} · {formatDuration(call.duration)}
                  </p>
                </div>
                <Badge variant="outline">{formatOutcome(call.outcome)}</Badge>
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard title="AI Workforce" description="Top performers">
          <div className="space-y-3">
            {stats.aiEmployees.slice(0, 3).map((employee) => (
              <div
                key={employee.id}
                className="flex items-center justify-between rounded-xl border border-border p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-brand text-sm font-bold text-white">
                    {employee.name[0]}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{employee.name}</p>
                    <p className="text-sm text-muted-foreground">{employee.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-display text-lg font-bold">{employee.callsHandled}</p>
                  <p className="text-xs text-muted-foreground">calls</p>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
