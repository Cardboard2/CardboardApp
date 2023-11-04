import { Dispatch, SetStateAction } from 'react'

export interface PaymentProps {
    makePayment: boolean
    setMakePayment: Dispatch<SetStateAction<boolean>>
}