"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import BiblioprotePanel from "./BiblioprotePanel";
import HPAPanel from "./HPAPanel";
import ModeToggle from "./ModeToggle";
import ProteinMPNNPanel from "./ProteinMPNNPanel";

const ProteinViewer3D = dynamic(() => import("./ProteinViewer3D"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full min-h-[400px]">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full border-t-2 border-cyan-500 animate-spin mx-auto mb-3" />
        <p className="text-slate-500 text-sm">Inicializando visualizador...</p>
      </div>
    </div>
  ),
});

interface Protein {
  id: string;
  name: string;
  fullName: string;
  pdbId: string;
  alphafoldId: string;
  uniprotId: string;
  gene: string;
  organism: string;
  category: string;
  weight: string;
  location: string;
  studentSummary: string;
  researcherNotes: string;
  npRelevance: string;
  clinicalContext: string;
  mechanism: string;
  ligands: string[];
  pdbUrl: string;
  alphafoldUrl: string;
  pubmedId: string;
  tags: string[];
}

interface Props {
  protein: Protein;
  moduleColor: { text: string; badge: string; badgeText: string; dot: string; border: string };
}

export default function ProteinDetailClient({ protein, moduleColor: mc }: Props) {
  const [mode, setMode] = useState<"student" | "researcher">("student");

  return (
    <div>
      {/* Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-slate-500 text-sm mb-1">Modo de visualización</p>
          <ModeToggle mode={mode} onChange={setMode} />
        </div>
        <div className="flex items-center gap-2">
          {mode === "student" ? (
            <div className="flex items-center gap-2 text-sm text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              Explicaciones en lenguaje claro · Visualización cartoon
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-violet-400">
              <span className="w-2 h-2 rounded-full bg-violet-400" />
              Datos bioinformáticos · Múltiples representaciones
            </div>
          )}
        </div>
      </div>

      {/* ── Viewer centrado ────────────────────────────────────────── */}
      <div className={`glass rounded-2xl border ${mc.border} overflow-hidden mb-8`}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800/50">
          <div className="flex items-center gap-2">
            <span className={`font-mono font-bold ${mc.text}`}>{protein.pdbId}</span>
            <span className="text-slate-600 text-xs">· RCSB PDB</span>
          </div>
          <div className="flex gap-2">
            <a
              href={protein.pdbUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-3 py-1 rounded-lg bg-slate-800 text-slate-400 border border-slate-700 hover:text-white transition-colors"
            >
              Ver en PDB ↗
            </a>
            {mode === "researcher" && (
              <a
                href={protein.alphafoldUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-3 py-1 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/30 hover:opacity-80 transition-opacity"
              >
                AlphaFold ↗
              </a>
            )}
          </div>
        </div>
        <div style={{ height: 540 }}>
          <ProteinViewer3D pdbId={protein.pdbId} proteinName={protein.name} mode={mode} />
        </div>
      </div>

      {/* ── Info panels abajo ──────────────────────────────────────── */}
      {mode === "student" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="glass rounded-2xl border border-cyan-500/20 p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🎓</span>
              <h3 className="text-base font-bold text-cyan-400">¿Qué hace esta proteína?</h3>
            </div>
            <p className="text-slate-300 leading-relaxed text-sm">{protein.studentSummary}</p>
          </div>

          <div className="glass rounded-2xl border border-amber-500/20 p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">💊</span>
              <h3 className="text-base font-bold text-amber-400">En Nutrición Parenteral</h3>
            </div>
            <p className="text-slate-300 leading-relaxed text-sm">{protein.npRelevance}</p>
          </div>

          <div className="glass rounded-2xl border border-emerald-500/20 p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🏥</span>
              <h3 className="text-base font-bold text-emerald-400">Contexto Clínico</h3>
            </div>
            <p className="text-slate-300 leading-relaxed text-sm">{protein.clinicalContext}</p>
          </div>
        </div>
      )}

      {mode === "researcher" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="glass rounded-2xl border border-violet-500/20 p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🔬</span>
              <h3 className="text-base font-bold text-violet-400">Notas Bioinformáticas</h3>
            </div>
            <p className="text-slate-300 leading-relaxed text-sm">{protein.researcherNotes}</p>
          </div>

          <div className="glass rounded-2xl border border-slate-700 p-6">
            <h3 className="text-base font-bold text-slate-300 mb-3">⚙️ Mecanismo</h3>
            <p className="text-slate-400 leading-relaxed text-sm">{protein.mechanism}</p>
          </div>

          <div className="glass rounded-2xl border border-slate-700 p-5">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Ligandos & Sustratos</h3>
            <div className="flex flex-wrap gap-2">
              {protein.ligands.map((l) => (
                <span key={l} className="px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-medium">
                  {l}
                </span>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl border border-slate-700 p-5">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Recursos externos</h3>
            <div className="flex flex-col gap-2">
              {[
                { label: "RCSB PDB", url: protein.pdbUrl, icon: "🏛️", color: "text-cyan-400" },
                { label: "AlphaFold DB", url: protein.alphafoldUrl, icon: "🤖", color: "text-violet-400" },
                { label: `UniProt: ${protein.uniprotId}`, url: `https://www.uniprot.org/uniprotkb/${protein.uniprotId}`, icon: "🧬", color: "text-emerald-400" },
                { label: `PubMed: ${protein.pubmedId}`, url: `https://pubmed.ncbi.nlm.nih.gov/${protein.pubmedId}`, icon: "📄", color: "text-amber-400" },
                { label: `Human Protein Atlas: ${protein.gene}`, url: `https://www.proteinatlas.org/search/${protein.gene}`, icon: "🗺️", color: "text-rose-400" },
              ].map((r) => (
                <a
                  key={r.url}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 transition-all group"
                >
                  <span>{r.icon}</span>
                  <span className={`text-sm font-medium ${r.color} group-hover:opacity-80`}>{r.label}</span>
                  <svg className="w-3.5 h-3.5 ml-auto text-slate-600 group-hover:text-slate-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <BiblioprotePanel pubmedId={protein.pubmedId} />
          </div>

          <div className="md:col-span-2">
            <HPAPanel gene={protein.gene} uniprotId={protein.uniprotId} />
          </div>

          <div className="md:col-span-2">
            <ProteinMPNNPanel
              pdbId={protein.pdbId}
              proteinName={protein.name}
              uniprotId={protein.uniprotId}
              hasLigands={protein.ligands.length > 1}
            />
          </div>
        </div>
      )}

      {/* Bottom details always visible */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Gen", value: protein.gene },
          { label: "Peso Molecular", value: protein.weight },
          { label: "Categoría", value: protein.category },
          { label: "Organismo", value: protein.organism },
        ].map((d) => (
          <div key={d.label} className="glass rounded-xl border border-slate-800/50 p-4">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{d.label}</p>
            <p className="text-sm font-semibold text-slate-200 font-mono">{d.value}</p>
          </div>
        ))}
      </div>

      {/* Location */}
      <div className="mt-4 glass rounded-xl border border-slate-800/50 p-4">
        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">📍 Localización celular</p>
        <p className="text-sm text-slate-300">{protein.location}</p>
      </div>

      {/* Tags */}
      <div className="mt-4 flex flex-wrap gap-2">
        {protein.tags.map((tag) => (
          <span key={tag} className="px-3 py-1 rounded-full bg-slate-800/60 border border-slate-700/50 text-slate-400 text-xs">
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
}
