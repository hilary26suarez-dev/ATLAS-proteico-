"use client";

import atlasData from "@/data/protein_atlas.json";
import { getModuleTheme } from "@/lib/moduleThemes";
import Link from "next/link";
import { useMemo, useState } from "react";

interface RichProtein {
  id: string;
  name: string;
  gene: string;
  category: string;
  weight: string;
  location: string;
  organism: string;
  pdbId?: string;
  alphafoldId: string;
  uniprotId: string;
  studentSummary?: string;
  npRelevance?: string;
  mechanism?: string;
  tags?: string[];
  moduleId: string;
  moduleName: string;
}

const ALL: RichProtein[] = atlasData.modules.flatMap((m) =>
  m.proteins.map((p) => ({
    ...(p as unknown as RichProtein),
    moduleId: m.id,
    moduleName: m.name,
  }))
);

const MAX = 3;

function ProteinSearch({
  selected,
  onAdd,
}: {
  selected: string[];
  onAdd: (p: RichProtein) => void;
}) {
  const [q, setQ] = useState("");

  const results = useMemo(() => {
    if (q.trim().length < 2) return [];
    const lq = q.toLowerCase();
    return ALL.filter(
      (p) =>
        !selected.includes(p.id) &&
        (p.name.toLowerCase().includes(lq) ||
          p.id.toLowerCase().includes(lq) ||
          p.category.toLowerCase().includes(lq) ||
          p.gene.toLowerCase().includes(lq))
    ).slice(0, 8);
  }, [q, selected]);

  return (
    <div className="relative">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          style={{ color: "var(--text-muted)" }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Busca una proteína por nombre, gen o categoría..."
          className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none"
          style={{
            background: "var(--bg-raised)",
            border: "1px solid rgba(255,255,255,0.10)",
            color: "var(--text)",
            fontFamily: "var(--font-mono,monospace)",
          }}
        />
      </div>

      {results.length > 0 && (
        <div
          className="absolute top-full left-0 right-0 mt-1 rounded-xl z-20 overflow-hidden"
          style={{ background: "var(--bg-raised)", border: "1px solid rgba(255,255,255,0.10)", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}
        >
          {results.map((p) => {
            const s = getModuleTheme(p.moduleId);
            return (
              <button
                key={p.id}
                onClick={() => { onAdd(p); setQ(""); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all hover:bg-white/5"
              >
                <span className="text-sm font-bold font-mono" style={{ color: s.color, minWidth: 64 }}>{p.name}</span>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>{p.category}</span>
                <span className="ml-auto text-xs" style={{ color: "#5a637a", fontFamily: "var(--font-mono,monospace)" }}>{p.gene}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CompareCard({ protein, onRemove }: { protein: RichProtein; onRemove: () => void }) {
  const s = getModuleTheme(protein.moduleId);
  const rows: { label: string; value: string }[] = [
    { label: "Gen", value: protein.gene },
    { label: "Categoría", value: protein.category },
    { label: "Peso molecular", value: protein.weight },
    { label: "Localización", value: protein.location.split(",")[0].split("(")[0].trim() },
    { label: "Módulo", value: protein.moduleName },
    { label: "Estructura 3D", value: protein.pdbId ? `PDB: ${protein.pdbId}` : `AlphaFold: ${protein.alphafoldId}` },
    { label: "Organismo", value: protein.organism },
  ];

  return (
    <div className="glass rounded-2xl border flex flex-col overflow-hidden"
      style={{ borderColor: `${s.color}35` }}>

      {/* Header */}
      <div className="px-5 pt-5 pb-4" style={{ background: `${s.color}0c`, borderBottom: `1px solid ${s.color}20` }}>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <p className="font-black text-xl font-mono" style={{ color: s.color }}>{protein.name}</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{protein.category}</p>
          </div>
          <button onClick={onRemove}
            className="text-xs px-2 py-1 rounded-lg transition-all hover:opacity-80 flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.05)", color: "var(--text-muted)", border: "1px solid rgba(255,255,255,0.07)" }}>
            ✕
          </button>
        </div>
        <div className="flex items-center gap-2">
          {protein.pdbId ? (
            <span className="text-xs px-2 py-0.5 rounded" style={{ background: "rgba(0,255,136,0.08)", color: "var(--teal)", border: "1px solid rgba(0,255,136,0.2)", fontFamily: "var(--font-mono,monospace)" }}>
              PDB ✓
            </span>
          ) : (
            <span className="text-xs px-2 py-0.5 rounded" style={{ background: "rgba(168,85,247,0.08)", color: "#a78bfa", border: "1px solid rgba(168,85,247,0.2)", fontFamily: "var(--font-mono,monospace)" }}>
              AlphaFold
            </span>
          )}
          <span className="text-xs" style={{ color: "#5a637a", fontFamily: "var(--font-mono,monospace)" }}>{protein.gene}</span>
        </div>
      </div>

      {/* Data rows */}
      <div className="flex flex-col divide-y flex-1" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        {rows.map((r) => (
          <div key={r.label} className="flex flex-col px-5 py-2.5">
            <span className="text-xs font-mono mb-0.5" style={{ color: "#5a637a" }}>{r.label}</span>
            <span className="text-xs font-semibold" style={{ color: "var(--text)" }}>{r.value}</span>
          </div>
        ))}
      </div>

      {/* NP Relevance */}
      {(protein as RichProtein).npRelevance && (
        <div className="px-5 py-4" style={{ borderTop: `1px solid ${s.color}15`, background: `${s.color}06` }}>
          <p className="text-xs font-mono mb-1" style={{ color: s.color }}>RELEVANCIA EN NP</p>
          <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
            {((protein as RichProtein).npRelevance ?? "").slice(0, 180)}
            {((protein as RichProtein).npRelevance ?? "").length > 180 ? "…" : ""}
          </p>
        </div>
      )}

      {/* Tags */}
      {((protein as RichProtein).tags ?? []).length > 0 && (
        <div className="px-5 py-3 flex flex-wrap gap-1" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          {((protein as RichProtein).tags ?? []).slice(0, 4).map((t) => (
            <span key={t} className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "var(--text-muted)" }}>
              #{t}
            </span>
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="px-5 py-4" style={{ borderTop: `1px solid ${s.color}15` }}>
        <Link href={`/proteina/${protein.id}`}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
          style={{ background: `${s.color}12`, border: `1px solid ${s.color}30`, color: s.color, fontFamily: "var(--font-mono,monospace)" }}>
          Ver ficha completa con 3D →
        </Link>
      </div>
    </div>
  );
}

export default function ExploradorPage() {
  const [selected, setSelected] = useState<RichProtein[]>([]);

  const add = (p: RichProtein) => {
    if (selected.length < MAX) setSelected((s) => [...s, p]);
  };
  const remove = (id: string) => setSelected((s) => s.filter((p) => p.id !== id));

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4"
            style={{ background: "rgba(0,255,136,0.07)", border: "1px solid rgba(0,255,136,0.2)", color: "var(--teal)", fontFamily: "var(--font-mono,monospace)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
            Comparador de proteínas
          </div>
          <h1 className="text-5xl font-black mb-3" style={{ color: "var(--text)" }}>Explorador</h1>
          <p className="text-lg max-w-2xl" style={{ color: "var(--text-muted)" }}>
            Selecciona hasta {MAX} proteínas y compáralas en profundidad — peso, localización, estructura, relevancia en NP y más.
          </p>
        </div>

        {/* Search */}
        <div className="mb-8 max-w-xl">
          {selected.length < MAX ? (
            <ProteinSearch selected={selected.map((p) => p.id)} onAdd={add} />
          ) : (
            <div className="px-4 py-3 rounded-xl text-sm"
              style={{ background: "var(--bg-raised)", border: "1px solid rgba(255,255,255,0.07)", color: "var(--text-muted)", fontFamily: "var(--font-mono,monospace)" }}>
              Máximo {MAX} proteínas en comparación — elimina una para agregar otra
            </div>
          )}
        </div>

        {/* Empty state */}
        {selected.length === 0 && (
          <div className="text-center py-24">
            <div className="text-6xl mb-6">⚗️</div>
            <p className="text-xl font-bold mb-2" style={{ color: "var(--text)" }}>Agrega proteínas para comparar</p>
            <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
              Busca por nombre, gen o categoría. Puedes comparar hasta {MAX} proteínas lado a lado.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {["albumina", "hemoglobina", "cyp3a4", "insulin", "gpx4"].map((id) => {
                const p = ALL.find((x) => x.id === id);
                if (!p) return null;
                const s = getModuleTheme(p.moduleId);
                return (
                  <button key={id} onClick={() => add(p)}
                    className="px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
                    style={{ background: `${s.color}0e`, border: `1px solid ${s.color}30`, color: s.color, fontFamily: "var(--font-mono,monospace)" }}>
                    + {p.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Comparison grid */}
        {selected.length > 0 && (
          <div className={`grid gap-5 ${selected.length === 1 ? "max-w-sm" : selected.length === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-3"}`}>
            {selected.map((p) => (
              <CompareCard key={p.id} protein={p} onRemove={() => remove(p.id)} />
            ))}
          </div>
        )}

        {selected.length > 0 && selected.length < MAX && (
          <p className="text-center text-sm mt-6" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono,monospace)" }}>
            Puedes agregar {MAX - selected.length} proteína{MAX - selected.length > 1 ? "s" : ""} más
          </p>
        )}
      </div>
    </div>
  );
}
