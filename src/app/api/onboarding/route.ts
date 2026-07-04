import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { ensureBusinessForUser } from "@/lib/business";
import { sendWelcomeEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const onboarding = await prisma.onboarding.findUnique({
    where: { userId: session.user.id },
  });

  return NextResponse.json({ onboarding });
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { step, data, complete } = body as {
      step?: number;
      data?: Record<string, unknown>;
      complete?: boolean;
    };

    const updateData: Record<string, unknown> = {};

    if (data?.companyName !== undefined) updateData.companyName = data.companyName;
    if (data?.website !== undefined) updateData.website = data.website || null;
    if (data?.industry !== undefined) updateData.industry = data.industry;
    if (data?.teamSize !== undefined) updateData.teamSize = data.teamSize;
    if (data?.primaryGoals !== undefined) updateData.primaryGoals = data.primaryGoals;
    if (data?.phoneNumber !== undefined) updateData.phoneNumber = data.phoneNumber;
    if (step !== undefined) updateData.currentStep = step;

    if (complete) {
      updateData.completedAt = new Date();
      updateData.currentStep = 6;
    }

    const onboarding = await prisma.onboarding.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        ...updateData,
      },
      update: updateData,
    });

    if (complete && session.user.email && session.user.name) {
      await ensureBusinessForUser(session.user.id);
      await sendWelcomeEmail(session.user.email, session.user.name);
    }

    return NextResponse.json({ onboarding });
  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
