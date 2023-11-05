import type { Dispatch, SetStateAction } from 'react'
import type { StripeElementsOptionsMode } from "@stripe/stripe-js"

export interface PaymentProps {
    selectingTier: boolean
    setSelectingTier: Dispatch<SetStateAction<boolean>>
    makingPayment: boolean
    setMakingPayment: Dispatch<SetStateAction<boolean>>
    billingData: StripeElementsOptionsMode
    setBillingData: Dispatch<SetStateAction<StripeElementsOptionsMode>>
}