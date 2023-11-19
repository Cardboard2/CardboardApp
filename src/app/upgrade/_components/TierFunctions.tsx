import { tier } from "./Tiers";

export function PricePerMonth(props : {tier : tier})
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

export function PricePerAnnum(props : {tier : tier})
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