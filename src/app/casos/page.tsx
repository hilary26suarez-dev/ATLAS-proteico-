import type { Metadata } from "next";
import Link from "next/link";
import CasosClient from "./CasosClient";

export const metadata: Metadata = {
  title: "Casos Clínicos | Atlas Proteico NP",
  description: "Casos clínicos interactivos de Nutrición Parenteral. Del paciente a la molécula: aprende bioquímica aplicada con escenarios reales de UCI, cirugía y oncología.",
};

export default function CasosPage() {
  return (
    <div className="min-h-screen pt-20 pb-20">

      {/* Hero */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 molecular-grid opacity-40 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto">
          <div className="label-teal mb-6 w-fit">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse-dot" style={{ background: "var(--teal)" }} />
            PUENTE CLÍNICO · CASOS INTERACTIVOS
          </div>
          <h1 className="font-display font-black leading-tight mb-5"
            style={{ fontSize: "clamp(2.2rem, 5.5vw, 4rem)", color: "var(--text)" }}>
            Del paciente{" "}
            <span style={{ color: "var(--electric)" }}>a la molécula.</span>
          </h1>
          <p className="text-lg leading-relaxed max-w-2xl" style={{ color: "#B0BAD4" }}>
            Cada decisión clínica en Nutrición Parenteral tiene un correlato molecular.
            Explora estos casos reales y entiende <strong style={{ color: "var(--text)" }}>por qué pasa lo que pasa</strong> a nivel bioquímico.
          </p>

          {/* Profession tags */}
          <div className="flex flex-wrap gap-2 mt-6">
            {[
              { label: "UCI · Medicina Crítica", color: "#ef4444" },
              { label: "Farmacia Hospitalaria", color: "#a78bfa" },
              { label: "Enfermería NP", color: "#60a5fa" },
              { label: "Nutrición Clínica", color: "#34d399" },
              { label: "Biotecnología", color: "#fbbf24" },
            ].map((p) => (
              <span key={p.label} className="text-xs px-3 py-1 rounded-full font-mono"
                style={{ background: `${p.color}0F`, color: p.color, border: `1px solid ${p.color}25` }}>
                {p.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Client: interactive cases */}
      <CasosClient />

      {/* CTA */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs tracking-[0.2em] mb-4 font-mono" style={{ color: "var(--teal)" }}>CONTINÚA EXPLORANDO</p>
          <h2 className="font-display font-black text-3xl mb-6" style={{ color: "var(--text)" }}>
            Las proteínas detrás de cada caso.
          </h2>
          <p className="text-base mb-8" style={{ color: "#B0BAD4" }}>
            Cada caso clínico está vinculado a proteínas reales en el atlas. Explóralas en 3D.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/modules" className="btn-primary">Atlas de proteínas →</Link>
            <Link href="/simulador" className="btn-outline">Simulador molecular</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
