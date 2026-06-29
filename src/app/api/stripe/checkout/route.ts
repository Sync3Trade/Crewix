import { auth } from "@/lib/auth";
import { ensureBusinessForUser } from "@/lib/business";
import { getPlanById, getStripePriceId, type PlanId } from "@/lib/plans";
import { prisma } from "@/lib/prisma";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    if (!isStripeConfigured()) {
      return NextResponse.json(
        { error: "Stripe is not configured" },
        { status: 503 }
      );
    }

    const session = await auth();
    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const planId = body.plan as PlanId;
    const interval = (body.interval as "monthly" | "yearly") ?? "monthly";

    const plan = getPlanById(planId);
    if (!plan || planId === "enterprise") {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const priceId = getStripePriceId(planId, interval);
    if (!priceId) {
      return NextResponse.json(
        { error: "Stripe price not configured for this plan" },
        { status: 503 }
      );
    }

    const business = await ensureBusinessForUser(session.user.id);
    if (!business) {
      return NextResponse.json(
        { error: "Complete onboarding first" },
        { status: 400 }
      );
    }

    const stripe = getStripe();
    const appUrl = process.env.AUTH_URL ?? "http://localhost:3000";

    let stripeCustomerId = business.subscription?.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: session.user.email,
        name: session.user.name ?? undefined,
        metadata: {
          userId: session.user.id,
          businessId: business.id,
        },
      });
      stripeCustomerId = customer.id;

      await prisma.subscription.upsert({
        where: { businessId: business.id },
        create: {
          businessId: business.id,
          stripeCustomerId,
          plan: planId,
          status: "incomplete",
        },
        update: { stripeCustomerId },
      });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        trial_period_days: 14,
        metadata: {
          businessId: business.id,
          planId,
        },
      },
      success_url: `${appUrl}/dashboard/billing?success=true`,
      cancel_url: `${appUrl}/dashboard/billing?canceled=true`,
      metadata: {
        businessId: business.id,
        planId,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
