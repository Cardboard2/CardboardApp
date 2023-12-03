import { useRef, useState, useEffect } from "react";
import { DashboardProps } from "./DashboardProps";
import { api } from "~/trpc/react";
import type { FileDetail } from "./FileDetail";
import { Spinner } from "~/app/_components/Spinner";
import { FolderIcon } from "@heroicons/react/20/solid";
import { EllipsisHorizontalCircleIcon } from "@heroicons/react/24/outline";
import type { Dispatch, SetStateAction } from "react";

interface DisplayProps {
    fileDetails: FileDetail[]
    currFolderId: string
    updateFolderId: Dispatch<SetStateAction<string>>
}

function DisplayIndividualFile(file: FileDetail , updateFolderId: Dispatch<SetStateAction<string>>) {
    const itemBaseClassname = "flex items-center mb-2 \
        justify-between h-14 w-full flex py-2 px-2 border-2 text-amber-700 duration-300\
        rounded-2xl border-amber-800 shadow-xl hover:border-gray-50 hover:bg-amber-700 hover:text-gray-200";

    if (file.objectType == "Folder")
        return (
            <div className={itemBaseClassname}>
                <div className="h-full w-1/12 p-1" onClick={()=>{updateFolderId(file.id)}}>
                    <FolderIcon className="h-full w-full" aria-hidden/>
                </div>
                <div className="w-5/6 h-full">
                    <p className="w-full h-full p-2 font-semibold truncate">
                        <span className="text-sm">Folder: </span> <span>{file.name}</span>
                    </p>
                </div>
                <button className="w-1/12 h-full p-1 flex items-center justify-center">
                    <EllipsisHorizontalCircleIcon className="w-full h-full"/>
                </button>
            </div>
        );
}

function DisplayFileList(props: {displayProps: DisplayProps}) {
    if (!props.displayProps.fileDetails.length)
        return <div className="w-full h-full flex items-center justify-center"> <Spinner/> </div>;

    return (
        <div>
            {props.displayProps.fileDetails.map((file) => {
                return (DisplayIndividualFile(file, props.displayProps.updateFolderId))
            })}
        </div>
    );
}

export function DisplayFiles(props: {dashboardProps: DashboardProps}) {
    console.log(props.dashboardProps.session.user.image)
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

    const displayProps: DisplayProps = {
        fileDetails: currItems,
        currFolderId: currFolderId,
        updateFolderId: updateFolderId
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
                <p className="text-2xl lg:text-2xl font-semibold">Your files</p>
            </div>
            <div className={`p-2 w-full h-[92%]`}>
                {displayFiles ? <DisplayFileList displayProps={displayProps}/> : <div className="w-full h-full flex justify-center items-center"><p className="text-2xl font-bold">Failed retrieving files...</p></div>}
            </div>
        </div>
    );
}