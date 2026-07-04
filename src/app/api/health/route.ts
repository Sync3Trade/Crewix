import { NextResponse } from "next/server";
import {
  getAuthSecret,
  getAuthUrl,
  getDatabaseUrl,
  getMissingProductionEnvVars,
  shouldTrustAuthHost,
} from "@/lib/env";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const missingEnv = getMissingProductionEnvVars();
  const checks: Record<string, unknown> = {
    authSecretConfigured: Boolean(getAuthSecret()),
    databaseUrlConfigured: Boolean(getDatabaseUrl()),
    authUrl: getAuthUrl(),
    trustHost: shouldTrustAuthHost(),
    missingEnv,
  };

  if (missingEnv.length > 0) {
    return NextResponse.json(
      {
        status: "error",
        message: `Missing environment variables: ${missingEnv.join(", ")}`,
        checks,
      },
      { status: 500 }
    );
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = "connected";
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Database connection failed";

    return NextResponse.json(
      {
        status: "error",
        message,
        checks: {
          ...checks,
          database: "failed",
        },
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    status: "ok",
    checks,
  });
}
