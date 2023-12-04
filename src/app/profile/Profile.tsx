"use client";
import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import ProfileMain from "./_components/ProfileMain";
// import Sidebar from "./_components/ProfileSidebar";
import Sidebar from "../_components/Sidebar";
import { useRouter } from "next/navigation";
import { Spinner } from "../_components/Spinner";

const Profile = () => {
  const session = useSession();
  const router = useRouter();

  if (session.status == "loading") {
    return (
      <div className="h-screen w-screen bg-black opacity-80">
        <Spinner />
      </div>
    );
  } else if (session.status == "unauthenticated") {
    router.push("/login");
    return;
  } else if (!session.data?.user) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-amber-200">
        <p className="text-2xl font-bold text-gray-800">Unknown Error....☹️</p>
      </div>
    );
  }
  return (
    <div className="ml-auto flex-col gap-5">
      <Sidebar session={session.data} />
      <ProfileMain></ProfileMain>
    </div>
  );
};

export default Profile;
