"use client";

import { useRef, useEffect, useState, useCallback } from "react";

interface Molecule {
  x: number; y: number; vx: number; vy: number;
  bound: boolean; wallX: number; wallY: number;
  angle: number; phase: number;
}

const DRUGS = [
  { id: "insulin",  name: "Insulina",       icon: "💉", color: "#60a5fa", loss: "40–80%", time: "30–60 min", mechanism: "Adsorción hidrofóbica al PVC. Las cadenas β de insulina interactúan con ftalatos de la matriz plástica. A mayor concentración en la solución, menor % de pérdida (saturación de sitios).", prevention: "Set de PE/PP. Pre-flush con 50 mL de solución de insulina. Monitoreo de glucemia cada 1–2h." },
  { id: "vit_a",    name: "Vitamina A",      icon: "🌟", color: "#fbbf24", loss: "30–50%", time: "4–8 h",     mechanism: "Adsorción a PVC Y fotodegradación. La molécula lipofílica del retinol migra a la matriz de PVC. La luz UV/visible rompe el sistema de dobles enlaces conjugados.", prevention: "Bolsas de EVA o Multilayer. Envuelta opaca de aluminio. Reemplazar set cada 12h." },
  { id: "diazepam", name: "Diazepam",        icon: "💊", color: "#a78bfa", loss: "hasta 90%", time: "2–6 h",  mechanism: "Altamente lipofílico (logP=2.8). La solución acuosa no puede mantener el diazepam soluble — migra preferentemente hacia la matriz hidrofóbica de PVC. Incompatible con NP.", prevention: "Usar set de polietileno. Administrar separado de la NP. No mezclar en bolsa AIO." },
  { id: "nitro",    name: "Nitroglicerina",  icon: "❤️", color: "#f87171", loss: "50–80%", time: "1–4 h",    mechanism: "Migración al PVC flexible por alta afinidad. Sets de PVC pierden hasta 80% en las primeras horas. Los sets de PE muestran < 5% de pérdida total.", prevention: "Usar sets de polietileno rígido (PE). Verificar concentración sérica. Control ECG continuo." },
];

