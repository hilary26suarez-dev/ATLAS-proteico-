"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const PRIMARY = [
  { href: "/",               label: "Inicio" },
  { href: "/modules",        label: "Módulos" },
  { href: "/disciplinas",    label: "Disciplinas" },
  { href: "/casos-clinicos", label: "Casos clínicos" },
  { href: "/games",          label: "Entrenamiento" },
  { href: "/buscar",         label: "Buscar" },
];

const SECONDARY = [
  { href: "/explorador",  label: "Explorador" },
  { href: "/alphafold",   label: "AlphaFold" },
  { href: "/vitaminas",   label: "Vitaminas" },
  { href: "/docking",     label: "Docking" },
  { href: "/osmolaridad", label: "Osmolaridad" },
  { href: "/simulador",   label: "Simulador" },
  { href: "/quiz",        label: "Quiz" },
];

const ALL = [...PRIMARY, ...SECONDARY];

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [moreOpen,    setMoreOpen]    = useState(false);
  const pathname  = usePathname();
  const moreRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close "Más" dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile menu on navigation
  useEffect(() => { setMobileOpen(false); setMoreOpen(false); }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const hasActiveSecondary = SECONDARY.some((l) => isActive(l.href));

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass border-b py-2" : "bg-transparent py-3"
      }`}
      style={scrolled ? { borderColor: "rgba(0,255,136,0.08)" } : {}}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black transition-all"
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
            <span className="font-bold text-sm" style={{ color: "var(--text)", fontFamily: "var(--font-mono, monospace)" }}>
              Atlas Proteico
            </span>
            <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded"
              style={{ background: "rgba(0,255,136,0.06)", color: "var(--teal)", border: "1px solid rgba(0,255,136,0.18)", fontFamily: "var(--font-mono, monospace)" }}>
              NP
            </span>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">

          {/* Primary links */}
          {PRIMARY.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap"
              style={{
                fontFamily: "var(--font-mono, monospace)",
                ...(isActive(l.href)
                  ? { background: "rgba(0,255,136,0.08)", color: "var(--teal)", border: "1px solid rgba(0,255,136,0.18)" }
                  : { color: "var(--text-muted)", border: "1px solid transparent" }),
              }}
              onMouseEnter={(e) => { if (!isActive(l.href)) (e.currentTarget as HTMLElement).style.color = "var(--text)"; }}
              onMouseLeave={(e) => { if (!isActive(l.href)) (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
            >
              {l.label}
            </Link>
          ))}

          {/* Más dropdown */}
          <div ref={moreRef} className="relative">
            <button
              onClick={() => setMoreOpen((v) => !v)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                fontFamily: "var(--font-mono, monospace)",
                ...(moreOpen || hasActiveSecondary
                  ? { background: "rgba(0,255,136,0.08)", color: "var(--teal)", border: "1px solid rgba(0,255,136,0.18)" }
                  : { color: "var(--text-muted)", border: "1px solid transparent" }),
              }}
              onMouseEnter={(e) => { if (!moreOpen && !hasActiveSecondary) (e.currentTarget as HTMLElement).style.color = "var(--text)"; }}
              onMouseLeave={(e) => { if (!moreOpen && !hasActiveSecondary) (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
            >
              Más
              <svg className={`w-3 h-3 transition-transform ${moreOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {moreOpen && (
              <div
                className="absolute top-full left-0 mt-1.5 rounded-xl overflow-hidden min-w-[160px]"
                style={{
                  background: "var(--bg-raised)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                }}
              >
                {SECONDARY.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="flex items-center px-4 py-2.5 text-xs font-medium transition-all"
                    style={{
                      fontFamily: "var(--font-mono, monospace)",
                      color: isActive(l.href) ? "var(--teal)" : "var(--text-muted)",
                      background: isActive(l.href) ? "rgba(0,255,136,0.06)" : "transparent",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; (e.currentTarget as HTMLElement).style.color = "var(--text)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = isActive(l.href) ? "rgba(0,255,136,0.06)" : "transparent"; (e.currentTarget as HTMLElement).style.color = isActive(l.href) ? "var(--teal)" : "var(--text-muted)"; }}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* NutriVida + hamburger */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <a
            href="https://nutri-vida-khaki.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{
              border: "1px solid rgba(245,166,35,0.3)",
              color: "var(--amber)",
              fontFamily: "var(--font-mono, monospace)",
              background: "rgba(245,166,35,0.04)",
            }}
          >
            NutriVida →
          </a>

          {/* Hamburger — visible below lg */}
          <button
            className="lg:hidden p-2 rounded-lg transition-colors"
            style={{ color: "var(--text-muted)" }}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menú"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="lg:hidden glass mt-1 px-4 py-3"
          style={{ borderTop: "1px solid rgba(0,255,136,0.07)" }}
        >
          {/* Primary links */}
          <div className="flex flex-col gap-0.5 mb-3">
            <p className="text-xs px-3 py-1" style={{ color: "#5a637a", fontFamily: "var(--font-mono,monospace)" }}>PRINCIPAL</p>
            {PRIMARY.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
                style={{
                  fontFamily: "var(--font-mono, monospace)",
                  ...(isActive(l.href)
                    ? { background: "rgba(0,255,136,0.07)", color: "var(--teal)" }
                    : { color: "var(--text-muted)" }),
                }}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Secondary links */}
          <div className="flex flex-col gap-0.5 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <p className="text-xs px-3 py-1" style={{ color: "#5a637a", fontFamily: "var(--font-mono,monospace)" }}>HERRAMIENTAS</p>
            {SECONDARY.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
                style={{
                  fontFamily: "var(--font-mono, monospace)",
                  ...(isActive(l.href)
                    ? { background: "rgba(0,255,136,0.07)", color: "var(--teal)" }
                    : { color: "var(--text-muted)" }),
                }}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <a
            href="https://nutri-vida-khaki.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-medium"
            style={{
              border: "1px solid rgba(245,166,35,0.3)",
              color: "var(--amber)",
              fontFamily: "var(--font-mono, monospace)",
            }}
          >
            NutriVida →
          </a>
        </div>
      )}
    </nav>
  );
}
