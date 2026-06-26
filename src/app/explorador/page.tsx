"use client";

import atlasData from "@/data/protein_atlas.json";
import { getModuleTheme } from "@/lib/moduleThemes";
import Link from "next/link";
import { useMemo, useState } from "react";

const ALL_MODULES = atlasData.modules.filter((m) => m.id !== "vitaminas-y-cofactores");
const ALL_PROTEINS = atlasData.modules.flatMap((m) =>
  m.proteins.map((p) => ({ ...p, moduleId: m.id, moduleName: m.name }))
);

export default function ExploradorPage() {
  const [activeModule, setActiveModule] = useState<string>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return ALL_PROTEINS.filter((p) => {
      const matchMod = activeModule === "all" || p.moduleId === activeModule;
      const matchQ = !q || p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
      return matchMod && matchQ;
    });
  }, [activeModule, query]);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero */}
        <div className="relative mb-12">
          <div className="absolute inset-0 molecular-grid opacity-40 pointer-events-none rounded-3xl" />
          <div className="relative glass rounded-3xl border p-10"
            style={{ borderColor: "rgba(0,255,136,0.12)" }}>
            <div className="label-teal mb-4 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
              <span>195 proteínas · 17 módulos</span>
            </div>
            <h1 className="text-5xl font-black mb-3" style={{ color: "var(--text)" }}>
              Explorador del Atlas
            </h1>
            <p className="text-lg max-w-2xl" style={{ color: "var(--text-muted)" }}>
              Navega el atlas completo. Filtra por módulo, busca por nombre o categoría, y accede directamente al visor 3D de cada proteína.
            </p>

            {/* Stats */}
            <div className="mt-6 flex flex-wrap gap-4">
              {[
                { label: "Proteínas", value: "195", color: "var(--teal)" },
                { label: "Módulos", value: "17", color: "var(--electric)" },
                { label: "Con estructura 3D", value: "167", color: "var(--amber)" },
                { label: "Con predicción AlphaFold", value: "28", color: "var(--purple)" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2 px-4 py-2 rounded-xl"
                  style={{ background: `${s.color}10`, border: `1px solid ${s.color}25` }}>
                  <span className="text-2xl font-black" style={{ color: s.color, fontFamily: "var(--font-mono, monospace)" }}>{s.value}</span>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              style={{ color: "var(--text-muted)" }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nombre, gen o categoría..."
              className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none"
              style={{
                background: "var(--bg-raised)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "var(--text)",
                fontFamily: "var(--font-mono, monospace)",
              }}
            />
          </div>
        </div>

        {/* Module filter pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveModule("all")}
            className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
            style={{
              background: activeModule === "all" ? "rgba(0,255,136,0.12)" : "var(--bg-raised)",
              border: activeModule === "all" ? "1px solid rgba(0,255,136,0.3)" : "1px solid rgba(255,255,255,0.07)",
              color: activeModule === "all" ? "var(--teal)" : "var(--text-muted)",
              fontFamily: "var(--font-mono, monospace)",
            }}
          >
            Todos ({ALL_PROTEINS.length})
          </button>
          {ALL_MODULES.map((mod) => {
            const s = getModuleTheme(mod.id);
            const isActive = activeModule === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => setActiveModule(mod.id)}
                className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
                style={{
                  background: isActive ? `${s.color}15` : "var(--bg-raised)",
                  border: isActive ? `1px solid ${s.color}40` : "1px solid rgba(255,255,255,0.07)",
                  color: isActive ? s.color : "var(--text-muted)",
                  fontFamily: "var(--font-mono, monospace)",
                }}
              >
                {mod.name.split(" ").slice(0, 3).join(" ")} ({mod.proteins.length})
              </button>
            );
          })}
        </div>

        {/* Count */}
        <p className="text-xs mb-4" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono, monospace)" }}>
          {filtered.length} proteína{filtered.length !== 1 ? "s" : ""} encontrada{filtered.length !== 1 ? "s" : ""}
        </p>

        {/* Protein grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {filtered.map((p) => {
            const s = getModuleTheme(p.moduleId);
            return (
              <Link
                key={p.id}
                href={`/proteina/${p.id}`}
                className="group glass rounded-xl border p-3 flex flex-col gap-1.5 transition-all duration-200 hover:scale-[1.02]"
                style={{
                  borderColor: `${s.color}20`,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = `${s.color}50`;
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 0 16px ${s.color}15`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = `${s.color}20`;
                  (e.currentTarget as HTMLElement).style.boxShadow = "";
                }}
              >
                <span className="text-sm font-bold font-mono leading-tight" style={{ color: s.color }}>{p.name}</span>
                <span className="text-xs leading-tight line-clamp-2" style={{ color: "var(--text-muted)" }}>{p.category}</span>
                <div className="flex items-center gap-1 mt-auto">
                  {p.pdbId ? (
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "rgba(0,255,136,0.07)", color: "var(--teal)", border: "1px solid rgba(0,255,136,0.15)", fontFamily: "var(--font-mono,monospace)", fontSize: "0.6rem" }}>PDB</span>
                  ) : (
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "rgba(168,85,247,0.07)", color: "#a78bfa", border: "1px solid rgba(168,85,247,0.15)", fontFamily: "var(--font-mono,monospace)", fontSize: "0.6rem" }}>AF</span>
                  )}
                  <svg className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: s.color }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <p className="font-semibold" style={{ color: "var(--text)" }}>Sin resultados</p>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Intenta con otro término o limpia el filtro</p>
            <button onClick={() => { setQuery(""); setActiveModule("all"); }}
              className="mt-4 text-sm px-4 py-2 rounded-lg transition-all"
              style={{ color: "var(--teal)", border: "1px solid rgba(0,255,136,0.2)", background: "rgba(0,255,136,0.06)" }}>
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
