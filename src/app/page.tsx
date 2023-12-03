"use client";
import { Header } from "./_components/Header.tsx";
import { SessionProvider } from "next-auth/react";
import Landing from "./Landing.tsx";

export default function Home() {
  return (
    <SessionProvider>
      <main className="flex min-h-screen flex-col items-center justify-center bg-amber-200 text-amber-950">
        <div className="fixed top-0 z-50 flex w-full shadow">
          <Header />
        </div>
        <div className="z-0 flex w-full items-center justify-center">
          <Landing />
        </div>
      </main>
    </SessionProvider>
  );
}
