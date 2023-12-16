import { useRef, useState, useEffect } from "react";
import { DashboardProps } from "./DashboardProps";
import { api } from "~/trpc/react";
import type { FileDetail } from "./FileDetail";
import { defaultFileDetail } from "./FileDetail";
import { Spinner } from "~/app/_components/Spinner";
import { FolderIcon, PhotoIcon } from "@heroicons/react/20/solid";
import {
  ArrowDownTrayIcon,
  DocumentArrowUpIcon,
  DocumentIcon,
  FilmIcon,
  FolderPlusIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import type { Dispatch, SetStateAction } from "react";
import { NotificationProps } from "~/app/_components/NotificationProps";
import { UsageBarProps } from "~/app/_components/UsageBarProps";

import Notification from "~/app/_components/Notification";
interface DisplayProps {
  fileDetails: FileDetail[];
  currFolderId: string;
  updateFolderId: Dispatch<SetStateAction<string>>;
  dashboardProps: DashboardProps;
}

export function DisplayFiles(props: {
  dashboardProps: DashboardProps;
  usageBarProps: UsageBarProps;
  notificationProps: NotificationProps;
}) {
  
  const [retry, updateRetry] = useState(0);
  const [currFolderId, updateFolderId] = useState("");
  const [currItems, updateItems] = useState<Array<FileDetail>>([]);
  const [displayFiles, setDisplayFiles] = useState(true);

  const getFiles = api.aws.getFolderContents.useMutation({
    onSuccess: (data) => {
      if (data) {
        updateItems(data.childList);
        updateFolderId(data.folderId);
        props.dashboardProps.setCurrFolderId(data.folderId);
      } else {
        if (retry < 5) {
          updateFolderInfo(currFolderId);
          updateRetry(retry + 1);
        }
      }
      updateRetry(0);
    },
    onError: () => {
      setDisplayFiles(false);
    },
  });

  function updateFolderInfo(id: string) {
    updateFolderId(id);
    props.dashboardProps.setCurrFolderId(id);
    getFiles.mutate({ folderId: id });
  }

  const deleteFileAPI = api.aws.deleteFile.useMutation({
    onSuccess: (data) => {
      console.log(data);

      if (data && data.status == "success") {
        console.log(data.usage);
        props.usageBarProps.setUsageBarUsage(data.usage.userUsage);
        props.usageBarProps.setUsageBarTotal(data.usage.totalStorage);

        props.notificationProps.setNotificationTitle(
          "File deleted successfully!",
        );
        props.notificationProps.setNotificationMessage("File has been deleted");
        props.notificationProps.setNotificationSuccess(true);
        props.notificationProps.setNotificationVisible(true);
        setTimeout(function () {
          props.notificationProps.setNotificationVisible(false);
        }, 3000);
      } else {
        props.notificationProps.setNotificationTitle("File deletion failed..");
        props.notificationProps.setNotificationMessage("Error detected...");
        props.notificationProps.setNotificationSuccess(false);
        props.notificationProps.setNotificationVisible(true);
        setTimeout(function () {
          props.notificationProps.setNotificationVisible(false);
        }, 10000);
      }
    },
  });
  function deleteFile(name: string, id: string) {
    deleteFileAPI.mutate({
      request: { name: name, folderId: currFolderId },
    });

    for (let i = 0; i < currItems.length; i++) {
      if (currItems[i]?.id == id) {
        currItems.splice(i, 1);
        break;
      }
    }
  }

  

  const downloadFileAPI = api.aws.getDownloadLink.useMutation({
    onSuccess: (data) => {
      if (data) {
        const el = document.createElement("a");

        console.log(String(data.link));
        el.href = String(data.link);
        el.download = data.fileName;
        el.click();
        el.remove();
      }
    },
  });
  function downloadFile(name: string) {
    downloadFileAPI.mutate({
      request: { name: name, folderId: currFolderId },
    });
  }

  const displayProps: DisplayProps = {
    fileDetails: currItems,
    currFolderId: currFolderId,
    updateFolderId: updateFolderId,
    dashboardProps: props.dashboardProps,
  };

  useEffect(() => {
    console.log("Triggering!");
    if (props.dashboardProps.shouldGetFolder.current) {
      props.dashboardProps.shouldGetFolder.current = false;
      getFiles.mutate({ folderId: currFolderId });
    }
  }, [props.dashboardProps.fileListUpdatedCounter]);

  // create an api that sends the file to the aws upload feature

  function DisplayIndividualFile(file: FileDetail, displayProps: DisplayProps) {
    const itemBaseClassname =
      "flex items-center mb-2 \
          justify-between h-14 w-full flex py-2 px-2 border-2 text-amber-700 duration-300\
          rounded-2xl border-amber-800 shadow-xl hover:border-gray-50 hover:bg-amber-700 hover:text-gray-200";

    if (file.objectType == "Folder")
      return (
        <div id={file.id} className={itemBaseClassname} key={file.id}>
          <div
            className="h-full w-1/12 cursor-pointer p-1"
            onClick={() => {
              updateFolderInfo(file.id);
            }}
          >
            <FolderIcon className="h-full w-full" aria-hidden />
          </div>
          <div
            className="h-full w-11/12"
            onClick={() => {
              updateFolderInfo(file.id);
              displayProps.dashboardProps.setFileDetail(defaultFileDetail);
            }}
          >
            <p className="h-full w-full cursor-pointer truncate p-2 font-semibold">
              <span className="text-sm">Folder: </span> <span>{file.name}</span>
            </p>
          </div>
        </div>
      );
    else
      return (
        <div id={file.id} className={itemBaseClassname} key={file.id}>
          <div
            className="h-full w-1/12 cursor-pointer p-1"
            onDoubleClick={() =>
              displayProps.dashboardProps.setDialogOpen(
                !displayProps.dashboardProps.dialogOpen,
              )
            }
            onClick={() => {
              displayProps.dashboardProps.setFileDetail(file);
            }}
          >
            {file.type?.includes("image") ? (
              <PhotoIcon className="h-full w-full" aria-hidden />
            ) : file.type?.includes("video") ? (
              <FilmIcon className="h-full w-full" aria-hidden />
            ) : (
              <DocumentIcon className="h-full w-full" aria-hidden />
            )}
          </div>
          <div
            className="h-full w-8/12"
            onDoubleClick={() =>
              displayProps.dashboardProps.setDialogOpen(
                !displayProps.dashboardProps.dialogOpen,
              )
            }
            onClick={() => {
              displayProps.dashboardProps.setFileDetail(file);
            }}
          >
            <p className="h-full w-full cursor-pointer truncate p-2 font-semibold">
              <span>{file.name}</span>
            </p>
          </div>
          <ArrowDownTrayIcon
            className="h-full w-1/12 cursor-pointer rounded-2xl py-1"
            onClick={() => downloadFile(file.name)}
          />
          <PencilSquareIcon
            className="h-full w-1/12 cursor-pointer rounded-2xl py-1"
            onClick={() => {
              props.dashboardProps.setNameChangeFormHeader("Rename " + file.name);
              props.dashboardProps.setNameChangeFormTarget(file.name);
              props.dashboardProps.setNameChangeFormOpen(true);
            }}
          />
          <TrashIcon
            className="h-full w-1/12 cursor-pointer rounded-2xl py-1"
            onClick={() => deleteFile(file.name, file.id)}
          />
        </div>
      );
  }

  function DisplayFileList(props: { displayProps: DisplayProps }) {
    if (
      !props.displayProps.fileDetails.length &&
      (props.displayProps.currFolderId == "" ||
        props.displayProps.currFolderId == undefined)
    )
      return (
        <div className="flex h-full w-full items-center justify-center">
          <Spinner />
        </div>
      );

    return (
      <div>
        {props.displayProps.fileDetails.map((file) => {
          return DisplayIndividualFile(file, props.displayProps);
        })}
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-amber-400 lg:flex lg:items-end">
      <div className={`h-full lg:h-[95%] w-full p-2 bg-amber-200 lg:border-t-2 lg:border-amber-800 `}>
        {displayFiles ? (
          <div className="relative h-full w-full overflow-y-auto">
            <DisplayFileList displayProps={displayProps} />
            <button
              onClick={() => {
                props.dashboardProps.shouldGetFolder.current = true;
                props.dashboardProps.setUploadFormOpen(
                  !props.dashboardProps.uploadFormOpen,
                )
              }
              }
              type="button"
              className="fixed bottom-5 left-5 rounded-full bg-amber-600 p-2 text-white shadow-xl duration-300 hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 active:opacity-80 lg:left-80"
            >
              <DocumentArrowUpIcon className="h-10 w-10" aria-hidden="true" />
            </button>

            <button
              onClick={() => {
                props.dashboardProps.shouldGetFolder.current = true;
                props.dashboardProps.setNameChangeFormHeader("Create a new folder");
                props.dashboardProps.setNameChangeFormTarget("");
                props.dashboardProps.setNameChangeFormOpen(true);
              }}
              type="button"
              className="fixed bottom-20 left-5 rounded-full bg-amber-600 p-2 text-white shadow-xl duration-300 hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 active:opacity-80 lg:left-80"
            >
              <FolderPlusIcon className="h-10 w-10" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <p className="text-2xl font-bold">Failed retrieving files...</p>
          </div>
        )}
      </div>
    </div>
  );
}
