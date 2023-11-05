"use client"
import React from 'react';
import { Fragment,useState } from 'react';
import { StripeElementsOptionsMode } from "@stripe/stripe-js"
import { Transition } from '@headlessui/react';

import { TierSelect } from "./_components/TierSelect.tsx"
import { Header } from "../_components/Header.tsx"
import { PaymentProps } from '../_components/Utils.tsx';
import { PaymentHandler } from './_components/PaymentHandler.tsx';

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
  
  const ref = React.createRef<HTMLDivElement>()
  const SelectComponent = React.forwardRef<HTMLDivElement, PaymentProps>((props , forwardedRef) => {
    return (
      <div ref={forwardedRef}>
        <TierSelect paymentState={props}/>
      </div>
    )
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-amber-200 text-amber-950">
      <div className="fixed flex z-50 top-0 w-full shadow">
        <Header/>
      </div>
      <div className='flex z-0 w-full items-center justify-center'>
        <Transition
            as={Fragment}
            show={selectingTier}
            enter="transform duration-700 transition ease-in-out"
            enterFrom="-translate-y-full opacity-0 scale-95"
            enterTo="-translate-y-0 opacity-100 scale-100"
            leave="transform duration-700 transition ease-in-out"
            leaveFrom="-translate-y-0 opacity-100 scale-100 "
            leaveTo="-translate-y-full opacity-0 scale-95 "
          > 
          <SelectComponent ref={ref} {...paymentState}/>
        </Transition>
        
      </div>
    </main>
  );
}
  //{!selectingTier ? <PaymentHandler paymentState={paymentState} options={billingData}/> : ""}