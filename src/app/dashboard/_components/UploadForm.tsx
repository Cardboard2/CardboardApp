import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { DashboardProps } from "./DashboardProps";
import { useState } from "react";
import { Tab } from "@headlessui/react";
import { api } from "~/trpc/react";

import { type SubmitHandler, useForm } from "react-hook-form";
import { FormInput } from "./FileDetail";
import { NotificationProps } from "~/app/_components/NotificationProps";
import { UsageBarProps } from "~/app/_components/UsageBarProps";

function readFile(file: File) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => {
      resolve(fr.result);
    };
    fr.onerror = reject;
    fr.readAsBinaryString(file);
  });
}

export function UploadForm(props: {
  dashboardProps: DashboardProps;
  usageBarProps: UsageBarProps;
  notificationProps: NotificationProps;
}) {
  const uploadFile = api.aws.uploadFile.useMutation({
    onSuccess: (data) => {
      if (data && data.status == "success") {
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

  const { register, handleSubmit } = useForm<FormInput>();

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    for (const currFile of data.files) {
      if (!currFile.name || !currFile.size || !currFile.type) return;

      await new Promise((r) => setTimeout(r, 1000));
      await readFile(currFile).then((file) => {
        const fileData = {
          name: currFile.name,
          size: currFile.size,
          type: currFile.type,
          folderId: props.dashboardProps.currFolderId,
        };
        const rawData = file as Blob;
        const encryptedData = btoa(String(rawData));
        uploadFile.mutate({ file: encryptedData, metadata: fileData });
      });
    }
  };

  return (
    <>
      <Transition appear show={props.dashboardProps.creationOpen} as={Fragment}>
        <Dialog
          as="div"
          className="absolute left-0 top-0 z-40 h-screen w-screen"
          onClose={() => {
            props.dashboardProps.setCreationOpen(false);
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
                <Dialog.Panel className="lg:3/5 relative flex h-5/6 w-11/12 transform items-center justify-center overflow-hidden rounded-2xl bg-amber-200 p-1 shadow-xl md:w-3/5 ">
                  {" "}
                  <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                    <input
                      {...register("files")}
                      type="file"
                      id="upload"
                      multiple
                    />
                    <button className=" float-right inline-flex rounded-md bg-amber-400 px-3 py-2 text-sm font-semibold  text-gray-900  shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
                      Upload File
                    </button>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

// const uploadFile = api.aws.uploadFile.useMutation({
//   onSuccess: (data) => {
//     if (data && data.status == "success") {
//       console.log(data.usage);
//       getFiles.mutate({ folderId: currFolderId });
//       props.usageBarProps.setUsageBarUsage(data.usage.userUsage);
//       props.usageBarProps.setUsageBarTotal(data.usage.totalStorage);

//     //   setNotificationTitle("File upload successfully!");
//     //   setNotificationMessage("File has been uploaded");
//     //   setNotificationSuccess(true);
//     //   setNotificationVisible(true);
//     //   setTimeout(function () {
//     //     setNotificationVisible(false);
//     //   }, 3000);
//     // } else {
//     //   setNotificationTitle("File upload failed..");
//     //   setNotificationMessage("Error detected...");
//     //   setNotificationSuccess(false);
//     //   setNotificationVisible(true);
//     //   setTimeout(function () {
//     //     setNotificationVisible(false);
//     //   }, 10000);
//     // }
//   },
// });
