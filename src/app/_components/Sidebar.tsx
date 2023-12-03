import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import {
    ArrowLeftOnRectangleIcon,
    Bars3Icon,
    HomeIcon,
    CircleStackIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline'
import { signOut } from 'next-auth/react'
import CardboardLogo from './CardboardLogo'
import { UserData } from '~/server/api/routers/user'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, current: true },
  { name: 'Upgrade', href: '/upgrade', icon: CircleStackIcon, current: false },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

function SidebarComponent(props: {user: UserData}) {
    return (
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-amber-400 border-r-2 border-amber-800 px-6">
            <div className="flex h-16 shrink-0 items-center">
                <div className="w-8 h-8 text-amber-950"><CardboardLogo/></div>
            </div>
            <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                        <ul role="list" className="-mx-2 space-y-1">
                            {navigation.map((item) => (
                                <li key={item.name}>
                                    <a
                                        href={item.href}
                                        className={classNames(
                                            item.current
                                            ? 'bg-amber-800 text-white'
                                            : 'text-gray-800 hover:text-white hover:bg-amber-800 duration-300',
                                            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                        )}
                                    >
                                    <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                                    {item.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </li>
                    <li className="-mx-6 mt-auto">
                        <a href="/profile" className="flex items-center truncate w-full gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-800 hover:text-white hover:bg-amber-800 duration-300">
                            <img
                                className="h-8 w-8 rounded-full bg-gray-800 ring-2 ring-amber-700"
                                src={props.user.image}
                                alt=""
                            />
                            <span className="sr-only">Your profile</span>
                            <span aria-hidden="true" className="max-w-full truncate">{props.user.name}</span>
                        </a>
                        <button
                            onClick={()=>signOut()}
                            className="flex w-full items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-800 hover:text-white hover:bg-amber-800 duration-300"
                        >
                            <ArrowLeftOnRectangleIcon className="h-6 w-6 shrink-0 "/>
                            <span aria-hidden="true">Log out</span>
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default function Sidebar(props : {user: UserData}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <div className='w-full'>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  <SidebarComponent user={props.user}/>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          <SidebarComponent user={props.user}/>
        </div>

        <div className="fixed w-full top-0 z-40 flex items-center gap-x-6 bg-amber-400 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
          <button type="button" className="-m-2.5 p-2.5 text-gray-800 lg:hidden" onClick={() => setSidebarOpen(true)}>
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </div>
    </>
  )
}