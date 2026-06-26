import ModuleProgressBar from "@/components/ModuleProgressBar";
import atlasData from "@/data/protein_atlas.json";
import { getModuleTheme } from "@/lib/moduleThemes";
import Link from "next/link";

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
          {atlasData.modules.filter((m) => m.id !== "vitaminas-y-cofactores").map((mod, idx) => {
          const s = getModuleTheme(mod.id);
            return (
              <div
                key={mod.id}
              className={`glass rounded-3xl border ${s.moduleBorder} overflow-hidden transition-all duration-300 shadow-xl ${s.glow}`}
              >
                {/* Module header */}
              <div className={`bg-gradient-to-r ${s.moduleGradient} p-8 border-b border-slate-800/50`}>
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    <div className="flex items-center gap-5">
                      {(mod as { icon?: string }).icon && <div className="text-6xl">{(mod as { icon?: string }).icon}</div>}
                      <div>
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold mb-3 ${s.badgeBg} ${s.badgeText} ${s.badgeBorder}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                          Módulo {String(idx + 1).padStart(2, "0")} · {mod.proteins.length} proteínas
                        </div>
                        <h2 className="text-3xl font-black text-white">{mod.name}</h2>
                        {(mod as { subtitle?: string }).subtitle && <p className={`text-lg font-semibold mt-1 ${s.textColor}`}>{(mod as { subtitle?: string }).subtitle}</p>}
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
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Contexto Clínico</p>
                        <p className="text-sm text-slate-300 leading-relaxed">{(mod as { npContext?: string }).npContext ?? mod.description}</p>
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

        {/* Vitaminas special card */}
        <div className="mt-8 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ background: "rgba(250,204,21,0.06)", border: "1px solid rgba(250,204,21,0.20)" }}>
          <div className="flex items-center gap-4">
            <span className="text-4xl">☀️</span>
            <div>
              <p className="font-display font-black text-xl" style={{ color: "#facc15" }}>Vitaminas y Cofactores</p>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>12 moléculas · Visor 3D de coenzimas activas desde RCSB</p>
            </div>
          </div>
          <Link href="/vitaminas"
            className="flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: "rgba(250,204,21,0.15)", border: "1px solid rgba(250,204,21,0.35)", color: "#facc15", fontFamily: "var(--font-mono, monospace)" }}>
            Ver módulo especial →
          </Link>
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 text-center glass rounded-2xl p-8 border border-slate-800/50">
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
