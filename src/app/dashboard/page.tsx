"use client";

import { SessionProvider, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Spinner } from "../_components/Spinner";
import Sidebar from "../_components/Sidebar";
import { api } from "~/trpc/react";

function DashboardPage() {
  const router = useRouter();
  const session = useSession();
  const user = api.user.getUser.useQuery();

  if (session.status == "loading" || user.isLoading) {
    return (<div className="h-screen w-screen bg-black opacity-80"><Spinner/></div>)
  }
  else if (session.status == "unauthenticated") {
    router.push("/login");
    return;
  }
  else if (!user.data) {
    return (<div className="w-screen h-screen flex justify-center items-center bg-amber-200"><p className="text-gray-800 text-2xl font-bold">Unknown Error....☹️</p></div>)
  }

  return (
    <div className="h-screen w-screen flex">
      <div className="w-full fixed top-0 left-0 lg:w-fit opacity-100 z-20">
        <Sidebar user={user.data}/>
      </div>
      <div className="bg-amber-200 h-full w-full z-0 pt-14 lg:pt-10 lg:pl-72 flex">
        <div className="w-2/5 h-full bg-black"></div>
        <div className="w-3/5 h-full bg-white"></div>
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
