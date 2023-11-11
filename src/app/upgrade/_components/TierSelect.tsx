import React from "react"
import { useState } from 'react'
import { Switch } from '@headlessui/react'

import { CheckCircleIcon } from '@heroicons/react/20/solid'
import { api } from "~/trpc/react"

import { useRouter } from "next/navigation"
import { useSession, signIn } from "next-auth/react"
import { tier,tiers } from "./Tiers"
import { PricePerAnnum, PricePerMonth } from "./TierFunctions"

export function TierSelect() {
  const { data: session } = useSession();
  const router = useRouter();
  const [annualPayment, setAnnualPayment] = useState(false);

  const createNewStripeSession = api.stripe.createSubscription.useMutation({
    onSuccess: (data) => {
        router.refresh();
        if (data != null) {
          router.push(data)
        }
    },
  });

  const makeNewPleb = api.user.setUserFreeTier.useMutation({
    onSuccess: () => {
      router.refresh();
      router.push("profile");
    },
  })
  
  const {data: user} = api.user.getUser.useQuery();
  console.log(user);
  
  function SelectTierForPayment(tier : tier)
  {
    if (user) {
      console.log(session)
      if (tier.id == "tier-pleb") {
        // Mutate user as pleb
        makeNewPleb.mutate();
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
                    disabled={createNewStripeSession.isLoading || makeNewPleb.isLoading || (user && user.tierId) == tier.id}
                    className={`mt-6 block duration-300 rounded-md bg-amber-700 w-32 px-3 py-2 \
                         ${createNewStripeSession.isLoading ? 'cursor-wait' : ''} text-center text-sm \
                          active:opacity-80 font-semibold leading-6 text-white shadow-sm hover:bg-amber-800 \
                          focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600\
                          disabled:opacity-50 disabled:hover:bg-amber-700`}
                  >
                    {(user && user.tierId) == tier.id ? "Your plan" : "Choose plan"}
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
