"use client";

import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Bot,
  CalendarCheck,
  Headphones,
  Mail,
  MessageCircle,
  PhoneForwarded,
  Shield,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Headphones,
    title: "AI Phone Answering",
    description:
      "Every call is answered instantly with natural, human-like conversations tailored to your business.",
    gradient: "from-violet-500 to-indigo-500",
  },
  {
    icon: PhoneForwarded,
    title: "Lead Qualification",
    description:
      "Automatically screen inbound leads, ask the right questions, and route hot prospects to your team.",
    gradient: "from-indigo-500 to-blue-500",
  },
  {
    icon: CalendarCheck,
    title: "Appointment Booking",
    description:
      "Sync with your calendar and let AI employees book, reschedule, and confirm appointments 24/7.",
    gradient: "from-cyan-500 to-teal-500",
  },
  {
    icon: MessageCircle,
    title: "SMS Follow-ups",
    description:
      "Send personalized text message follow-ups that keep leads warm and drive them to take action.",
    gradient: "from-emerald-500 to-green-500",
  },
  {
    icon: Mail,
    title: "Email Automation",
    description:
      "Trigger intelligent email sequences for nurturing leads, confirmations, and post-appointment follow-ups.",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: Bot,
    title: "Custom AI Agents",
    description:
      "Train AI employees on your scripts, FAQs, and brand voice — they learn your business inside and out.",
    gradient: "from-rose-500 to-pink-500",
  },
  {
    icon: Zap,
    title: "Instant Deployment",
    description:
      "Go live in minutes, not months. Connect your phone number and start handling calls the same day.",
    gradient: "from-purple-500 to-violet-500",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "SOC 2 compliant infrastructure with end-to-end encryption to keep your customer data safe.",
    gradient: "from-slate-500 to-zinc-500",
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-24 lg:py-32">
      <Container>
        <SectionHeader
          badge="Features"
          title="Everything your AI workforce needs"
          description="From the first ring to the final follow-up, VertexWork handles the entire customer communication lifecycle so you can focus on growing your business."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group glass-card rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
            >
              <div
                className={cn(
                  "mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg",
                  feature.gradient
                )}
              >
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 font-display text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
