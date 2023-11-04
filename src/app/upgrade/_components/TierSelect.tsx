import React from "react"
import { CheckCircleIcon } from '@heroicons/react/20/solid'
import { PaymentProps } from '../../_components/Utils'

type price = {
  monthly: string,
  annually: string
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
    price: { monthly: 'Free', annually: 'Free' },
    description: 'Everything necessary to get started. We can be nice if we wanted to.',
    features: ['Free 15 GB storage just for you ❤️'],
  },
  {
    name: '40x60 Heavy Duty',
    id: 'tier-normal',
    href: '#',
    price: { monthly: '$2.00', annually: '$1.49' },
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
    price: { monthly: '$6.00', annually: '$5.00' },
    description: 'You are an instagram model or something, idk. You do you.',
    features: [
      'A massive 1 TB of storage',
      'You might be able to call us also'

    ],
  },
]

/*function classNames(...classes : any) {
  return classes.filter(Boolean).join(' ')
}*/

function PricePerMonth(props : {tier : tier})
{
  if (props.tier.id == undefined || props.tier.price.annually == undefined || props.tier.price.monthly == undefined)
    return
    
  else if (props.tier.id != 'tier-pleb') {
    return (
      <div>
        <p className="mt-6 flex items-baseline gap-x-1">
          <span className="text-5xl font-bold tracking-tight text-gray-900">{props.tier.price.monthly}</span> 
          <span className="text-sm font-semibold leading-6 text-gray-600">/month</span>
        </p>
        <p className="mt-3 text-sm leading-6 text-gray-500">
          {props.tier.price.annually} per month if paid annually
        </p>
      </div>
      );
  }
  else {
    return( 
      <div>
        <p className="mt-6 flex items-baseline gap-x-1">
          <span className="text-5xl font-bold tracking-tight text-gray-900">{props.tier.price.monthly}</span> 
        </p>
        <p className="mt-3 text-sm leading-6 text-gray-500">And no, you won&apos;t have to sign your soul</p>
      </div>
    );
  }
}

/*href={tier.href}
                  aria-describedby={tier.id}*/

export function TierSelect(props : {paymentState : PaymentProps}) {
  if (!props.paymentState.setMakePayment)
    return;

  return (
    <div className={`flex justify-center w-full ${props.paymentState.makePayment ? "-translate-x-full" : ""} duration-500`}>
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
          <div className={`mt-20 flow-root`}>
            <div className="isolate -mt-16 grid max-w-sm grid-cols-1 gap-y-16 divide-y divide-gray-700 sm:mx-auto lg:-mx-8 lg:mt-0 lg:max-w-none lg:grid-cols-3 lg:divide-x lg:divide-y-0 xl:-mx-4">
              {tiers.map((tier) => (
                <div key={tier.id} className="pt-16 lg:px-8 lg:pt-0 xl:px-14">
                  <h3 id={tier.id} className="text-base font-semibold leading-7 text-gray-900">
                    {tier.name}
                  </h3>
                  <PricePerMonth tier={tier}/>
                  <button
                    onClick={() => props.paymentState.setMakePayment(!props.paymentState.makePayment)}
                    className="mt-10 block duration-300 rounded-md bg-red-600 px-3 py-2 text-center text-sm active:opacity-80 font-semibold leading-6 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                  >
                    Choose plan
                  </button>
                  <p className="mt-10 text-sm font-semibold leading-6 text-gray-900">{tier.description}</p>
                  <ul role="list" className="mt-6 space-y-3 text-sm leading-6 text-gray-600">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex gap-x-3">
                        <CheckCircleIcon className="h-6 w-5 flex-none text-red-600" aria-hidden="true" />
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
