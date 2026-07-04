function readEnv(...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = process.env[key]?.trim();
    if (value) {
      return value;
    }
  }

  return undefined;
}

export function getAuthSecret(): string | undefined {
  return readEnv("AUTH_SECRET", "NEXTAUTH_SECRET");
}

export function getAuthUrl(): string {
  const configured = readEnv("AUTH_URL", "NEXTAUTH_URL");
  if (configured) {
    return configured.replace(/\/$/, "");
  }

  const vercelUrl = readEnv("VERCEL_URL");
  if (vercelUrl) {
    return `https://${vercelUrl}`;
  }

  return "http://localhost:3000";
}

export function shouldTrustAuthHost(): boolean {
  const explicit = readEnv("AUTH_TRUST_HOST");
  if (explicit === "true") return true;
  if (explicit === "false") return false;

  return Boolean(process.env.VERCEL) || process.env.NODE_ENV !== "production";
}

export function getDatabaseUrl(): string | undefined {
  return readEnv("DATABASE_URL");
}

export function getMissingProductionEnvVars(): string[] {
  const missing: string[] = [];

  if (!getAuthSecret()) {
    missing.push("AUTH_SECRET (or NEXTAUTH_SECRET)");
  }

  if (!getDatabaseUrl()) {
    missing.push("DATABASE_URL");
  }

  return missing;
}

export function assertProductionEnv(context: string) {
  if (process.env.NODE_ENV !== "production") {
    return;
  }

  const missing = getMissingProductionEnvVars();
  if (missing.length === 0) {
    return;
  }

  throw new Error(
    `${context}: missing required environment variable(s): ${missing.join(", ")}`
  );
}
