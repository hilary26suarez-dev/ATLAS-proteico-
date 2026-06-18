"use client";

import { useState } from "react";
import CaPhosSim from "./CaPhosSim";
import EmulsionSim from "./EmulsionSim";
import FarmacoSim from "./FarmacoSim";

const TABS = [
  {
    id: "cafos",
    icon: "⚗️",
    label: "Ca²⁺ / Fosfato",
    sublabel: "Precipitación",
    color: "#f5a623",
    audience: "Farmacia · Medicina",
    intro: "La precipitación de fosfato de calcio es la complicación farmacéutica mortal más crítica en NP. Manipula las concentraciones y observa en tiempo real cómo los iones se atraen, forman cristales y bloquean el filtro de infusión.",
  },
  {
    id: "emulsion",
    icon: "🫧",
    label: "Emulsión Lipídica",
    sublabel: "Coalescencia",
    color: "#00FF88",
    audience: "Enfermería · Medicina",
    intro: "Las emulsiones 3 en 1 (AIO) son termodinámicamente inestables. Los cationes divalentes neutralizan la carga negativa protectora de los fosfolípidos → las gotas se fusionan → la emulsión se rompe. Observa el proceso en tiempo real.",
  },
  {
    id: "farmaco",
    icon: "💉",
    label: "Compatibilidad",
    sublabel: "Fármacos en NP",
    color: "#a78bfa",
    audience: "Farmacia · Enfermería",
    intro: "La insulina y otros medicamentos se adsorben silenciosamente a las paredes de PVC de los equipos de infusión. El paciente puede recibir hasta un 80% menos de la dosis real. Simula este proceso invisible.",
  },
];

export default function SimuladorClient() {
  const [activeTab, setActiveTab] = useState("cafos");
  const tab = TABS.find((t) => t.id === activeTab) ?? TABS[0];

  return (
    <div>
      {/* Tab bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className="flex-1 rounded-2xl p-4 text-left transition-all duration-300"
            style={{
              background: activeTab === t.id ? `${t.color}10` : "var(--bg-card)",
              border: `1px solid ${activeTab === t.id ? t.color + "35" : "rgba(255,255,255,0.05)"}`,
              transform: activeTab === t.id ? "translateY(-2px)" : "none",
            }}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{t.icon}</span>
              <span className="font-bold text-sm" style={{ color: activeTab === t.id ? t.color : "var(--text)" }}>
                {t.label}
              </span>
            </div>
            <div className="text-xs font-mono" style={{ color: activeTab === t.id ? t.color : "var(--text-faint)" }}>
              {t.sublabel}
            </div>
            <div className="text-xs mt-1" style={{ color: "var(--text-faint)" }}>
              {t.audience}
            </div>
          </button>
        ))}
      </div>

      {/* Intro banner */}
      <div className="rounded-2xl p-5 mb-8"
        style={{ background: `${tab.color}06`, border: `1px solid ${tab.color}20` }}>
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">{tab.icon}</span>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{tab.intro}</p>
        </div>
      </div>

      {/* Simulation */}
      {activeTab === "cafos"    && <CaPhosSim />}
      {activeTab === "emulsion" && <EmulsionSim />}
      {activeTab === "farmaco"  && <FarmacoSim />}
    </div>
  );
}
