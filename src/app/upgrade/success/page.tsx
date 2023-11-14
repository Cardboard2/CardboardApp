"use client"

import { Transition } from "@headlessui/react";
import { SessionProvider } from "next-auth/react";
import { Fragment, createRef, forwardRef} from "react";
import { Header } from "~/app/_components/Header";

function Success() {
    const stripeCompleted = true;
    const ref = createRef<HTMLDivElement>();

    const SuccessMessageComponent = forwardRef<HTMLDivElement>((props, forwardedRef) => {
        return(
            <div ref={forwardedRef} className="bg-amber-100 rounded-xl shadow-lg">
                <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            Welcome to Cardboard 🥳
                        </h2>
                        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
                            Your box is now ready to use! <br/>
                            Click the button below to start packing 
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <a
                            href="/dashboard"
                            className="rounded-md bg-amber-700 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-amber-800 active:opacity-80 duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                            Go to dashboard
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    });

    SuccessMessageComponent.displayName = "SuccessMessageComponent";
    
    return (
        <Transition
            as={Fragment}
            show={stripeCompleted}
            enter="transform duration-500 transition ease-in-out"
            enterFrom="translate-y-full opacity-0 scale-95"
            enterTo="translate-y-0 opacity-100 scale-100"
            leave="transform duration-500 transition ease-in-out"
            leaveFrom="translate-y-0 opacity-100 scale-100 "
            leaveTo="translate-y-full opacity-0 scale-95 "
        >
            <SuccessMessageComponent ref={ref}/>
        </Transition>
    );
}

export default function SuccessWrapper() {
    return(
        <SessionProvider>
            <div className="fixed flex z-50 top-0 w-full shadow">
                <Header/>
            </div>
            <div className="flex h-screen w-screen items-center justify-center">
                <Success/>
            </div>
        </SessionProvider>
    );
}