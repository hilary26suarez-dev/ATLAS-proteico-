import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#030712",
  width: "device-width",
  initialScale: 1,
};
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#030712] text-slate-100 antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-slate-800 py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-sm font-bold">
                AP
              </div>
              <div>
                <p className="font-semibold text-sm text-white">Atlas Proteico NP</p>
                <p className="text-xs text-slate-500">Biotecnología al alcance de todos · Gratis</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <span>Conectado con{" "}<a href="https://nutri-vida-khaki.vercel.app" className="text-cyan-400 hover:text-cyan-300 transition-colors">NutriVida NP</a></span>
              <span>·</span>
              <span>Datos: RCSB PDB · UniProt · AlphaFold DB</span>
            </div>
            <p className="text-xs text-slate-600">© 2026 Atlas Proteico NP — Uso educativo libre</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
