"use client";

import { useRef, useEffect, useState } from "react";

interface InsulinMolecule {
  x: number; y: number;
  bound: boolean;
  wallX: number; wallY: number;
  angle: number;
  speed: number;
}

const DRUGS = [
  { id: "insulin", name: "Insulina", loss: "40-80% en 2h", mechanism: "Se adsorbe al PVC del tubo por interacciones hidrofóbicas. Las soluciones de mayor concentración saturan los sitios de unión antes.", color: "#60a5fa", icon: "💉" },
  { id: "vitamina_a", name: "Vitamina A", loss: "30-50% en 8h", mechanism: "Se adsorbe y fotodegrada en plástico. Perder fotoproteción (envuelta opaca) duplica las pérdidas.", color: "#f5a623", icon: "🌟" },
  { id: "diazepam", name: "Diazepam", loss: "hasta 90% en PVC", mechanism: "Altamente lipofílico. La solución de NP extrae la benzodiazepina de la solución acuosa hacia la matriz de PVC.", color: "#a78bfa", icon: "💊" },
  { id: "nitroglycerin", name: "Nitroglicerina", loss: "50-80% en PVC flexible", mechanism: "Migra hacia la capa de PVC por alta afinidad. Los sets de PE o polietileno muestran <5% de pérdida.", color: "#f87171", icon: "❤️" },
];

