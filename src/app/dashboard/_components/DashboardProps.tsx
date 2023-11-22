import { Dispatch, SetStateAction } from "react";
import { FileDetail } from "./FileDetail";

export interface DashboardProps {
    dialogOpen: boolean,
    setDialogOpen: Dispatch<SetStateAction<boolean>>,
    folderId: string,
    setFolderId: Dispatch<SetStateAction<string>>,
    fileDetail: FileDetail,
    setFileDetail: Dispatch<SetStateAction<FileDetail>>
};