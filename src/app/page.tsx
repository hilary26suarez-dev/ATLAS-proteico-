import Link from "next/link";
import atlasData from "@/data/protein_atlas.json";

const totalProteins = atlasData.modules.reduce((a, m) => a + m.proteins.length, 0);

// All protein names for the scrolling marquee
const allProteinNames = atlasData.modules.flatMap((m) =>
  m.proteins.map((p) => ({ name: p.name, abbr: p.id.toUpperCase() }))
);

const moduleAccents: Record<string, { color: string; bg: string; border: string; glow: string; num: string }> = {
  "canal-alimentacion": {
    color: "#00dba0", bg: "rgba(0,219,160,0.06)", border: "rgba(0,219,160,0.18)",
    glow: "rgba(0,219,160,0.12)", num: "01",
  },
  "laboratorio-hepatico": {
    color: "#f5a623", bg: "rgba(245,166,35,0.06)", border: "rgba(245,166,35,0.18)",
    glow: "rgba(245,166,35,0.12)", num: "02",
  },
  "sistema-defensa": {
    color: "#7c6bff", bg: "rgba(124,107,255,0.06)", border: "rgba(124,107,255,0.18)",
    glow: "rgba(124,107,255,0.12)", num: "03",
  },
  "senalizacion-hormonal": {
    color: "#ff5f50", bg: "rgba(255,95,80,0.06)", border: "rgba(255,95,80,0.18)",
    glow: "rgba(255,95,80,0.12)", num: "04",
  },
};

