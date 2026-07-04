"use client";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  Mail,
  MessageSquare,
  Phone,
  Sparkles,
  TrendingUp,
} from "lucide-react";

const stats = [
  { value: "24/7", label: "Always available" },
  { value: "3.2x", label: "More leads captured" },
  { value: "<2s", label: "Average response time" },
  { value: "98%", label: "Customer satisfaction" },
];

const activityItems = [
  {
    icon: Phone,
    title: "Inbound call answered",
    detail: "Qualified lead for Johnson HVAC",
    time: "Just now",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Calendar,
    title: "Appointment booked",
    detail: "Dental cleaning — Tue 2:30 PM",
    time: "2m ago",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: MessageSquare,
    title: "Follow-up SMS sent",
    detail: "Roofing estimate reminder",
    time: "5m ago",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: Mail,
    title: "Email sequence triggered",
    detail: "New real estate inquiry nurture",
    time: "8m ago",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-20 lg:pt-36 lg:pb-32">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
      <div className="glow-orb animate-pulse-glow pointer-events-none absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-primary" />
      <div className="glow-orb animate-pulse-glow pointer-events-none absolute top-20 right-1/4 h-80 w-80 rounded-full bg-accent" />

      <Container className="relative">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="gradient" className="mb-6">
              <Sparkles className="h-3 w-3" />
              Now hiring AI employees for your business
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-7xl"
          >
            Hire AI Employees{" "}
            <span className="text-gradient">That Never Sleep</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
          >
            VertexWork deploys AI-powered team members that answer calls, qualify
            leads, book appointments, and follow up — so your business never
            misses an opportunity.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button size="lg" href="#pricing">
              Start Free Trial
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" href="#how-it-works">
              See How It Works
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-4 text-sm text-muted-foreground"
          >
            14-day free trial · No credit card required · Setup in minutes
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="relative mx-auto mt-16 max-w-5xl"
        >
          <div className="glass-card overflow-hidden rounded-2xl shadow-2xl shadow-primary/10">
            <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-amber-400" />
              <div className="h-3 w-3 rounded-full bg-emerald-400" />
              <span className="ml-2 text-xs font-medium text-muted-foreground">
                VertexWork Command Center
              </span>
              <div className="ml-auto flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400">
                  4 AI agents active
                </span>
              </div>
            </div>

            <div className="grid gap-0 md:grid-cols-5">
              <div className="border-b border-border p-6 md:col-span-2 md:border-b-0 md:border-r">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">
                    Today&apos;s Performance
                  </h3>
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Calls handled", value: "47" },
                    { label: "Leads qualified", value: "23" },
                    { label: "Appointments", value: "12" },
                    { label: "Follow-ups sent", value: "38" },
                  ].map((metric) => (
                    <div
                      key={metric.label}
                      className="rounded-xl bg-muted/60 p-3"
                    >
                      <p className="text-2xl font-bold text-foreground">
                        {metric.value}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {metric.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 md:col-span-3">
                <h3 className="mb-4 text-sm font-semibold text-foreground">
                  Live Activity
                </h3>
                <div className="space-y-3">
                  {activityItems.map((item, i) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + i * 0.15 }}
                      className="flex items-center gap-3 rounded-xl bg-muted/40 p-3"
                    >
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${item.bg}`}
                      >
                        <item.icon className={`h-4 w-4 ${item.color}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {item.title}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {item.detail}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {item.time}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-4"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-3xl font-bold text-gradient sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
