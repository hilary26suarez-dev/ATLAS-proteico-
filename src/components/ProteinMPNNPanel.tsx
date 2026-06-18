"use client";

interface Props {
  pdbId: string;
  proteinName: string;
  uniprotId: string;
  hasLigands: boolean;
}

const TOOLS = [
  {
    name: "ProteinMPNN",
    desc: "Diseña nuevas secuencias que mantienen el mismo fold 3D. Ideal para optimizar estabilidad, expresión y propiedades de la proteína.",
    icon: "🧬",
    color: "border-cyan-500/20 hover:border-cyan-500/50 text-cyan-400",
    badgeColor: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400",
    links: [
      {
        label: "ColabNotebook — ProteinMPNN",
        url: "https://colab.research.google.com/github/dauparas/ProteinMPNN/blob/main/examples/ProteinMPNN_run_examples.ipynb",
        icon: "📓",
      },
      {
        label: "Repo GitHub (dauparas)",
        url: "https://github.com/dauparas/ProteinMPNN",
        icon: "🐙",
      },
    ],
    howTo: "Sube el PDB ID directamente al notebook. Ajusta `sampling_temp` (0.1–0.3) para controlar diversidad de secuencias.",
  },
  {
    name: "LigandMPNN",
    desc: "Extensión de ProteinMPNN que tiene en cuenta la presencia de ligandos, cofactores y moléculas pequeñas en el sitio activo.",
    icon: "💊",
    color: "border-amber-500/20 hover:border-amber-500/50 text-amber-400",
    badgeColor: "bg-amber-500/10 border-amber-500/20 text-amber-400",
    links: [
      {
        label: "ColabNotebook — LigandMPNN",
        url: "https://colab.research.google.com/github/dauparas/LigandMPNN/blob/main/examples/run_LigandMPNN.ipynb",
        icon: "📓",
      },
      {
        label: "Repo GitHub (dauparas)",
        url: "https://github.com/dauparas/LigandMPNN",
        icon: "🐙",
      },
    ],
    howTo: "Usa LigandMPNN cuando el sitio activo contiene un ligando/cofactor. Fija las posiciones del sitio activo con `--fixed_positions_jsonl`.",
  },
  {
    name: "AlphaFold3 / ColabFold",
    desc: "Predicción de estructura de alta confianza. Valida que las secuencias diseñadas por ProteinMPNN mantienen el fold esperado.",
    icon: "🤖",
    color: "border-violet-500/20 hover:border-violet-500/50 text-violet-400",
    badgeColor: "bg-violet-500/10 border-violet-500/20 text-violet-400",
    links: [
      {
        label: "ColabFold (AlphaFold2 rápido)",
        url: "https://colab.research.google.com/github/sokrypton/ColabFold/blob/main/AlphaFold2.ipynb",
        icon: "📓",
      },
      {
        label: "AlphaFold Server (DeepMind)",
        url: "https://alphafoldserver.com",
        icon: "🌐",
      },
    ],
    howTo: "Pega la secuencia diseñada por ProteinMPNN en ColabFold para verificar que el modelo predice el mismo fold que la estructura original.",
  },
];

