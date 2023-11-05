import type Stripe from "stripe"

export interface PaymentData{
    name: string
    price: string
    interval: Stripe.SubscriptionCreateParams.Item.PriceData.Recurring.Interval
    interval_count: number
    user_id: string
    currency?: string
}