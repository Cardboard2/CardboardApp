"use client"
import React from 'react';

import { TierSelect } from "./_components/TierSelect.tsx"
import { Header } from "../_components/Header.tsx"

export default function Upgrade() {


  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-amber-200 text-amber-950">
      <div className="fixed flex z-50 top-0 w-full shadow">
        <Header/>
      </div>
      <div className='flex z-0 w-full items-center justify-center'>
        <div>
          <TierSelect/>
        </div>
      </div>
    </main>
  );
}