import { NextResponse } from "next/server";
import { sendPasswordResetEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { generateToken, getTokenExpiry, normalizeEmail } from "@/lib/tokens";
import { forgotPasswordSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = forgotPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const email = normalizeEmail(parsed.data.email);
    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      await prisma.passwordResetToken.deleteMany({ where: { email } });

      const token = generateToken();

      await prisma.passwordResetToken.create({
        data: {
          email,
          token,
          expires: getTokenExpiry(1),
        },
      });

      await sendPasswordResetEmail(email, token);
    }

    return NextResponse.json({
      message:
        "If an account exists with that email, we've sent password reset instructions.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
