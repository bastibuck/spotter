import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Toaster } from "sonner";

import { TRPCReactProvider } from "~/trpc/react";
import { HydrateClient } from "~/trpc/server";
import Link from "next/link";
import { Wind } from "lucide-react";

export const metadata: Metadata = {
  title: "Spotter - Wind Alerts for Surfers",
  description:
    "Get notified about perfect wind conditions for your favorite surf spots",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="overflow-y-scroll antialiased">
        <TRPCReactProvider>
          <HydrateClient>
            <div className="ocean-gradient min-h-screen text-white">
              {/* Subtle wave pattern overlay */}
              <div
                className="pointer-events-none fixed inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.184 20c.357-.13.72-.264 1.088-.402l1.768-.661C33.64 15.347 39.647 14 50 14c10.271 0 15.362 1.222 24.629 4.928.955.383 1.869.74 2.75 1.072h6.225c-2.51-.73-5.139-1.691-8.233-2.928C65.888 13.278 60.562 12 50 12c-10.626 0-16.855 1.397-26.66 5.063l-1.767.662c-2.475.923-4.66 1.674-6.724 2.275h6.335zm0-20C13.258 2.892 8.077 4 0 4V2c5.744 0 9.951-.574 14.85-2h6.334zM0 14c8.44 0 13.718-1.21 22.272-4.402l1.768-.661C33.64 5.347 39.647 4 50 4c10.271 0 15.362 1.222 24.629 4.928C84.112 12.722 89.438 14 100 14v-2c-10.271 0-15.362-1.222-24.629-4.928C65.888 3.278 60.562 2 50 2 39.374 2 33.145 3.397 23.34 7.063l-1.767.662C13.223 10.84 8.163 12 0 12v2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                }}
              />

              {/* Navigation */}
              <nav className="glass-card fixed top-0 right-0 left-0 z-50 border-b border-white/5">
                <div className="container mx-auto flex items-center justify-between px-4 py-4">
                  <Link href="/" className="group flex items-center gap-2">
                    <div className="from-aqua-400 to-ocean-500 flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br shadow-lg shadow-cyan-500/20">
                      <Wind size={22} className="text-white" strokeWidth={2} />
                    </div>
                    <span className="to-ocean-200 bg-linear-to-r from-white bg-clip-text text-xl font-bold text-transparent">
                      Spotter
                    </span>
                  </Link>

                  <Link
                    href="/my-spots"
                    className="ocean-link text-ocean-200 text-sm font-medium hover:text-white"
                  >
                    My Spots
                  </Link>
                </div>
              </nav>

              {/* Main content */}
              <main className="px-4 pt-24 pb-12">{children}</main>
            </div>
            <Toaster
              position="bottom-center"
              toastOptions={{
                style: {
                  background:
                    "linear-gradient(135deg, #06b6d4 0%, #2a6188 100%)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(103, 232, 249, 0.5)",
                  boxShadow:
                    "0 4px 30px rgba(6, 182, 212, 0.4), 0 0 20px rgba(34, 211, 238, 0.3)",
                  color: "#ffffff",
                  fontWeight: 500,
                },
                classNames: {
                  success: "!border-l-4 !border-l-white/50",
                  error: "!border-l-4 !border-l-white/50",
                },
              }}
            />
          </HydrateClient>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
