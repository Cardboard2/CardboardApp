"use client";

import React from "react";
import { signIn } from "next-auth/react";
import CardboardLogo from "~/app/_components/CardboardLogo";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import Image from "next/image";

export default function LoginWrapper() {
  const [isLogin, setIsLogin] = React.useState(true);

  const toggleLoginScreen = () => {
    if (isLogin) {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  };

  return (
    <div className="lg:px-8r flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6">
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <a
          onClick={() => toggleLoginScreen()}
          className="ml-5 mr-auto cursor-pointer text-xs text-[#2563eb]"
        >
          {isLogin ? "New account?" : "Have an account?"}
        </a>
        <div className="mx-auto h-10 w-10">
          <CardboardLogo />
        </div>
        <h2 className="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          {isLogin ? "Login" : "Sign up"}
        </h2>
        <section className="mt-5 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            {isLogin ? <LoginForm /> : <SignUpForm />}
            <div>
              <div className="relative mt-6">
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm font-medium leading-6">
                  <span className="bg-white px-6 text-gray-900">
                    Or continue with
                  </span>
                </div>
              </div>

              <div
                className="mt-6 gap-4 "
                onClick={() => signIn("google", { callbackUrl: "/profile" })}
              >
                <a
                  href="#"
                  className="flex w-full items-center justify-center gap-3 rounded-md bg-[#1466ee] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D9BF0]"
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
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
