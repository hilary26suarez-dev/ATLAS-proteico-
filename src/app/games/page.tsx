"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Drill = {
  id: string;
  title: string;
  focus: string;
  proteinId: string;
  proteinLabel: string;
  question: string;
  choices: { text: string; correct: boolean; rationale: string }[];
};

const DRILLS: Drill[] = [
  {
    id: "d1",
    title: "Turno Critico: Balance de Oxigeno",
    focus: "Perfusion tisular en altitud",
    proteinId: "hemoglobina",
    proteinLabel: "Hemoglobina",
    question: "En un paciente hipovolemico en altitud, que variable priorizas para evaluar recuperacion temprana?",
    choices: [
      { text: "Lactato con tendencia descendente", correct: true, rationale: "Refleja mejora de perfusion y metabolismo aerobio." },
      { text: "Solo frecuencia respiratoria", correct: false, rationale: "Es util, pero insuficiente como indicador de perfusion global." },
      { text: "Temperatura aislada", correct: false, rationale: "No evalua de forma directa transporte y utilizacion de O2." },
    ],
  },
  {
    id: "d2",
    title: "Farmaco y Metabolismo",
    focus: "Interacciones en paciente polimedicado",
    proteinId: "cyp3a4",
    proteinLabel: "CYP3A4",
    question: "Antes de ajustar tratamiento en urolitiasis recurrente, que analisis minimiza riesgo farmacologico?",
    choices: [
      { text: "Revisar interacciones por via CYP3A4", correct: true, rationale: "Reduce toxicidad y evita perdida de eficacia." },
      { text: "Escalar dosis empiricamente", correct: false, rationale: "Aumenta riesgo de eventos adversos evitables." },
      { text: "Suspender toda medicacion", correct: false, rationale: "Puede comprometer control de patologias coexistentes." },
    ],
  },
  {
    id: "d3",
    title: "Defensa Antioxidante",
    focus: "Cicatrizacion postoperatoria",
    proteinId: "gpx4",
    proteinLabel: "GPX4",
    question: "Que estrategia favorece mejor reparacion en infeccion nosocomial con estres oxidativo?",
    choices: [
      { text: "Control de foco + soporte antioxidante/proteico", correct: true, rationale: "Combina control etiologico y recuperacion celular." },
      { text: "Solo analgesia y observacion", correct: false, rationale: "No corrige inflamacion ni dano oxidativo." },
      { text: "Eliminar soporte nutricional temporal", correct: false, rationale: "Perjudica cicatrizacion y respuesta inmune." },
    ],
  },
  {
    id: "d4",
    title: "Pediatria Metabolica",
    focus: "Intervencion precoz en PKU",
    proteinId: "pah",
    proteinLabel: "PAH (Fenilalanina hidroxilasa)",
    question: "En PKU neonatal la fenilalanina sube a 1240 umol/L. La enzima PAH no puede hacer su funcion porque le falta cual cofactor?",
    choices: [
      { text: "BH4 (tetrahidrobiopterina) — cofactor redox de PAH para convertir Phe en Tyr", correct: true, rationale: "PAH necesita BH4 para la hidroxilacion de Phe→Tyr. En PKU clasica la proteina PAH esta mutada; en PKU por deficit de BH4, PAH es normal pero sin cofactor. Sapropterina (BH4 sintetico) trata algunas variantes." },
      { text: "Vitamina B6 — coenzima de todas las transaminasas de aminoacidos", correct: false, rationale: "B6 (PLP) es cofactor de transaminasas como ALT/AST, no de PAH. PAH usa BH4 como donador de electrones." },
      { text: "Zinc — cofactor metaloenzimatico de PAH", correct: false, rationale: "PAH es una enzima de hierro no-hemo (Fe3+), no zinc. El hierro del sitio activo transfiere electrones durante la hidroxilacion." },
    ],
  },
  {
    id: "d5",
    title: "Neurociencia Clinica",
    focus: "Farmacos y sinapsis colinergica",
    proteinId: "ache",
    proteinLabel: "Acetilcolinesterasa (AChE)",
    question: "Un paciente con Alzheimer leve inicia donepezilo. Por que un inhibidor de AChE mejora la cognicion?",
    choices: [
      { text: "Bloquea la degradacion de acetilcolina en la sinapsis y prolonga su efecto sobre el receptor muscarinico", correct: true, rationale: "La AChE hidroliza la ACh en milisegundos. Al inhibirla, la ACh acumulada activa mas tiempo los receptores M1 corticales mejorando atencion y memoria. Este es el mecanismo de todos los inhibidores de AChE aprobados en demencia." },
      { text: "Regenera las neuronas colinergicas perdidas en el nucleo basal de Meynert", correct: false, rationale: "Los inhibidores de AChE no regeneran neuronas: actuan sobre la sinapsis residual. El nucleo basal de Meynert sigue deteriorandose; el farmaco solo compensa la perdida funcional." },
      { text: "Aumenta la sintesis de ACh elevando la colina-acetiltransferasa (ChAT)", correct: false, rationale: "Donepezilo actua aguas abajo de la sintesis: no afecta a ChAT ni a la produccion de ACh, solo inhibe su degradacion postsinaptica." },
    ],
  },
  {
    id: "d6",
    title: "Biotecnologia Aplicada",
    focus: "Terapia enzimatica de sustitucion",
    proteinId: "gba",
    proteinLabel: "Glucocerebrosidasa (GBA)",
    question: "En enfermedad de Gaucher tipo 1, la imiglucerasa (GBA recombinante) se dirige especificamente a macrofagos. Que mecanismo celular hace posible esa diana selectiva?",
    choices: [
      { text: "El receptor de manosa en macrofagos capta la enzima glicosilada con manosa terminal expuesta", correct: true, rationale: "La imiglucerasa se modifica para exponer manosa terminal en sus cadenas oligosacararidas. Los macrofagos tienen receptores de manosa (CD206) de alta afinidad: captan la enzima por endocitosis mediada por receptor y la envian al lisosoma donde actua." },
      { text: "La imiglucerasa cruza libremente cualquier membrana celular por difusion pasiva", correct: false, rationale: "Las proteinas de 67 kDa no difunden libremente a traves de membranas. Requieren un mecanismo activo de endocitosis para entrar a la celula." },
      { text: "Se une a albumina plasmatica que la lleva especificamente al higado", correct: false, rationale: "Aunque el higado tiene macrofagos (celulas de Kupffer) que captan imiglucerasa, el mecanismo es el receptor de manosa, no la union a albumina." },
    ],
  },
  {
    id: "d7",
    title: "Endocrinologia y Hueso",
    focus: "Anabolismo oseo en osteoporosis",
    proteinId: "pthr1",
    proteinLabel: "Receptor PTH tipo 1 (PTH1R)",
    question: "Por que la teriparatida (PTH 1-34) estimula la FORMACION osea si la PTH endogena elevada (hiperparatiroidismo) DESTRUYE el hueso?",
    choices: [
      { text: "La administracion intermitente (pulso diario) activa osteoblastos; la exposicion continua activa osteoclastos via RANKL", correct: true, rationale: "El PTH1R responde diferente segun el patron de estimulacion. Un pulso diario de teriparatida activa directamente la proliferacion osteoblastica (via PKA/Wnt). La exposicion continua cronifica la senalizacion RANKL, dominando la resorcion. El modo de administracion determina el efecto neto sobre el remodelado oseo." },
      { text: "La teriparatida es un antagonista del receptor PTH que bloquea la resorcion", correct: false, rationale: "Teriparatida es un agonista completo de PTH1R, no un antagonista. Su accion anabolica depende del patron de exposicion, no del tipo de union al receptor." },
      { text: "La teriparatida actua en un receptor diferente al de la PTH endogena", correct: false, rationale: "Ambas activan el mismo PTH1R. La diferencia esta en el patron temporal: pulsatil vs continuo, no en el receptor." },
    ],
  },
];

