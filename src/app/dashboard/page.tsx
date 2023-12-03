"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Spinner } from "../_components/Spinner";
import Sidebar from "../_components/Sidebar";
import { api } from "~/trpc/react";
import { DisplayFiles } from "./_components/DisplayFiles";
import { useState } from "react";
import { defaultFileDetail } from "./_components/FileDetail";
import { DashboardProps } from "./_components/DashboardProps";
import { ItemPreview } from "./_components/ItemPreview";

function DashboardPage() {
  const router = useRouter();
  const session = useSession();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [fileDetail, setFileDetail] = useState(defaultFileDetail);

  if (session.status == "loading") {
    return (<div className="h-screen w-screen bg-black opacity-80"><Spinner/></div>)
  }
  else if (session.status == "unauthenticated") {
    router.push("/login");
    return;
  }
  else if (!session.data) {
    return (<div className="w-screen h-screen flex justify-center items-center bg-amber-200"><p className="text-gray-800 text-2xl font-bold">Unknown Error....☹️</p></div>)
  }

  const dashboardProps: DashboardProps = {
    session: session.data,
    dialogOpen: dialogOpen,
    fileDetail: fileDetail,
    setDialogOpen: setDialogOpen,
    setFileDetail: setFileDetail
  };

  return (
    <div className="h-screen w-screen flex">
      <div className="w-full fixed top-0 left-0 lg:w-fit opacity-100 z-20">
        <Sidebar session={session.data}/>
      </div>
      <div className="bg-amber-200 h-full w-full z-0 pt-14 lg:pt-0 lg:pl-72 flex">
        <div className="w-full md:w-7/12 h-full "> 
          <DisplayFiles dashboardProps={dashboardProps}/>
          {dialogOpen ? <ItemPreview dashboardProps={dashboardProps}/> : ""}
        </div>
        <div className="hidden md:block md:w-5/12 h-full border-l-2 border-amber-800 bg-white"></div>
      </div>
    </div>
  );
}


export default function DashboardPageWrapper() {
  return(
    <SessionProvider>
      <DashboardPage/>
    </SessionProvider>
  );
}
