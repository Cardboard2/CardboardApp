import type { Dispatch, SetStateAction } from "react";
import type { FileDetail } from "./FileDetail";
import type { Session } from "next-auth";

export interface DashboardProps {
  session: Session;
  dialogOpen: boolean;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  creationOpen: boolean;
  setCreationOpen: Dispatch<SetStateAction<boolean>>;
  fileDetail: FileDetail;
  setFileDetail: Dispatch<SetStateAction<FileDetail>>;
  currFolderId: string;
  setCurrFolderId: Dispatch<SetStateAction<string>>;
  fileListUpdatedCounter: number;
  updateFileListCounter: Dispatch<SetStateAction<number>>;
}