export default function GamesPage() {
  const [active, setActive] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResult, setShowResult] = useState(false);

  const current = DRILLS[active] ?? DRILLS[0];

  const score = useMemo(() => {
    return DRILLS.reduce((acc, drill) => {
      const selectedIndex = answers[drill.id];
      if (selectedIndex === undefined) return acc;
      return drill.choices[selectedIndex]?.correct ? acc + 100 : acc;
    }, 0);
  }, [answers]);

  const answeredCount = DRILLS.filter((d) => answers[d.id] !== undefined).length;
  const maxScore = DRILLS.length * 100;
  const scorePercent = Math.round((score / maxScore) * 100);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <section className="relative overflow-hidden pt-24 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 molecular-grid pointer-events-none opacity-70" />
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-20 left-0 w-[420px] h-[420px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(0,255,136,0.06) 0%, transparent 72%)" }}
          />
          <div
            className="absolute bottom-0 right-10 w-[360px] h-[360px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(245,166,35,0.08) 0%, transparent 75%)" }}
          />
        </div>

        <div className="relative max-w-6xl mx-auto" style={{ zIndex: 2 }}>
          <p className="text-xs tracking-[0.22em] mb-4" style={{ color: "var(--teal)", fontFamily: "var(--font-mono, monospace)" }}>
            ENTRENAMIENTO RAPIDO BASADO EN PROTEINAS
          </p>
          <h1 className="font-display font-black text-5xl sm:text-6xl leading-[0.92] tracking-tight" style={{ color: "var(--text)" }}>
            GAMES
            <br />
            <span style={{ color: "var(--amber)" }}>CON RIGOR CLINICO</span>
          </h1>
          <p className="mt-6 max-w-3xl text-base sm:text-lg leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Micro-simulaciones de 1 decision por ronda, enlazadas a proteinas reales del atlas. Sin ruido visual, con feedback util.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <span className="text-xs px-3 py-1.5 rounded-full" style={{ color: "var(--teal)", border: "1px solid rgba(0,255,136,0.24)", background: "rgba(0,255,136,0.08)", fontFamily: "var(--font-mono, monospace)" }}>
              Rondas: {DRILLS.length}
            </span>
            <span className="text-xs px-3 py-1.5 rounded-full" style={{ color: "var(--amber)", border: "1px solid rgba(245,166,35,0.24)", background: "rgba(245,166,35,0.08)", fontFamily: "var(--font-mono, monospace)" }}>
              Puntaje: {score}
            </span>
            <span className="text-xs px-3 py-1.5 rounded-full" style={{ color: "#7dd3fc", border: "1px solid rgba(125,211,252,0.24)", background: "rgba(125,211,252,0.08)", fontFamily: "var(--font-mono, monospace)" }}>
              Progreso: {answeredCount}/{DRILLS.length}
            </span>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 pb-14">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5">
          <aside className="rounded-2xl p-4 h-fit" style={{ background: "var(--bg-card)", border: "1px solid rgba(0,255,136,0.12)" }}>
            <p className="text-xs tracking-[0.18em] mb-3" style={{ color: "var(--teal)", fontFamily: "var(--font-mono, monospace)" }}>
              RONDAS DISPONIBLES
            </p>

            <div className="space-y-2">
              {DRILLS.map((drill, index) => {
                const isActive = index === active;
                const isAnswered = answers[drill.id] !== undefined;
                return (
                  <button
                    key={drill.id}
                    onClick={() => setActive(index)}
                    className="w-full text-left rounded-lg p-3 transition-all"
                    style={{
                      background: isActive ? "rgba(0,255,136,0.10)" : "rgba(255,255,255,0.02)",
                      border: isActive ? "1px solid rgba(0,255,136,0.30)" : "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <p className="text-xs" style={{ color: isActive ? "var(--teal)" : "var(--text-muted)", fontFamily: "var(--font-mono, monospace)" }}>
                      RONDA {index + 1}
                    </p>
                    <p className="text-sm font-semibold mt-1" style={{ color: "var(--text)" }}>
                      {drill.title}
                    </p>
                    <p className="text-xs mt-1" style={{ color: isAnswered ? "#22d3ee" : "var(--text-muted)" }}>
                      {isAnswered ? "Respondida" : "Pendiente"}
                    </p>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setShowResult(true)}
              disabled={answeredCount !== DRILLS.length}
              className="w-full mt-4 px-4 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50"
              style={{
                color: "#061018",
                background: "linear-gradient(135deg, #00ff88, #4a9eff)",
                fontFamily: "var(--font-mono, monospace)",
              }}
            >
              Evaluar entrenamiento
            </button>

            <Link
              href="/casos-clinicos"
              className="block text-center mt-2 px-4 py-2.5 rounded-lg text-sm"
              style={{
                color: "var(--text-muted)",
                border: "1px solid rgba(255,255,255,0.12)",
                fontFamily: "var(--font-mono, monospace)",
              }}
            >
              Ir a casos clinicos
            </Link>
          </aside>

          <main className="rounded-2xl overflow-hidden" style={{ background: "var(--bg-card)", border: "1px solid rgba(0,255,136,0.12)" }}>
            <div className="px-6 sm:px-8 py-7" style={{ background: "linear-gradient(135deg, rgba(74,158,255,0.16), rgba(245,166,35,0.08))" }}>
              <p className="text-xs tracking-[0.2em] mb-2" style={{ color: "#7dd3fc", fontFamily: "var(--font-mono, monospace)" }}>
                RONDA ACTIVA
              </p>
              <h2 className="font-display font-black text-3xl" style={{ color: "var(--text)" }}>
                {current.title}
              </h2>
              <p className="text-sm mt-2" style={{ color: "#c0cae4" }}>{current.focus}</p>
              <Link
                href={`/proteina/${current.proteinId}`}
                className="inline-block mt-3 text-xs px-3 py-1.5 rounded-lg"
                style={{
                  color: "var(--teal)",
                  border: "1px solid rgba(0,255,136,0.28)",
                  background: "rgba(0,255,136,0.08)",
                  fontFamily: "var(--font-mono, monospace)",
                }}
              >
                Proteina relacionada: {current.proteinLabel}
              </Link>
            </div>

            <div className="px-6 sm:px-8 py-7">
              <p className="text-base mb-4" style={{ color: "var(--text)" }}>
                {current.question}
              </p>

              <div className="space-y-2">
                {current.choices.map((choice, index) => {
                  const isSelected = answers[current.id] === index;
                  return (
                    <button
                      key={choice.text}
                      onClick={() => {
                        setAnswers((prev) => ({ ...prev, [current.id]: index }));
                        setShowResult(false);
                      }}
                      className="w-full text-left px-4 py-3 rounded-lg transition-all"
                      style={{
                        background: isSelected ? "rgba(245,166,35,0.10)" : "rgba(255,255,255,0.02)",
                        border: isSelected ? "1px solid rgba(245,166,35,0.28)" : "1px solid rgba(255,255,255,0.08)",
                        color: isSelected ? "#f5deb7" : "var(--text-muted)",
                      }}
                    >
                      {choice.text}
                    </button>
                  );
                })}
              </div>

              {answers[current.id] !== undefined && (
                <div className="mt-4 rounded-lg p-4" style={{ background: "rgba(74,158,255,0.09)", border: "1px solid rgba(74,158,255,0.22)" }}>
                  <p className="text-sm" style={{ color: "#cddcf6" }}>
                    {current.choices[answers[current.id]].rationale}
                  </p>
                </div>
              )}

              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setActive((prev) => Math.min(prev + 1, DRILLS.length - 1))}
                  className="px-4 py-2.5 rounded-lg text-sm font-semibold"
                  style={{
                    color: "var(--teal)",
                    border: "1px solid rgba(0,255,136,0.28)",
                    fontFamily: "var(--font-mono, monospace)",
                  }}
                >
                  Siguiente ronda
                </button>
                <button
                  onClick={() => {
                    setAnswers({});
                    setShowResult(false);
                    setActive(0);
                  }}
                  className="px-4 py-2.5 rounded-lg text-sm font-semibold"
                  style={{
                    color: "var(--text-muted)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    fontFamily: "var(--font-mono, monospace)",
                  }}
                >
                  Reiniciar
                </button>
              </div>
            </div>
          </main>
        </div>

        {showResult && (
          <div className="max-w-6xl mx-auto mt-5 rounded-xl p-5" style={{ background: "var(--bg-card)", border: "1px solid rgba(0,255,136,0.14)" }}>
            <p className="text-xs tracking-[0.18em] mb-2" style={{ color: "var(--teal)", fontFamily: "var(--font-mono, monospace)" }}>
              RESULTADO GLOBAL DEL ENTRENAMIENTO
            </p>
            <p className="text-2xl font-display font-black" style={{ color: "var(--text)" }}>
              {score} / {maxScore} puntos
            </p>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
              Precision estimada: {scorePercent}%
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
