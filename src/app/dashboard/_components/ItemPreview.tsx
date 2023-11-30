import { Dialog, Transition } from '@headlessui/react'
import { Fragment, use, useState } from 'react'
import { DashboardProps } from './DashboardProps'
import { api } from '~/trpc/react';
import { ArrowDownCircleIcon, InformationCircleIcon, XCircleIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { DocumentIcon, ShareIcon } from '@heroicons/react/20/solid';
import { FileDetail } from './FileDetail';
import { Spinner } from '~/app/_components/Spinner';

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

export function DisplayMetadata(showMetadata: boolean, fileDetail: FileDetail) {
  return(
    <Transition appear show={showMetadata && fileDetail.name != "Unknown"} as={Fragment}>
      <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0 scale-0 -translate-y-full"
          enterTo="opacity-100 scale-100 translate-y-0"
          leave="ease-in-out duration-300"
          leaveFrom="opacity-100 scale-100 translate-y-0"
          leaveTo="opacity-0 scale-0 -translate-y-full"
        >
          <div className="absolute right-2 top-12 p-2 rounded-xl w-[20rem] md:w-[42rem] bg-amber-300 text-left shadow-xl">
            <p className="text-lg font-bold text-amber-950 p-1 mb-2">File info</p>
            <p className="truncate"><span className='font-extrabold text-gray-600 text-xs'>Name: </span><span className="text-sm text-gray-800 font-semibold">{fileDetail.name}</span></p>
            <p className="truncate"><span className='font-extrabold text-gray-600 text-xs'>Type: </span><span className="text-sm text-gray-800 font-semibold">{fileDetail.type}</span></p>
            <p className="truncate"><span className='font-extrabold text-gray-600 text-xs'>Last modified: </span><span className="text-sm text-gray-800 font-semibold">{String(fileDetail.modifiedAt)}</span></p>
            <p className="truncate"><span className='font-extrabold text-gray-600 text-xs'>Size: </span><span className="text-sm text-gray-800 font-semibold">{DataSizeConversion(fileDetail.size)}</span></p>
          </div>
        </Transition.Child>
    </Transition>
  );
}

function ShareFile(showSharing: boolean, url: string) {

  function ErrorMessage() {
    return (<p className="text-md font-semibold text-gray-700 p-1">Failed creating shareable URL.... 😔</p>);
  }

  function SuccessMessage(url: string) {
    return (
      <div>
        <div className='relative w-full bg-gray-50 p-2 rounded-xl shadow-lg mb-2 flex'>
          <input type="text" disabled={true} id="shareFileUrl" value={url} className=" bg-transparent focus:outline-none w-full h-full"/>
          <button onClick={async ()=>{
            await navigator.clipboard.writeText(url);
          }} className="ml-2 top-1/2 right-0 h-6 w-6 text-amber-700 hover:text-amber-800 active:opacity-80 duration-200"><ClipboardDocumentIcon/></button>
          
        </div>
        <p className="text-sm font-semibold text-gray-700 p-1">Use the link provided to allow anyone to access have to this file.</p>
      </div>
    );
  }

  return(
    <Transition appear show={showSharing} as={Fragment}>
      <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0 scale-0 -translate-y-full"
          enterTo="opacity-100 scale-100 translate-y-0"
          leave="ease-in-out duration-300"
          leaveFrom="opacity-100 scale-100 translate-y-0"
          leaveTo="opacity-0 scale-0 -translate-y-full"
        >
          <div className="absolute right-2 top-12 p-2 rounded-xl w-[20rem] md:w-[42rem] bg-amber-300 text-left shadow-xl">
            <p className="text-lg font-bold text-amber-950 p-1 mb-2">Share your files</p>
            {url == "" ? <Spinner width={14} height={14}/> : url == "err" ? ErrorMessage() : SuccessMessage(url)}
          </div>
        </Transition.Child>
    </Transition>
  );
};

export function DownloadFile(downloadUrl: string) {
  if (downloadUrl != "") {
    const el = document.createElement("a");
    el.href = downloadUrl;
    el.click();
    el.remove();
  }
}


export function DisplayContent(type: string, url: string) {
  if (type == "Unknown")
    return (<p className='text-2xl font-bold text-gray-50'>File does not exist or was not shared ❌</p>);

  else if (type == "" || url == "")
    return (<Spinner/>);

  else if (!type.includes("image") && !type.includes("mp4") && !type.includes("pdf") && !type.includes("text"))
    return (<DocumentIcon className='h-24 w-24 text-slate-200'/>)

  else if (type.includes("image"))
    return (<img src={url} className='object-contain max-w-full max-h-full p-3 pt-10'/>);
    
  else
    return (<iframe src={url} allowFullScreen={true} className={`h-full w-full p-3 flex items-center justify-center pt-10 ${type.includes("text") ? "bg-slate-100" : ""}`}/>);
}

export function ItemPreview(props: {dashboardProps : DashboardProps}) {
  const {data: url} = api.aws.getInlineUrl.useQuery({id: props.dashboardProps.fileDetail.id});
  const {data: downloadUrl} = api.aws.queryDownloadLink.useQuery({id: props.dashboardProps.fileDetail.id});
  const [showMetadata, setShowMetadata] = useState(false);
  const [shareFile, setShareFile] = useState(false);
  const [shareFileUrl, setShareFileUrl] = useState("");

  const shareableLink = api.file.makeFileSharable.useMutation({
    onError: () => {
      setShareFileUrl("err");
    },
    onSuccess: (data) => {
      setShareFileUrl(data ?? "err");
    }
  });

  return (
    <>
      <Transition appear show={props.dashboardProps.dialogOpen} as={Fragment}>
        <Dialog as="div" className="absolute top-0 left-0 z-50 h-screen w-screen" onClose={()=>{
                                                                                              props.dashboardProps.setDialogOpen(false);
                                                                                              setShowMetadata(false);
                                                                                              setShareFile(false);
                                                                                              setShareFileUrl("");}}>
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
                    <button onClick={()=>{
                                        shareableLink.mutate({id: props.dashboardProps.fileDetail.id});
                                        setShowMetadata(false);
                                        setShareFile(!shareFile);
                      }} className='h-10 w-10 p-2 text-amber-500 hover:text-amber-700 active:opacity-80 duration-200'>
                      <ShareIcon/>
                    </button>
                    <button onClick={()=>DownloadFile(downloadUrl ?? "")} className='h-10 w-10 p-2 text-amber-500 hover:text-amber-700 active:opacity-80 duration-200'>
                      <ArrowDownCircleIcon/>
                    </button>
                    <button onClick={()=>{
                                        setShareFile(false);
                                        setShareFileUrl("");
                                        setShowMetadata(!showMetadata);
                      }} className='h-10 w-10 p-2 text-amber-500 hover:text-amber-700 active:opacity-80 duration-200'>
                      <InformationCircleIcon/>
                    </button>
                    <button onClick={()=>{
                                        props.dashboardProps.setDialogOpen(false);
                                        setShowMetadata(false);
                                        setShareFile(false);
                                        setShareFileUrl("");
                      }} className='h-10 w-10 p-2 text-amber-500 hover:text-amber-700 active:opacity-80 duration-200'>
                      <XCircleIcon/>
                    </button>
                  </div>
                  {DisplayContent(props.dashboardProps.fileDetail.type ?? "", url ?? "")}
                  {DisplayMetadata(showMetadata, props.dashboardProps.fileDetail)}
                  {ShareFile(shareFile, shareFileUrl)}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
