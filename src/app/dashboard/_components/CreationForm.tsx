import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { DashboardProps } from './DashboardProps'
import { useState } from 'react'
import { Tab } from '@headlessui/react'




export function CreationForm(props: {dashboardProps: DashboardProps}) {

  return (
    <>
      <Transition appear show={props.dashboardProps.creationOpen} as={Fragment}>
        <Dialog as="div" className="absolute top-0 left-0 z-50 h-screen w-screen" onClose={()=>{props.dashboardProps.setCreationOpen(false)}}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900 opacity-80" />
          </Transition.Child>

          <div className="fixed h-full w-full inset-0 overflow-y-auto">
            <div className="flex h-full w-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                
                <Dialog.Panel className="relative w-11/12 md:w-3/5 transform overflow-hidden rounded-2xl bg-amber-200 shadow-xl h-5/6 lg:3/5 p-1 flex items-center justify-center ">
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
