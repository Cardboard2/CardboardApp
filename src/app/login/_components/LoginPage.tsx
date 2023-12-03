"use client";

import React from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import CardboardLogo from "~/app/_components/CardboardLogo";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import Image from "next/image";
import { Spinner } from "~/app/_components/Spinner";

export default function LoginWrapper() {
  const [isLogin, setIsLogin] = React.useState(true);
  const session = useSession();
  const router = useRouter();

  if (session.status == "loading") {
    return <div className="w-screen h-screen flex items-center justify-center"> <Spinner/> </div> 
  };

  if (session.data?.user)
    router.push("/dashboard");


  return (
    <div className="flex min-h-full justify-center items-center py-12 sm:px-6 w-full">
      <div className="mt-10 sm:mx-auto w-full max-w-[480px] bg-amber-100 p-5 rounded-2xl shadow-lg">
        <h2 className="mt-2 p-2 text-center font-semibold text-3xl leading-9 text-gray-900">
          {isLogin ? "Open your Cardboard box" : "Order a new box"}
        </h2>
        <section className="mt-5 sm:mx-auto sm:w-full sm:max-w-[480px] ">
          <div className="px-4 py-4 sm:px-12 gap-2 grid">
            {isLogin ? <LoginForm /> : <SignUpForm />}
            <button
              onClick={()=>setIsLogin(!isLogin)}
              className="flex w-full justify-center rounded-md bg-amber-400 px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm hover:bg-amber-500 active:opacity-80 duration-300"
              >
                {isLogin ? "New account?" : "Have an account?"}
              </button>
          <div>
              <div className="relative mt-6 ">
                <div
                  className="absolute inset-0 flex items-center "
                  aria-hidden="true"
                >
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm font-medium leading-6">
                  <span className="bg-amber-200 rounded-full px-6 text-gray-900">
                    Or continue with
                  </span>
                </div>
              </div>

              <div
                className="mt-6 gap-4 hover:cursor-pointer"
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              >
                <div
                  className="flex w-full items-center justify-center gap-3 rounded-md bg-blue-700 hover:bg-blue-800 active:opacity-80 duration-300 hover px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D9BF0]"
                >
                  <Image
                    width="15"
                    height="15"
                    alt="Google G Icon"
                    src="/GoogleGIcon.png"
                  />
                  <span className="text-sm font-semibold leading-6">
                    Google
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
