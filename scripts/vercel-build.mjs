import { execSync } from "node:child_process";

function run(command, label) {
  console.log("");
  console.log("============================================================");
  console.log(label);
  console.log(`> ${command}`);
  console.log("============================================================");
  execSync(command, { stdio: "inherit" });
}

if (!process.env.DATABASE_URL?.trim()) {
  console.error(
    "DATABASE_URL is not set. In Vercel, enable DATABASE_URL for the Build environment."
  );
  process.exit(1);
}

run("npx prisma generate", "STEP 1/4: prisma generate");

try {
  run("npx prisma migrate deploy", "STEP 2/4: prisma migrate deploy");
} catch (error) {
  console.error("prisma migrate deploy failed, falling back to prisma db push");
  console.error(error);
  run(
    "npx prisma db push --skip-generate --accept-data-loss",
    "STEP 2b/4: prisma db push (fallback)"
  );
}

run("npx next build", "STEP 3/4: next build");

console.log("");
console.log("Vercel build completed: database schema applied and app built.");
