import type {Request, Response} from 'express';

const express = require('express');
const app = express();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY : "");

app.post('/create-checkout-session', async (req : Request, res: Response) => {
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [{
        price_data: { 
            currency: req.body.currency? req.body.currency : "aud",
            product_data: {
                name: req.body.name ? req.body.name : "cardboard_subsription",
            },
            unit_amount_decimal: req.body.price ? req.body.price : 0.0,
            recurring: {
                interval: req.body.interval ? req.body.interval : "monthly",
                interval_count: req.body.interval_count ? req.body.interval_count : 1
            }
        },
      }],
      mode: 'subsription',
      ui_mode: 'embedded',
      return_url: 'http://localhost:3000/upgrade/return?session_id={CHECKOUT_SESSION_ID}',
      client_reference_id: req.body.user_id ? req.body.user_id : '',
    });
    res.json({clientSecret: session?.client_secret});
  }
  catch (e) {
    res.status(500).send({err: e})
  }
    
});


app.listen(4242, () => console.log(`Listening on port ${4242}!`));