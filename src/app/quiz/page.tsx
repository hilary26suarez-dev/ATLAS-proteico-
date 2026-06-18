import type { Metadata } from "next";
import QuizClient, { type Question } from "./QuizClient";

export const metadata: Metadata = {
  title: "Quiz de Proteínas NP | Atlas Proteico NP",
  description: "Pon a prueba tu conocimiento sobre las proteínas esenciales en Nutrición Parenteral. 20 preguntas con contexto clínico real.",
};

const ALL_QUESTIONS: Question[] = [
  {
    q: "¿Cuál proteína es el principal transportador de glucosa en la barrera hematoencefálica y es insulino-independiente?",
    opts: ["GLUT4", "GLUT1", "GLUT2", "SGLT1"],
    answer: 1,
    fact: "GLUT1 garantiza que el cerebro siempre reciba glucosa sin importar los niveles de insulina. En NP con hipoglucemia, GLUT1 mantiene el suministro cerebral hasta cierto punto.",
    tag: "Transportadores",
  },
  {
    q: "En NP, ¿qué proteína se usa como marcador de síntesis proteica de respuesta rápida (vida media 2-3 días)?",
    opts: ["Albúmina (ALB)", "Prealbúmina (TTR)", "Transferrina", "CRP"],
    answer: 1,
    fact: "La prealbúmina (transtiretina, TTR) tiene una vida media muy corta de 2-3 días, mucho más útil que la albúmina (21 días) para detectar cambios nutricionales en los primeros días de NP.",
    tag: "Monitoreo NP",
  },
  {
    q: "¿Qué enzima hepática convierte el exceso de glucosa infundida en NP en triglicéridos (lipogénesis de novo)?",
    opts: ["GCK (Glucocinasa)", "CPT1A", "FASN (FAS)", "CPS1"],
    answer: 2,
    fact: "El exceso de glucosa en NP activa SREBP-1c → FASN, generando esteatosis hepática. Esta es la causa más común de hepatotoxicidad asociada a NP.",
    tag: "Módulo Hepático",
  },
  {
    q: "¿Qué proteína de la membrana mitocondrial es responsable de introducir los ácidos grasos de las emulsiones lipídicas de NP a la beta-oxidación?",
    opts: ["FASN", "CPT1A", "PC", "GS"],
    answer: 1,
    fact: "CPT1A es la enzima limitante de la oxidación de ácidos grasos. Las emulsiones SMOFlipid incluyen ácidos grasos de cadena media que no necesitan CPT1A, útil en pacientes con deficiencia de carnitina.",
    tag: "Metabolismo Lipídico",
  },
  {
    q: "¿Qué proteína se activa masivamente al reintroducir fósforo intracelular al iniciar NP, causando el síndrome de realimentación?",
    opts: ["GLUT4", "SGLT1", "PiT-1", "Na⁺/K⁺-ATPasa"],
    answer: 2,
    fact: "PiT-1 transporta fosfato al interior celular cuando la glucosa y la insulina aumentan. La caída dramática del fosfato sérico (<0.5 mmol/L) puede causar insuficiencia cardíaca y muerte.",
    tag: "Síndrome Realimentación",
  },
  {
    q: "Un paciente con NP crónica sin suplemento de selenio tiene mayor riesgo de daño oxidativo lipídico. ¿Cuál enzima requiere selenio como cofactor?",
    opts: ["SOD1", "Catalasa", "GPX4", "NOX2"],
    answer: 2,
    fact: "GPX4 (Glutatión Peroxidasa 4) es la única enzima que puede detoxificar los fosfolípidos peroxidados directamente en las membranas celulares. Su deficiencia activa ferroptosis, un tipo de muerte celular.",
    tag: "Antioxidantes",
  },
  {
    q: "¿Dónde se localiza SOD2 y cuál micronutriente de NP es su cofactor metálico?",
    opts: ["Citoplasma · Zinc", "Matriz mitocondrial · Manganeso", "Peroxisomas · Hierro", "Núcleo · Cobre"],
    answer: 1,
    fact: "La NP crónica sin oligoelementos causa deficiencia de Mn, reduciendo SOD2 y aumentando el daño oxidativo mitocondrial. Esto se ha documentado en pacientes pediátricos con NP a largo plazo.",
    tag: "Antioxidantes",
  },
  {
    q: "¿Qué enzima indica hepatotoxicidad cuando supera 3x el límite superior de normalidad durante NP?",
    opts: ["GCK", "FASN", "ALT", "CPS1"],
    answer: 2,
    fact: "La elevación de ALT > 3x es criterio para evaluar la suspensión o modificación de la NP. La causa más frecuente es la sobrecarga de glucosa o lípidos con lipogénesis hepática excesiva.",
    tag: "Monitoreo NP",
  },
  {
    q: "¿Cuál es la función de mTOR en el contexto de NP con aminoácidos?",
    opts: [
      "Transporta glucosa al músculo",
      "Detecta el nivel de ROS y activa antioxidantes",
      "Es activado por leucina → promueve síntesis proteica",
      "Sintetiza ácidos grasos en el hígado",
    ],
    answer: 2,
    fact: "La leucina en las soluciones de aminoácidos activa mTORC1, que fosforila S6K1 e inicia la síntesis de proteínas musculares. Por eso los BCAA (especialmente leucina) son clave en NP para prevenir catabolismo.",
    tag: "Señalización",
  },
  {
    q: "¿Qué receptor de señalización hormonal es el punto de acción de la insulinoterapia intensiva durante NP?",
    opts: ["GCGR", "INSR", "IGF1R", "mTOR"],
    answer: 1,
    fact: "El control estricto de glucemia con insulina durante NP (objetivo: 140-180 mg/dL en UCI) actúa a través del INSR. La resistencia a la insulina en pacientes críticos dificulta este control.",
    tag: "Señalización",
  },
  {
    q: "¿Qué biomarcador sube en plasma cuando CPS1 es insuficiente para manejar el alto aporte proteico en NP?",
    opts: ["Glucosa", "Triglicéridos", "Amoniaco (NH₃)", "Bilirrubina"],
    answer: 2,
    fact: "CPS1 es el primer paso del ciclo de la urea. En NP con >2 g/kg/día de proteínas y función hepática comprometida, el amoniaco no se convierte en urea y puede causar encefalopatía hepática.",
    tag: "Módulo Hepático",
  },
  {
    q: "¿Cuál proteína del módulo Sistema de Defensa es producida por neutrófilos y genera ROS para matar bacterias de catéter?",
    opts: ["NRF2", "SOD1", "NOX2 (NADPH oxidasa)", "GSTP1"],
    answer: 2,
    fact: "NOX2 en neutrófilos genera el 'estallido oxidativo' que mata patógenos. Los pacientes con NP tienen catéteres centrales que son una vía de entrada de bacterias que pueden activar esta respuesta.",
    tag: "Sistema Defensa",
  },
  {
    q: "¿Por qué la albúmina baja (<3.5 g/dL) no es un buen marcador nutricional agudo en pacientes críticos con NP?",
    opts: [
      "Porque la albúmina no es una proteína real",
      "Porque su vida media de 21 días no refleja cambios nutricionales recientes",
      "Porque se degrada en el hígado inmediatamente",
      "Porque no se puede medir en sangre",
    ],
    answer: 1,
    fact: "La hipoalbuminemia refleja inflamación aguda (IL-6 suprime su síntesis) más que desnutrición. Es mejor usar TTR para monitorear el estado nutricional durante NP.",
    tag: "Monitoreo NP",
  },
  {
    q: "¿Qué proteína requiere biotina como cofactor y su deficiencia en NP sin vitaminas deteriora la gluconeogénesis?",
    opts: ["FASN", "GCK", "PC (Piruvato Carboxilasa)", "CPT1A"],
    answer: 2,
    fact: "PC convierte piruvato en oxaloacetato, paso clave de la gluconeogénesis. La deficiencia de biotina en NP sin multivitamínicos causa acidosis láctica y deterioro neurológico.",
    tag: "Módulo Hepático",
  },
  {
    q: "¿Cuál es la masa molecular de la albúmina sérica humana?",
    opts: ["52 kDa", "88 kDa", "66.5 kDa", "127 kDa"],
    answer: 2,
    fact: "A 66.5 kDa, la albúmina es la proteína más abundante del plasma (3.5-5.0 g/dL) y puede unir al menos 7 moléculas de ácidos grasos simultáneamente en diferentes sitios.",
    tag: "Bioquímica",
  },
  {
    q: "¿Qué transportador de la membrana intestinal es el primero en funcionar al transicionar de NP a nutrición enteral?",
    opts: ["GLUT2", "GLUT4", "LAT1", "SGLT1"],
    answer: 3,
    fact: "SGLT1 cotransporta Na⁺ y glucosa en el intestino delgado. Su activación exitosa marca el inicio de la transición NP → enteral. Su ausencia o falla indica intolerancia a la glucosa enteral.",
    tag: "Transportadores",
  },
  {
    q: "Un paciente con NP y zinc/cobre insuficientes tiene menor actividad de este enzima citoplásmico antioxidante:",
    opts: ["GPX4", "SOD1", "SOD2", "NRF2"],
    answer: 1,
    fact: "SOD1 (Cu/Zn-SOD) necesita un átomo de zinc y uno de cobre en su sitio activo. La deficiencia de oligoelementos en NP prolongada reduce SOD1, aumentando el estrés oxidativo.",
    tag: "Antioxidantes",
  },
  {
    q: "En NP interrumpida bruscamente, ¿qué receptor hormonal activa la glucogenólisis para evitar hipoglucemia de rebote?",
    opts: ["INSR", "IGF1R", "GCGR", "mTOR"],
    answer: 2,
    fact: "GCGR activa PKA → fosforilación de glucógeno fosforilasa → ruptura del glucógeno hepático. Siempre se debe reducir gradualmente la infusión de NP para evitar la hipoglucemia reactiva.",
    tag: "Señalización",
  },
  {
    q: "¿Qué factor de transcripción en el módulo Sistema de Defensa es activado por antioxidantes (vitamina C, N-acetilcisteína) en NP?",
    opts: ["NOX2", "GSTP1", "NRF2", "GPX4"],
    answer: 2,
    fact: "NRF2 es el 'maestro antioxidante'. Cuando se activa, aumenta la expresión de decenas de genes protectores. Las formulaciones de NP con antioxidantes pueden activarlo y reducir el daño oxidativo en UCI.",
    tag: "Sistema Defensa",
  },
  {
    q: "¿Qué proteína de transporte en plasma, sintetizada en el hígado y el plexo coroideo, transporta hormona tiroidea y vitamina A?",
    opts: ["Albúmina (ALB)", "Transferrina", "Prealbúmina (TTR)", "Leptina"],
    answer: 2,
    fact: "TTR (transtiretina) transporta T4 y retinol. Además de ser marcador nutricional, su nivel bajo indica deficiencia de vitamina A, que puede aparecer en NP sin vitaminas liposolubles.",
    tag: "Monitoreo NP",
  },
];

