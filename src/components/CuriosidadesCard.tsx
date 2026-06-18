"use client";

import { useState } from "react";
import { CURIOSIDADES } from "@/data/curiosidades";

interface Props {
  proteinId: string;
  color?: string;
}

export default function CuriosidadesCard({ proteinId, color = "var(--teal)" }: Props) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const facts = CURIOSIDADES[proteinId];
  if (!facts || facts.length === 0) return null;

  return (
    <div className="rounded-2xl overflow-hidden mb-6"
      style={{ border: `1px solid ${color}18`, background: "var(--bg-card)" }}>
      <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: `1px solid ${color}14` }}>
        <span className="text-lg">🧪</span>
        <h3 className="font-bold text-sm" style={{ color }}>Datos que todo bioquímico debe saber</h3>
        <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-mono"
          style={{ background: `${color}12`, color }}>
          {facts.length} datos
        </span>
      </div>

      <div className="divide-y" style={{ borderColor: `${color}10` }}>
        {facts.map((f, i) => (
          <button key={i} onClick={() => setExpanded(expanded === i ? null : i)}
            className="w-full text-left px-5 py-4 transition-colors hover:bg-white/[0.02]">
            <div className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0 mt-0.5">{f.icon}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm leading-relaxed transition-all duration-300 ${expanded === i ? "" : "line-clamp-2"}`}
                  style={{ color: expanded === i ? "var(--text)" : "var(--text-muted)" }}>
                  {f.fact}
                </p>
                {expanded === i && (
                  <p className="text-xs mt-2 font-mono" style={{ color: "var(--text-faint)" }}>
                    Fuente: {f.source}
                  </p>
                )}
              </div>
              <span className="text-xs flex-shrink-0 mt-1" style={{ color: "var(--text-faint)" }}>
                {expanded === i ? "▲" : "▼"}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
