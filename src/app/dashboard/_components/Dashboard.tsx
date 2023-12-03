import { type SubmitHandler, useForm } from "react-hook-form";
import { api } from "~/trpc/react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { UsageBarProps } from "~/app/_components/UsageBarProps";

import {
  FolderIcon,
  TrashIcon,
  PencilSquareIcon,
  ArrowDownTrayIcon,
  PhotoIcon,
  DocumentIcon,
} from "@heroicons/react/24/outline";

import { FileDetail, FormInput } from "./FileDetail";
import { DashboardProps } from "./DashboardProps";

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

function validateName(name: string) {
  return name.match(/^[^a-zA-Z0-9]+$/) ? false : true;
}

export function Dashboard(props: {
  dashboardProps: DashboardProps;
  usageBarProps: UsageBarProps;
}) {
  const { data: session } = useSession();
  const [currFolderId, updateFolderId] = useState("");
  const [currItems, updateItems] = useState<Array<FileDetail>>([]);

  const createFolderAPI = api.aws.createFolder.useMutation({
    onSuccess: () => {
      getFiles.mutate({ folderId: currFolderId });
    },
  });
  function createFolder() {
    const folderName = window.prompt("Enter new folder name");
    if (folderName && validateName(folderName)) {
      createFolderAPI.mutate({
        request: { name: folderName, parentId: currFolderId },
      });
    } else {
      console.log("Error: No folder name or name has special characters");
    }
  }

  const [retry, updateRetry] = useState(0); // Added retry option, if query fails, try 5 times max

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
  });
  function updateFolderInfo(id: string) {
    updateFolderId(id);
    getFiles.mutate({ folderId: id });
  }

  useEffect(() => {
    getFiles.mutate({ folderId: currFolderId });
  }, []);

  useEffect(() => {
    console.log("currFolderId is now " + currFolderId);
  }, [currFolderId]);

  const deleteFileAPI = api.aws.deleteFile.useMutation({
    onSuccess: (data) => {
      console.log(data);

      if (data && data.status == "success") {
        console.log(data.usage);
        props.usageBarProps.setUsage(data.usage.userUsage);
        props.usageBarProps.setTotalSpace(data.usage.totalStorage);
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

  const { register, handleSubmit } = useForm<FormInput>();

  const uploadFile = api.aws.uploadFile.useMutation({
    onSuccess: (data) => {
      getFiles.mutate({ folderId: currFolderId });
      console.log(data);

      if (data && data.status == "success" && data.usage) {
        console.log(data.usage);
        props.usageBarProps.setUsage(data.usage.userUsage);
        props.usageBarProps.setTotalSpace(data.usage.totalStorage);
      }
    },
  });

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    for (const currFile of data.files) {
      if (!currFile.name || !currFile.size || !currFile.type) return;

      await new Promise((r) => setTimeout(r, 1000));
      await readFile(currFile).then((file) => {
        const fileData = {
          name: currFile.name,
          size: currFile.size,
          type: currFile.type,
          folderId: currFolderId,
        };
        const rawData = file as Blob;
        const encryptedData = btoa(String(rawData));
        uploadFile.mutate({ file: encryptedData, metadata: fileData });
      });
    }

    // create an api that sends the file to the aws upload feature
  };

  if (session && session.user) {
    return (
      <div className="flex w-full flex-col gap-5">
        <div>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <input {...register("files")} type="file" id="upload" multiple />
            <button className=" float-right inline-flex rounded-md bg-amber-400 px-3 py-2 text-sm font-semibold  text-gray-900  shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
              Upload File
            </button>
          </form>
        </div>
        <div>
          <div>
            <button
              className=" float-right rounded-md bg-amber-400 px-3 py-2 text-sm font-semibold text-gray-900  shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 "
              onClick={() => createFolder()}
            >
              Create Folder
            </button>
          </div>

          <div className="justify-content mt-5 flex flex-col gap-1">
            {currItems?.map((item) => {
              return (
                <div
                  key={item.name}
                  onClick={() => {
                    if (item.objectType != "Folder") {
                      props.dashboardProps.setDialogOpen(true);
                      props.dashboardProps.setFileDetail(item);
                    }
                  }}
                >
                  {item.objectType == "Folder" ? (
                    <div className="flex flex-row border-[1px] border-black p-1">
                      <FolderIcon
                        className="h-6 w-6"
                        aria-hidden="true"
                      ></FolderIcon>
                      <button
                        onClick={() => updateFolderInfo(item.id)}
                        className="ml-1"
                        key={item.name}
                        title={item.name}
                      >
                        Folder : {item.name}
                      </button>
                    </div>
                  ) : (
                    <div
                      className="item-center justify-end gap-1 border-[1px] border-black p-1"
                      id={item.name}
                      key={item.name}
                    >
                      {String(item.type).includes("image") ? (
                        <PhotoIcon className="float-left h-6 w-6 "></PhotoIcon>
                      ) : (
                        <DocumentIcon className="float-left h-6 w-6 "></DocumentIcon>
                      )}
                      <button
                        className="ml-1"
                        key={item.name}
                        title={item.name}
                      >
                        {item.name}
                      </button>
                      <div className="float-right inline-flex gap-1">
                        <button
                          className="float-right h-6 w-6 "
                          id={"download-" + item.name}
                          onClick={() => downloadFile(item.name)}
                        >
                          <ArrowDownTrayIcon></ArrowDownTrayIcon>
                        </button>
                        <PencilSquareIcon
                          onClick={() => renameFile(item.name)}
                          className="float-right h-6 w-6 "
                        ></PencilSquareIcon>
                        <TrashIcon
                          onClick={() => deleteFile(item.name)}
                          className="float-right h-6 w-6"
                        ></TrashIcon>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
}
