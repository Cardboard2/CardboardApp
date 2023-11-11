import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import { env } from "~/env.mjs";

import Stripe from 'stripe';
import { getBaseUrl } from '~/trpc/shared';

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
          success_url: getBaseUrl() + "/checkout/success?sessionId={CHECKOUT_SESSION_ID}",
          cancel_url: getBaseUrl() + "/checkout?sessionId={CHECKOUT_SESSION_ID}"
          
        });
    }),
  cancelSession: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .mutation(async ({ input }) => {
      return await stripe.checkout.sessions.expire(input.sessionId);
    }),
});