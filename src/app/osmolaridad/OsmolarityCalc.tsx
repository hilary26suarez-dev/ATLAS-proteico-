"use client";

import { useState, useMemo } from "react";

interface Component {
  key: string;
  label: string;
  unit: string;
  color: string;
  defaultVal: number;
  min: number;
  max: number;
  step: number;
  toOsm: (v: number) => number;
  tooltip: string;
}

const COMPONENTS: Component[] = [
  {
    key: "dextrose",
    label: "Dextrosa",
    unit: "% concentración",
    color: "#f5a623",
    defaultVal: 20,
    min: 0, max: 70, step: 2.5,
    toOsm: (v) => v * 50,
    tooltip: "Cada 1% de dextrosa aporta ~50 mOsm/L. D70% = 3500 mOsm/L puro.",
  },
  {
    key: "aminoacids",
    label: "Aminoácidos",
    unit: "g/L",
    color: "#A855F7",
    defaultVal: 40,
    min: 0, max: 100, step: 5,
    toOsm: (v) => v * 8,
    tooltip: "Soluciones comerciales aportan ~8 mOsm por gramo de aminoácidos.",
  },
  {
    key: "nacl",
    label: "Sodio (NaCl)",
    unit: "mEq/L",
    color: "#4A9EFF",
    defaultVal: 60,
    min: 0, max: 200, step: 10,
    toOsm: (v) => v * 2,
    tooltip: "NaCl dissocia en Na⁺ + Cl⁻ → 2 partículas por mEq.",
  },
  {
    key: "kcl",
    label: "Potasio (KCl)",
    unit: "mEq/L",
    color: "#00FF88",
    defaultVal: 30,
    min: 0, max: 100, step: 5,
    toOsm: (v) => v * 2,
    tooltip: "KCl dissocia en K⁺ + Cl⁻ → 2 partículas por mEq.",
  },
  {
    key: "mg",
    label: "Magnesio (MgSO₄)",
    unit: "mEq/L",
    color: "#FF6B9D",
    defaultVal: 8,
    min: 0, max: 30, step: 2,
    toOsm: (v) => v * 2,
    tooltip: "MgSO₄ dissocia en Mg²⁺ + SO₄²⁻ → 2 partículas por mEq.",
  },
  {
    key: "phosphate",
    label: "Fosfato (KPO₄)",
    unit: "mmol/L",
    color: "#FF8C42",
    defaultVal: 10,
    min: 0, max: 40, step: 2,
    toOsm: (v) => v * 1.8,
    tooltip: "El fosfato monobásico/dibásico aporta ~1.8 mOsm/mmol en promedio.",
  },
];

function getRisk(osm: number) {
  if (osm < 600)   return { label: "Via Periférica SEGURA",        color: "#00FF88", bg: "rgba(0,255,136,0.08)", border: "rgba(0,255,136,0.25)", icon: "✅", desc: "Puede administrarse por vía periférica sin riesgo significativo de flebitis." };
  if (osm < 900)   return { label: "Periférica con PRECAUCIÓN",    color: "#f5a623", bg: "rgba(245,166,35,0.08)", border: "rgba(245,166,35,0.25)", icon: "⚠️", desc: "Periférica máximo 72h con catéter de gran calibre. Vigilar signos de flebitis. Preferir línea central." };
  if (osm < 1800)  return { label: "Requiere VÍA CENTRAL",         color: "#FF6B9D", bg: "rgba(255,107,157,0.08)", border: "rgba(255,107,157,0.25)", icon: "🚨", desc: "Obligatorio acceso central (PICC, subclavia, yugular). Riesgo grave de necrosis venosa periférica." };
  return            { label: "ALTAMENTE HIPERTÓNICA · Solo CVC",   color: "#ff4444", bg: "rgba(255,68,68,0.08)",  border: "rgba(255,68,68,0.25)", icon: "⛔", desc: "Extremadamente hipertónica. Solo catéter venoso central con punta en vena cava superior confirmada por Rx." };
}

