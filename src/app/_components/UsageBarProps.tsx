import { Dispatch, SetStateAction } from "react";

export interface UsageBarProps {
  usageBarUsage: number;
  usageBarTotal: number;
  setUsageBarUsage: Dispatch<SetStateAction<number>>;
  setUsageBarTotal: Dispatch<SetStateAction<number>>;
}
