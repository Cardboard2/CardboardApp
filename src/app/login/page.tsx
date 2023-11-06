"use client";
import React from "react";
import { SessionProvider } from "next-auth/react";
import LoginWrapper from "./LoginPage";

const ProfilePage = () => {
  return (
    <SessionProvider>
      <LoginWrapper />
    </SessionProvider>
  );
};

export default ProfilePage;
