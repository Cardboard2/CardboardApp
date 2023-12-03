"use client";
import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import ProfileMain from "./_components/ProfileMain";
import Sidebar from "./_components/ProfileSidebar";
import { useRouter } from "next/navigation";
import { Spinner } from "../_components/Spinner";

const Profile = () => {
  const session = useSession();
  const user = api.user.getUser.useQuery();
  const router = useRouter();

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


  if (session.data?.user) {
    return (
      <div className="ml-auto flex-col gap-5">
        <Sidebar user={user.data}/>
        <ProfileMain></ProfileMain>
      </div>
    );
  }

  return (
    <button onClick={() => signIn("google")} className="ml-auto text-green-600">
      Sign In
    </button>
  );
};

export default Profile;
