"use client";

import { useState, useMemo } from "react";
import { useProgress } from "@/hooks/useProgress";

interface Question {
  q: string;
  opts: string[];
  answer: number;
  fact: string;
}

type Phase = "playing" | "answered" | "finished";

const QUESTIONS_BY_MODULE: Record<string, Question[]> = {
  "canal-alimentacion": [
    {
      q: "¿Cuál transportador de glucosa es insulino-independiente y protege al cerebro durante la hipoglucemia?",
      opts: ["GLUT4", "GLUT1", "SGLT1", "GLUT2"],
      answer: 1,
      fact: "GLUT1 garantiza que el cerebro reciba glucosa sin importar la insulina. En NP con hipoglucemia, es la primera línea de protección cerebral.",
    },
    {
      q: "Al iniciar NP con glucosa + insulina, ¿qué transportador capta fosfato hacia la célula y puede causar síndrome de realimentación?",
      opts: ["SGLT1", "MCT1", "PiT-1", "LAT1"],
      answer: 2,
      fact: "PiT-1 cotransporta fosfato con Na⁺. Cuando la insulina sube al iniciar NP, PiT-1 captura fosfato masivamente, vaciando el plasma: hipofosfatemia grave.",
    },
    {
      q: "¿Qué transportador del intestino delgado confirma la transición exitosa de NP a nutrición enteral?",
      opts: ["GLUT1", "GLUT4", "LAT1", "SGLT1"],
      answer: 3,
      fact: "SGLT1 cotransporta Na⁺ y glucosa en el enterocito. Su activación funcional marca que el intestino tolera glucosa enteral y la NP puede reducirse.",
    },
  ],
  "laboratorio-hepatico": [
    {
      q: "¿Qué enzima hepática convierte el exceso de glucosa en NP en triglicéridos (lipogénesis de novo)?",
      opts: ["GCK", "CPT1A", "FASN", "CPS1"],
      answer: 2,
      fact: "El exceso de glucosa activa FASN vía SREBP-1c. Esto genera esteatosis hepática asociada a NP, la complicación hepática más frecuente.",
    },
    {
      q: "¿Qué biomarcador sube en plasma cuando CPS1 no puede manejar el alto aporte proteico de la NP?",
      opts: ["Glucosa", "Triglicéridos", "Amoniaco (NH₃)", "Bilirrubina"],
      answer: 2,
      fact: "CPS1 es el primer paso del ciclo de la urea. Con >2 g/kg/día de proteínas en NP y función hepática comprometida, el NH₃ sube y puede causar encefalopatía.",
    },
    {
      q: "En NP, ¿qué elevación de ALT indica hepatotoxicidad y obliga a revisar la fórmula?",
      opts: ["1× el límite normal", "3× el límite normal", "10× el límite normal", "No importa el valor"],
      answer: 1,
      fact: "ALT >3× LSN durante NP es criterio para ajustar la fórmula. La causa más común es sobrecarga de glucosa con lipogénesis hepática excesiva.",
    },
  ],
  "sistema-defensa": [
    {
      q: "¿Qué enzima necesita selenio como cofactor y su déficit en NP sin oligoelementos activa la ferroptosis?",
      opts: ["SOD1", "Catalasa", "GPX4", "NOX2"],
      answer: 2,
      fact: "GPX4 es la única enzima que neutraliza fosfolípidos peroxidados en membrana. Su déficit (sin selenio en NP) activa ferroptosis — muerte celular por peroxidación lipídica.",
    },
    {
      q: "¿Dónde está SOD2 y qué oligoelemento de NP es su cofactor?",
      opts: ["Citoplasma · Zinc", "Matriz mitocondrial · Manganeso", "Núcleo · Cobre", "Peroxisoma · Hierro"],
      answer: 1,
      fact: "SOD2 neutraliza el superóxido mitocondrial. NP crónica sin Mn reduce SOD2 y aumenta el daño oxidativo mitocondrial, documentado en pacientes pediátricos.",
    },
    {
      q: "¿Qué factor de transcripción activan los antioxidantes (vitamina C, NAC) en NP, protegiendo contra el estrés oxidativo?",
      opts: ["NOX2", "GSTP1", "NRF2", "GPX4"],
      answer: 2,
      fact: "NRF2 es el 'maestro antioxidante'. Las formulaciones de NP con antioxidantes lo activan, induciendo decenas de genes protectores en pacientes críticos.",
    },
  ],
  "senalizacion-hormonal": [
    {
      q: "¿Qué proteína de vida media 2-3 días se usa como marcador de síntesis proteica de respuesta rápida en NP?",
      opts: ["Albúmina", "Prealbúmina (TTR)", "Transferrina", "PCR"],
      answer: 1,
      fact: "TTR tiene vida media de 2-3 días vs 21 días de la albúmina. Es mucho más útil para detectar cambios nutricionales en los primeros días de NP.",
    },
    {
      q: "¿Por qué la albúmina baja (<3.5 g/dL) no refleja el estado nutricional agudo en pacientes críticos con NP?",
      opts: ["Porque no existe como proteína", "Porque su vida media de 21 días no refleja cambios recientes", "Porque se degrada en el riñón", "Porque no se mide en plasma"],
      answer: 1,
      fact: "La IL-6 en inflamación aguda suprime la síntesis de albúmina. La hipoalbuminemia refleja inflamación más que desnutrición real.",
    },
    {
      q: "¿Por qué la leucina en las soluciones de aminoácidos de NP es especialmente importante para preservar masa muscular?",
      opts: ["Activa FASN hepática", "Activa mTORC1 → síntesis proteica muscular", "Inhibe el glucagón", "Transporta ácidos grasos en sangre"],
      answer: 1,
      fact: "La leucina activa mTORC1 → fosforila S6K1 → inicia síntesis proteica. Por esto los BCAA (especialmente leucina) son clave en NP para evitar catabolismo.",
    },
  ],
};

