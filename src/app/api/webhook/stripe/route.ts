
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers";

import { env } from "~/env.mjs";
import { type NextRequest, NextResponse } from "next/server";

const db = new PrismaClient();

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
    typescript: true
  });

export async function POST(req: NextRequest) {
  const priceMap = new Map<string, string>([
    ["199", "tier-normal"],
    ["1799", "tier-normal"],
    ["499", "tier-whale"],
    ["5999", "tier-whale"],
  ]); 
   
  const body = await req.text();
  const signature = headers().get("stripe-signature");
  let event : Stripe.Event | null = null;
  try {
    event = stripe.webhooks.constructEvent(body, signature!, env.STRIPE_WEBHOOK_SECRET);
    switch (event?.type){
      case "checkout.session.completed":

        if (!event.data.object.customer_email || !event.data.object.amount_total)
          throw new Error("Invalid checkout session data");
        
        const userEmail = event.data.object.customer_email;
        const paymentAmount = String(event.data.object.amount_total);
        const tierId = priceMap.get(paymentAmount);

        const updatedUser = await db.user.update({
          where : {email: userEmail},
          data  : {tierId: tierId},
        });

        if (!updatedUser)
          throw new Error("Failed to update user");

        const newPayment = await db.payment.create({
          data: {
            userId: updatedUser.id,
            id    : event.data.object.id,
            tierId: tierId!,
            status: event.data.object.status!
          }
        });
        
        if (!newPayment)
          throw new Error("Failed to store payment!");
    };
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "Unknown Error..." 
    console.error(`Webhook processing failed: ${errMsg}`);
    return NextResponse.json({ error: errMsg }, { status: 400 });
  };

  return NextResponse.json({ received: true });
};
