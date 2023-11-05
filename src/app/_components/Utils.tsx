import type { Dispatch, SetStateAction } from 'react'
import type { PaymentData } from '~/PaymentData'

export interface PaymentProps {
    selectingTier: boolean
    setSelectingTier: Dispatch<SetStateAction<boolean>>
    makingPayment: boolean
    setMakingPayment: Dispatch<SetStateAction<boolean>>
    billingData: PaymentData
    setBillingData: Dispatch<SetStateAction<PaymentData>>
}