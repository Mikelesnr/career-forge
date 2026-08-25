// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import RegisterSW from "@/components/RegisterSW";
import Header from "@/components/Header"; // import client component

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CareerForge - Job Tracker & Assistant",
  description: "Track applications, prep for interviews, and manage workflow artifacts.",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
        <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col">
          <RegisterSW />
          <Header /> {/* client component */}
          <main className="flex-1 max-w-7xl w-full mx-auto p-6">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