export default function FarmacoSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef   = useRef<number>(0);
  const molsRef   = useRef<Molecule[]>([]);
  const historyRef = useRef<number[]>([]);
  const [drug, setDrug] = useState(DRUGS[0]);
  const [running, setRunning] = useState(false);
  const [timeSec, setTimeSec] = useState(0);
  const [boundPct, setBoundPct] = useState(0);

  const TOTAL = 28;
  const MAX_BOUND = Math.round(TOTAL * parseFloat(drug.loss.replace("%","").replace("hasta ","").replace("–","..").split("..")[1] ?? "70") / 100);

  const reset = useCallback(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const W = canvas.offsetWidth, H = canvas.offsetHeight;
    const mols: Molecule[] = [];
    for (let i = 0; i < TOTAL; i++) {
      mols.push({ x: 55 + Math.random() * (W - 110), y: 32 + Math.random() * (H - 64), vx: (Math.random() - 0.5) * 0.9, vy: (Math.random() - 0.5) * 0.9, bound: false, wallX: 0, wallY: 0, angle: Math.random() * Math.PI * 2, phase: Math.random() * Math.PI * 2 });
    }
    molsRef.current = mols;
    historyRef.current = [];
    setTimeSec(0);
    setBoundPct(0);
    setRunning(false);
  }, []);

  useEffect(() => { reset(); }, [drug, reset]);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;

    const dpr = window.devicePixelRatio ?? 1;
    const W = canvas.offsetWidth, H = canvas.offsetHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.scale(dpr, dpr);
    const CW = W, CH = H;

    const WALL = 22;
    const LUMEN_X1 = WALL, LUMEN_X2 = CW - WALL;
    const LUMEN_Y1 = WALL, LUMEN_Y2 = CH - WALL;

    let frame = 0;
    let localTime = 0;

    const drawGrid = () => {
      ctx.save(); ctx.fillStyle = `${drug.color}06`;
      for (let gx = 0; gx < CW; gx += 20) for (let gy = 0; gy < CH; gy += 20) { ctx.beginPath(); ctx.arc(gx, gy, 0.8, 0, Math.PI * 2); ctx.fill(); }
      ctx.restore();
    };

    const drawMolecule = (m: Molecule, bound: boolean) => {
      const cx = bound ? m.wallX : m.x;
      const cy = bound ? m.wallY : m.y;
      ctx.save();
      ctx.translate(cx, cy);
      if (!bound) ctx.rotate(m.angle + Math.sin(m.phase) * 0.3);

      // Y-shape (insulin-like)
      ctx.shadowBlur = bound ? 4 : 12;
      ctx.shadowColor = bound ? `${drug.color}40` : drug.color;
      ctx.strokeStyle = bound ? `${drug.color}55` : drug.color;
      ctx.lineWidth = bound ? 1.2 : 1.8;
      ctx.lineCap = "round";

      ctx.beginPath();
      ctx.moveTo(0, 5); ctx.lineTo(0, -3);
      ctx.moveTo(0, 0); ctx.lineTo(-5, -5);
      ctx.moveTo(0, 0); ctx.lineTo(5, -5);
      ctx.stroke();

      // Node dots
      ctx.fillStyle = bound ? `${drug.color}50` : drug.color;
      [{ x: 0, y: 5 }, { x: -5, y: -5 }, { x: 5, y: -5 }].forEach(({ x, y }) => {
        ctx.beginPath(); ctx.arc(x, y, bound ? 1.2 : 1.8, 0, Math.PI * 2); ctx.fill();
      });

      if (bound) {
        // Anchor line to wall
        ctx.strokeStyle = `${drug.color}30`; ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(0, 0);
        ctx.lineTo(cx < CW / 2 ? -8 : 8, 0); ctx.stroke();
      }

      ctx.restore();
    };

    const animate = () => {
      frame++;
      ctx.clearRect(0, 0, CW, CH);

      // Background
      ctx.fillStyle = "#07080F"; ctx.fillRect(0, 0, CW, CH);
      drawGrid();

      // PVC walls
      ctx.save();
      ctx.shadowBlur = 10; ctx.shadowColor = `${drug.color}20`;
      const wallAlpha = 0.22;
      ctx.fillStyle = `rgba(100,60,180,${wallAlpha})`;
      ctx.fillRect(0, 0, WALL, CH); ctx.fillRect(CW - WALL, 0, WALL, CH);
      ctx.fillRect(0, 0, CW, WALL); ctx.fillRect(0, CH - WALL, CW, WALL);
      ctx.restore();

      // Wall labels
      ctx.save(); ctx.font = "7px monospace"; ctx.fillStyle = "rgba(168,85,247,0.5)"; ctx.textAlign = "center";
      ctx.save(); ctx.translate(WALL / 2, CH / 2); ctx.rotate(-Math.PI / 2); ctx.fillText("PARED PVC", 0, 0); ctx.restore();
      ctx.save(); ctx.translate(CW - WALL / 2, CH / 2); ctx.rotate(Math.PI / 2); ctx.fillText("PARED PVC", 0, 0); ctx.restore();
      ctx.restore();

      // Lumen label
      ctx.font = "8px monospace"; ctx.fillStyle = "rgba(255,255,255,0.12)"; ctx.textAlign = "center";
      ctx.fillText("— LUZ DEL CATÉTER —", CW / 2, LUMEN_Y1 + 12);

      // Bind one molecule per N frames
      const mols = molsRef.current;
      const alreadyBound = mols.filter((m) => m.bound).length;
      const bindRate = running ? 70 : 999999;
      if (running && frame % bindRate === 0 && alreadyBound < MAX_BOUND) {
        const free = mols.filter((m) => !m.bound);
        if (free.length > 0) {
          const t = free[Math.floor(Math.random() * free.length)];
          const wall = Math.floor(Math.random() * 4);
          if (wall === 0)      { t.wallX = WALL / 2;       t.wallY = LUMEN_Y1 + 14 + Math.random() * (CH - LUMEN_Y1 - 28); }
          else if (wall === 1) { t.wallX = CW - WALL / 2;  t.wallY = LUMEN_Y1 + 14 + Math.random() * (CH - LUMEN_Y1 - 28); }
          else if (wall === 2) { t.wallX = LUMEN_X1 + 14 + Math.random() * (CW - LUMEN_X1 - 28); t.wallY = WALL / 2; }
          else                 { t.wallX = LUMEN_X1 + 14 + Math.random() * (CW - LUMEN_X1 - 28); t.wallY = CH - WALL / 2; }
          t.bound = true;
        }
      }

      if (running) localTime += 1 / 60;

      let boundCount = 0;
      mols.forEach((m) => {
        if (m.bound) { boundCount++; drawMolecule(m, true); return; }
        m.phase += 0.04; m.angle += (Math.random() - 0.5) * 0.08;
        m.vx += (Math.random() - 0.5) * 0.25; m.vy += (Math.random() - 0.5) * 0.25;
        const spd = Math.sqrt(m.vx ** 2 + m.vy ** 2);
        if (spd > 1.6) { m.vx *= 1.6 / spd; m.vy *= 1.6 / spd; }
        m.x += m.vx; m.y += m.vy;
        if (m.x < LUMEN_X1 + 5) { m.x = LUMEN_X1 + 5; m.vx = Math.abs(m.vx); }
        if (m.x > LUMEN_X2 - 5) { m.x = LUMEN_X2 - 5; m.vx = -Math.abs(m.vx); }
        if (m.y < LUMEN_Y1 + 5) { m.y = LUMEN_Y1 + 5; m.vy = Math.abs(m.vy); }
        if (m.y > LUMEN_Y2 - 5) { m.y = LUMEN_Y2 - 5; m.vy = -Math.abs(m.vy); }
        drawMolecule(m, false);
      });

      const pct = Math.round((boundCount / TOTAL) * 100);
      setBoundPct(pct);
      if (running) setTimeSec(Math.round(localTime * 12));

      // Draw mini graph (bottom right)
      historyRef.current.push(100 - pct);
      if (historyRef.current.length > 60) historyRef.current.shift();
      const hist = historyRef.current;
      const gx0 = CW - 100, gy0 = CH - 50, gW = 90, gH = 38;
      ctx.save();
      ctx.strokeStyle = "rgba(255,255,255,0.06)"; ctx.lineWidth = 0.5;
      ctx.strokeRect(gx0, gy0, gW, gH);
      ctx.font = "7px monospace"; ctx.fillStyle = "rgba(255,255,255,0.2)"; ctx.textAlign = "left";
      ctx.fillText("% LIBRE", gx0 + 2, gy0 + 9);
      if (hist.length > 1) {
        ctx.beginPath();
        hist.forEach((val, idx) => {
          const px = gx0 + (idx / 60) * gW;
          const py = gy0 + gH - (val / 100) * gH;
          idx === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        });
        ctx.strokeStyle = drug.color; ctx.lineWidth = 1.5;
        ctx.shadowBlur = 6; ctx.shadowColor = drug.color;
        ctx.stroke();
      }
      ctx.restore();

      animRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animRef.current);
  }, [running, drug, MAX_BOUND]);

  return (
    <div className="space-y-6">
      {/* Drug selector */}
      <div className="flex flex-wrap gap-2">
        {DRUGS.map((d) => (
          <button key={d.id} onClick={() => setDrug(d)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{ background: drug.id === d.id ? `${d.color}12` : "#111118", border: `1px solid ${drug.id === d.id ? d.color + "35" : "rgba(255,255,255,0.06)"}`, color: drug.id === d.id ? d.color : "#6B7BA0" }}>
            {d.icon} {d.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6">
        <div className="rounded-2xl overflow-hidden flex flex-col"
          style={{ background: "#07080F", border: `1px solid ${drug.color}25`, boxShadow: `0 0 25px ${drug.color}06` }}>
          <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: `1px solid ${drug.color}12` }}>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: drug.color, boxShadow: `0 0 6px ${drug.color}` }} />
              <span style={{ color: drug.color }}>{drug.icon} {drug.name.toUpperCase()} EN CATÉTER PVC</span>
            </div>
            <span className="text-xs font-mono" style={{ color: "#6B7BA0" }}>
              ⏱ {timeSec} min · Libre: {100 - boundPct}%
            </span>
          </div>
          <canvas ref={canvasRef} className="w-full" style={{ height: 280 }} />
        </div>

        <div className="space-y-3">
          <div className="rounded-xl p-5" style={{ background: "#111118", border: `1px solid ${drug.color}20` }}>
            <p className="text-xs font-mono mb-2" style={{ color: "#6B7BA0" }}>PÉRDIDA DOCUMENTADA</p>
            <p className="text-3xl font-bold font-mono" style={{ color: drug.color }}>{drug.loss}</p>
            <p className="text-xs mt-1 font-mono" style={{ color: "#6B7BA0" }}>en {drug.time}</p>
            <div className="mt-4 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
              <div className="h-full rounded-full transition-all duration-300" style={{ width: `${boundPct}%`, background: `linear-gradient(90deg,${drug.color}80,${drug.color})` }} />
            </div>
            <div className="flex justify-between text-xs mt-1 font-mono" style={{ color: "#6B7BA0" }}>
              <span>Adsorbido: {boundPct}%</span><span>Disponible: {100 - boundPct}%</span>
            </div>
          </div>

          <div className="rounded-xl p-4" style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.04)" }}>
            <p className="text-xs font-mono mb-2" style={{ color: "#6B7BA0" }}>PREVENCIÓN</p>
            <p className="text-xs leading-relaxed" style={{ color: "#9BA3BE" }}>{drug.prevention}</p>
          </div>

          <div className="flex gap-2">
            <button onClick={() => setRunning(!running)}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
              style={{ background: running ? "rgba(239,68,68,0.1)" : `${drug.color}12`, border: `1px solid ${running ? "rgba(239,68,68,0.3)" : drug.color + "30"}`, color: running ? "#ef4444" : drug.color }}>
              {running ? "⏸ Pausar" : "▶ Simular"}
            </button>
            <button onClick={reset} className="px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
              style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.07)", color: "#6B7BA0" }}>
              ↺
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: "🧲", title: "Adsorción: invisible y silenciosa", body: "La adsorción comienza en los primeros minutos de contacto. Para insulina, el 50% puede perderse en los primeros 30 min — crítico en ajuste de dosis en UCI.", color: "#60a5fa" },
          { icon: "🛡️", title: "Sets alternativos al PVC", body: "Polietileno (PE), polipropileno (PP) y EVAC son significativamente mejores. El vidrio es el material de referencia para compatibilidad. Verificar antes de prescribir.", color: "#34d399" },
          { icon: "📊", title: "Impacto clínico cuantificable", body: "Un paciente con 100 UI/h de insulina en set PVC puede recibir 20–60 UI/h reales. La hiperglucemia persistente sin causa aparente en NP debe hacer sospechar adsorción.", color: "#f5a623" },
        ].map((c) => (
          <div key={c.title} className="rounded-xl p-4" style={{ background: "#111118", border: `1px solid ${c.color}15` }}>
            <span className="text-xl mb-2 block">{c.icon}</span>
            <h4 className="text-sm font-bold mb-2" style={{ color: c.color }}>{c.title}</h4>
            <p className="text-xs leading-relaxed" style={{ color: "#9BA3BE" }}>{c.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
