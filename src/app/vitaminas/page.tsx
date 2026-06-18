import type { Metadata } from "next";
import Link from "next/link";
import VitaminMoleculeViewerWrapper from "./VitaminMoleculeViewerWrapper";

export const metadata: Metadata = {
  title: "Vitaminas en NP | Atlas Proteico NP",
  description: "Vitaminas esenciales en Nutrición Parenteral: funciones moleculares, cofactores enzimáticos, deficiencias y conexiones con las proteínas del atlas.",
};

const VITAMINS = [
  {
    id: "b1",
    name: "Vitamina B1",
    alias: "Tiamina · TPP",
    icon: "⚡",
    color: "#f5a623",
    chemForm: "C₁₂H₁₇N₄OS⁺",
    pdbId: "1POX",
    role: "Cofactor",
    coenzyme: "Tiamina pirofosfato (TPP)",
    enzymes: ["Piruvato deshidrogenasa", "α-cetoglutarato deshidrogenasa", "Transcetolasa"],
    npRisk: "CRÍTICO — Deficiencia en NP sin vitaminas → Encefalopatía de Wernicke en 14 días",
    riskLevel: "critical",
    mechanism: "TPP forma un carboanión reactivo (tiazolium) que estabiliza acil-aniones en descarboxilaciones oxidativas. Sin B1, el piruvato no puede entrar al ciclo de Krebs.",
    clinicalNote: "Los alcohólicos y pacientes en NP sin suplementos multivitamínicos son los de mayor riesgo. Wernicke = nistagmo + ataxia + confusión.",
    atlasLink: null,
    atlasLinkLabel: null,
  },
  {
    id: "b2",
    name: "Vitamina B2",
    alias: "Riboflavina · FAD · FMN",
    icon: "🔶",
    color: "#FF8C42",
    chemForm: "C₁₇H₂₀N₄O₆",
    pdbId: "1GRE",
    role: "Cofactor",
    coenzyme: "FAD / FMN",
    enzymes: ["Glutatión reductasa", "Monoaminooxidasa", "Cadena de transporte electrónico (Complejo I/II)"],
    npRisk: "Moderado — Fotodegradación en bolsa: las soluciones de NP pierden 50% de riboflavina en 8h bajo luz fluorescente",
    riskLevel: "moderate",
    mechanism: "FAD/FMN aceptan y donan 2 electrones en reacciones redox. El anillo isoaloxazina cicla entre forma oxidada (FAD) y reducida (FADH₂).",
    clinicalNote: "Las bolsas de NP con lípidos son fotoprotectoras. Sin protección lumínica, la riboflavina se degrada y compromete la actividad enzimática.",
    atlasLink: null,
    atlasLinkLabel: null,
  },
  {
    id: "b3",
    name: "Vitamina B3",
    alias: "Niacina · NAD⁺ · NADP⁺",
    icon: "⚗️",
    color: "#A855F7",
    chemForm: "C₆H₅NO₂",
    pdbId: "3HB5",
    role: "Cofactor",
    coenzyme: "NAD⁺ / NADH / NADP⁺ / NADPH",
    enzymes: ["Deshidrogenasas del ciclo de Krebs", "Glucólisis", "FASN", "GPX4 (indirectamente vía NADPH)"],
    npRisk: "Bajo — El triptófano puede convertirse en NAD⁺ (60 mg Trp = 1 mg niacina), pero en NP de larga duración es necesario suplementar.",
    riskLevel: "low",
    mechanism: "NAD⁺ acepta hidruro (H⁻) → NADH. NADPH es el poder reductor para biosíntesis y defensa antioxidante (GPX, GR). La relación NAD⁺/NADH controla el metabolismo redox.",
    clinicalNote: "Déficit causa pelagra: dermatitis, diarrea y demencia (las 3 D). En NP prolongada sin nicotinamida, riesgo real.",
    atlasLink: "/proteina/gpx4",
    atlasLinkLabel: "GPX4 (usa NADPH)",
  },
  {
    id: "b5",
    name: "Vitamina B5",
    alias: "Ácido pantoténico · CoA",
    icon: "🔗",
    color: "#00FF88",
    chemForm: "C₉H₁₇NO₅",
    pdbId: "1PPR",
    role: "Componente",
    coenzyme: "Coenzima A (CoA)",
    enzymes: ["FASN", "Acetil-CoA carboxilasa", "CPT1A", "Ciclo de Krebs (succinil-CoA)"],
    npRisk: "Bajo — Ampliamente distribuido. Deficiencia aislada rarísima fuera de desnutrición severa.",
    riskLevel: "low",
    mechanism: "El CoA es el transportador de grupos acilo en toda la célula. Activa ácidos grasos, acetato y otros acil-grupos para oxidación y biosíntesis.",
    clinicalNote: "El palmitato de FASN se activa como palmitoil-CoA. El CPT1A transfiere acil-CoA a carnitina. Sin CoA, ninguna de estas reacciones ocurre.",
    atlasLink: "/proteina/cpt1a",
    atlasLinkLabel: "CPT1A (acil-CoA → carnitina)",
  },
  {
    id: "b6",
    name: "Vitamina B6",
    alias: "Piridoxina · PLP",
    icon: "🌿",
    color: "#22d3ee",
    chemForm: "C₈H₁₁NO₃",
    pdbId: "1AJS",
    role: "Cofactor",
    coenzyme: "Piridoxal-5-fosfato (PLP)",
    enzymes: ["ALT (transaminasa glutámico-pirúvica)", "AST (transaminasa glutámico-oxalacética)", "Descarboxilasas de aminoácidos", "Glucógeno fosforilasa"],
    npRisk: "Moderado — ALT y AST son marcadores hepáticos clave en NP. Sin B6, su actividad disminuye aunque el daño hepático sea real.",
    riskLevel: "moderate",
    mechanism: "PLP forma una base de Schiff (aldiimina) con el grupo amino del aminoácido sustrato. Este intermedio estabiliza carbaniones para transaminación, descarboxilación o racemización.",
    clinicalNote: "La deficiencia de B6 hace que los niveles de ALT y AST fallen como marcadores — paradoja diagnóstica en pacientes con NP sin suplementos.",
    atlasLink: "/proteina/alt",
    atlasLinkLabel: "ALT (usa PLP como cofactor)",
  },
  {
    id: "b7",
    name: "Vitamina B7",
    alias: "Biotina · Vitamina H",
    icon: "🌱",
    color: "#34d399",
    chemForm: "C₁₀H₁₆N₂O₃S",
    pdbId: "1DV2",
    role: "Cofactor",
    coenzyme: "Biocitin (biotina + lisina)",
    enzymes: ["Piruvato carboxilasa (PC)", "Acetil-CoA carboxilasa", "Propionil-CoA carboxilasa", "3-metilcrotonil-CoA carboxilasa"],
    npRisk: "Moderado — La biotina de NP puede adsorberse al tubo IV si el contenedor es de PVC sin avidinización. Déficit en NP crónica → acidosis láctica.",
    riskLevel: "moderate",
    mechanism: "La biotina se une covalentemente (por su carboxilo) a la ε-amino de una lisina de la carboxilasa. El CO₂ se transfiere vía el anillo ureido al sustrato.",
    clinicalNote: "PC en el atlas usa biotina como cofactor covalente. Sin biotina, PC no puede carboxilar piruvato → no hay gluconeogénesis ni anaplerósis del ciclo de Krebs.",
    atlasLink: "/proteina/pc",
    atlasLinkLabel: "PC (biotina covalente)",
  },
  {
    id: "b9",
    name: "Vitamina B9",
    alias: "Folato · Ácido fólico",
    icon: "🍃",
    color: "#4ade80",
    chemForm: "C₁₉H₁₉N₇O₆",
    pdbId: "1RG7",
    role: "Cofactor",
    coenzyme: "THF (tetrahidrofolato)",
    enzymes: ["Timidilato sintasa", "Metionina sintasa", "Formilmetionil-tRNA formiltransferasa"],
    npRisk: "Moderado — Déficit en NP prolongada → megaloblastosis + hiperhomocisteinemia → riesgo trombótico aumentado en catéter central.",
    riskLevel: "moderate",
    mechanism: "THF transporta unidades de un carbono en varios estados de oxidación (metilo, metileno, formilo, formimino) para síntesis de purinas, timidina y metionina.",
    clinicalNote: "La hiperhomocisteinemia por déficit de folato/B12 en NP de larga duración es un factor de riesgo independiente para trombosis del catéter central.",
    atlasLink: null,
    atlasLinkLabel: null,
  },
  {
    id: "b12",
    name: "Vitamina B12",
    alias: "Cobalamina",
    icon: "💎",
    color: "#f472b6",
    chemForm: "C₆₃H₈₈CoN₁₄O₁₄P",
    pdbId: "4CCW",
    role: "Cofactor",
    coenzyme: "Adenosilcobalamina / Metilcobalamina",
    enzymes: ["Metilmalonil-CoA mutasa", "Metionina sintasa (homocisteína → metionina)"],
    npRisk: "CRÍTICO en vegetarianos — Reservas hepáticas duran 3-5 años. En NP de larga duración sin B12: neuropatía subaguda combinada.",
    riskLevel: "critical",
    mechanism: "Adenosilcobalamina genera un radical 5'-desoxiadenosilo que isomeriza metilmalonil-CoA a succinil-CoA (entrada al ciclo de Krebs desde aminoácidos ramificados).",
    clinicalNote: "La neuropatía por B12 puede presentarse sin anemia en NP que sí contiene folato (el folato enmascara la anemia megaloblástica pero no protege el sistema nervioso).",
    atlasLink: null,
    atlasLinkLabel: null,
  },
  {
    id: "c",
    name: "Vitamina C",
    alias: "Ácido ascórbico",
    icon: "🍊",
    color: "#fb923c",
    chemForm: "C₆H₈O₆",
    pdbId: "1OAF",
    role: "Cofactor + Antioxidante",
    coenzyme: "Ascorbato (forma reducida)",
    enzymes: ["Prolil-4-hidroxilasa (colágeno)", "Dopamina β-hidroxilasa", "Carnitina biosíntesis", "Regeneración de vitamina E"],
    npRisk: "Crítico — La vitamina C en NP se oxida rápidamente en presencia de O₂ y luz. Después de 24h en bolsa, puede haber <40% de la dosis original.",
    riskLevel: "critical",
    mechanism: "La vitamina C dona electrones al átomo de hierro de las prolil-hidroxilasas (Fe²⁺ → Fe³⁺ durante la reacción → vitamina C lo regenera a Fe²⁺). Sin ella el colágeno no se triple-heliza.",
    clinicalNote: "En heridas quirúrgicas, quemados y pacientes críticos con NP, el déficit de vitamina C se manifiesta como dehiscencia de heridas y sangrado de encías antes de los signos clásicos de escorbuto.",
    atlasLink: "/proteina/sod1",
    atlasLinkLabel: "SOD1 (regenera antioxidantes)",
  },
  {
    id: "a",
    name: "Vitamina A",
    alias: "Retinol · β-Caroteno",
    icon: "🌟",
    color: "#fbbf24",
    chemForm: "C₂₀H₃₀O",
    pdbId: "1KT0",
    role: "Ligando hormonal",
    coenzyme: "Retinal (visión) · Ácido retinoico (gene regulation)",
    enzymes: ["RAR (Receptor de ácido retinoico)", "RXR", "TTR (transportador plasmático)", "RBP4 (proteína ligadora de retinol)"],
    npRisk: "Moderado — La vitamina A en NP se adsorbe al tubo de PVC y se fotodegrada. También es TERATOGÉNICA en exceso — dosificación precisa en embarazo.",
    riskLevel: "moderate",
    mechanism: "El retinol circula en plasma unido a RBP4, y el complejo RBP4-retinol se une a TTR (transtiretina) para evitar la filtración renal. El ácido retinoico activa factores de transcripción RAR/RXR que controlan >500 genes.",
    clinicalNote: "TTR (transtiretina) en el atlas es el transportador plasmático de vitamina A. Una caída de TTR por desnutrición también compromete el transporte de retinol.",
    atlasLink: "/proteina/ttr",
    atlasLinkLabel: "TTR (transporta retinol + T4)",
  },
  {
    id: "d",
    name: "Vitamina D",
    alias: "Colecalciferol · Calcitriol",
    icon: "☀️",
    color: "#facc15",
    chemForm: "C₂₇H₄₄O",
    pdbId: "1DB1",
    role: "Prohormona → Hormona esteroidea",
    coenzyme: "1,25-dihidroxicolecalciferol (calcitriol)",
    enzymes: ["CYP27B1 (25-OH-D₃ → calcitriol)", "CYP24A1 (degradación)", "VDR (Receptor de vitamina D)", "CYP3A4 (metabolismo)"],
    npRisk: "Moderado — Pacientes en NP exclusiva pierden exposición solar. Monitoreo de 25-OH-D3 cada 3-6 meses en NP domiciliaria.",
    riskLevel: "moderate",
    mechanism: "La vitamina D₃ cutánea → hígado (25-hidroxilación) → riñón (1α-hidroxilación) → calcitriol. El calcitriol activa VDR nuclear → transcripción de calbindina, TRPV6 y PMCA1 para absorción intestinal de Ca²⁺.",
    clinicalNote: "CYP3A4 (en el atlas) metaboliza el calcitriol. Fármacos que inducen CYP3A4 (rifampicina, antiepilépticos) aceleran su degradación → raquitismo/osteomalacia en NP.",
    atlasLink: "/proteina/cyp3a4",
    atlasLinkLabel: "CYP3A4 (metaboliza calcitriol)",
  },
  {
    id: "e",
    name: "Vitamina E",
    alias: "α-Tocoferol",
    icon: "🛡️",
    color: "#a78bfa",
    chemForm: "C₂₉H₅₀O₂",
    pdbId: "1OIZ",
    role: "Antioxidante de membrana",
    coenzyme: "α-Tocoferoxil radical (intermediario)",
    enzymes: ["GPX4 (acción sinérgica)", "Vitamina C (regenera vitamina E)", "FATM (transportador mitocondrial)"],
    npRisk: "Moderado — La emulsión lipídica de NP (SMOFlipid) provee vitamina E encapsulada en la fase aceite. En mezclas 3 en 1, el tocoferol puede degradarse por oxidación.",
    riskLevel: "moderate",
    mechanism: "El tocoferol dona un H• a los radicales peroxilo de fosfolípidos de membrana, interrumpiendo la peroxidación lipídica en cadena. El radical tocoferoxil formado es estable y regenerado por vitamina C.",
    clinicalNote: "GPX4 y vitamina E actúan sinérgicamente en la prevención de ferroptosis — GPX4 reduce los hidroperóxidos ya formados mientras vitamina E interrumpe su propagación.",
    atlasLink: "/proteina/gpx4",
    atlasLinkLabel: "GPX4 (acción sinérgica)",
  },
  {
    id: "k",
    name: "Vitamina K",
    alias: "Filoquinona · Menaquinona",
    icon: "🩸",
    color: "#f87171",
    chemForm: "C₃₁H₄₆O₂",
    pdbId: "2CL2",
    role: "Cofactor de carboxilación",
    coenzyme: "Vitamina K hidroquinona (KH₂)",
    enzymes: ["γ-Glutamil carboxilasa (GGCX)", "Factores de coagulación II, VII, IX, X", "Proteína C y S", "Osteocalcina"],
    npRisk: "CRÍTICO en anticoagulados — La vitamina K en NP puede antagonizar el efecto del warfarín. Monitoreo del INR obligatorio en NP.",
    riskLevel: "critical",
    mechanism: "La vitamina K hidroquinona es el cofactor de GGCX que carboxila residuos de ácido glutámico en factores de coagulación → γ-carboxiglutamato (Gla) que une Ca²⁺ y fosfolípidos de membrana.",
    clinicalNote: "La warfarina inhibe la vitamina K epóxido reductasa (VKORC1), bloqueando el ciclo de la vitamina K. En NP con vitamina K incluida, el INR terapéutico requiere reajuste de warfarina.",
    atlasLink: "/proteina/albumina",
    atlasLinkLabel: "Albumina (transporta warfarina)",
  },
];

