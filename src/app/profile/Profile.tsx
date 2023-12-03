"use client";
import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import ProfileMain from "./_components/ProfileMain";

const Profile = () => {
  const { data: session } = useSession();

  if (session && session.user) {
    return (
      <div className="ml-auto flex-col gap-5">
        <div className=" flex gap-5">
          <p className="text-sky-600">{session.user.name}</p>
          <button onClick={() => signOut()} className="text-red-600">
            Sign Out
          </button>
        </div>
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
