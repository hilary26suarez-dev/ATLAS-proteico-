"use client";

import { useState } from "react";
import Link from "next/link";

interface ClinicalCase {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  specialty: string[];
  difficulty: "Básico" | "Intermedio" | "Avanzado";
  patient: {
    age: string;
    sex: string;
    diagnosis: string;
    vitals: string;
    labs: { name: string; value: string; alert?: boolean }[];
  };
  story: string;
  question: string;
  keyProteins: { name: string; id: string; moduleId: string; role: string; color: string }[];
  molecular: string;
  npImplication: string;
  management: string[];
  pearl: string;
  quizOptions: { text: string; correct: boolean; explanation: string }[];
}

const CASES: ClinicalCase[] = [
  {
    id: "hepatic-failure",
    title: "Falla hepática y hiperamonemia",
    subtitle: "Paciente con cirrosis en NP total",
    icon: "🫀",
    color: "#f87171",
    specialty: ["Medicina", "Nutrición"],
    difficulty: "Avanzado",
    patient: {
      age: "58 años", sex: "Masculino",
      diagnosis: "Cirrosis hepática Child-Pugh C + encefalopatía grado II",
      vitals: "FC 102 · PA 88/60 mmHg · Glasgow 11",
      labs: [
        { name: "NH₃ (amoniaco)", value: "148 μmol/L", alert: true },
        { name: "Albúmina", value: "1.8 g/dL", alert: true },
        { name: "PT/INR", value: "18 s / 1.9", alert: true },
        { name: "BUN", value: "8 mg/dL" },
        { name: "Glutamina plasmática", value: "↑ 940 μmol/L" },
      ],
    },
    story: "Ingresa a UCI paciente masculino de 58 años con cirrosis hepática etílica Child-Pugh C. Lleva 72 horas sin ingesta oral. Se decide iniciar NP total. La residente de nutrición indica la fórmula estándar con 1.5 g/kg/día de aminoácidos. A las 6 horas, el amoniaco sube de 80 a 148 μmol/L y el Glasgow cae a 11.",
    question: "¿Qué error bioquímico se cometió y cuál es la proteína enzimática central del problema?",
    keyProteins: [
      { name: "CPS1", id: "cps1", moduleId: "laboratorio-hepatico", role: "Primera enzima del ciclo de la urea, exclusiva del hígado. En cirrosis avanzada, su actividad cae > 70%.", color: "#f87171" },
      { name: "Albúmina (HSA)", id: "albumina", moduleId: "laboratorio-hepatico", role: "Marcador de función sintética hepática. Albúmina < 2 g/dL indica déficit grave de síntesis proteica.", color: "#fbbf24" },
    ],
    molecular: "La CPS1 (Carbamil Fosfato Sintetasa 1) es la enzima limitante del ciclo de la urea. Usa NH₃ + bicarbonato + 2 ATP para formar carbamil fosfato. En cirrosis Child-Pugh C, la masa hepatocitaria funcional está reducida hasta un 80%, y la CPS1 no puede procesar la carga de nitrógeno de 1.5 g/kg/día de aminoácidos estándar. El exceso de NH₃ cruza la barrera hematoencefálica y es captado por la glutamina sintetasa cerebral, formando glutamina en exceso dentro de los astrocitos. El edema osmótico resultante → encefalopatía.",
    npImplication: "En hepatopatía grave, la NP estándar puede empeorar la encefalopatía hepática. Las fórmulas de aminoácidos enriquecidas en BCAA (valina, leucina, isoleucina) reducen la competencia con aminoácidos aromáticos por el transporte al SNC.",
    management: [
      "Reducir aminoácidos a 0.8–1.0 g/kg/día inicialmente (< 0.5 g/kg/día si NH₃ > 150 μmol/L)",
      "Usar fórmulas enriquecidas en BCAA (Aminosteril N-Hepa, HepatAmine)",
      "Lactulosatitulación por SNG para reducir producción intestinal de NH₃",
      "Zinc: cofactor esencial de las enzimas del ciclo de la urea (CPS1, OTC, ASS1)",
      "Monitorear NH₃ cada 6h durante el ajuste de NP",
      "Objetivo: NH₃ < 60 μmol/L antes de escalar proteínas",
    ],
    pearl: "El zinc es cofactor de CPS1. El 75% de los cirróticos tienen déficit de zinc. Suplementar 25 mg/día reduce NH₃ en promedio un 30% — a menudo olvidado en las fórmulas de NP.",
    quizOptions: [
      { text: "Aumentar la dosis de aminoácidos para compensar el catabolismo", correct: false, explanation: "Incorrecto. Mayor carga de aminoácidos → más NH₃ → mayor encefalopatía. La restricción inicial es mandatoria." },
      { text: "Reducir aminoácidos y usar fórmula enriquecida en BCAA", correct: true, explanation: "Correcto. Reducir la carga de nitrógeno y favorecer BCAA (que se metabolizan en músculo, no en hígado) es el estándar de manejo." },
      { text: "Suspender la NP hasta que mejore el amoniaco", correct: false, explanation: "No recomendado. El ayuno empeora el catabolismo muscular que libera más glutamina → más NH₃. Mantener NP con ajuste es superior." },
      { text: "Cambiar a nutrición enteral como primera medida", correct: false, explanation: "Si hay indicación de NP (intestino no funcionante o contraindicación de NE), el cambio de ruta no es la solución. El ajuste de la fórmula es prioritario." },
    ],
  },
  {
    id: "refeeding",
    title: "Síndrome de realimentación",
    subtitle: "Hipofosfatemia severa al iniciar NP",
    icon: "⚡",
    color: "#fbbf24",
    specialty: ["UCI", "Nutrición", "Enfermería"],
    difficulty: "Intermedio",
    patient: {
      age: "34 años", sex: "Femenino",
      diagnosis: "Anorexia nerviosa restrictiva severa. IMC 12.4. Ingresa por fracaso multiorgánico.",
      vitals: "FC 48 (bradicardia) · PA 80/55 mmHg · Temp 35.2°C",
      labs: [
        { name: "Fósforo sérico", value: "0.4 mEq/L", alert: true },
        { name: "Potasio", value: "2.6 mEq/L", alert: true },
        { name: "Magnesio", value: "0.5 mEq/L", alert: true },
        { name: "Glucosa", value: "112 mg/dL" },
        { name: "Insulina", value: "↑ 28 μU/mL" },
      ],
    },
    story: "Paciente de 34 años con anorexia nerviosa restrictiva severa. Semanas de inanición casi completa. Al iniciar NP con 25 kcal/kg/día (bolsa estándar glucosa 20%), a las 8 horas de infusión la enfermera alerta: la paciente presenta debilidad muscular progresiva, arritmia sinusal y el fósforo cae de 0.9 a 0.4 mEq/L. ¿Qué sucede?",
    question: "¿Por qué la glucosa en la NP desencadena hipofosfatemia y qué proteína es el actor molecular clave?",
    keyProteins: [
      { name: "GLUT2", id: "glut2", moduleId: "canal-alimentacion", role: "Transportador de glucosa de alta capacidad en hígado y páncreas. La oleada de glucosa activa la captación masiva que consume fosfato intracelular.", color: "#fbbf24" },
      { name: "GLUT4", id: "glut4", moduleId: "canal-alimentacion", role: "Transportador de glucosa dependiente de insulina en músculo. La insulina (estimulada por la glucosa de la NP) transloca GLUT4 a la membrana → entrada masiva de glucosa al músculo → consumo de fosfato en glucólisis.", color: "#f5a623" },
    ],
    molecular: "En el ayuno prolongado, el fósforo corporal total está gravemente depletado aunque el fósforo sérico parezca 'normal' (redistribución desde el intracelular). Al iniciar glucosa en la NP, la insulina se eleva → GLUT4 se transloca masivamente en músculo esquelético. La glucosa entra en masa. La glucólisis convierte glucosa → glucosa-6-fosfato → fructosa-1,6-bisfosfato usando el escaso fosfato inorgánico disponible. El ATP se agota. Las células musculares y cardíacas no pueden mantener gradientes iónicos → bradicardia, debilidad, parálisis diafragmática.",
    npImplication: "El síndrome de realimentación es la complicación potencialmente letal más importante al iniciar NP en pacientes desnutridos severos. La ASPEN recomienda iniciar con no más de 10 kcal/kg/día (la mitad del requerimiento) durante los primeros 2 días.",
    management: [
      "PARAR o reducir drásticamente la NP a 5–10 kcal/kg/día",
      "Reposición URGENTE de fósforo IV: 0.08–0.16 mmol/kg/h, máx 50 mmol en 8h",
      "Reposición de potasio y magnesio (siempre coexisten)",
      "Monitoreo ECG continuo mientras P < 0.8 mEq/L",
      "Escalar NP SOLO cuando P > 1.0 mEq/L durante > 24h",
      "Tiamina (vitamina B1) 100 mg IV antes de iniciar glucosa: previene encefalopatía de Wernicke",
    ],
    pearl: "La tiamina (B1) es el cofactor de la piruvato deshidrogenasa y la cetoglutarato deshidrogenasa. Sin tiamina, la glucosa se convierte en lactato en lugar de entrar al ciclo de Krebs → acidosis láctica. SIEMPRE dar tiamina antes de glucosa en pacientes con riesgo de realimentación.",
    quizOptions: [
      { text: "Es normal, el fósforo sube espontáneamente al mejorar la nutrición", correct: false, explanation: "Falso. La hipofosfatemia severa (< 0.5 mEq/L) tiene mortalidad > 30% si no se corrige. El fósforo no se corrige solo mientras siga la infusión de glucosa." },
      { text: "Reducir la NP y reponer fósforo IV urgente", correct: true, explanation: "Correcto. La piedra angular del manejo es reducir la carga de glucosa y reponer fósforo IV de forma agresiva bajo monitoreo ECG." },
      { text: "Agregar más fósforo a la bolsa de NP para compensar", correct: false, explanation: "Insuficiente e impráctica para corrección urgente. La reposición IV separada es necesaria. Además, agregar exceso de fosfato a la bolsa puede precipitar con el calcio." },
      { text: "Cambiar la dextrosa por aminoácidos para evitar la insulina", correct: false, explanation: "Parcialmente útil pero no suficiente. Los aminoácidos también estimulan insulina. La restricción calórica total es lo prioritario." },
    ],
  },
  {
    id: "sepsis-hyperglycemia",
    title: "Sepsis e hiperglucemia en NP",
    subtitle: "El dilema de la insulina en UCI",
    icon: "🦠",
    color: "#a78bfa",
    specialty: ["UCI", "Medicina", "Farmacia"],
    difficulty: "Avanzado",
    patient: {
      age: "67 años", sex: "Masculino",
      diagnosis: "Sepsis por Klebsiella pneumoniae. Postquirúrgico de colon. NP central día 4.",
      vitals: "FC 118 · PA 90/55 (norepinefrina 0.3 μg/kg/min) · Temp 38.8°C",
      labs: [
        { name: "Glucosa", value: "312 mg/dL", alert: true },
        { name: "Insulina en infusión", value: "12 UI/h (set PVC)" },
        { name: "PCR", value: "248 mg/L", alert: true },
        { name: "Lactato", value: "3.8 mmol/L", alert: true },
        { name: "Cortisol", value: "↑ 45 μg/dL" },
      ],
    },
    story: "Paciente en postoperatorio de colectomía con fuga anastomótica, sepsis activa. Lleva 4 días en NP central con insulina en infusión IV a 12 UI/h por set de PVC para controlar glucemia. La glucosa no baja de 280–320 mg/dL a pesar de escalar insulina. El intensivista sospecha resistencia a insulina séptica. La farmacéutica revisa el set de infusión...",
    question: "¿Cuál es el papel del INSR y qué factor oculto de la vía de infusión explica parte de la refractariedad?",
    keyProteins: [
      { name: "INSR", id: "insr", moduleId: "senalizacion-hormonal", role: "Receptor tirosina cinasa de insulina. En sepsis, el TNF-α y la IL-6 activan IRS-1 serina-cinasa → bloqueo del receptor → resistencia posreceptor.", color: "#a78bfa" },
      { name: "mTOR", id: "mtor", moduleId: "senalizacion-hormonal", role: "Integrador de señales anabólicas. La sepsis y el cortisol bloquean mTORC2, lo que fosforila IRS-1 en Ser307 → reduce la señalización del INSR.", color: "#60a5fa" },
    ],
    molecular: "Dos mecanismos concurren. Primero, la resistencia a la insulina inflamatoria: el TNF-α activa JNK y IKKβ que fosforilan IRS-1 en Ser307 en lugar de Tyr608, bloqueando la señal del INSR. La PI3K no puede activarse → GLUT4 no se transloca → hiperglucemia refractaria. Segundo, la adsorción al PVC: el set de infusión de PVC adsorbe 40–80% de la insulina en los primeros 30 min de contacto. El paciente puede estar recibiendo 4–7 UI/h reales a pesar de que la bomba indica 12 UI/h.",
    npImplication: "La hiperglucemia > 180 mg/dL en UCI aumenta mortalidad 3×, infecciones 2× y días de ventilación mecánica. La meta es 140–180 mg/dL. Pero la resistencia a insulina séptica + adsorción al PVC hacen que la dosis real administrada sea impredecible.",
    management: [
      "Cambiar el set de PVC por set de polietileno (PE) para insulina",
      "Pre-flush: 50 mL de solución de insulina al 0.05 UI/mL por el nuevo set antes de conectar",
      "Controlar glucemia cada 1-2h mientras haya inestabilidad hemodinámica",
      "No escalar insulina ciegamente: investigar adsorción antes de aumentar dosis",
      "Reducir carga de dextrosa en la NP si glucosa > 250 (< 4 mg/kg/min)",
      "Zinc (3–5 mg/día en NP) es cofactor de la insulina: su déficit agrava la resistencia",
    ],
    pearl: "El set de PVC puede 'secuestrar' hasta el 80% de la insulina. En un paciente con 12 UI/h programadas que no responde, cambiar el set puede ser equivalente a 'aumentar la dosis' instantáneamente sin tocar la bomba. Esta es una causa frecuente de hipoglucemia post-cambio de set si no se reducen las unidades.",
    quizOptions: [
      { text: "Duplicar la dosis de insulina: 24 UI/h", correct: false, explanation: "Peligroso. Si el set está saturado y se cambia después, el paciente recibiría 24 UI/h reales → hipoglucemia grave. Primero investigar el sistema de infusión." },
      { text: "Cambiar set a PE, pre-flush, y recontrolar glucemia antes de escalar dosis", correct: true, explanation: "Correcto. La secuencia adecuada: cambiar el set, hacer flush, recontrolar glucemia en 1h. Si persiste > 250, entonces ajustar dosis bajo monitoreo estrecho." },
      { text: "Suspender la insulina y manejar la hiperglucemia con dieta", correct: false, explanation: "No aplicable: el paciente está en NP total y hay sepsis. La hiperglucemia debe corregirse, no tolerarse." },
      { text: "Cambiar la NP a fórmula sin glucosa", correct: false, explanation: "No existe NP sin glucosa para uso clínico. La glucosa es necesaria para el cerebro. Se puede reducir la concentración, pero no eliminarla." },
    ],
  },
  {
    id: "oncology-cachexia",
    title: "Caquexia oncológica y mTOR",
    subtitle: "Resistencia anabólica en NP domiciliaria",
    icon: "🔬",
    color: "#34d399",
    specialty: ["Nutrición", "Medicina", "Biotec"],
    difficulty: "Avanzado",
    patient: {
      age: "52 años", sex: "Femenino",
      diagnosis: "Adenocarcinoma de páncreas estadio IV. NP domiciliaria desde hace 6 semanas.",
      vitals: "Peso 41 kg (–12 kg en 3 meses) · FC 88 · Estado general ECOG 3",
      labs: [
        { name: "Albúmina", value: "2.1 g/dL", alert: true },
        { name: "PCR", value: "87 mg/L", alert: true },
        { name: "IGF-1", value: "62 ng/mL ↓", alert: true },
        { name: "Cortisol", value: "22 μg/dL ↑" },
        { name: "BCAA totales", value: "↓ 185 μmol/L" },
      ],
    },
    story: "Paciente con adenocarcinoma pancreático metastásico. Recibe NP domiciliaria con 1.5 g/kg/día de aminoácidos y 30 kcal/kg/día desde hace 6 semanas. A pesar de recibir 'suficiente' nutrición, continúa perdiendo masa muscular a razón de 0.5 kg/semana. La oncóloga y la nutricionista debaten: ¿por qué el músculo sigue catabolizando si está recibiendo proteínas?",
    question: "¿Qué explica la 'resistencia anabólica' en caquexia oncológica y cuál es el nodo molecular central?",
    keyProteins: [
      { name: "mTOR", id: "mtor", moduleId: "senalizacion-hormonal", role: "Sensor maestro de nutrientes y anabolismo. En caquexia, el TNF-α y el TGF-β bloquean mTORC1 a través de AMPK → no hay síntesis proteica muscular a pesar de aminoácidos disponibles.", color: "#34d399" },
    ],
    molecular: "El mTOR (mechanistic Target Of Rapamycin) es el nodo integrador de señales anabólicas. Normalmente, los aminoácidos (especialmente leucina) activan el complejo Ragulator-RAG GTPasas → mTORC1 se activa → p70S6K y 4E-BP1 son fosforilados → traducción de proteínas musculares. En caquexia oncológica: el tumor libera TNF-α, IL-6, PIF (Factor Inductor de Proteólisis) y Myostatin. Estos activan NF-κB y FOXO3a → sobreexpresión de ubiquitina-proteasoma (MuRF1, atrogina-1) → degradación proteica 3-5× mayor que en condiciones normales. La síntesis que estimula la NP no compensa la destrucción. La vía mTOR está 'bloqueada' desde arriba.",
    npImplication: "En caquexia oncológica, aumentar la dosis de aminoácidos por encima de 2 g/kg/día rara vez produce anabolismo neto. La NP puede estabilizar el peso pero no revertir la sarcopenia en un ambiente inflamatorio activo. El objetivo realista es: mantener la calidad de vida, no la reposición completa de masa muscular.",
    management: [
      "Enriquecer la NP con leucina (o BCAA 2:1:1): activa mTORC1 de forma directa sin pasar por el receptor de insulina",
      "Omega-3 (EPA 2 g/día): reduce TNF-α e IL-6 → desbloquea parcialmente mTOR. Usar emulsiones ω-3 (SMOFlipid) en lugar de las basadas en soja",
      "Considerar progesterona o acetato de megestrol: estimula apetito y bloquea parcialmente la proteólisis via NF-κB",
      "AGRESIVAMENTE: tratar el dolor y la inflamación activa (PCR > 50 mg/L → la NP casi nunca produce anabolismo neto)",
      "Metas realistas: estabilización del peso, no ganancia de masa muscular",
      "Fisioterapia pasiva: la contracción muscular activa mTORC1 directamente incluso en resistencia anabólica parcial",
    ],
    pearl: "La leucina es el único aminoácido con capacidad de activar mTORC1 directamente a través de Sestrina2 sin necesidad de insulina. En caquexia, enriquecer la NP con leucina libre (no solo como parte de una proteína) puede mejorar la síntesis proteica hasta un 20% adicional, incluso con mTOR parcialmente bloqueado por la inflamación.",
    quizOptions: [
      { text: "Aumentar aminoácidos a 2.5 g/kg/día: más proteína = más músculo", correct: false, explanation: "Falso en caquexia activa. Sin activación de mTORC1, el exceso de aminoácidos se oxida o genera urea. No hay anabolismo neto. El ambiente inflamatorio es el problema real." },
      { text: "Enriquecer con leucina + omega-3 + tratar la inflamación activa", correct: true, explanation: "Correcto. La estrategia multimodal (leucina activa mTOR directamente, ω-3 reducen TNF-α, antiinflamatorios desbloquean el eje) es la evidencia actual más sólida." },
      { text: "Suspender la NP: no tiene efecto en caquexia", correct: false, explanation: "Incorrecto. Aunque no revierte la sarcopenia, la NP domiciliaria mejora la calidad de vida, permite completar la quimioterapia y estabiliza el peso. No suspender." },
      { text: "Iniciar corticoides para estimular el apetito y reducir inflamación", correct: false, explanation: "Parcialmente: los corticoides reducen inflamación pero AUMENTAN el catabolismo muscular a través de FOXO3a. Efecto neto negativo sobre la masa muscular." },
    ],
  },
];

