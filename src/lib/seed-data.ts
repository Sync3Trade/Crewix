import { prisma } from "@/lib/prisma";

const CALLER_NAMES = [
  "Sarah Mitchell",
  "Mike Torres",
  "James Whitfield",
  "Lisa Chen",
  "David Park",
  "Rachel Adams",
  "Tom Bradley",
  "Emily Watson",
  "Chris Nguyen",
  "Amanda Foster",
];

const SERVICES: Record<string, string[]> = {
  law: ["Consultation", "Case Review", "Document Signing"],
  hvac: ["AC Repair", "Furnace Service", "Maintenance Check"],
  roofing: ["Roof Inspection", "Storm Damage Assessment", "Estimate"],
  dental: ["Cleaning", "Checkup", "Whitening Consultation"],
  "real-estate": ["Property Showing", "Buyer Consultation", "Listing Review"],
  auto: ["Test Drive", "Service Appointment", "Trade-in Evaluation"],
  other: ["Consultation", "Service Call", "Follow-up Meeting"],
};

export async function seedBusinessData(
  businessId: string,
  industry: string
) {
  const services = SERVICES[industry] ?? SERVICES.other;

  const aiEmployees = await Promise.all([
    prisma.aiEmployee.create({
      data: {
        businessId,
        name: "Alex",
        role: "Phone Agent",
        status: "active",
        callsHandled: 142,
        leadsQualified: 67,
        appointmentsBooked: 34,
      },
    }),
    prisma.aiEmployee.create({
      data: {
        businessId,
        name: "Jordan",
        role: "Scheduler",
        status: "active",
        callsHandled: 98,
        leadsQualified: 45,
        appointmentsBooked: 52,
      },
    }),
    prisma.aiEmployee.create({
      data: {
        businessId,
        name: "Taylor",
        role: "Follow-up Specialist",
        status: "active",
        callsHandled: 76,
        leadsQualified: 38,
        appointmentsBooked: 28,
      },
    }),
  ]);

  const now = new Date();
  const calls = [];
  const appointments = [];
  const revenueRecords = [];

  for (let i = 0; i < 45; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const createdAt = new Date(now);
    createdAt.setDate(createdAt.getDate() - daysAgo);
    createdAt.setHours(
      8 + Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 60)
    );

    const employee =
      aiEmployees[Math.floor(Math.random() * aiEmployees.length)];
    const outcomes = [
      "qualified",
      "appointment_booked",
      "transferred",
      "follow_up",
      "voicemail",
    ];
    const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];
    const duration = 60 + Math.floor(Math.random() * 420);

    calls.push({
      businessId,
      aiEmployeeId: employee.id,
      callerName: CALLER_NAMES[i % CALLER_NAMES.length],
      callerPhone: `(${String(200 + (i % 800)).padStart(3, "0")}) ${String(100 + (i % 900)).padStart(3, "0")}-${String(1000 + i).slice(-4)}`,
      duration,
      status: outcome === "voicemail" ? "voicemail" : "completed",
      outcome,
      summary: `Inbound inquiry handled by ${employee.name}`,
      createdAt,
    });
  }

  for (let i = 0; i < 25; i++) {
    const daysOffset = Math.floor(Math.random() * 14) - 3;
    const scheduledAt = new Date(now);
    scheduledAt.setDate(scheduledAt.getDate() + daysOffset);
    scheduledAt.setHours(9 + (i % 7), (i % 4) * 15);

    const employee =
      aiEmployees[Math.floor(Math.random() * aiEmployees.length)];
    const statuses =
      daysOffset < 0
        ? ["completed", "completed", "no_show", "cancelled"]
        : ["scheduled"];

    appointments.push({
      businessId,
      aiEmployeeId: employee.id,
      customerName: CALLER_NAMES[(i + 3) % CALLER_NAMES.length],
      customerPhone: `(555) ${String(200 + i).padStart(3, "0")}-${String(1000 + i).slice(-4)}`,
      service: services[i % services.length],
      scheduledAt,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      source: ["ai_call", "sms", "email"][i % 3],
    });
  }

  for (let i = 0; i < 30; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const amount = 150 + Math.floor(Math.random() * 850);

    revenueRecords.push({
      businessId,
      date,
      amount,
      source: ["appointment", "lead_conversion"][i % 2],
      description:
        i % 2 === 0 ? "Service appointment revenue" : "Converted lead revenue",
    });
  }

  await prisma.call.createMany({ data: calls });
  await prisma.appointment.createMany({ data: appointments });
  await prisma.revenueRecord.createMany({ data: revenueRecords });
}
