"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/",             label: "Inicio" },
  { href: "/modules",      label: "Módulos" },
  { href: "/osmolaridad",  label: "Osmolaridad" },
  { href: "/docking",      label: "Docking" },
  { href: "/quiz",         label: "Quiz" },
  { href: "/buscar",       label: "Buscar" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open,     setOpen]     = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
        scrolled ? "glass border-b py-3" : "bg-transparent py-4"
      }`}
      style={scrolled ? { borderColor: "rgba(0,255,136,0.08)" } : {}}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

        {/* Logo terminal */}
        <Link href="/" className="flex items-center gap-3 group">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-black transition-all duration-300"
            style={{
              border: "1px solid rgba(0,255,136,0.4)",
              color: "var(--teal)",
              background: "rgba(0,255,136,0.05)",
              fontFamily: "var(--font-mono, monospace)",
              boxShadow: "0 0 12px rgba(0,255,136,0.08)",
            }}
          >
            AP
          </div>
          <div className="hidden sm:block">
            <span
              className="font-bold text-sm"
              style={{ color: "var(--text)", fontFamily: "var(--font-mono, monospace)" }}
            >
              Atlas Proteico
            </span>
            <span
              className="ml-1.5 text-xs px-1.5 py-0.5 rounded"
              style={{
                background: "rgba(0,255,136,0.06)",
                color: "var(--teal)",
                border: "1px solid rgba(0,255,136,0.18)",
                fontFamily: "var(--font-mono, monospace)",
              }}
            >
              NP
            </span>
          </div>
        </Link>

        {/* Links desktop */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => {
            const isActive = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                style={{
                  fontFamily: "var(--font-mono, monospace)",
                  ...(isActive
                    ? {
                        background: "rgba(0,255,136,0.07)",
                        color: "var(--teal)",
                        border: "1px solid rgba(0,255,136,0.18)",
                      }
                    : {
                        color: "var(--text-muted)",
                        border: "1px solid transparent",
                      }),
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.color = "var(--text)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
                  }
                }}
              >
                {l.label}
              </Link>
            );
          })}

          <a
            href="https://nutri-vida-khaki.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            style={{
              border: "1px solid rgba(245,166,35,0.3)",
              color: "var(--amber)",
              fontFamily: "var(--font-mono, monospace)",
              background: "rgba(245,166,35,0.04)",
            }}
          >
            NutriVida →
          </a>
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden p-2 rounded-lg transition-colors"
          style={{ color: "var(--text-muted)" }}
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

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden glass mt-1 px-4 py-3 flex flex-col gap-1"
          style={{ borderTop: "1px solid rgba(0,255,136,0.07)" }}>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="px-4 py-3 rounded-lg text-sm font-medium transition-all"
              style={{
                fontFamily: "var(--font-mono, monospace)",
                ...(pathname === l.href
                  ? { background: "rgba(0,255,136,0.07)", color: "var(--teal)" }
                  : { color: "var(--text-muted)" }),
              }}
            >
              {l.label}
            </Link>
          ))}
          <a
            href="https://nutri-vida-khaki.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 px-4 py-3 rounded-lg text-sm font-medium text-center transition-all"
            style={{
              border: "1px solid rgba(245,166,35,0.3)",
              color: "var(--amber)",
              fontFamily: "var(--font-mono, monospace)",
            }}
          >
            NutriVida NP →
          </a>
        </div>
      )}
    </nav>
  );
}
