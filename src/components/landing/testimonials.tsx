"use client";

import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "We were missing 40% of our inbound calls before VertexWork. Now every call gets answered, qualified, and booked. Our appointment volume has nearly doubled in two months.",
    author: "Sarah Mitchell",
    role: "Owner",
    company: "Mitchell Dental Group",
    avatar: "SM",
    rating: 5,
  },
  {
    quote:
      "During storm season, our phones ring off the hook. VertexWork handles the overflow flawlessly — scheduling inspections and sending follow-ups while our crew is on rooftops.",
    author: "Mike Torres",
    role: "Operations Director",
    company: "Summit Roofing Co.",
    avatar: "MT",
    rating: 5,
  },
  {
    quote:
      "As a solo attorney, I can't be on the phone all day. VertexWork screens every inquiry, books consultations, and only sends me the cases worth my time. Game changer.",
    author: "James Whitfield",
    role: "Managing Partner",
    company: "Whitfield & Associates",
    avatar: "JW",
    rating: 5,
  },
  {
    quote:
      "We deployed VertexWork across three dealership locations in one afternoon. Test drive bookings are up 45% and our BDC team can finally focus on closing instead of answering.",
    author: "Lisa Chen",
    role: "General Manager",
    company: "Prestige Auto Group",
    avatar: "LC",
    rating: 5,
  },
  {
    quote:
      "The ROI was immediate. One AI employee costs less than a part-time receptionist but handles 10x the volume. Our lead response time went from hours to seconds.",
    author: "David Park",
    role: "CEO",
    company: "ComfortZone HVAC",
    avatar: "DP",
    rating: 5,
  },
  {
    quote:
      "VertexWork understands real estate. It qualifies buyers, schedules showings, and nurtures leads with personalized follow-ups. My agents love having a tireless assistant.",
    author: "Rachel Adams",
    role: "Broker Owner",
    company: "Adams Realty Partners",
    avatar: "RA",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-muted/40 py-24 lg:py-32">
      <Container>
        <SectionHeader
          badge="Testimonials"
          title="Trusted by businesses nationwide"
          description="See why thousands of business owners are hiring AI employees to transform their customer communication."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex flex-col rounded-2xl border border-border bg-card p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <Quote className="h-8 w-8 text-primary/30" />
                <div className="flex gap-0.5">
                  {Array.from({ length: testimonial.rating }).map((_, j) => (
                    <Star
                      key={j}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
              </div>

              <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-brand text-xs font-bold text-white">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {testimonial.author}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
