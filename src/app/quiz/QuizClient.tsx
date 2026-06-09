"use client";

import { useState } from "react";
import Link from "next/link";

export interface Question {
  q:      string;
  opts:   string[];
  answer: number;
  fact:   string;
  tag:    string;
}

interface Props { questions: Question[]; }

type Phase = "playing" | "answered" | "finished";

export default function QuizClient({ questions }: Props) {
  const [idx,      setIdx]      = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score,    setScore]    = useState(0);
  const [phase,    setPhase]    = useState<Phase>("playing");

  const q = questions[idx];
  const isLast = idx === questions.length - 1;

  function pick(i: number) {
    if (phase !== "playing") return;
    setSelected(i);
    setPhase("answered");
    if (i === q.answer) setScore((s) => s + 1);
  }

  function next() {
    if (isLast) {
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

  const pct = Math.round((score / questions.length) * 100);

  // ── Pantalla de resultados ───────────────────────────────────
  if (phase === "finished") {
    const grade =
      pct >= 85 ? { label: "Bioquímico experto", color: "var(--teal)" }
      : pct >= 60 ? { label: "Buen nivel", color: "var(--electric)" }
      : { label: "Sigue practicando", color: "var(--amber)" };

    return (
      <div className="flex flex-col items-center justify-center text-center py-16 px-4">
        <div className="text-6xl mb-4">🧬</div>
        <p className="text-xs tracking-[0.2em] mb-2"
          style={{ color: "var(--teal)", fontFamily: "var(--font-mono, monospace)" }}>
          RESULTADO FINAL
        </p>
        <h2 className="font-display font-black text-5xl mb-2"
          style={{ color: grade.color }}>
          {score}/{questions.length}
        </h2>
        <p className="font-display font-bold text-xl mb-1" style={{ color: "var(--text)" }}>
          {grade.label}
        </p>
        <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
          {pct}% de respuestas correctas
        </p>

        {/* Barra de score */}
        <div className="w-full max-w-xs h-2 rounded-full mb-10"
          style={{ background: "var(--bg-raised)" }}>
          <div className="h-2 rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, background: grade.color, boxShadow: `0 0 10px ${grade.color}` }} />
        </div>

        <div className="flex gap-4">
          <button onClick={restart} className="btn-primary">
            Reintentar
          </button>
          <Link href="/modules" className="btn-outline">
            Explorar Atlas
          </Link>
        </div>
      </div>
    );
  }

  // ── Pregunta activa ──────────────────────────────────────────
  return (
    <div className="w-full max-w-2xl mx-auto">

      {/* Progreso */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono, monospace)" }}>
          {idx + 1} / {questions.length}
        </span>
        <span className="text-xs px-2 py-0.5 rounded"
          style={{
            background: "var(--teal-dim)",
            color: "var(--teal)",
            border: "1px solid rgba(0,255,136,0.15)",
            fontFamily: "var(--font-mono, monospace)",
          }}>
          {q.tag}
        </span>
        <span className="text-xs" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono, monospace)" }}>
          ✓ {score} pts
        </span>
      </div>

      {/* Barra de progreso */}
      <div className="h-1 rounded-full mb-8" style={{ background: "var(--bg-raised)" }}>
        <div className="h-1 rounded-full transition-all duration-500"
          style={{
            width: `${((idx + (phase === "answered" ? 1 : 0)) / questions.length) * 100}%`,
            background: "var(--teal)",
            boxShadow: "0 0 8px rgba(0,255,136,0.4)",
          }} />
      </div>

      {/* Pregunta */}
      <h2 className="font-display font-bold text-xl sm:text-2xl mb-8 leading-snug"
        style={{ color: "var(--text)" }}>
        {q.q}
      </h2>

      {/* Opciones */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {q.opts.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect  = i === q.answer;
          const showResult = phase === "answered";

          let bg     = "var(--bg-card)";
          let border = "rgba(255,255,255,0.06)";
          let color  = "var(--text)";
          let shadow = "none";

          if (showResult) {
            if (isCorrect) {
              bg = "rgba(0,255,136,0.08)";
              border = "var(--teal)";
              color  = "var(--teal)";
              shadow = "0 0 20px rgba(0,255,136,0.15)";
            } else if (isSelected && !isCorrect) {
              bg = "rgba(255,95,80,0.08)";
              border = "#ff5f50";
              color  = "#ff5f50";
            }
          }

          return (
            <button
              key={i}
              onClick={() => pick(i)}
              disabled={phase === "answered"}
              className="p-4 rounded-xl text-left text-sm font-medium transition-all duration-200"
              style={{
                background: bg,
                border: `1px solid ${border}`,
                color,
                boxShadow: shadow,
                cursor: phase === "answered" ? "default" : "pointer",
              }}
            >
              <span className="inline-flex items-center gap-2">
                <span className="w-5 h-5 rounded flex items-center justify-center text-xs flex-shrink-0"
                  style={{
                    background: showResult && isCorrect ? "var(--teal)" :
                                showResult && isSelected ? "#ff5f50" : "rgba(255,255,255,0.06)",
                    color: showResult ? "var(--bg)" : "var(--text-muted)",
                    fontFamily: "var(--font-mono, monospace)",
                  }}>
                  {showResult && isCorrect ? "✓" : showResult && isSelected ? "✗" : String.fromCharCode(65 + i)}
                </span>
                {opt}
              </span>
            </button>
          );
        })}
      </div>

      {/* ¿Sabías que? */}
      {phase === "answered" && (
        <div className="rounded-xl p-5 mb-6" style={{
          background: "var(--bg-raised)",
          border: "1px solid rgba(0,255,136,0.10)",
        }}>
          <p className="text-xs mb-1" style={{ color: "var(--teal)", fontFamily: "var(--font-mono, monospace)" }}>
            ¿SABÍAS QUE...?
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            {q.fact}
          </p>
        </div>
      )}

      {/* Siguiente */}
      {phase === "answered" && (
        <div className="flex justify-end">
          <button onClick={next} className="btn-primary">
            {isLast ? "Ver resultado →" : "Siguiente →"}
          </button>
        </div>
      )}
    </div>
  );
}