export default function OsmolarityCalc() {
  const [vals, setVals] = useState<Record<string, number>>(
    Object.fromEntries(COMPONENTS.map((c) => [c.key, c.defaultVal]))
  );
  const [tooltip, setTooltip] = useState<string | null>(null);

  const contributions = useMemo(() =>
    COMPONENTS.map((c) => ({ ...c, osm: c.toOsm(vals[c.key]) })),
    [vals]
  );

  const total = useMemo(() => contributions.reduce((s, c) => s + c.osm, 0), [contributions]);
  const risk  = getRisk(total);
  const maxOsm = Math.max(total, 100);

  return (
    <div className="space-y-8">

      {/* Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {COMPONENTS.map((c) => {
          const osm = c.toOsm(vals[c.key]);
          return (
            <div key={c.key} className="rounded-xl p-5"
              style={{ background: "var(--bg-raised)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ background: c.color, boxShadow: `0 0 6px ${c.color}60` }} />
                  <span className="text-sm font-bold" style={{ color: "var(--text)" }}>{c.label}</span>
                  <button
                    className="w-4 h-4 rounded-full text-xs flex items-center justify-center cursor-help"
                    style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-muted)" }}
                    onMouseEnter={() => setTooltip(c.key)}
                    onMouseLeave={() => setTooltip(null)}
                  >?</button>
                </div>
                <div className="text-right">
                  <span className="text-base font-black font-mono" style={{ color: c.color }}>
                    {vals[c.key]}{c.unit.includes("%") ? "%" : ""}
                  </span>
                  <span className="text-xs ml-1" style={{ color: "var(--text-muted)" }}>{c.unit.includes("%") ? "" : c.unit}</span>
                </div>
              </div>

              {tooltip === c.key && (
                <p className="text-xs mb-3 px-3 py-2 rounded-lg"
                  style={{ background: "rgba(0,0,0,0.3)", color: "var(--text-muted)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  {c.tooltip}
                </p>
              )}

              <input
                type="range"
                min={c.min} max={c.max} step={c.step}
                value={vals[c.key]}
                onChange={(e) => setVals((v) => ({ ...v, [c.key]: Number(e.target.value) }))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer mb-2"
                style={{ accentColor: c.color, background: `linear-gradient(to right, ${c.color} 0%, ${c.color} ${((vals[c.key] - c.min) / (c.max - c.min)) * 100}%, rgba(255,255,255,0.08) ${((vals[c.key] - c.min) / (c.max - c.min)) * 100}%, rgba(255,255,255,0.08) 100%)` }}
              />

              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="h-1 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((osm / maxOsm) * 100, 100)}%`, background: c.color, opacity: 0.7 }} />
                </div>
                <span className="text-xs font-mono w-20 text-right" style={{ color: c.color }}>
                  +{Math.round(osm)} mOsm/L
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Resultado */}
      <div className="rounded-2xl p-6 md:p-8"
        style={{ background: risk.bg, border: `1px solid ${risk.border}` }}>
        <div className="flex flex-col md:flex-row md:items-center gap-6">

          {/* Número grande */}
          <div className="text-center md:text-left flex-shrink-0">
            <p className="text-xs tracking-widest mb-1" style={{ color: risk.color, fontFamily: "var(--font-mono, monospace)" }}>
              OSMOLARIDAD TOTAL
            </p>
            <div className="font-display font-black" style={{ fontSize: "clamp(3rem,8vw,5rem)", color: risk.color, lineHeight: 1 }}>
              {Math.round(total)}
            </div>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono, monospace)" }}>mOsm/L</p>
          </div>

          {/* Separador */}
          <div className="hidden md:block w-px h-20 opacity-20" style={{ background: risk.color }} />

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{risk.icon}</span>
              <span className="font-bold text-base" style={{ color: risk.color }}>{risk.label}</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{risk.desc}</p>
          </div>
        </div>

        {/* Barra de distribución */}
        <div className="mt-6">
          <p className="text-xs mb-2" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono, monospace)" }}>DISTRIBUCIÓN POR COMPONENTE</p>
          <div className="flex h-4 rounded-full overflow-hidden gap-px">
            {contributions.filter(c => c.osm > 0).map((c) => (
              <div key={c.key}
                title={`${c.label}: ${Math.round(c.osm)} mOsm/L (${Math.round((c.osm / total) * 100)}%)`}
                className="transition-all duration-500"
                style={{ width: `${(c.osm / total) * 100}%`, background: c.color, minWidth: "2px" }} />
            ))}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
            {contributions.filter(c => c.osm > 0).map((c) => (
              <span key={c.key} className="text-xs flex items-center gap-1"
                style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono, monospace)" }}>
                <span className="w-2 h-2 rounded-full inline-block" style={{ background: c.color }} />
                {c.label} {Math.round((c.osm / total) * 100)}%
              </span>
            ))}
          </div>
        </div>

        {/* Escala de referencia */}
        <div className="mt-6 relative">
          <div className="flex h-2 rounded-full overflow-hidden">
            <div className="h-2" style={{ width: "33%", background: "linear-gradient(to right, #00FF88, #f5a623)" }} />
            <div className="h-2" style={{ width: "22%", background: "linear-gradient(to right, #f5a623, #FF6B9D)" }} />
            <div className="h-2" style={{ width: "45%", background: "linear-gradient(to right, #FF6B9D, #ff4444)" }} />
          </div>
          <div className="flex justify-between text-xs mt-1" style={{ color: "var(--text-faint)", fontFamily: "var(--font-mono, monospace)" }}>
            <span>0</span><span>600</span><span>900</span><span>1800+</span>
          </div>
          {/* Marcador */}
          <div className="absolute top-0 w-0.5 h-2 -translate-x-1/2 rounded-full"
            style={{
              left: `${Math.min((total / 1800) * 100, 100)}%`,
              background: "white",
              boxShadow: "0 0 6px rgba(255,255,255,0.6)",
            }} />
        </div>
      </div>
    </div>
  );
}
