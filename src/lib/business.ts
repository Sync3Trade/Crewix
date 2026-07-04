import { prisma } from "@/lib/prisma";
import { seedBusinessData } from "@/lib/seed-data";

export async function getBusinessForUser(userId: string) {
  return prisma.business.findUnique({
    where: { userId },
    include: {
      subscription: true,
      aiEmployees: { orderBy: { createdAt: "asc" } },
    },
  });
}

export async function ensureBusinessForUser(userId: string) {
  const existing = await getBusinessForUser(userId);
  if (existing) return existing;

  const onboarding = await prisma.onboarding.findUnique({
    where: { userId },
  });

  if (!onboarding?.completedAt) return null;

  const business = await prisma.business.create({
    data: {
      userId,
      name: onboarding.companyName ?? "My Business",
      industry: onboarding.industry,
      phone: onboarding.phoneNumber,
      website: onboarding.website,
    },
    include: {
      subscription: true,
      aiEmployees: true,
    },
  });

  await seedBusinessData(business.id, onboarding.industry ?? "other");

  return prisma.business.findUnique({
    where: { id: business.id },
    include: {
      subscription: true,
      aiEmployees: { orderBy: { createdAt: "asc" } },
    },
  });
}

export async function getDashboardStats(businessId: string) {
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [
    totalCalls,
    recentCalls,
    totalAppointments,
    upcomingAppointments,
    aiEmployees,
    revenueAgg,
    recentRevenue,
    callsByDay,
    revenueByDay,
  ] = await Promise.all([
    prisma.call.count({ where: { businessId } }),
    prisma.call.count({
      where: { businessId, createdAt: { gte: sevenDaysAgo } },
    }),
    prisma.appointment.count({ where: { businessId } }),
    prisma.appointment.count({
      where: {
        businessId,
        scheduledAt: { gte: now },
        status: "scheduled",
      },
    }),
    prisma.aiEmployee.findMany({
      where: { businessId },
      orderBy: { callsHandled: "desc" },
    }),
    prisma.revenueRecord.aggregate({
      where: { businessId },
      _sum: { amount: true },
    }),
    prisma.revenueRecord.aggregate({
      where: { businessId, date: { gte: thirtyDaysAgo } },
      _sum: { amount: true },
    }),
    prisma.call.groupBy({
      by: ["createdAt"],
      where: { businessId, createdAt: { gte: thirtyDaysAgo } },
      _count: true,
    }),
    prisma.revenueRecord.findMany({
      where: { businessId, date: { gte: thirtyDaysAgo } },
      orderBy: { date: "asc" },
    }),
  ]);

  const totalRevenue = Number(revenueAgg._sum.amount ?? 0);
  const monthlyRevenue = Number(recentRevenue._sum.amount ?? 0);

  const leadsQualified = await prisma.call.count({
    where: {
      businessId,
      outcome: { in: ["qualified", "appointment_booked"] },
      createdAt: { gte: thirtyDaysAgo },
    },
  });

  const avgCallDuration = await prisma.call.aggregate({
    where: { businessId, createdAt: { gte: thirtyDaysAgo } },
    _avg: { duration: true },
  });

  return {
    totalCalls,
    recentCalls,
    totalAppointments,
    upcomingAppointments,
    aiEmployees,
    activeAiEmployees: aiEmployees.filter((e) => e.status === "active").length,
    totalRevenue,
    monthlyRevenue,
    leadsQualified,
    avgCallDuration: Math.round(avgCallDuration._avg.duration ?? 0),
    callsByDay,
    revenueByDay: revenueByDay.map((r) => ({
      date: r.date.toISOString().split("T")[0],
      amount: Number(r.amount),
    })),
  };
}

export async function getCalls(businessId: string, limit = 50) {
  return prisma.call.findMany({
    where: { businessId },
    include: { aiEmployee: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getAppointments(businessId: string, limit = 50) {
  return prisma.appointment.findMany({
    where: { businessId },
    include: { aiEmployee: { select: { name: true } } },
    orderBy: { scheduledAt: "desc" },
    take: limit,
  });
}

export async function getRevenueRecords(businessId: string, limit = 90) {
  return prisma.revenueRecord.findMany({
    where: { businessId },
    orderBy: { date: "desc" },
    take: limit,
  });
}

export async function getAnalyticsData(businessId: string) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [calls, appointments, outcomes] = await Promise.all([
    prisma.call.findMany({
      where: { businessId, createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true, outcome: true, duration: true, status: true },
    }),
    prisma.appointment.findMany({
      where: { businessId, createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true, status: true, source: true },
    }),
    prisma.call.groupBy({
      by: ["outcome"],
      where: { businessId, createdAt: { gte: thirtyDaysAgo } },
      _count: true,
    }),
  ]);

  const dailyCalls = buildDailySeries(calls.map((c) => c.createdAt), 30);
  const dailyAppointments = buildDailySeries(
    appointments.map((a) => a.createdAt),
    30
  );

  const outcomeBreakdown = outcomes.map((o) => ({
    name: formatOutcome(o.outcome),
    value: o._count,
  }));

  const sourceBreakdown = appointments.reduce<Record<string, number>>(
    (acc, apt) => {
      const key = apt.source ?? "other";
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    },
    {}
  );

  return {
    dailyCalls,
    dailyAppointments,
    outcomeBreakdown,
    sourceBreakdown: Object.entries(sourceBreakdown).map(([name, value]) => ({
      name: formatSource(name),
      value,
    })),
    totalCalls: calls.length,
    completedCalls: calls.filter((c) => c.status === "completed").length,
    avgDuration: calls.length
      ? Math.round(calls.reduce((s, c) => s + c.duration, 0) / calls.length)
      : 0,
    conversionRate: calls.length
      ? Math.round(
          (calls.filter((c) =>
            ["qualified", "appointment_booked"].includes(c.outcome ?? "")
          ).length /
            calls.length) *
            100
        )
      : 0,
  };
}

function buildDailySeries(dates: Date[], days: number) {
  const result: { date: string; count: number }[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    const count = dates.filter(
      (date) => date.toISOString().split("T")[0] === key
    ).length;
    result.push({
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      count,
    });
  }

  return result;
}

function formatOutcome(outcome: string | null) {
  const map: Record<string, string> = {
    qualified: "Qualified Lead",
    appointment_booked: "Appointment Booked",
    transferred: "Transferred",
    follow_up: "Follow-up Needed",
    voicemail: "Voicemail",
  };
  return map[outcome ?? ""] ?? "Other";
}

function formatSource(source: string) {
  const map: Record<string, string> = {
    ai_call: "AI Call",
    sms: "SMS",
    email: "Email",
    other: "Other",
  };
  return map[source] ?? source;
}
