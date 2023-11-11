import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import { env } from "~/env.mjs";

import Stripe from 'stripe';

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
  typescript: true
});


export const stripeRouter = createTRPCRouter({
  createSubscription: protectedProcedure
    .input(z.object({ price: z.string() }))
    .mutation(async ({ input }) => {
      return await stripe.checkout.sessions.create({
          mode: "subscription",
          line_items: [{
              price: input.price,
              quantity: 1
            }
          ],
          ui_mode: "hosted",
          success_url: 'http://localhost:3000/checkout/success?session_id={CHECKOUT_SESSION_ID}',
          cancel_url: 'http://localhost:3000/checkout/cancelled?session_id={CHECKOUT_SESSION_ID}'
          
        });
    }),
});