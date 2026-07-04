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

if (!process.env.DIRECT_URL?.trim()) {
  process.env.DIRECT_URL = process.env.DATABASE_URL;
}

run("npx prisma generate", "STEP 1/3: prisma generate");
run("npx prisma migrate deploy", "STEP 2/3: prisma migrate deploy");
run("npx next build", "STEP 3/3: next build");

console.log("");
console.log("Vercel build completed: migrations applied and app built.");
