"use client";

import { useProgress } from "@/hooks/useProgress";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import BiblioprotePanel from "./BiblioprotePanel";
import CuriosidadesCard from "./CuriosidadesCard";
import HPAPanel from "./HPAPanel";
import LigandsPanel from "./LigandsPanel";
import MechanismSteps from "./MechanismSteps";
import MiniQuiz from "./MiniQuiz";
import ModeToggle from "./ModeToggle";
import ProfessionLens from "./ProfessionLens";
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

export interface ProteinDetailData {
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
  protein: ProteinDetailData;
  moduleColor: { text: string; badge: string; badgeText: string; dot: string; border: string };
  moduleId: string;
}

export default function ProteinDetailClient({ protein, moduleColor: mc, moduleId }: Props) {
  const [mode, setMode] = useState<"student" | "researcher">("student");
  const [profession, setProfession] = useState<"all" | "nursing" | "pharmacy" | "medicine" | "nutrition">("all");
  const { markVisited } = useProgress();
  const hasExperimentalStructure = Boolean(protein.pdbId);
  const primaryStructureLabel = hasExperimentalStructure ? protein.pdbId : `AF-${protein.alphafoldId}`;
  const primaryStructureSource = hasExperimentalStructure ? "RCSB PDB" : "AlphaFold DB";
  const primaryStructureUrl = hasExperimentalStructure
    ? protein.pdbUrl
    : `https://alphafold.ebi.ac.uk/files/AF-${protein.alphafoldId}-F1-model_v4.pdb`;

  useEffect(() => {
    markVisited(protein.id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [protein.id]);

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
            <span className={`font-mono font-bold ${mc.text}`}>{primaryStructureLabel}</span>
            <span className="text-slate-600 text-xs">· {primaryStructureSource}</span>
          </div>
          <div className="flex gap-2">
            <a
              href={primaryStructureUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-3 py-1 rounded-lg bg-slate-800 text-slate-400 border border-slate-700 hover:text-white transition-colors"
            >
              {hasExperimentalStructure ? "Ver en PDB ↗" : "Descargar modelo ↗"}
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
          <ProteinViewer3D
            pdbId={protein.pdbId}
            alphafoldId={protein.alphafoldId}
            proteinName={protein.name}
            mode={mode}
          />
        </div>
      </div>

      {/* ── Info panels abajo ──────────────────────────────────────── */}
      {mode === "student" && (
        <>
          {/* Filtro de profesión */}
          <ProfessionLens protein={protein} profession={profession} onChange={setProfession} />

          {/* 3 tarjetas principales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="glass rounded-2xl border border-cyan-500/20 p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🎓</span>
                <h3 className="text-base font-bold text-cyan-400">¿Qué hace?</h3>
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

          {/* Mecanismo paso a paso */}
          <div className="mb-6">
            <MechanismSteps mechanism={protein.mechanism} color="var(--teal)" />
          </div>

          {/* Curiosidades bioquímicas */}
          <CuriosidadesCard proteinId={protein.id} color="var(--teal)" />

          {/* Mini-quiz activo recall */}
          <div className="mb-8">
            <MiniQuiz
              moduleId={moduleId}
              proteinName={protein.name}
              color="var(--teal)"
            />
          </div>
        </>
      )}

      {mode === "researcher" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">

          {/* Botones de descarga */}
          <div className="md:col-span-2 flex flex-wrap gap-3 p-4 rounded-2xl"
            style={{ background: "var(--bg-raised)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <span className="text-xs self-center" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono, monospace)" }}>
              DESCARGAR DATOS →
            </span>
            {hasExperimentalStructure ? (
              <a
                href={`https://files.rcsb.org/download/${protein.pdbId}.pdb`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-80"
                style={{ background: "rgba(0,255,136,0.08)", border: "1px solid rgba(0,255,136,0.2)", color: "var(--teal)" }}
              >
                ⬇ PDB ({protein.pdbId})
              </a>
            ) : (
              <a
                href={primaryStructureUrl}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-80"
                style={{ background: "rgba(0,255,136,0.08)", border: "1px solid rgba(0,255,136,0.2)", color: "var(--teal)" }}
              >
                ⬇ Modelo AlphaFold
              </a>
            )}
            <a
              href={protein.alphafoldUrl}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-80"
              style={{ background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.2)", color: "#a78bfa" }}
            >
              AlphaFold DB ↗
            </a>
            <button
              onClick={() => {
                const data = JSON.stringify(protein, null, 2);
                const blob = new Blob([data], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url; a.download = `${protein.id}_atlas.json`;
                a.click(); URL.revokeObjectURL(url);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-80"
              style={{ background: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.2)", color: "var(--amber)" }}
            >
              ⬇ JSON (Atlas)
            </button>
          </div>

          <div className="glass rounded-2xl border border-violet-500/20 p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🔬</span>
              <h3 className="text-base font-bold text-violet-400">Notas Bioinformáticas</h3>
            </div>
            <p className="text-slate-300 leading-relaxed text-sm">{protein.researcherNotes}</p>
          </div>

          <div className="glass rounded-2xl border border-slate-700 p-6">
            <h3 className="text-base font-bold text-slate-300 mb-4">⚙️ Mecanismo molecular</h3>
            <MechanismSteps mechanism={protein.mechanism} color="#a78bfa" />
          </div>

          {/* Ligandos enriquecidos */}
          <div className="md:col-span-2 glass rounded-2xl border border-violet-500/15 p-6">
            <h3 className="text-sm font-bold text-violet-400 mb-4">⚗️ Ligandos, Sustratos y Cofactores</h3>
            <LigandsPanel ligands={protein.ligands} />
          </div>

          {/* Recursos externos */}
          <div className="glass rounded-2xl border border-slate-700 p-5">
            <h3 className="text-sm font-bold text-slate-400 mb-3">Recursos externos</h3>
            <div className="flex flex-col gap-2">
              {[
                protein.pdbUrl ? { label: "RCSB PDB", url: protein.pdbUrl, icon: "🏛️", color: "text-cyan-400" } : null,
                { label: "AlphaFold DB", url: protein.alphafoldUrl, icon: "🤖", color: "text-violet-400" },
                { label: `UniProt: ${protein.uniprotId}`, url: `https://www.uniprot.org/uniprotkb/${protein.uniprotId}`, icon: "🧬", color: "text-emerald-400" },
                protein.pubmedId ? { label: `PubMed: ${protein.pubmedId}`, url: `https://pubmed.ncbi.nlm.nih.gov/${protein.pubmedId}`, icon: "📄", color: "text-amber-400" } : null,
                { label: `Human Protein Atlas: ${protein.gene}`, url: `https://www.proteinatlas.org/search/${protein.gene}`, icon: "🗺️", color: "text-rose-400" },
              ].filter((r): r is { label: string; url: string; icon: string; color: string } => Boolean(r)).map((r) => (
                <a key={r.url} href={r.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 transition-all group">
                  <span>{r.icon}</span>
                  <span className={`text-sm font-medium ${r.color} group-hover:opacity-80`}>{r.label}</span>
                  <svg className="w-3.5 h-3.5 ml-auto text-slate-600 group-hover:text-slate-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl border border-slate-700 p-5">
            <h3 className="text-sm font-bold text-slate-400 mb-3">Localización y propiedades</h3>
            <div className="space-y-3">
              <div className="p-3 rounded-xl" style={{ background: "var(--bg-raised)" }}>
                <p className="text-xs mb-1" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono, monospace)" }}>LOCALIZACIÓN</p>
                <p className="text-sm" style={{ color: "var(--text)" }}>{protein.location}</p>
              </div>
              <div className="p-3 rounded-xl" style={{ background: "var(--bg-raised)" }}>
                <p className="text-xs mb-1" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono, monospace)" }}>PESO MOLECULAR</p>
                <p className="text-sm font-mono font-bold" style={{ color: "var(--teal)" }}>{protein.weight}</p>
              </div>
              <div className="p-3 rounded-xl" style={{ background: "var(--bg-raised)" }}>
                <p className="text-xs mb-2" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono, monospace)" }}>TAGS FUNCIONALES</p>
                <div className="flex flex-wrap gap-1">
                  {protein.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "var(--text-muted)" }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
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
