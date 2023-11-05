import React from "react"
import { CheckCircleIcon } from '@heroicons/react/20/solid'
import { useState, Fragment } from 'react'
import { Switch, Transition } from '@headlessui/react'
import type { PaymentProps } from '../../_components/Utils'
import type { PaymentData } from "~/PaymentData"

type price = {
  monthly: string,
  annually_m: string,
  annually_y: string
}

interface tier {
  name: string,
  id: string,
  href: string,
  price: price,
  description: string
  features: string[]
}

const tiers : tier[] = [
  {
    name: '20x30 All Purpose',
    id: 'tier-pleb',
    href: '#',
    price: { monthly: 'Free', annually_m: 'Free', annually_y: 'Free' },
    description: 'Everything necessary to get started. We can be nice if we wanted to.',
    features: ['Free 15 GB storage just for you ❤️'],
  },
  {
    name: '40x60 Heavy Duty',
    id: 'tier-normal',
    href: '#',
    price: { monthly: '$1.99', annually_m: '$1.49', annually_y: '$17.99' },
    description: 'When you need some serious storage for them 🐈‍⬛ pics.',
    features: [
      '100 GB of on-demand storage',
      'We will actually answer your emails'
    ],
  },
  {
    name: '80x120 Industrial Grade',
    id: 'tier-whale',
    href: '#',
    price: { monthly: '$5.99', annually_m: '$4.99', annually_y: '$59.99' },
    description: 'You are an instagram model or something, idk. You do you.',
    features: [
      'A massive 1 TB of storage',
      'You might be able to call us also'

    ],
  },
]

const tierPaymentOption : PaymentData[] = [
  {
    name: "tier-normal-monthly",
    price: "price_1O95MAIEdHdbj4cnIlR0sIgM",
    interval: "month",
    interval_count: 1,
    user_id: "user1",
    currency: "aud"
  },
  {
    name: "tier-normal-yearly",
    price: "price_1O95TNIEdHdbj4cn850p9f5d",
    interval: "year",
    interval_count: 1,
    user_id: "user1",
    currency: "aud"
  },
  {
    name: "tier-whale-monthly",
    price: "price_1O95YsIEdHdbj4cnsVnrZ89j",
    interval: "month",
    interval_count: 1,
    user_id: "user1",
    currency: "aud"
  },
  {
    name: "tier-whale-yearly",
    price: "price_1O95YsIEdHdbj4cnEevJpMxf",
    interval: "year",
    interval_count: 1,
    user_id: "user1",
    currency: "aud"
  },
]

function PricePerMonth(props : {tier : tier})
{
  if (props.tier.id == undefined || props.tier.price.monthly == undefined)
    return
    
  else if (props.tier.id != 'tier-pleb') {
    return (
      <div>
        <p className="mt-6 pb-9 flex items-baseline gap-x-1">
          <span className="text-5xl font-bold tracking-tight text-gray-900">{props.tier.price.monthly}</span> 
          <span className="text-sm font-semibold leading-6 text-gray-600">/month</span>
        </p>
      </div>
      );
  }
  else {
    return( 
      <div>
        <p className="mt-6 pb-9 flex items-baseline gap-x-1">
          <span className="text-5xl font-bold tracking-tight text-gray-900">{props.tier.price.monthly}</span>
        </p>
      </div>
    );
  }
}

function PricePerAnnum(props : {tier : tier})
{
  if (props.tier.id == undefined || props.tier.price.annually_y == undefined || props.tier.price.annually_m == undefined)
    return
    
  else if (props.tier.id != 'tier-pleb') {
    return (
      <div>
        <p className="mt-6 flex items-baseline gap-x-1">
          <span className="text-5xl font-bold tracking-tight text-gray-900">{props.tier.price.annually_m}</span> 
          <span className="text-sm font-semibold leading-6 text-gray-600">/month</span>
        </p>
        <p className="mt-3 text-sm leading-6 text-gray-500">
          {props.tier.price.annually_y} billed per year
        </p>
      </div>
      );
  }
  else {
    return( 
      <div>
        <p className="mt-6 flex items-baseline gap-x-1">
          <span className="text-5xl pb-9 font-bold tracking-tight text-gray-900">{props.tier.price.monthly}</span> 
        </p>
      </div>
    );
  }
}

