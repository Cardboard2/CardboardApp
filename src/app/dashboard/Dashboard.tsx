import { useForm } from "react-hook-form";
import { api } from "~/trpc/react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import {
  FolderIcon,
  TrashIcon,
  PencilSquareIcon,
  ArrowDownTrayIcon,
  PhotoIcon,
  DocumentIcon,
} from "@heroicons/react/24/outline";

function readFile(file: Blob) {
  return new Promise((resolve, reject) => {
    var fr = new FileReader();
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

interface listResult {
  objectFile: string;
  name: string;
  type?: string;
  size?: number;
  createdAt?: Date;
  modifiedAt?: Date;
  id: string;
}

const Dashboard = () => {
  const { data: session } = useSession();
  const [currFolderName, updateFolderName] = useState("root");
  const [currFolderId, updateFolderId] = useState("");
  const [currItems, updateItems] = useState<Array<listResult>>([]);

  const createFolderAPI = api.aws.createFolder.useMutation({
    onSuccess: () => {
      getFiles.mutate({ folderId: currFolderId });
    },
  });
  function createFolder() {
    var folderName = window.prompt("Enter new folder name");
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

        if (session) {
          console.log(data.name == session.user.id);
          if (data.name == session.user.id) {
            updateFolderId(data.folderId);
          } else {
            updateFolderName(data.name);
          }
        }
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
  }, [true]);

  useEffect(() => {
    console.log("currFolderId is now " + currFolderId);
  }, [currFolderId]);

  const deleteFileAPI = api.aws.deleteFile.useMutation({
    onSuccess: () => {
      // getFiles.mutate({ folderId: currFolderId });
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
  function renameFile(name: string, e: any) {
    var rename = window.prompt("Enter new file name");
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

  const { register, handleSubmit } = useForm();

  const uploadFile = api.aws.uploadFile.useMutation({
    onSuccess: () => {
      getFiles.mutate({ folderId: currFolderId });
    },
  });

  const onSubmit = async function (data: any) {
    for (var i = 0; i < data.files.length; i++) {
      var currFile = data.files[i];
      console.log(currFile);
      await new Promise((r) => setTimeout(r, 1000));
      await readFile(currFile).then((file) => {
        var fileData = {
          lastModified: currFile.lastModified,
          lastModifiedDate: currFile.lastModifiedDate,
          name: currFile.name,
          size: currFile.size,
          type: currFile.type,
          folderId: currFolderId,
        };

        // var fileDataString = JSON.stringify(fileData);

        // console.log(fileDataString);
        const encryptedData = btoa(file);
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
          <div></div>
          <div>You are in {currFolderName}</div>

          <div className="justify-content mt-5 flex flex-col gap-1">
            {currItems?.map(({ name, type, size, id, objectFile }) => {
              return (
                <div key={name}>
                  {objectFile == "Folder" ? (
                    <div className="flex flex-row border-[1px] border-black p-1">
                      <FolderIcon
                        className="h-6 w-6"
                        aria-hidden="true"
                      ></FolderIcon>
                      <button
                        onClick={() => updateFolderInfo(id)}
                        className="ml-1"
                        key={name}
                        title={name}
                      >
                        Folder : {name}
                      </button>
                    </div>
                  ) : (
                    <div
                      className="item-center justify-end gap-1 border-[1px] border-black p-1"
                      id={name}
                      key={name}
                    >
                      {String(type).includes("image") ? (
                        <PhotoIcon className="float-left h-6 w-6 "></PhotoIcon>
                      ) : (
                        <DocumentIcon className="float-left h-6 w-6 "></DocumentIcon>
                      )}
                      <button className="ml-1" key={name} title={name}>
                        {name}
                      </button>
                      <div className="float-right inline-flex gap-1">
                        <button
                          className="float-right h-6 w-6 "
                          id={"download-" + name}
                          onClick={(e) => downloadFile(name)}
                        >
                          <ArrowDownTrayIcon></ArrowDownTrayIcon>
                        </button>
                        <PencilSquareIcon
                          onClick={(e) => renameFile(name, e)}
                          className="float-right h-6 w-6 "
                        ></PencilSquareIcon>
                        <TrashIcon
                          onClick={() => deleteFile(name)}
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
};

export default Dashboard;
