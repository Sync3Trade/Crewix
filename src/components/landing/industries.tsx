"use client";

import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { motion } from "framer-motion";
import {
  Building2,
  Car,
  Gavel,
  Home,
  Smile,
  Wrench,
} from "lucide-react";

const industries = [
  {
    icon: Gavel,
    name: "Law Firms",
    description:
      "Screen potential clients, schedule consultations, and follow up on case inquiries — without missing a single call.",
    stat: "67% more consultations booked",
    color: "from-slate-600 to-slate-800",
  },
  {
    icon: Wrench,
    name: "HVAC",
    description:
      "Capture emergency service requests, qualify jobs, and book technicians while your team is in the field.",
    stat: "4.1x faster response times",
    color: "from-blue-600 to-cyan-600",
  },
  {
    icon: Home,
    name: "Roofing",
    description:
      "Answer storm-damage calls instantly, schedule free inspections, and send estimate follow-ups automatically.",
    stat: "52% increase in booked inspections",
    color: "from-orange-600 to-amber-600",
  },
  {
    icon: Smile,
    name: "Dental",
    description:
      "Handle appointment scheduling, send reminders, and re-engage patients who haven't visited in months.",
    stat: "38% reduction in no-shows",
    color: "from-teal-600 to-emerald-600",
  },
  {
    icon: Building2,
    name: "Real Estate",
    description:
      "Qualify buyer and seller leads, schedule showings, and nurture prospects through automated follow-ups.",
    stat: "2.8x more qualified leads",
    color: "from-violet-600 to-purple-600",
  },
  {
    icon: Car,
    name: "Auto Dealerships",
    description:
      "Answer sales inquiries, book test drives, and follow up on service appointments around the clock.",
    stat: "45% more test drives scheduled",
    color: "from-red-600 to-rose-600",
  },
];

export function Industries() {
  return (
    <section id="industries" className="relative py-24 lg:py-32">
      <Container>
        <SectionHeader
          badge="Industries"
          title="Built for businesses that live on the phone"
          description="Whether you're a solo practitioner or a multi-location operation, VertexWork adapts to your industry's unique workflows and customer expectations."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry, i) => (
            <motion.div
              key={industry.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
            >
              <div
                className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg ${industry.color}`}
              >
                <industry.icon className="h-6 w-6" />
              </div>

              <h3 className="font-display text-xl font-bold text-foreground">
                {industry.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {industry.description}
              </p>

              <div className="mt-5 flex items-center gap-2 border-t border-border pt-4">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  {industry.stat}
                </span>
              </div>

              <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/5 transition-transform duration-500 group-hover:scale-150" />
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