interface Props {
  moduleId: string;
  proteinName: string;
  color: string;
}

export default function MiniQuiz({ moduleId, proteinName, color }: Props) {
  const questions = useMemo(() => QUESTIONS_BY_MODULE[moduleId] ?? [], [moduleId]);
  const [open,     setOpen]     = useState(false);
  const [idx,      setIdx]      = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score,    setScore]    = useState(0);
  const [phase,    setPhase]    = useState<Phase>("playing");
  const { saveQuizScore }       = useProgress();

  if (questions.length === 0) return null;

  function pick(i: number) {
    if (phase !== "playing") return;
    setSelected(i);
    setPhase("answered");
    if (i === questions[idx].answer) setScore((s) => s + 1);
  }

  function next() {
    if (idx === questions.length - 1) {
      const finalScore = score + (selected === questions[idx].answer ? 1 : 0);
      saveQuizScore(finalScore, questions.length);
      setPhase("finished");
    } else {
      setIdx((i) => i + 1);
      setSelected(null);
      setPhase("playing");
    }
  }

  function restart() {
    setIdx(0);
    setSelected(null);
    setScore(0);
    setPhase("playing");
  }

  const q = questions[idx];
  const finalScore = phase === "finished" ? score : score;
  const pct = Math.round((finalScore / questions.length) * 100);

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ border: `1px solid ${color}25`, background: `${color}05` }}>

      {/* Header / toggle */}
      <button
        className="w-full flex items-center justify-between px-6 py-4 text-left transition-all"
        onClick={() => setOpen((o) => !o)}
        style={{ background: open ? `${color}08` : "transparent" }}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">🧠</span>
          <div>
            <p className="font-display font-bold text-sm" style={{ color }}>
              Evalúa tu comprensión
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {questions.length} preguntas sobre {proteinName} y su módulo
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {phase === "finished" && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ background: `${color}15`, color, fontFamily: "var(--font-mono, monospace)" }}>
              {finalScore}/{questions.length}
            </span>
          )}
          <svg
            className={`w-4 h-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
            style={{ color: "var(--text-muted)" }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Contenido */}
      {open && (
        <div className="px-6 pb-6 pt-2 border-t" style={{ borderColor: `${color}15` }}>

          {phase === "finished" ? (
            <div className="text-center py-6">
              <div className="text-5xl mb-3">
                {pct >= 85 ? "🏆" : pct >= 60 ? "👍" : "📚"}
              </div>
              <p className="font-display font-black text-3xl mb-1" style={{ color }}>
                {finalScore}/{questions.length}
              </p>
              <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
                {pct >= 85 ? "Excelente dominio del tema" : pct >= 60 ? "Buen nivel — sigue practicando" : "Repasa la sección y vuelve a intentarlo"}
              </p>
              <div className="flex gap-3 justify-center">
                <button onClick={restart} className="btn-primary text-sm">
                  Repetir quiz
                </button>
                <a href="/quiz" className="btn-outline text-sm">
                  Quiz completo (20 preguntas) →
                </a>
              </div>
            </div>
          ) : (
            <>
              {/* Progreso */}
              <div className="flex items-center justify-between mt-4 mb-3">
                <span className="text-xs" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono, monospace)" }}>
                  {idx + 1}/{questions.length}
                </span>
                <span className="text-xs" style={{ color, fontFamily: "var(--font-mono, monospace)" }}>
                  ✓ {score} pts
                </span>
              </div>
              <div className="h-1 rounded-full mb-5" style={{ background: "rgba(255,255,255,0.06)" }}>
                <div className="h-1 rounded-full transition-all"
                  style={{ width: `${((idx + (phase === "answered" ? 1 : 0)) / questions.length) * 100}%`, background: color }} />
              </div>

              {/* Pregunta */}
              <p className="font-bold text-base mb-5 leading-snug" style={{ color: "var(--text)" }}>
                {q.q}
              </p>

              {/* Opciones */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                {q.opts.map((opt, i) => {
                  const isSel     = selected === i;
                  const isCorrect = i === q.answer;
                  const show      = phase === "answered";
                  let bg     = "var(--bg-raised)";
                  let border = "rgba(255,255,255,0.06)";
                  let txtCol = "var(--text)";
                  if (show && isCorrect) { bg = "rgba(0,255,136,0.08)"; border = "var(--teal)"; txtCol = "var(--teal)"; }
                  else if (show && isSel) { bg = "rgba(255,95,80,0.08)"; border = "#ff5f50"; txtCol = "#ff5f50"; }
                  return (
                    <button key={i} onClick={() => pick(i)} disabled={phase === "answered"}
                      className="p-3 rounded-xl text-left text-sm transition-all duration-200"
                      style={{ background: bg, border: `1px solid ${border}`, color: txtCol, cursor: phase === "answered" ? "default" : "pointer" }}>
                      <span className="inline-flex items-center gap-2">
                        <span className="w-5 h-5 rounded flex items-center justify-center text-xs flex-shrink-0 font-mono"
                          style={{ background: show && isCorrect ? "var(--teal)" : show && isSel ? "#ff5f50" : "rgba(255,255,255,0.06)", color: show ? "var(--bg)" : "var(--text-muted)" }}>
                          {show && isCorrect ? "✓" : show && isSel ? "✗" : String.fromCharCode(65 + i)}
                        </span>
                        {opt}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Dato clínico */}
              {phase === "answered" && (
                <div className="rounded-xl p-4 mb-4" style={{ background: "var(--bg-raised)", border: "1px solid rgba(0,255,136,0.10)" }}>
                  <p className="text-xs mb-1" style={{ color: "var(--teal)", fontFamily: "var(--font-mono, monospace)" }}>¿SABÍAS QUE...?</p>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{q.fact}</p>
                </div>
              )}

              {phase === "answered" && (
                <div className="flex justify-end">
                  <button onClick={next} className="btn-primary text-sm">
                    {idx === questions.length - 1 ? "Ver resultado →" : "Siguiente →"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
