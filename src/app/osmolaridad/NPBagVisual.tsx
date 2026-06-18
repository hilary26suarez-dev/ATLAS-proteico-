"use client";

import { type ReactElement, useState } from "react";

const LAYERS = [
  { id: "agua",      label: "Agua estéril",      pct: 55, color: "#4A9EFF", icon: "💧", osmPct: 0,  desc: "Base de toda NP. Agua para inyección libre de pirógenos. Ajusta el volumen total y la osmolaridad final por dilución." },
  { id: "dextrosa",  label: "Dextrosa",           pct: 20, color: "#f5a623", icon: "🍬", osmPct: 52, desc: "Principal fuente calórica. D70% = 3,500 mOsm/L puro — es el componente que más eleva la osmolaridad de la mezcla." },
  { id: "aa",        label: "Aminoácidos",         pct: 10, color: "#A855F7", icon: "🧬", osmPct: 25, desc: "Fuente de nitrógeno. Cada gramo aporta ~8 mOsm/L. Leucina activa mTORC1. Glutamina protege la mucosa intestinal." },
  { id: "lipidos",   label: "Lípidos (emulsión)",  pct: 8,  color: "#00FF88", icon: "🫧", osmPct: 3,  desc: "Isotónica gracias al glicerol. SMOFlipid incluye omega-3 (DHA/EPA) con efecto antiinflamatorio. Mínima contribución osmolar." },
  { id: "electro",   label: "Electrolitos",         pct: 5,  color: "#FF6B9D", icon: "⚡", osmPct: 16, desc: "NaCl + KCl + MgSO₄ + fosfato. Cada mEq de sal monovalente = 2 mOsm. Calcio y fosfato requieren manejo especial (precipitación)." },
  { id: "vitoligo",  label: "Vitaminas & Oligos",   pct: 2,  color: "#FF8C42", icon: "🌱", osmPct: 4,  desc: "Vitaminas A, D, E, K, B, C + Zn, Cu, Se, Mn, Cr. Cofactores de enzimas antioxidantes (GPX4, SOD1, SOD2). Aporte osmolar despreciable." },
];

export default function NPBagVisual() {
  const [active, setActive] = useState<string | null>(null);
  const activeLayer = LAYERS.find((l) => l.id === active);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start">

      {/* SVG Bolsa */}
      <div className="flex flex-col items-center">
        <svg viewBox="0 0 200 340" className="w-56 mx-auto" role="img" aria-label="Bolsa de Nutrición Parenteral">
          {/* Colilla superior */}
          <rect x="82" y="8" width="36" height="14" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="1" />
          <rect x="92" y="5" width="16" height="10" rx="3" fill="#0f172a" stroke="#334155" strokeWidth="1" />
          {/* Gancho */}
          <path d="M100 5 Q100 -2 107 -2 Q114 -2 114 5" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round" />

          {/* Cuerpo de la bolsa */}
          <rect x="20" y="20" width="160" height="270" rx="20" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />

          {/* Capas apiladas de abajo hacia arriba */}
          {LAYERS.slice().reverse().reduce<{ layers: ReactElement[]; cumY: number }>(
            (acc, layer, i) => {
              const totalHeight = 250;
              const layerH = Math.round((layer.pct / 100) * totalHeight);
              const y = 24 + (totalHeight - acc.cumY - layerH);
              const isActive = active === layer.id;
              const rx = i === 0 ? "0 0 16 16" : "0";
              acc.layers.push(
                <g key={layer.id} style={{ cursor: "pointer" }} onClick={() => setActive(active === layer.id ? null : layer.id)}>
                  <rect
                    x="22" y={y} width="156" height={layerH}
                    fill={layer.color}
                    opacity={isActive ? 0.85 : active ? 0.25 : 0.55}
                    rx={rx}
                    style={{ transition: "opacity 0.3s" }}
                  />
                  {layerH > 18 && (
                    <text x="100" y={y + layerH / 2 + 4} textAnchor="middle"
                      fontSize="9" fill="white" opacity={isActive ? 1 : active ? 0.4 : 0.9}
                      fontFamily="monospace" fontWeight="bold"
                      style={{ pointerEvents: "none", transition: "opacity 0.3s" }}>
                      {layer.label}
                    </text>
                  )}
                </g>
              );
              acc.cumY += layerH;
              return acc;
            },
            { layers: [], cumY: 0 }
          ).layers}

          {/* Borde interior */}
          <rect x="20" y="20" width="160" height="270" rx="20" fill="none" stroke="#334155" strokeWidth="1.5" />

          {/* Puerto de infusión inferior */}
          <rect x="88" y="288" width="24" height="18" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="1" />
          <rect x="94" y="304" width="12" height="20" rx="3" fill="#0f172a" stroke="#334155" strokeWidth="1" />
        </svg>

        <p className="text-xs text-center mt-3" style={{ color: "var(--text-faint)", fontFamily: "var(--font-mono, monospace)" }}>
          Toca cada capa para ver su rol
        </p>
      </div>

      {/* Leyenda y panel de información */}
      <div className="space-y-3">
        {LAYERS.map((layer) => {
          const isActive = active === layer.id;
          return (
            <button
              key={layer.id}
              onClick={() => setActive(active === layer.id ? null : layer.id)}
              className="w-full text-left rounded-xl p-4 transition-all duration-300"
              style={{
                background: isActive ? `${layer.color}12` : "var(--bg-card)",
                border: `1px solid ${isActive ? layer.color + "40" : "rgba(255,255,255,0.04)"}`,
                transform: isActive ? "translateX(4px)" : "none",
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: layer.color }} />
                <span className="text-sm font-bold" style={{ color: isActive ? layer.color : "var(--text)" }}>
                  {layer.icon} {layer.label}
                </span>
                <div className="ml-auto flex items-center gap-3">
                  <span className="text-xs" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono, monospace)" }}>
                    Vol: {layer.pct}%
                  </span>
                  {layer.osmPct > 0 && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: `${layer.color}15`, color: layer.color, fontFamily: "var(--font-mono, monospace)" }}>
                      Osm: {layer.osmPct}%
                    </span>
                  )}
                </div>
              </div>

              {isActive && (
                <p className="text-sm leading-relaxed mt-3 pl-6" style={{ color: "var(--text-muted)" }}>
                  {layer.desc}
                </p>
              )}
            </button>
          );
        })}

        {/* Barra de osmolaridad proporcional */}
        <div className="rounded-xl p-4" style={{ background: "var(--bg-raised)", border: "1px solid rgba(255,255,255,0.04)" }}>
          <p className="text-xs mb-3" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono, monospace)" }}>
            APORTE RELATIVO A OSMOLARIDAD TOTAL
          </p>
          <div className="flex h-3 rounded-full overflow-hidden gap-px">
            {LAYERS.filter((l) => l.osmPct > 0).map((l) => (
              <div key={l.id} className="transition-all duration-500"
                style={{ width: `${l.osmPct}%`, background: l.color, opacity: active && active !== l.id ? 0.25 : 1 }}
                title={`${l.label}: ${l.osmPct}% del aporte osmolar`} />
            ))}
          </div>
          <div className="flex flex-wrap gap-3 mt-2">
            {LAYERS.filter((l) => l.osmPct > 0).map((l) => (
              <span key={l.id} className="text-xs flex items-center gap-1" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono, monospace)" }}>
                <span className="w-2 h-2 rounded-full inline-block" style={{ background: l.color }} />
                {l.label.split(" ")[0]} {l.osmPct}%
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
