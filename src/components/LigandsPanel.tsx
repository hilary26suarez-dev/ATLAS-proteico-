"use client";

const LIGAND_INFO: Record<string, { desc: string; role: string; icon: string }> = {
  "glucosa":           { icon: "🍬", role: "Sustrato",   desc: "Monosacárido principal. Fuente de energía universal. PM 180 g/mol." },
  "2-desoxiglucosa":   { icon: "🔬", role: "Análogo",    desc: "Análogo no metabolizable de glucosa. Usado en PET-scan para detectar tumores (captación alta por efecto Warburg)." },
  "citocalasina b":    { icon: "🧪", role: "Inhibidor",  desc: "Micotoxina fúngica. Inhibe el transporte de glucosa bloqueando el canal desde el lado intracelular." },
  "atp":               { icon: "⚡", role: "Cofactor",   desc: "Moneda energética universal. PM 507 g/mol. Provee el fosfato para reacciones de fosforilación." },
  "adp":               { icon: "⚡", role: "Producto",   desc: "Adenosín difosfato. Producto de la hidrólisis del ATP. Se recicla en la mitocondria." },
  "nadph":             { icon: "⚗️", role: "Cofactor",   desc: "Poder reductor celular. Esencial en biosíntesis y defensa antioxidante (GPX, GSTP1)." },
  "nad+":              { icon: "⚗️", role: "Cofactor",   desc: "Aceptor de electrones en catabolismo. Se reduce a NADH en el ciclo de Krebs y glucólisis." },
  "fad":               { icon: "⚗️", role: "Cofactor",   desc: "Flavín adenín dinucleótido. Cofactor redox unido a flavoproteínas. Derivado de la riboflavina (B2)." },
  "insulina":          { icon: "💉", role: "Ligando",    desc: "Hormona peptídica (51 aa). Se une al dominio extracelular del INSR con Kd ~0.1 nM." },
  "glucagón":          { icon: "💊", role: "Ligando",    desc: "Hormona de 29 aa. Activa GCGR → cAMP → PKA → glucogenólisis y gluconeogénesis." },
  "l-carnitina":       { icon: "🚂", role: "Cofactor",   desc: "Transportador de ácidos grasos hacia la mitocondria. Esencial para beta-oxidación (CPT1A)." },
  "malonil-coa":       { icon: "🛑", role: "Regulador",  desc: "Inhibidor alostérico de CPT1A. Señal de estado de abundancia energética que frena la beta-oxidación." },
  "acil-coa":          { icon: "🔗", role: "Sustrato",   desc: "Ácido graso activado. Forma de transporte intracelular de ácidos grasos para beta-oxidación o síntesis." },
  "palmitato":         { icon: "🧱", role: "Producto",   desc: "Ácido graso saturado de 16C. Producto final de FASN. Precursor de ácidos grasos de cadena más larga." },
  "nh3":               { icon: "⚠️", role: "Sustrato",   desc: "Amoniaco libre. Altamente tóxico para el sistema nervioso. CPS1 lo captura para el ciclo de la urea." },
  "carbamil fosfato":  { icon: "🔄", role: "Producto",   desc: "Producto de CPS1. Primer compuesto del ciclo de la urea. Ingresa al ciclo en la mitocondria." },
  "piruvato":          { icon: "🔀", role: "Sustrato",   desc: "Producto final de la glucólisis (3C). PC lo convierte en oxaloacetato para gluconeogénesis." },
  "oxaloacetato":      { icon: "🎯", role: "Producto",   desc: "Metabolito central del ciclo de Krebs. PC lo produce para iniciar la gluconeogénesis." },
  "biotina":           { icon: "🌱", role: "Cofactor",   desc: "Vitamina B7. Cofactor covalente de PC (y otras carboxilasas). Déficit en NP sin multivitamínicos." },
  "h2o2":              { icon: "💧", role: "Sustrato",   desc: "Peróxido de hidrógeno. ROS secundario. Catalasa y GPX lo detoxifican antes de que dañe membranas." },
  "gsh":               { icon: "🛡️", role: "Cofactor",   desc: "Glutatión reducido (γ-Glu-Cys-Gly). Antioxidante central. GPX4 y GSTP1 lo usan como reductante." },
  "selenocisteína":    { icon: "🧬", role: "Cofactor",   desc: "21° aminoácido. En GPX4 tiene Kcat más alto que cisteína. Único residuo con selenio en la cadena." },
  "fosfato":           { icon: "🔋", role: "Sustrato",   desc: "Ion HPO₄²⁻/H₂PO₄⁻. PiT-1 lo cotransporta con Na⁺. Crítico en síntesis de ATP y señalización celular." },
  "t4 (tiroxina)":     { icon: "🦋", role: "Ligando",    desc: "Hormona tiroidea tetraiodada. TTR la transporta en plasma junto con la proteína ligadora de retinol." },
  "vitamina a (retinol)": { icon: "🌟", role: "Ligando", desc: "Retinol unido a RBP4. El complejo TTR-RBP-retinol mantiene la vitamina A en circulación." },
  "leucina":           { icon: "💪", role: "Activador",  desc: "BCAA esencial. Activa mTORC1 vía v-ATPasa/Ragulator. El más potente estimulador de síntesis proteica." },
  "rapamicina":        { icon: "💊", role: "Inhibidor",  desc: "Macrólido antifúngico. Inhibidor alostérico de mTORC1. Usado como inmunosupresor en trasplantes." },
  "igf-1":             { icon: "📈", role: "Ligando",    desc: "Insulin-like Growth Factor 1. 70 aa. Activa IGF1R → PI3K/Akt → crecimiento y síntesis proteica." },
  "leptina":           { icon: "⚖️", role: "Ligando",    desc: "Hormona adipocitaria (167 aa). Señal de adiposidad. Inhibe apetito activando neuronas POMC en hipotálamo." },
  "digoxina":          { icon: "❤️", role: "Inhibidor",  desc: "Glucósido cardíaco. Inhibe Na⁺/K⁺-ATPasa → ↑ Ca²⁺ intracelular → inotropismo positivo." },
  "ouabaína":          { icon: "🌿", role: "Inhibidor",  desc: "Glucósido esteroideo. Inhibidor específico de Na⁺/K⁺-ATPasa. Herramienta farmacológica clásica." },
  "citocalasina d":    { icon: "🧪", role: "Inhibidor",  desc: "Toxina fúngica que desestabiliza filamentos de actina. Bloquea la translocación de GLUT4 a la membrana." },
  "palmitoil-coa":     { icon: "🔗", role: "Inhibidor",  desc: "Acil-CoA de cadena larga. Inhibidor alostérico de CPS1 y activador de malonato." },
  "nag (n-acetilglutamato)": { icon: "🔑", role: "Activador", desc: "Activador alostérico obligatorio de CPS1. Sin NAG, el ciclo de la urea no funciona." },
  "udp-glucosa":       { icon: "🧱", role: "Sustrato",   desc: "Glucosa activada. Glucógeno sintasa (GS) transfiere el residuo al glucógeno en elongación." },
  "piridoxal-5-fosfato": { icon: "🌱", role: "Cofactor", desc: "Vitamina B6 activa. Cofactor de ALT y muchas aminotransferasas. Necesario en NP con vitaminas." },
  "warfarina":         { icon: "💊", role: "Ligando",    desc: "Anticoagulante. Se une a sitio II de la albúmina. Su desplazamiento por ácidos grasos libres puede alterar su biodisponibilidad." },
  "ácidos grasos libres": { icon: "🧈", role: "Ligando", desc: "7 sitios de unión en albúmina. Transporte hidrofóbico plasmático. Compiten con fármacos." },
  "bilirrubina":       { icon: "🟡", role: "Ligando",    desc: "Producto del catabolismo del hemo. La albúmina la transporta al hígado para conjugación." },
  "nad+ (cyp)":        { icon: "⚗️", role: "Cofactor",   desc: "Aceptor de electrones. CYP3A4 lo usa en ciclo catalítico junto con NADPH." },
  "keap1":             { icon: "🔒", role: "Regulador",  desc: "Proteína adaptadora que retiene NRF2 en el citoplasma en condiciones normales para degradación ubiquitina-proteasoma." },
  "electrófilos":      { icon: "⚡", role: "Inductor",   desc: "Compuestos electrofílicos (ROS, carcinógenos). Se unen a cisteínas sensoras en KEAP1 liberando NRF2." },
  "omega-3 (dha/epa)": { icon: "🐟", role: "Inductor",  desc: "Ácidos grasos poliinsaturados de SMOFlipid. Activan NRF2 y reducen NFκB en pacientes críticos con NP." },
  "nadph (oxidasa)":   { icon: "⚡", role: "Sustrato",   desc: "NOX2 oxida NADPH transfiriendo electrones a O₂ para generar superóxido (O₂•⁻) bactericida." },
};

interface Props {
  ligands: string[];
}

export default function LigandsPanel({ ligands }: Props) {
  return (
    <div className="space-y-3">
      {ligands.map((ligand) => {
        const key = ligand.toLowerCase();
        const info = LIGAND_INFO[key];
        return (
          <div key={ligand} className="flex items-start gap-3 p-3 rounded-xl"
            style={{ background: "var(--bg-card)", border: "1px solid rgba(168,85,247,0.12)" }}>
            <span className="text-xl flex-shrink-0">{info?.icon ?? "🔬"}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="font-bold text-sm" style={{ color: "var(--text)" }}>{ligand}</span>
                {info?.role && (
                  <span className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(168,85,247,0.1)", color: "#a78bfa", border: "1px solid rgba(168,85,247,0.2)", fontFamily: "var(--font-mono, monospace)" }}>
                    {info.role}
                  </span>
                )}
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {info?.desc ?? "Ligando o sustrato de esta proteína. Ver literatura en UniProt para más detalles."}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
