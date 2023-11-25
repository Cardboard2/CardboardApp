import { Dialog, Transition } from '@headlessui/react'
import { Fragment, createRef, useEffect, useRef, useState } from 'react'
import { DashboardProps } from './DashboardProps'
import { FileDetail } from './FileDetail';
import { api } from '~/trpc/react';

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



export function ItemPreview(props:{dashboardProps : DashboardProps}) {
  const [url, setUrl] = useState("none");
  const haveFetchedUrl = useRef(false);

  const urlGet = api.aws.getDownloadLink.useMutation({
    onSuccess: (data) => {
      if (data){
        setUrl(data.link);
      }
    },
    onError: (err) => {
      setUrl("error");
    },
  });

  if (!haveFetchedUrl.current) {
    haveFetchedUrl.current = true;
    if (String(props.dashboardProps.fileDetail.type).includes("image")){
      urlGet.mutate({
        request: { name: props.dashboardProps.fileDetail.name, folderId: props.dashboardProps.folderId},
      });
    }
  }


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
            <div className="fixed inset-0 bg-slate-900 opacity-30" />
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
                <Dialog.Panel className="w-full max-w-6xl transform overflow-hidden rounded-2xl h-full max-h-[48rem] bg-amber-200 p-6 text-left align-middle shadow-xl transition-all flex justify-between items-starts">
                  <div className='flex justify-center items-center w-9/12 p-2 bg-amber-300 shadow-inner rounded-2xl m-2'>
                    <img src={url} alt=""/>
                  </div>

                  <div className="m-2 w-3/12 h-fit ring-2 ring-amber-700 p-2 rounded-lg">
                    <p><span className='text-sm font-bold text-gray-700'>Name: </span><span className='text-sm font-semibold text-gray-800'>{props.dashboardProps.fileDetail.name}</span></p>
                    <p><span className='text-sm font-bold text-gray-700'>Type: </span><span className='text-sm font-semibold text-gray-800'>{props.dashboardProps.fileDetail.type}</span></p>
                    <p><span className='text-sm font-bold text-gray-700'>Size: </span><span className='text-sm font-semibold text-gray-800'>{DataSizeConversion(props.dashboardProps.fileDetail.size)}</span></p>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}