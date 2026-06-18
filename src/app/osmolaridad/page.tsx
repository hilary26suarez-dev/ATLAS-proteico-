import type { Metadata } from "next";
import OsmolarityCalcWrapper from "./OsmolarityCalcWrapper";

export const metadata: Metadata = {
  title: "Osmolaridad en NP | Atlas Proteico NP",
  description: "Aprende qué es la osmolaridad, cómo cada componente de la bolsa de Nutrición Parenteral la determina, y por qué define el acceso vascular.",
};

const COMPONENTS_INFO = [
  {
    icon: "🍬",
    name: "Dextrosa (Glucosa)",
    role: "Fuente energética principal",
    color: "#f5a623",
    bg: "rgba(245,166,35,0.06)",
    border: "rgba(245,166,35,0.18)",
    osm: "~50 mOsm/L por cada 1%",
    detail: "La dextrosa monohidratada (PM 198 g/mol) es el mayor contribuyente osmolar. D70% puro = 3,500 mOsm/L. En la mezcla final se diluye, pero sigue siendo el componente que más eleva la osmolaridad.",
    clinical: "Exceso → lipogénesis hepática (FASN), esteatosis. Déficit → catabolismo proteico.",
  },
  {
    icon: "🧬",
    name: "Aminoácidos",
    role: "Síntesis proteica y cicatrización",
    color: "#A855F7",
    bg: "rgba(168,85,247,0.06)",
    border: "rgba(168,85,247,0.18)",
    osm: "~8 mOsm/L por g/L",
    detail: "Las soluciones comerciales (Aminosyn, FreAmine) aportan ~8 mOsm por gramo. La leucina activa mTORC1 para síntesis proteica. Glutamina protege la mucosa intestinal.",
    clinical: "Exceso con disfunción hepática → ↑ NH₃, encefalopatía. CPS1 insuficiente no puede convertir N₂ → urea.",
  },
  {
    icon: "💧",
    name: "Lípidos (emulsión IV)",
    role: "Energía + ácidos grasos esenciales",
    color: "#00FF88",
    bg: "rgba(0,255,136,0.06)",
    border: "rgba(0,255,136,0.18)",
    osm: "~300 mOsm/L (casi isotónica)",
    detail: "Las emulsiones de lípidos al 20% (SMOFlipid, Intralipid) son casi isotónicas gracias al glicerol como agente tonicidad. Su aporte a la osmolaridad total es mínimo.",
    clinical: "Oxidados por CPT1A en mitocondria. SMOFlipid con omega-3 reduce la inflamación vs emulsiones puras de soya.",
  },
  {
    icon: "⚡",
    name: "Electrolitos",
    role: "Homeostasis iónica y función celular",
    color: "#4A9EFF",
    bg: "rgba(74,158,255,0.06)",
    border: "rgba(74,158,255,0.18)",
    osm: "2 mOsm por mEq de sal monovalente",
    detail: "NaCl, KCl, MgSO₄, fosfato y gluconato de calcio. Cada sal se disocia: NaCl → Na⁺ + Cl⁻ = 2 partículas osmóticamente activas por mEq. Calcio y fosfato no pueden mezclarse en alta concentración (precipitan como Ca₃(PO₄)₂).",
    clinical: "Hipofosfatemia al iniciar NP → síndrome de realimentación. PiT-1 capta fosfato cuando sube insulina.",
  },
  {
    icon: "🧪",
    name: "Vitaminas y Oligoelementos",
    role: "Cofactores enzimáticos esenciales",
    color: "#FF8C42",
    bg: "rgba(255,140,66,0.06)",
    border: "rgba(255,140,66,0.18)",
    osm: "Aporte osmolar despreciable",
    detail: "Vitaminas liposolubles (A, D, E, K), hidrosolubles (complejo B, vitamina C), oligoelementos (Zn, Cu, Se, Mn, Cr). Se agregan en volúmenes mínimos. Sin ellos: déficit de GPX4 (Se), SOD1 (Zn/Cu), SOD2 (Mn).",
    clinical: "Biotina → PC (gluconeogénesis). Selenio → GPX4 (ferroptosis). Zinc → SOD1, cicatrización de heridas.",
  },
];

