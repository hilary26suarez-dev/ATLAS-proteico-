"use client";

import Link from "next/link";
import { useProgress } from "@/hooks/useProgress";
import ModuleProgressBar from "./ModuleProgressBar";

interface Protein {
  id: string;
  name: string;
  fullName: string;
  pdbId: string;
  category: string;
  weight: string;
  studentSummary: string;
  npRelevance: string;
  tags: string[];
}

interface StyleSet {
  cardBorder: string;
  badge: string;
  badgeText: string;
  textColor: string;
}

interface Props {
  proteins: Protein[];
  style: StyleSet;
  color: string;
}

export default function ProteinGridWithProgress({ proteins, style: s, color }: Props) {
  const { isVisited, ready } = useProgress();
  const proteinIds = proteins.map((p) => p.id);

  return (
    <div>
      {/* Barra de progreso del módulo */}
      <div className="mb-6">
        <ModuleProgressBar proteinIds={proteinIds} color={color} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {proteins.map((protein) => {
          const visited = ready && isVisited(protein.id);
          return (
            <Link
              key={protein.id}
              href={`/proteina/${protein.id}`}
              className={`glass rounded-2xl border ${s.cardBorder} p-5 card-hover group transition-all duration-300 relative`}
            >
              {visited && (
                <div className="absolute top-3 right-3 flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(0,255,136,0.08)", border: "1px solid rgba(0,255,136,0.2)", color: "var(--teal)", fontFamily: "var(--font-mono, monospace)" }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--teal)" }} />
                  Visitada
                </div>
              )}

              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-mono font-black text-xl ${s.textColor}`}>{protein.name}</span>
                    {protein.pdbId && (
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-500 font-mono">
                        PDB: {protein.pdbId}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-300 font-medium leading-tight pr-12">{protein.fullName}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs px-2 py-0.5 rounded-full border ${s.badge} ${s.badgeText} font-medium`}>
                  {protein.category}
                </span>
                <span className="text-xs text-slate-600">{protein.weight}</span>
              </div>

              <p className="text-sm text-slate-400 leading-relaxed mb-4 line-clamp-3">
                {protein.studentSummary}
              </p>

              <div className="p-3 rounded-xl bg-black/30 border border-slate-800/50 mb-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">En NP</p>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{protein.npRelevance}</p>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {protein.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-500">
                    {tag}
                  </span>
                ))}
              </div>

              <div className={`flex items-center gap-1 text-sm font-semibold ${s.textColor} opacity-60 group-hover:opacity-100 transition-opacity`}>
                Ver estructura 3D
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
