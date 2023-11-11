"use client"
import React, { useEffect, useState } from 'react';

import { TierSelect } from "./_components/TierSelect.tsx"
import { Header } from "../_components/Header.tsx"
import { SessionProvider } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { api } from '~/trpc/react.tsx';

export default function Upgrade() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId');
  const [stripeCancelled, setStripeCancelled] = useState(false);

  const expireStripeSession = api.stripe.expireSession.useMutation({
    onSuccess: (data) => {
      if (data == "expired") {
        console.log(data); 
        setStripeCancelled(true);
      }
    }
  });
  
  useEffect(() => {
    if (sessionId) {
      expireStripeSession.mutate({sessionId: sessionId});
    };
  });

  return (
    <SessionProvider>
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
    </SessionProvider>
  );
}