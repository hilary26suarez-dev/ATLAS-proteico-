export const CURIOSIDADES: Record<string, { icon: string; fact: string; source: string }[]> = {
  glut1: [
    { icon: "🔢", fact: "Hay 200,000 copias de GLUT1 en cada eritrocito — representa el 2% de todas las proteínas de la membrana del glóbulo rojo.", source: "Mueckler, 1994" },
    { icon: "🧠", fact: "Los glioblastomas sobreexpresan GLUT1 hasta 40× — el PET-scan con fluorodesoxiglucosa (FDG) ilumina exactamente estos tumores por el efecto Warburg.", source: "Macheda, 2005" },
    { icon: "🔄", fact: "GLUT1 rota físicamente su bolsillo de unión entre la cara extracelular e intracelular como una puerta giratoria — sin consumir ni un ATP (transporte pasivo facilitado).", source: "Deng, 2014" },
  ],
  glut2: [
    { icon: "📊", fact: "Su baja afinidad por la glucosa (Km ~17 mM) la convierte en un sensor proporcional: solo activa la célula β pancreática cuando la glucemia es realmente alta.", source: "Thorens, 2015" },
    { icon: "🧬", fact: "Una sola mutación causa el Síndrome de Fanconi-Bickel: hipoglucemia en ayunas + hiperglucemia postprandial + glucosuria, todo en un solo gen.", source: "Santer, 1997" },
    { icon: "↔️", fact: "Es la única GLUT bidireccional libre — durante la absorción intestinal masiva deja pasar glucosa hacia el hepatocito sin saturarse, sin importar la concentración.", source: "Mueckler, 2013" },
  ],
  glut4: [
    { icon: "🫙", fact: "En reposo, el 95% de GLUT4 está escondido dentro de vesículas citoplasmáticas especiales (GSV) — inaccesible para la glucosa. La insulina lo desbloquea en <10 minutos.", source: "Klip, 2019" },
    { icon: "🏃", fact: "El ejercicio recluta GLUT4 a la membrana por una vía completamente independiente de insulina (vía AMPK) — por eso baja la glucemia incluso en diabéticos tipo 2 sin fármacos.", source: "Richter, 2013" },
    { icon: "⛓️", fact: "La cascada que activa GLUT4 involucra 7 kinasas secuenciales: INSR → IRS-1 → PI3K → PDK1 → Akt → AS160 → Rab → vesícula. Fallar en cualquier punto = resistencia a insulina.", source: "Leto, 2012" },
  ],
  lat1: [
    { icon: "👫", fact: "LAT1 no puede funcionar solo — necesita dimerizar obligatoriamente con 4F2hc (SLC3A2) mediante un puente disulfuro. Sin su pareja, LAT1 nunca llega a la membrana.", source: "Fotiadis, 2013" },
    { icon: "🎯", fact: "Los tumores sólidos sobreexpresan LAT1 hasta 10× para importar leucina y activar mTORC1 — es uno de los targets de inmunoterapia más prometedores en oncología.", source: "Scalise, 2018" },
    { icon: "⚖️", fact: "Cada aminoácido que entra obliga a uno a salir (antiporte obligatorio 1:1) — actúa como intercambiador molecular, no como canal. Entra leucina → sale glutamina.", source: "Meier, 2002" },
  ],
  nkaatpase: [
    { icon: "⚡", fact: "La Na⁺/K⁺-ATPasa consume el 20-40% del ATP total del cuerpo en reposo. En neuronas activas sube al 70% de su consumo energético.", source: "Bhaskaran, 2011" },
    { icon: "💊", fact: "La digoxina, usada por siglos para el corazón, funciona inhibiendo esta bomba: ↑Na⁺ intracelular → ↓gradiente Na/Ca → más calcio intracelular → músculo cardíaco más fuerte.", source: "Bhagat, 2020" },
    { icon: "🔌", fact: "Por cada ciclo bombea 3 Na⁺ hacia afuera y 2 K⁺ hacia adentro gastando 1 ATP — este desequilibrio de cargas genera el potencial de membrana de -70 mV en neuronas.", source: "Skou, 1957" },
  ],
  pit1: [
    { icon: "🧲", fact: "PiT-1 cotransporta fosfato con 2 iones Na⁺ — la fuerza motriz es el gradiente de Na⁺ creado por la Na⁺/K⁺-ATPasa. Una proteína depende de otra para funcionar.", source: "Collins, 2004" },
    { icon: "🚨", fact: "Hipofosfatemia en realimentación con NP puede colapsar: el fosfato entra masivamente a las células para fabricar ATP y su nivel plasmático cae al mismo tiempo.", source: "Marik, 2021" },
    { icon: "🔋", fact: "El fosfato es tan crítico que el cuerpo mantiene 4 transportadores paralelos (PiT-1, PiT-2, NaPi-IIb, Npt2a) — ninguno puede compensar completamente la pérdida de otro.", source: "Forster, 2013" },
  ],
  sglt1: [
    { icon: "⬆️", fact: "Mueve glucosa contra su gradiente de concentración usando el 'downhill' del Na⁺ — energía indirecta: primero el ATP carga el gradiente de Na⁺, luego SGLT1 lo aprovecha.", source: "Wright, 2011" },
    { icon: "💧", fact: "Sin SGLT1 (mutación homocigótica): diarrea osmótica grave desde el primer día de lactancia. Es letal si no se elimina todo azúcar de la dieta al nacer.", source: "Turk, 1991" },
    { icon: "💊", fact: "Los inhibidores SGLT2 (empagliflozina, dapagliflozina) son análogos; inhibir SGLT1 intestinal en desarrollo reduce el pico glucémico postprandial sin hipoglucemia.", source: "Poole, 2012" },
  ],
  mct1: [
    { icon: "👥", fact: "MCT1 también necesita un cofactor: la proteína CD147 (basigina), sin la cual no puede insertarse correctamente en la membrana plasmática.", source: "Kirk, 2000" },
    { icon: "🏋️", fact: "Los músculos lentos (tipo I) expresan MCT1 para importar lactato producido por músculos rápidos y oxidarlo en mitocondrias — el lactato no es solo un desecho, es combustible.", source: "Brooks, 2002" },
    { icon: "⚠️", fact: "En sepsis, cuando MCT1 hepático se satura, el lactato se acumula → acidosis láctica tipo B. En NP, monitorear lactato es tan importante como la glucemia.", source: "Garcia-Alvarez, 2014" },
  ],
  glucocinasa: [
    { icon: "📏", fact: "A diferencia de las otras hexocinasas, la glucocinasa responde linealmente hasta 10 mM — actúa como sensor proporcional, no como interruptor de encendido/apagado.", source: "Matschinsky, 2009" },
    { icon: "🔒", fact: "En ayunas, la proteína reguladora GKRP secuestra la glucocinasa en el núcleo. Cuando sube la glucosa, GKRP la libera al citoplasma — regulación por localización subcelular.", source: "Agius, 2008" },
    { icon: "🧬", fact: "Mutaciones heterocigóticas en GCK causan MODY-2: el umbral glucémico sube levemente, causando hiperglucemia leve permanente desde el nacimiento sin síntomas.", source: "Froguel, 1992" },
  ],
  cps1: [
    { icon: "🔑", fact: "CPS1 requiere N-acetilglutamato como activador alostérico obligatorio — sin NAG, aunque haya todo el amoniaco del mundo, el ciclo de la urea no arranca.", source: "Caldovic, 2010" },
    { icon: "🧠", fact: "Si CPS1 falla genéticamente, el amoniaco se acumula en horas causando encefalopatía hiperamonémica — los recién nacidos afectados deben recibir benzoato y fenilbutirato como bypass.", source: "Häberle, 2012" },
    { icon: "🏭", fact: "Es la enzima más grande del ciclo de la urea (165 kDa/monómero) y exclusivamente mitocondrial — el primer paso del ciclo ocurre donde se produce el NH₃: en la matriz.", source: "Rubio, 1981" },
  ],
  cpt1a: [
    { icon: "🌅", fact: "El ayuno activa CPT1A por dos vías simultáneas: cae el malonil-CoA (menos inhibición) Y sube el glucagón (activa PPARα → más CPT1A transcrita). Doble señal = respuesta ampliada.", source: "McGarry, 1983" },
    { icon: "🍼", fact: "En prematuros, CPT1A es el cuello de botella para oxidar lípidos — los bebés no sintetizan suficiente L-carnitina. Por eso la NP neonatal debe suplementarla.", source: "Penn, 1998" },
    { icon: "🎚️", fact: "La isoforma hepática (CPT1A) tiene 100× menos sensibilidad al malonil-CoA que la muscular (CPT1B) — el hígado sigue quemando grasas incluso cuando hace algo de síntesis lipídica.", source: "Akkaoui, 2009" },
  ],
  fas: [
    { icon: "🏭", fact: "FASN es una fábrica de 7 estaciones en una sola cadena proteica (250 kDa/monómero) — el palmitato emerge tras exactamente 7 ciclos de elongación, sin soltar el sustrato.", source: "Maier, 2008" },
    { icon: "🎯", fact: "Los cánceres de mama y próstata sobreexpresan FASN hasta 100× — el inhibidor TVB-2640 está actualmente en ensayos clínicos fase II.", source: "Menendez, 2007" },
    { icon: "🍬", fact: "Dextrosa excesiva en NP activa FASN hepática vía ChREBP: la glucosa se convierte en palmitato en menos de 48h, causando esteatosis hepática (hígado graso de NP).", source: "Kalaany, 2006" },
  ],
  alt: [
    { icon: "🔬", fact: "ALT es casi exclusivamente hepática en humanos — una elevación de 2× sobre el límite normal ya indica daño hepatocítico significativo, antes de que el paciente sienta nada.", source: "Kim, 2008" },
    { icon: "🌉", fact: "ALT conecta músculo e hígado: músculo produce alanina → ALT hepática la convierte en piruvato → gluconeogénesis → glucosa al músculo. En NP rica en aminoácidos, ALT trabaja a plena capacidad.", source: "Felig, 1970" },
    { icon: "🧪", fact: "El mecanismo usa piridoxal-5-fosfato (vitamina B6) como puente covalente que forma y rompe una base de Schiff en cada ciclo catalítico — sin B6, ALT no funciona.", source: "Mehta, 1993" },
  ],
  cyp3a4: [
    { icon: "💊", fact: "CYP3A4 metaboliza el 60% de todos los fármacos clínicos — pero su actividad varía 40× entre personas por polimorfismos genéticos e inducción/inhibición ambiental.", source: "Zanger, 2013" },
    { icon: "🍊", fact: "El jugo de pomelo inhibe CYP3A4 intestinal hasta 72h — una sola copa puede elevar peligrosamente los niveles de estatinas, ciclosporina o benzodiazepinas.", source: "Bailey, 1998" },
    { icon: "🏥", fact: "En NP de larga duración, la baja lipemia sin nutrición oral reduce la expresión de CYP3A4 hepático — los fármacos se metabolizan más lento, requiriendo ajuste de dosis.", source: "Mirtallo, 2004" },
  ],
  gs: [
    { icon: "🎛️", fact: "La glucógeno sintasa tiene 9 sitios de fosforilación — puede estar inhibida simultáneamente por GSK3, PKA, AMPK y CK1, cada uno actuando de forma aditiva.", source: "Roach, 2002" },
    { icon: "⏱️", fact: "El glucógeno hepático puede movilizarse para liberar glucosa en solo 15 minutos — es el primer amortiguador de hipoglucemia antes de que empiece la gluconeogénesis.", source: "Nordlie, 1999" },
    { icon: "📦", fact: "Una persona de 70 kg almacena ~100g de glucógeno hepático y ~400g muscular — suficiente para 24-36h de ayuno. En NP sin glucosa, el hepático se agota en <12h.", source: "Jéquier, 1994" },
  ],
  pc: [
    { icon: "🔀", fact: "PC cumple dos roles metabólicos al mismo tiempo: es el primer paso de gluconeogénesis Y alimenta el ciclo de Krebs cuando la célula necesita más oxaloacetato (anaplerósis).", source: "Jitrapakdee, 2008" },
    { icon: "🦾", fact: "La biotina se une covalentemente a PC mediante un brazo flexible de lisina que actúa como 'grúa', transfiriendo CO₂ entre los dos sitios activos separados 7 nm.", source: "St. Maurice, 2007" },
    { icon: "👶", fact: "Deficiencia genética de PC en lactantes causa acidosis láctica severa porque el piruvato no puede entrar al ciclo de Krebs — tratamiento: biotina + evitar el ayuno absoluto.", source: "Marin-Valencia, 2010" },
  ],
  sod1: [
    { icon: "⚙️", fact: "El cobre hace la catálisis (cicla entre Cu²⁺ y Cu⁺), pero el zinc solo mantiene la geometría del sitio activo — un metal actúa, el otro es armazón estructural.", source: "Antonyuk, 2009" },
    { icon: "🧬", fact: "Mutaciones en SOD1 causan el 20% de ELA familiar — paradójicamente NO por pérdida de actividad, sino por ganancia de función tóxica: la proteína mutada se agrega.", source: "Rosen, 1993" },
    { icon: "📊", fact: "SOD1 está en el citoplasma, el núcleo Y el espacio intermembrana mitocondrial — hay >700 millones de moléculas en cada hepatocito.", source: "Valentine, 2005" },
  ],
  sod2: [
    { icon: "🔩", fact: "SOD2 usa manganeso en lugar de cobre/zinc como SOD1 — misma reacción química, metal diferente, origen evolutivo distinto. Un ejemplo clásico de convergencia evolutiva.", source: "Borgstahl, 1992" },
    { icon: "🛡️", fact: "Es la única defensa antioxidante en la matriz mitocondrial donde se producen la mayoría de las ROS — sin SOD2, la mitocondria se autooxida en horas.", source: "Lebovitz, 1996" },
    { icon: "🧬", fact: "El polimorfismo Val16Ala en SOD2 (rs4880) altera la secuencia señal de importación mitocondrial — la variante Ala se importa más eficientemente y se asocia con menor riesgo de diabetes tipo 2.", source: "Liu, 2015" },
  ],
  catalasa: [
    { icon: "⚡", fact: "La catalasa es una de las enzimas más rápidas de la bioquímica: cataliza 200,000 reacciones por segundo por subunidad. Si fuera una persona, cortaría 40 millones de árboles por minuto.", source: "Switala, 2002" },
    { icon: "🏭", fact: "En peroxisomas hepáticos, la catalasa actúa junto a oxidasas que producen H₂O₂ — sistema acoplado producción + destrucción en el mismo orgánulo sin exportar el radical.", source: "Schrader, 2006" },
    { icon: "🍺", fact: "El alcohol etílico es oxidado a acetaldehído por dos vías: alcohol deshidrogenasa Y catalasa (esta usa H₂O₂ como oxidante) — por eso el alcohol eleva ambas enzimas.", source: "Cederbaum, 2012" },
  ],
  gpx4: [
    { icon: "🧱", fact: "GPX4 es la ÚNICA enzima capaz de reducir hidroperóxidos de lípidos integrados en la membrana — sin ella, la oxidación en cadena no puede detenerse desde adentro.", source: "Ursini, 1982" },
    { icon: "💀", fact: "La ferroptosis —muerte celular por oxidación lipídica— ocurre exactamente cuando GPX4 se inactiva. El RSL3 (inhibidor de GPX4) mata células tumorales que resisten apoptosis.", source: "Dixon, 2012" },
    { icon: "🔬", fact: "GPX4 usa selenocisteína (el aminoácido 21°) en lugar de cisteína: el selenio tiene un pKa más bajo y reacciona 100× más rápido. Esta ventaja catalítica justifica su rareza.", source: "Ingold, 2018" },
  ],
  nrf2: [
    { icon: "⏳", fact: "En condiciones normales, NRF2 tiene vida media de solo 15-20 minutos — KEAP1 la ubiquitina constantemente. El estrés oxidativo la estabiliza instantáneamente sin síntesis nueva.", source: "Itoh, 1999" },
    { icon: "🔑", fact: "NRF2 controla más de 250 genes citoprotectores simultáneamente — es el interruptor maestro de la defensa antioxidante celular con un solo factor de transcripción.", source: "Moi, 1994" },
    { icon: "🥦", fact: "El sulforafano del brócoli activa NRF2 modificando las cisteínas sensoras de KEAP1 — la razón molecular por la que comer vegetales crucíferos reduce el riesgo de cáncer.", source: "Zhang, 1992" },
  ],
  gstp1: [
    { icon: "💊", fact: "GSTP1 detoxifica el metabolito tóxico del acetaminofén (NAPQI) mediante conjugación con glutatión — sin ella, la dosis tóxica baja dramáticamente.", source: "Coles, 2002" },
    { icon: "🧬", fact: "El polimorfismo Ile105Val tiene 3× menos actividad que la variante normal — el 30% de la población lo tiene, lo que aumenta susceptibilidad a ciertos cánceres.", source: "Saadat, 2012" },
    { icon: "🔒", fact: "GSTP1 tiene una función inesperada: en células sin estrés, inhibe directamente a JNK (kinasa pro-apoptótica) uniéndose físicamente a ella. Con estrés se disocia → activa apoptosis.", source: "Adler, 1999" },
  ],
  nox2: [
    { icon: "⚔️", fact: "NOX2 es la única proteína diseñada intencionalmente para producir radicales libres — el superóxido que genera es la primera línea bactericida de los neutrófilos.", source: "Babior, 2000" },
    { icon: "🦠", fact: "Enfermedad granulomatosa crónica (CGD): mutaciones en NOX2 impiden matar bacterias fagocitadas — infecciones recurrentes graves desde la infancia por un solo gen.", source: "Segal, 2005" },
    { icon: "🏥", fact: "En NP de larga duración, los neutrófilos pueden perder capacidad de activar NOX2 — especialmente con LPS de translocación bacteriana, aumentando el riesgo de infección nosocomial.", source: "Pironi, 2016" },
  ],
  insr: [
    { icon: "🤝", fact: "INSR es un receptor tirosina cinasa que se activa a sí mismo — cuando insulina se une, el dominio intracelular fosforila a su propio compañero en el dímero en trans (trans-autofosforilación).", source: "Ward, 2019" },
    { icon: "📡", fact: "Una sola molécula de insulina activa una cascada de >300 eventos de fosforilación que llega al núcleo en <1 minuto. La señal se amplifica ×1000 en cada nivel.", source: "Taniguchi, 2006" },
    { icon: "🔥", fact: "La resistencia a insulina tipo 2 raramente es fallo del INSR — es IRS-1 (su sustrato directo) inhibido por serina-fosforilación causada por inflamación. La obesidad activa esta vía.", source: "Hotamisligil, 2010" },
  ],
  gcgr: [
    { icon: "📡", fact: "GCGR activa Gs → adenilil ciclasa → cAMP → PKA → glucogenólisis + gluconeogénesis simultáneamente. Con una sola hormona activa dos rutas anabólicas paralelas.", source: "Jiang, 2001" },
    { icon: "💉", fact: "El semaglutide (Ozempic) reduce indirectamente la activación de GCGR: disminuye la secreción postprandial de glucagón, cortando la producción hepática de glucosa tras las comidas.", source: "Nauck, 2021" },
    { icon: "❤️", fact: "GCGR existe en el corazón — el glucagón tiene efectos inotrópicos y cronotrópicos. En hipoglucemia grave sin respuesta a glucosa IV, el glucagón puede salvar el corazón.", source: "Drucker, 2018" },
  ],
  albumina: [
    { icon: "🚌", fact: "La albúmina tiene 7 sitios primarios de unión para ácidos grasos y docenas de sitios secundarios para fármacos — puede cargar 9 ácidos grasos simultáneamente.", source: "Bhattacharya, 2000" },
    { icon: "💧", fact: "Su concentración de 4 g/dL genera el 75% de la presión oncótica del plasma. Cuando cae a <2 g/dL aparecen edema, ascitis y derrame — el liquido escapa al intersticio.", source: "Doweiko, 1991" },
    { icon: "📉", fact: "La síntesis de albúmina (12g/día en el hígado) cae antes de que el paciente pierda peso visible — el nivel sérico es el predictor más temprano de desnutrición proteica.", source: "Rothschild, 1972" },
  ],
  igf1r: [
    { icon: "🔍", fact: "IGF1R tiene una afinidad por IGF-1 100× mayor que por insulina — aunque son estructuralmente similares, cada receptor discrimina su ligando con alta especificidad.", source: "Pollak, 2008" },
    { icon: "🧬", fact: "Glioblastomas y sarcomas sobreexpresan IGF1R para activar PI3K/Akt y escapar apoptosis — hay al menos 12 anticuerpos anti-IGF1R en ensayos clínicos activos.", source: "Denduluri, 2015" },
    { icon: "🍼", fact: "En prematuros con NP, la ausencia de alimentación enteral reduce IGF-1 circulante en 50% — el intestino produce un factor que estimula su síntesis hepática. Esta pérdida impacta el neurodesarrollo neonatal.", source: "Embleton, 2020" },
  ],
  mtor: [
    { icon: "🖥️", fact: "mTOR existe en dos complejos totalmente distintos: mTORC1 (sensible a rapamicina, regula síntesis proteica) y mTORC2 (resistente, regula citoesqueleto). Mismo núcleo, diferentes socios, funciones opuestas.", source: "Laplante, 2012" },
    { icon: "🏝️", fact: "La rapamicina fue descubierta en bacterias del suelo de Rapa Nui (Isla de Pascua) en 1972 — hoy recubre stents coronarios e inmunodeprime trasplantes. Un hongo de isla oceánica salvó millones de vidas.", source: "Vezina, 1975" },
    { icon: "⚖️", fact: "mTOR integra simultáneamente: niveles de aminoácidos, ATP, glucosa, factores de crecimiento e hipoxia. Es el procesador central del metabolismo celular con 5 entradas simultáneas.", source: "Saxton, 2017" },
  ],
  ttr: [
    { icon: "🧩", fact: "TTR funciona como tetrámero — y es exactamente la disociación en monómeros lo que causa amiloidosis cardíaca: los monómeros forman fibrillas insolubles en el miocardio.", source: "Connors, 2016" },
    { icon: "📦", fact: "TTR transporta tiroxina Y vitamina A simultáneamente: T4 en un canal central y retinol (unido a RBP4) en la superficie — doble función de transporte en una sola proteína.", source: "Monaco, 1995" },
    { icon: "💊", fact: "El tafamidis (Vyndaqel) estabiliza el tetrámero de TTR uniéndose al sitio de la tiroxina — aprobado en 2019 para cardiomiopatía por amiloidosis, reduce mortalidad en 30%.", source: "Maurer, 2018" },
  ],
  leptin: [
    { icon: "🐭", fact: "La leptina fue descubierta en 1994 en el ratón ob/ob — obeso masivo por un solo gen silenciado. Inyecciones diarias de leptina lo normalizaban completamente.", source: "Zhang, 1994" },
    { icon: "🚨", fact: "En anorexia nervixa severa, la leptina cae casi a cero — activa un programa de supervivencia: detiene la menstruación, baja la temperatura y reduce la inmunidad para ahorrar energía.", source: "Chan, 2010" },
    { icon: "🔄", fact: "En NP de larga duración, la adiposidad puede aumentar y la leptina subir — pero si el hipotálamo se vuelve leptina-resistente, el paciente no siente saciedad aunque el nivel sea alto.", source: "Sáinz, 2015" },
  ],
};