const RISK_STYLE: Record<string, { bg: string; border: string; label: string }> = {
  critical: { bg: "rgba(239,68,68,0.06)", border: "rgba(239,68,68,0.2)", label: "CRÍTICO" },
  moderate: { bg: "rgba(251,191,36,0.06)", border: "rgba(251,191,36,0.2)", label: "Moderado" },
  low:      { bg: "rgba(34,211,238,0.06)", border: "rgba(34,211,238,0.15)", label: "Bajo" },
};

export default function VitaminasPage() {
  const critical = VITAMINS.filter((v) => v.riskLevel === "critical");
  const moderate = VITAMINS.filter((v) => v.riskLevel === "moderate");
  const low      = VITAMINS.filter((v) => v.riskLevel === "low");

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>

      {/* Hero */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-display font-black text-5xl sm:text-6xl leading-none mb-5">
            <span style={{ color: "var(--text)" }}>Vitaminas</span><br />
            <span style={{ color: "#f5a623" }}>en Nutrición Parenteral</span>
          </h1>
          <p className="text-lg max-w-2xl" style={{ color: "#B0BAD4" }}>
            Las vitaminas no son solo "suplementos" — son <strong style={{ color: "var(--text)" }}>cofactores moleculares</strong> sin los cuales las enzimas del Atlas no pueden funcionar. En NP, el acceso intestinal está ausente: cada vitamina debe llegar directamente a la vena, en la dosis exacta, en la forma correcta.
          </p>

          {/* Risk summary */}
          <div className="flex flex-wrap gap-3 mt-8">
            {[
              { label: "Riesgo CRÍTICO", count: critical.length, color: "#ef4444" },
              { label: "Riesgo Moderado", count: moderate.length, color: "#fbbf24" },
              { label: "Riesgo Bajo", count: low.length, color: "#22d3ee" },
            ].map((r) => (
              <div key={r.label} className="flex items-center gap-2 px-4 py-2 rounded-xl"
                style={{ background: `${r.color}08`, border: `1px solid ${r.color}25` }}>
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: r.color }} />
                <span className="text-sm" style={{ color: r.color, fontFamily: "var(--font-mono, monospace)" }}>
                  {r.count} vitaminas · {r.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Concepto clave */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: "⚠️", title: "Sin absorción intestinal", desc: "La NP bypasea el intestino donde normalmente ocurre la absorción. Cada vitamina debe estar en la bolsa — si no está, no llega.", color: "#ef4444" },
            { icon: "☀️", title: "Fotodegradación real", desc: "Vitaminas B1, B2, C y A se degradan con luz fluorescente. Envolturas opacas y tiempos cortos de infusión son protección obligatoria.", color: "#fbbf24" },
            { icon: "🧪", title: "Adsorción a materiales", desc: "Vitamina A y algunas del grupo B se adsorben a bolsas de PVC. El paciente puede recibir significativamente menos de la dosis prescrita.", color: "#a78bfa" },
          ].map((c) => (
            <div key={c.title} className="rounded-2xl p-5"
              style={{ background: "var(--bg-card)", border: `1px solid ${c.color}15` }}>
              <span className="text-2xl mb-3 block">{c.icon}</span>
              <h3 className="font-bold text-sm mb-2" style={{ color: c.color }}>{c.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#B0BAD4" }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Vitaminas grid */}
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-4">
          {VITAMINS.map((v) => {
            const risk = RISK_STYLE[v.riskLevel];
            return (
              <details key={v.id} className="group rounded-2xl overflow-hidden"
                style={{ background: "var(--bg-card)", border: `1px solid ${v.color}18` }}>
                <summary className="flex items-center gap-4 px-6 py-5 cursor-pointer select-none list-none hover:bg-white/[0.01] transition-colors">
                  <span className="text-2xl flex-shrink-0">{v.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-bold text-base" style={{ color: "var(--text)" }}>{v.name}</span>
                      <span className="text-xs font-mono" style={{ color: "#B0BAD4" }}>{v.alias}</span>
                      <span className="text-xs font-mono px-2 py-0.5 rounded-full"
                        style={{ background: risk.bg, border: `1px solid ${risk.border}`, color: v.riskLevel === "critical" ? "#ef4444" : v.riskLevel === "moderate" ? "#fbbf24" : "#22d3ee" }}>
                        {risk.label}
                      </span>
                    </div>
                    <p className="text-xs mt-1 line-clamp-1" style={{ color: "#B0BAD4" }}>{v.npRisk}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform group-open:rotate-180"
                    style={{ background: `${v.color}12`, color: v.color }}>
                    ▼
                  </div>
                </summary>

                <div className="px-6 pb-6 pt-2 border-t" style={{ borderColor: `${v.color}12` }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">

                    {/* Columna izquierda */}
                    <div className="space-y-4">
                      {/* Fórmula y coenzima */}
                      <div className="rounded-xl p-4" style={{ background: "var(--bg-raised)", border: "1px solid rgba(255,255,255,0.04)" }}>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs font-mono tracking-widest" style={{ color: "#6B7BA0" }}>ESTRUCTURA</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span style={{ color: "#B0BAD4" }}>Fórmula:</span>
                            <span className="font-mono font-bold" style={{ color: v.color }}>{v.chemForm}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span style={{ color: "#B0BAD4" }}>Coenzima activa:</span>
                            <span className="text-right text-xs" style={{ color: "var(--text)" }}>{v.coenzyme}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span style={{ color: "#B0BAD4" }}>Rol:</span>
                            <span className="text-xs px-2 py-0.5 rounded-full"
                              style={{ background: `${v.color}12`, color: v.color }}>{v.role}</span>
                          </div>
                        </div>
                      </div>

                      {/* Mecanismo */}
                      <div className="rounded-xl p-4" style={{ background: "var(--bg-raised)", border: "1px solid rgba(255,255,255,0.04)" }}>
                        <p className="text-xs font-mono tracking-widest mb-2" style={{ color: "#6B7BA0" }}>MECANISMO MOLECULAR</p>
                        <p className="text-sm leading-relaxed" style={{ color: "#B0BAD4" }}>{v.mechanism}</p>
                      </div>
                    </div>

                    {/* Columna derecha */}
                    <div className="space-y-4">
                      {/* Enzimas dependientes */}
                      <div className="rounded-xl p-4" style={{ background: "var(--bg-raised)", border: "1px solid rgba(255,255,255,0.04)" }}>
                        <p className="text-xs font-mono tracking-widest mb-3" style={{ color: "#6B7BA0" }}>ENZIMAS DEPENDIENTES</p>
                        <div className="space-y-1.5">
                          {v.enzymes.map((e) => (
                            <div key={e} className="flex items-center gap-2 text-sm">
                              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: v.color }} />
                              <span style={{ color: "#B0BAD4" }}>{e}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Nota clínica en NP */}
                      <div className="rounded-xl p-4" style={{ background: risk.bg, border: `1px solid ${risk.border}` }}>
                        <p className="text-xs font-mono tracking-widest mb-2"
                          style={{ color: v.riskLevel === "critical" ? "#ef4444" : v.riskLevel === "moderate" ? "#fbbf24" : "#22d3ee" }}>
                          EN NUTRICIÓN PARENTERAL
                        </p>
                        <p className="text-sm leading-relaxed" style={{ color: "#B0BAD4" }}>{v.clinicalNote}</p>
                      </div>

                      {/* Link al atlas */}
                      {v.atlasLink && (
                        <Link href={v.atlasLink}
                          className="flex items-center gap-3 rounded-xl p-4 transition-all hover:opacity-80"
                          style={{ background: `${v.color}08`, border: `1px solid ${v.color}25` }}>
                          <span className="text-lg">🧬</span>
                          <div>
                            <p className="text-xs font-mono mb-0.5" style={{ color: "#6B7BA0" }}>Ver proteína relacionada</p>
                            <p className="text-sm font-bold" style={{ color: v.color }}>{v.atlasLinkLabel} ↗</p>
                          </div>
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* 3D molecular viewer */}
                  <div className="mt-5">
                    <p className="text-xs font-mono mb-2" style={{ color: "#6B7BA0" }}>
                      VISUALIZACIÓN 3D · Coenzima activa (ball+stick)
                    </p>
                    <VitaminMoleculeViewerWrapper vitaminId={v.id} color={v.color} />
                  </div>

                  {/* PDB viewer link */}
                  <div className="mt-4 flex items-center gap-3 text-xs" style={{ color: "#6B7BA0" }}>
                    <span className="font-mono">PDB proteína: {v.pdbId}</span>
                    <a href={`https://www.rcsb.org/structure/${v.pdbId}`} target="_blank" rel="noopener noreferrer"
                      className="hover:opacity-80 transition-opacity" style={{ color: v.color }}>
                      Ver complejo en RCSB ↗
                    </a>
                  </div>
                </div>
              </details>
            );
          })}
        </div>
      </section>

      {/* Call to action: Simulador */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto rounded-2xl p-8 text-center"
          style={{ background: "var(--bg-card)", border: "1px solid rgba(245,166,35,0.15)" }}>
          <h2 className="font-display font-black text-3xl mb-3" style={{ color: "var(--text)" }}>
            ¿Qué pasa cuando las vitaminas interactúan<br />
            <span style={{ color: "#f5a623" }}>con los otros componentes de la bolsa?</span>
          </h2>
          <p className="text-base mb-6 max-w-xl mx-auto" style={{ color: "#B0BAD4" }}>
            Explora precipitación de calcio-fosfato, ruptura de emulsión lipídica y compatibilidad de fármacos en nuestro simulador interactivo de estabilidad.
          </p>
          <Link href="/simulador"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #f5a623, #ff6b35)", color: "white" }}>
            Abrir Simulador de Estabilidad NP →
          </Link>
        </div>
      </section>
    </div>
  );
}
