"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type StepId = "story" | "molecular" | "management" | "quiz";

interface PathwayNode { label: string; sub?: string; blocked?: boolean; highlight?: boolean; }
interface LabValue    { name: string; value: string; unit: string; normal: string; pct: number; alert: boolean; }

interface ClinicalCase {
  id: string; title: string; subtitle: string; icon: string; color: string;
  specialty: string[]; difficulty: "Básico" | "Intermedio" | "Avanzado";
  patient: { age: string; sex: string; diagnosis: string; vitals: string };
  labs: LabValue[];
  story: string; question: string;
  pathway: { title: string; nodes: PathwayNode[] };
  keyProteins: { name: string; id: string; role: string; color: string }[];
  molecular: string;
  npImplication: string;
  management: string[];
  pearl: string;
  quizOptions: { text: string; correct: boolean; explanation: string }[];
}

const CASES: ClinicalCase[] = [
  {
    id: "hepatic",
    title: "Falla hepática y hiperamonemia",
    subtitle: "Cirrosis Child-Pugh C en NP total",
    icon: "🫀", color: "#f87171",
    specialty: ["Medicina", "Nutrición"], difficulty: "Avanzado",
    patient: { age: "58 años", sex: "M", diagnosis: "Cirrosis hepática etílica Child-Pugh C + encefalopatía grado II", vitals: "FC 102 · PA 88/60 · Glasgow 11" },
    labs: [
      { name: "Amoniaco (NH₃)", value: "148", unit: "μmol/L", normal: "< 50", pct: 92, alert: true },
      { name: "Albúmina",       value: "1.8",  unit: "g/dL",   normal: "3.5–5.0", pct: 36, alert: true },
      { name: "PT/INR",         value: "1.9",  unit: "",        normal: "< 1.2", pct: 75, alert: true },
      { name: "Glutamina",      value: "940",  unit: "μmol/L", normal: "< 700", pct: 80, alert: true },
      { name: "BUN",            value: "8",    unit: "mg/dL",  normal: "7–20",  pct: 15, alert: false },
    ],
    story: "Ingresa a UCI paciente de 58 años con cirrosis Child-Pugh C. 72 h sin ingesta oral. Se inicia NP estándar con 1.5 g/kg/día de aminoácidos. A las 6 horas el NH₃ sube de 80 → 148 μmol/L y el Glasgow cae de 13 a 11.",
    question: "¿Qué error bioquímico se cometió y cuál enzima es el nodo central del problema?",
    pathway: {
      title: "Ciclo de la Urea — rotura en CPS1",
      nodes: [
        { label: "NH₃", sub: "aminoácidos NP", highlight: true },
        { label: "CPS1", sub: "↓ 70% en cirrosis", blocked: true },
        { label: "Carbamil-P", sub: "no se forma" },
        { label: "Urea", sub: "sin excreción" },
        { label: "NH₃ ↑↑", sub: "cruza BHE → edema astrocitos", highlight: true },
      ],
    },
    keyProteins: [
      { name: "CPS1", id: "cps1", role: "Primera enzima del ciclo de la urea. En cirrosis avanzada su actividad cae > 70% por pérdida de masa hepatocitaria.", color: "#f87171" },
      { name: "Albúmina", id: "albumina", role: "Marcador de síntesis hepática. < 2 g/dL indica fallo sintético grave.", color: "#fbbf24" },
    ],
    molecular: "La CPS1 (Carbamil Fosfato Sintetasa 1) es la enzima limitante del ciclo de la urea. En cirrosis Child-Pugh C la masa de hepatocitos funcionales se reduce hasta un 80%. Los 1.5 g/kg/día de aminoácidos aportan una carga de nitrógeno que el hígado no puede convertir en urea. El NH₃ acumulado cruza la barrera hematoencefálica y es captado por la glutamina sintetasa de los astrocitos → glutamina intracellular en exceso → edema osmótico → encefalopatía.",
    npImplication: "En hepatopatía grave, la NP estándar puede empeorar la encefalopatía. Fórmulas enriquecidas en BCAA (valina, leucina, isoleucina) metabolizadas en músculo (no en hígado) reducen la carga hepática de nitrógeno.",
    management: [
      "Reducir aminoácidos a 0.8–1.0 g/kg/día (< 0.5 si NH₃ > 150 μmol/L)",
      "Usar fórmula enriquecida en BCAA (Aminosteril N-Hepa, HepatAmine)",
      "Zinc 25 mg/día IV: cofactor esencial de CPS1, OTC y ASS1",
      "Lactulosa por SNG para reducir producción intestinal de NH₃",
      "Monitorear NH₃ cada 6h durante ajuste — meta < 60 μmol/L",
    ],
    pearl: "El zinc es cofactor de CPS1. El 75% de los cirróticos tienen déficit. Suplementar 25 mg/día reduce NH₃ en promedio un 30% — dato frecuentemente olvidado en las fórmulas de NP.",
    quizOptions: [
      { text: "Aumentar aminoácidos para compensar el catabolismo", correct: false, explanation: "Más carga de nitrógeno → más NH₃ → mayor encefalopatía. La restricción es mandatoria." },
      { text: "Reducir aminoácidos + BCAA + zinc", correct: true, explanation: "Correcto. Reducir carga nitrogenada, usar BCAA (metabolizados en músculo) y suplementar zinc (cofactor de CPS1)." },
      { text: "Suspender NP hasta que mejore el NH₃", correct: false, explanation: "El ayuno empeora el catabolismo muscular que libera más glutamina → más NH₃. La NP ajustada es superior." },
      { text: "Cambiar a nutrición enteral", correct: false, explanation: "Si hay indicación de NP, el ajuste de la fórmula es la prioridad, no el cambio de ruta." },
    ],
  },
  {
    id: "refeeding",
    title: "Síndrome de realimentación",
    subtitle: "Hipofosfatemia severa al iniciar NP",
    icon: "⚡", color: "#fbbf24",
    specialty: ["UCI", "Nutrición", "Enfermería"], difficulty: "Intermedio",
    patient: { age: "34 años", sex: "F", diagnosis: "Anorexia nerviosa restrictiva. IMC 12.4. Fracaso multiorgánico", vitals: "FC 48 (bradicardia) · PA 80/55 · Temp 35.2°C" },
    labs: [
      { name: "Fósforo",   value: "0.4", unit: "mEq/L",  normal: "2.5–4.5", pct: 9,  alert: true },
      { name: "Potasio",   value: "2.6", unit: "mEq/L",  normal: "3.5–5.0", pct: 18, alert: true },
      { name: "Magnesio",  value: "0.5", unit: "mEq/L",  normal: "1.5–2.5", pct: 20, alert: true },
      { name: "Insulina",  value: "28",  unit: "μU/mL",  normal: "< 25",    pct: 85, alert: true },
      { name: "Glucosa",   value: "112", unit: "mg/dL",  normal: "70–100",  pct: 55, alert: false },
    ],
    story: "Anorexia nerviosa restrictiva severa, semanas de inanición. Al iniciar NP con 25 kcal/kg/día (dextrosa 20%), a las 8 horas: debilidad muscular progresiva, arritmia sinusal y fósforo cae de 0.9 → 0.4 mEq/L.",
    question: "¿Por qué la glucosa de la NP precipita la hipofosfatemia y qué transportador es el actor molecular?",
    pathway: {
      title: "Síndrome realimentación — cascada GLUT4 → fosfato",
      nodes: [
        { label: "Glucosa NP ↑", sub: "dextrosa 20%", highlight: true },
        { label: "Insulina ↑↑", sub: "páncreas responde" },
        { label: "GLUT4", sub: "transloca a membrana muscular", highlight: true },
        { label: "Glucólisis masiva", sub: "consume P intracelular" },
        { label: "P sérico < 0.5", sub: "bradicardia · parálisis", blocked: true },
      ],
    },
    keyProteins: [
      { name: "GLUT4", id: "glut4", role: "Transportador insulino-dependiente de glucosa. La insulina lo transloca masivamente en músculo → entrada masiva de glucosa → agota el fosfato en glucólisis.", color: "#fbbf24" },
      { name: "GLUT2", id: "glut2", role: "En páncreas: detecta la glucosa de la NP y dispara la secreción de insulina que activa GLUT4.", color: "#f5a623" },
    ],
    molecular: "En inanición prolongada el fósforo corporal total está depletado, aunque el sérico parezca 'normal' por redistribución desde el intracelular. Al iniciar glucosa, la insulina sube → GLUT4 se transloca masivamente en músculo → glucosa entra en masa → glucólisis usa todo el fosfato disponible para formar ATP. El fósforo sérico colapsa. Sin ATP, las células cardíacas y musculares fallan en mantener gradientes iónicos.",
    npImplication: "El síndrome de realimentación es la complicación letal más importante al iniciar NP en desnutrición severa. ASPEN recomienda iniciar con ≤ 10 kcal/kg/día los primeros 2 días y monitorear P, K, Mg cada 6h.",
    management: [
      "PARAR o reducir NP a 5–10 kcal/kg/día INMEDIATAMENTE",
      "Reposición URGENTE de fósforo IV: 0.08–0.16 mmol/kg/h (máx 50 mmol en 8h)",
      "Reponer K y Mg simultáneamente (siempre coexisten)",
      "ECG continuo mientras P < 0.8 mEq/L",
      "Tiamina 100 mg IV ANTES de la glucosa (evita Wernicke)",
      "Escalar NP solo cuando P > 1.0 mEq/L > 24h consecutivas",
    ],
    pearl: "Tiamina (B1) es cofactor de piruvato deshidrogenasa. Sin ella, la glucosa produce lactato en lugar de entrar al ciclo de Krebs. SIEMPRE dar 100 mg IV antes de iniciar glucosa en pacientes desnutridos.",
    quizOptions: [
      { text: "Es normal, el P sube solo al mejorar la nutrición", correct: false, explanation: "P < 0.5 tiene mortalidad > 30%. No se corrige solo mientras continúe la infusión de glucosa." },
      { text: "Reducir NP y reponer fósforo IV urgente", correct: true, explanation: "La restricción de glucosa + reposición IV agresiva de P bajo monitoreo ECG es el estándar de manejo." },
      { text: "Agregar más fósforo a la bolsa de NP", correct: false, explanation: "Insuficiente para corrección urgente, y el exceso de fosfato puede precipitar con el calcio en la bolsa." },
      { text: "Cambiar dextrosa por aminoácidos", correct: false, explanation: "Los aminoácidos también estimulan insulina. La restricción calórica total es lo prioritario." },
    ],
  },
  {
    id: "sepsis",
    title: "Sepsis e hiperglucemia en NP",
    subtitle: "Insulina en set PVC · resistencia inflamatoria",
    icon: "🦠", color: "#a78bfa",
    specialty: ["UCI", "Medicina", "Farmacia"], difficulty: "Avanzado",
    patient: { age: "67 años", sex: "M", diagnosis: "Sepsis por Klebsiella. Post-colectomía. NP central día 4", vitals: "FC 118 · PA 90/55 (norepi 0.3) · Temp 38.8°C" },
    labs: [
      { name: "Glucosa",    value: "312",  unit: "mg/dL",   normal: "140–180 UCI", pct: 88, alert: true },
      { name: "PCR",        value: "248",  unit: "mg/L",    normal: "< 5",          pct: 95, alert: true },
      { name: "Lactato",    value: "3.8",  unit: "mmol/L",  normal: "< 2.0",        pct: 80, alert: true },
      { name: "Cortisol",   value: "45",   unit: "μg/dL",   normal: "5–25",         pct: 75, alert: true },
      { name: "Insulina inf", value: "12", unit: "UI/h PVC", normal: "set PE",      pct: 50, alert: true },
    ],
    story: "Post-quirúrgico con sepsis activa, NP central día 4, insulina IV a 12 UI/h en set de PVC. Glucosa no baja de 280–320 mg/dL. La farmacéutica revisa el set de infusión... y encuentra que nunca se cambió al inicio.",
    question: "¿Dos mecanismos concurrentes explican la refractariedad — cuál es el factor oculto de la vía de infusión?",
    pathway: {
      title: "Doble bloqueo — inflamación + PVC",
      nodes: [
        { label: "TNF-α / IL-6", sub: "sepsis", highlight: true },
        { label: "IRS-1 Ser307", sub: "fosforilación anómala", blocked: true },
        { label: "INSR bloqueado", sub: "resistencia posreceptor", blocked: true },
        { label: "GLUT4 no transloca", sub: "glucosa no entra al músculo" },
        { label: "Glucosa 280–320", sub: "PVC adsorbe 40–80% insulina", highlight: true },
      ],
    },
    keyProteins: [
      { name: "INSR", id: "insr", role: "Receptor tirosina cinasa de insulina. En sepsis, TNF-α activa JNK → fosforila IRS-1 en Ser307 → bloqueo posreceptor → GLUT4 no transloca.", color: "#a78bfa" },
      { name: "mTOR", id: "mtor", role: "El cortisol séptico bloquea mTORC2 → fosforila IRS-1 en Ser307 → amplifica la resistencia a insulina.", color: "#60a5fa" },
    ],
    molecular: "Dos mecanismos concurren. Primero, resistencia inflamatoria: TNF-α activa JNK e IKKβ → fosforilan IRS-1 en Ser307 (en lugar de Tyr608) → PI3K no se activa → GLUT4 no transloca → hiperglucemia. Segundo, adsorción al PVC: el set adsorbe 40–80% de la insulina en los primeros 30 min. El paciente recibe 4–7 UI/h reales a pesar de que la bomba indica 12 UI/h.",
    npImplication: "La hiperglucemia > 180 mg/dL en UCI aumenta mortalidad 3×. La meta es 140–180. La resistencia séptica + adsorción al PVC hacen que la dosis real sea impredecible sin cambio de set.",
    management: [
      "Cambiar set PVC por set de polietileno (PE) para insulina",
      "Pre-flush: 50 mL de solución de insulina 0.05 UI/mL por el nuevo set",
      "Recontrolar glucemia en 1h ANTES de escalar dosis",
      "Glucemia cada 1–2h mientras haya inestabilidad hemodinámica",
      "Reducir dextrosa si glucosa > 250 (< 4 mg/kg/min de glucosa)",
      "Zinc 3–5 mg/día en NP: cofactor de insulina, su déficit agrava resistencia",
    ],
    pearl: "El set de PVC puede 'secuestrar' hasta el 80% de la insulina. Cambiar el set ANTES de escalar la dosis puede ser equivalente a 'duplicar' la insulina disponible. Riesgo: hipoglucemia severa si se cambia el set sin reducir las UI/h programadas.",
    quizOptions: [
      { text: "Duplicar la dosis: 24 UI/h", correct: false, explanation: "Peligroso. Si el set se cambia después, el paciente recibiría 24 UI/h reales → hipoglucemia grave." },
      { text: "Cambiar set a PE, pre-flush, recontrolar antes de escalar", correct: true, explanation: "La secuencia correcta: cambio de set → flush → recontrolar en 1h → ajustar solo si persiste > 250." },
      { text: "Suspender insulina y manejar con dieta", correct: false, explanation: "No aplica en NP total. La hiperglucemia debe corregirse." },
      { text: "Cambiar NP a fórmula sin glucosa", correct: false, explanation: "No existe NP sin glucosa para uso clínico. Se puede reducir su concentración, no eliminarla." },
    ],
  },
  {
    id: "cachexia",
    title: "Caquexia oncológica y mTOR",
    subtitle: "Resistencia anabólica en NP domiciliaria",
    icon: "🔬", color: "#34d399",
    specialty: ["Nutrición", "Medicina", "Biotec"], difficulty: "Avanzado",
    patient: { age: "52 años", sex: "F", diagnosis: "Adenocarcinoma páncreas estadio IV · NP domiciliaria 6 semanas", vitals: "Peso 41 kg (–12 kg en 3 meses) · ECOG 3" },
    labs: [
      { name: "Albúmina", value: "2.1", unit: "g/dL",   normal: "3.5–5.0", pct: 30, alert: true },
      { name: "PCR",      value: "87",  unit: "mg/L",    normal: "< 5",     pct: 80, alert: true },
      { name: "IGF-1",    value: "62",  unit: "ng/mL",   normal: "100–250", pct: 20, alert: true },
      { name: "Cortisol", value: "22",  unit: "μg/dL",   normal: "5–25",    pct: 68, alert: false },
      { name: "BCAA",     value: "185", unit: "μmol/L",  normal: "> 400",   pct: 25, alert: true },
    ],
    story: "NP domiciliaria 1.5 g/kg/día de aminoácidos, 30 kcal/kg/día desde hace 6 semanas. Sigue perdiendo músculo a 0.5 kg/semana a pesar de recibir 'suficiente' nutrición. ¿Por qué el músculo sigue catabolizando?",
    question: "¿Qué explica la 'resistencia anabólica' en caquexia y cuál es el nodo molecular central bloqueado?",
    pathway: {
      title: "Eje mTORC1 — bloqueado por inflamación tumoral",
      nodes: [
        { label: "Leucina / BCAA", sub: "aminoácidos NP" },
        { label: "mTORC1", sub: "bloqueado por TNF-α · TGF-β", blocked: true },
        { label: "p70S6K / 4E-BP1", sub: "sin fosforilación" },
        { label: "Sin síntesis proteica", sub: "anabolismo = 0" },
        { label: "Proteosoma activo", sub: "MuRF1 / atrogina-1 ↑↑", highlight: true },
      ],
    },
    keyProteins: [
      { name: "mTOR", id: "mtor", role: "Sensor maestro de nutrientes y anabolismo. El TNF-α y TGF-β tumorales bloquean mTORC1 → sin síntesis proteica muscular aunque haya aminoácidos.", color: "#34d399" },
    ],
    molecular: "Normalmente, la leucina activa el complejo Ragulator-RAG GTPasas → mTORC1 → p70S6K y 4E-BP1 fosforilados → traducción de proteínas musculares. En caquexia: el tumor libera TNF-α, IL-6, PIF y Miostatina → activan NF-κB y FOXO3a → sobreexpresión de MuRF1 y atrogina-1 (ubiquitina-proteasoma) → degradación proteica 3–5× mayor que en condiciones normales. La síntesis que estimula la NP no compensa la destrucción. mTOR está bloqueado desde arriba.",
    npImplication: "Aumentar aminoácidos > 2 g/kg/día rara vez produce anabolismo neto en caquexia activa. La NP domiciliaria puede estabilizar el peso y permitir completar la quimioterapia, pero la meta realista es calidad de vida, no reposición de masa muscular.",
    management: [
      "Enriquecer NP con leucina libre (activa mTORC1 directamente sin insulina)",
      "Emulsión ω-3 (SMOFlipid · EPA 2 g/día): reduce TNF-α e IL-6 → desbloquea mTOR",
      "Tratar agresivamente el dolor e inflamación (PCR > 50 → NP casi nunca produce anabolismo)",
      "Fisioterapia pasiva: contracción muscular activa mTORC1 directamente",
      "Meta realista: estabilización del peso, no ganancia de masa muscular",
    ],
    pearl: "La leucina es el único aminoácido que activa mTORC1 directamente a través de Sestrina2, sin necesidad de insulina. Enriquecer la NP con leucina libre (no solo dentro de proteínas completas) puede mejorar la síntesis proteica hasta un 20% adicional incluso con mTOR parcialmente bloqueado.",
    quizOptions: [
      { text: "Aumentar aminoácidos a 2.5 g/kg/día", correct: false, explanation: "Sin activación de mTORC1, el exceso se oxida. El ambiente inflamatorio es el problema real." },
      { text: "Leucina + omega-3 + tratar la inflamación activa", correct: true, explanation: "Leucina activa mTOR directamente, ω-3 reducen TNF-α, antiinflamatorios desbloquean el eje. Es la evidencia actual más sólida." },
      { text: "Suspender NP: no tiene efecto en caquexia", correct: false, explanation: "La NP domiciliaria mejora calidad de vida y permite completar quimioterapia aunque no revierta la sarcopenia." },
      { text: "Iniciar corticoides para estimular el apetito", correct: false, explanation: "Los corticoides aumentan el catabolismo muscular via FOXO3a. El efecto neto sobre la masa muscular es negativo." },
    ],
  },
];

