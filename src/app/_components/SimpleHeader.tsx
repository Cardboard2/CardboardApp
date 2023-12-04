import React from "react";

import CardboardLogo from "~/app/_components/CardboardLogo";

export function SimpleHeader() {
  return (
    <header className="w-full bg-amber-400 bg-opacity-90">
      <div
        className="z-50 mx-auto flex max-w-7xl items-center justify-center p-6 lg:px-8"
        aria-label="Global"
      >
        <a href="/" className="-m-1.5 p-1.5">
          <span className="sr-only">Cardboard</span>
          <div className="h-10 w-10 text-amber-950">
            <CardboardLogo />
          </div>
        </a>
      </div>
    </header>
  );
}
