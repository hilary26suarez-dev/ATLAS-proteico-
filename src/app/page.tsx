import Link from "next/link";
import atlasData from "@/data/protein_atlas.json";

const moduleColors: Record<string, { border: string; badge: string; dot: string; text: string }> = {
  "canal-alimentacion": {
    border: "border-cyan-500/30 hover:border-cyan-500/60",
    badge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    dot: "bg-cyan-400",
    text: "text-cyan-400",
  },
  "laboratorio-hepatico": {
    border: "border-amber-500/30 hover:border-amber-500/60",
    badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    dot: "bg-amber-400",
    text: "text-amber-400",
  },
  "sistema-defensa": {
    border: "border-emerald-500/30 hover:border-emerald-500/60",
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    dot: "bg-emerald-400",
    text: "text-emerald-400",
  },
  "senalizacion-hormonal": {
    border: "border-violet-500/30 hover:border-violet-500/60",
    badge: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    dot: "bg-violet-400",
    text: "text-violet-400",
  },
};

const stats = [
  { value: `${atlasData.modules.reduce((a, m) => a + m.proteins.length, 0)}+`, label: "Proteínas", sub: "y creciendo" },
  { value: "4", label: "Módulos", sub: "metabólicos" },
  { value: "3D", label: "Visualización", sub: "interactiva" },
  { value: "100%", label: "Gratis", sub: "siempre" },
];

const features = [
  { icon: "⚗️", title: "Visualización 3D Real", desc: "Estructuras cristalográficas directas del RCSB PDB. Rota, acerca y explora cada proteína en tiempo real.", color: "text-cyan-400" },
  { icon: "🎓", title: "Modo Estudiante", desc: "Explicaciones claras, visualización cartoon y conexión directa con escenarios clínicos de Nutrición Parenteral.", color: "text-amber-400" },
  { icon: "🔬", title: "Modo Investigador", desc: "Superficies electrostáticas, sitios activos, ligandos y link directo a AlphaFold DB para estructuras predichas por IA.", color: "text-emerald-400" },
  { icon: "💉", title: "Contexto NP Clínico", desc: "Cada proteína conectada a un escenario real de NP. Entiende el porqué detrás de cada parámetro de tu fórmula.", color: "text-violet-400" },
  { icon: "🗄️", title: "Base de Datos Escalable", desc: "Arquitectura JSON dinámica. De 48 a 500 proteínas sin reconstruir nada. La ciencia crece, el atlas también.", color: "text-rose-400" },
  { icon: "🌐", title: "Open Science", desc: "Datos de UniProt, RCSB PDB, AlphaFold DB y PubMed. Ciencia abierta, educación sin barreras.", color: "text-blue-400" },
];

