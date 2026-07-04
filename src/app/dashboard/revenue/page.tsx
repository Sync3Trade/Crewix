import { DashboardLineChart } from "@/components/dashboard/charts";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { StatCard } from "@/components/dashboard/stat-card";
import { ensureBusinessForUser, getDashboardStats, getRevenueRecords } from "@/lib/business";
import { formatCurrency } from "@/lib/plans";
import { auth } from "@/lib/auth";
import { DollarSign, TrendingUp } from "lucide-react";
import { redirect } from "next/navigation";

export const metadata = { title: "Revenue — VertexWork" };

export default async function RevenuePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const business = await ensureBusinessForUser(session.user.id);
  if (!business) redirect("/onboarding");

  const [stats, records] = await Promise.all([
    getDashboardStats(business.id),
    getRevenueRecords(business.id),
  ]);

  const chartData = stats.revenueByDay.map((r) => ({
    date: new Date(r.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    amount: r.amount,
  }));

  const avgDaily =
    chartData.length > 0
      ? chartData.reduce((s, d) => s + (d.amount ?? 0), 0) / chartData.length
      : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Revenue</h1>
        <p className="mt-1 text-muted-foreground">
          Track revenue generated from AI-booked appointments and converted leads.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          icon={DollarSign}
        />
        <StatCard
          title="Last 30 Days"
          value={formatCurrency(stats.monthlyRevenue)}
          changeType="positive"
          icon={TrendingUp}
        />
        <StatCard
          title="Daily Average"
          value={formatCurrency(avgDaily)}
          icon={DollarSign}
        />
      </div>

      <DashboardCard title="Revenue Over Time" description="Last 30 days">
        <DashboardLineChart
          data={chartData}
          dataKey="amount"
          color="#06b6d4"
          formatValue={(v) => formatCurrency(v)}
        />
      </DashboardCard>

      <DashboardCard title="Revenue Records" description="Individual transactions">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-3 pr-4 font-medium">Date</th>
                <th className="pb-3 pr-4 font-medium">Description</th>
                <th className="pb-3 pr-4 font-medium">Source</th>
                <th className="pb-3 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id} className="border-b border-border/50">
                  <td className="py-4 pr-4 text-muted-foreground">
                    {record.date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-4 pr-4 text-foreground">
                    {record.description ?? "—"}
                  </td>
                  <td className="py-4 pr-4 text-muted-foreground">
                    {record.source?.replace("_", " ") ?? "—"}
                  </td>
                  <td className="py-4 text-right font-medium text-foreground">
                    {formatCurrency(Number(record.amount))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardCard>
    </div>
  );
}
