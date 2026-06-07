"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

interface Protein {
  id: string;
  name: string;
  fullName: string;
  pdbId: string;
  gene: string;
  category: string;
  weight: string;
  studentSummary: string;
  npRelevance: string;
  tags: string[];
  moduleId: string;
  moduleName: string;
  moduleIcon: string;
  moduleColor: string;
}

const moduleTextColor: Record<string, string> = {
  "canal-alimentacion": "text-cyan-400",
  "laboratorio-hepatico": "text-amber-400",
  "sistema-defensa": "text-emerald-400",
  "senalizacion-hormonal": "text-violet-400",
};
const moduleBadge: Record<string, string> = {
  "canal-alimentacion": "bg-cyan-500/10 border-cyan-500/20 text-cyan-400",
  "laboratorio-hepatico": "bg-amber-500/10 border-amber-500/20 text-amber-400",
  "sistema-defensa": "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
  "senalizacion-hormonal": "bg-violet-500/10 border-violet-500/20 text-violet-400",
};
const moduleCardBorder: Record<string, string> = {
  "canal-alimentacion": "border-cyan-500/20 hover:border-cyan-500/50",
  "laboratorio-hepatico": "border-amber-500/20 hover:border-amber-500/50",
  "sistema-defensa": "border-emerald-500/20 hover:border-emerald-500/50",
  "senalizacion-hormonal": "border-violet-500/20 hover:border-violet-500/50",
};

const categories = ["Todas", "Transportador", "Bomba Iónica", "Cotransportador", "Enzima", "Citocromo P450", "Enzima Antioxidante", "Enzima Detoxificadora", "Enzima Generadora de ROS", "Factor de Transcripción", "Receptor Tirosina Cinasa", "Receptor Acoplado a Proteína G", "Proteína de Transporte", "Cinasa Reguladora", "Hormona / Citocina"];

export default function SearchClient({ proteins }: { proteins: Protein[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todas");
  const [moduleFilter, setModuleFilter] = useState("todos");

  const modules = useMemo(() => {
    const seen = new Set<string>();
    const result: { id: string; name: string; icon: string }[] = [];
    proteins.forEach((p) => {
      if (!seen.has(p.moduleId)) {
        seen.add(p.moduleId);
        result.push({ id: p.moduleId, name: p.moduleName, icon: p.moduleIcon });
      }
    });
    return result;
  }, [proteins]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return proteins.filter((p) => {
      const matchQuery = !q ||
        p.name.toLowerCase().includes(q) ||
        p.fullName.toLowerCase().includes(q) ||
        p.gene.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.studentSummary.toLowerCase().includes(q) ||
        p.npRelevance.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      const matchCat = category === "Todas" || p.category === category;
      const matchMod = moduleFilter === "todos" || p.moduleId === moduleFilter;
      return matchQuery && matchCat && matchMod;
    });
  }, [proteins, query, category, moduleFilter]);

  return (
    <div>
      {/* Search box */}
      <div className="relative mb-6">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="GLUT4, insulina, transportador, NP..."
          className="w-full pl-12 pr-4 py-4 rounded-2xl glass border border-slate-700 text-white placeholder-slate-600 text-lg focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
          autoFocus
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setModuleFilter("todos")}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${moduleFilter === "todos" ? "bg-slate-700 border-slate-600 text-white" : "bg-slate-900/50 border-slate-800 text-slate-500 hover:text-slate-300"}`}
          >
            Todos
          </button>
          {modules.map((m) => (
            <button
              key={m.id}
              onClick={() => setModuleFilter(m.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${moduleFilter === m.id ? `${moduleBadge[m.id]} font-bold` : "bg-slate-900/50 border-slate-800 text-slate-500 hover:text-slate-300"}`}
            >
              {m.icon} {m.name.split(" ").slice(0, 2).join(" ")}
            </button>
          ))}
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="sm:ml-auto px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-sm focus:outline-none focus:border-slate-600 transition-all"
        >
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-slate-500">
          {filtered.length === proteins.length
            ? `${proteins.length} proteínas en total`
            : `${filtered.length} resultado${filtered.length !== 1 ? "s" : ""} de ${proteins.length}`}
        </p>
        {(query || category !== "Todas" || moduleFilter !== "todos") && (
          <button
            onClick={() => { setQuery(""); setCategory("Todas"); setModuleFilter("todos"); }}
            className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Results grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-white mb-2">Sin resultados</h3>
          <p className="text-slate-400">No encontramos proteínas para &quot;{query}&quot;</p>
          <button
            onClick={() => { setQuery(""); setCategory("Todas"); setModuleFilter("todos"); }}
            className="mt-4 px-5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-sm hover:border-slate-600 transition-all"
          >
            Ver todas las proteínas
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((p) => {
            const borderClass = moduleCardBorder[p.moduleColor] ?? "border-slate-700";
            const textClass = moduleTextColor[p.moduleColor] ?? "text-slate-300";
            const badgeClass = moduleBadge[p.moduleColor] ?? "bg-slate-800 border-slate-700 text-slate-400";
            return (
              <Link
                key={p.id}
                href={`/proteina/${p.id}`}
                className={`glass rounded-2xl border ${borderClass} p-5 card-hover group transition-all duration-200`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className={`font-mono font-black text-xl ${textClass}`}>{p.name}</span>
                    <span className="ml-2 text-xs text-slate-600 font-mono">{p.gene}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${badgeClass} flex-shrink-0 font-medium`}>
                    {p.moduleIcon}
                  </span>
                </div>
                <p className="text-sm text-slate-300 font-medium mb-2 leading-tight">{p.fullName}</p>
                <p className="text-xs text-slate-500 mb-3 line-clamp-2 leading-relaxed">{p.studentSummary}</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {p.tags.slice(0, 3).map((t) => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-slate-800/60 text-slate-500">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">{p.category}</span>
                  <span className={`text-xs font-semibold ${textClass} opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1`}>
                    Ver 3D
                    <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