function SelectTierForPayment(annualPayment : boolean, tier : tier, paymentState : PaymentProps)
{
  if (!tierPaymentOption[0] || !tierPaymentOption[1] || !tierPaymentOption[2] || !tierPaymentOption[3])
    return
  
  if (tier.id != 'tier-pleb') {
    if (annualPayment)
      tier.id == 'tier-whale' ? paymentState.setBillingData(tierPaymentOption[3]) : paymentState.setBillingData(tierPaymentOption[1])
    else
      tier.id == 'tier-whale' ? paymentState.setBillingData(tierPaymentOption[2]) : paymentState.setBillingData(tierPaymentOption[0])
    paymentState.setSelectingTier(!paymentState.selectingTier)
  }
  
}

export function TierSelect(props : {paymentState : PaymentProps}) {
  const [annualPayment, setAnnualPayment] = useState(false);

  if (!props.paymentState.setSelectingTier || !props.paymentState.setMakingPayment)
    return;

  const ref = React.createRef<HTMLDivElement>()

  const TierSelectComponent = React.forwardRef<HTMLDivElement, PaymentProps>((props , forwardedRef) => {
    return (
      <div ref={forwardedRef} className={`flex justify-center w-full`}>
        <div className={`bg-amber-100 py-24 sm:py-32 rounded-lg shadow-lg w-fit`}>
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-4xl sm:text-center">
              <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Choose Your Cardboard Box
              </p>
            </div>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 sm:text-center">
              We are aware that each person have their own needs 😉
            </p>
            <div className={`mt-14 flow-root`}>
              <div className="flex w-full justify-center pb-12">
                <Switch.Group as="div" className="flex items-center">
                  <Switch
                    checked={annualPayment}
                    onChange={setAnnualPayment}
                    className={`
                      ${annualPayment ? 'bg-amber-500' : 'bg-amber-300'} relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-700 focus:ring-offset-2`}
                  >
                    <span
                      aria-hidden="true"
                      className={`
                        ${annualPayment ? 'translate-x-6' : 'translate-x-0'} pointer-events-none inline-block h-7 w-7 transform rounded-full bg-amber-700 shadow ring-0 transition duration-300 ease-in-out`}
                    />
                  </Switch>
                  <Switch.Label as="span" className="ml-3 text-l">
                    <span className="font-medium text-gray-900">Annual billing</span>{' '}
                  </Switch.Label>
                </Switch.Group>
              </div>
              <div className="isolate -mt-16 grid max-w-sm grid-cols-1 gap-y-16 divide-y divide-gray-700 sm:mx-auto lg:-mx-8 lg:mt-0 lg:max-w-none lg:grid-cols-3 lg:divide-x lg:divide-y-0 xl:-mx-4">
                {tiers.map((tier) => (
                  <div key={tier.id} className="pt-16 lg:px-8 lg:pt-0 xl:px-14">
                    <h3 id={tier.id} className="text-base font-semibold leading-7 text-gray-900">
                      {tier.name}
                    </h3>
                    {annualPayment ? <PricePerAnnum tier={tier}/> : <PricePerMonth tier={tier}/>}
                    <button
                      onClick={() => SelectTierForPayment(annualPayment, tier, props)}
                      className="mt-6 block duration-300 rounded-md bg-amber-700 px-3 py-2 text-center text-sm active:opacity-80 font-semibold leading-6 text-white shadow-sm hover:bg-amber-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                    >
                      Choose plan
                    </button>
                    <p className="mt-10 text-sm font-semibold leading-6 text-gray-900">{tier.description}</p>
                    <ul role="list" className="mt-6 space-y-3 text-sm leading-6 text-gray-600">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex gap-x-3">
                          <CheckCircleIcon className="h-6 w-5 flex-none text-amber-700" aria-hidden="true" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  });

  TierSelectComponent.displayName = "TierSelectComponent";
  
  return (
    <Transition
        as={Fragment}
        show={props.paymentState.selectingTier}
        enter="transform duration-700 transition ease-in-out"
        enterFrom="-translate-y-full opacity-0 scale-95"
        enterTo="-translate-y-0 opacity-100 scale-100"
        leave="transform duration-700 transition ease-in-out"
        leaveFrom="-translate-y-0 opacity-100 scale-100 "
        leaveTo="-translate-y-full opacity-0 scale-95 "
      >
        <TierSelectComponent ref={ref} {...props.paymentState}/>
    </Transition>
  );
}
