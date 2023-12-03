"use client"
import { SimpleHeader } from "../_components/SimpleHeader";
import { Transition, Dialog } from "@headlessui/react";
import { Fragment, useRef, useState } from "react";
import { api } from "~/trpc/react";

import { ArrowDownCircleIcon, InformationCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useRouter, useSearchParams } from "next/navigation";
import { DisplayContent, DisplayMetadata, DownloadFile } from "../dashboard/_components/ItemPreview";
import { defaultFileDetail } from "../dashboard/_components/FileDetail";


export default function SharedFile() {
    const [showing, setShowing] = useState(true);
    const [showMetadata, setShowMetadata] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    const id = searchParams.get("id") ?? "";

    const ret = api.file.getSharedFile.useQuery({id: id});

    return(
        <div>
            <div className="fixed flex z-50 top-0 w-full shadow">
                <SimpleHeader/>
            </div>

            <Transition appear show={showing} as={Fragment}>
                <Dialog as="div" className="absolute top-0 left-0 z-50 h-screen w-screen" onClose={()=>{
                                                                                                    setShowing(false);
                                                                                                    router.push("/dashboard");
                                                                                                }}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-950 opacity-80" />
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
                        
                        <Dialog.Panel className="relative w-full max-w-6xl transform overflow-hidden rounded-2xl bg-black bg-opacity-20 shadow-xl h-full max-h-[48rem] p-1 flex items-center justify-center ">
                        <div className='absolute right-2 top-2'>
                            
                            <button onClick={()=>{DownloadFile(ret.data?.downloadUrl ?? "")}} className='h-10 w-10 p-2 ml-2 shadow-xl text-amber-500 hover:text-amber-700 active:opacity-80 duration-200 bg-gray-900 rounded-full'>
                                <ArrowDownCircleIcon/>
                            </button>
                            <button onClick={()=>{setShowMetadata(!showMetadata)}} className='h-10 w-10 p-2 ml-2 shadow-xl text-amber-500 hover:text-amber-700 active:opacity-80 duration-200 bg-gray-900 rounded-full'>
                                <InformationCircleIcon/>
                            </button>
                            <button onClick={()=>{
                                                setShowing(false);
                                                setShowMetadata(false);
                                                router.push("/dashboard");
                            }} className='h-10 w-10 p-2 mx-2 shadow-xl text-red-500 hover:text-red-700 active:opacity-80 duration-200 bg-gray-900 rounded-full'>
                                <XCircleIcon/>
                            </button>
                        </div>
                        <div className='h-full w-full pt-12 flex items-center justify-center'>
                            {DisplayContent(ret.data?.file.type ?? "", ret.data?.inlineUrl ?? "")}
                        </div>
                        {DisplayMetadata(showMetadata, ret.data?.file ?? defaultFileDetail)}
                        </Dialog.Panel>
                    </Transition.Child>
                    </div>
                </div>
                </Dialog>
            </Transition>
        </div>
    );
}