const CASES = [
  {
    title: "Caso 1: NP Periférica de transición",
    context: "Paciente post-operatorio día 1. Sin acceso central. Se inicia NP periférica.",
    composition: "Dextrosa 5% + AA 30 g/L + Electrolitos básicos",
    osm: "~540 mOsm/L",
    decision: "Periférica aceptable < 72h. Monitorear sitio cada 4h.",
    color: "#00FF88",
    outcome: "Correcta. Osmolaridad segura para vena periférica.",
  },
  {
    title: "Caso 2: NP hipercalórica central",
    context: "Paciente con falla intestinal crónica. PICC colocado. Requiere soporte nutricional completo.",
    composition: "Dextrosa 25% + AA 60 g/L + Lípidos 20% + Electrolitos completos",
    osm: "~1,750 mOsm/L",
    decision: "OBLIGATORIO vía central confirmada por Rx. Nunca periférica.",
    color: "#FF6B9D",
    outcome: "Correcta si por PICC/CVC. Fatal si por periférica → necrosis venosa.",
  },
  {
    title: "Caso 3: Error de prescripción",
    context: "NP con dextrosa 15% prescrita para administrar por catéter periférico durante 7 días.",
    composition: "Dextrosa 15% + AA 50 g/L + NaCl 80 mEq/L",
    osm: "~1,550 mOsm/L",
    decision: "ERROR CRÍTICO. Flebitis química garantizada al 3-4 día.",
    color: "#ff4444",
    outcome: "Requería acceso central. El error osmolar es una emergencia iatrogénica.",
  },
];