export default function ProteinMPNNPanel({ pdbId, proteinName, hasLigands }: Props) {
  const visibleTools = hasLigands ? TOOLS : TOOLS.filter((t) => t.name !== "LigandMPNN");

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="glass rounded-2xl border border-violet-500/20 p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-xl">
            ⚙️
          </div>
          <div>
            <h4 className="font-bold text-white">Diseño de Secuencias</h4>
            <p className="text-xs text-slate-500">ProteinMPNN ecosystem · Baker Lab & Dauparas et al.</p>
          </div>
        </div>
        <p className="text-sm text-slate-400 leading-relaxed">
          ProteinMPNN es un modelo de aprendizaje profundo (Message Passing Neural Network) que diseña
          nuevas secuencias de aminoácidos para un backbone dado. Dado el PDB{" "}
          <span className="font-mono text-violet-400">{pdbId}</span> de{" "}
          <span className="font-semibold text-white">{proteinName}</span>, puedes generar variantes
          con propiedades mejoradas manteniendo la misma arquitectura 3D.
        </p>

        {/* Quick workflow */}
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          {[
            `PDB: ${pdbId}`,
            "→",
            "ProteinMPNN",
            "→",
            "Nuevas secuencias",
            "→",
            "AlphaFold validación",
          ].map((step, i) => (
            <span
              key={i}
              className={
                step === "→"
                  ? "text-slate-600 text-sm"
                  : "px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300"
              }
            >
              {step}
            </span>
          ))}
        </div>
      </div>

      {/* Tool cards */}
      {visibleTools.map((tool) => (
        <div key={tool.name} className={`glass rounded-2xl border ${tool.color} p-5 transition-all duration-200`}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{tool.icon}</span>
            <div>
              <h5 className="font-bold text-white">{tool.name}</h5>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${tool.badgeColor} font-medium`}>
                Open Source · Colab disponible
              </span>
            </div>
          </div>

          <p className="text-sm text-slate-400 mb-3 leading-relaxed">{tool.desc}</p>

          {/* How to use */}
          <div className="p-3 rounded-xl bg-black/30 border border-slate-800/50 mb-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">💡 Cómo usar</p>
            <p className="text-xs text-slate-400 leading-relaxed">{tool.howTo}</p>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-2">
            {tool.links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 transition-all group text-sm"
              >
                <span>{link.icon}</span>
                <span className="text-slate-300 group-hover:text-white transition-colors">{link.label}</span>
                <svg className="w-3.5 h-3.5 ml-auto text-slate-600 group-hover:text-slate-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      ))}

      {/* Script explicado */}
      <div className="glass rounded-2xl border border-slate-700/50 p-5">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          📋 Cómo ejecutar ProteinMPNN localmente
        </p>
        <p className="text-xs text-slate-500 mb-4">
          Primero descarga el PDB de {proteinName} desde el botón ⬇ PDB arriba.
          Luego clona el repo de ProteinMPNN y ejecuta:
        </p>

        {/* Comando con anotaciones */}
        <div className="rounded-xl overflow-hidden border border-slate-800/80 mb-4">
          <div className="px-3 py-2 flex items-center gap-2" style={{ background: "rgba(0,0,0,0.5)" }}>
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
            <span className="text-xs text-slate-600 ml-2 font-mono">terminal</span>
          </div>
          <pre className="text-xs font-mono bg-black/40 p-4 overflow-x-auto leading-loose">
            <span style={{ color: "#7c9e6b" }}># 1. Clona el repositorio</span>{"\n"}
            <span style={{ color: "#4A9EFF" }}>git clone</span>
            <span style={{ color: "#e2e8f0" }}> https://github.com/dauparas/ProteinMPNN{"\n"}</span>
            <span style={{ color: "#e2e8f0" }}>cd ProteinMPNN{"\n\n"}</span>
            <span style={{ color: "#7c9e6b" }}># 2. Ejecuta el diseño de secuencias</span>{"\n"}
            <span style={{ color: "#4A9EFF" }}>python</span>
            <span style={{ color: "#e2e8f0" }}> protein_mpnn_run.py \{"\n"}</span>
            <span style={{ color: "#f5a623" }}>  --pdb_path</span>
            <span style={{ color: "#00FF88" }}> {pdbId.toLowerCase()}.pdb</span>
            <span style={{ color: "#64748b" }}>          # ← archivo PDB descargado{"\n"}</span>
            <span style={{ color: "#f5a623" }}>  --out_folder</span>
            <span style={{ color: "#00FF88" }}> ./output_{pdbId.toLowerCase()}/</span>
            <span style={{ color: "#64748b" }}>    # ← carpeta de resultados{"\n"}</span>
            <span style={{ color: "#f5a623" }}>  --num_seq_per_target</span>
            <span style={{ color: "#00FF88" }}> 10</span>
            <span style={{ color: "#64748b" }}>           # ← cuántas secuencias generar{"\n"}</span>
            <span style={{ color: "#f5a623" }}>  --sampling_temp</span>
            <span style={{ color: "#00FF88" }}> &quot;0.1 0.2&quot;</span>
            <span style={{ color: "#64748b" }}>      # ← 0.1=conservador, 0.5=diverso{"\n"}</span>
            <span style={{ color: "#f5a623" }}>  --model_name</span>
            <span style={{ color: "#00FF88" }}> v_48_020</span>
            <span style={{ color: "#64748b" }}>           # ← modelo recomendado{"\n"}</span>
          </pre>
        </div>

        {/* Qué obtienes */}
        <div className="p-4 rounded-xl" style={{ background: "var(--bg-raised)", border: "1px solid rgba(255,255,255,0.05)" }}>
          <p className="text-xs font-bold mb-2" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono, monospace)" }}>¿QUÉ OBTIENES EN LA CARPETA output/?</p>
          <ul className="space-y-1.5">
            {[
              { f: "seqs/", desc: "Secuencias diseñadas en formato FASTA, una por temperatura" },
              { f: "scores/", desc: "Puntuación de cada secuencia (menor = mejor ajuste al backbone)" },
              { f: "probs/", desc: "Probabilidades residuo a residuo para análisis de posiciones clave" },
            ].map((item) => (
              <li key={item.f} className="flex items-start gap-2 text-xs">
                <span className="font-mono font-bold flex-shrink-0" style={{ color: "var(--teal)" }}>{item.f}</span>
                <span style={{ color: "var(--text-muted)" }}>{item.desc}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs mt-3 pt-3 border-t" style={{ color: "var(--text-faint)", borderColor: "rgba(255,255,255,0.05)" }}>
            Siguiente paso: pega las secuencias del archivo FASTA en{" "}
            <a href="https://colab.research.google.com/github/sokrypton/ColabFold/blob/main/AlphaFold2.ipynb" target="_blank" rel="noopener noreferrer"
              className="hover:opacity-80" style={{ color: "#a78bfa" }}>ColabFold</a>
            {" "}para verificar que el modelo predice el mismo fold que la estructura original de {proteinName}.
          </p>
        </div>
      </div>
    </div>
  );
}
