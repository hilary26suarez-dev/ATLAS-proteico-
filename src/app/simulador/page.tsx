import type { Metadata } from "next";
import SimuladorWrapper from "./SimuladorWrapper";

export const metadata: Metadata = {
  title: "Simulador de Estabilidad NP | Atlas Proteico NP",
  description: "Simulador interactivo de estabilidad y compatibilidad de Nutrición Parenteral: precipitación Ca-fosfato, ruptura de emulsión lipídica y adsorción de fármacos en PVC.",
};

export default function SimuladorPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>

      {/* Hero */}
      <section className="pt-24 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-mono tracking-widest px-3 py-1 rounded-full"
              style={{ background: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.2)", color: "#f5a623" }}>
              SIMULACIÓN MOLECULAR · TIEMPO REAL
            </span>
          </div>
          <h1 className="font-display font-black text-5xl sm:text-6xl leading-none mb-5">
            <span style={{ color: "var(--text)" }}>Simulador de</span><br />
            <span style={{ color: "#f5a623" }}>Estabilidad en NP</span>
          </h1>
          <p className="text-lg max-w-2xl mb-6" style={{ color: "var(--text-muted)" }}>
            La Nutrición Parenteral es una de las mezclas farmacéuticas más complejas de la medicina hospitalaria. Manipula variables clínicas reales y observa en tiempo real cómo las interacciones moleculares determinan si tu mezcla es segura o potencialmente letal.
          </p>

          {/* Stats bar */}
          <div className="flex flex-wrap gap-4">
            {[
              { icon: "⚗️", label: "3 módulos de simulación" },
              { icon: "🎯", label: "Variables clínicas reales" },
              { icon: "⚡", label: "Física de partículas en tiempo real" },
              { icon: "🏥", label: "Farmacia · Medicina · Enfermería" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2 text-sm"
                style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono, monospace)" }}>
                <span>{s.icon}</span>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simulator */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <SimuladorWrapper />
        </div>
      </section>

      {/* Safety banner */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto rounded-2xl p-6"
          style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.15)" }}>
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">⚠️</span>
            <div>
              <h3 className="font-bold text-sm mb-1" style={{ color: "#ef4444" }}>Uso educativo</h3>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Este simulador usa modelos simplificados para fines educativos. Las decisiones clínicas sobre formulación de NP deben siempre seguir los protocolos institucionales, guías ASPEN/ESPEN vigentes y la supervisión de un farmacéutico clínico certificado.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
