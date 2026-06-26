"use client";

interface Props {
  alphafoldId: string;
  uniprotId: string;
  proteinName: string;
  category: string;
  weight: string;
  location: string;
  color: string;
}

const PLDDT_BANDS = [
  { color: "#1d4ed8", label: "> 90", desc: "Muy alta confianza" },
  { color: "#22d3ee", label: "70 – 90", desc: "Alta confianza" },
  { color: "#facc15", label: "50 – 70", desc: "Baja confianza" },
  { color: "#f97316", label: "< 50", desc: "Región desordenada" },
];

const CATEGORY_ICON: Record<string, string> = {
  enzima: "⚙️",
  transportador: "🚀",
  receptor: "📡",
  coagulación: "🩸",
  hormona: "⚡",
  inhibidor: "🛡️",
  factor: "🔬",
  canal: "🌊",
  motor: "⚙️",
  estructural: "🏗️",
  citoquina: "💬",
  biológico: "💉",
};

function getCategoryIcon(category: string): string {
  const lower = category.toLowerCase();
  for (const [key, icon] of Object.entries(CATEGORY_ICON)) {
    if (lower.includes(key)) return icon;
  }
  return "🧬";
}

export default function ProteinStructureFallback({
  alphafoldId,
  uniprotId,
  proteinName,
  category,
  weight,
  location,
  color,
}: Props) {
  const af_url = `https://alphafold.ebi.ac.uk/entry/${alphafoldId}`;
  const uniprot_url = `https://www.uniprot.org/uniprotkb/${uniprotId}`;
  const icon = getCategoryIcon(category);

  return (
    <div
      className="relative w-full h-full flex flex-col overflow-y-auto"
      style={{ background: "linear-gradient(160deg, #07080f 0%, #0c0e1a 60%, #060810 100%)" }}
    >
      {/* Top accent line */}
      <div className="h-0.5 w-full flex-shrink-0" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />

      <div className="flex flex-col gap-5 px-6 py-6 flex-1">

        {/* Header */}
        <div className="flex items-start gap-3">
          <div
            className="text-3xl flex items-center justify-center rounded-xl flex-shrink-0"
            style={{ width: 52, height: 52, background: `${color}15`, border: `1px solid ${color}30` }}
          >
            {icon}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-mono mb-1" style={{ color: `${color}cc` }}>
              ESTRUCTURA PREDICHA · AlphaFold
            </p>
            <p className="font-bold text-base leading-tight truncate" style={{ color: "var(--text)" }}>
              {proteinName}
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{category}</p>
          </div>
        </div>

        {/* AlphaFold CTA — main action */}
        <a
          href={af_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between gap-3 rounded-xl px-4 py-4 transition-all hover:opacity-90 active:scale-[0.98]"
          style={{
            background: `linear-gradient(135deg, ${color}22 0%, ${color}0e 100%)`,
            border: `1px solid ${color}45`,
          }}
        >
          <div>
            <p className="text-sm font-bold" style={{ color }}>Ver estructura 3D en AlphaFold ↗</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              ID: {alphafoldId} · Abre en nueva pestaña
            </p>
          </div>
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Peso molecular", value: weight },
            { label: "Localización", value: location.split(",")[0].split("(")[0].trim() },
          ].map((s) => (
            <div key={s.label} className="rounded-lg px-3 py-2.5"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <p className="text-xs font-mono mb-1" style={{ color: "#5a637a" }}>{s.label}</p>
              <p className="text-xs font-semibold truncate" style={{ color: "var(--text)" }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* pLDDT guide */}
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="px-3 py-2" style={{ background: "rgba(255,255,255,0.03)" }}>
            <p className="text-xs font-mono" style={{ color: "#5a637a" }}>CONFIANZA AlphaFold (pLDDT)</p>
          </div>
          <div className="flex">
            {PLDDT_BANDS.map((b) => (
              <div key={b.label} className="flex-1 py-2 px-1 text-center" style={{ background: `${b.color}18` }}>
                <div className="w-4 h-1.5 rounded-full mx-auto mb-1" style={{ background: b.color }} />
                <p className="text-xs font-mono leading-none" style={{ color: b.color, fontSize: "0.6rem" }}>{b.label}</p>
                <p className="mt-0.5 leading-tight" style={{ color: "#5a637a", fontSize: "0.55rem" }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* UniProt link */}
        <a
          href={uniprot_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-mono transition-all hover:opacity-80"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "#5a637a" }}
        >
          🧬 Ver secuencia y ficha completa en UniProt ↗
        </a>
      </div>
    </div>
  );
}
