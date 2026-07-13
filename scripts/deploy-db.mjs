import { execSync } from "node:child_process";

if (!process.env.DATABASE_URL?.trim()) {
  console.error(
    "DATABASE_URL is not set. In Vercel, enable DATABASE_URL for the Build environment."
  );
  process.exit(1);
}

console.log("Applying Prisma migrations to production database...");

try {
  execSync("npx prisma migrate deploy", { stdio: "inherit" });
} catch (error) {
  console.error("prisma migrate deploy failed, falling back to prisma db push");
  console.error(error);
  execSync("npx prisma db push --skip-generate --accept-data-loss", {
    stdio: "inherit",
  });
}

console.log("Prisma schema applied successfully.");