export default function QuizPage() {
  return (
    <div className="min-h-screen pt-20 pb-16">

      {/* Header */}
      <div className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 molecular-grid opacity-40 pointer-events-none" />
        <div className="relative max-w-3xl mx-auto text-center">
          <h1 className="font-display font-black leading-tight mb-4"
            style={{ fontSize: "clamp(2.2rem, 6vw, 4rem)", color: "var(--text)" }}>
            Quiz de{" "}
            <span style={{ color: "var(--teal)" }}>Proteínas NP</span>
          </h1>
          <p className="text-lg leading-relaxed mb-4" style={{ color: "var(--text-muted)" }}>
            Pon a prueba tu conocimiento sobre las proteínas esenciales en Nutrición Parenteral.
            Cada pregunta incluye un dato clínico que no encontrarás en ningún libro de texto convencional.
          </p>
          <div className="flex flex-wrap gap-4 justify-center text-xs"
            style={{ fontFamily: "var(--font-mono, monospace)", color: "var(--text-muted)" }}>
            <span>📊 20 preguntas</span>
            <span>·</span>
            <span>🧬 4 módulos</span>
            <span>·</span>
            <span>💡 Datos de investigación real</span>
            <span>·</span>
            <span>⏱ ~8 minutos</span>
          </div>
        </div>
      </div>

      {/* Quiz */}
      <div className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-2xl mx-auto">
          <QuizClient questions={ALL_QUESTIONS} />
        </div>
      </div>
    </div>
  );
}
