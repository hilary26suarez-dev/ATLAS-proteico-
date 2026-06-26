import Link from "next/link";

const TOOLS = [
  {
    name: "RCSB PDB",
    subtitle: "Estructuras experimentales · Rayos X · Cryo-EM",
    icon: "🏛️",
    color: "#22d3ee",
    what: "La base de datos más grande de estructuras proteicas obtenidas experimentalmente. Si una proteína tiene PDB ID en el atlas, su estructura fue resuelta por cristalografía de rayos X, cryo-EM u otros métodos físicos reales.",
    whenToUse: "Cuando necesitas la estructura 3D más precisa disponible. Resolución en ángstroms. Fuente primaria para publicaciones científicas.",
    examples: [
      { label: "Albumina (1AO6)", href: "/proteina/albumina" },
      { label: "Hemoglobina (2HHB)", href: "/proteina/hemoglobina" },
      { label: "CYP3A4 (1W0F)", href: "/proteina/cyp3a4" },
    ],
    externalHref: "https://www.rcsb.org",
    externalLabel: "Abrir RCSB PDB",
    tip: "Escribe el PDB ID directamente en el buscador (ej: 1AO6). Puedes ver la estructura en 3D, descargar el .pdb y ver todas las publicaciones asociadas.",
  },
  {
    name: "AlphaFold EBI",
    subtitle: "Predicción estructural por IA · DeepMind + EMBL-EBI",
    icon: "🤖",
    color: "#a78bfa",
    what: "AlphaFold predice la estructura 3D de una proteína directamente desde su secuencia de aminoácidos. La base de datos EBI tiene predicciones de más de 200 millones de proteínas con una precisión comparable a la cristalografía.",
    whenToUse: "Cuando la proteína no tiene estructura experimental disponible. El atlas usa AlphaFold para 28 proteínas sin PDB. El score pLDDT (0–100) indica cuánto confiar en cada región.",
    examples: [
      { label: "ANGPTL3 (Q9Y5C1)", href: "/proteina/angptl3" },
      { label: "LDLR (P01130)", href: "/proteina/ldlr" },
      { label: "PDH E1α (P08559)", href: "/proteina/pdha1" },
    ],
    externalHref: "https://alphafold.ebi.ac.uk",
    externalLabel: "Abrir AlphaFold EBI",
    tip: "Busca por nombre de proteína o ID de UniProt. El color en la estructura refleja la confianza: azul oscuro (>90) = muy confiable, naranja (<50) = región desordenada.",
  },
  {
    name: "UniProt",
    subtitle: "Base de datos universal de proteínas · Secuencia + función",
    icon: "🧬",
    color: "#34d399",
    what: "UniProt es la fuente más completa de información funcional sobre proteínas. Contiene secuencia, función, variantes patogénicas, interacciones, localización celular y referencias bibliográficas curadas manualmente.",
    whenToUse: "Cuando necesitas información detallada sobre la función de una proteína, sus variantes clínicas conocidas, o su secuencia en formato FASTA para análisis bioinformático.",
    examples: [
      { label: "PAH · P12694", href: "/proteina/pah" },
      { label: "GPX4 · P36969", href: "/proteina/gpx4" },
      { label: "TTR · P02766", href: "/proteina/ttr" },
    ],
    externalHref: "https://www.uniprot.org",
    externalLabel: "Abrir UniProt",
    tip: "Los IDs del atlas (alphafoldId / uniprotId) son IDs de UniProt. Pégalo directamente en uniprot.org para ver la ficha completa. La pestaña 'Disease & Variants' muestra variantes patogénicas conocidas.",
  },
  {
    name: "Human Protein Atlas",
    subtitle: "Expresión en tejidos · Relevancia clínica · Imágenes",
    icon: "🗺️",
    color: "#f97316",
    what: "El Human Protein Atlas mapea dónde se expresa cada proteína en el cuerpo humano — qué tejidos, a qué nivel, y con qué relevancia en enfermedades. Incluye imágenes de inmunohistoquímica y datos de expresión génica.",
    whenToUse: "Cuando necesitas entender en qué órganos o células es relevante una proteína, o su relación con cáncer u otras enfermedades. Complementa el mecanismo bioquímico con la distribución tisular real.",
    examples: [
      { label: "ALB (Hígado)", href: "/proteina/albumina" },
      { label: "INS (Páncreas)", href: "/proteina/insulin" },
      { label: "MTHFR (Universal)", href: "/proteina/mthfr" },
    ],
    externalHref: "https://www.proteinatlas.org",
    externalLabel: "Abrir Human Protein Atlas",
    tip: "En la ficha de cada proteína (modo investigador) hay un panel de HPA integrado. También puedes buscar el gen directamente en proteinatlas.org para ver imágenes de tejidos.",
  },
  {
    name: "PubMed",
    subtitle: "Literatura científica · NCBI · Artículos peer-reviewed",
    icon: "📄",
    color: "#f5a623",
    what: "PubMed indexa más de 35 millones de artículos biomédicos. Cada proteína en el atlas tiene un PubMed ID de referencia clave. Desde el modo investigador puedes acceder directamente al artículo.",
    whenToUse: "Para profundizar en evidencia clínica, revisar ensayos sobre intervenciones en NP, o encontrar meta-análisis sobre el rol de una proteína en condiciones específicas.",
    examples: [
      { label: "Albumina en NP (PMID 11170407)", href: "/proteina/albumina" },
      { label: "GPX4 y ferroptosis", href: "/proteina/gpx4" },
      { label: "Insulina en UCI", href: "/proteina/insulin" },
    ],
    externalHref: "https://pubmed.ncbi.nlm.nih.gov",
    externalLabel: "Abrir PubMed",
    tip: "Usa filtros: 'Review' para síntesis, 'Clinical Trial' para evidencia de intervención. En el atlas, el PubMed ID de cada proteína está disponible en modo investigador.",
  },
];

