import React from 'react'

import CardboardLogo from '~/app/_components/CardboardLogo'


export function LoginHeader() {

  return (
    <header className="bg-amber-400 w-full bg-opacity-90">
      <div className="mx-auto flex max-w-7xl items-center justify-center p-6 lg:px-8 z-50" aria-label="Global">
        <a href="/dashboard" className="-m-1.5 p-1.5">
          <span className="sr-only">Cardboard</span>
          <div className='w-10 h-10 text-amber-950'><CardboardLogo/></div>
        </a>
      </div>
    </header>
  );
}