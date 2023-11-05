import { Dispatch, SetStateAction } from 'react'
import { StripeElementsOptionsMode } from "@stripe/stripe-js"

export interface PaymentProps {
    selectingTier: boolean
    setSelectingTier: Dispatch<SetStateAction<boolean>>
    makingPayment: boolean
    setMakingPayment: Dispatch<SetStateAction<boolean>>
    billingData: StripeElementsOptionsMode
    setBillingData: Dispatch<SetStateAction<StripeElementsOptionsMode>>
}