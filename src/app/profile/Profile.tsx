"use client";
import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "~/trpc/react";

const Profile = () => {
  const { data: session } = useSession();
  const data = api.post.hello.useQuery({ text: "asdsa" });
  const data2 = api.post.getLatest.useQuery();

  console.log(data);
  if (session && session.user) {
    return (
      <div className="ml-auto flex gap-4">
        <p className="text-sky-600">{data.data?.greeting}</p>
        <p className="text-sky-600">{data2.data?.name}</p>
        <p className="text-sky-600">{session.user.name}</p>
        <button onClick={() => signOut()} className="text-red-600">
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button onClick={() => signIn()} className="ml-auto text-green-600">
      Sign In
    </button>
  );
};

export default Profile;
