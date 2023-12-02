import { Dispatch, SetStateAction } from "react";

export interface UsageBarProps {
  setUsage: Dispatch<SetStateAction<number>>;
  setTotalSpace: Dispatch<SetStateAction<number>>;
}
