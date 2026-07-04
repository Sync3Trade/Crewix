"use client";

import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { motion } from "framer-motion";
import { ArrowRight, Bot, Plug, Rocket, Settings } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Plug,
    title: "Connect your business",
    description:
      "Link your phone number, calendar, and CRM in a few clicks. VertexWork integrates with the tools you already use.",
  },
  {
    step: "02",
    icon: Settings,
    title: "Configure your AI employees",
    description:
      "Customize scripts, qualification criteria, and booking rules. Your AI team learns your brand voice and processes.",
  },
  {
    step: "03",
    icon: Bot,
    title: "Deploy and go live",
    description:
      "Activate your AI workforce instantly. They start answering calls, qualifying leads, and booking appointments immediately.",
  },
  {
    step: "04",
    icon: Rocket,
    title: "Scale without limits",
    description:
      "Handle 10 calls or 10,000 — your AI employees scale effortlessly. Monitor performance and optimize from your dashboard.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-muted/40 py-24 lg:py-32"
    >
      <div className="glow-orb pointer-events-none absolute -right-32 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-primary" />

      <Container className="relative">
        <SectionHeader
          badge="How It Works"
          title="Go live in four simple steps"
          description="No engineering team required. Most businesses are up and running with VertexWork in under 15 minutes."
        />

        <div className="relative">
          <div className="absolute left-8 top-0 hidden h-full w-px bg-gradient-to-b from-primary via-accent to-transparent lg:left-1/2 lg:block lg:-translate-x-px" />

          <div className="space-y-12 lg:space-y-24">
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative flex flex-col gap-8 lg:flex-row lg:items-center ${
                  i % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className="flex-1 lg:text-right">
                  <div
                    className={`${i % 2 === 1 ? "lg:text-left" : "lg:text-right"}`}
                  >
                    <span className="font-display text-sm font-bold text-primary">
                      Step {step.step}
                    </span>
                    <h3 className="mt-2 font-display text-2xl font-bold text-foreground sm:text-3xl">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                <div className="relative z-10 flex shrink-0 justify-center lg:w-16">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-brand shadow-lg shadow-primary/25">
                    <step.icon className="h-7 w-7 text-white" />
                  </div>
                </div>

                <div className="hidden flex-1 lg:block" />
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <a
            href="#pricing"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            Ready to get started?
            <ArrowRight className="h-4 w-4" />
          </a>
        </motion.div>
      </Container>
    </section>
  );
}
