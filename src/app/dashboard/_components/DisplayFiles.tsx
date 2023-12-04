import { useRef, useState, useEffect } from "react";
import { DashboardProps } from "./DashboardProps";
import { api } from "~/trpc/react";
import type { FileDetail } from "./FileDetail";
import { defaultFileDetail } from "./FileDetail";
import { Spinner } from "~/app/_components/Spinner";
import { FolderIcon, PhotoIcon, PlusIcon } from "@heroicons/react/20/solid";
import {
  ArrowDownTrayIcon,
  DocumentIcon,
  EllipsisHorizontalCircleIcon,
  FilmIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import type { Dispatch, SetStateAction } from "react";
import { UsageBarProps } from "~/app/_components/UsageBarProps";
import CircularButton from "./CircularButton";

interface DisplayProps {
  fileDetails: FileDetail[];
  currFolderId: string;
  updateFolderId: Dispatch<SetStateAction<string>>;
  updateFolderInfo: Function;
  downloadFile: Function;
  deleteFile: Function;
  renameFile: Function;
  dashboardProps: DashboardProps;
}

function validateName(name: string) {
  return name.match(/^[^a-zA-Z0-9]+$/) ? false : true;
}

function DisplayIndividualFile(file: FileDetail, displayProps: DisplayProps) {
  const itemBaseClassname =
    "flex items-center mb-2 \
        justify-between h-14 w-full flex py-2 px-2 border-2 text-amber-700 duration-300\
        rounded-2xl border-amber-800 shadow-xl hover:border-gray-50 hover:bg-amber-700 hover:text-gray-200";

  if (file.objectType == "Folder")
    return (
      <div id={file.name} className={itemBaseClassname}>
        <div
          className="h-full w-1/12 cursor-pointer p-1"
          onClick={() => {
            displayProps.updateFolderInfo(file.id);
          }}
        >
          <FolderIcon className="h-full w-full" aria-hidden />
        </div>
        <div
          className="h-full w-11/12"
          onClick={() => {
            displayProps.updateFolderInfo(file.id);
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
      <div id={file.name} className={itemBaseClassname}>
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
          onClick={() => displayProps.downloadFile(file.name)}
        />
        <PencilSquareIcon
          className="h-full w-1/12 cursor-pointer rounded-2xl py-1"
          onClick={() => displayProps.renameFile(file.name)}
        />
        <TrashIcon
          className="h-full w-1/12 cursor-pointer rounded-2xl py-1"
          onClick={() => displayProps.deleteFile(file.name)}
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
        {" "}
        <Spinner />{" "}
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

export function DisplayFiles(props: {
  dashboardProps: DashboardProps;
  usageBarProps: UsageBarProps;
}) {
  const shouldGetFolder = useRef(true);
  const [retry, updateRetry] = useState(0);
  const [currFolderId, updateFolderId] = useState("");
  const [currItems, updateItems] = useState<Array<FileDetail>>([]);
  const [displayFiles, setDisplayFiles] = useState(true);

  const getFiles = api.aws.getFolderContents.useMutation({
    onSuccess: (data) => {
      if (data) {
        updateItems(data.childList);
        updateFolderId(data.folderId);
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
    getFiles.mutate({ folderId: id });
  }

  const deleteFileAPI = api.aws.deleteFile.useMutation({
    onSuccess: (data) => {
      console.log(data);

      if (data && data.status == "success") {
        console.log(data.usage);
        props.usageBarProps.setUsageBarUsage(data.usage.userUsage);
        props.usageBarProps.setUsageBarTotal(data.usage.totalStorage);
      }
    },
  });
  function deleteFile(name: string) {
    deleteFileAPI.mutate({
      request: { name: name, folderId: currFolderId },
    });
    document.getElementById(name)?.remove();
  }

  const renameFileAPI = api.aws.renameFile.useMutation({
    onSuccess: (data) => {
      console.log(data);
      getFiles.mutate({ folderId: currFolderId });
    },
  });
  function renameFile(name: string) {
    const rename = window.prompt("Enter new file name");
    if (rename && validateName(rename)) {
      renameFileAPI.mutate({
        request: { oldName: name, newName: rename, folderId: currFolderId },
      });
    } else {
      console.log(
        "Error: No new file name or new file name has special characters",
      );
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
    updateFolderInfo: updateFolderInfo,
    dashboardProps: props.dashboardProps,
    deleteFile: deleteFile,
    renameFile: renameFile,
    downloadFile: downloadFile,
  };

  useEffect(() => {
    if (shouldGetFolder.current) {
      shouldGetFolder.current = false;
      getFiles.mutate({ folderId: currFolderId });
    }
  }, []);

  return (
    <div className="h-full w-full">
      <div className="h-[8%] w-full border-b-2 border-amber-800 bg-amber-300 p-5 lg:p-8"></div>
      <div className={`h-[92%] w-full p-2`}>
        {displayFiles ? (
          <div>
            <DisplayFileList displayProps={displayProps} />
            <button
              type="button"
              className="fixed bottom-0 right-0 rounded-full bg-amber-600 p-2 text-white shadow-sm hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
            >
              <PlusIcon className="h-10 w-10" aria-hidden="true" />
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
