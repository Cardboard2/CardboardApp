
import { Elements  } from '@stripe/react-stripe-js';
import { loadStripe, StripeElementsOptions  } from '@stripe/stripe-js';
import { useState } from 'react';

const [stripePulbicKey, setStripePublicKey] = useState("")

if (process.env.STRIPE_PUBLIC_KEY) {
    setStripePublicKey(process.env.STRIPE_PUBLIC_KEY);
}
const stripePromise = loadStripe(stripePulbicKey)

export function CheckoutForm() {
    return (
        <div>
            
        </div>
    );
}

export function PaymentHandler() {
    const options : StripeElementsOptions = {
        mode: 'subscription',

    }

    if (stripePromise != null) {
        return (
            <div>
                <Elements stripe={stripePromise} options={options}>
                    <CheckoutForm />
                </Elements>
            </div>
        );
    }
    else
        return;
}