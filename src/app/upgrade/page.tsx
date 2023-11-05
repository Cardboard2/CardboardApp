"use client"
import React from 'react';
import { Fragment,useState } from 'react';
import { StripeElementsOptionsMode } from "@stripe/stripe-js"
import { Transition } from '@headlessui/react';

import { TierSelect } from "./_components/TierSelect.tsx"
import { Header } from "../_components/Header.tsx"
import { PaymentProps } from '../_components/Utils.tsx';
//import { PaymentHandler } from './_components/PaymentHandler.tsx';

//import { SessionProvider } from "next-auth/react"

const defaultBillingData : StripeElementsOptionsMode = {
  mode: "subscription",
  currency: "aud",
  amount: 0,
}

export default function Upgrade() {
  const [selectingTier, setSelectingTier] = useState(true);
  const [makingPayment, setMakingPayment] = useState(false);
  const [billingData, setBillingData] = useState(defaultBillingData);
  const paymentState : PaymentProps = {selectingTier, setSelectingTier, makingPayment, setMakingPayment, billingData, setBillingData};

  if (!paymentState)
    return;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-amber-200 text-amber-950">
      <div className="fixed flex z-50 top-0 w-full shadow">
        <Header/>
      </div>
      <div className='flex z-0 w-full items-center justify-center'>
         <TierSelect paymentState={paymentState}/>
      </div>
    </main>
  );
}
  //{!selectingTier ? <PaymentHandler paymentState={paymentState} options={billingData}/> : ""}