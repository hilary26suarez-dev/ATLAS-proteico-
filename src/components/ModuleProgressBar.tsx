"use client";

import { useProgress } from "@/hooks/useProgress";

interface Props {
  proteinIds: string[];
  color: string;
  showLabel?: boolean;
}

export default function ModuleProgressBar({ proteinIds, color, showLabel = true }: Props) {
  const { moduleProgress, ready } = useProgress();
  const visited = moduleProgress(proteinIds);
  const total   = proteinIds.length;
  const pct     = total > 0 ? Math.round((visited / total) * 100) : 0;

  if (!ready) return null;

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono, monospace)" }}>
            Progreso del módulo
          </span>
          <span className="text-xs font-bold" style={{ color, fontFamily: "var(--font-mono, monospace)" }}>
            {visited}/{total}
          </span>
        </div>
      )}
      <div className="h-1 rounded-full w-full" style={{ background: "rgba(255,255,255,0.06)" }}>
        <div
          className="h-1 rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: color,
            boxShadow: pct > 0 ? `0 0 8px ${color}60` : "none",
          }}
        />
      </div>
    </div>
  );
}
