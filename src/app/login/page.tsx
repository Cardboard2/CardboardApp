"use client";
import React from "react";
import { SessionProvider } from "next-auth/react";
import LoginWrapper from "./_components/LoginPage";
import { SimpleHeader } from "../_components/SimpleHeader";

const ProfilePage = () => {
  return (
    <SessionProvider>
      <div className="fixed flex z-50 top-0 w-full shadow">
          <SimpleHeader/>
        </div>
      <div className="w-screen h-screen flex justify-center items-center">
        <LoginWrapper />
      </div>
    </SessionProvider>
  );
};

export default ProfilePage;
