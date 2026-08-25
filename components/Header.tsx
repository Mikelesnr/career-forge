//components/Header.tsx
"use client";

import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";

export default function Header() {
  const { isSignedIn } = useAuth();

  return (
    <header className="border-b border-slate-800 bg-slate-900 px-6 py-4 flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <span className="font-bold text-xl tracking-tight text-indigo-400">CareerForge</span>
        <span className="text-xs bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20">
          Job Tracker
        </span>
      </div>
      <div>
        {isSignedIn === false && <SignInButton mode="modal" />}
        {isSignedIn === true && <UserButton />}
      </div>
    </header>
  );
}
