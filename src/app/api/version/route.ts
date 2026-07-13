import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    commit: process.env.VERCEL_GIT_COMMIT_SHA ?? "local",
    branch: process.env.VERCEL_GIT_COMMIT_REF ?? "local",
    repo: process.env.VERCEL_GIT_REPO_SLUG ?? "local",
    deployment: process.env.VERCEL_URL ?? "local",
    builtAt: new Date().toISOString(),
  });
}