const floatingBadges = [
  { text: "GLUT4", pos: "top-40 left-16", color: "text-cyan-400 border-cyan-500/20 bg-cyan-500/5", delay: "0s" },
  { text: "mTOR", pos: "top-56 right-20", color: "text-violet-400 border-violet-500/20 bg-violet-500/5", delay: "1s" },
  { text: "SOD2", pos: "bottom-56 left-24", color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5", delay: "2s" },
  { text: "ALB", pos: "bottom-40 right-16", color: "text-amber-400 border-amber-500/20 bg-amber-500/5", delay: "3s" },
  { text: "CPT1A", pos: "top-72 left-1/4", color: "text-rose-400 border-rose-500/20 bg-rose-500/5", delay: "0.5s" },
  { text: "NRF2", pos: "bottom-72 right-1/4", color: "text-blue-400 border-blue-500/20 bg-blue-500/5", delay: "1.5s" },
];

export default function Home() {
  return (
    <div className="relative">
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center molecular-grid overflow-hidden pt-20">
        {/* Blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyan-500/5 blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-violet-500/5 blur-3xl animate-float-delay" />
          <div className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full bg-emerald-500/5 blur-3xl animate-float-delay-2" />
        </div>

        {/* Floating protein names */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden hidden lg:block">
          {floatingBadges.map((b) => (
            <div
              key={b.text}
              className={`absolute ${b.pos} animate-float px-3 py-1.5 rounded-full border ${b.color} text-xs font-mono font-semibold opacity-50`}
              style={{ animationDelay: b.delay }}
            >
              {b.text}
            </div>
          ))}
        </div>

        <div className="relative z-10 text-center max-w-5xl mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Conectado con NutriVida NP · {stats[0].value} proteínas · Acceso libre
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight tracking-tight mb-6">
            <span className="gradient-text-white block">El Atlas Proteico</span>
            <span className="gradient-text-cyan block">que tu facultad</span>
            <span className="gradient-text-white block">no tiene</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            Visualiza en{" "}
            <span className="text-cyan-400 font-semibold">3D interactivo</span> las proteínas que hacen posible la{" "}
            <span className="text-amber-400 font-semibold">Nutrición Parenteral</span>.
            Contexto clínico real, modos Estudiante e Investigador. Gratis, siempre.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/modules"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-lg hover:opacity-90 transition-all shadow-xl shadow-cyan-500/25 hover:-translate-y-0.5"
            >
              Explorar Módulos →
            </Link>
            <Link
              href="/buscar"
              className="px-8 py-4 rounded-xl border border-slate-700 text-slate-300 font-semibold text-lg hover:border-slate-500 hover:text-white hover:bg-slate-800/50 transition-all"
            >
              🔍 Buscar Proteína
            </Link>
          </div>

          {/* Stats row */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {stats.map((s) => (
              <div key={s.label} className="glass rounded-xl p-4 text-center">
                <div className="text-3xl font-black gradient-text-cyan">{s.value}</div>
                <div className="text-sm font-semibold text-white mt-1">{s.label}</div>
                <div className="text-xs text-slate-500">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600 text-xs animate-bounce">
          <span>Descubre</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ── NutriVida Banner ── */}
      <section className="py-10 border-y border-slate-800/50 bg-gradient-to-r from-cyan-500/5 via-transparent to-violet-500/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-2xl flex-shrink-0 shadow-lg shadow-cyan-500/20">💊</div>
            <div>
              <h3 className="font-bold text-white text-lg">Integrado con NutriVida NP</h3>
              <p className="text-slate-400 text-sm mt-1 max-w-xl">
                Cada proteína está conectada a un escenario clínico real. Cuando calculas una fórmula en NutriVida,
                puedes entender exactamente qué proteínas la hacen funcionar a nivel molecular.
              </p>
            </div>
          </div>
          <a
            href="https://nutrivida.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 px-6 py-3 rounded-xl border border-cyan-500/30 text-cyan-400 font-medium hover:bg-cyan-500/10 transition-all text-sm"
          >
            Ir a NutriVida →
          </a>
        </div>
      </section>

      {/* ── Modules Preview ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">4 Módulos Moleculares</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Organizados por proceso metabólico, no por orden alfabético.
              Cada módulo cuenta una historia completa del metabolismo en NP.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {atlasData.modules.map((mod) => {
              const c = moduleColors[mod.id];
              return (
                <Link
                  key={mod.id}
                  href={`/modules/${mod.id}`}
                  className={`glass rounded-2xl p-6 border ${c.border} card-hover group transition-all`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-4xl">{mod.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium mb-2 ${c.badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
                        {mod.proteins.length} proteínas
                      </div>
                      <h3 className="text-xl font-bold text-white">{mod.name}</h3>
                      <p className={`text-sm font-medium ${c.text}`}>{mod.subtitle}</p>
                    </div>
                  </div>

                  <p className="text-sm text-slate-400 mb-5 line-clamp-2 leading-relaxed">{mod.description}</p>

                  <div className="flex flex-wrap gap-2 mb-5">
                    {mod.proteins.slice(0, 4).map((p) => (
                      <span key={p.id} className="text-xs px-2.5 py-1 rounded-full bg-slate-800/80 text-slate-300 font-mono border border-slate-700/50">
                        {p.name}
                      </span>
                    ))}
                    {mod.proteins.length > 4 && (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800/50 text-slate-500 border border-slate-700/30">
                        +{mod.proteins.length - 4}
                      </span>
                    )}
                  </div>

                  <div className={`flex items-center text-sm font-semibold ${c.text} opacity-70 group-hover:opacity-100 transition-opacity`}>
                    Explorar módulo
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/modules"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-300 font-semibold hover:border-slate-500 hover:text-white transition-all"
            >
              Ver todos los módulos →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">Por qué este atlas es diferente</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              No es una lista de Wikipedia con imágenes planas. Es una herramienta de trabajo real
              para el profesional de la salud moderno.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="glass rounded-2xl p-6 border border-slate-800/50 card-hover">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className={`text-lg font-bold mb-2 ${f.color}`}>{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass rounded-3xl p-12 border border-slate-800/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-violet-500/5 pointer-events-none" />
            <div className="relative z-10">
              <div className="text-5xl mb-6">🧬</div>
              <h2 className="text-4xl font-black text-white mb-4">La biotecnología al alcance de todos</h2>
              <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
                Ninguna herramienta en las facultades de salud permite al estudiante
                &quot;tocar&quot; la estructura afectada por una terapia intravenosa.{" "}
                <span className="text-white font-medium">Hasta ahora.</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/modules"
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:opacity-90 transition-all shadow-xl shadow-cyan-500/20"
                >
                  Comenzar a explorar
                </Link>
                <Link
                  href="/buscar"
                  className="px-8 py-4 rounded-xl border border-slate-700 text-slate-300 font-semibold hover:border-slate-500 hover:text-white transition-all"
                >
                  Buscar una proteína
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
