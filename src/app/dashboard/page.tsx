import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Sparkles } from "lucide-react";
import { redirect } from "next/navigation";
import { signOutAction } from "./actions";

export const metadata = {
  title: "Dashboard — Crewix",
  description: "Manage your AI workforce",
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (!session.user.onboardingCompleted) {
    redirect("/onboarding");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <Container className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand">
              <span className="font-display text-sm font-bold text-white">C</span>
            </div>
            <span className="font-display text-xl font-bold text-foreground">
              Crewix
            </span>
          </div>
          <form action={signOutAction}>
            <Button variant="outline" size="sm" type="submit">
              Sign out
            </Button>
          </form>
        </Container>
      </header>

      <main className="py-20">
        <Container size="narrow" className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Welcome, {session.user.name?.split(" ")[0] ?? "there"}!
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Your onboarding is complete. The full dashboard is coming in the next
            release.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Signed in as {session.user.email}
          </p>
        </Container>
      </main>
    </div>
  );
}
