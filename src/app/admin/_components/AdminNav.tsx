"use client";

import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const adminLinks = [
  {
    href: "/admin",
    label: "Overview",
  },
  {
    href: "/admin/spots",
    label: "Spots",
  },
  {
    href: "/admin/spot-suggestions",
    label: "Spot Suggestions",
  },
] as const;

export default function AdminNav() {
  const currentPath = usePathname();

  return (
    <nav className="animate-fade-in-up rounded-2xl border border-white/10 bg-white/4 p-2 backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          {adminLinks.map((link) => {
            const isActive = currentPath === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-aqua-400/15 text-white shadow-[0_8px_24px_rgba(34,211,238,0.16)]"
                    : "text-ocean-200 hover:bg-white/6 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => {
            void signOut({ callbackUrl: "/" });
          }}
          className="text-ocean-200 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition hover:bg-white/6 hover:text-white"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </nav>
  );
}