export default function OsmolaridadPage() {
  return (
    <div className="min-h-screen pt-20 pb-20">

      {/* ─── HERO ─────────────────────────────────────────── */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 molecular-grid opacity-30 pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(245,166,35,0.06) 0%, transparent 70%)" }} />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(74,158,255,0.05) 0%, transparent 70%)" }} />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="label-teal mb-6 w-fit mx-auto">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse-dot" style={{ background: "var(--teal)" }} />
            MÓDULO EDUCATIVO · FARMACOLOGÍA CLÍNICA NP
          </div>

          <h1 className="font-display font-black leading-tight mb-6"
            style={{ fontSize: "clamp(2.5rem,7vw,4.5rem)", color: "var(--text)" }}>
            Osmolaridad en{" "}
            <span style={{ color: "#f5a623" }}>Nutrición Parenteral</span>
          </h1>

          <p className="text-lg leading-relaxed mb-8 max-w-2xl mx-auto" style={{ color: "var(--text-muted)" }}>
            Un número define si tu paciente recibe la NP por una vena periférica o necesita un catéter central.
            Ese número es la{" "}
            <span className="font-semibold" style={{ color: "var(--text)" }}>osmolaridad</span>.
            Entiende cómo cada ingrediente de la bolsa lo determina.
          </p>

          <div className="flex flex-wrap gap-6 justify-center text-sm" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono, monospace)" }}>
            <span>🧂 Electrolitos</span>
            <span>·</span>
            <span>🍬 Dextrosa</span>
            <span>·</span>
            <span>🧬 Aminoácidos</span>
            <span>·</span>
            <span>💧 Lípidos</span>
            <span>·</span>
            <span>⚗️ Calculadora interactiva</span>
          </div>
        </div>
      </section>

      {/* ─── ¿QUÉ ES? ────────────────────────────────────────── */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div className="rounded-2xl p-7"
              style={{ background: "var(--bg-card)", border: "1px solid rgba(0,255,136,0.12)" }}>
              <p className="text-xs tracking-widest mb-3" style={{ color: "var(--teal)", fontFamily: "var(--font-mono, monospace)" }}>
                DEFINICIÓN
              </p>
              <h2 className="font-display font-black text-2xl mb-3" style={{ color: "var(--text)" }}>
                ¿Qué es la osmolaridad?
              </h2>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-muted)" }}>
                Es la <strong style={{ color: "var(--text)" }}>concentración total de partículas osmóticamente activas</strong>{" "}
                disueltas en un litro de solución. Se mide en <strong style={{ color: "var(--teal)" }}>mOsm/L</strong>{" "}
                (miliosmoles por litro).
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                El plasma humano normal tiene una osmolaridad de{" "}
                <span className="font-bold" style={{ color: "var(--teal)" }}>285–295 mOsm/L</span>.
                Una solución más concentrada que eso es <em>hiperosmolar</em> y daña las células endoteliales venosas por deshidratación osmótica.
              </p>
            </div>

            <div className="rounded-2xl p-7"
              style={{ background: "var(--bg-card)", border: "1px solid rgba(255,107,157,0.12)" }}>
              <p className="text-xs tracking-widest mb-3" style={{ color: "#FF6B9D", fontFamily: "var(--font-mono, monospace)" }}>
                POR QUÉ IMPORTA CLÍNICAMENTE
              </p>
              <h2 className="font-display font-black text-2xl mb-3" style={{ color: "var(--text)" }}>
                El endotelio venoso
              </h2>
              <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--text-muted)" }}>
                Cuando una solución hiperosmolar toca el endotelio de una vena periférica, las células endoteliales{" "}
                <strong style={{ color: "var(--text)" }}>pierden agua por ósmosis</strong>, se deshidratan y desencadenan:
              </p>
              <ul className="text-sm space-y-1.5" style={{ color: "var(--text-muted)" }}>
                {["Inflamación → flebitis química (dolor, eritema, induración)", "Trombosis local → oclusión del catéter", "Necrosis venosa → extravasación tisular", "Pérdida de acceso vascular en paciente ya comprometido"].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span style={{ color: "#FF6B9D" }} className="flex-shrink-0 mt-0.5">▸</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl p-7 md:col-span-2"
              style={{ background: "var(--bg-raised)", border: "1px solid rgba(74,158,255,0.12)" }}>
              <p className="text-xs tracking-widest mb-4" style={{ color: "#4A9EFF", fontFamily: "var(--font-mono, monospace)" }}>
                UMBRALES CLÍNICOS · REFERENCIA RÁPIDA
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { range: "< 600", label: "Periférica segura", color: "#00FF88", sub: "Sin restricción de tiempo razonable" },
                  { range: "600–900", label: "Periférica con precaución", color: "#f5a623", sub: "Máx 72h, vigilancia estrecha" },
                  { range: "900–1800", label: "Vía CENTRAL obligatoria", color: "#FF6B9D", sub: "PICC, subclavia o yugular" },
                  { range: "> 1800", label: "CVC confirmado por Rx", color: "#ff4444", sub: "Punta en vena cava superior" },
                ].map((t) => (
                  <div key={t.range} className="text-center p-4 rounded-xl"
                    style={{ background: "var(--bg-card)", border: `1px solid ${t.color}22` }}>
                    <div className="font-display font-black text-lg mb-1" style={{ color: t.color }}>{t.range}</div>
                    <p className="text-xs font-bold mb-1" style={{ color: "var(--text)" }}>{t.label}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono, monospace)" }}>{t.sub}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-4" style={{ color: "var(--text-faint)", fontFamily: "var(--font-mono, monospace)" }}>
                * Valores en mOsm/L. Referencias: ASPEN Guidelines 2022, ESPEN PN Guidelines 2023.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ANATOMÍA DE LA BOLSA ──────────────────────────── */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <p className="text-xs tracking-[0.2em] mb-3"
              style={{ color: "var(--teal)", fontFamily: "var(--font-mono, monospace)" }}>
              ANATOMÍA MOLECULAR
            </p>
            <h2 className="font-display font-black text-4xl" style={{ color: "var(--text)" }}>
              ¿Qué hay dentro de<br />
              <span style={{ color: "#f5a623" }}>una bolsa de NP?</span>
            </h2>
            <p className="mt-3 text-base" style={{ color: "var(--text-muted)" }}>
              Cada componente tiene un rol molecular preciso y una contribución osmolar calculable.
            </p>
          </div>

          <div className="space-y-4">
            {COMPONENTS_INFO.map((c) => (
              <div key={c.name} className="rounded-2xl overflow-hidden"
                style={{ background: c.bg, border: `1px solid ${c.border}` }}>
                <div className="p-6 grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-5 items-start">

                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{c.icon}</span>
                    <div>
                      <h3 className="font-display font-bold text-base" style={{ color: c.color }}>{c.name}</h3>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>{c.role}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm leading-relaxed mb-2" style={{ color: "var(--text-muted)" }}>{c.detail}</p>
                    <div className="flex items-start gap-2 mt-2 text-xs px-3 py-2 rounded-lg w-fit"
                      style={{ background: "rgba(0,0,0,0.2)", color: "var(--text-muted)", border: "1px solid rgba(255,255,255,0.04)" }}>
                      <span style={{ color: c.color }}>Clínica:</span>
                      <span>{c.clinical}</span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0 hidden md:block">
                    <p className="text-xs mb-1" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono, monospace)" }}>APORTE OSM.</p>
                    <p className="font-bold text-sm" style={{ color: c.color }}>{c.osm}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CALCULADORA ──────────────────────────────────────── */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <p className="text-xs tracking-[0.2em] mb-3"
              style={{ color: "var(--teal)", fontFamily: "var(--font-mono, monospace)" }}>
              HERRAMIENTA INTERACTIVA
            </p>
            <h2 className="font-display font-black text-4xl" style={{ color: "var(--text)" }}>
              Calculadora de<br />
              <span style={{ color: "var(--teal)" }}>Osmolaridad NP</span>
            </h2>
            <p className="mt-3 text-base" style={{ color: "var(--text-muted)" }}>
              Ajusta los componentes y observa en tiempo real la osmolaridad total y la recomendación de acceso vascular.
            </p>
          </div>

          <OsmolarityCalcWrapper />
        </div>
      </section>

      {/* ─── CASOS CLÍNICOS ───────────────────────────────────── */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <p className="text-xs tracking-[0.2em] mb-3"
              style={{ color: "var(--amber)", fontFamily: "var(--font-mono, monospace)" }}>
              CASOS CLÍNICOS
            </p>
            <h2 className="font-display font-black text-4xl" style={{ color: "var(--text)" }}>
              Aplica lo aprendido:<br />
              <span style={{ color: "var(--amber)" }}>3 escenarios reales</span>
            </h2>
          </div>

          <div className="space-y-4">
            {CASES.map((c, i) => (
              <div key={i} className="rounded-2xl p-6"
                style={{ background: "var(--bg-card)", border: `1px solid ${c.color}22` }}>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0"
                    style={{ background: `${c.color}15`, color: c.color, fontFamily: "var(--font-mono, monospace)" }}>
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display font-bold text-base mb-1" style={{ color: c.color }}>{c.title}</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                      <div className="rounded-lg p-3" style={{ background: "var(--bg-raised)" }}>
                        <p className="text-xs mb-1" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono, monospace)" }}>CONTEXTO</p>
                        <p className="text-sm" style={{ color: "var(--text)" }}>{c.context}</p>
                      </div>
                      <div className="rounded-lg p-3" style={{ background: "var(--bg-raised)" }}>
                        <p className="text-xs mb-1" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono, monospace)" }}>COMPOSICIÓN</p>
                        <p className="text-sm" style={{ color: "var(--text)" }}>{c.composition}</p>
                        <p className="text-xs mt-1 font-bold" style={{ color: c.color }}>{c.osm}</p>
                      </div>
                      <div className="rounded-lg p-3" style={{ background: "var(--bg-raised)" }}>
                        <p className="text-xs mb-1" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono, monospace)" }}>DECISIÓN CLÍNICA</p>
                        <p className="text-sm font-medium" style={{ color: "var(--text)" }}>{c.decision}</p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-start gap-2 text-sm px-4 py-3 rounded-xl"
                      style={{ background: `${c.color}10`, border: `1px solid ${c.color}25` }}>
                      <span className="font-bold flex-shrink-0" style={{ color: c.color }}>Resultado:</span>
                      <span style={{ color: "var(--text-muted)" }}>{c.outcome}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CONEXIÓN CON PROTEÍNAS DEL ATLAS ─────────────────── */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl p-8"
            style={{ background: "var(--bg-raised)", border: "1px solid rgba(0,255,136,0.10)" }}>
            <p className="text-xs tracking-widest mb-3" style={{ color: "var(--teal)", fontFamily: "var(--font-mono, monospace)" }}>
              CONEXIÓN MOLECULAR
            </p>
            <h2 className="font-display font-black text-2xl mb-4" style={{ color: "var(--text)" }}>
              Las proteínas del atlas que hacen posible la NP
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { name: "GLUT1", role: "Capta glucosa de la NP hacia las células", href: "/proteina/glut1", color: "var(--teal)" },
                { name: "CPT1A", role: "Oxida los lípidos de la emulsión IV", href: "/proteina/cpt1a", color: "#A855F7" },
                { name: "TTR", role: "Marcador de síntesis proteica (vida media 2-3 días)", href: "/proteina/ttr", color: "#f5a623" },
                { name: "PiT-1", role: "Transporta fosfato → síndrome realimentación", href: "/proteina/pit1", color: "#FF6B9D" },
              ].map((p) => (
                <a key={p.name} href={p.href}
                  className="rounded-xl p-4 transition-all hover:opacity-80"
                  style={{ background: "var(--bg-card)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <p className="font-display font-bold text-base mb-1" style={{ color: p.color }}>{p.name}</p>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{p.role}</p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
