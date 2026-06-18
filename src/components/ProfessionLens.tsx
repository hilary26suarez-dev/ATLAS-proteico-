"use client";

type Profession = "all" | "nursing" | "pharmacy" | "medicine" | "nutrition";

interface ProteinData {
  name: string;
  npRelevance: string;
  clinicalContext: string;
  mechanism: string;
  ligands: string[];
  pdbId: string;
  gene: string;
  location: string;
}

interface Props {
  protein: ProteinData;
  profession: Profession;
  onChange: (p: Profession) => void;
}

const PROFESSIONS: { id: Profession; label: string; icon: string; color: string; desc: string }[] = [
  { id: "all",       label: "General",    icon: "📚", color: "#B0BAD4", desc: "Vista completa" },
  { id: "nursing",   label: "Enfermería", icon: "🩺", color: "#60a5fa", desc: "Cuidado y monitoreo" },
  { id: "pharmacy",  label: "Farmacia",   icon: "⚗️", color: "#a78bfa", desc: "Compatibilidad y química" },
  { id: "medicine",  label: "Medicina",   icon: "🏥", color: "#f5a623", desc: "Fisiopatología y clínica" },
  { id: "nutrition", label: "Nutrición",  icon: "🥗", color: "#34d399", desc: "NP y requerimientos" },
];

function getLensContent(profession: Profession, protein: ProteinData): { title: string; points: string[]; color: string; icon: string } | null {
  if (profession === "all") return null;

  const name = protein.name;

  if (profession === "nursing") return {
    title: "Lo que necesitas monitorear",
    color: "#60a5fa",
    icon: "🩺",
    points: [
      `Acceso venoso: si ${name} está involucrada en el transporte de nutrientes, el catéter central debe estar permeado correctamente para evitar la pérdida del fármaco por adsorción al PVC.`,
      `Monitoreo visual de la bolsa: verificar la integridad de la emulsión (sin separación de fases, sin partículas) antes y durante la infusión. Reportar cualquier cambio de color o turbidez.`,
      `Velocidad de infusión: no alterar la tasa programada sin orden médica. Las proteínas de membrana como las que participan en ${protein.location} son sensibles a cambios bruscos de osmolaridad.`,
      `Signos de alarma: ${protein.clinicalContext.split('.')[0]}.`,
      `Filtros de infusión: para NP con lípidos usar filtro de 1.2 μm; sin lípidos, 0.22 μm. Verificar la fecha de cambio del set cada 24–72h.`,
    ],
  };

  if (profession === "pharmacy") return {
    title: "Datos farmacéuticos y bioquímicos",
    color: "#a78bfa",
    icon: "⚗️",
    points: [
      `Código PDB: ${protein.pdbId} — disponible para análisis de docking en AutoDock Vina o SwissDock.`,
      `Gen codificante: ${protein.gene}. Variantes en este gen pueden alterar la eficacia de fármacos que modulan esta proteína.`,
      `Cofactores y ligandos relevantes: ${protein.ligands.slice(0, 4).join(', ')}. Verificar compatibilidad en la bolsa de NP.`,
      `Mecanismo molecular (resumen): ${protein.mechanism.split('.')[0]}.`,
      `Estabilidad en NP: la temperatura y el pH de la fórmula afectan la integridad de los cofactores. Preparar a <25°C y pH 6.0–7.0 para mayor estabilidad.`,
    ],
  };

  if (profession === "medicine") return {
    title: "Fisiopatología y decisión clínica",
    color: "#f5a623",
    icon: "🏥",
    points: [
      `Contexto clínico: ${protein.clinicalContext}`,
      `Implicación diagnóstica: la disfunción de ${name} se manifiesta como ${protein.npRelevance.split('.')[0]}.`,
      `Biomarcadores asociados: evaluar función de ${protein.gene} mediante los marcadores disponibles en HPA (Human Protein Atlas) y BioGPS para correlación pronóstica.`,
      `Interacciones farmacológicas: los fármacos co-administrados en NP (insulina, heparina, vitaminas) pueden interactuar con esta vía. Ver la sección de ligandos para detalles.`,
      `Decisión NP: ${protein.npRelevance}`,
    ],
  };

  if (profession === "nutrition") return {
    title: "Relevancia nutricional y NP",
    color: "#34d399",
    icon: "🥗",
    points: [
      `Rol en NP: ${protein.npRelevance}`,
      `Evaluación del estado nutricional: la expresión y actividad de ${name} está directamente influenciada por el aporte de macronutrientes y micronutrientes en la NP.`,
      `Cofactores nutricionales: ${protein.ligands.filter(l => l.length < 30).slice(0, 3).join(', ')} son esenciales para la función de esta proteína. Su déficit en la fórmula de NP compromete la actividad enzimática.`,
      `Requerimientos en NP: ajustar la fórmula según el estado catabolico. En estados inflamatorios severos, la función de ${name} puede estar comprometida independientemente del aporte.`,
      `Localización celular: ${protein.location} — importante para entender la biodisponibilidad de los nutrientes administrados.`,
    ],
  };

  return null;
}

export default function ProfessionLens({ protein, profession, onChange }: Props) {
  const content = getLensContent(profession, protein);
  const active = PROFESSIONS.find((p) => p.id === profession) ?? PROFESSIONS[0];

  return (
    <div className="mb-6">
      {/* Tab bar */}
      <div className="flex flex-wrap gap-2 mb-4">
        {PROFESSIONS.map((p) => (
          <button key={p.id} onClick={() => onChange(p.id)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all"
            style={{
              background: profession === p.id ? `${p.color}12` : "rgba(255,255,255,0.03)",
              border: `1px solid ${profession === p.id ? p.color + "35" : "rgba(255,255,255,0.06)"}`,
              color: profession === p.id ? p.color : "#6B7BA0",
            }}>
            <span>{p.icon}</span>
            <span>{p.label}</span>
          </button>
        ))}
      </div>

      {/* Lens callout */}
      {content && (
        <div className="rounded-2xl p-5 transition-all"
          style={{ background: `${content.color}07`, border: `1px solid ${content.color}20` }}>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">{content.icon}</span>
            <p className="text-sm font-bold" style={{ color: content.color }}>
              {content.title} · Vista {active.label}
            </p>
          </div>
          <ul className="space-y-2.5">
            {content.points.map((point, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5"
                  style={{ background: `${content.color}20`, color: content.color }}>
                  {i + 1}
                </span>
                <p className="text-xs leading-relaxed" style={{ color: "#B0BAD4" }}>{point}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
