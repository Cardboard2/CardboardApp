import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { DashboardProps } from "./DashboardProps";
import { api } from "~/trpc/react";
import { FileUpload, FileUploadOptions } from 'primereact/fileupload';

import { NotificationProps } from "~/app/_components/NotificationProps";
import { UsageBarProps } from "~/app/_components/UsageBarProps";
import { XCircleIcon } from "@heroicons/react/24/outline";


const chooseOpt : FileUploadOptions = {
  label: "Select File",
  className: "p-2 w-20 md:w-24 font-bold text-2xl duration-300 active:opacity-80 text-sm text-blue-500 shadow-xl rounded-full mr-2 border-4 border-blue-400 hover:border-blue-600",
  iconOnly: true
}

const uploadOpt : FileUploadOptions = {
  label: "Upload File",
  className: "p-2 w-20 md:w-24 font-bold duration-300 active:opacity-80 text-sm text-green-700 shadow-xl rounded-full border-4 border-green-400 hover:border-green-600",
  iconOnly: true
}

const cancelOpt : FileUploadOptions = {
  label: "Clear Upload",
  className: "hidden",
  iconOnly: true
}

export function UploadForm(props: {
  dashboardProps: DashboardProps;
  usageBarProps: UsageBarProps;
  notificationProps: NotificationProps;
}) {

  function readFile(file: File) {
    return new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => {
        resolve(fr.result);
      };
      fr.onerror = reject;
      fr.readAsBinaryString(file);
    });}
  

  const uploadFile = api.aws.uploadFile.useMutation({
    onSuccess: (data) => {
      if (data && data.status == "success") {
        props.dashboardProps.setUploadFormOpen(false);
        console.log(data.usage);
        props.usageBarProps.setUsageBarUsage(data.usage.userUsage);
        props.usageBarProps.setUsageBarTotal(data.usage.totalStorage);

        props.notificationProps.setNotificationTitle(
          "File uploaded successfully!",
        );
        props.notificationProps.setNotificationMessage(
          "File has been uploaded",
        );
        props.notificationProps.setNotificationSuccess(true);
        props.notificationProps.setNotificationVisible(true);
        setTimeout(function () {
          props.notificationProps.setNotificationVisible(false);
        }, 3000);

        props.dashboardProps.updateFileListCounter(
          props.dashboardProps.fileListUpdatedCounter + 1,
        );
      } else {
        props.notificationProps.setNotificationTitle("File upload failed..");
        props.notificationProps.setNotificationMessage("Error detected...");
        props.notificationProps.setNotificationSuccess(false);
        props.notificationProps.setNotificationVisible(true);
        setTimeout(function () {
          props.notificationProps.setNotificationVisible(false);
        }, 10000);
      }
    },
  });

  return (
    <>
      <Transition appear show={props.dashboardProps.uploadFormOpen} as={Fragment}>
        <Dialog
          as="div"
          className="absolute left-0 top-0 z-40 h-screen w-screen"
          onClose={() => {
            props.dashboardProps.setUploadFormOpen(false);
          }}
        >
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

          <div className="fixed inset-0 h-full w-full overflow-y-auto">
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
                <Dialog.Panel className={`lg:3/5 relative flex h-1/2 w-11/12 transform items-center justify-center overflow-hidden rounded-2xl bg-amber-200 p-8 shadow-xl md:w-3/5 ${uploadFile.isLoading ? "cursor-wait" : ""}`}>
                  <FileUpload name="upload" chooseOptions={chooseOpt} uploadOptions={uploadOpt} cancelOptions={cancelOpt} mode="advanced"
                    emptyTemplate={<p className="break-words hidden h-80 md:flex md:items-center md:m-auto text-xl lg:text-2xl border-4 border-amber-700 p-3 font-bold m-2 rounded-2xl text-gray-600">Drag file here or use the select button</p>}
                    contentClassName=" m-2 p-2 truncate text-sm md:text-md font-semibold "
                    headerClassName="fixed bottom-4 left-4 md:bottom-10 left-10"
                    disabled={uploadFile.isLoading}
                    customUpload
                    uploadHandler={(event)=>{
                      event.files.forEach((file) => { (async ()=>{ 
                        console.log("File: ", file)
                        const fileData = {
                          name: file.name,
                          size: file.size,
                          type: file.type,
                          folderId: props.dashboardProps.currFolderId,
                        };
                        
                        const blob = await readFile(file) as Blob;
                        const base64data = btoa(String(blob));
                        uploadFile.mutate({ file: base64data, metadata: fileData });
                      })()})
                    }}
                    previewWidth={0}/>
                    
                  <XCircleIcon className="fixed top-4 right-4 w-10 h-10 text-red-500 hover:text-red-600 active:opacity-80 cursor-pointer font-bold" onClick={()=>{props.dashboardProps.setUploadFormOpen(false)}}/>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}