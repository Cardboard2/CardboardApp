import React from "react"
import { CheckCircleIcon } from '@heroicons/react/20/solid'

const tiers = [
  {
    name: '20x30 All Purpose',
    id: 'tier-pleb',
    href: '#',
    price: { monthly: 'Free' },
    description: 'Everything necessary to get started. We can be nice if we want to.',
    features: ['Free 5 Gb storage just for you ❤️'],
  },
  {
    name: '40x60 Heavy Duty',
    id: 'tier-',
    href: '#',
    price: { monthly: '$10', annually: '$8' },
    description: 'When you need some serious storage for them 😻 pics.',
    features: [
      '100 Gb of on-demand storage',
    ],
  },
  {
    name: '80x120 Industrial Grade',
    id: 'tier-whale',
    href: '#',
    price: { monthly: '$60', annually: '$48' },
    description: 'You are an instagram model or something, idk. You do you.',
    features: [
      '1 Tb of storage (1024 Gb. Smol are not always bad.)',
    ],
  },
]

function classNames(...classes : any) {
  return classes.filter(Boolean).join(' ')
}


export default function TierSelect() {
    return (
      <div className="bg-amber-100 py-24 sm:py-32 rounded-lg shadow-lg">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl sm:text-center">
            <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Choose Your Cardboard Box
            </p>
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 sm:text-center">
            We are aware that each person have their own need 😉
          </p>
          <div className="mt-20 flow-root">
            <div className="isolate -mt-16 grid max-w-sm grid-cols-1 gap-y-16 divide-y divide-gray-700 sm:mx-auto lg:-mx-8 lg:mt-0 lg:max-w-none lg:grid-cols-3 lg:divide-x lg:divide-y-0 xl:-mx-4">
              {tiers.map((tier) => (
                <div key={tier.id} className="pt-16 lg:px-8 lg:pt-0 xl:px-14">
                  <h3 id={tier.id} className="text-base font-semibold leading-7 text-gray-900">
                    {tier.name}
                  </h3>
                  <p className="mt-6 flex items-baseline gap-x-1">
                    <span className="text-5xl font-bold tracking-tight text-gray-900">{tier.price.monthly}</span>
                    <span className="text-sm font-semibold leading-6 text-gray-600">/month</span>
                  </p>
                  <p className="mt-3 text-sm leading-6 text-gray-500">
                    {tier.price.annually} per month if paid annually
                  </p>
                  <a
                    href={tier.href}
                    aria-describedby={tier.id}
                    className="mt-10 block duration-300 rounded-md bg-red-600 px-3 py-2 text-center text-sm active:opacity-80 font-semibold leading-6 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                  >
                    Buy plan
                  </a>
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
    );
}
