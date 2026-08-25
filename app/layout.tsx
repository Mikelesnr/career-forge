import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider, SignInButton, Show, UserButton } from '@clerk/nextjs';
import "./globals.css";
import RegisterSW from "@/components/RegisterSW";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'CareerForge - Job Tracker & Assistant',
  description: 'Track applications, prep for interviews, and manage workflow artifacts.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
        <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col">
          {/* <RegisterSW /> */}
          <header className="border-b border-slate-800 bg-slate-900 px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <span className="font-bold text-xl tracking-tight text-indigo-400">CareerForge</span>
              <span className="text-xs bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20">
                Job Tracker
              </span>
            </div>
            <div>
              <Show when="signed-out">
                <SignInButton mode="modal" />
              </Show>
              <Show when="signed-in">
                <UserButton />
              </Show>
            </div>
          </header>
          <main className="flex-1 max-w-7xl w-full mx-auto p-6">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  )
}

