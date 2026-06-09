import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const viewport: Viewport = {
  themeColor: "#010c18",
  width: "device-width",
  initialScale: 1,
};

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Atlas Proteico NP | Biotecnología para la Salud",
  description: "Explora el universo molecular de las proteínas esenciales en Nutrición Parenteral. Visualización 3D interactiva, modos Estudiante e Investigador. Gratis para profesionales de la salud.",
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
    <html lang="es" className={`${inter.variable} ${spaceGrotesk.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased" style={{ background: "var(--bg)", color: "var(--text)" }}>
        <Navbar />
        <main className="flex-1">{children}</main>

        <footer className="border-t mt-16 py-10" style={{ borderColor: "rgba(0,219,160,0.08)" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black font-display"
                style={{ background: "var(--teal)", color: "var(--bg)" }}>
                AP
              </div>
              <div>
                <p className="font-bold text-sm font-display" style={{ color: "var(--text)" }}>Atlas Proteico NP</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Biotecnología al alcance de todos · Gratis</p>
              </div>
            </div>

            <div className="flex items-center gap-5 text-sm" style={{ color: "var(--text-muted)" }}>
              <span>
                Conectado con{" "}
                <a href="https://nutri-vida-khaki.vercel.app"
                  className="transition-colors hover:opacity-80"
                  style={{ color: "var(--teal)" }}>
                  NutriVida NP
                </a>
              </span>
              <span style={{ color: "var(--text-faint)" }}>·</span>
              <span>RCSB PDB · UniProt · AlphaFold</span>
            </div>

            <p className="text-xs" style={{ color: "var(--text-faint)" }}>
              © 2026 Atlas Proteico NP — Uso educativo libre
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
