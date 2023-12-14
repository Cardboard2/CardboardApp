"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Spinner } from "../_components/Spinner";
import Sidebar from "../_components/Sidebar";
import { DisplayFiles } from "./_components/DisplayFiles";
import { useState } from "react";
import { defaultFileDetail } from "./_components/FileDetail";
import { DashboardProps } from "./_components/DashboardProps";
import { ItemPreview } from "./_components/ItemPreview";
import { UsageBarProps } from "../_components/UsageBarProps";
import { useEffect } from "react";
import { FileDetailsSideBar } from "./_components/FileDetailsSideBar";
import { UploadForm } from "./_components/UploadForm";
import { PrimeReactProvider } from 'primereact/api';

import Notification from "~/app/_components/Notification";

import { NotificationProps } from "../_components/NotificationProps";

function DashboardPage() {
  const router = useRouter();
  const session = useSession();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploadFormOpen, setUploadFormOpen] = useState(false);
  const [fileDetail, setFileDetail] = useState(defaultFileDetail);
  const [fileListUpdatedCounter, updateFileListCounter] = useState(0);

  const [currFolderId, setCurrFolderId] = useState("");

  const [notificationShow, setNotificationVisible] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationSuccess, setNotificationSuccess] = useState(true);

  const notificationProps: NotificationProps = {
    notificationSuccess: notificationSuccess,
    notificationTitle: notificationTitle,
    notificationMessage: notificationMessage,
    notificationShow: notificationShow,
    setNotificationTitle: setNotificationTitle,
    setNotificationMessage: setNotificationMessage,
    setNotificationSuccess: setNotificationSuccess,
    setNotificationVisible: setNotificationVisible,
  };

  const [usageBarUsage, setUsageBarUsage] = useState(0);
  const [usageBarTotal, setUsageBarTotal] = useState(0);

  const usageBarProps: UsageBarProps = {
    usageBarUsage: usageBarUsage,
    usageBarTotal: usageBarTotal,
    setUsageBarUsage: setUsageBarUsage,
    setUsageBarTotal: setUsageBarTotal,
  };

  useEffect(() => {
    console.log(usageBarUsage);
  }, [usageBarUsage]);

  if (session.status == "loading") {
    return (
      <div className="h-screen w-screen bg-black opacity-80">
        <Spinner />
      </div>
    );
  } else if (session.status == "unauthenticated") {
    router.push("/login");
    return;
  } else if (!session.data) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-amber-200">
        <p className="text-2xl font-bold text-gray-800">Unknown Error....☹️</p>
      </div>
    );
  }

  const dashboardProps: DashboardProps = {
    session: session.data,
    currFolderId: currFolderId,
    setCurrFolderId: setCurrFolderId,
    dialogOpen: dialogOpen,
    fileDetail: fileDetail,
    setDialogOpen: setDialogOpen,
    setFileDetail: setFileDetail,
    uploadFormOpen: uploadFormOpen,
    setUploadFormOpen: setUploadFormOpen,
    fileListUpdatedCounter: fileListUpdatedCounter,
    updateFileListCounter: updateFileListCounter,
  };

  return (
    <div className="flex h-screen w-screen">
      <div className="fixed left-0 top-0 z-20 w-full opacity-100 lg:w-fit">
        <Sidebar session={session.data} usageBarProps={usageBarProps} />
      </div>
      <div className="z-0 flex h-full w-full bg-amber-200 pt-14 lg:pl-72 lg:pt-0">
        <div className="h-full w-full md:w-7/12 ">
          <DisplayFiles
            dashboardProps={dashboardProps}
            usageBarProps={usageBarProps}
            notificationProps={notificationProps}
          />
          {dialogOpen ? <ItemPreview dashboardProps={dashboardProps} /> : ""}
          {uploadFormOpen ? (
            <UploadForm
              dashboardProps={dashboardProps}
              usageBarProps={usageBarProps}
              notificationProps={notificationProps}
            />
          ) : (
            ""
          )}
        </div>
        <div className="hidden h-full border-l-2 border-amber-800 bg-amber-200 md:block md:w-5/12">
          <FileDetailsSideBar dashboardProps={dashboardProps} />
        </div>
      </div>

      {notificationShow ? (
          <Notification
            title={notificationTitle}
            success={notificationSuccess}
            message={notificationMessage}
            closeFunction={function () {
              return setNotificationVisible(false);
            }}
          />
        ) : (
          <></>
        )}
    </div>
    
  );
}

export default function DashboardPageWrapper() {
  return (
    <PrimeReactProvider>
      <SessionProvider>
        <DashboardPage />
      </SessionProvider>
    </PrimeReactProvider>
  );
}