export default function AlphaFoldPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero */}
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-5"
            style={{ background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.25)", color: "#a78bfa", fontFamily: "var(--font-mono,monospace)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
            Toolkit de bioinformática
          </div>
          <h1 className="text-5xl font-black mb-3" style={{ color: "var(--text)" }}>
            Bases de datos científicas
          </h1>
          <p className="text-lg max-w-2xl leading-relaxed" style={{ color: "var(--text-muted)" }}>
            El atlas integra datos de 5 fuentes científicas de referencia mundial. Esta guía explica qué hace cada una, cuándo usarla, y cómo llegar a la información directamente desde el atlas.
          </p>
        </div>

        {/* Tools */}
        <div className="flex flex-col gap-8">
          {TOOLS.map((tool) => (
            <div key={tool.name} className="glass rounded-2xl border overflow-hidden"
              style={{ borderColor: `${tool.color}25` }}>

              {/* Header */}
              <div className="px-8 py-6 flex items-start gap-5"
                style={{ background: `${tool.color}08`, borderBottom: `1px solid ${tool.color}18` }}>
                <span className="text-4xl flex-shrink-0">{tool.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <h2 className="text-2xl font-black" style={{ color: tool.color }}>{tool.name}</h2>
                    <a href={tool.externalHref} target="_blank" rel="noopener noreferrer"
                      className="text-xs px-3 py-1 rounded-full font-semibold transition-all hover:opacity-80 flex-shrink-0"
                      style={{ background: `${tool.color}12`, border: `1px solid ${tool.color}35`, color: tool.color, fontFamily: "var(--font-mono,monospace)" }}>
                      {tool.externalLabel} ↗
                    </a>
                  </div>
                  <p className="text-sm" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono,monospace)" }}>{tool.subtitle}</p>
                </div>
              </div>

              <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* What + when */}
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-mono mb-2" style={{ color: "#5a637a" }}>QUÉ ES</p>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{tool.what}</p>
                  </div>
                  <div>
                    <p className="text-xs font-mono mb-2" style={{ color: "#5a637a" }}>CUÁNDO USARLA</p>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{tool.whenToUse}</p>
                  </div>
                </div>

                {/* Tip + examples */}
                <div className="space-y-4">
                  <div className="rounded-xl p-4" style={{ background: `${tool.color}08`, border: `1px solid ${tool.color}18` }}>
                    <p className="text-xs font-mono mb-2" style={{ color: tool.color }}>CÓMO USARLA</p>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{tool.tip}</p>
                  </div>

                  <div>
                    <p className="text-xs font-mono mb-2" style={{ color: "#5a637a" }}>EN EL ATLAS</p>
                    <div className="flex flex-col gap-1">
                      {tool.examples.map((ex) => (
                        <Link key={ex.label} href={ex.href}
                          className="flex items-center gap-2 text-sm transition-all hover:opacity-80"
                          style={{ color: tool.color, fontFamily: "var(--font-mono,monospace)" }}>
                          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                          {ex.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 glass rounded-2xl border p-8 text-center" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          <p className="text-xl font-black mb-2" style={{ color: "var(--text)" }}>Todas las herramientas están integradas</p>
          <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
            En cada ficha de proteína, el modo Investigador abre paneles de HPA, PubMed y enlaces directos a RCSB, AlphaFold y UniProt.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/explorador"
              className="px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-80"
              style={{ background: "rgba(0,255,136,0.08)", border: "1px solid rgba(0,255,136,0.25)", color: "var(--teal)", fontFamily: "var(--font-mono,monospace)" }}>
              Comparar proteínas →
            </Link>
            <Link href="/modules"
              className="px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-80"
              style={{ background: "var(--bg-raised)", border: "1px solid rgba(255,255,255,0.07)", color: "var(--text-muted)", fontFamily: "var(--font-mono,monospace)" }}>
              Ver módulos
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
