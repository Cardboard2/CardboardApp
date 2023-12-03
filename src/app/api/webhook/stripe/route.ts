import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers";

import { env } from "~/env.mjs";
import { type NextRequest, NextResponse } from "next/server";

const db = new PrismaClient();

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
  typescript: true,
});

export async function POST(req: NextRequest) {
  const priceMap = new Map<string, { tier: string; renewMonths: number }>([
    ["199", { tier: "tier-normal", renewMonths: 1 }],
    ["1799", { tier: "tier-normal", renewMonths: 12 }],
    ["499", { tier: "tier-whale", renewMonths: 1 }],
    ["5999", { tier: "tier-whale", renewMonths: 12 }],
  ]);

  const body = await req.text();
  const signature = headers().get("stripe-signature");
  let event: Stripe.Event | null = null;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature!,
      env.STRIPE_WEBHOOK_SECRET,
    );

    switch (event?.type) {
      case "checkout.session.completed":
        if (
          !event.data.object.customer_email ||
          !event.data.object.amount_total
        )
          throw new Error("Invalid checkout session data");

        const userEmail = event.data.object.customer_email;
        const paymentAmount = String(event.data.object.amount_total);
        const tierObject = priceMap.get(paymentAmount);

        const expiryDate = new Date();
        if (tierObject !== undefined)
          expiryDate.setMonth(expiryDate.getMonth() + tierObject.renewMonths);

        const updatedUser = await db.user.update({
          where: { email: userEmail },
          data: {
            tierId: tierObject?.tier,
            tierExpiry: expiryDate,
          },
        });

        if (!updatedUser) throw new Error("Failed to update user");

        const newPayment = await db.payment.create({
          data: {
            userId: updatedUser.id,
            id: event.data.object.id,
            tierId: tierObject?.tier ?? "",
            status: event.data.object.status!,
          },
        });

        if (!newPayment) throw new Error("Failed to store payment!");

      // case "customer.subscription.deleted":
      // // Make them pleb again subscription ends
      // // Update expiry date to nothing?

      // // Need to make another case for subscription updated
    }
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "Unknown Error...";
    console.error(`Webhook processing failed: ${errMsg}`);
    return NextResponse.json({ error: errMsg }, { status: 400 });
  }

  return NextResponse.json({ received: true });
}
