import Link from "next/link";
import atlasData from "@/data/protein_atlas.json";
import HeroProtein3D from "@/components/HeroProtein3D";
import ParticlesBg from "@/components/ParticlesBg";

const totalProteins = atlasData.modules.reduce((a, m) => a + m.proteins.length, 0);

const allProteinNames = atlasData.modules.flatMap((m) =>
  m.proteins.map((p) => ({ name: p.name, abbr: p.id.toUpperCase() }))
);

const moduleAccents: Record<string, {
  color: string; bg: string; border: string; glow: string; num: string;
}> = {
  "canal-alimentacion": {
    color: "#00FF88", bg: "rgba(0,255,136,0.05)", border: "rgba(0,255,136,0.15)",
    glow: "rgba(0,255,136,0.10)", num: "01",
  },
  "laboratorio-hepatico": {
    color: "#f5a623", bg: "rgba(245,166,35,0.05)", border: "rgba(245,166,35,0.15)",
    glow: "rgba(245,166,35,0.10)", num: "02",
  },
  "sistema-defensa": {
    color: "#A855F7", bg: "rgba(168,85,247,0.05)", border: "rgba(168,85,247,0.15)",
    glow: "rgba(168,85,247,0.10)", num: "03",
  },
  "senalizacion-hormonal": {
    color: "#4A9EFF", bg: "rgba(74,158,255,0.05)", border: "rgba(74,158,255,0.15)",
    glow: "rgba(74,158,255,0.10)", num: "04",
  },
};