const STEP_LABELS: { id: StepId; label: string; icon: string }[] = [
  { id: "story",      label: "Caso",      icon: "🩺" },
  { id: "molecular",  label: "Molécula",  icon: "🔬" },
  { id: "management", label: "Manejo",    icon: "💊" },
  { id: "quiz",       label: "Quiz",      icon: "🧠" },
];

// Animated lab bar
function LabBar({ lab, color }: { lab: LabValue; color: string }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 100); return () => clearTimeout(t); }, []);
  return (
    <div className="p-3 rounded-xl" style={{ background: lab.alert ? `${color}08` : "rgba(255,255,255,0.02)", border: `1px solid ${lab.alert ? color + "28" : "rgba(255,255,255,0.04)"}` }}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs" style={{ color: "#B0BAD4" }}>{lab.name}</span>
        <div className="text-right">
          <span className="text-xs font-mono font-bold" style={{ color: lab.alert ? color : "#9BA3BE" }}>{lab.value}</span>
          <span className="text-xs font-mono" style={{ color: "#6B7BA0" }}> {lab.unit}</span>
        </div>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
        <div className="h-full rounded-full transition-all duration-1000"
          style={{ width: visible ? `${lab.pct}%` : "0%", background: lab.alert ? `linear-gradient(90deg,${color}80,${color})` : "rgba(100,120,160,0.4)", transitionTimingFunction: "cubic-bezier(0.34,1.56,0.64,1)" }} />
      </div>
      <div className="text-xs mt-1 font-mono" style={{ color: "#6B7BA0" }}>Ref: {lab.normal}</div>
    </div>
  );
}

