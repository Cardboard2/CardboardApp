import { useRef, useState, useEffect } from "react";
import { DashboardProps } from "./DashboardProps";
import { api } from "~/trpc/react";
import type { FileDetail } from "./FileDetail";
import { Spinner } from "~/app/_components/Spinner";
import { FolderIcon, PhotoIcon } from "@heroicons/react/20/solid";
import { ArrowDownTrayIcon, DocumentIcon, EllipsisHorizontalCircleIcon, FilmIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import type { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";

interface DisplayProps {
    fileDetails: FileDetail[]
    currFolderId: string
    updateFolderId: Dispatch<SetStateAction<string>>
    updateFolderInfo: Function
    downloadFile: Function
    deleteFile: Function
    renameFile: Function
    dashboardProps: DashboardProps
}

function validateName(name: string) {
    return name.match(/^[^a-zA-Z0-9]+$/) ? false : true;
}

function DisplayIndividualFile(file: FileDetail, displayProps : DisplayProps) {
    const itemBaseClassname = "flex items-center mb-2 \
        justify-between h-14 w-full flex py-2 px-2 border-2 text-amber-700 duration-300\
        rounded-2xl border-amber-800 shadow-xl hover:border-gray-50 hover:bg-amber-700 hover:text-gray-200";

    if (file.objectType == "Folder")
        return (
            <div id={file.name} className={itemBaseClassname}>
                <div className="h-full w-1/12 p-1 cursor-pointer" onClick={()=>{displayProps.updateFolderInfo(file.id)}}>
                    <FolderIcon className="h-full w-full" aria-hidden/>
                </div>
                <div className="w-11/12 h-full" onClick={()=>{displayProps.updateFolderInfo(file.id)}}>
                    <p className="w-full h-full p-2 font-semibold truncate cursor-pointer">
                        <span className="text-sm">Folder: </span> <span>{file.name}</span>
                    </p>
                </div>
            </div>
        );
    else
        return (
            <div id={file.name} className={itemBaseClassname}>
                <div className="h-full w-1/12 p-1 cursor-pointer" onClick={()=>{
                        displayProps.dashboardProps.setFileDetail(file);
                        displayProps.dashboardProps.setDialogOpen(!displayProps.dashboardProps.dialogOpen);
                    }}>
                    {
                        file.type?.includes("image") ? <PhotoIcon className="h-full w-full" aria-hidden/> : 
                            file.type?.includes("video") ? <FilmIcon className="h-full w-full" aria-hidden/> :
                            <DocumentIcon className="h-full w-full" aria-hidden/>
                    }
                </div>
                <div className="w-8/12 h-full" onClick={()=>{
                       displayProps.dashboardProps.setFileDetail(file);
                       displayProps.dashboardProps.setDialogOpen(!displayProps.dashboardProps.dialogOpen);
                }}>
                    <p className="w-full h-full p-2 font-semibold truncate cursor-pointer">
                        <span>{file.name}</span>
                    </p>
                </div>
                <ArrowDownTrayIcon
                          className="w-1/12 h-full py-1 rounded-2xl cursor-pointer"
                          onClick={() => displayProps.downloadFile(file.name)}
                        />
                <PencilSquareIcon
                          className="w-1/12 h-full py-1 rounded-2xl cursor-pointer"
                          onClick={() => displayProps.renameFile(file.name)}
                        />
                <TrashIcon
                          className="w-1/12 h-full py-1 rounded-2xl cursor-pointer"
                          onClick={() => displayProps.deleteFile(file.name)}
                        />
                    

            </div> 
        );
}

function DisplayFileList(props: {displayProps: DisplayProps}) {
    if (!props.displayProps.fileDetails.length)
        return <div className="w-full h-full flex items-center justify-center"> <Spinner/> </div>;

    return (
        <div>
            {props.displayProps.fileDetails.map((file) => {
                return (DisplayIndividualFile(file, props.displayProps))
            })}
        </div>
    );
}

export function DisplayFiles(props: {dashboardProps: DashboardProps}) {
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
        onError: ()=>{
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
            //props.usageBarProps.setUsage(data.usage.userUsage);
            //props.usageBarProps.setTotalSpace(data.usage.totalStorage);
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
            <div className="p-5 lg:p-8 w-full h-[8%] border-b-2 bg-amber-300 border-amber-800">
            </div>
            <div className={`p-2 w-full h-[92%]`}>
                {displayFiles ? <DisplayFileList displayProps={displayProps}/> : <div className="w-full h-full flex justify-center items-center"><p className="text-2xl font-bold">Failed retrieving files...</p></div>}
            </div>
        </div>
    );
}