"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Difficulty = "Basico" | "Intermedio" | "Avanzado" | "Experto";
type ProteinLink = { id: string; label: string };

type DecisionOption = {
  text: string;
  isBest: boolean;
  rationale: string;
};

type DecisionQuestion = {
  id: string;
  prompt: string;
  protein: ProteinLink;
  options: DecisionOption[];
};

type ClinicalCase = {
  id: string;
  title: string;
  disciplines: string[];
  difficulty: Difficulty;
  duration: number;
  summary: string;
  objective: string;
  labs: string[];
  proteins: ProteinLink[];
  questions: DecisionQuestion[];
};

const CASES: ClinicalCase[] = [
  {
    id: "pku-neonatal",
    title: "Fenilcetonuria neonatal",
    disciplines: ["Pediatria", "Nutricion", "Bioquimica"],
    difficulty: "Basico",
    duration: 30,
    summary:
      "Tamizaje neonatal positivo para PKU. Debes iniciar manejo dietario precoz y prevenir dano neurologico.",
    objective:
      "Entender por que PAH deficiente acumula fenilalanina y como la dieta previene el dano cerebral.",
    labs: ["Fenilalanina: 1240 umol/L (VN < 120)", "Tirosina: 38 umol/L (baja)", "BH4: en evaluacion", "Peso al nacer: adecuado"],
    proteins: [
      { id: "pah", label: "PAH (Fenilalanina hidroxilasa)" },
      { id: "albumina", label: "Albumina" },
      { id: "ttr", label: "TTR" },
    ],
    questions: [
      {
        id: "q1",
        prompt: "La fenilalanina esta en 1240 umol/L porque PAH no puede hacer que?",
        protein: { id: "pah", label: "PAH" },
        options: [
          { text: "Convertir fenilalanina en tirosina usando BH4 como cofactor", isBest: true, rationale: "PAH (fenilalanina hidroxilasa) es la enzima que cataliza Phe → Tyr usando BH4 (tetrahidrobiopterina). Sin PAH funcional, la fenilalanina se acumula y es neurotoxica, mientras la tirosina cae." },
          { text: "Absorber fenilalanina en el intestino delgado", isBest: false, rationale: "La absorcion intestinal de Phe es normal en PKU — el problema es su metabolismo hepatico por PAH deficiente." },
          { text: "Eliminar fenilalanina por orina directamente", isBest: false, rationale: "La fenilalanina se acumula en sangre y tejidos — el rinon puede filtrar algo pero no es la via de eliminacion principal." },
        ],
      },
      {
        id: "q2",
        prompt: "Por que la albumina baja en PKU no tratada es un signo de alarma?",
        protein: { id: "albumina", label: "Albumina" },
        options: [
          { text: "Indica catabolismo proteico y riesgo de deficit de aminoacidos esenciales", isBest: true, rationale: "En PKU con dieta muy restrictiva sin formula especializada, el lactante puede desarrollar deficit proteico global. La albumina baja refleja ingesta proteica insuficiente — riesgo de malnutricion en el intento de limitar fenilalanina." },
          { text: "Es normal en todos los neonatos y no tiene significado clinico", isBest: false, rationale: "La albumina neonatal normal es > 3 g/dL. Un valor bajo indica deficit nutricional real." },
          { text: "Indica exceso de fenilalanina transportada por albumina", isBest: false, rationale: "Aunque albumina transporta Phe, su nivel bajo refleja deficit de sintesis hepatica, no exceso de sustrato." },
        ],
      },
      {
        id: "q3",
        prompt: "La TTR (transtiretina) esta baja en este lactante con PKU no tratado. Que indica esto?",
        protein: { id: "ttr", label: "TTR" },
        options: [
          { text: "Desnutricion proteica aguda: TTR es el marcador mas sensible del estado nutricional inmediato", isBest: true, rationale: "TTR tiene vida media de 2 dias, lo que la hace el marcador nutricional mas dinamico. Su caida indica deficit proteico de los ultimos dias — en PKU es consecuencia de dieta inadecuada o formula insuficiente." },
          { text: "Deficit de vitamina A exclusivamente", isBest: false, rationale: "TTR transporta vitamina A pero su descenso en este contexto refleja principalmente desnutricion proteica, no deficit aislado de vitamina A." },
          { text: "Es un hallazgo normal en el periodo neonatal", isBest: false, rationale: "La TTR neonatal normal es > 10 mg/dL. Valores bajos indican desnutricion proteica activa." },
        ],
      },
    ],
  },
  {
    id: "dehydration-altitude",
    title: "Deshidratacion en altitud",
    disciplines: ["Medicina", "Bioquimica", "Fisiologia"],
    difficulty: "Intermedio",
    duration: 45,
    summary:
      "Corredor en altura con confusion e hipotension ortostatica. Debes corregir volumen sin empeorar la hipoxia tisular.",
    objective:
      "Vincular estado hidroelectrolitico, transporte de oxigeno y metabolismo celular para decidir la terapia inicial.",
    labs: ["Na+: 149 mEq/L", "Lactato: 3.8 mmol/L", "Osmolaridad: 307 mOsm/L", "HCO3-: 20 mEq/L"],
    proteins: [
      { id: "hemoglobina", label: "Hemoglobina" },
      { id: "nkaatpase", label: "Na+/K+ ATPasa" },
      { id: "ldha", label: "LDH-A" },
    ],
    questions: [
      {
        id: "q1",
        prompt: "Primer paso terapeutico en las primeras 2 horas",
        protein: { id: "nkaatpase", label: "Na+/K+ ATPasa" },
        options: [
          {
            text: "Bolo controlado de cristaloide isotonic y revaluacion hemodinamica seriada",
            isBest: true,
            rationale: "La reposicion isotonica restaura el gradiente que mantiene la Na+/K+ ATPasa: sin volumen, la bomba no puede mantener el potencial de membrana celular.",
          },
          {
            text: "Restriccion hidrica estricta por riesgo de edema cerebral",
            isBest: false,
            rationale: "Agrava hipoperfusion y acentua la disfuncion de la Na+/K+ ATPasa por deficit de ATP.",
          },
          {
            text: "Solo oxigenoterapia sin correccion de volumen",
            isBest: false,
            rationale: "Sin perfusion adecuada, el oxigeno no llega a los tejidos: la causa primaria es hemodinámica.",
          },
        ],
      },
      {
        id: "q2",
        prompt: "Por que el lactato esta elevado a 3.8 mmol/L en este paciente?",
        protein: { id: "ldha", label: "LDH-A" },
        options: [
          {
            text: "LDH-A convierte piruvato en lactato por hipoxia tisular e hipoperfusion",
            isBest: true,
            rationale: "Cuando la cadena respiratoria no recibe O2, LDH-A regenera NAD+ convirtiendo piruvato en lactato — el lactato es el producto directo de esa enzima en anaerobiosis.",
          },
          {
            text: "Indicador exclusivo de falla hepatica severa",
            isBest: false,
            rationale: "El higado aclara lactato pero su aumento aqui es por produccion muscular, no por fallo hepatico.",
          },
          {
            text: "Efecto normal de altitud sin significado clinico",
            isBest: false,
            rationale: "Lactato > 2 mmol/L con hipotension indica hipoperfusion global — siempre es relevante.",
          },
        ],
      },
      {
        id: "q3",
        prompt: "El efecto Bohr de la hemoglobina en este contexto es:",
        protein: { id: "hemoglobina", label: "Hemoglobina" },
        options: [
          {
            text: "Favorece la liberacion de O2 al tejido hipoperfundido (pH bajo y CO2 alto desplazan la curva)",
            isBest: true,
            rationale: "El pH acido por acidosis lactica y el CO2 elevado reducen la afinidad de la hemoglobina por O2 — mecanismo compensador que maximiza la entrega en tejidos hipoxicos.",
          },
          {
            text: "Aumenta la afinidad de hemoglobina por O2 para proteger los tejidos",
            isBest: false,
            rationale: "Seria contraproducente: mayor afinidad retendria el O2 en el pulmon en lugar de entregarlo.",
          },
          {
            text: "El efecto Bohr no actua en hipoperfusion aguda",
            isBest: false,
            rationale: "El efecto Bohr es inmediato y es el principal mecanismo de compensacion en hipoxia aguda.",
          },
        ],
      },
    ],
  },
  {
    id: "urolithiasis-multidisciplinary",
    title: "Urolitiasis recurrente",
    disciplines: ["Medicina", "Nutricion", "Farmacia"],
    difficulty: "Avanzado",
    duration: 60,
    summary:
      "Paciente con litiasis de repeticion y desorden metabolico. Debes integrar dieta, farmacologia y seguimiento.",
    objective:
      "Reducir recurrencia combinando control de sobresaturacion urinaria y ajuste farmacologico.",
    labs: ["Calcio urinario: elevado", "Citrato urinario: bajo", "pH urinario: 5.2", "Creatinina: normal-alta"],
    proteins: [
      { id: "albumina", label: "Albumina" },
      { id: "cyp3a4", label: "CYP3A4" },
      { id: "sglt1", label: "SGLT1" },
    ],
    questions: [
      {
        id: "q1",
        prompt: "Albumina baja (3.0 g/dL) en este paciente con urolitiasis indica:",
        protein: { id: "albumina", label: "Albumina" },
        options: [
          { text: "Estado inflamatorio cronico que aumenta la excrecion de calcio y oxalato urinario", isBest: true, rationale: "La inflamacion cronica reduce albumina (proteina de fase aguda negativa) y altera la reabsorcion tubular renal de calcio, favoreciendo hipercalciuria y cristalizacion." },
          { text: "Falta de proteina en la dieta sin relacion con la litiasis", isBest: false, rationale: "La hipoalbuminemia es un marcador de inflamacion y estado nutricional que si afecta el metabolismo calcico renal." },
          { text: "Indica que se debe aumentar el aporte proteico para compensar", isBest: false, rationale: "Mayor carga proteica aumenta la excrecion de calcio y acido urico urinario, empeorando la urolitiasis." },
        ],
      },
      {
        id: "q2",
        prompt: "El paciente toma ketoconazol. Por que es critico antes de prescribir citrato de potasio?",
        protein: { id: "cyp3a4", label: "CYP3A4" },
        options: [
          { text: "Ketoconazol inhibe CYP3A4 y puede elevar niveles de farmacos metabolizados por esa via", isBest: true, rationale: "CYP3A4 metaboliza muchos farmacos. Ketoconazol es inhibidor potente: puede aumentar toxicidad de otros medicamentos concomitantes al reducir su clearance hepatico." },
          { text: "El citrato de potasio no tiene interacciones farmacologicas relevantes", isBest: false, rationale: "El citrato de potasio puede interactuar con medicamentos que afectan la funcion renal o el metabolismo hepatico." },
          { text: "Solo importa la dosis de citrato, no las interacciones", isBest: false, rationale: "Las interacciones metabolicas via CYP3A4 pueden cambiar drasticamente la concentracion plasmatica de multiples farmacos." },
        ],
      },
      {
        id: "q3",
        prompt: "Por que restringir el sodio dietetico reduce la hipercalciuria en este caso?",
        protein: { id: "sglt1", label: "SGLT1" },
        options: [
          { text: "El sodio tubular compite con el calcio en la reabsorcion proximal: menos sodio = mas reabsorcion de calcio", isBest: true, rationale: "En el tubulo proximal, sodio y calcio comparten mecanismos de reabsorcion acoplados. Al reducir la carga de sodio, el tubulo reabsorbe mas calcio, reduciendo la hipercalciuria litiasica." },
          { text: "El sodio en la dieta no afecta la excrecion urinaria de calcio", isBest: false, rationale: "Por cada 100 mEq/dia de sodio extra en la dieta, se excretan ~1 mmol adicional de calcio en orina." },
          { text: "Solo importa restringir oxalato y no el sodio", isBest: false, rationale: "El oxalato es importante pero el sodio es el factor dietetico modificable con mayor impacto en la hipercalciuria." },
        ],
      },
    ],
  },
  {
    id: "nosocomial-infection-collagen",
    title: "Infeccion nosocomial y cicatrizacion",
    disciplines: ["Medicina", "Nutricion", "Farmacologia"],
    difficulty: "Experto",
    duration: 75,
    summary:
      "Postoperatorio con infeccion y mala reparacion tisular. Se requiere control antimicrobiano y soporte metabolico dirigido.",
    objective:
      "Coordinar respuesta antiinfecciosa, soporte proteico y balance oxidativo para acelerar recuperacion.",
    labs: ["PCR: 14 mg/dL", "Albumina: 2.8 g/dL", "Leucocitos: 17000/mm3", "Glucosa: 186 mg/dL"],
    proteins: [
      { id: "gpx4", label: "GPX4" },
      { id: "albumina", label: "Albumina" },
      { id: "hemoglobina", label: "Hemoglobina" },
    ],
    questions: [
      {
        id: "q1",
        prompt: "Estrategia inicial en las primeras 24 horas",
        protein: { id: "albumina", label: "Albumina" },
        options: [
          { text: "Control del foco + cobertura dirigida + soporte proteico temprano", isBest: true, rationale: "Integra control etiologico y sustrato para reparacion." },
          { text: "Solo analgesia y observacion", isBest: false, rationale: "No aborda foco infeccioso ni estado catabolico." },
          { text: "Aumentar glucosa para energia sin ajustar proteinas", isBest: false, rationale: "Puede agravar hiperglucemia e inflamacion sin reparar tejido." },
        ],
      },
      {
        id: "q2",
        prompt: "Relacion con estres oxidativo",
        protein: { id: "gpx4", label: "GPX4" },
        options: [
          { text: "Optimizar defensa antioxidante para limitar dano de membrana", isBest: true, rationale: "GPX4 protege lipidos de peroxidacion y favorece viabilidad celular." },
          { text: "Evitar por completo micronutrientes antioxidantes", isBest: false, rationale: "Debilita respuesta frente a estres oxidativo sostenido." },
          { text: "No monitorizar glucosa ni inflamacion", isBest: false, rationale: "Pierde control de variables que afectan cicatrizacion." },
        ],
      },
      {
        id: "q3",
        prompt: "Meta de seguimiento temprana",
        protein: { id: "hemoglobina", label: "Hemoglobina" },
        options: [
          { text: "Descenso de PCR y mejoria clinica de herida con control glucemico", isBest: true, rationale: "Integra inflamacion, perfusion y control metabolico." },
          { text: "Solo descenso de fiebre aislada", isBest: false, rationale: "No refleja completa respuesta inflamatoria ni reparacion." },
          { text: "Esperar 2 semanas sin controles", isBest: false, rationale: "Retrasa ajustes terapeuticos en fase critica." },
        ],
      },
    ],
  },
];