export default function FarmacoSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const moleculesRef = useRef<InsulinMolecule[]>([]);
  const [selectedDrug, setSelectedDrug] = useState("insulin");
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [boundCount, setBoundCount] = useState(0);

  const drug = DRUGS.find((d) => d.id === selectedDrug) ?? DRUGS[0];
  const totalMolecules = 30;
  const maxBound = Math.round(totalMolecules * 0.75);

  const reset = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = canvas.width, H = canvas.height;
    const molecules: InsulinMolecule[] = [];
    for (let i = 0; i < totalMolecules; i++) {
      molecules.push({
        x: 60 + Math.random() * (W - 120),
        y: 30 + Math.random() * (H - 60),
        bound: false,
        wallX: 0, wallY: 0,
        angle: Math.random() * Math.PI * 2,
        speed: 0.8 + Math.random() * 0.6,
      });
    }
    moleculesRef.current = molecules;
    setTime(0);
    setBoundCount(0);
    setRunning(false);
  };

  useEffect(() => { reset(); }, [selectedDrug]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width, H = canvas.height;

    const TUBE_LEFT = 30, TUBE_RIGHT = W - 30;
    const TUBE_TOP = 20, TUBE_BOTTOM = H - 20;
    const WALL_THICKNESS = 18;

    let localBound = 0;
    let frame = 0;

    const animate = () => {
      ctx.clearRect(0, 0, W, H);

      // Draw PVC tube
      ctx.fillStyle = "rgba(168,85,247,0.08)";
      ctx.fillRect(TUBE_LEFT, TUBE_TOP, TUBE_RIGHT - TUBE_LEFT, TUBE_BOTTOM - TUBE_TOP);

      // Tube walls (PVC)
      ctx.fillStyle = "rgba(168,85,247,0.25)";
      ctx.fillRect(TUBE_LEFT, TUBE_TOP, WALL_THICKNESS, TUBE_BOTTOM - TUBE_TOP); // left
      ctx.fillRect(TUBE_RIGHT - WALL_THICKNESS, TUBE_TOP, WALL_THICKNESS, TUBE_BOTTOM - TUBE_TOP); // right
      ctx.fillRect(TUBE_LEFT, TUBE_TOP, TUBE_RIGHT - TUBE_LEFT, WALL_THICKNESS); // top
      ctx.fillRect(TUBE_LEFT, TUBE_BOTTOM - WALL_THICKNESS, TUBE_RIGHT - TUBE_LEFT, WALL_THICKNESS); // bottom

      ctx.font = "9px monospace";
      ctx.fillStyle = "rgba(168,85,247,0.6)";
      ctx.textAlign = "center";
      ctx.fillText("PARED PVC", TUBE_LEFT + WALL_THICKNESS / 2, TUBE_TOP + (TUBE_BOTTOM - TUBE_TOP) / 2);
      ctx.fillText("PARED PVC", TUBE_RIGHT - WALL_THICKNESS / 2, TUBE_TOP + (TUBE_BOTTOM - TUBE_TOP) / 2);

      // Lumen label
      ctx.fillStyle = "rgba(255,255,255,0.08)";
      ctx.textAlign = "center";
      ctx.font = "8px monospace";
      ctx.fillStyle = "rgba(255,255,255,0.15)";
      ctx.fillText("LUZ DEL TUBO", W / 2, TUBE_TOP + 10);

      const molecules = moleculesRef.current;
      localBound = 0;
      frame++;

      // Gradually bind molecules over time
      if (running && frame % 90 === 0 && localBound < maxBound) {
        const free = molecules.filter((m) => !m.bound);
        if (free.length > 0) {
          const target = free[Math.floor(Math.random() * free.length)];
          // Bind to wall
          const wall = Math.floor(Math.random() * 4);
          if (wall === 0) { target.wallX = TUBE_LEFT + WALL_THICKNESS / 2; target.wallY = TUBE_TOP + 20 + Math.random() * (TUBE_BOTTOM - TUBE_TOP - 40); }
          else if (wall === 1) { target.wallX = TUBE_RIGHT - WALL_THICKNESS / 2; target.wallY = TUBE_TOP + 20 + Math.random() * (TUBE_BOTTOM - TUBE_TOP - 40); }
          else if (wall === 2) { target.wallX = TUBE_LEFT + 20 + Math.random() * (TUBE_RIGHT - TUBE_LEFT - 40); target.wallY = TUBE_TOP + WALL_THICKNESS / 2; }
          else { target.wallX = TUBE_LEFT + 20 + Math.random() * (TUBE_RIGHT - TUBE_LEFT - 40); target.wallY = TUBE_BOTTOM - WALL_THICKNESS / 2; }
          target.bound = true;
        }
      }

      molecules.forEach((m) => {
        if (m.bound) {
          localBound++;
          // Draw bound molecule on wall
          ctx.beginPath();
          ctx.arc(m.wallX, m.wallY, 5, 0, Math.PI * 2);
          ctx.fillStyle = `${drug.color}80`;
          ctx.fill();
          ctx.strokeStyle = drug.color;
          ctx.lineWidth = 1;
          ctx.stroke();
          // Bind anchor
          ctx.beginPath();
          ctx.moveTo(m.wallX, m.wallY);
          const anchorX = m.wallX < W / 2 ? m.wallX - 6 : m.wallX + 6;
          ctx.lineTo(anchorX, m.wallY);
          ctx.strokeStyle = `${drug.color}40`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
          return;
        }

        // Free molecule movement
        m.angle += (Math.random() - 0.5) * 0.3;
        m.x += Math.cos(m.angle) * m.speed;
        m.y += Math.sin(m.angle) * m.speed;

        // Keep in lumen
        const minX = TUBE_LEFT + WALL_THICKNESS + 5, maxX = TUBE_RIGHT - WALL_THICKNESS - 5;
        const minY = TUBE_TOP + WALL_THICKNESS + 5, maxY = TUBE_BOTTOM - WALL_THICKNESS - 5;
        if (m.x < minX) { m.x = minX; m.angle = Math.PI - m.angle; }
        if (m.x > maxX) { m.x = maxX; m.angle = Math.PI - m.angle; }
        if (m.y < minY) { m.y = minY; m.angle = -m.angle; }
        if (m.y > maxY) { m.y = maxY; m.angle = -m.angle; }

        // Draw free molecule (Y-shaped for insulin)
        ctx.save();
        ctx.translate(m.x, m.y);
        ctx.rotate(m.angle);
        ctx.beginPath();
        ctx.moveTo(0, 4); ctx.lineTo(0, -4);
        ctx.moveTo(0, 0); ctx.lineTo(-4, -4);
        ctx.moveTo(0, 0); ctx.lineTo(4, -4);
        ctx.strokeStyle = drug.color;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      });

      setBoundCount(localBound);
      if (running && frame < 1200) {
        setTime((t) => t + 1 / 60);
      } else if (frame >= 1200) {
        setRunning(false);
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animRef.current);
  }, [running, drug, maxBound]);

  const freePct = Math.round(((totalMolecules - boundCount) / totalMolecules) * 100);
  const timeDisplay = Math.round(time * 12); // simulate minutes

  return (
    <div className="space-y-6">
      {/* Drug selector */}
      <div className="flex flex-wrap gap-2">
        {DRUGS.map((d) => (
          <button key={d.id} onClick={() => setSelectedDrug(d.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              background: selectedDrug === d.id ? `${d.color}15` : "var(--bg-card)",
              border: `1px solid ${selectedDrug === d.id ? d.color + "40" : "rgba(255,255,255,0.06)"}`,
              color: selectedDrug === d.id ? d.color : "var(--text-muted)",
            }}>
            {d.icon} {d.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        {/* Canvas */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "#0f172a", border: `1px solid ${drug.color}25` }}>
          <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: `1px solid ${drug.color}15` }}>
            <div className="flex items-center gap-2">
              <span className="text-sm">{drug.icon}</span>
              <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>{drug.name} EN TUBO PVC</span>
            </div>
            <div className="text-xs font-mono flex gap-4" style={{ color: "var(--text-muted)" }}>
              <span>⏱ {timeDisplay} min</span>
              <span style={{ color: drug.color }}>Libre: {freePct}%</span>
            </div>
          </div>
          <canvas ref={canvasRef} width={480} height={260} className="w-full" />
        </div>

        {/* Info panel */}
        <div className="space-y-3">
          {/* Loss stats */}
          <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: `1px solid ${drug.color}15` }}>
            <p className="text-xs font-mono mb-3" style={{ color: "var(--text-faint)" }}>PÉRDIDA DOCUMENTADA</p>
            <p className="text-2xl font-bold font-mono" style={{ color: drug.color }}>{drug.loss}</p>
            <div className="mt-3 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
              <div className="h-full rounded-full transition-all"
                style={{ width: `${100 - freePct}%`, background: `linear-gradient(90deg,${drug.color}80,${drug.color})` }} />
            </div>
            <div className="flex justify-between text-xs mt-1 font-mono" style={{ color: "var(--text-faint)" }}>
              <span>Adsorbido: {100 - freePct}%</span>
              <span>Disponible: {freePct}%</span>
            </div>
          </div>

          {/* Mechanism */}
          <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid rgba(255,255,255,0.04)" }}>
            <p className="text-xs font-mono mb-2" style={{ color: "var(--text-faint)" }}>MECANISMO</p>
            <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{drug.mechanism}</p>
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            <button onClick={() => setRunning(!running)}
              className="flex-1 py-2 rounded-xl text-sm font-bold transition-all"
              style={{ background: running ? "rgba(239,68,68,0.1)" : `${drug.color}12`, border: `1px solid ${running ? "rgba(239,68,68,0.3)" : drug.color + "30"}`, color: running ? "#ef4444" : drug.color }}>
              {running ? "⏸ Pausar" : "▶ Simular"}
            </button>
            <button onClick={reset}
              className="px-4 py-2 rounded-xl text-sm font-bold transition-all"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "var(--text-muted)" }}>
              ↺
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: "🧲", title: "Adsorción: el problema invisible", body: "La adsorción ocurre en segundos de contacto. Para la insulina, el 50% puede adsorberse en los primeros 30 min de infusión — los 30 min más importantes.", color: "#60a5fa" },
          { icon: "🛡️", title: "Estrategias de prevención", body: "Usar sets de polietileno (PE) o polipropileno (PP) en lugar de PVC. Pre-enjuagar el set con 50 mL de la solución. Usar concentraciones más altas (menos superficie:volumen).", color: "#34d399" },
          { icon: "📊", title: "Impacto clínico real", body: "Un paciente en NP que recibe 100 UI de insulina puede recibir solo 20-60 UI realmente. Ajustar la dosis asumiendo 20-30% de pérdida es práctica clínica estándar.", color: "#f5a623" },
        ].map((c) => (
          <div key={c.title} className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: `1px solid ${c.color}15` }}>
            <span className="text-xl mb-2 block">{c.icon}</span>
            <h4 className="text-sm font-bold mb-2" style={{ color: c.color }}>{c.title}</h4>
            <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{c.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
