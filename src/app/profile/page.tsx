"use client";
import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import { SessionProvider } from "next-auth/react";
import Profile from "./Profile";

const ProfilePage = () => {
  return (
    <SessionProvider>
      <Profile />
    </SessionProvider>
  );
};

export default ProfilePage;
