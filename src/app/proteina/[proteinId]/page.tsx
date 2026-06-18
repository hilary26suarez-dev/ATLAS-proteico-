import { notFound } from "next/navigation";
import Link from "next/link";
import atlasData from "@/data/protein_atlas.json";
import ProteinDetailClient from "@/components/ProteinDetailClient";

interface Props {
  params: Promise<{ proteinId: string }>;
}

const moduleStyle: Record<string, { text: string; badge: string; badgeText: string; dot: string; border: string }> = {
  "canal-alimentacion": { text: "text-cyan-400", badge: "bg-cyan-500/10 border-cyan-500/20", badgeText: "text-cyan-400", dot: "bg-cyan-400", border: "border-cyan-500/30" },
  "laboratorio-hepatico": { text: "text-amber-400", badge: "bg-amber-500/10 border-amber-500/20", badgeText: "text-amber-400", dot: "bg-amber-400", border: "border-amber-500/30" },
  "sistema-defensa": { text: "text-emerald-400", badge: "bg-emerald-500/10 border-emerald-500/20", badgeText: "text-emerald-400", dot: "bg-emerald-400", border: "border-emerald-500/30" },
  "senalizacion-hormonal": { text: "text-violet-400", badge: "bg-violet-500/10 border-violet-500/20", badgeText: "text-violet-400", dot: "bg-violet-400", border: "border-violet-500/30" },
};

export async function generateStaticParams() {
  return atlasData.modules.flatMap((m) => m.proteins.map((p) => ({ proteinId: p.id })));
}

export default async function ProteinDetailPage({ params }: Props) {
  const { proteinId } = await params;

  let protein = null;
  let parentModule = null;

  for (const mod of atlasData.modules) {
    const found = mod.proteins.find((p) => p.id === proteinId);
    if (found) {
      protein = found;
      parentModule = mod;
      break;
    }
  }

  if (!protein || !parentModule) notFound();

  const mc = moduleStyle[parentModule.id] ?? moduleStyle["canal-alimentacion"];

  // Find prev/next in module
  const siblings = parentModule.proteins;
  const currentIdx = siblings.findIndex((p) => p.id === proteinId);
  const prev = siblings[currentIdx - 1] ?? null;
  const next = siblings[currentIdx + 1] ?? null;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-8 flex-wrap">
          <Link href="/" className="hover:text-slate-300 transition-colors">Inicio</Link>
          <span>/</span>
          <Link href="/modules" className="hover:text-slate-300 transition-colors">Módulos</Link>
          <span>/</span>
          <Link href={`/modules/${parentModule.id}`} className={`hover:opacity-80 transition-opacity ${mc.text}`}>
            {parentModule.name}
          </Link>
          <span>/</span>
          <span className="text-white font-mono font-bold">{protein.name}</span>
        </div>

        {/* Protein header */}
        <div className="glass rounded-3xl border border-slate-800/50 p-8 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-start gap-6">
              <div className="flex-1">
                {/* Module badge */}
                <Link
                  href={`/modules/${parentModule.id}`}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold mb-5 hover:opacity-80 transition-opacity ${mc.badge} ${mc.badgeText}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${mc.dot}`} />
                  {parentModule.icon} {parentModule.name}
                </Link>

                <div className="flex items-start gap-4 mb-2">
                  <div>
                    <h1 className="text-4xl sm:text-5xl font-black">
                      <span className={mc.text}>{protein.name}</span>
                    </h1>
                    <p className="text-xl text-slate-300 font-medium mt-1">{protein.fullName}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mt-4">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50 text-sm text-slate-300">
                    <span className="font-mono text-xs text-slate-500">GEN</span>
                    <span className="font-mono font-bold">{protein.gene}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50 text-sm text-slate-300">
                    <span className="font-mono text-xs text-slate-500">PDB</span>
                    <span className="font-mono font-bold">{protein.pdbId}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50 text-sm text-slate-300">
                    <span className="font-mono text-xs text-slate-500">PESO</span>
                    <span className="font-mono font-bold">{protein.weight}</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50 text-sm text-slate-400">
                    {protein.category}
                  </div>
                </div>
              </div>

              {/* Quick links */}
              <div className="flex flex-col gap-2 min-w-[200px]">
                <a
                  href={protein.pdbUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-300 text-sm font-medium hover:border-slate-500 hover:text-white transition-all"
                >
                  🏛️ RCSB PDB
                  <svg className="w-3.5 h-3.5 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                <a
                  href={protein.alphafoldUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-400 text-sm font-medium hover:opacity-80 transition-opacity"
                >
                  🤖 AlphaFold DB
                  <svg className="w-3.5 h-3.5 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                <a
                  href={`https://www.uniprot.org/uniprotkb/${protein.uniprotId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium hover:opacity-80 transition-opacity"
                >
                  🧬 UniProt
                  <svg className="w-3.5 h-3.5 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive client component */}
        <ProteinDetailClient protein={protein as any} moduleColor={mc} moduleId={parentModule.id} />

        {/* Prev / Next navigation */}
        <div className="mt-10 flex items-center justify-between gap-4">
          {prev ? (
            <Link
              href={`/proteina/${prev.id}`}
              className="flex items-center gap-3 px-5 py-3 rounded-xl glass border border-slate-800 hover:border-slate-700 transition-all group"
            >
              <svg className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:-translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <div>
                <p className="text-xs text-slate-600">Anterior</p>
                <p className={`text-sm font-bold ${mc.text}`}>{prev.name}</p>
              </div>
            </Link>
          ) : <div />}

          {next ? (
            <Link
              href={`/proteina/${next.id}`}
              className="flex items-center gap-3 px-5 py-3 rounded-xl glass border border-slate-800 hover:border-slate-700 transition-all group text-right"
            >
              <div>
                <p className="text-xs text-slate-600">Siguiente</p>
                <p className={`text-sm font-bold ${mc.text}`}>{next.name}</p>
              </div>
              <svg className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : <div />}
        </div>
      </div>
    </div>
  );
}
