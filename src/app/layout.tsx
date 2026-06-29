import { AuthSessionProvider } from "@/components/providers/session-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Crewix — Hire AI Employees That Never Sleep",
  description:
    "Crewix helps businesses hire AI employees that answer phone calls, qualify leads, book appointments, and automate customer communication. Start your free trial today.",
  icons: {
    icon: "/icon.svg",
  },
  keywords: [
    "AI employees",
    "AI phone answering",
    "lead qualification",
    "appointment booking",
    "customer communication automation",
    "SaaS",
  ],
  openGraph: {
    title: "Crewix — Hire AI Employees That Never Sleep",
    description:
      "Deploy AI-powered team members that answer calls, qualify leads, book appointments, and follow up — 24/7.",
    type: "website",
    siteName: "Crewix",
  },
  twitter: {
    card: "summary_large_image",
    title: "Crewix — Hire AI Employees That Never Sleep",
    description:
      "Deploy AI-powered team members that answer calls, qualify leads, book appointments, and follow up — 24/7.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body
        className={`${inter.variable} ${plusJakarta.variable} min-h-full font-sans antialiased`}
      >
        <ThemeProvider>
          <AuthSessionProvider>{children}</AuthSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
