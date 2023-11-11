import React from "react"
import { useState } from 'react'
import { Switch } from '@headlessui/react'

import { CheckCircleIcon } from '@heroicons/react/20/solid'
import { api } from "~/trpc/react"

import { useRouter } from "next/navigation"
import { useSession, signIn } from "next-auth/react"

type price = {
  monthly: string,
  annually_m: string,
  annually_y: string
}

type priceId = {
  monthly: string,
  annually: string,
}

interface tier {
  name: string,
  id: string,
  href: string,
  price: price,
  priceId?: priceId,
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
    priceId: { monthly: 'price_1O95MAIEdHdbj4cnIlR0sIgM', annually: 'price_1O95TNIEdHdbj4cn850p9f5d' },
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
    priceId: { monthly: 'price_1O98rkIEdHdbj4cndIUjsLeR', annually: 'price_1O98rkIEdHdbj4cnQRHrt7DY' },
    description: 'You are an instagram model or something, idk. You do you.',
    features: [
      'A massive 1 TB of storage',
      'You might be able to call us also'

    ],
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

export function TierSelect() {
  const { data: session } = useSession();
  const [annualPayment, setAnnualPayment] = useState(false);
  const router = useRouter();

  const createNewStripeSession = api.stripe.createSubscription.useMutation({
    onSuccess: (data) => {
        router.refresh();
        if (data.url != null) {
          router.push(data.url)
        }
    },
  });
  
  function SelectTierForPayment(tier : tier)
  {
    if (session && session.user) {
      console.log(session)
      if (tier.id == "tier-pleb") {
        // Mutate user as pleb
      }
      else if (tier.priceId) {
        createNewStripeSession.mutate({price: annualPayment ? tier.priceId.annually : tier.priceId.monthly});
      }
    }
    else
      signIn()
      
    
  }

  return (
    <div className={`flex justify-center w-full`}>
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
                    onClick={() => SelectTierForPayment(tier)}
                    disabled={createNewStripeSession.isLoading}
                    className={`mt-6 block duration-300 rounded-md bg-amber-700 px-3 py-2 \
                         ${createNewStripeSession.isLoading ? 'cursor-wait' : ''} text-center text-sm \
                          active:opacity-80 font-semibold leading-6 text-white shadow-sm hover:bg-amber-800 \
                          focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600\
                          disabled:opacity-50`}
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
}
