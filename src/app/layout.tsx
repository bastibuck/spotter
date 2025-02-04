import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { HydrateClient } from "~/trpc/server";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Spotter",
  description: "Get notified about suitable wind conditions for kitesurfing",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body>
        <TRPCReactProvider>
          <HydrateClient>
            <main className="flex min-h-screen flex-col items-center justify-start bg-linear-to-b from-[#2e026d] to-[#15162c] text-white">
              <div className="container flex flex-col items-center justify-center gap-6 px-4 py-16">
                {children}
              </div>
            </main>

            <footer className="bg-gray-800 p-4 text-right text-gray-100">
              <Link href="/my-spots">My spots</Link>
            </footer>
          </HydrateClient>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
