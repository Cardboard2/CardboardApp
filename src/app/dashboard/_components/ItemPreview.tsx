import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { DashboardProps } from './DashboardProps'
import { api } from '~/trpc/react';
import { ArrowDownCircleIcon, InformationCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { DocumentIcon, ShareIcon } from '@heroicons/react/20/solid';

const SIZE_KILO = 1024;
const SIZE_MEGA = 1048576;
const SIZE_GIGA = 1073741824;

function DataSizeConversion(size: number | undefined) {
  if (size == undefined)
    return "Undefined"

  if (size > SIZE_GIGA)
    return String(Math.round((size / SIZE_GIGA) * 100) / 100) + " GB";
  else if (size > SIZE_MEGA)
    return String(Math.round((size / SIZE_MEGA) * 100) / 100) + " MB";
  else if (size > SIZE_KILO)
    return String(Math.round((size / SIZE_KILO) * 100) / 100) + " KB";
  else
    return String(size) + " B";
}


function DisplayContent(type: string, url: string) {
  if (type == "" || url == "")
    return (<></>);

  else if (!type.includes("image") && !type.includes("mp4") && !type.includes("pdf") && !type.includes("text"))
    return (<DocumentIcon className='h-24 w-24 text-slate-200'/>)

  else if (type.includes("image"))
    return (<img src={url} className='object-contain max-w-full max-h-full p-3 pt-10'/>);
    
  else
    return (<iframe src={url} allowFullScreen={true} className={`h-full w-full p-3 flex items-center justify-center pt-10 ${type.includes("text") ? "bg-slate-100" : ""}`}/>);
}


export function ItemPreview(props: {dashboardProps : DashboardProps}) {
  const {data: url} = api.aws.getInlineUrl.useQuery({request: {id: props.dashboardProps.fileDetail.id}});
  console.log(props.dashboardProps.fileDetail.type)
  return (
    <>
      <Transition appear show={props.dashboardProps.dialogOpen} as={Fragment}>
        <Dialog as="div" className="absolute top-0 left-0 z-50 h-screen w-screen" onClose={()=>props.dashboardProps.setDialogOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-slate-900 opacity-80" />
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
                    <button className='h-10 w-10 p-2 text-amber-500'>
                      <ShareIcon/>
                    </button>
                    <button className='h-10 w-10 p-2 text-amber-500'>
                      <ArrowDownCircleIcon/>
                    </button>
                    <button className='h-10 w-10 p-2 text-amber-500'>
                      <InformationCircleIcon/>
                    </button>
                    <button className='h-10 w-10 p-2 text-amber-500'>
                      <XCircleIcon/>
                    </button>
                  </div>
                  {DisplayContent(props.dashboardProps.fileDetail.type ?? "", url ?? "")}
                  
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
