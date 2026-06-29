import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { Badge } from "@/components/ui/badge";
import { ensureBusinessForUser, getAppointments } from "@/lib/business";
import { auth } from "@/lib/auth";
import { Calendar } from "lucide-react";
import { redirect } from "next/navigation";

export const metadata = { title: "Appointments — Crewix" };

function formatStatus(status: string) {
  return status.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function statusColor(status: string) {
  const map: Record<string, string> = {
    scheduled: "bg-primary/10 text-primary",
    completed: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    cancelled: "bg-red-500/10 text-red-600 dark:text-red-400",
    no_show: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  };
  return map[status] ?? "bg-muted text-muted-foreground";
}

export default async function AppointmentsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const business = await ensureBusinessForUser(session.user.id);
  if (!business) redirect("/onboarding");

  const appointments = await getAppointments(business.id);
  const upcoming = appointments.filter(
    (a) => a.status === "scheduled" && a.scheduledAt >= new Date()
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">
          Appointments
        </h1>
        <p className="mt-1 text-muted-foreground">
          Appointments booked and managed by your AI employees.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Upcoming</p>
          <p className="mt-1 font-display text-3xl font-bold text-foreground">
            {upcoming.length}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Total Booked</p>
          <p className="mt-1 font-display text-3xl font-bold text-foreground">
            {appointments.length}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Completed</p>
          <p className="mt-1 font-display text-3xl font-bold text-foreground">
            {appointments.filter((a) => a.status === "completed").length}
          </p>
        </div>
      </div>

      <DashboardCard title="All Appointments" description="Sorted by date">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-3 pr-4 font-medium">Customer</th>
                <th className="pb-3 pr-4 font-medium">Service</th>
                <th className="pb-3 pr-4 font-medium">AI Employee</th>
                <th className="pb-3 pr-4 font-medium">Source</th>
                <th className="pb-3 pr-4 font-medium">Status</th>
                <th className="pb-3 font-medium">Scheduled</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((apt) => (
                <tr key={apt.id} className="border-b border-border/50">
                  <td className="py-4 pr-4">
                    <div>
                      <p className="font-medium text-foreground">{apt.customerName}</p>
                      <p className="text-xs text-muted-foreground">
                        {apt.customerPhone ?? "—"}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 pr-4 text-muted-foreground">
                    {apt.service ?? "—"}
                  </td>
                  <td className="py-4 pr-4 text-muted-foreground">
                    {apt.aiEmployee?.name ?? "—"}
                  </td>
                  <td className="py-4 pr-4">
                    <Badge variant="outline">{apt.source ?? "—"}</Badge>
                  </td>
                  <td className="py-4 pr-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor(apt.status)}`}
                    >
                      {formatStatus(apt.status)}
                    </span>
                  </td>
                  <td className="py-4 text-muted-foreground">
                    {apt.scheduledAt.toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {appointments.length === 0 && (
            <div className="flex flex-col items-center py-12 text-center">
              <Calendar className="mb-3 h-10 w-10 text-muted-foreground" />
              <p className="text-muted-foreground">No appointments yet</p>
            </div>
          )}
        </div>
      </DashboardCard>
    </div>
  );
}
