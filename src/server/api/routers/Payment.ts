import { Router } from 'express';
import Stripe from 'stripe';
import type {Request, Response} from 'express';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY : "", {
  apiVersion: "2023-10-16",
  typescript: true
});


export default function Payment() {
  const router = Router();

  router
    .post("/paymentintent", async (req, res, next) => {
      const model = req.body;
      const promise = await stripe.paymentIntents.create({
        amount: model.amount,
        currency: model.currency || "aud",
        automatic_payment_methods: {
          enabled: true
        }
      })
    });
}
