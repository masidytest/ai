import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { plan, annual } = await req.json();

    const prices: Record<string, { monthly: number; annual: number }> = {
      Pro: { monthly: 4900, annual: 3900 }, // in cents
    };

    const selected = prices[plan];
    if (!selected) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const unitAmount = annual ? selected.annual : selected.monthly;
    const interval = annual ? "year" as const : "month" as const;
    const totalAmount = annual ? selected.annual * 12 : selected.monthly;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Masidy ${plan}`,
              description: `${plan} plan — billed ${annual ? "annually" : "monthly"}`,
            },
            unit_amount: annual ? totalAmount : unitAmount,
            recurring: { interval },
          },
          quantity: 1,
        },
      ],
      success_url: `${req.nextUrl.origin}/dashboard?checkout=success`,
      cancel_url: `${req.nextUrl.origin}/pricing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    const message = err instanceof Error ? err.message : "Failed to create checkout session";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
