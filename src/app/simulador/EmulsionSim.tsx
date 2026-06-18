"use client";

import { useRef, useEffect, useState } from "react";

interface Droplet {
  x: number; y: number; r: number; vx: number; vy: number;
  charge: number; merged: boolean; phase: number;
}

export default function EmulsionSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const dropletsRef = useRef<Droplet[]>([]);
  const [cations, setCations] = useState(5);
  const [dextrose, setDextrose] = useState(20);
  const [temp, setTemp] = useState(25);
  const [mergeCount, setMergeCount] = useState(0);

  const neutralization = Math.min(1, cations / 28);
  const viscosity = 1 - dextrose * 0.005;
  const tempFactor = 1 + (temp - 25) * 0.018;
  const instability = Math.min(1, neutralization * viscosity * tempFactor);
  const zetaPotential = Math.round(-45 * (1 - neutralization));
  const stateLabel = instability < 0.28 ? "ESTABLE" : instability < 0.6 ? "INESTABLE" : "ROTA";
  const stateColor = stateLabel === "ESTABLE" ? "#00FF88" : stateLabel === "INESTABLE" ? "#fbbf24" : "#ef4444";

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const W = canvas.offsetWidth, H = canvas.offsetHeight;
    const drops: Droplet[] = [];
    for (let i = 0; i < 20; i++) {
      drops.push({ x: 30 + Math.random() * (W - 60), y: 40 + Math.random() * (H * 0.65), r: 9 + Math.random() * 7, vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5, charge: -1, merged: false, phase: Math.random() * Math.PI * 2 });
    }
    dropletsRef.current = drops;
    setMergeCount(0);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;

    const dpr = window.devicePixelRatio ?? 1;
    const W = canvas.offsetWidth, H = canvas.offsetHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.scale(dpr, dpr);
    const CW = W, CH = H;

    let merges = 0;
    let frame = 0;

    // Draw dot grid
    const drawGrid = () => {
      ctx.save(); ctx.fillStyle = "rgba(96,165,250,0.03)";
      for (let gx = 0; gx < CW; gx += 22) for (let gy = 0; gy < CH; gy += 22) { ctx.beginPath(); ctx.arc(gx, gy, 0.8, 0, Math.PI * 2); ctx.fill(); }
      ctx.restore();
    };

    // Draw a phospholipid droplet with spikes
    const drawDroplet = (d: Droplet) => {
      const chargeAbs = Math.abs(d.charge);
      const numSpikes = Math.floor(chargeAbs * 12) + 4;

      // Glow
      ctx.save();
      ctx.shadowBlur = 16 + Math.sin(d.phase) * 4;
      ctx.shadowColor = "rgba(255,210,60,0.45)";

      // Oil core
      const grd = ctx.createRadialGradient(d.x - d.r * 0.28, d.y - d.r * 0.28, d.r * 0.05, d.x, d.y, d.r);
      grd.addColorStop(0, "rgba(255,235,100,0.95)");
      grd.addColorStop(0.5, "rgba(230,190,50,0.8)");
      grd.addColorStop(1, "rgba(190,140,20,0.5)");
      ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = grd; ctx.fill();
      ctx.restore();

      // Phospholipid spikes (head = round end, tail = line inward)
      if (chargeAbs > 0.05) {
        for (let k = 0; k < numSpikes; k++) {
          const angle = (k / numSpikes) * Math.PI * 2 + d.phase * 0.03;
          const hx = d.x + (d.r + 8) * Math.cos(angle);
          const hy = d.y + (d.r + 8) * Math.sin(angle);
          const tx = d.x + (d.r + 2) * Math.cos(angle);
          const ty = d.y + (d.r + 2) * Math.sin(angle);

          // Tail (fatty acid chain)
          ctx.save();
          ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(hx, hy);
          ctx.strokeStyle = `rgba(96,165,250,${chargeAbs * 0.7})`; ctx.lineWidth = 1.2; ctx.stroke();
          // Head (polar, negative charge)
          ctx.shadowBlur = 5; ctx.shadowColor = "rgba(96,165,250,0.8)";
          ctx.beginPath(); ctx.arc(hx, hy, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(96,165,250,${chargeAbs * 0.9})`; ctx.fill();
          ctx.restore();

          // Charge symbol
          if (k % 3 === 0) {
            ctx.save(); ctx.font = "7px monospace"; ctx.fillStyle = `rgba(96,165,250,${chargeAbs * 0.7})`;
            ctx.textAlign = "center";
            ctx.fillText("−", d.x + (d.r + 14) * Math.cos(angle), d.y + (d.r + 14) * Math.sin(angle) + 2.5);
            ctx.restore();
          }
        }
      }
    };

    const animate = () => {
      frame++;
      ctx.clearRect(0, 0, CW, CH);

      // Background
      const bg = ctx.createLinearGradient(0, 0, 0, CH);
      bg.addColorStop(0, "#07080F"); bg.addColorStop(1, "#0C0D18");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, CW, CH);
      drawGrid();

      // Cream layer top
      const creamH = Math.round(instability * 60);
      if (creamH > 5) {
        ctx.save();
        ctx.shadowBlur = 20; ctx.shadowColor = "rgba(255,210,60,0.4)";
        const creamGrd = ctx.createLinearGradient(0, 0, 0, creamH + 8);
        creamGrd.addColorStop(0, `rgba(255,215,50,${Math.min(0.75, instability * 0.85)})`);
        creamGrd.addColorStop(1, "rgba(255,200,30,0)");
        ctx.fillStyle = creamGrd; ctx.fillRect(0, 0, CW, creamH + 8);
        if (creamH > 18) {
          ctx.font = "bold 9px monospace"; ctx.fillStyle = "rgba(180,130,0,0.9)";
          ctx.textAlign = "center"; ctx.fillText("▲ CAPA DE CREMA (COALESCENCIA)", CW / 2, creamH - 4);
        }
        ctx.restore();
      }

      const drops = dropletsRef.current;
      merges = 0;

      drops.forEach((d, i) => {
        if (d.merged) { merges++; return; }
        d.phase += 0.025;
        d.charge = -1 + neutralization * 0.92;

        const spd0 = 0.25 + tempFactor * 0.18;
        d.vx += (Math.random() - 0.5) * spd0;
        d.vy += (Math.random() - 0.5) * spd0;
        d.vy -= 0.025 * instability; // buoyancy
        const spd = Math.sqrt(d.vx ** 2 + d.vy ** 2);
        if (spd > 1.4) { d.vx *= 1.4 / spd; d.vy *= 1.4 / spd; }
        d.x += d.vx; d.y += d.vy;

        if (d.x - d.r < 5) { d.x = d.r + 5; d.vx = Math.abs(d.vx); }
        if (d.x + d.r > CW - 5) { d.x = CW - d.r - 5; d.vx = -Math.abs(d.vx); }
        if (d.y - d.r < creamH + 6) { d.y = creamH + d.r + 6; d.vy = Math.abs(d.vy); }
        if (d.y + d.r > CH - 6) { d.y = CH - d.r - 6; d.vy = -Math.abs(d.vy); }

        // Coalescence
        if (instability > 0.3) {
          for (let j = i + 1; j < drops.length; j++) {
            const e = drops[j]; if (e.merged) continue;
            const dx = e.x - d.x, dy = e.y - d.y;
            const dist = Math.sqrt(dx ** 2 + dy ** 2);
            const thresh = instability > 0.65 ? d.r + e.r + 10 : d.r + e.r + 3;
            if (dist < thresh) { d.r = Math.min(Math.sqrt(d.r ** 2 + e.r ** 2), 38); e.merged = true; }
          }
        }

        drawDroplet(d);
      });

      setMergeCount(merges);

      // HUD: Zeta potential
      ctx.save();
      ctx.font = "9px monospace"; ctx.textAlign = "left";
      ctx.fillStyle = "rgba(96,165,250,0.7)";
      ctx.fillText(`ζ = ${zetaPotential} mV`, 10, CH - 26);
      ctx.fillStyle = stateColor === "#00FF88" ? "rgba(0,255,136,0.6)" : stateColor === "#fbbf24" ? "rgba(251,191,36,0.6)" : "rgba(239,68,68,0.6)";
      ctx.fillText(stateLabel, 10, CH - 12);
      ctx.restore();

      animRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animRef.current);
  }, [instability, neutralization, cations, temp, zetaPotential, stateLabel, stateColor]);

  const creamH = Math.round(instability * 60);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        <div className="rounded-2xl overflow-hidden flex flex-col"
          style={{ background: "#07080F", border: `1px solid ${stateColor}30`, boxShadow: `0 0 25px ${stateColor}08` }}>
          <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(96,165,250,0.08)" }}>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: stateColor, boxShadow: `0 0 6px ${stateColor}` }} />
              <span style={{ color: stateColor }}>EMULSIÓN LIPÍDICA 3 EN 1</span>
            </div>
            <span className="text-xs font-mono" style={{ color: "#6B7BA0" }}>
              {mergeCount > 0 ? `${mergeCount} gotas coalescidas` : "Sin coalescencia"} · ζ = {zetaPotential} mV
            </span>
          </div>
          <canvas ref={canvasRef} className="w-full" style={{ height: 330 }} />
        </div>

        <div className="space-y-3">
          {[
            { label: "Ca²⁺ + Mg²⁺ (mEq/L)", value: cations, min: 0, max: 40, step: 1, color: "#f5a623", set: setCations },
            { label: "Dextrosa (%)", value: dextrose, min: 5, max: 70, step: 5, color: "#00FF88", set: setDextrose },
            { label: "Temperatura (°C)", value: temp, min: 4, max: 40, step: 1, color: "#f87171", set: setTemp },
          ].map((c) => (
            <div key={c.label} className="rounded-xl p-4" style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="flex justify-between mb-2">
                <span className="text-xs font-mono font-bold" style={{ color: c.color }}>{c.label}</span>
                <span className="text-sm font-bold font-mono px-2 py-0.5 rounded-lg" style={{ background: `${c.color}12`, color: c.color }}>{c.value}</span>
              </div>
              <input type="range" min={c.min} max={c.max} step={c.step} value={c.value}
                onChange={(e) => c.set(parseFloat(e.target.value))} className="w-full" style={{ accentColor: c.color }} />
            </div>
          ))}

          {/* Zeta potential gauge */}
          <div className="rounded-xl p-4" style={{ background: "#111118", border: "1px solid rgba(96,165,250,0.15)" }}>
            <p className="text-xs font-mono mb-2" style={{ color: "#6B7BA0" }}>POTENCIAL ZETA</p>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl font-bold font-mono" style={{ color: zetaPotential < -30 ? "#00FF88" : zetaPotential < -15 ? "#fbbf24" : "#ef4444" }}>
                {zetaPotential} mV
              </span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, Math.abs(zetaPotential) / 45 * 100)}%`, background: zetaPotential < -30 ? "#00FF88" : zetaPotential < -15 ? "#fbbf24" : "#ef4444" }} />
            </div>
            <p className="text-xs mt-2" style={{ color: "#9BA3BE" }}>
              {zetaPotential < -30 ? "Estable: repulsión electrostática mantenida." : zetaPotential < -15 ? "Riesgo: protección eléctrica débil." : "⚠ Coalescencia probable."}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: "🫧", title: "Estructura de la emulsión", body: "Gotas de aceite (soja/oliva/MCT/ω-3) rodeadas por una bicapa de fosfolípidos de yema de huevo con carga negativa superficial (potencial Z = −35 a −45 mV). Esta repulsión evita la coalescencia.", color: "#00FF88" },
          { icon: "⚡", title: "Cationes divalentes y la 'Regla del 6'", body: "Ca²⁺ y Mg²⁺ neutralizan la carga negativa superficial. La regla del 6: concentración total de cationes divalentes < 6 mEq/L por litro de emulsión para mantener estabilidad.", color: "#f5a623" },
          { icon: "🌡️", title: "Temperatura y entropía", body: "El calor aumenta la energía cinética → más colisiones → coalescencia. Preparar a 2-8°C, infundir a temperatura ambiente max. Los filtros para emulsiones son de 1.2 μm (no 0.22 μm).", color: "#f87171" },
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