export default function Home() {
  return (
    <div>

      {/* ════════════════════════════════════════
          HERO — Split layout: texto + proteína 3D
      ════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-16">

        {/* Partículas de red molecular */}
        <ParticlesBg />

        {/* Rejilla de fondo tipo visor científico */}
        <div className="absolute inset-0 molecular-grid pointer-events-none" style={{ zIndex: 1 }} />

        {/* Orbs de luz sutiles */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(0,255,136,0.04) 0%, transparent 70%)" }} />
          <div className="absolute bottom-1/3 left-0 w-[400px] h-[400px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(74,158,255,0.04) 0%, transparent 70%)" }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8"
          style={{ zIndex: 10 }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-16 items-center min-h-[82vh]">

            {/* ── Columna izquierda: contenido ── */}
            <div className="flex flex-col justify-center order-2 lg:order-1">

              {/* Línea terminal */}
              <div className="terminal-line mb-7">
                <span className="terminal-prompt">$</span>
                <span className="terminal-cmd">atlas_proteico --init</span>
                <span className="terminal-cursor">▊</span>
              </div>

              {/* Badge */}
              <div className="label-teal mb-8 w-fit">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse-dot"
                  style={{ background: "var(--teal)" }} />
                {totalProteins} PROTEÍNAS · RCSB PDB · OPEN SCIENCE · GRATIS
              </div>

              {/* Headline */}
              <h1 className="font-display font-black leading-[0.88] tracking-tighter mb-8"
                style={{ fontSize: "clamp(3rem, 7.5vw, 6rem)" }}>
                <span className="block" style={{ color: "var(--text)" }}>PROTEÍNAS</span>
                <span className="block" style={{ color: "var(--teal)" }}>QUE HACEN</span>
                <span className="block" style={{ color: "var(--text)" }}>POSIBLE</span>
                <span className="block" style={{ color: "var(--text)" }}>LA VIDA.</span>
              </h1>

              {/* Divisor + subtítulo */}
              <div className="flex items-start gap-4 mb-10">
                <div className="w-px mt-1 flex-shrink-0 h-14 opacity-30"
                  style={{ background: "var(--teal)" }} />
                <p className="text-base sm:text-lg leading-relaxed"
                  style={{ color: "var(--text-muted)" }}>
                  Visualiza en{" "}
                  <span className="font-semibold" style={{ color: "var(--text)" }}>3D interactivo</span>{" "}
                  las proteínas que sostienen la{" "}
                  <span className="font-semibold" style={{ color: "var(--amber)" }}>Nutrición Parenteral</span>.
                  {" "}Contexto clínico real para médicos, farmacéuticos y nutricionistas.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4">
                <Link href="/modules" className="btn-primary">
                  Explorar módulos →
                </Link>
                <Link href="/buscar" className="btn-outline">
                  Buscar proteína
                </Link>
              </div>
            </div>

            {/* ── Columna derecha: Proteína 3D ── */}
            <div className="flex justify-center items-center order-1 lg:order-2 py-12 lg:py-0">
              <HeroProtein3D
                pdbId="1AO6"
                label="PDB: 1AO6 · Albúmina sérica humana"
              />
            </div>

          </div>
        </div>

        {/* Flecha scroll */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 animate-bounce"
          style={{ color: "var(--text-faint)", zIndex: 10 }}>
          <span className="text-xs tracking-widest"
            style={{ fontFamily: "var(--font-mono, monospace)" }}>SCROLL</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ════════════════════════════════════════
          MARQUEE — Ticker de proteínas
      ════════════════════════════════════════ */}
      <div className="relative overflow-hidden py-3 border-y"
        style={{ borderColor: "rgba(0,255,136,0.07)", background: "var(--bg-card)" }}>
        <div className="marquee-track select-none">
          {[...allProteinNames, ...allProteinNames].map((p, i) => (
            <span key={i} className="inline-flex items-center gap-3 mx-6">
              <span className="text-xs font-semibold tracking-wider"
                style={{ color: "var(--teal)", fontFamily: "var(--font-mono, monospace)" }}>
                {p.abbr}
              </span>
              <span className="text-sm" style={{ color: "var(--text-muted)" }}>{p.name}</span>
              <span style={{ color: "var(--text-faint)" }}>·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════
          STATS
      ════════════════════════════════════════ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px"
            style={{ background: "rgba(0,255,136,0.05)" }}>
            {[
              { n: `${totalProteins}+`, label: "Proteínas", sub: "indexadas" },
              { n: "4",    label: "Módulos",  sub: "metabólicos" },
              { n: "3D",   label: "Viewer",   sub: "interactivo" },
              { n: "100%", label: "Libre",    sub: "open science" },
            ].map((s) => (
              <div key={s.label} className="py-10 px-6 text-center" style={{ background: "var(--bg)" }}>
                <div className="font-display font-black mb-1"
                  style={{ fontSize: "clamp(2.5rem,5vw,3.75rem)", color: "var(--teal)" }}>
                  {s.n}
                </div>
                <div className="font-display font-bold text-base" style={{ color: "var(--text)" }}>
                  {s.label}
                </div>
                <div className="text-xs mt-0.5"
                  style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono, monospace)" }}>
                  {s.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          MÓDULOS
      ════════════════════════════════════════ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          <div className="mb-12">
            <p className="text-xs tracking-[0.2em] mb-3"
              style={{ color: "var(--teal)", fontFamily: "var(--font-mono, monospace)" }}>
              MÓDULOS MOLECULARES
            </p>
            <h2 className="font-display font-black text-4xl sm:text-5xl" style={{ color: "var(--text)" }}>
              4 sistemas,<br />
              <span style={{ color: "var(--teal)" }}>una terapia.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {atlasData.modules.map((mod) => {
              const a = moduleAccents[mod.id];
              return (
                <Link
                  key={mod.id}
                  href={`/modules/${mod.id}`}
                  className="relative group overflow-hidden card-hover"
                  style={{
                    background: a.bg,
                    border: `1px solid ${a.border}`,
                    borderRadius: "12px",
                  }}
                >
                  {/* Número decorativo */}
                  <span className="absolute -right-4 -bottom-6 font-display font-black select-none pointer-events-none"
                    style={{ fontSize: "8rem", lineHeight: 1, color: a.color, opacity: 0.05 }}>
                    {a.num}
                  </span>

                  <div className="relative z-10 p-7">
                    <div className="flex items-start justify-between mb-5">
                      <div>
                        <span className="text-xs font-bold tracking-widest mb-2 block"
                          style={{ color: a.color, fontFamily: "var(--font-mono, monospace)" }}>
                          MÓDULO {a.num}
                        </span>
                        <h3 className="font-display font-black text-2xl" style={{ color: "var(--text)" }}>
                          {mod.name}
                        </h3>
                        <p className="text-sm mt-0.5 font-medium" style={{ color: a.color }}>
                          {mod.subtitle}
                        </p>
                      </div>
                      <span className="text-3xl">{mod.icon}</span>
                    </div>

                    <p className="text-sm leading-relaxed mb-5 line-clamp-2"
                      style={{ color: "var(--text-muted)" }}>
                      {mod.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {mod.proteins.slice(0, 5).map((p) => (
                        <span key={p.id} className="text-xs px-2 py-0.5 rounded"
                          style={{
                            background: "rgba(0,0,0,0.25)",
                            color: "var(--text-muted)",
                            border: "1px solid rgba(255,255,255,0.05)",
                            fontFamily: "var(--font-mono, monospace)",
                          }}>
                          {p.name}
                        </span>
                      ))}
                      {mod.proteins.length > 5 && (
                        <span className="text-xs px-2 py-0.5 rounded"
                          style={{ color: "var(--text-faint)", fontFamily: "var(--font-mono, monospace)" }}>
                          +{mod.proteins.length - 5}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-sm font-bold font-display transition-all group-hover:gap-3"
                      style={{ color: a.color }}>
                      Explorar
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          NutriVida Banner
      ════════════════════════════════════════ */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 my-4">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6"
            style={{
              background: "var(--bg-raised)",
              border: "1px solid rgba(245,166,35,0.12)",
            }}>
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-2xl"
                style={{ background: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.18)" }}>
                💊
              </div>
              <div>
                <h3 className="font-display font-bold text-lg" style={{ color: "var(--text)" }}>
                  Integrado con NutriVida NP
                </h3>
                <p className="text-sm mt-0.5 max-w-xl" style={{ color: "var(--text-muted)" }}>
                  Calcula la fórmula parenteral en NutriVida y entiende aquí las moléculas detrás de cada terapia.
                </p>
              </div>
            </div>
            <a href="https://nutri-vida-khaki.vercel.app" target="_blank" rel="noopener noreferrer"
              className="flex-shrink-0 px-5 py-2.5 rounded-lg text-sm font-bold transition-all hover:opacity-80"
              style={{
                border: "1px solid rgba(245,166,35,0.28)",
                color: "var(--amber)",
                fontFamily: "var(--font-mono, monospace)",
              }}>
              Abrir NutriVida →
            </a>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FEATURES
      ════════════════════════════════════════ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="text-xs tracking-[0.2em] mb-3"
              style={{ color: "var(--teal)", fontFamily: "var(--font-mono, monospace)" }}>
              POR QUÉ ES DIFERENTE
            </p>
            <h2 className="font-display font-black text-4xl sm:text-5xl" style={{ color: "var(--text)" }}>
              No es Wikipedia.<br />
              <span style={{ color: "var(--amber)" }}>Es una herramienta.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: "⚗️", title: "3D desde RCSB PDB",    desc: "Estructuras cristalográficas reales. Rota, acerca y explora en tu navegador.", color: "var(--teal)" },
              { icon: "🎓", title: "Modo Estudiante",       desc: "Lenguaje claro, cartoon visual y escenarios clínicos de NP.", color: "var(--amber)" },
              { icon: "🔬", title: "Modo Investigador",     desc: "Superficies, ligandos, AlphaFold DB, HPA en vivo, ProteinMPNN.", color: "var(--purple)" },
              { icon: "💉", title: "Contexto Clínico NP",   desc: "Cada proteína conectada a un parámetro real de tu fórmula parenteral.", color: "var(--electric)" },
              { icon: "📚", title: "Biblioprote",           desc: "Abstract y DOI de PubMed directamente en la ficha de cada proteína.", color: "var(--teal)" },
              { icon: "🌐", title: "Open Science",          desc: "UniProt, RCSB, AlphaFold, PubMed. Ciencia abierta, sin barreras.", color: "var(--amber)" },
            ].map((f) => (
              <div key={f.title} className="p-6 rounded-xl"
                style={{ background: "var(--bg-card)", border: "1px solid rgba(255,255,255,0.04)" }}>
                <div className="text-2xl mb-3">{f.icon}</div>
                <h3 className="font-display font-bold text-base mb-2" style={{ color: f.color }}>
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          CTA FINAL
      ════════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs tracking-[0.25em] mb-4"
            style={{ color: "var(--teal)", fontFamily: "var(--font-mono, monospace)" }}>
            EMPIEZA AHORA · ES GRATIS
          </p>
          <h2 className="font-display font-black mb-6"
            style={{ fontSize: "clamp(2.5rem,6vw,4.5rem)", color: "var(--text)", lineHeight: 1 }}>
            La ciencia molecular<br />
            <span style={{ color: "var(--teal)" }}>es para todos.</span>
          </h2>
          <p className="text-lg mb-10" style={{ color: "var(--text-muted)" }}>
            Toca la molécula. Entiende la terapia. Conecta la ciencia con la práctica clínica.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/modules" className="btn-primary">Explorar el Atlas →</Link>
            <Link href="/buscar"  className="btn-outline">Buscar una proteína</Link>
          </div>
        </div>
      </section>

    </div>
  );
}
