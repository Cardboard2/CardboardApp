
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "stream/consumers";
import Stripe from "stripe";
import { env } from "~/env.mjs";

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
    typescript: true
  });

console.log(env.STRIPE_WEBHOOK_SECRET);

const webhook = async (req: NextApiRequest, res: NextApiResponse) => {
    console.info("New stripe webhook request!");
    if (req.method == "POST") {
        const signature = req.headers["stripe-signature"] as string;
        const endpointSecret = env.STRIPE_WEBHOOK_SECRET;
        var event: Stripe.Event;
        const db = new PrismaClient();

        try {
            const body = await buffer(req);
            event = stripe.webhooks.constructEvent(
                body,
                signature,
                endpointSecret
            );
            switch (event.type) {
                case "checkout.session.completed":
                    const completedCheckoutSession = event.data.object as Stripe.Checkout.Session;
                    if (!completedCheckoutSession.id || !completedCheckoutSession.customer_email || !completedCheckoutSession.line_items)
                        throw new Error("Invalid Session Data!");

                    const user = db.user.findUnique({where: {email: completedCheckoutSession.customer_email}});
                    if (!user)
                        throw new Error("User not found!");

                    db.user.update({
                        where: {
                            email: completedCheckoutSession.customer_email
                        },
                        data: {
                            tierId: "tier-max"
                        }},
            }
        } catch (err) {
            const msg = "Webhook signature verification failed: ".concat(err instanceof Error ? err.message : "Unknown Error!");
            console.info(msg);
            return res.status(400).send(msg);
        }

    };
};