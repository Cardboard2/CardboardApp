"use client"

import { TierSelect } from "./_components/TierSelect.tsx"
import { Header } from "../_components/Header.tsx"
import { SessionProvider } from 'next-auth/react';

export default function Upgrade() {
  return (
    <SessionProvider>
      <main className="flex min-h-screen flex-col items-center justify-center bg-amber-200 text-amber-950">
        <div className="fixed flex z-10 top-0 w-full shadow">
          <Header/>
        </div>
        <div className='flex z-0 pt-[88px] w-full items-center justify-center'>
          <div>
            <TierSelect/>
          </div>
        </div>
      </main>
    </SessionProvider>
  );
}