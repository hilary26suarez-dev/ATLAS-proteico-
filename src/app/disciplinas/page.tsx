import atlasData from "@/data/protein_atlas.json";
import { getModuleTheme } from "@/lib/moduleThemes";
import Link from "next/link";

const DISCIPLINES = [
  {
    id: "Medicina",
    label: "Medicina",
    icon: "⚕",
    description: "Fisiopatología, diagnóstico clínico y terapéutica médica. Proteínas en la base de las enfermedades más prevalentes.",
    color: "#4a9eff",
    bg: "rgba(74,158,255,0.08)",
    border: "rgba(74,158,255,0.25)",
  },
  {
    id: "Farmacia",
    label: "Farmacia",
    icon: "⚗",
    description: "Mecanismos de acción farmacológica, dianas terapéuticas, interacciones y farmacogenómica.",
    color: "#00ff88",
    bg: "rgba(0,255,136,0.08)",
    border: "rgba(0,255,136,0.25)",
  },
  {
    id: "Nutricion",
    label: "Nutrición",
    icon: "◈",
    description: "Metabolismo de nutrientes, absorción intestinal, regulación del apetito y nutrición clínica especializada.",
    color: "#f5a623",
    bg: "rgba(245,166,35,0.08)",
    border: "rgba(245,166,35,0.25)",
  },
  {
    id: "Biotecnologia",
    label: "Biotecnología",
    icon: "◉",
    description: "Proteínas recombinantes, biofármacos, terapia génica, diagnóstico molecular y biología sintética.",
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.08)",
    border: "rgba(167,139,250,0.25)",
  },
];

type Protein = {
  id: string;
  name: string;
  gene?: string;
  category?: string;
  disciplines?: string[];
};

type ModuleEntry = {
  id: string;
  name: string;
  proteins: Protein[];
};

function getProteinsByDiscipline(disciplineId: string) {
  const results: { protein: Protein; moduleId: string; moduleName: string }[] = [];
  for (const mod of atlasData.modules as ModuleEntry[]) {
    for (const protein of mod.proteins) {
      if (protein.disciplines?.includes(disciplineId)) {
        results.push({ protein, moduleId: mod.id, moduleName: mod.name });
      }
    }
  }
  return results;
}

export default function DisciplinasPage() {
  const counts = DISCIPLINES.map((d) => ({
    ...d,
    count: getProteinsByDiscipline(d.id).length,
  }));

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>

      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-14 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 molecular-grid pointer-events-none opacity-60" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(167,139,250,0.06) 0%, transparent 70%)" }} />

        <div className="relative max-w-7xl mx-auto" style={{ zIndex: 2 }}>
          <p className="text-xs tracking-[0.22em] mb-4"
            style={{ color: "var(--teal)", fontFamily: "var(--font-mono, monospace)" }}>
            ATLAS PROTEICO · EXPLORACIÓN POR DISCIPLINA
          </p>
          <h1 className="font-display font-black leading-[0.9] tracking-tight mb-6"
            style={{ fontSize: "clamp(2.8rem,7vw,5.5rem)", color: "var(--text)" }}>
            PROTEÍNAS POR
            <br />
            <span style={{ color: "#a78bfa" }}>DISCIPLINA</span>
          </h1>
          <p className="max-w-2xl text-base sm:text-lg leading-relaxed mb-10"
            style={{ color: "var(--text-muted)" }}>
            Cada proteína del atlas está etiquetada por su relevancia para{" "}
            <span style={{ color: "var(--text)" }}>Medicina, Farmacia, Nutrición y Biotecnología</span>.
            Filtra las 195 proteínas desde la perspectiva de tu disciplina.
          </p>

          {/* Discipline summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {counts.map((d) => (
              <a key={d.id} href={`#${d.id}`}
                className="rounded-xl p-4 transition-all hover:scale-[1.02]"
                style={{ background: d.bg, border: `1px solid ${d.border}` }}>
                <div className="text-2xl mb-2">{d.icon}</div>
                <div className="font-display font-black text-2xl mb-1" style={{ color: d.color }}>
                  {d.count}
                </div>
                <div className="text-sm font-semibold" style={{ color: "var(--text)" }}>{d.label}</div>
                <div className="text-xs mt-1" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono, monospace)" }}>
                  proteínas
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Discipline sections */}
      {DISCIPLINES.map((disc) => {
        const entries = getProteinsByDiscipline(disc.id);
        return (
          <section key={disc.id} id={disc.id}
            className="px-4 sm:px-6 lg:px-8 py-14 border-t"
            style={{ borderColor: "rgba(255,255,255,0.05)" }}>
            <div className="max-w-7xl mx-auto">

              {/* Section header */}
              <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-10">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{disc.icon}</span>
                    <h2 className="font-display font-black text-4xl" style={{ color: disc.color }}>
                      {disc.label}
                    </h2>
                    <span className="text-xs px-2.5 py-1 rounded-full ml-1"
                      style={{ color: disc.color, background: disc.bg, border: `1px solid ${disc.border}`, fontFamily: "var(--font-mono, monospace)" }}>
                      {entries.length} proteínas
                    </span>
                  </div>
                  <p className="max-w-2xl text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                    {disc.description}
                  </p>
                </div>
              </div>

              {/* Protein grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {entries.map(({ protein, moduleId, moduleName }) => {
                  const mc = getModuleTheme(moduleId);
                  return (
                    <Link key={protein.id} href={`/proteina/${protein.id}`}
                      className="group rounded-xl p-4 transition-all hover:scale-[1.01]"
                      style={{
                        background: "var(--bg-card)",
                        border: `1px solid rgba(255,255,255,0.07)`,
                      }}>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold leading-snug truncate"
                            style={{ color: "var(--text)" }}>
                            {protein.name}
                          </p>
                          {protein.gene && (
                            <p className="text-xs mt-0.5"
                              style={{ color: mc.color, fontFamily: "var(--font-mono, monospace)" }}>
                              {protein.gene}
                            </p>
                          )}
                        </div>
                        {protein.category && (
                          <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                            style={{
                              color: mc.color,
                              background: `${mc.color}12`,
                              border: `1px solid ${mc.color}25`,
                              fontFamily: "var(--font-mono, monospace)",
                            }}>
                            {protein.category}
                          </span>
                        )}
                      </div>
                      <p className="text-xs" style={{ color: "var(--text-faint)", fontFamily: "var(--font-mono, monospace)" }}>
                        {moduleName}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })}

      {/* Back to atlas */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 text-center">
        <Link href="/modules"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold"
          style={{
            color: "#061018",
            background: "linear-gradient(135deg, #00ff88, #4a9eff)",
            fontFamily: "var(--font-mono, monospace)",
          }}>
          Ver todos los módulos →
        </Link>
      </section>
    </div>
  );
}
