import { PrismaClient } from "@prisma/client";
import { assertProductionEnv, getDatabaseUrl } from "@/lib/env";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  if (process.env.NODE_ENV === "production") {
    assertProductionEnv("Prisma");
  }

  const databaseUrl = getDatabaseUrl();
  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is not set. Add a PostgreSQL connection string to your environment variables."
    );
  }

  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
