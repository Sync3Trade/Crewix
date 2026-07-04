"use client";

import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "What exactly is an AI employee?",
    answer:
      "An AI employee is a virtual team member powered by advanced language models that can handle real business tasks — answering phone calls, qualifying leads, booking appointments, and sending follow-up messages. They work 24/7, never call in sick, and scale instantly with your demand.",
  },
  {
    question: "How natural do the phone conversations sound?",
    answer:
      "VertexWork uses state-of-the-art voice AI that delivers human-like conversations with natural pauses, tone variation, and contextual understanding. Most callers can't tell they're speaking with AI. You can also customize the voice, personality, and script to match your brand.",
  },
  {
    question: "How long does setup take?",
    answer:
      "Most businesses are fully operational within 15 minutes. Connect your phone number, configure your AI employee's scripts and rules, and you're live. Our onboarding wizard walks you through every step, and our support team is available if you need help.",
  },
  {
    question: "Can I use my existing phone number?",
    answer:
      "Yes. VertexWork works with your existing business phone number through call forwarding or direct integration with supported VoIP providers. You can also provision a new number through VertexWork if you prefer a dedicated line for AI-handled calls.",
  },
  {
    question: "What integrations do you support?",
    answer:
      "VertexWork integrates with popular CRMs (HubSpot, Salesforce, Zoho), calendar systems (Google Calendar, Outlook, Calendly), and communication tools. Enterprise plans include API access for custom integrations with your existing tech stack.",
  },
  {
    question: "Is my customer data secure?",
    answer:
      "Absolutely. VertexWork is built on SOC 2 compliant infrastructure with end-to-end encryption for all calls and data. We never sell or share your customer data. Enterprise plans include additional security features like SSO, audit logs, and data residency options.",
  },
  {
    question: "What happens during the free trial?",
    answer:
      "You get full access to your chosen plan for 14 days with no credit card required. Set up your AI employees, handle real calls, and see the results before you commit. At the end of the trial, choose a plan or your account pauses — no surprise charges.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. All plans are month-to-month with no long-term contracts. Cancel anytime from your dashboard. If you're on an annual plan, you'll retain access through the end of your billing period.",
  },
];

function FaqItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-border">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
        aria-expanded={isOpen}
      >
        <span className="font-medium text-foreground">{question}</span>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm leading-relaxed text-muted-foreground">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 lg:py-32">
      <Container size="narrow">
        <SectionHeader
          badge="FAQ"
          title="Frequently asked questions"
          description="Everything you need to know about hiring AI employees with VertexWork."
        />

        <div className="rounded-2xl border border-border bg-card px-6">
          {faqs.map((faq, i) => (
            <FaqItem
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
