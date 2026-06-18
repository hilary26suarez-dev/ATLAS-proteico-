import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const viewport: Viewport = {
  themeColor: "#0A0A0F",
  width: "device-width",
  initialScale: 1,
};

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  weight: ["400", "500", "600", "700"],
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Atlas Proteico NP | Biotecnología para la Salud",
  description: "Explora el universo molecular de las proteínas esenciales en Nutrición Parenteral. Visualización 3D interactiva, modos Estudiante e Investigador para profesionales de la salud.",
  keywords: ["proteínas", "nutrición parenteral", "bioinformática", "atlas proteico", "3D", "salud", "biotecnología", "Costa Rica"],
  authors: [{ name: "Atlas Proteico NP" }],
  openGraph: {
    title: "Atlas Proteico NP",
    description: "Biotecnología y bioinformática al alcance de todos",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full`}>
      <head>
        {/* Preconnect — establece conexión TCP/TLS con CDNs antes de que JS pida los recursos */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://files.rcsb.org"   crossOrigin="anonymous" />
        {/* Preload NGL — descarga el script mientras el HTML se parsea (ahorra ~600ms) */}
        <link rel="preload" as="script" href="https://cdn.jsdelivr.net/npm/ngl@2.3.1/dist/ngl.js" />
      </head>
      <body className="min-h-full flex flex-col antialiased" style={{ background: "var(--bg)", color: "var(--text)" }}>
        <Navbar />
        <main className="flex-1">{children}</main>

        <footer className="mt-16" style={{ borderTop: "1px solid var(--text-faint)" }}>
          {/* Status bar terminal */}
          <div className="px-4 py-2 flex items-center justify-between gap-4 text-xs overflow-x-auto"
            style={{
              background: "var(--bg-card)",
              borderBottom: "1px solid rgba(0,255,136,0.06)",
              fontFamily: "var(--font-mono, monospace)",
              color: "var(--text-muted)",
            }}>
            <div className="flex items-center gap-4 shrink-0">
              <span style={{ color: "var(--teal)" }}>
                <span style={{ marginRight: "0.3rem" }}>●</span>UniProt
              </span>
              <span style={{ color: "var(--teal)" }}>
                <span style={{ marginRight: "0.3rem" }}>●</span>RCSB PDB
              </span>
              <span style={{ color: "var(--teal)" }}>
                <span style={{ marginRight: "0.3rem" }}>●</span>AlphaFold
              </span>
            </div>
            <span className="hidden sm:block" style={{ color: "var(--text-faint)" }}>
              atlas_proteico_np v2.0 · open science
            </span>
          </div>

          {/* Footer principal */}
          <div className="py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-black"
                  style={{
                    background: "transparent",
                    border: "1px solid var(--teal)",
                    color: "var(--teal)",
                    fontFamily: "var(--font-mono, monospace)",
                  }}>
                  AP
                </div>
                <div>
                  <p className="font-bold text-sm font-display" style={{ color: "var(--text)" }}>Atlas Proteico NP</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono, monospace)" }}>
                    Biotecnología al alcance de todos
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm" style={{ color: "var(--text-muted)" }}>
                <span>
                  Conectado con{" "}
                  <a href="https://nutri-vida-khaki.vercel.app"
                    className="transition-colors hover:opacity-80"
                    style={{ color: "var(--teal)" }}>
                    NutriVida NP
                  </a>
                </span>
              </div>

              <p className="text-xs" style={{ color: "var(--text-faint)", fontFamily: "var(--font-mono, monospace)" }}>
                © 2026 Atlas Proteico NP — Uso educativo libre
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