export default function CasosClient() {
  const [activeCase, setActiveCase] = useState<ClinicalCase>(CASES[0]);
  const [step, setStep] = useState<"story" | "molecular" | "management" | "quiz">("story");
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleCaseChange = (c: ClinicalCase) => {
    setActiveCase(c);
    setStep("story");
    setSelectedAnswer(null);
    setShowAnswer(false);
  };

  const steps: { id: "story" | "molecular" | "management" | "quiz"; label: string; icon: string }[] = [
    { id: "story",      label: "Caso clínico",   icon: "🩺" },
    { id: "molecular",  label: "¿Por qué?",      icon: "🔬" },
    { id: "management", label: "Manejo NP",       icon: "💊" },
    { id: "quiz",       label: "Quiz rápido",     icon: "🧠" },
  ];

  const c = activeCase;

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Case selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CASES.map((cas) => (
            <button key={cas.id} onClick={() => handleCaseChange(cas)}
              className="text-left rounded-2xl p-5 transition-all"
              style={{
                background: activeCase.id === cas.id ? `${cas.color}0F` : "#111118",
                border: `1px solid ${activeCase.id === cas.id ? cas.color + "35" : "rgba(255,255,255,0.05)"}`,
                boxShadow: activeCase.id === cas.id ? `0 0 25px ${cas.color}08` : "none",
              }}>
              <span className="text-2xl mb-3 block">{cas.icon}</span>
              <p className="font-bold text-sm mb-1" style={{ color: activeCase.id === cas.id ? cas.color : "var(--text)" }}>
                {cas.title}
              </p>
              <p className="text-xs" style={{ color: "#6B7BA0" }}>{cas.subtitle}</p>
              <div className="flex flex-wrap gap-1 mt-3">
                <span className="text-xs px-2 py-0.5 rounded-full font-mono"
                  style={{ background: `${cas.color}0A`, color: cas.color, border: `1px solid ${cas.color}20` }}>
                  {cas.difficulty}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Main case panel */}
        <div className="rounded-2xl overflow-hidden"
          style={{ border: `1px solid ${c.color}20`, background: "#0D0D16" }}>

          {/* Case header */}
          <div className="px-6 py-5 flex items-start justify-between flex-wrap gap-4"
            style={{ borderBottom: `1px solid ${c.color}15`, background: `${c.color}06` }}>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-2xl">{c.icon}</span>
                <h2 className="font-display font-black text-xl" style={{ color: c.color }}>{c.title}</h2>
              </div>
              <p style={{ color: "#B0BAD4", fontSize: "0.9rem" }}>{c.subtitle}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {c.specialty.map((s) => (
                  <span key={s} className="text-xs px-2.5 py-0.5 rounded-full font-mono"
                    style={{ background: `${c.color}10`, color: c.color, border: `1px solid ${c.color}20` }}>{s}</span>
                ))}
              </div>
            </div>
            {/* Patient card */}
            <div className="rounded-xl p-4 min-w-[200px]" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <p className="text-xs font-mono mb-2" style={{ color: "#6B7BA0" }}>PACIENTE</p>
              <p className="text-sm font-bold" style={{ color: "var(--text)" }}>{c.patient.age} · {c.patient.sex}</p>
              <p className="text-xs mt-1" style={{ color: "#B0BAD4" }}>{c.patient.diagnosis}</p>
              <p className="text-xs mt-1 font-mono" style={{ color: "#6B7BA0" }}>{c.patient.vitals}</p>
            </div>
          </div>

          {/* Step nav */}
          <div className="flex border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
            {steps.map((s) => (
              <button key={s.id} onClick={() => setStep(s.id)}
                className="flex-1 py-3 text-xs font-mono transition-all"
                style={{
                  color: step === s.id ? c.color : "#6B7BA0",
                  background: step === s.id ? `${c.color}08` : "transparent",
                  borderBottom: `2px solid ${step === s.id ? c.color : "transparent"}`,
                }}>
                {s.icon} {s.label}
              </button>
            ))}
          </div>

          {/* Step content */}
          <div className="p-6">

            {step === "story" && (
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
                <div>
                  {/* Story */}
                  <div className="rounded-xl p-5 mb-5" style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.04)" }}>
                    <p className="text-xs font-mono mb-3" style={{ color: c.color }}>HISTORIA CLÍNICA</p>
                    <p className="text-sm leading-relaxed" style={{ color: "#B0BAD4" }}>{c.story}</p>
                  </div>
                  {/* Question */}
                  <div className="rounded-xl p-5" style={{ background: `${c.color}08`, border: `1px solid ${c.color}25` }}>
                    <p className="text-xs font-mono mb-2" style={{ color: c.color }}>PREGUNTA CLAVE</p>
                    <p className="text-base font-bold leading-relaxed" style={{ color: "var(--text)" }}>{c.question}</p>
                    <button onClick={() => setStep("molecular")}
                      className="mt-4 px-4 py-2 rounded-xl text-sm font-bold transition-all"
                      style={{ background: c.color, color: "#0A0A0F" }}>
                      Ver la respuesta molecular →
                    </button>
                  </div>
                </div>

                {/* Labs */}
                <div className="rounded-xl p-5" style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.04)" }}>
                  <p className="text-xs font-mono mb-3" style={{ color: "#6B7BA0" }}>LABORATORIOS</p>
                  <div className="space-y-2">
                    {c.patient.labs.map((l) => (
                      <div key={l.name} className="flex items-center justify-between p-2.5 rounded-lg"
                        style={{ background: l.alert ? `${c.color}08` : "rgba(255,255,255,0.02)", border: `1px solid ${l.alert ? c.color + "25" : "rgba(255,255,255,0.04)"}` }}>
                        <span className="text-xs" style={{ color: "#B0BAD4" }}>{l.name}</span>
                        <span className="text-xs font-mono font-bold" style={{ color: l.alert ? c.color : "#9BA3BE" }}>{l.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === "molecular" && (
              <div className="space-y-5">
                {/* Key proteins */}
                <div>
                  <p className="text-xs font-mono mb-3" style={{ color: "#6B7BA0" }}>PROTEÍNAS CLAVE EN ESTE CASO</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {c.keyProteins.map((p) => (
                      <Link key={p.id} href={`/proteina/${p.id}`}
                        className="rounded-xl p-4 block transition-all hover:opacity-90"
                        style={{ background: `${p.color}0A`, border: `1px solid ${p.color}25` }}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono font-bold text-sm" style={{ color: p.color }}>{p.name}</span>
                          <span className="text-xs font-mono" style={{ color: "#6B7BA0" }}>Ver 3D ↗</span>
                        </div>
                        <p className="text-xs leading-relaxed" style={{ color: "#9BA3BE" }}>{p.role}</p>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Molecular explanation */}
                <div className="rounded-xl p-5" style={{ background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <p className="text-xs font-mono mb-3" style={{ color: c.color }}>MECANISMO MOLECULAR</p>
                  <p className="text-sm leading-relaxed" style={{ color: "#B0BAD4" }}>{c.molecular}</p>
                </div>

                {/* NP implication */}
                <div className="rounded-xl p-5" style={{ background: `${c.color}07`, border: `1px solid ${c.color}20` }}>
                  <p className="text-xs font-mono mb-2" style={{ color: c.color }}>IMPLICACIÓN EN NUTRICIÓN PARENTERAL</p>
                  <p className="text-sm leading-relaxed" style={{ color: "#B0BAD4" }}>{c.npImplication}</p>
                </div>

                <button onClick={() => setStep("management")}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
                  style={{ background: c.color, color: "#0A0A0F" }}>
                  Ver manejo clínico →
                </button>
              </div>
            )}

            {step === "management" && (
              <div className="space-y-5">
                <div>
                  <p className="text-xs font-mono mb-3" style={{ color: c.color }}>PROTOCOLO DE MANEJO EN NP</p>
                  <div className="space-y-2.5">
                    {c.management.map((m, i) => (
                      <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl"
                        style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.04)" }}>
                        <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5"
                          style={{ background: `${c.color}18`, color: c.color, fontFamily: "monospace" }}>
                          {i + 1}
                        </span>
                        <p className="text-sm leading-relaxed" style={{ color: "#B0BAD4" }}>{m}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pearl */}
                <div className="rounded-xl p-5" style={{ background: `${c.color}08`, border: `1px solid ${c.color}30` }}>
                  <p className="text-xs font-mono mb-2" style={{ color: c.color }}>💡 PERLA CLÍNICA</p>
                  <p className="text-sm leading-relaxed font-medium" style={{ color: "var(--text)" }}>{c.pearl}</p>
                </div>

                <button onClick={() => setStep("quiz")}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
                  style={{ background: c.color, color: "#0A0A0F" }}>
                  Poner a prueba lo aprendido →
                </button>
              </div>
            )}

            {step === "quiz" && (
              <div className="space-y-5">
                <div className="rounded-xl p-5" style={{ background: `${c.color}07`, border: `1px solid ${c.color}20` }}>
                  <p className="text-xs font-mono mb-3" style={{ color: c.color }}>QUIZ RÁPIDO</p>
                  <p className="text-base font-bold mb-5" style={{ color: "var(--text)" }}>{c.question}</p>
                  <div className="space-y-2.5">
                    {c.quizOptions.map((opt, i) => {
                      const isSelected = selectedAnswer === i;
                      const isCorrect = opt.correct;
                      let bg = "rgba(0,0,0,0.2)";
                      let border = "rgba(255,255,255,0.06)";
                      let textColor = "#B0BAD4";
                      if (showAnswer) {
                        if (isCorrect) { bg = "rgba(34,197,94,0.08)"; border = "#22c55e40"; textColor = "#4ade80"; }
                        else if (isSelected && !isCorrect) { bg = "rgba(239,68,68,0.08)"; border = "#ef444440"; textColor = "#ef4444"; }
                      } else if (isSelected) {
                        bg = `${c.color}10`; border = `${c.color}35`; textColor = c.color;
                      }
                      return (
                        <button key={i} onClick={() => !showAnswer && setSelectedAnswer(i)}
                          className="w-full text-left p-3.5 rounded-xl transition-all"
                          style={{ background: bg, border: `1px solid ${border}` }}>
                          <div className="flex items-start gap-3">
                            <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                              style={{ background: "rgba(255,255,255,0.05)", color: textColor, fontFamily: "monospace" }}>
                              {String.fromCharCode(65 + i)}
                            </span>
                            <div>
                              <p className="text-sm" style={{ color: textColor }}>{opt.text}</p>
                              {showAnswer && isSelected && (
                                <p className="text-xs mt-2 leading-relaxed" style={{ color: "#9BA3BE" }}>{opt.explanation}</p>
                              )}
                              {showAnswer && isCorrect && !isSelected && (
                                <p className="text-xs mt-2 leading-relaxed" style={{ color: "#9BA3BE" }}>{opt.explanation}</p>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {selectedAnswer !== null && !showAnswer && (
                    <button onClick={() => setShowAnswer(true)}
                      className="mt-4 px-5 py-2.5 rounded-xl text-sm font-bold"
                      style={{ background: c.color, color: "#0A0A0F" }}>
                      Ver respuesta
                    </button>
                  )}
                  {showAnswer && (
                    <div className="mt-4 flex gap-3">
                      <button onClick={() => { setSelectedAnswer(null); setShowAnswer(false); }}
                        className="px-4 py-2 rounded-xl text-sm font-bold"
                        style={{ background: "rgba(255,255,255,0.05)", color: "#B0BAD4" }}>
                        Intentar de nuevo
                      </button>
                      <Link href={`/proteina/${c.keyProteins[0]?.id}`}
                        className="px-4 py-2 rounded-xl text-sm font-bold"
                        style={{ background: `${c.color}12`, color: c.color, border: `1px solid ${c.color}25` }}>
                        Ver proteína en 3D →
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
