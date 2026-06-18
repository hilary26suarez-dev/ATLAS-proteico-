"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const DockingViewer3D = dynamic(() => import("./DockingViewer3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center" style={{ background: "#07080F" }}>
      <div style={{ width: 36, height: 36, borderRadius: "50%", border: "2px solid rgba(0,255,136,0.1)", borderTopColor: "var(--teal)", animation: "hero-spin 0.9s linear infinite" }} />
    </div>
  ),
});

const COMPLEXES = [
  {
    id: "albumin-myristic",
    pdbId: "1AO6",
    protein: "Albúmina sérica humana (HSA)",
    proteinShort: "Albúmina",
    ligand: "Ácido mirístico (MYR · C14:0)",
    ligandShort: "Ac. mirístico",
    kcalMol: -7.8,
    site: "Sudlow Site II · Dominio IIIA",
    resolution: "2.50 Å",
    method: "X-Ray",
    color: "#00FF88",
    icon: "🩸",
    clinicalNote: "Transportador universal de ácidos grasos. Las emulsiones lipídicas de NP saturan estos sitios, desplazando fármacos co-administrados como warfarina o diazepam.",
    tags: ["Albúmina", "Lípidos NP", "Transporte"],
  },
  {
    id: "albumin-warfarin",
    pdbId: "2BXD",
    protein: "Albúmina sérica humana (HSA)",
    proteinShort: "Albúmina",
    ligand: "Warfarina",
    ligandShort: "Warfarina",
    kcalMol: -9.1,
    site: "Sudlow Site I · Dominio IIA",
    resolution: "2.45 Å",
    method: "X-Ray",
    color: "#f87171",
    icon: "💊",
    clinicalNote: "Alta afinidad (ΔG < −9). La coadministración de lípidos en NP puede desplazar la warfarina de su sitio, aumentando la fracción libre y el riesgo de sangrado.",
    tags: ["Anticoagulante", "Interacción NP", "Fracción libre"],
  },
  {
    id: "transthyretin-retinol",
    pdbId: "1RLB",
    protein: "Transtirretina (TTR)",
    proteinShort: "Transtirretina",
    ligand: "Retinol (Vitamina A)",
    ligandShort: "Vitamina A",
    kcalMol: -8.4,
    site: "Canal central hidrofóbico",
    resolution: "1.80 Å",
    method: "X-Ray",
    color: "#fbbf24",
    icon: "🌟",
    clinicalNote: "TTR forma complejo con RBP4 para transportar retinol. En desnutrición severa (NP inicial), los niveles de TTR caen < 10 mg/dL, reduciendo el transporte de vitamina A.",
    tags: ["Vitamina A", "Marcador nutricional", "Déficit en NP"],
  },
  {
    id: "insulin-receptor",
    pdbId: "3LOH",
    protein: "Receptor de insulina (INSR · dominio α)",
    proteinShort: "Receptor insulina",
    ligand: "Insulina humana",
    ligandShort: "Insulina",
    kcalMol: -11.2,
    site: "Sitio L1 + dominio fibronectina-III",
    resolution: "3.80 Å",
    method: "X-Ray",
    color: "#60a5fa",
    icon: "💉",
    clinicalNote: "Fundamental en NP: la hiperglucemia persistente > 180 mg/dL triplica la mortalidad en UCI. El complejo insulina-INSR es el objetivo terapéutico del protocolo de insulina en infusión.",
    tags: ["Insulina NP", "Glucemia UCI", "Señalización"],
  },
  {
    id: "gpx4-glutathione",
    pdbId: "2OBI",
    protein: "Glutatión peroxidasa 4 (GPX4)",
    proteinShort: "GPX4",
    ligand: "Glutatión (GSH)",
    ligandShort: "Glutatión",
    kcalMol: -6.9,
    site: "Sitio activo con selenocisteína (Sec46)",
    resolution: "2.05 Å",
    method: "X-Ray",
    color: "#a78bfa",
    icon: "🛡️",
    clinicalNote: "GPX4 protege las membranas lipídicas de la peroxidación. El selenio en NP es esencial para su actividad. Déficit de Se → ferroptosis → disfunción orgánica múltiple.",
    tags: ["Selenio NP", "Antioxidante", "Ferroptosis"],
  },
  {
    id: "cyp3a4-vitamin-d",
    pdbId: "1W0F",
    protein: "CYP3A4 (Citocromo P450 3A4)",
    proteinShort: "CYP3A4",
    ligand: "Metopirone (inhibidor · análogo de VD3)",
    ligandShort: "Inh. CYP3A4",
    kcalMol: -8.7,
    site: "Cámara activa sobre hemo-Fe",
    resolution: "2.05 Å",
    method: "X-Ray",
    color: "#34d399",
    icon: "☀️",
    clinicalNote: "CYP3A4 activa vitamina D (25-OH-D → 1,25-OH₂-D). Fármacos en NP que inhiben CYP3A4 (azoles, macrólidos) reducen la activación de VD3, agravando déficit en pacientes críticos.",
    tags: ["Vitamina D", "CYP450", "Interacciones fármacos"],
  },
];

