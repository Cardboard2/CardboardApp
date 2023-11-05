
import { Elements, CardElement  } from '@stripe/react-stripe-js';
import { Dispatch, SetStateAction } from 'react';
import { loadStripe, StripeElementsOptions  } from '@stripe/stripe-js';
import { PaymentProps } from '~/app/_components/Utils';

const stripePromise = loadStripe("pk_test_51O7cRxIEdHdbj4cnyv1joCVIZeXw5KCIRp4piDxBopx7NpqpoBAWwyFm0wkOVVGZ6tnWpQQF4dZupOjXfFetAIfk00O1Lao5gt")

function SubmitPayment() {

}

function CheckoutForm(props : {setMakingPayment: Dispatch<SetStateAction<boolean>>}) {
    return (
        <div className='w-screen px-10'>
            <CardElement  className='w-full'/>
            <button onClick={()=>props.setMakingPayment(false)}>Cancel payment</button>
        </div>
    );
}


export function PaymentHandler(props : {paymentState: PaymentProps, options : StripeElementsOptions}) {

    if (stripePromise != null) {
        return (
            <div className='w-full max-w-4xl flex justify-center bg-amber-300 p-10'>
                <Elements stripe={stripePromise} options={props.options}>
                    <CheckoutForm setMakingPayment={props.paymentState.setMakingPayment}/>
                </Elements>
            </div>
        );
    }
    else
        return;
}