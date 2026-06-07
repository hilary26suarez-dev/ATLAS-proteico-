"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/modules", label: "Módulos" },
  { href: "/buscar", label: "Buscar" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass border-b border-slate-800/80 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-sm shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
            AP
          </div>
          <div className="hidden sm:block">
            <span className="font-bold text-white text-sm">Atlas Proteico</span>
            <span className="ml-1.5 text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              NP
            </span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                pathname === l.href
                  ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <a
            href="https://nutrivida.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-3 px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:opacity-90 transition-opacity shadow-lg shadow-cyan-500/20"
          >
            NutriVida NP →
          </a>
        </div>

        <button
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Menú"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden glass border-t border-slate-800/50 mt-1 px-4 py-3 flex flex-col gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                pathname === l.href
                  ? "bg-cyan-500/10 text-cyan-400"
                  : "text-slate-400"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <a
            href="https://nutrivida.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 px-4 py-3 rounded-lg text-sm font-medium text-center bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
          >
            NutriVida NP →
          </a>
        </div>
      )}
    </nav>
  );
}
