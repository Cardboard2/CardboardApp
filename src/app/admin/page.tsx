"use client";
import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import { SessionProvider } from "next-auth/react";
import Admin from "./Admin";

const AdminPage = () => {
  return (
    <SessionProvider>
      <Admin />
    </SessionProvider>
  );
};

export default AdminPage;
