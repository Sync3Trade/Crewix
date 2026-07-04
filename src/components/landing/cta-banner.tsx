"use client";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export function CtaBanner() {
  return (
    <section className="py-24 lg:py-32">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-brand px-8 py-16 text-center sm:px-16 lg:py-20"
        >
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
          <div className="glow-orb pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-full bg-white" />
          <div className="glow-orb pointer-events-none absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-white" />

          <div className="relative">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              Start your 14-day free trial
            </div>

            <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Your next hire is an AI employee
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
              Join thousands of businesses using Crewix to capture every lead,
              book more appointments, and deliver exceptional customer
              experiences — around the clock.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                href="#pricing"
                className="bg-white text-primary shadow-xl hover:brightness-110"
              >
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                href="#"
                className="border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
              >
                Talk to Sales
              </Button>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
