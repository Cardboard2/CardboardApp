"use client";
import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import { SessionProvider } from "next-auth/react";
import AdminView from "./_components/AdminView.tsx";

const AdminPage = () => {
  return (
    <SessionProvider>
      <AdminView />
    </SessionProvider>
  );
};

export default AdminPage;
