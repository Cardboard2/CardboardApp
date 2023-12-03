"use client";
import React from "react";
import { SessionProvider } from "next-auth/react";
import { Dashboard } from "./_components/Dashboard";
import { ItemPreview } from "./_components/ItemPreview";
import Profile from "../profile/Profile";
import UsageBar from "../_components/UsageBar";
import { UsageBarProps } from "../_components/UsageBarProps";

import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  CalendarIcon,
  ChartPieIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import CardboardLogo from "~/app/_components/CardboardLogo";
import { defaultFileDetail } from "./_components/FileDetail";
import { DashboardProps } from "./_components/DashboardProps";
import { api } from "~/trpc/react";

const navigation = [
  { name: "Dashboard", href: "#", icon: HomeIcon, current: true },
];
const teams = [
  { id: 1, name: "xyz", href: "#", initial: "1", current: false },
  //   { id: 2, name: "xxx ", href: "#", initial: "2", current: false },
  //   { id: 3, name: "yyy", href: "#", initial: "3", current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Example() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [folderId, setFolderId] = useState("");
  const [fileDetail, setFileDetail] = useState(defaultFileDetail);

  const dashboardProps: DashboardProps = {
    fileDetail: fileDetail,
    dialogOpen: dialogOpen,
    folderId: folderId,
    setDialogOpen: setDialogOpen,
    setFileDetail: setFileDetail,
    setFolderId: setFolderId,
  };

  const [usage, setUsage] = useState(0);
  const [totalSpace, setTotalSpace] = useState(0);

  const usageBarProps: UsageBarProps = {
    setUsage: setUsage,
    setTotalSpace: setTotalSpace,
  };

  const getUsage = api.aws.getUsage.useMutation({
    onSuccess: (data) => {
      setUsage(data.userUsage);
      setTotalSpace(data.totalStorage);
    },
  });
  useEffect(() => {
    getUsage.mutate();
  }, []);

  return (
    <>
      <SessionProvider>
        <div>
          <Transition.Root show={sidebarOpen} as={Fragment}>
            <Dialog
              as="div"
              className="relative z-50 lg:hidden"
              onClose={setSidebarOpen}
            >
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
                        <button
                          type="button"
                          className="-m-2.5 p-2.5"
                          onClick={() => setSidebarOpen(false)}
                        >
                          <span className="sr-only">Close sidebar</span>
                          <XMarkIcon
                            className="h-6 w-6 text-white"
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                    </Transition.Child>
                    {/* Sidebar component, swap this element with another sidebar if you like */}
                    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-amber-400 px-6 pb-2 ring-1 ring-white/10">
                      <div className="flex h-16 shrink-0 items-center">
                        <CardboardLogo></CardboardLogo>
                      </div>
                      <nav className="flex flex-1 flex-col">
                        <ul
                          role="list"
                          className="flex flex-1 flex-col gap-y-7"
                        >
                          <li>
                            <ul role="list" className="-mx-2 space-y-1">
                              {navigation.map((item) => (
                                <li key={item.name}>
                                  <a
                                    href={item.href}
                                    className={classNames(
                                      item.current
                                        ? "bg-gray-800 text-white"
                                        : "text-black hover:bg-gray-800 hover:text-white",
                                      "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                                    )}
                                  >
                                    <item.icon
                                      className="h-6 w-6 shrink-0"
                                      aria-hidden="true"
                                    />
                                    {item.name}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </li>
                          <li>
                            <div className="text-xs font-semibold leading-6 text-black">
                              Your folders
                            </div>
                            <ul role="list" className="-mx-2 mt-2 space-y-1">
                              {teams.map((team) => (
                                <li key={team.name}>
                                  <a
                                    href={team.href}
                                    className={classNames(
                                      team.current
                                        ? "bg-gray-800 text-white"
                                        : "text-black hover:bg-gray-800 hover:text-white",
                                      "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                                    )}
                                  >
                                    {/* <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-[0.625rem] font-medium text-black group-hover:text-white">
                                      {team.initial}
                                    </span> */}
                                    <FolderIcon
                                      className="h-6 w-6"
                                      aria-hidden="true"
                                    ></FolderIcon>
                                    <span className="truncate">
                                      {team.name}
                                    </span>
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition.Root>

          {/* Static sidebar for desktop */}
          <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-amber-400 px-6">
              <div className="w-autoshrink-0 mt-5 h-8 justify-start">
                <CardboardLogo />
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
                                ? "bg-amber-500 text-black"
                                : "text-black hover:bg-gray-800 hover:text-white",
                              "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                            )}
                          >
                            <item.icon
                              className="h-6 w-6 shrink-0"
                              aria-hidden="true"
                            />
                            {item.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                  <li>
                    <div className="text-xs font-semibold leading-6 text-black">
                      Your folders
                    </div>
                    <ul role="list" className="-mx-2 mt-2 space-y-1">
                      {teams.map((team) => (
                        <li key={team.name}>
                          <a
                            href={team.href}
                            className={classNames(
                              team.current
                                ? "bg-gray-800 text-white"
                                : "text-black hover:bg-gray-800 hover:text-white",
                              "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                            )}
                          >
                            {/* <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-[0.625rem] font-medium text-black group-hover:text-white">
                              {team.initial}
                            </span> */}
                            <FolderIcon
                              className="h-6 w-6"
                              aria-hidden="true"
                            ></FolderIcon>
                            <span className="truncate">{team.name}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                  <li className="-mx-6 mb-2 mt-auto flex-col gap-5 px-5">
                    <div className="mb-5 rounded-md bg-amber-300 px-3 pb-2 pt-3 ">
                      <UsageBar usage={usage} totalSpace={totalSpace} />

                      <div className="mt-1">
                        <a className=" pl-1 text-[12px]">
                          {usage} MB of {totalSpace} MB used
                        </a>
                      </div>
                    </div>

                    <Profile></Profile>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-amber-400 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-black lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="flex-1 text-sm font-semibold leading-6 text-white">
              Dashboard
            </div>
            <Profile></Profile>
          </div>

          <main className="py-10 lg:pl-72">
            <div className="flex-col p-10 md:flex md:justify-between">
              <div className="min-w-0 flex-1">
                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                  Dashboard
                </h2>
              </div>
              <Dashboard
                dashboardProps={dashboardProps}
                usageBarProps={usageBarProps}
              />
              {dialogOpen ? (
                <ItemPreview dashboardProps={dashboardProps} />
              ) : (
                <></>
              )}
            </div>
          </main>
        </div>
      </SessionProvider>
    </>
  );
}