export default function Home() {
  return (
    <div>

      {/* ════════════════════════════════════════
          HERO
      ════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-center molecular-grid overflow-hidden pt-20">

        {/* Glow orbs de fondo — sutiles, no genéricos */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 right-0 w-[600px] h-[600px] rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, rgba(0,219,160,0.15) 0%, transparent 70%)" }} />
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full opacity-15"
            style={{ background: "radial-gradient(circle, rgba(245,166,35,0.12) 0%, transparent 70%)" }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-4xl">

            {/* Badge */}
            <div className="label-teal mb-10 w-fit">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse-dot" style={{ background: "var(--teal)" }} />
              {totalProteins} PROTEÍNAS · RCSB PDB · OPEN SCIENCE · GRATIS
            </div>

            {/* Headline principal — tipografía que manda */}
            <h1 className="font-display font-black leading-[0.88] tracking-tighter mb-8"
              style={{ fontSize: "clamp(3.5rem, 9vw, 7.5rem)" }}>
              <span className="block" style={{ color: "var(--text)" }}>PROTEÍNAS</span>
              <span className="block" style={{ color: "var(--teal)" }}>QUE HACEN</span>
              <span className="block" style={{ color: "var(--text)" }}>POSIBLE</span>
              <span className="block" style={{ color: "var(--text)" }}>LA VIDA.</span>
            </h1>

            {/* Línea divisora con acento */}
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px flex-1 max-w-[120px]" style={{ background: "var(--teal)", opacity: 0.4 }} />
              <p className="text-base sm:text-lg leading-relaxed max-w-2xl" style={{ color: "var(--text-muted)" }}>
                Visualiza en{" "}
                <span className="font-semibold" style={{ color: "var(--text)" }}>3D interactivo</span>{" "}
                las proteínas que sostienen la{" "}
                <span className="font-semibold" style={{ color: "var(--amber)" }}>Nutrición Parenteral</span>.
                {" "}Con contexto clínico real, para médicos, farmacéuticos y nutricionistas.
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
        </div>

        {/* Flecha scroll */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 animate-bounce"
          style={{ color: "var(--text-muted)" }}>
          <span className="text-xs font-mono tracking-widest">SCROLL</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ════════════════════════════════════════
          MARQUEE — Ticker de proteínas
      ════════════════════════════════════════ */}
      <div className="relative overflow-hidden py-4 border-y" style={{ borderColor: "rgba(0,219,160,0.08)" }}>
        <div className="marquee-track select-none">
          {/* Duplicado para loop seamless */}
          {[...allProteinNames, ...allProteinNames].map((p, i) => (
            <span key={i} className="inline-flex items-center gap-3 mx-6">
              <span className="font-mono text-xs font-semibold tracking-wider" style={{ color: "var(--teal)" }}>
                {p.abbr.toUpperCase()}
              </span>
              <span className="text-sm" style={{ color: "var(--text-muted)" }}>{p.name}</span>
              <span style={{ color: "var(--text-faint)" }}>·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════
          STATS — Números que impactan
      ════════════════════════════════════════ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px" style={{ background: "rgba(0,219,160,0.06)" }}>
            {[
              { n: `${totalProteins}+`, label: "Proteínas", sub: "indexadas" },
              { n: "4",    label: "Módulos",  sub: "metabólicos" },
              { n: "3D",   label: "Viewer",   sub: "interactivo" },
              { n: "100%", label: "Libre",    sub: "siempre gratis" },
            ].map((s) => (
              <div key={s.label} className="py-10 px-6 text-center" style={{ background: "var(--bg)" }}>
                <div className="font-display font-black mb-1" style={{ fontSize: "clamp(2.5rem,5vw,3.75rem)", color: "var(--teal)" }}>
                  {s.n}
                </div>
                <div className="font-display font-bold text-base" style={{ color: "var(--text)" }}>{s.label}</div>
                <div className="text-xs mt-0.5 font-mono" style={{ color: "var(--text-muted)" }}>{s.sub}</div>
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
            <p className="font-mono text-xs tracking-[0.2em] mb-3" style={{ color: "var(--teal)" }}>
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
                  className="relative group overflow-hidden rounded-2xl card-hover"
                  style={{ background: a.bg, border: `1px solid ${a.border}` }}
                >
                  {/* Número fantasma decorativo */}
                  <span className="absolute -right-4 -bottom-6 font-display font-black select-none pointer-events-none"
                    style={{ fontSize: "9rem", lineHeight: 1, color: a.color, opacity: 0.06 }}>
                    {a.num}
                  </span>

                  <div className="relative z-10 p-7">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-5">
                      <div>
                        <span className="font-mono text-xs font-bold tracking-widest mb-2 block" style={{ color: a.color }}>
                          MÓDULO {a.num}
                        </span>
                        <h3 className="font-display font-black text-2xl" style={{ color: "var(--text)" }}>
                          {mod.name}
                        </h3>
                        <p className="text-sm mt-0.5 font-medium" style={{ color: a.color }}>{mod.subtitle}</p>
                      </div>
                      <span className="text-3xl">{mod.icon}</span>
                    </div>

                    {/* Descripción */}
                    <p className="text-sm leading-relaxed mb-5 line-clamp-2" style={{ color: "var(--text-muted)" }}>
                      {mod.description}
                    </p>

                    {/* Proteínas muestra */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {mod.proteins.slice(0, 5).map((p) => (
                        <span key={p.id} className="text-xs px-2 py-0.5 rounded font-mono"
                          style={{ background: "rgba(0,0,0,0.3)", color: "var(--text-muted)", border: "1px solid rgba(255,255,255,0.06)" }}>
                          {p.name}
                        </span>
                      ))}
                      {mod.proteins.length > 5 && (
                        <span className="text-xs px-2 py-0.5 rounded font-mono" style={{ color: "var(--text-faint)" }}>
                          +{mod.proteins.length - 5}
                        </span>
                      )}
                    </div>

                    {/* CTA */}
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
          <div className="rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6"
            style={{ background: "var(--bg-raised)", border: "1px solid rgba(245,166,35,0.15)" }}>
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-2xl"
                style={{ background: "rgba(245,166,35,0.12)", border: "1px solid rgba(245,166,35,0.2)" }}>
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
              className="flex-shrink-0 px-5 py-2.5 rounded-lg text-sm font-bold font-display transition-all hover:opacity-80"
              style={{ border: "1px solid rgba(245,166,35,0.3)", color: "var(--amber)" }}>
              Abrir NutriVida →
            </a>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FEATURES — Por qué es diferente
      ════════════════════════════════════════ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="font-mono text-xs tracking-[0.2em] mb-3" style={{ color: "var(--teal)" }}>
              POR QUÉ ES DIFERENTE
            </p>
            <h2 className="font-display font-black text-4xl sm:text-5xl" style={{ color: "var(--text)" }}>
              No es Wikipedia.<br />
              <span style={{ color: "var(--amber)" }}>Es una herramienta.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: "⚗️", title: "3D desde RCSB PDB", desc: "Estructuras cristalográficas reales. Rota, acerca y explora en tu navegador.", color: "var(--teal)" },
              { icon: "🎓", title: "Modo Estudiante", desc: "Lenguaje claro, cartoon visual y escenarios clínicos de NP.", color: "var(--amber)" },
              { icon: "🔬", title: "Modo Investigador", desc: "Superficies, ligandos, AlphaFold DB, HPA en vivo, ProteinMPNN.", color: "var(--violet)" },
              { icon: "💉", title: "Contexto Clínico NP", desc: "Cada proteína conectada a un parámetro real de tu fórmula parenteral.", color: "var(--coral)" },
              { icon: "📚", title: "Biblioprote", desc: "Abstract y DOI de PubMed directamente en la ficha de cada proteína.", color: "var(--teal)" },
              { icon: "🌐", title: "Open Science", desc: "UniProt, RCSB, AlphaFold, PubMed. Ciencia abierta, sin barreras.", color: "var(--amber)" },
            ].map((f) => (
              <div key={f.title} className="p-6 rounded-xl"
                style={{ background: "var(--bg-card)", border: "1px solid rgba(255,255,255,0.04)" }}>
                <div className="text-2xl mb-3">{f.icon}</div>
                <h3 className="font-display font-bold text-base mb-2" style={{ color: f.color }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{f.desc}</p>
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
          <p className="font-mono text-xs tracking-[0.25em] mb-4" style={{ color: "var(--teal)" }}>
            EMPIEZA AHORA · ES GRATIS
          </p>
          <h2 className="font-display font-black mb-6" style={{ fontSize: "clamp(2.5rem,6vw,4.5rem)", color: "var(--text)", lineHeight: 1 }}>
            La ciencia molecular<br />
            <span style={{ color: "var(--teal)" }}>es para todos.</span>
          </h2>
          <p className="text-lg mb-10" style={{ color: "var(--text-muted)" }}>
            Toca la molécula. Entiende la terapia. Conecta la ciencia con la práctica clínica.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/modules" className="btn-primary">Explorar el Atlas →</Link>
            <Link href="/buscar" className="btn-outline">Buscar una proteína</Link>
          </div>
        </div>
      </section>

    </div>
  );
}