const difficultyStyle: Record<Difficulty, { color: string; border: string; bg: string }> = {
  Basico:    { color: "#22d3ee", border: "rgba(34,211,238,0.22)",  bg: "rgba(34,211,238,0.08)" },
  Intermedio:{ color: "#f5a623", border: "rgba(245,166,35,0.22)",  bg: "rgba(245,166,35,0.08)" },
  Avanzado:  { color: "#ef4444", border: "rgba(239,68,68,0.24)",   bg: "rgba(239,68,68,0.08)" },
  Experto:   { color: "#a855f7", border: "rgba(168,85,247,0.28)",  bg: "rgba(168,85,247,0.10)" },
};

export default function CasosClinicosPage() {
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResult, setShowResult] = useState(false);

  const selectedCase = useMemo(() => CASES.find((c) => c.id === selectedCaseId) ?? null, [selectedCaseId]);

  const answeredCount = selectedCase
    ? selectedCase.questions.filter((q) => answers[q.id] !== undefined).length
    : 0;

  const score = selectedCase
    ? selectedCase.questions.reduce((acc, q) => {
        const answerIndex = answers[q.id];
        if (answerIndex === undefined) return acc;
        return q.options[answerIndex]?.isBest ? acc + 100 : acc;
      }, 0)
    : 0;

  const maxScore = selectedCase ? selectedCase.questions.length * 100 : 0;
  const scorePercent = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <section className="relative overflow-hidden pt-24 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 molecular-grid pointer-events-none opacity-70" />
        <div className="relative max-w-6xl mx-auto" style={{ zIndex: 2 }}>
          <p className="text-xs tracking-[0.22em] mb-4" style={{ color: "var(--teal)", fontFamily: "var(--font-mono, monospace)" }}>
            ENTRENAMIENTO CLINICO CON TRAZABILIDAD MOLECULAR
          </p>
          <h1 className="font-display font-black text-5xl sm:text-6xl leading-[0.92] tracking-tight" style={{ color: "var(--text)" }}>
            CASOS CLINICOS
            <br />
            <span style={{ color: "var(--amber)" }}>ALINEADOS AL ATLAS</span>
          </h1>
          <p className="mt-6 max-w-3xl text-base sm:text-lg leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Escenarios clinicos con decisiones evaluables, feedback cientifico y enlaces directos a proteinas del atlas.
          </p>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 pb-14">
        <div className="max-w-6xl mx-auto">
          <div className={`transition-all duration-500 ease-out ${selectedCase ? "opacity-0 -translate-y-4 pointer-events-none h-0 overflow-hidden" : "opacity-100 translate-y-0"}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {CASES.map((item, idx) => {
                const palette = difficultyStyle[item.difficulty];
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedCaseId(item.id);
                      setAnswers({});
                      setShowResult(false);
                    }}
                    className="text-left rounded-2xl p-6 card-hover"
                    style={{ background: "var(--bg-card)", border: `1px solid ${palette.border}`, boxShadow: `0 16px 36px -30px ${palette.color}` }}
                  >
                    <p className="text-xs tracking-[0.2em] mb-2" style={{ color: palette.color, fontFamily: "var(--font-mono, monospace)" }}>
                      CASO {String(idx + 1).padStart(2, "0")}
                    </p>
                    <h2 className="font-display font-bold text-2xl leading-tight" style={{ color: "var(--text)" }}>{item.title}</h2>
                    <p className="text-sm leading-relaxed mt-3" style={{ color: "var(--text-muted)" }}>{item.summary}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedCase && (
            <div className="space-y-5 animate-fade-in-up">
              <button
                onClick={() => {
                  setSelectedCaseId(null);
                  setAnswers({});
                  setShowResult(false);
                }}
                className="text-sm px-4 py-2 rounded-lg"
                style={{ background: "var(--bg-card)", border: "1px solid rgba(0,255,136,0.18)", color: "var(--teal)", fontFamily: "var(--font-mono, monospace)" }}
              >
                &larr; Volver a todos los casos
              </button>

              <div className="rounded-2xl overflow-hidden" style={{ background: "var(--bg-card)", border: "1px solid rgba(0,255,136,0.12)" }}>
                <div className="px-6 sm:px-8 py-7" style={{ background: "linear-gradient(135deg, rgba(74,158,255,0.16), rgba(0,255,136,0.10))" }}>
                  <h2 className="font-display font-black text-3xl sm:text-4xl leading-tight" style={{ color: "var(--text)" }}>{selectedCase.title}</h2>
                  <p className="mt-2 text-sm" style={{ color: "#c0cae4" }}>{selectedCase.objective}</p>
                  <p className="text-xs mt-3" style={{ color: "var(--amber)", fontFamily: "var(--font-mono, monospace)" }}>
                    Puntaje actual: {score} / {maxScore}
                  </p>
                </div>

                <div className="px-6 sm:px-8 py-7 space-y-5">
                  {selectedCase.questions.map((question, qIndex) => (
                    <div key={question.id} className="rounded-xl p-5" style={{ background: "var(--bg-raised)", border: "1px solid rgba(245,166,35,0.18)" }}>
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="text-xs px-2 py-1 rounded" style={{ color: "var(--amber)", background: "rgba(245,166,35,0.08)", fontFamily: "var(--font-mono, monospace)" }}>
                          DECISION {qIndex + 1}
                        </span>
                        <Link href={`/proteina/${question.protein.id}`} className="text-xs px-2 py-1 rounded" style={{ color: "#7dd3fc", border: "1px solid rgba(125,211,252,0.24)", fontFamily: "var(--font-mono, monospace)" }}>
                          {question.protein.label}
                        </Link>
                      </div>
                      <p className="text-sm font-semibold mb-3" style={{ color: "var(--text)" }}>{question.prompt}</p>
                      <div className="space-y-2">
                        {question.options.map((option, oIndex) => {
                          const isSelected = answers[question.id] === oIndex;
                          return (
                            <button
                              key={option.text}
                              onClick={() => {
                                setAnswers((prev) => ({ ...prev, [question.id]: oIndex }));
                                setShowResult(false);
                              }}
                              className="w-full text-left px-3 py-2 rounded-lg transition-all"
                              style={{
                                background: isSelected ? "rgba(0,255,136,0.10)" : "rgba(255,255,255,0.02)",
                                border: isSelected ? "1px solid rgba(0,255,136,0.30)" : "1px solid rgba(255,255,255,0.08)",
                                color: isSelected ? "var(--text)" : "var(--text-muted)",
                              }}
                            >
                              {option.text}
                            </button>
                          );
                        })}
                      </div>
                      {showResult && answers[question.id] !== undefined && (
                        <p className="text-xs mt-3" style={{ color: question.options[answers[question.id]].isBest ? "#22d3ee" : "#fca5a5" }}>
                          {question.options[answers[question.id]].rationale}
                        </p>
                      )}
                    </div>
                  ))}

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => setShowResult(true)}
                      disabled={answeredCount !== selectedCase.questions.length}
                      className="px-5 py-3 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
                      style={{ background: "linear-gradient(135deg, #00ff88, #4a9eff)", color: "#061018", fontFamily: "var(--font-mono, monospace)" }}
                    >
                      Calcular puntaje del caso
                    </button>
                    <Link href="/games" className="px-5 py-3 rounded-lg text-sm font-semibold" style={{ border: "1px solid rgba(255,255,255,0.12)", color: "var(--text-muted)", fontFamily: "var(--font-mono, monospace)" }}>
                      Ir a entrenamiento rapido
                    </Link>
                  </div>
                </div>
              </div>

              {showResult && (
                <div className="rounded-xl p-5" style={{ background: "var(--bg-card)", border: "1px solid rgba(0,255,136,0.14)" }}>
                  <p className="text-xs tracking-[0.18em] mb-2" style={{ color: "var(--teal)", fontFamily: "var(--font-mono, monospace)" }}>
                    RESULTADO DEL CASO
                  </p>
                  <p className="text-2xl font-display font-black" style={{ color: "var(--text)" }}>{score} / {maxScore} puntos</p>
                  <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Precision clinica estimada: {scorePercent}%</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
