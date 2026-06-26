"use client";

import atlasData from "@/data/protein_atlas.json";
import { getModuleTheme } from "@/lib/moduleThemes";
import Link from "next/link";

const ALL = atlasData.modules.flatMap((m) =>
  m.proteins.map((p) => ({ ...p, moduleId: m.id, moduleName: m.name }))
);
const afOnly = ALL.filter((p) => !p.pdbId && p.alphafoldId);
const withPDB = ALL.filter((p) => p.pdbId).length;

const PLDDT = [
  { color: "#1d4ed8", label: "> 90", title: "Muy alta confianza", desc: "Modelo comparable a estructura cristalográfica. Posiciones de cadena lateral fiables." },
  { color: "#22d3ee", label: "70 – 90", title: "Alta confianza", desc: "Posición del esqueleto correcta. Orientación de cadenas laterales con incertidumbre menor." },
  { color: "#facc15", label: "50 – 70", title: "Baja confianza", desc: "El plegamiento general puede ser correcto, pero los detalles son inciertos." },
  { color: "#f97316", label: "< 50",  title: "Región desordenada", desc: "Intrínsecamente desordenada in vivo. No proyecta una estructura rígida definida." },
];

export default function AlphaFoldPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero */}
        <div className="relative mb-14">
          <div className="absolute inset-0 molecular-grid opacity-40 pointer-events-none rounded-3xl" />
          <div className="relative glass rounded-3xl border p-10"
            style={{ borderColor: "rgba(168,85,247,0.18)" }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-5"
              style={{ background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.25)", color: "#a78bfa", fontFamily: "var(--font-mono,monospace)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              Estructuras predichas por IA · EBI AlphaFold DB
            </div>
            <h1 className="text-5xl font-black mb-3" style={{ color: "var(--text)" }}>
              AlphaFold en el Atlas
            </h1>
            <p className="text-lg max-w-3xl leading-relaxed" style={{ color: "var(--text-muted)" }}>
              AlphaFold predice la estructura tridimensional de una proteína directamente a partir de su secuencia de aminoácidos, con una precisión comparable a la cristalografía de rayos X. El atlas usa AlphaFold como fuente primaria para las{" "}
              <span style={{ color: "#a78bfa", fontWeight: 700 }}>{afOnly.length} proteínas</span> sin estructura experimental disponible.
            </p>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { n: "195", label: "Proteínas en el atlas", color: "var(--teal)" },
                { n: withPDB.toString(), label: "Con estructura experimental (PDB)", color: "var(--electric)" },
                { n: afOnly.length.toString(), label: "Con predicción AlphaFold", color: "#a78bfa" },
                { n: "2021", label: "Año de publicación de AlphaFold 2", color: "var(--amber)" },
              ].map((s) => (
                <div key={s.label} className="glass rounded-xl p-4 border"
                  style={{ borderColor: `${s.color}20` }}>
                  <p className="text-3xl font-black mb-1" style={{ color: s.color, fontFamily: "var(--font-mono,monospace)" }}>{s.n}</p>
                  <p className="text-xs leading-snug" style={{ color: "var(--text-muted)" }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* pLDDT Guide */}
        <div className="mb-14">
          <h2 className="text-2xl font-black mb-2" style={{ color: "var(--text)" }}>Escala de confianza pLDDT</h2>
          <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
            AlphaFold asigna a cada residuo un score de confianza (pLDDT, 0–100). El color en la estructura 3D refleja este score.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PLDDT.map((b) => (
              <div key={b.label} className="glass rounded-xl border p-5"
                style={{ borderColor: `${b.color}25`, background: `${b.color}08` }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg flex-shrink-0" style={{ background: b.color }} />
                  <div>
                    <p className="font-black text-lg" style={{ color: b.color, fontFamily: "var(--font-mono,monospace)" }}>{b.label}</p>
                    <p className="text-xs font-bold" style={{ color: "var(--text)" }}>{b.title}</p>
                  </div>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What AlphaFold means for NP */}
        <div className="glass rounded-2xl border p-8 mb-14" style={{ borderColor: "rgba(168,85,247,0.15)" }}>
          <h2 className="text-2xl font-black mb-4" style={{ color: "var(--text)" }}>¿Por qué importa en Nutrición Parenteral?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "🔬",
                title: "Mecanismo molecular visible",
                text: "Ver la estructura de GPX4, ACSL1 o PDHA1 permite entender cómo la deficiencia de selenio, carnitina o tiamina altera el sitio activo — información directa para las fórmulas de NP.",
                color: "var(--teal)",
              },
              {
                icon: "💊",
                title: "Dianas farmacológicas",
                text: "Las estructuras predichas de receptores como PTH1R o PTGDR2 permiten identificar bolsillos de unión para fármacos co-administrados en NP, anticipando interacciones.",
                color: "#a78bfa",
              },
              {
                icon: "⚗️",
                title: "Investigación de novo",
                text: "Para proteínas sin cristal disponible, AlphaFold es la única fuente estructural. El atlas las integra directamente con enlace a la base de datos EBI AlphaFold.",
                color: "var(--amber)",
              },
            ].map((c) => (
              <div key={c.title}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{c.icon}</span>
                  <h3 className="font-bold text-sm" style={{ color: c.color }}>{c.title}</h3>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{c.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AF-only proteins grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black" style={{ color: "var(--text)" }}>
                Proteínas con predicción AlphaFold
              </h2>
              <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                {afOnly.length} proteínas del atlas sin estructura cristalográfica · visor AlphaFold integrado en cada ficha
              </p>
            </div>
            <a href="https://alphafold.ebi.ac.uk" target="_blank" rel="noopener noreferrer"
              className="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
              style={{ background: "rgba(168,85,247,0.10)", border: "1px solid rgba(168,85,247,0.30)", color: "#a78bfa", fontFamily: "var(--font-mono,monospace)" }}>
              EBI AlphaFold DB ↗
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {afOnly.map((p) => {
              const s = getModuleTheme(p.moduleId);
              return (
                <Link
                  key={p.id}
                  href={`/proteina/${p.id}`}
                  className="group glass rounded-xl border p-4 flex flex-col gap-2 transition-all duration-200 hover:scale-[1.01]"
                  style={{ borderColor: `${s.color}20` }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = `${s.color}45`;
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 0 16px ${s.color}12`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = `${s.color}20`;
                    (e.currentTarget as HTMLElement).style.boxShadow = "";
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold font-mono text-sm" style={{ color: s.color }}>{p.name}</p>
                      <p className="text-xs mt-0.5 line-clamp-1" style={{ color: "var(--text-muted)" }}>{p.category}</p>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded flex-shrink-0"
                      style={{ background: "rgba(168,85,247,0.08)", color: "#a78bfa", border: "1px solid rgba(168,85,247,0.2)", fontFamily: "var(--font-mono,monospace)", fontSize: "0.6rem" }}>
                      AF
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: "#5a637a", fontFamily: "var(--font-mono,monospace)" }}>
                    {p.alphafoldId}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>{p.moduleName.split(" ").slice(0,3).join(" ")}</span>
                    <svg className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: s.color }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="glass rounded-2xl border p-8 text-center" style={{ borderColor: "rgba(168,85,247,0.15)" }}>
          <p className="text-xl font-black mb-2" style={{ color: "var(--text)" }}>¿Quieres ver una estructura específica?</p>
          <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
            Cada ficha de proteína incluye visor 3D interactivo — experimental desde RCSB o predicción de AlphaFold EBI.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/explorador"
              className="px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-80"
              style={{ background: "rgba(0,255,136,0.08)", border: "1px solid rgba(0,255,136,0.25)", color: "var(--teal)", fontFamily: "var(--font-mono,monospace)" }}>
              Explorador del Atlas →
            </Link>
            <Link href="/buscar"
              className="px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-80"
              style={{ background: "var(--bg-raised)", border: "1px solid rgba(255,255,255,0.08)", color: "var(--text-muted)", fontFamily: "var(--font-mono,monospace)" }}>
              🔍 Buscar proteína
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
