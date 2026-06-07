import Link from "next/link";
import { notFound } from "next/navigation";
import atlasData from "@/data/protein_atlas.json";

interface Props {
  params: Promise<{ moduleId: string }>;
}

const moduleStyle: Record<string, {
  gradient: string; border: string; cardBorder: string;
  badge: string; badgeText: string; dot: string; textColor: string; ring: string;
}> = {
  "canal-alimentacion": {
    gradient: "from-cyan-500/15 via-transparent to-blue-600/5",
    border: "border-cyan-500/40",
    cardBorder: "border-cyan-500/20 hover:border-cyan-500/50",
    badge: "bg-cyan-500/10 border-cyan-500/20",
    badgeText: "text-cyan-400",
    dot: "bg-cyan-400",
    textColor: "text-cyan-400",
    ring: "ring-cyan-500/20",
  },
  "laboratorio-hepatico": {
    gradient: "from-amber-500/15 via-transparent to-orange-600/5",
    border: "border-amber-500/40",
    cardBorder: "border-amber-500/20 hover:border-amber-500/50",
    badge: "bg-amber-500/10 border-amber-500/20",
    badgeText: "text-amber-400",
    dot: "bg-amber-400",
    textColor: "text-amber-400",
    ring: "ring-amber-500/20",
  },
  "sistema-defensa": {
    gradient: "from-emerald-500/15 via-transparent to-teal-600/5",
    border: "border-emerald-500/40",
    cardBorder: "border-emerald-500/20 hover:border-emerald-500/50",
    badge: "bg-emerald-500/10 border-emerald-500/20",
    badgeText: "text-emerald-400",
    dot: "bg-emerald-400",
    textColor: "text-emerald-400",
    ring: "ring-emerald-500/20",
  },
  "senalizacion-hormonal": {
    gradient: "from-violet-500/15 via-transparent to-purple-600/5",
    border: "border-violet-500/40",
    cardBorder: "border-violet-500/20 hover:border-violet-500/50",
    badge: "bg-violet-500/10 border-violet-500/20",
    badgeText: "text-violet-400",
    dot: "bg-violet-400",
    textColor: "text-violet-400",
    ring: "ring-violet-500/20",
  },
};

export async function generateStaticParams() {
  return atlasData.modules.map((m) => ({ moduleId: m.id }));
}

export default async function ModuleDetailPage({ params }: Props) {
  const { moduleId } = await params;
  const mod = atlasData.modules.find((m) => m.id === moduleId);
  if (!mod) notFound();

  const s = moduleStyle[mod.id] ?? moduleStyle["canal-alimentacion"];
  const allModules = atlasData.modules;
  const otherModules = allModules.filter((m) => m.id !== mod.id);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link href="/" className="hover:text-slate-300 transition-colors">Inicio</Link>
          <span>/</span>
          <Link href="/modules" className="hover:text-slate-300 transition-colors">Módulos</Link>
          <span>/</span>
          <span className={s.textColor}>{mod.name}</span>
        </div>

        {/* Module Hero */}
        <div className={`glass rounded-3xl border ${s.border} overflow-hidden mb-10`}>
          <div className={`bg-gradient-to-br ${s.gradient} p-10`}>
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold mb-4 ${s.badge} ${s.badgeText}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                  {mod.proteins.length} proteínas en este módulo
                </div>
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-6xl">{mod.icon}</span>
                  <div>
                    <h1 className="text-4xl font-black text-white">{mod.name}</h1>
                    <p className={`text-xl font-semibold ${s.textColor}`}>{mod.subtitle}</p>
                  </div>
                </div>
                <p className="text-slate-300 text-lg leading-relaxed mt-4 max-w-3xl">{mod.description}</p>
              </div>
            </div>
          </div>

          {/* NP Context */}
          <div className="px-10 py-6 border-t border-slate-800/50 bg-black/20">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-xl flex-shrink-0">
                💊
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Relevancia en Nutrición Parenteral</p>
                <p className="text-slate-300 leading-relaxed">{mod.npContext}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Protein grid */}
        <h2 className="text-2xl font-black text-white mb-6">
          Proteínas del módulo
          <span className={`ml-3 text-lg font-normal ${s.textColor}`}>({mod.proteins.length})</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {mod.proteins.map((protein) => (
            <Link
              key={protein.id}
              href={`/proteina/${protein.id}`}
              className={`glass rounded-2xl border ${s.cardBorder} p-5 card-hover group transition-all duration-300`}
            >
              {/* Top bar */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-mono font-black text-xl ${s.textColor}`}>{protein.name}</span>
                    {protein.pdbId && (
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-500 font-mono">
                        PDB: {protein.pdbId}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-300 font-medium leading-tight">{protein.fullName}</p>
                </div>
              </div>

              {/* Category + weight */}
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs px-2 py-0.5 rounded-full border ${s.badge} ${s.badgeText} font-medium`}>
                  {protein.category}
                </span>
                <span className="text-xs text-slate-600">{protein.weight}</span>
              </div>

              {/* Student summary */}
              <p className="text-sm text-slate-400 leading-relaxed mb-4 line-clamp-3">
                {protein.studentSummary}
              </p>

              {/* NP Relevance preview */}
              <div className="p-3 rounded-xl bg-black/30 border border-slate-800/50 mb-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">En NP</p>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{protein.npRelevance}</p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {protein.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-500">
                    {tag}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <div className={`flex items-center gap-1 text-sm font-semibold ${s.textColor} opacity-60 group-hover:opacity-100 transition-opacity`}>
                Ver estructura 3D
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* Other modules */}
        <div className="border-t border-slate-800/50 pt-12">
          <h3 className="text-xl font-bold text-white mb-6">Otros módulos</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {otherModules.map((om) => {
              const os = moduleStyle[om.id];
              return (
                <Link
                  key={om.id}
                  href={`/modules/${om.id}`}
                  className={`glass rounded-xl border ${os?.cardBorder ?? "border-slate-700"} p-4 card-hover group transition-all`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{om.icon}</span>
                    <div>
                      <p className={`text-sm font-bold ${os?.textColor ?? "text-slate-300"}`}>{om.name}</p>
                      <p className="text-xs text-slate-500">{om.proteins.length} proteínas</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
