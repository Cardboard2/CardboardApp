import type { Dispatch, MutableRefObject, SetStateAction } from "react";
import type { FileDetail } from "./FileDetail";
import type { Session } from "next-auth";

export interface DashboardProps {
  session: Session;
  dialogOpen: boolean;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  uploadFormOpen: boolean;
  setUploadFormOpen: Dispatch<SetStateAction<boolean>>;
  fileDetail: FileDetail;
  setFileDetail: Dispatch<SetStateAction<FileDetail>>;
  currFolderId: string;
  setCurrFolderId: Dispatch<SetStateAction<string>>;
  fileListUpdatedCounter: number;
  updateFileListCounter: Dispatch<SetStateAction<number>>;
  nameChangeFormOpen: boolean;
  setNameChangeFormOpen: Dispatch<SetStateAction<boolean>>;
  nameChangeFormHeader: string;
  setNameChangeFormHeader: Dispatch<SetStateAction<string>>;
  nameChangeFormTarget: string;
  setNameChangeFormTarget: Dispatch<SetStateAction<string>>;
  shouldGetFolder:MutableRefObject<boolean>;
}
