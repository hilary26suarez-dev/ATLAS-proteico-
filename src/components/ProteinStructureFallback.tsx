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

const CATEGORY_ICON: Record<string, string> = {
  "Enzima": "⚙️",
  "Transportador": "🚀",
  "Receptor": "📡",
  "Factor de coagulación": "🩸",
  "Proteína de transporte": "🚢",
  "Hormona": "⚡",
  "Inhibidor": "🛡️",
  "Metaloproteasa": "⚗️",
};

function getCategoryIcon(category: string): string {
  for (const [key, icon] of Object.entries(CATEGORY_ICON)) {
    if (category.toLowerCase().includes(key.toLowerCase())) return icon;
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
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(135deg, #030712 0%, #0a0a1a 50%, #050510 100%)" }}>

      {/* Animated rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">

        {/* Outer ring */}
        <div className="absolute rounded-full border"
          style={{
            width: 420, height: 420,
            borderColor: `${color}18`,
            animation: "af-spin 28s linear infinite",
          }}>
          <div className="absolute w-3 h-3 rounded-full -top-1.5 left-1/2 -translate-x-1/2"
            style={{ background: color, opacity: 0.7, boxShadow: `0 0 10px ${color}` }} />
          <div className="absolute w-2 h-2 rounded-full top-1/2 -right-1 -translate-y-1/2"
            style={{ background: color, opacity: 0.4 }} />
        </div>

        {/* Mid ring */}
        <div className="absolute rounded-full border"
          style={{
            width: 280, height: 280,
            borderColor: `${color}25`,
            borderStyle: "dashed",
            animation: "af-spin 18s linear infinite reverse",
          }}>
          <div className="absolute w-2.5 h-2.5 rounded-full -top-1.5 left-1/2 -translate-x-1/2"
            style={{ background: `${color}`, opacity: 0.9, boxShadow: `0 0 8px ${color}` }} />
          <div className="absolute w-2 h-2 rounded-full bottom-0 left-1/3"
            style={{ background: `${color}80` }} />
          <div className="absolute w-1.5 h-1.5 rounded-full top-1/4 right-0"
            style={{ background: `${color}60` }} />
        </div>

        {/* Inner ring */}
        <div className="absolute rounded-full border"
          style={{
            width: 160, height: 160,
            borderColor: `${color}30`,
            animation: "af-spin 10s linear infinite",
          }}>
          <div className="absolute w-2 h-2 rounded-full -top-1 left-1/2 -translate-x-1/2"
            style={{ background: color, boxShadow: `0 0 12px ${color}` }} />
        </div>

        {/* Central sphere */}
        <div className="absolute flex items-center justify-center rounded-full text-4xl"
          style={{
            width: 88, height: 88,
            background: `radial-gradient(circle at 35% 35%, ${color}40, ${color}10)`,
            border: `2px solid ${color}50`,
            boxShadow: `0 0 30px ${color}30, 0 0 60px ${color}15`,
            animation: "af-pulse 3s ease-in-out infinite",
          }}>
          {icon}
        </div>

        {/* Background glow */}
        <div className="absolute rounded-full"
          style={{
            width: 500, height: 500,
            background: `radial-gradient(circle, ${color}06 0%, transparent 70%)`,
          }} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-5 px-6 py-8 text-center max-w-lg">

        {/* Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono"
          style={{ background: `${color}12`, border: `1px solid ${color}30`, color }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: color, animation: "af-pulse 2s ease-in-out infinite" }} />
          ESTRUCTURA PREDICHA · AlphaFold Database
        </div>

        {/* Protein name */}
        <div>
          <p className="text-lg font-bold" style={{ color: "var(--text)" }}>{proteinName}</p>
          <p className="text-xs font-mono mt-1" style={{ color: "#6B7BA0" }}>{category}</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3 w-full">
          {[
            { label: "Peso", value: weight },
            { label: "ID", value: alphafoldId },
            { label: "Localización", value: location.split(",")[0].split("(")[0].trim() },
          ].map((s) => (
            <div key={s.label} className="rounded-xl p-3"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <p className="text-xs font-mono mb-1" style={{ color: "#6B7BA0" }}>{s.label}</p>
              <p className="text-xs font-bold" style={{ color: "var(--text)" }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* pLDDT confidence legend */}
        <div className="w-full rounded-xl p-4"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <p className="text-xs font-mono mb-3" style={{ color: "#6B7BA0" }}>CONFIANZA DE PREDICCIÓN AlphaFold (pLDDT)</p>
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            {[
              { color: "#2563eb", label: "> 90 · Muy alta" },
              { color: "#22d3ee", label: "70–90 · Alta" },
              { color: "#fbbf24", label: "50–70 · Baja" },
              { color: "#f97316", label: "< 50 · Desordenada" },
            ].map((b) => (
              <div key={b.label} className="flex items-center gap-1.5 text-xs"
                style={{ color: "#9BA3BE" }}>
                <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: b.color }} />
                {b.label}
              </div>
            ))}
          </div>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <a href={af_url} target="_blank" rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all hover:opacity-90"
            style={{ background: `linear-gradient(135deg, ${color}30, ${color}18)`, border: `1px solid ${color}40`, color }}>
            Ver estructura 3D en AlphaFold ↗
          </a>
          <a href={uniprot_url} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all hover:opacity-80"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#9BA3BE" }}>
            UniProt ↗
          </a>
        </div>

        <p className="text-xs leading-relaxed" style={{ color: "#4B5678" }}>
          AlphaFold predice la estructura 3D a partir de la secuencia de aminoácidos usando inteligencia artificial.
          El pLDDT mide la confianza residuo a residuo (azul oscuro = máxima confianza).
        </p>
      </div>

      <style>{`
        @keyframes af-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes af-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.7; transform: scale(0.96); }
        }
      `}</style>
    </div>
  );
}
