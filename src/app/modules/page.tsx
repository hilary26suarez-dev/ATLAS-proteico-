import Link from "next/link";
import atlasData from "@/data/protein_atlas.json";
import ModuleProgressBar from "@/components/ModuleProgressBar";

const moduleStyle: Record<string, {
  gradient: string; border: string; badgeBg: string; badgeText: string;
  badgeBorder: string; dot: string; glow: string; textColor: string; color: string;
}> = {
  "canal-alimentacion": {
    gradient: "from-cyan-500/20 to-blue-600/5",
    border: "border-cyan-500/30 hover:border-cyan-500/70",
    badgeBg: "bg-cyan-500/10", badgeText: "text-cyan-400", badgeBorder: "border-cyan-500/20",
    dot: "bg-cyan-400", glow: "shadow-cyan-500/10", textColor: "text-cyan-400", color: "#22d3ee",
  },
  "laboratorio-hepatico": {
    gradient: "from-amber-500/20 to-orange-600/5",
    border: "border-amber-500/30 hover:border-amber-500/70",
    badgeBg: "bg-amber-500/10", badgeText: "text-amber-400", badgeBorder: "border-amber-500/20",
    dot: "bg-amber-400", glow: "shadow-amber-500/10", textColor: "text-amber-400", color: "#fbbf24",
  },
  "sistema-defensa": {
    gradient: "from-emerald-500/20 to-teal-600/5",
    border: "border-emerald-500/30 hover:border-emerald-500/70",
    badgeBg: "bg-emerald-500/10", badgeText: "text-emerald-400", badgeBorder: "border-emerald-500/20",
    dot: "bg-emerald-400", glow: "shadow-emerald-500/10", textColor: "text-emerald-400", color: "#34d399",
  },
  "senalizacion-hormonal": {
    gradient: "from-violet-500/20 to-purple-600/5",
    border: "border-violet-500/30 hover:border-violet-500/70",
    badgeBg: "bg-violet-500/10", badgeText: "text-violet-400", badgeBorder: "border-violet-500/20",
    dot: "bg-violet-400", glow: "shadow-violet-500/10", textColor: "text-violet-400", color: "#a78bfa",
  },
};

export default function ModulesPage() {
  const totalProteins = atlasData.modules.reduce((a, m) => a + m.proteins.length, 0);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-700 bg-slate-800/40 text-slate-400 text-sm mb-6">
            <span className="text-lg">🧬</span>
            {atlasData.modules.length} módulos · {totalProteins} proteínas
          </div>
          <h1 className="text-5xl font-black text-white mb-4">
            Módulos Moleculares
          </h1>
          <p className="text-slate-400 text-xl max-w-3xl mx-auto leading-relaxed">
            El metabolismo no existe como una lista de proteínas aisladas. Aquí cada módulo
            cuenta la historia completa de un proceso metabólico crítico en Nutrición Parenteral.
          </p>
        </div>

        {/* Module cards */}
        <div className="space-y-8">
          {atlasData.modules.map((mod, idx) => {
            const s = moduleStyle[mod.id];
            return (
              <div
                key={mod.id}
                className={`glass rounded-3xl border ${s.border} overflow-hidden transition-all duration-300 shadow-xl ${s.glow}`}
              >
                {/* Module header */}
                <div className={`bg-gradient-to-r ${s.gradient} p-8 border-b border-slate-800/50`}>
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    <div className="flex items-center gap-5">
                      <div className="text-6xl">{mod.icon}</div>
                      <div>
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold mb-3 ${s.badgeBg} ${s.badgeText} ${s.badgeBorder}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                          Módulo {String(idx + 1).padStart(2, "0")} · {mod.proteins.length} proteínas
                        </div>
                        <h2 className="text-3xl font-black text-white">{mod.name}</h2>
                        <p className={`text-lg font-semibold mt-1 ${s.textColor}`}>{mod.subtitle}</p>
                      </div>
                    </div>

                    <div className="lg:ml-auto">
                      <Link
                        href={`/modules/${mod.id}`}
                        className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all ${s.badgeBg} ${s.badgeText} border ${s.badgeBorder} hover:opacity-80`}
                      >
                        Explorar módulo completo
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>

                  <p className="text-slate-300 mt-4 text-base leading-relaxed max-w-4xl">{mod.description}</p>

                  {/* Progreso del módulo */}
                  <div className="mt-4">
                    <ModuleProgressBar
                      proteinIds={mod.proteins.map((p) => p.id)}
                      color={s.color}
                    />
                  </div>

                  {/* NP Context box */}
                  <div className="mt-4 p-4 rounded-xl bg-black/20 border border-white/5">
                    <div className="flex items-start gap-3">
                      <span className="text-xl mt-0.5">💊</span>
                      <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Contexto NP</p>
                        <p className="text-sm text-slate-300 leading-relaxed">{mod.npContext}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Protein grid preview */}
                <div className="p-6">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
                    Proteínas en este módulo
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                    {mod.proteins.map((protein) => (
                      <Link
                        key={protein.id}
                        href={`/proteina/${protein.id}`}
                        className="group flex flex-col items-start p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 hover:border-slate-600 hover:bg-slate-800/80 transition-all duration-200"
                      >
                        <span className={`text-xs font-mono font-bold ${s.textColor} mb-1`}>{protein.name}</span>
                        <span className="text-xs text-slate-500 leading-tight line-clamp-2">{protein.category}</span>
                        <div className="mt-2 flex items-center gap-1 text-slate-600 group-hover:text-slate-400 transition-colors">
                          <span className="text-xs">Ver 3D</span>
                          <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center glass rounded-2xl p-8 border border-slate-800/50">
          <h3 className="text-2xl font-bold text-white mb-2">¿Buscas una proteína específica?</h3>
          <p className="text-slate-400 mb-6">Usa el buscador para encontrar cualquier proteína por nombre, gen o función.</p>
          <Link
            href="/buscar"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white font-semibold hover:bg-slate-600 transition-all"
          >
            🔍 Ir al buscador
          </Link>
        </div>
      </div>
    </div>
  );
}
