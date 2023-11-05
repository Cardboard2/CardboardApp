import { Request, Router } from 'express';
import Stripe from 'stripe';

import type { PaymentData } from '~/PaymentData';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY : "", {
  apiVersion: "2023-10-16",
  typescript: true
});


export default function Payment() {
  const router = Router();

  router
    .post("/subscription", (req, res) => {
      const session = (async () => await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [{
            price: typeof req.body.price === 'string' ? req.body.price : "",
            quantity: 1
          }
        ],
        ui_mode: "embedded",
        customer: typeof req.body.user_id === 'string' ? req.body.user_id : "",
        return_url: 'http://localhost:3000/checkout/return?session_id={CHECKOUT_SESSION_ID}',
      }));
      res.send(session);
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