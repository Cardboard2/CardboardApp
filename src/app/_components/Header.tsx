import React from "react";
import { useState, type Dispatch, type SetStateAction, Fragment } from "react";
import { Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useSession, signIn, signOut } from "next-auth/react";

import CardboardLogo from "./CardboardLogo.tsx";
import { useRouter } from "next/navigation";

const navigation = [{ name: "Pricing", href: "/pricing" }];

export interface MobileMenuProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: Dispatch<SetStateAction<boolean>>;
}

function MobileNavigationMenu(props: { mobileMenuState: MobileMenuProps }) {
  const ref = React.createRef<HTMLDivElement>();
  const { data: session } = useSession();
  const router = useRouter();

  const MobilenavigationComponent = React.forwardRef<
    HTMLDivElement,
    MobileMenuProps
  >((props, forwardedRef) => {
    return (
      <div
        ref={forwardedRef}
        className="fixed left-0 right-0 top-0 h-screen lg:hidden"
      >
        <div className="fixed inset-0" />
        <div className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-amber-400 px-6 py-6 text-amber-950 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-start  justify-between">
            <div className=" z-10 flow-root w-3/4">
              <div className="-my-6 w-full divide-y divide-black">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-amber-100"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="py-6">
                  {session && session.user ? (
                    <button
                      onClick={() => {
                        router.push("/dashboard");
                      }}
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-amber-100"
                    >
                      Go to Dashboard
                    </button>
                  ) : (
                    <></>
                  )}

                  <button
                    onClick={() =>
                      session && session.user
                        ? signOut()
                        : router.push("/login")
                    }
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-amber-100"
                  >
                    {session && session.user ? "Sign Out" : "Sign In"}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 pt-5 text-amber-950"
              onClick={() => props.setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    );
  });

  MobilenavigationComponent.displayName = "MobileNavigationCompnent";

  return (
    <Transition
      as={Fragment}
      show={props.mobileMenuState.mobileMenuOpen}
      enter="transform duration-300 transition ease-in-out"
      enterFrom="translate-x-full"
      enterTo="translate-x-0"
      leave="transform duration-300 transition ease-in-out"
      leaveFrom="translate-x-0"
      leaveTo="translate-x-full"
    >
      <MobilenavigationComponent {...props.mobileMenuState} ref={ref} />
    </Transition>
  );
}

export function Header() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuState: MobileMenuProps = {
    mobileMenuOpen,
    setMobileMenuOpen,
  };
  const router = useRouter();

  return (
    <header className="w-full bg-amber-400 bg-opacity-90">
      <nav
        className="z-50 mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <a href="/dashboard" className="-m-1.5 p-1.5">
          <span className="sr-only">Cardboard</span>
          <div className="h-10 w-10 text-amber-950">
            <CardboardLogo />
          </div>
        </a>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-amber-950"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12 ">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="my-auto text-sm font-semibold leading-6 text-gray-900"
            >
              {item.name}
            </a>
          ))}
          <button
            onClick={() =>
              session && session.user ? signOut() : router.push("/login")
            }
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            {session && session.user ? "Sign Out" : "Sign In"}{" "}
            <span aria-hidden="true">&rarr;</span>
          </button>
          {session && session.user ? (
            <div
              onClick={() => {
                router.push("/dashboard");
              }}
              className="relative cursor-pointer rounded-md border-2 border-amber-200 px-2 py-2"
            >
              Go to Dashboard
            </div>
          ) : (
            <></>
          )}
        </div>
      </nav>
      <MobileNavigationMenu mobileMenuState={mobileMenuState} />
    </header>
  );
}
