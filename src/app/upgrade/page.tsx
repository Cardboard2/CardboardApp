import React from 'react';

import {loadStripe} from '@stripe/stripe-js';
//import ReactDOM from 'react-dom';

import TierSelect from "./_components/TierSelect.tsx"

/*import {
    PaymentElement,
    Elements,
    ElementsConsumer,
  } from '@stripe/react-stripe-js';



const stripePromise = loadStripe('pk_test_51O7cRxIEdHdbj4cnyv1joCVIZeXw5KCIRp4piDxBopx7NpqpoBAWwyFm0wkOVVGZ6tnWpQQF4dZupOjXfFetAIfk00O1Lao5gt');*/

export default function Upgrade() {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-amber-200 text-amber-950">
         <TierSelect/>
      </main>
    );
  }
  