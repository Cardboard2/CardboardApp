
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers";

import { env } from "~/env.mjs";
import { NextRequest, NextResponse } from "next/server";

const db = new PrismaClient();

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
    typescript: true
  });

export async function POST(req: NextRequest) {
  const priceMap = new Map<string, string>([
    ["price_1O95MAIEdHdbj4cnIlR0sIgM", "tier-normal"],
    ["price_1O95TNIEdHdbj4cn850p9f5d", "tier-normal"],
    ["price_1O98rkIEdHdbj4cndIUjsLeR", "tier-whale"],
    ["price_1O98rkIEdHdbj4cnQRHrt7DY", "tier-whale"],
  ]); 
   
  const body = await req.text();
  const signature = headers().get("stripe-signature");
  let event : Stripe.Event | null = null;
  try {
    event = stripe.webhooks.constructEvent(body, signature!, env.STRIPE_WEBHOOK_SECRET);
    switch (event?.type){
      case "checkout.session.completed":

        if (!event.data.object.customer_email || !event.data.object.line_items?.data[0]?.price?.lookup_key)
          throw new Error("Invalid checkout session data");

        const userEmail = event.data.object.customer_email;
        const priceApiId = event.data.object.line_items!.data[0]!.price!.lookup_key;

        console.log(priceApiId);

        const tierId = priceMap.get(priceApiId);

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
    console.error(`Webhook signature verification failed: ${errMsg}`);
    return NextResponse.json({ error: errMsg }, { status: 400 });
  };

  return NextResponse.json({ received: true });
};
