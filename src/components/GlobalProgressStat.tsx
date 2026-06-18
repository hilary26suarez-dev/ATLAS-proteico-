"use client";

import { useProgress } from "@/hooks/useProgress";

interface Props {
  totalProteins: number;
}

export default function GlobalProgressStat({ totalProteins }: Props) {
  const { state, ready } = useProgress();
  const visited = state.visited.length;

  if (!ready || visited === 0) return null;

  const pct = Math.round((visited / totalProteins) * 100);

  return (
    <div className="mt-5 pt-5 border-t" style={{ borderColor: "rgba(0,255,136,0.08)" }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono, monospace)" }}>
          TU PROGRESO
        </span>
        <span className="text-xs font-bold" style={{ color: "var(--teal)", fontFamily: "var(--font-mono, monospace)" }}>
          {visited}/{totalProteins} proteínas
        </span>
      </div>
      <div className="h-1 rounded-full" style={{ background: "rgba(0,255,136,0.08)" }}>
        <div className="h-1 rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: "var(--teal)", boxShadow: "0 0 8px rgba(0,255,136,0.4)" }} />
      </div>
      {state.quizBest !== null && (
        <p className="text-xs mt-2" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono, monospace)" }}>
          Quiz: mejor puntaje{" "}
          <span style={{ color: "var(--teal)" }}>
            {state.quizBest}/{state.quizTotal}
          </span>
        </p>
      )}
    </div>
  );
}
