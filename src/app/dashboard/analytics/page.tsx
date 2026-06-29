import { DashboardBarChart, DashboardLineChart } from "@/components/dashboard/charts";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { StatCard } from "@/components/dashboard/stat-card";
import { ensureBusinessForUser, getAnalyticsData } from "@/lib/business";
import { auth } from "@/lib/auth";
import { BarChart3, Clock, Phone, Target } from "lucide-react";
import { redirect } from "next/navigation";

export const metadata = { title: "Analytics — Crewix" };

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const business = await ensureBusinessForUser(session.user.id);
  if (!business) redirect("/onboarding");

  const analytics = await getAnalyticsData(business.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Analytics</h1>
        <p className="mt-1 text-muted-foreground">
          Performance insights across calls, leads, and appointments.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Calls (30d)"
          value={analytics.totalCalls}
          icon={Phone}
        />
        <StatCard
          title="Completed Calls"
          value={analytics.completedCalls}
          icon={BarChart3}
        />
        <StatCard
          title="Conversion Rate"
          value={`${analytics.conversionRate}%`}
          icon={Target}
        />
        <StatCard
          title="Avg Duration"
          value={formatDuration(analytics.avgDuration)}
          icon={Clock}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardCard title="Daily Calls" description="Last 30 days">
          <DashboardLineChart
            data={analytics.dailyCalls}
            dataKey="count"
            color="#6366f1"
          />
        </DashboardCard>

        <DashboardCard title="Daily Appointments" description="Last 30 days">
          <DashboardLineChart
            data={analytics.dailyAppointments}
            dataKey="count"
            color="#06b6d4"
          />
        </DashboardCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardCard title="Call Outcomes" description="Distribution by result">
          <DashboardBarChart
            data={analytics.outcomeBreakdown.map((o) => ({
              date: o.name,
              name: o.name,
              count: o.value,
            }))}
            dataKey="count"
            color="#8b5cf6"
          />
        </DashboardCard>

        <DashboardCard title="Appointment Sources" description="How bookings were made">
          <DashboardBarChart
            data={analytics.sourceBreakdown.map((s) => ({
              date: s.name,
              name: s.name,
              count: s.value,
            }))}
            dataKey="count"
            color="#10b981"
          />
        </DashboardCard>
      </div>
    </div>
  );
}
