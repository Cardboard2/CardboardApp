import { Router } from 'express';
import Stripe from 'stripe';

import type { PaymentData } from '~/PaymentData';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY : "", {
  apiVersion: "2023-10-16",
  typescript: true
});


export default function Payment() {
  const router = Router();

  router
    .post("/subscription", async (req, res, next) => {
      const model:PaymentData = req.body;
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [{
            price: model.price,
            quantity: 1
          }
        ],
        ui_mode: "embedded",
        customer: model.user_id,
        return_url: 'http://localhost:3000/checkout/return?session_id={CHECKOUT_SESSION_ID}',
      })
      res.json(session)
    });
  
  return router;
}
/*
items: [{
            price_data: {
              currency: model.currency || "aud",
              unit_amount: model.price,
              product: model.name,
              recurring: {
                interval: model.interval,
                interval_count: model.interval_count
              }
            }
          }],
        customer: model.user_id,
        description: "Cardboard Cloud Storage Subscription",
        */