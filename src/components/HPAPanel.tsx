"use client";

import { useEffect, useState } from "react";

interface HPAData {
  gene: string;
  ensemblId: string;
  uniprotId: string;
  tissueExpression: string;
  tissueSpecificity: string;
  tissueConsensus: string;
  subcellularLocation: string;
  disease: string;
  cancer: string;
  hpaUrl: string;
  subcellUrl: string;
  diseaseUrl: string;
}

interface Props {
  gene: string;
  uniprotId: string;
}

type Status = "loading" | "ok" | "error";

const EXPRESSION_COLORS: Record<string, string> = {
  "tissue enhanced": "text-amber-400",
  "tissue specific": "text-orange-400",
  "group enriched": "text-yellow-400",
  "low tissue specificity": "text-slate-400",
  "not detected": "text-slate-600",
  "detected in all": "text-emerald-400",
  "detected in many": "text-cyan-400",
  "detected in some": "text-blue-400",
  "detected in single": "text-violet-400",
};

function getExprClass(val: string): string {
  const lower = val.toLowerCase();
  for (const [key, cls] of Object.entries(EXPRESSION_COLORS)) {
    if (lower.includes(key)) return cls;
  }
  return "text-slate-300";
}

export default function HPAPanel({ gene, uniprotId }: Props) {
  const [data, setData] = useState<HPAData | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    if (!gene) return;
    setStatus("loading");

    fetch(`/api/hpa/${encodeURIComponent(gene)}`)
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status}`);
        return r.json();
      })
      .then((d: HPAData) => {
        setData(d);
        setStatus("ok");
      })
      .catch(() => setStatus("error"));
  }, [gene]);

  if (status === "loading") {
    return (
      <div className="glass rounded-2xl border border-slate-800/50 p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded-full border-t-2 border-cyan-500 animate-spin" />
          <span className="text-sm text-slate-500">Cargando datos del Human Protein Atlas...</span>
        </div>
        <div className="space-y-2">
          {[80, 60, 70].map((w) => (
            <div key={w} className={`h-3 rounded shimmer-loading`} style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>
    );
  }

  if (status === "error" || !data) {
    return (
      <div className="glass rounded-2xl border border-slate-800/50 p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🧬</span>
          <span className="font-semibold text-slate-300 text-sm">Human Protein Atlas</span>
        </div>
        <p className="text-xs text-slate-500 mb-3">No se encontraron datos de HPA para {gene}. Búscala directamente:</p>
        <a
          href={`https://www.proteinatlas.org/search/${gene}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:opacity-80 transition-opacity"
        >
          🔍 Buscar {gene} en HPA ↗
        </a>
      </div>
    );
  }

  const specClass = getExprClass(data.tissueSpecificity);

  return (
    <div className="glass rounded-2xl border border-cyan-500/20 p-5 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-sm">
            🧬
          </div>
          <div>
            <p className="font-bold text-white text-sm">Human Protein Atlas</p>
            <p className="text-xs text-slate-500">{data.ensemblId || uniprotId}</p>
          </div>
        </div>
        <a
          href={data.hpaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:opacity-80 transition-opacity flex-shrink-0"
        >
          Ver en HPA ↗
        </a>
      </div>

      {/* Tissue Expression */}
      {(data.tissueExpression || data.tissueConsensus) && (
        <div className="p-3 rounded-xl bg-black/30 border border-slate-800/50">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            🫀 Expresión tisular
          </p>
          {data.tissueSpecificity && (
            <p className={`text-sm font-semibold ${specClass} mb-1`}>{data.tissueSpecificity}</p>
          )}
          {data.tissueExpression && (
            <p className="text-xs text-slate-400 leading-relaxed">{data.tissueExpression}</p>
          )}
          {data.tissueConsensus && data.tissueConsensus !== data.tissueExpression && (
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              <span className="font-medium text-slate-400">Consenso: </span>
              {data.tissueConsensus}
            </p>
          )}
        </div>
      )}

      {/* Subcellular Location */}
      {data.subcellularLocation && (
        <div className="p-3 rounded-xl bg-black/30 border border-slate-800/50">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            📍 Localización subcelular (HPA)
          </p>
          <div className="flex flex-wrap gap-1.5">
            {data.subcellularLocation.split(";").map((loc) => (
              <span
                key={loc.trim()}
                className="text-xs px-2 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300"
              >
                {loc.trim()}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Disease */}
      {data.disease && (
        <div className="p-3 rounded-xl bg-black/30 border border-slate-800/50">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            🏥 Asociación a enfermedades
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">{data.disease}</p>
        </div>
      )}

      {/* External links row */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Tejidos", url: data.hpaUrl, icon: "🫀" },
          { label: "Subcelular", url: data.subcellUrl, icon: "🔬" },
          { label: "Patología", url: data.diseaseUrl, icon: "🏥" },
        ].map((l) => (
          <a
            key={l.label}
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 p-2 rounded-xl bg-slate-800/40 border border-slate-700/40 hover:border-slate-600 transition-all text-center group"
          >
            <span className="text-base">{l.icon}</span>
            <span className="text-xs text-slate-500 group-hover:text-slate-300 transition-colors">
              {l.label}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