// Molecular pathway SVG
function PathwayDiagram({ pathway, color }: { pathway: ClinicalCase["pathway"]; color: string }) {
  const [step, setStep] = useState(-1);
  useEffect(() => {
    let i = -1;
    const t = setInterval(() => { i++; setStep(i); if (i >= pathway.nodes.length - 1) clearInterval(t); }, 500);
    return () => clearInterval(t);
  }, [pathway.nodes.length]);

  return (
    <div className="rounded-2xl p-5" style={{ background: "rgba(0,0,0,0.35)", border: `1px solid ${color}18` }}>
      <p className="text-xs font-mono mb-4" style={{ color: color }}>{pathway.title}</p>
      <div className="flex flex-col sm:flex-row flex-wrap items-center gap-2">
        {pathway.nodes.map((node, i) => (
          <div key={i} className="flex items-center gap-2">
            {/* Node */}
            <div className="transition-all duration-500"
              style={{ opacity: i <= step ? 1 : 0, transform: i <= step ? "scale(1)" : "scale(0.7)" }}>
              <div className="relative px-4 py-2.5 rounded-xl text-center min-w-[110px]"
                style={{
                  background: node.blocked ? "rgba(239,68,68,0.08)" : node.highlight ? `${color}12` : "rgba(255,255,255,0.04)",
                  border: `1.5px solid ${node.blocked ? "#ef444440" : node.highlight ? color + "40" : "rgba(255,255,255,0.08)"}`,
                  boxShadow: node.highlight && i <= step ? `0 0 14px ${color}25` : "none",
                }}>
                {node.blocked && (
                  <span className="absolute -top-2 -right-2 text-sm" title="Bloqueado">🚫</span>
                )}
                <p className="text-xs font-bold font-mono" style={{ color: node.blocked ? "#ef4444" : node.highlight ? color : "#B0BAD4" }}>
                  {node.label}
                </p>
                {node.sub && <p className="text-xs mt-0.5" style={{ color: "#6B7BA0" }}>{node.sub}</p>}
              </div>
            </div>
            {/* Arrow */}
            {i < pathway.nodes.length - 1 && (
              <div className="transition-all duration-300 text-sm hidden sm:block"
                style={{ opacity: i < step ? 1 : 0, color: "#6B7BA0" }}>
                {pathway.nodes[i + 1].blocked ? "✕" : "→"}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CasosClient() {
  const [activeId,  setActiveId]      = useState(CASES[0].id);
  const [step,      setStep]          = useState<StepId>("story");
  const [selected,  setSelected]      = useState<number | null>(null);
  const [revealed,  setRevealed]      = useState(false);
  const [animIn,    setAnimIn]        = useState(true);

  const c = CASES.find((x) => x.id === activeId) ?? CASES[0];

  const changeCase = (id: string) => {
    if (id === activeId) return;
    setAnimIn(false);
    setTimeout(() => { setActiveId(id); setStep("story"); setSelected(null); setRevealed(false); setAnimIn(true); }, 220);
  };
  const changeStep = (s: StepId) => {
    setAnimIn(false);
    setTimeout(() => { setStep(s); setAnimIn(true); }, 160);
  };

  const stepIdx = STEP_LABELS.findIndex((s) => s.id === step);

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Case cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {CASES.map((cas) => (
            <button key={cas.id} onClick={() => changeCase(cas.id)}
              className="text-left rounded-2xl p-4 transition-all"
              style={{
                background: activeId === cas.id ? `${cas.color}0E` : "#0D0D16",
                border: `1.5px solid ${activeId === cas.id ? cas.color + "40" : "rgba(255,255,255,0.05)"}`,
                transform: activeId === cas.id ? "translateY(-3px)" : "none",
                boxShadow: activeId === cas.id ? `0 8px 28px ${cas.color}12` : "none",
              }}>
              <span className="text-2xl block mb-2">{cas.icon}</span>
              <p className="text-xs font-bold leading-tight mb-1" style={{ color: activeId === cas.id ? cas.color : "var(--text)" }}>{cas.title}</p>
              <p className="text-xs" style={{ color: "#6B7BA0" }}>{cas.difficulty}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {cas.specialty.slice(0, 2).map((s) => (
                  <span key={s} className="text-xs px-1.5 py-0.5 rounded font-mono"
                    style={{ background: `${cas.color}0A`, color: cas.color, border: `1px solid ${cas.color}20` }}>{s}</span>
                ))}
              </div>
            </button>
          ))}
        </div>

        {/* Main panel */}
        <div className="rounded-2xl overflow-hidden"
          style={{ border: `1.5px solid ${c.color}22`, background: "#0A0A12", boxShadow: `0 0 50px ${c.color}06` }}>

          {/* Header */}
          <div className="px-5 py-4 flex flex-wrap items-center justify-between gap-3"
            style={{ background: `${c.color}07`, borderBottom: `1px solid ${c.color}15` }}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{c.icon}</span>
              <div>
                <h2 className="font-display font-black text-lg" style={{ color: c.color }}>{c.title}</h2>
                <p className="text-xs" style={{ color: "#B0BAD4" }}>{c.subtitle}</p>
              </div>
            </div>
            {/* Patient chip */}
            <div className="flex items-center gap-3 rounded-xl px-4 py-2.5" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div>
                <p className="text-xs font-bold" style={{ color: "var(--text)" }}>{c.patient.age} · {c.patient.sex}</p>
                <p className="text-xs" style={{ color: "#6B7BA0" }}>{c.patient.vitals}</p>
              </div>
            </div>
          </div>

          {/* Step progress */}
          <div className="px-5 py-3 flex items-center gap-0" style={{ borderBottom: `1px solid rgba(255,255,255,0.04)`, background: "rgba(0,0,0,0.25)" }}>
            {STEP_LABELS.map((s, i) => (
              <div key={s.id} className="flex items-center flex-1 last:flex-none">
                <button onClick={() => changeStep(s.id)}
                  className="flex flex-col items-center gap-0.5 transition-all w-full"
                  style={{ opacity: i <= STEP_LABELS.findIndex((x) => x.id === step) ? 1 : 0.45 }}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm transition-all"
                    style={{
                      background: step === s.id ? c.color : i < stepIdx ? `${c.color}25` : "rgba(255,255,255,0.04)",
                      border: `1.5px solid ${step === s.id ? c.color : i < stepIdx ? c.color + "40" : "rgba(255,255,255,0.08)"}`,
                    }}>
                    {i < stepIdx ? <span style={{ fontSize: "0.65rem", color: c.color }}>✓</span> : <span>{s.icon}</span>}
                  </div>
                  <span className="text-xs font-mono hidden sm:block" style={{ color: step === s.id ? c.color : "#6B7BA0" }}>{s.label}</span>
                </button>
                {i < STEP_LABELS.length - 1 && (
                  <div className="flex-1 h-px mx-1 transition-all" style={{ background: i < stepIdx ? `${c.color}40` : "rgba(255,255,255,0.06)" }} />
                )}
              </div>
            ))}
          </div>

          {/* Step content */}
          <div className="p-5 transition-all" style={{ opacity: animIn ? 1 : 0, transform: animIn ? "translateY(0)" : "translateY(8px)", transition: "opacity 0.2s, transform 0.2s" }}>

            {/* ── HISTORIA ── */}
            {step === "story" && (
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-5">
                <div className="space-y-4">
                  <div className="rounded-2xl p-5" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.04)" }}>
                    <p className="text-xs font-mono mb-3" style={{ color: c.color }}>HISTORIA CLÍNICA</p>
                    <p className="text-sm leading-relaxed" style={{ color: "#B0BAD4" }}>{c.story}</p>
                  </div>
                  <div className="rounded-2xl p-5" style={{ background: `${c.color}09`, border: `1px solid ${c.color}28` }}>
                    <p className="text-xs font-mono mb-2" style={{ color: c.color }}>🔍 PREGUNTA CLAVE</p>
                    <p className="text-base font-bold leading-relaxed" style={{ color: "var(--text)" }}>{c.question}</p>
                    <button onClick={() => changeStep("molecular")}
                      className="mt-4 px-5 py-2 rounded-xl text-sm font-bold transition-all"
                      style={{ background: c.color, color: "#0A0A0F" }}>
                      Ver la respuesta molecular →
                    </button>
                  </div>
                </div>
                {/* Labs */}
                <div className="space-y-2">
                  <p className="text-xs font-mono mb-3" style={{ color: "#6B7BA0" }}>LABORATORIOS</p>
                  {c.labs.map((lab) => <LabBar key={lab.name} lab={lab} color={c.color} />)}
                </div>
              </div>
            )}

            {/* ── MOLECULAR ── */}
            {step === "molecular" && (
              <div className="space-y-5">
                {/* Pathway diagram */}
                <PathwayDiagram pathway={c.pathway} color={c.color} />

                {/* Key proteins */}
                <div>
                  <p className="text-xs font-mono mb-3" style={{ color: "#6B7BA0" }}>PROTEÍNAS CLAVE — explorar en 3D</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {c.keyProteins.map((p) => (
                      <Link key={p.id} href={`/proteina/${p.id}`}
                        className="rounded-xl p-4 flex items-start gap-3 transition-all hover:opacity-90 group"
                        style={{ background: `${p.color}0A`, border: `1px solid ${p.color}25` }}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black font-mono flex-shrink-0"
                          style={{ background: `${p.color}15`, color: p.color, border: `1px solid ${p.color}30` }}>
                          3D
                        </div>
                        <div>
                          <p className="text-sm font-bold mb-1" style={{ color: p.color }}>{p.name} ↗</p>
                          <p className="text-xs leading-relaxed" style={{ color: "#9BA3BE" }}>{p.role}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl p-5" style={{ background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.04)" }}>
                  <p className="text-xs font-mono mb-3" style={{ color: c.color }}>MECANISMO MOLECULAR</p>
                  <p className="text-sm leading-relaxed" style={{ color: "#B0BAD4" }}>{c.molecular}</p>
                </div>
                <div className="rounded-xl p-4" style={{ background: `${c.color}07`, border: `1px solid ${c.color}20` }}>
                  <p className="text-xs font-mono mb-1.5" style={{ color: c.color }}>IMPLICACIÓN EN NP</p>
                  <p className="text-sm leading-relaxed" style={{ color: "#B0BAD4" }}>{c.npImplication}</p>
                </div>
                <button onClick={() => changeStep("management")}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold"
                  style={{ background: c.color, color: "#0A0A0F" }}>
                  Ver manejo clínico →
                </button>
              </div>
            )}

            {/* ── MANEJO ── */}
            {step === "management" && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {c.management.map((m, i) => (
                    <div key={i} className="rounded-xl p-4 flex gap-3 items-start"
                      style={{ background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.04)" }}>
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                        style={{ background: `${c.color}18`, color: c.color, fontFamily: "monospace" }}>
                        {i + 1}
                      </span>
                      <p className="text-xs leading-relaxed" style={{ color: "#B0BAD4" }}>{m}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl p-5 flex gap-4" style={{ background: `${c.color}09`, border: `1px solid ${c.color}30` }}>
                  <span className="text-2xl flex-shrink-0">💡</span>
                  <div>
                    <p className="text-xs font-mono mb-2" style={{ color: c.color }}>PERLA CLÍNICA</p>
                    <p className="text-sm leading-relaxed font-medium" style={{ color: "var(--text)" }}>{c.pearl}</p>
                  </div>
                </div>
                <button onClick={() => changeStep("quiz")}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold"
                  style={{ background: c.color, color: "#0A0A0F" }}>
                  Poner a prueba lo aprendido →
                </button>
              </div>
            )}

            {/* ── QUIZ ── */}
            {step === "quiz" && (
              <div className="space-y-4">
                <div className="rounded-xl p-5" style={{ background: `${c.color}07`, border: `1px solid ${c.color}20` }}>
                  <p className="text-xs font-mono mb-3" style={{ color: c.color }}>🧠 QUIZ RÁPIDO</p>
                  <p className="text-base font-bold mb-5" style={{ color: "var(--text)" }}>{c.question}</p>
                  <div className="space-y-2.5">
                    {c.quizOptions.map((opt, i) => {
                      const isSelected = selected === i;
                      let bg = "rgba(0,0,0,0.25)"; let border = "rgba(255,255,255,0.06)"; let tc = "#B0BAD4";
                      if (revealed) {
                        if (opt.correct)              { bg = "rgba(34,197,94,0.08)";  border = "#22c55e40"; tc = "#4ade80"; }
                        else if (isSelected)          { bg = "rgba(239,68,68,0.08)"; border = "#ef444440"; tc = "#ef4444"; }
                      } else if (isSelected) {
                        bg = `${c.color}10`; border = `${c.color}35`; tc = c.color;
                      }
                      return (
                        <button key={i} onClick={() => !revealed && setSelected(i)}
                          className="w-full text-left p-4 rounded-xl transition-all"
                          style={{ background: bg, border: `1px solid ${border}` }}>
                          <div className="flex items-start gap-3">
                            <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                              style={{ background: "rgba(255,255,255,0.05)", color: tc, fontFamily: "monospace" }}>
                              {String.fromCharCode(65 + i)}
                            </span>
                            <div>
                              <p className="text-sm" style={{ color: tc }}>{opt.text}</p>
                              {revealed && (opt.correct || isSelected) && (
                                <p className="text-xs mt-2 leading-relaxed" style={{ color: "#9BA3BE" }}>{opt.explanation}</p>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex flex-wrap gap-3 mt-5">
                    {selected !== null && !revealed && (
                      <button onClick={() => setRevealed(true)}
                        className="px-5 py-2.5 rounded-xl text-sm font-bold"
                        style={{ background: c.color, color: "#0A0A0F" }}>
                        Ver respuesta
                      </button>
                    )}
                    {revealed && (
                      <>
                        <button onClick={() => { setSelected(null); setRevealed(false); }}
                          className="px-4 py-2 rounded-xl text-sm font-bold"
                          style={{ background: "rgba(255,255,255,0.05)", color: "#B0BAD4" }}>
                          Intentar de nuevo
                        </button>
                        <Link href={`/proteina/${c.keyProteins[0]?.id}`}
                          className="px-4 py-2 rounded-xl text-sm font-bold"
                          style={{ background: `${c.color}12`, color: c.color, border: `1px solid ${c.color}28` }}>
                          Ver {c.keyProteins[0]?.name} en 3D →
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
