import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { Badge } from "@/components/ui/badge";
import { ensureBusinessForUser, getCalls } from "@/lib/business";
import { auth } from "@/lib/auth";
import { Phone } from "lucide-react";
import { redirect } from "next/navigation";

export const metadata = { title: "Calls — VertexWork" };

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function formatOutcome(outcome: string | null) {
  const map: Record<string, string> = {
    qualified: "Qualified Lead",
    appointment_booked: "Appointment Booked",
    transferred: "Transferred",
    follow_up: "Follow-up",
    voicemail: "Voicemail",
  };
  return map[outcome ?? ""] ?? "—";
}

function statusVariant(status: string) {
  if (status === "completed") return "default" as const;
  if (status === "missed") return "outline" as const;
  return "outline" as const;
}

export default async function CallsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const business = await ensureBusinessForUser(session.user.id);
  if (!business) redirect("/onboarding");

  const calls = await getCalls(business.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Calls</h1>
        <p className="mt-1 text-muted-foreground">
          All inbound and outbound calls handled by your AI employees.
        </p>
      </div>

      <DashboardCard title={`${calls.length} calls`} description="Most recent first">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-3 pr-4 font-medium">Caller</th>
                <th className="pb-3 pr-4 font-medium">AI Employee</th>
                <th className="pb-3 pr-4 font-medium">Duration</th>
                <th className="pb-3 pr-4 font-medium">Outcome</th>
                <th className="pb-3 pr-4 font-medium">Status</th>
                <th className="pb-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {calls.map((call) => (
                <tr key={call.id} className="border-b border-border/50">
                  <td className="py-4 pr-4">
                    <div>
                      <p className="font-medium text-foreground">
                        {call.callerName ?? "Unknown"}
                      </p>
                      <p className="text-xs text-muted-foreground">{call.callerPhone}</p>
                    </div>
                  </td>
                  <td className="py-4 pr-4 text-muted-foreground">
                    {call.aiEmployee?.name ?? "—"}
                  </td>
                  <td className="py-4 pr-4 text-muted-foreground">
                    {formatDuration(call.duration)}
                  </td>
                  <td className="py-4 pr-4">
                    <Badge variant="gradient">{formatOutcome(call.outcome)}</Badge>
                  </td>
                  <td className="py-4 pr-4">
                    <Badge variant={statusVariant(call.status)}>{call.status}</Badge>
                  </td>
                  <td className="py-4 text-muted-foreground">
                    {call.createdAt.toLocaleDateString("en-US", {
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
          {calls.length === 0 && (
            <div className="flex flex-col items-center py-12 text-center">
              <Phone className="mb-3 h-10 w-10 text-muted-foreground" />
              <p className="text-muted-foreground">No calls yet</p>
            </div>
          )}
        </div>
      </DashboardCard>
    </div>
  );
}
