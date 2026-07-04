import { execSync } from "node:child_process";

if (!process.env.DATABASE_URL?.trim()) {
  console.error(
    "DATABASE_URL is not set. In Vercel, enable DATABASE_URL for the Build environment."
  );
  process.exit(1);
}

if (!process.env.DIRECT_URL?.trim()) {
  process.env.DIRECT_URL = process.env.DATABASE_URL;
}

console.log("Applying Prisma migrations to production database...");
execSync("npx prisma migrate deploy", { stdio: "inherit" });
console.log("Prisma migrations applied successfully.");