export default function DockingPageClient() {
  const [selected, setSelected] = useState(COMPLEXES[0]);

  // Precarga en background para poblar la caché del navegador
  useEffect(() => {
    COMPLEXES.forEach((c) => {
      fetch(`https://files.rcsb.org/download/${c.pdbId}.pdb`, { cache: "force-cache" }).catch(() => {});
    });
  }, []);

  const maxKcal = Math.max(...COMPLEXES.map((c) => Math.abs(c.kcalMol)));

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <p className="text-xs tracking-[0.2em] mb-2" style={{ color: "var(--electric)", fontFamily: "var(--font-mono, monospace)" }}>
            VISOR INTERACTIVO · COMPLEJOS PROTEÍNA-LIGANDO
          </p>
          <h2 className="font-display font-black text-4xl" style={{ color: "var(--text)" }}>
            Estructuras reales del PDB.
          </h2>
          <p className="text-sm mt-2" style={{ color: "#B0BAD4" }}>
            Selecciona un complejo para visualizarlo en 3D. Datos cristalográficos reales descargados en tiempo real.
          </p>
        </div>

        {/* Complex selector pills */}
        <div className="flex flex-wrap gap-2">
          {COMPLEXES.map((c) => (
            <button key={c.id} onClick={() => setSelected(c)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{
                background: selected.id === c.id ? `${c.color}10` : "#111118",
                border: `1px solid ${selected.id === c.id ? c.color + "40" : "rgba(255,255,255,0.06)"}`,
                color: selected.id === c.id ? c.color : "#6B7BA0",
                boxShadow: selected.id === c.id ? `0 0 20px ${c.color}10` : "none",
              }}>
              <span>{c.icon}</span>
              <span>{c.proteinShort}</span>
              <span className="text-xs opacity-70">+ {c.ligandShort}</span>
            </button>
          ))}
        </div>

        {/* Main layout: viewer + info */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">

          {/* Viewer */}
          <div className="rounded-2xl overflow-hidden"
            style={{ height: 500, border: `1px solid ${selected.color}25`, boxShadow: `0 0 40px ${selected.color}08` }}>
            <DockingViewer3D
              key={selected.pdbId}
              pdbId={selected.pdbId}
              showLigands={true}
              proteinName={selected.proteinShort}
              ligandName={selected.ligandShort}
              kcalMol={selected.kcalMol}
              resolution={selected.resolution}
              method={selected.method}
            />
          </div>

          {/* Info panel */}
          <div className="space-y-4">
            {/* Title */}
            <div className="rounded-xl p-5" style={{ background: "#111118", border: `1px solid ${selected.color}20` }}>
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl">{selected.icon}</span>
                <div>
                  <p className="text-xs font-mono mb-1" style={{ color: selected.color }}>PDB: {selected.pdbId} · {selected.method} · {selected.resolution}</p>
                  <h3 className="font-bold text-base leading-tight" style={{ color: "var(--text)" }}>{selected.protein}</h3>
                  <p className="text-sm mt-0.5" style={{ color: "#B0BAD4" }}>+ {selected.ligand}</p>
                </div>
              </div>
              <div className="text-xs font-mono px-2 py-1 rounded-lg w-fit" style={{ background: `${selected.color}10`, color: selected.color, border: `1px solid ${selected.color}20` }}>
                {selected.site}
              </div>
            </div>

            {/* Binding energy */}
            <div className="rounded-xl p-5" style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.04)" }}>
              <p className="text-xs font-mono mb-3" style={{ color: "#6B7BA0" }}>ENERGÍA DE AFINIDAD (ΔG estimado)</p>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-4xl font-black font-mono" style={{ color: selected.kcalMol < -9 ? "#00FF88" : selected.kcalMol < -7 ? "#fbbf24" : "#ef4444" }}>
                  {selected.kcalMol.toFixed(1)}
                </span>
                <span className="text-sm" style={{ color: "#6B7BA0" }}>kcal/mol</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden mb-1.5" style={{ background: "rgba(255,255,255,0.04)" }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${(Math.abs(selected.kcalMol) / maxKcal) * 100}%`, background: selected.kcalMol < -9 ? "linear-gradient(90deg,#00FF88,#22d3ee)" : selected.kcalMol < -7 ? "linear-gradient(90deg,#22d3ee,#fbbf24)" : "linear-gradient(90deg,#fbbf24,#ef4444)" }} />
              </div>
              <p className="text-xs" style={{ color: "#6B7BA0" }}>
                {selected.kcalMol < -9 ? "Muy alta afinidad · Ki < 10 nM" : selected.kcalMol < -7 ? "Alta afinidad · Ki < 1 μM" : "Afinidad moderada · Ki ~10 μM"}
              </p>
            </div>

            {/* Clinical note */}
            <div className="rounded-xl p-5" style={{ background: "#111118", border: `1px solid ${selected.color}12` }}>
              <p className="text-xs font-mono mb-2" style={{ color: selected.color }}>RELEVANCIA CLÍNICA · NP</p>
              <p className="text-sm leading-relaxed" style={{ color: "#B0BAD4" }}>{selected.clinicalNote}</p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {selected.tags.map((t) => (
                  <span key={t} className="text-xs px-2 py-0.5 rounded-full font-mono"
                    style={{ background: `${selected.color}0A`, color: selected.color, border: `1px solid ${selected.color}20` }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Binding affinity comparison bar chart */}
        <div className="rounded-2xl p-6" style={{ background: "#0D0D16", border: "1px solid rgba(255,255,255,0.04)" }}>
          <p className="text-xs font-mono mb-5" style={{ color: "#6B7BA0" }}>COMPARATIVA DE AFINIDAD · ΔG (kcal/mol) — menor = más afín</p>
          <div className="space-y-3">
            {[...COMPLEXES].sort((a, b) => a.kcalMol - b.kcalMol).map((c) => (
              <button key={c.id} onClick={() => setSelected(c)}
                className="w-full text-left group transition-all"
                style={{ outline: "none" }}>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-sm w-5">{c.icon}</span>
                  <span className="text-xs font-mono flex-1" style={{ color: selected.id === c.id ? c.color : "#B0BAD4" }}>
                    {c.proteinShort} + {c.ligandShort}
                  </span>
                  <span className="text-xs font-mono font-bold" style={{ color: c.color }}>{c.kcalMol.toFixed(1)}</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden ml-8" style={{ background: "rgba(255,255,255,0.04)" }}>
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(Math.abs(c.kcalMol) / maxKcal) * 100}%`,
                      background: c.color,
                      opacity: selected.id === c.id ? 1 : 0.45,
                      boxShadow: selected.id === c.id ? `0 0 8px ${c.color}60` : "none",
                    }} />
                </div>
              </button>
            ))}
          </div>
          <p className="text-xs mt-4" style={{ color: "#6B7BA0" }}>
            Haz clic en cualquier barra para cambiar el complejo visualizado.
          </p>
        </div>
      </div>
    </section>
  );
}
