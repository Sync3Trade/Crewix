const required = [
  ["AUTH_SECRET", "NEXTAUTH_SECRET"],
  ["DATABASE_URL"],
];

if (!process.env.VERCEL) {
  console.log("Skipping Vercel production environment verification.");
  process.exit(0);
}

const missing = required
  .filter((keys) => !keys.some((key) => process.env[key]?.trim()))
  .map((keys) => keys.join(" or "));

if (missing.length > 0) {
  console.error("Missing required production environment variables:");
  for (const name of missing) {
    console.error(`  - ${name}`);
  }
  console.error(
    "\nSet these in Vercel → Project → Settings → Environment Variables for Production and Preview."
  );
  process.exit(1);
}

console.log("Production environment variables verified.");
