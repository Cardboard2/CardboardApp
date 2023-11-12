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
    .input(z.object({ tier:z.string(), price: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const session = await stripe.checkout.sessions.create({
          mode: "subscription",
          line_items: [{
              price: input.price,
              quantity: 1
            }
          ],
          ui_mode: "hosted",
          customer_email: ctx.session.user.email ? ctx.session.user.email : undefined,
          success_url: getBaseUrl() + "/checkout/success?sessionId={CHECKOUT_SESSION_ID}",
          cancel_url: getBaseUrl() + "/checkout?sessionId={CHECKOUT_SESSION_ID}"
        });
      
      if (session.url && session.status){
        const postRet = await ctx.db.payment.create({
          data: {
            id      : session.id,
            tier    : input.tier,
            status  : session.status,
            userId  : ctx.session.user.id
          }
        });
        if (postRet?.id)
          return session.url;
      };

      return null;
    }),
  expireSession: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const ret = await ctx.db.payment.update({
        where : {id: input.sessionId},
        data  : {status: "expired"}
      });
      return ret.status;
    }),
  completeSession: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const session = await stripe.checkout.sessions.retrieve(input.sessionId);
      
      if (session.status = "complete") {
        const payment = await ctx.db.payment.update({
          where : {id: input.sessionId},
          data  : {status: session.status}
        });

        if (payment.status == session.status) {
          const ret = await ctx.db.user.update({
            where : {id: ctx.session.user.id},
            data  : {tierId: payment.tier}
          });
          return ret;
        };
      }
      return null;
      
    }),
});