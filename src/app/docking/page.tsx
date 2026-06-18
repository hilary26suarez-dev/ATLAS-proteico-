import type { Metadata } from "next";
import Link from "next/link";
import DockingPageClient from "./DockingPageClient";

export const metadata: Metadata = {
  title: "Docking Molecular | Atlas Proteico NP",
  description: "Visualiza en 3D cómo los fármacos y nutrientes se acoplan a proteínas relevantes en Nutrición Parenteral. AutoDock Vina, binding energy interactivo.",
};

const STEPS = [
  {
    num: "01",
    title: "Preparar el receptor",
    desc: "La proteína diana se limpia: se eliminan moléculas de agua, se añaden hidrógenos y cargas parciales. Formato: .pdbqt",
    color: "var(--teal)",
    cmd: "prepare_receptor -r proteina.pdb -o proteina.pdbqt",
  },
  {
    num: "02",
    title: "Preparar el ligando",
    desc: "La molécula farmacológica se convierte a formato compatible, definiendo sus grados de libertad rotacional.",
    color: "var(--electric)",
    cmd: "prepare_ligand -l farmaco.mol2 -o farmaco.pdbqt",
  },
  {
    num: "03",
    title: "Definir el Grid Box",
    desc: "Se define la región de búsqueda sobre el sitio de unión. Típicamente 20-30 Å³ centrado en el bolsillo activo.",
    color: "var(--amber)",
    cmd: "center_x=14.5 center_y=-2.1 center_z=22.3\nsize_x=20 size_y=20 size_z=20",
  },
  {
    num: "04",
    title: "Ejecutar AutoDock Vina",
    desc: "Vina genera hasta 9 poses y calcula el ΔG de afinidad. Menor puntaje = mayor afinidad de unión.",
    color: "var(--purple)",
    cmd: "vina --receptor proteina.pdbqt --ligand farmaco.pdbqt\n     --config config.txt --out resultado.pdbqt",
  },
];

const TOOLS = [
  { name: "AutoDock Vina",  desc: "El estándar de facto en docking. Código abierto, rápido, preciso.",                 href: "https://vina.scripps.edu/",     color: "var(--teal)",     badge: "CLI / GUI" },
  { name: "SwissDock",      desc: "Docking online sin instalación. Basado en EADock DSS.",                             href: "http://www.swissdock.ch/",      color: "var(--electric)", badge: "Web" },
  { name: "GNINA",          desc: "AutoDock Vina + redes neuronales profundas. Mejor scoring en proteínas flexibles.", href: "https://github.com/gnina/gnina",color: "var(--purple)",   badge: "CLI · IA" },
  { name: "DockingServer",  desc: "Servidor web completo: preparación automática de receptor y ligando.",              href: "https://www.dockingserver.com/",color: "var(--amber)",    badge: "Web" },
  { name: "OpenBabel",      desc: "Convertidor universal de formatos moleculares. Esencial para preparar ligandos.",   href: "https://openbabel.org/",        color: "var(--teal)",     badge: "CLI" },
  { name: "PyMOL",          desc: "Visualización y preparación de proteínas. Gold standard en publicaciones.",         href: "https://pymol.org/",            color: "var(--electric)", badge: "GUI" },
];

