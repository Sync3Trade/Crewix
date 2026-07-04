import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { getApiErrorResponse, logApiError } from "@/lib/api-error";
import { assertProductionEnv } from "@/lib/env";
import { sendVerificationEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { generateToken, getTokenExpiry, normalizeEmail } from "@/lib/tokens";
import { signupSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  try {
    assertProductionEnv("Signup");
    const body = await request.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;
    const normalizedEmail = normalizeEmail(email);

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const token = generateToken();

    await prisma.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          name,
          email: normalizedEmail,
          passwordHash,
        },
      });

      await tx.verificationToken.create({
        data: {
          identifier: normalizedEmail,
          token,
          expires: getTokenExpiry(24),
        },
      });
    });

    await sendVerificationEmail(normalizedEmail, token);

    return NextResponse.json({
      message: "Account created. Please check your email to verify your account.",
    });
  } catch (error) {
    logApiError("Signup error", error);
    const { message, details } = getApiErrorResponse(
      error,
      "Something went wrong. Please try again."
    );

    return NextResponse.json(
      { error: message, ...(details ? { details } : {}) },
      { status: 500 }
    );
  }
}
