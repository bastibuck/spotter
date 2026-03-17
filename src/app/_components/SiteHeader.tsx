"use client";

import Link from "next/link";
import { Menu, Wind, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { href: "/suggest-spot", label: "Suggest a Spot" },
  { href: "/my-spots", label: "My Spots" },
] as const;

export default function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav
      className={`fixed top-0 right-0 left-0 z-50 border-b border-white/5 backdrop-blur-xl transition-all duration-300 ${
        isMenuOpen ? "bg-ocean-950/76 bottom-0 md:bottom-auto" : "glass-card"
      }`}
    >
      <div
        className={`container mx-auto px-4 py-4 ${
          isMenuOpen ? "flex min-h-svh flex-col md:min-h-0" : ""
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="group flex items-center gap-2">
            <div className="from-aqua-400 to-ocean-500 flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br shadow-lg shadow-cyan-500/20">
              <Wind size={22} className="text-white" strokeWidth={2} />
            </div>
            <span className="to-ocean-200 bg-linear-to-r from-white bg-clip-text text-xl font-bold text-transparent">
              Spotter
            </span>
          </Link>

          <div className="hidden items-center gap-4 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="ocean-link text-ocean-200 text-sm font-medium hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/6 text-white transition hover:bg-white/8 md:hidden"
            aria-expanded={isMenuOpen}
            aria-label={
              isMenuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            onClick={() => {
              setIsMenuOpen((prev) => !prev);
            }}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <div
          className={`grid md:hidden ${
            isMenuOpen
              ? "flex-1 grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="flex min-h-full flex-col items-center justify-center gap-8 pb-16">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:text-aqua-200 block px-4 py-3 text-3xl font-semibold tracking-tight text-white transition"
                  onClick={() => {
                    setIsMenuOpen(false);
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