export default function DockingPage() {
  return (
    <div className="min-h-screen pt-20 pb-20">

      {/* ── HERO ── */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 molecular-grid opacity-50 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <div className="label-teal mb-6 w-fit">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse-dot" style={{ background: "var(--teal)" }} />
              LABORATORIO DE DOCKING MOLECULAR
            </div>
            <h1 className="font-display font-black leading-tight mb-5"
              style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", color: "var(--text)" }}>
              Cómo los fármacos{" "}
              <span style={{ color: "var(--electric)" }}>encuentran</span>{" "}
              su proteína.
            </h1>
            <p className="text-lg leading-relaxed mb-8" style={{ color: "#B0BAD4" }}>
              El <strong style={{ color: "var(--text)" }}>docking molecular</strong> predice cómo una molécula pequeña
              (fármaco, nutriente, metabolito) se acopla al sitio de unión de una proteína diana.
              Visualiza complejos reales del PDB, compara energías de afinidad e interpreta el resultado clínico.
            </p>

            {/* Terminal */}
            <div className="rounded-lg p-4 text-sm overflow-x-auto"
              style={{ background: "var(--bg-card)", border: "1px solid rgba(0,255,136,0.12)", fontFamily: "var(--font-mono, monospace)" }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full" style={{ background: "rgba(255,95,80,0.4)" }} />
                  <span className="w-3 h-3 rounded-full" style={{ background: "rgba(245,166,35,0.4)" }} />
                  <span className="w-3 h-3 rounded-full" style={{ background: "rgba(0,255,136,0.4)" }} />
                </div>
                <span style={{ color: "#6B7BA0", fontSize: "0.7rem" }}>docking_terminal</span>
              </div>
              <p style={{ color: "#B0BAD4" }}>
                <span style={{ color: "var(--teal)" }}>$</span>{" "}
                <span style={{ color: "var(--text)" }}>vina</span>{" "}
                <span style={{ color: "var(--electric)" }}>--receptor</span>{" "}albumina.pdbqt{" "}
                <span style={{ color: "var(--electric)" }}>--ligand</span>{" "}warfarina.pdbqt{" "}
                <span style={{ color: "var(--electric)" }}>--exhaustiveness</span>{" "}8
              </p>
              <p className="mt-2" style={{ color: "#B0BAD4" }}>
                <span style={{ color: "#6B7BA0" }}>#</span>{" "}
                <span style={{ color: "var(--amber)" }}>Resultado:</span>
              </p>
              <p style={{ color: "#B0BAD4" }}>&nbsp;&nbsp;Modo 1 &nbsp;&nbsp;<span style={{ color: "var(--teal)" }}>ΔG = -8.3 kcal/mol</span> &nbsp;&nbsp; rmsd = 0.000</p>
              <p style={{ color: "#B0BAD4" }}>&nbsp;&nbsp;Modo 2 &nbsp;&nbsp;ΔG = -7.9 kcal/mol &nbsp;&nbsp; rmsd = 1.823</p>
              <p style={{ color: "#B0BAD4" }}>&nbsp;&nbsp;Modo 3 &nbsp;&nbsp;ΔG = -7.4 kcal/mol &nbsp;&nbsp; rmsd = 2.341</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── VISOR INTERACTIVO ── client component */}
      <DockingPageClient />

      {/* ── QUÉ CALCULA ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs tracking-[0.2em] mb-3" style={{ color: "var(--teal)", fontFamily: "var(--font-mono, monospace)" }}>FUNDAMENTOS</p>
          <h2 className="font-display font-black text-4xl mb-10" style={{ color: "var(--text)" }}>¿Qué calcula exactamente?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: "🗝️", title: "Pose óptima", desc: "El algoritmo explora millones de orientaciones posibles del ligando dentro del bolsillo de la proteína para encontrar la posición de menor energía libre.", color: "var(--teal)" },
              { icon: "⚡", title: "Energía de afinidad (ΔG)", desc: "En kcal/mol. Valores < −7 se consideran alta afinidad (Ki < 1 μM). La warfarina se une a albúmina con ΔG ≈ −9.1 kcal/mol.", color: "var(--electric)" },
              { icon: "🔮", title: "Función de scoring", desc: "AutoDock Vina modela interacciones estéricas, enlaces de hidrógeno, hidrofobicidad, torsiones y términos de solvatación mediante una función empírica.", color: "var(--purple)" },
            ].map((c) => (
              <div key={c.title} className="p-6 rounded-xl" style={{ background: "var(--bg-card)", border: "1px solid rgba(255,255,255,0.04)" }}>
                <div className="text-3xl mb-4">{c.icon}</div>
                <h3 className="font-display font-bold text-lg mb-2" style={{ color: c.color }}>{c.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#B0BAD4" }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WORKFLOW ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs tracking-[0.2em] mb-3" style={{ color: "var(--teal)", fontFamily: "var(--font-mono, monospace)" }}>WORKFLOW · AUTODOCK VINA</p>
          <h2 className="font-display font-black text-4xl mb-10" style={{ color: "var(--text)" }}>4 pasos para un docking.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {STEPS.map((step) => (
              <div key={step.num} className="p-6 rounded-xl" style={{ background: "var(--bg-raised)", border: `1px solid ${step.color}22` }}>
                <div className="flex items-start gap-4 mb-4">
                  <span className="font-display font-black text-3xl flex-shrink-0" style={{ color: step.color, opacity: 0.3 }}>{step.num}</span>
                  <div>
                    <h3 className="font-display font-bold text-lg mb-1" style={{ color: step.color }}>{step.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "#B0BAD4" }}>{step.desc}</p>
                  </div>
                </div>
                <pre className="text-xs p-3 rounded-lg overflow-x-auto"
                  style={{ background: "rgba(0,0,0,0.3)", color: "var(--teal)", fontFamily: "var(--font-mono, monospace)", border: "1px solid rgba(0,255,136,0.08)" }}>
                  {step.cmd}
                </pre>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RELEVANCIA NP ── */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-xl p-8" style={{ background: "var(--bg-raised)", border: "1px solid rgba(0,255,136,0.10)" }}>
            <p className="text-xs tracking-[0.15em] mb-4" style={{ color: "var(--teal)", fontFamily: "var(--font-mono, monospace)" }}>RELEVANCIA EN NUTRICIÓN PARENTERAL</p>
            <h2 className="font-display font-black text-3xl mb-6" style={{ color: "var(--text)" }}>¿Por qué importa el docking en NP?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: "Competencia fármaco–ácido graso por albúmina", desc: "Las emulsiones lipídicas aportan ácidos grasos que compiten con warfarina, diazepam e ibuprofeno por los sitios de unión en albúmina. El docking cuantifica quién 'gana' y altera la fracción libre activa del fármaco." },
                { title: "Diseño de emulsiones de 3.ª generación", desc: "SMOFlipid (ω-3) fue diseñado computacionalmente para minimizar interferencia con sitios farmacológicos de albúmina. Sus ácidos EPA/DHA muestran menor afinidad que el ácido oleico (Intralipid)." },
                { title: "Resistencia a insulina en UCI", desc: "Cambios conformacionales del dominio tirosina cinasa del INSR en pacientes críticos explican hiperglucemia refractaria. El docking guía el diseño de análogos de insulina para estos pacientes." },
                { title: "Biodisponibilidad de vitaminas liposolubles", desc: "Vitaminas D, E y K son transportadas por proteínas plasmáticas. El docking predice si fármacos co-administrados las desplazan de sus transportadores, afectando su distribución en NP." },
              ].map((item) => (
                <div key={item.title} className="flex gap-3">
                  <div className="mt-1 w-2 h-2 rounded-full flex-shrink-0" style={{ background: "var(--teal)", boxShadow: "0 0 6px var(--teal)" }} />
                  <div>
                    <h4 className="font-display font-bold text-base mb-1" style={{ color: "var(--text)" }}>{item.title}</h4>
                    <p className="text-sm leading-relaxed" style={{ color: "#B0BAD4" }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── HERRAMIENTAS ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs tracking-[0.2em] mb-3" style={{ color: "var(--teal)", fontFamily: "var(--font-mono, monospace)" }}>HERRAMIENTAS RECOMENDADAS</p>
          <h2 className="font-display font-black text-4xl mb-10" style={{ color: "var(--text)" }}>El stack del investigador.</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TOOLS.map((t) => (
              <a key={t.name} href={t.href} target="_blank" rel="noopener noreferrer"
                className="p-5 rounded-xl card-hover block"
                style={{ background: "var(--bg-card)", border: `1px solid ${t.color}22` }}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display font-bold text-base" style={{ color: t.color }}>{t.name}</h3>
                  <span className="text-xs px-2 py-0.5 rounded" style={{ background: `${t.color}15`, color: t.color, border: `1px solid ${t.color}30`, fontFamily: "var(--font-mono, monospace)" }}>{t.badge}</span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "#B0BAD4" }}>{t.desc}</p>
                <p className="text-xs mt-3" style={{ color: t.color, fontFamily: "var(--font-mono, monospace)" }}>Abrir ↗</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs tracking-[0.2em] mb-4" style={{ color: "var(--teal)", fontFamily: "var(--font-mono, monospace)" }}>SIGUIENTE PASO</p>
          <h2 className="font-display font-black text-3xl sm:text-4xl mb-6" style={{ color: "var(--text)" }}>Explora las proteínas diana.</h2>
          <p className="text-base mb-8" style={{ color: "#B0BAD4" }}>Cada proteína del atlas tiene su estructura 3D disponible. Ve a los módulos y pon en práctica lo aprendido.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/modules" className="btn-primary">Explorar módulos →</Link>
            <Link href="/simulador" className="btn-outline">Simulador de estabilidad</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
