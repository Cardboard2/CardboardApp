import type { Dispatch, SetStateAction } from "react";

export interface NotificationProps {
  notificationSuccess: boolean;
  notificationTitle: string;
  notificationMessage: string;
  notificationShow: boolean;
  setNotificationTitle: Dispatch<SetStateAction<string>>;
  setNotificationMessage: Dispatch<SetStateAction<string>>;
  setNotificationSuccess: Dispatch<SetStateAction<boolean>>;
  setNotificationVisible: Dispatch<SetStateAction<boolean>>;
}
