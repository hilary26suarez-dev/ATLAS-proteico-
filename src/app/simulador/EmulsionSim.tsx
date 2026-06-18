"use client";

import { useRef, useEffect, useState } from "react";

interface Droplet {
  x: number; y: number; r: number;
  vx: number; vy: number;
  charge: number; // -1 to 0, represents surface charge
  merged: boolean;
}

export default function EmulsionSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const dropletsRef = useRef<Droplet[]>([]);
  const [cationConc, setCationConc] = useState(5);
  const [dextrose, setDextrose] = useState(20);
  const [temp, setTemp] = useState(25);
  const [mergeCount, setMergeCount] = useState(0);

  // Stability score: charge neutralization by cations
  const neutralization = Math.min(1, cationConc / 30);
  // Higher dextrose = slightly better protection via viscosity
  const viscosityFactor = 1 - dextrose * 0.004;
  // Temperature destabilizes
  const tempFactor = 1 + (temp - 25) * 0.015;
  const instability = neutralization * viscosityFactor * tempFactor;
  const stableLabel = instability < 0.25 ? "ESTABLE" : instability < 0.6 ? "INESTABLE" : "RUPTURA";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = canvas.width, H = canvas.height;
    const count = 18;
    const drops: Droplet[] = [];
    for (let i = 0; i < count; i++) {
      drops.push({
        x: Math.random() * (W - 40) + 20,
        y: Math.random() * (H * 0.7) + 20,
        r: 10 + Math.random() * 6,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        charge: -1,
        merged: false,
      });
    }
    dropletsRef.current = drops;
    setMergeCount(0);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width, H = canvas.height;
    let merges = 0;

    const animate = () => {
      ctx.clearRect(0, 0, W, H);

      // Background
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#0f172a");
      bg.addColorStop(1, "#0a1020");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Cream layer (appears when instability is high)
      const creamHeight = Math.round(instability * 55);
      if (creamHeight > 4) {
        const creamGrad = ctx.createLinearGradient(0, 0, 0, creamHeight + 5);
        creamGrad.addColorStop(0, `rgba(255,220,100,${Math.min(0.7, instability * 0.8)})`);
        creamGrad.addColorStop(1, `rgba(255,200,60,0)`);
        ctx.fillStyle = creamGrad;
        ctx.fillRect(0, 0, W, creamHeight + 5);
        if (creamHeight > 15) {
          ctx.font = "bold 9px monospace";
          ctx.fillStyle = "rgba(200,150,20,0.9)";
          ctx.textAlign = "center";
          ctx.fillText("⚠ CAPA DE CREMA", W / 2, creamHeight - 4);
        }
      }

      const drops = dropletsRef.current;
      merges = 0;

      drops.forEach((d, i) => {
        if (d.merged) { merges++; return; }

        // Update charge (neutralized by cations)
        d.charge = -1 + neutralization * 0.95;

        // Move
        const speedFactor = 0.3 + tempFactor * 0.2;
        d.vx += (Math.random() - 0.5) * speedFactor;
        d.vy += (Math.random() - 0.5) * speedFactor;
        // Buoyancy: lipids rise
        d.vy -= 0.02 * instability;
        const spd = Math.sqrt(d.vx * d.vx + d.vy * d.vy);
        if (spd > 1.5) { d.vx *= 1.5 / spd; d.vy *= 1.5 / spd; }

        d.x += d.vx;
        d.y += d.vy;

        // Walls
        if (d.x - d.r < 4) { d.x = d.r + 4; d.vx = Math.abs(d.vx); }
        if (d.x + d.r > W - 4) { d.x = W - d.r - 4; d.vx = -Math.abs(d.vx); }
        if (d.y - d.r < creamHeight + 4) { d.y = creamHeight + d.r + 4; d.vy = Math.abs(d.vy); }
        if (d.y + d.r > H - 4) { d.y = H - d.r - 4; d.vy = -Math.abs(d.vy); }

        // Coalescence check
        if (instability > 0.35) {
          for (let j = i + 1; j < drops.length; j++) {
            const e = drops[j];
            if (e.merged) continue;
            const dx = e.x - d.x;
            const dy = e.y - d.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const mergeThreshold = instability > 0.7 ? d.r + e.r + 8 : d.r + e.r + 2;
            if (dist < mergeThreshold) {
              // Merge: grow d, remove e
              const newR = Math.sqrt(d.r * d.r + e.r * e.r);
              d.r = Math.min(newR, 35);
              e.merged = true;
            }
          }
        }

        // Draw droplet
        const surfaceChargeAbs = Math.abs(d.charge);
        // Main oil droplet
        const grd = ctx.createRadialGradient(d.x - d.r * 0.3, d.y - d.r * 0.3, d.r * 0.1, d.x, d.y, d.r);
        grd.addColorStop(0, `rgba(255,230,100,0.9)`);
        grd.addColorStop(0.6, `rgba(220,190,60,0.7)`);
        grd.addColorStop(1, `rgba(180,140,20,0.4)`);
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Phospholipid surface charge halo (negative charge = protection)
        if (surfaceChargeAbs > 0.05) {
          const haloOpacity = surfaceChargeAbs * 0.5;
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.r + 5, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(96,165,250,${haloOpacity})`;
          ctx.lineWidth = 3;
          ctx.setLineDash([2, 3]);
          ctx.stroke();
          ctx.setLineDash([]);

          // Charge symbols
          const numCharge = Math.floor(surfaceChargeAbs * 8);
          for (let k = 0; k < numCharge; k++) {
            const angle = (k / numCharge) * Math.PI * 2;
            const px = d.x + (d.r + 7) * Math.cos(angle);
            const py = d.y + (d.r + 7) * Math.sin(angle);
            ctx.font = "7px monospace";
            ctx.fillStyle = `rgba(96,165,250,${haloOpacity * 2})`;
            ctx.textAlign = "center";
            ctx.fillText("−", px, py + 2);
          }
        }
      });

      setMergeCount(merges);
      animRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animRef.current);
  }, [instability, neutralization, tempFactor]);

  const creamHeight = Math.round(instability * 55);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">

        {/* Canvas */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "#0f172a", border: "1px solid rgba(0,255,136,0.2)" }}>
          <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(0,255,136,0.1)" }}>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: stableLabel === "ESTABLE" ? "#22d3ee" : stableLabel === "INESTABLE" ? "#fbbf24" : "#ef4444" }} />
              <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>EMULSIÓN LIPÍDICA 3 EN 1</span>
            </div>
            <span className="text-xs font-mono font-bold"
              style={{ color: stableLabel === "ESTABLE" ? "#22d3ee" : stableLabel === "INESTABLE" ? "#fbbf24" : "#ef4444" }}>
              {stableLabel} — {mergeCount > 0 ? `${mergeCount} gotas coalescidas` : "sin coalescencia"}
            </span>
          </div>
          <canvas ref={canvasRef} width={480} height={320} className="w-full" />
        </div>

        {/* Controls */}
        <div className="space-y-3">
          {[
            { label: "Cationes (Ca²⁺+Mg²⁺, mEq/L)", value: cationConc, min: 0, max: 40, step: 1, color: "#f5a623", set: setCationConc },
            { label: "Dextrosa (%)", value: dextrose, min: 5, max: 70, step: 5, color: "#00FF88", set: setDextrose },
            { label: "Temperatura (°C)", value: temp, min: 4, max: 40, step: 1, color: "#f87171", set: setTemp },
          ].map((ctrl) => (
            <div key={ctrl.label} className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid rgba(255,255,255,0.04)" }}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-mono" style={{ color: ctrl.color }}>{ctrl.label}</span>
                <span className="text-sm font-bold font-mono" style={{ color: "var(--text)" }}>{ctrl.value}</span>
              </div>
              <input type="range" min={ctrl.min} max={ctrl.max} step={ctrl.step}
                value={ctrl.value} onChange={(e) => ctrl.set(parseFloat(e.target.value))}
                className="w-full" style={{ accentColor: ctrl.color }} />
            </div>
          ))}

          {/* Legend */}
          <div className="rounded-xl p-4 space-y-2" style={{ background: "var(--bg-card)", border: "1px solid rgba(255,255,255,0.04)" }}>
            <p className="text-xs font-mono mb-2" style={{ color: "var(--text-faint)" }}>LEYENDA</p>
            {[
              { color: "rgba(255,220,100,0.9)", label: "Gota de lípido (aceite de soja/oliva)" },
              { color: "rgba(96,165,250,0.7)", label: "Capa de fosfolípidos (carga −)" },
              { color: "rgba(255,220,100,0.5)", label: "Capa de crema (coalescencia)" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: l.color }} />
                {l.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: "🫧", title: "¿Por qué los lípidos no se separan?", body: "Los fosfolípidos (lecitina de yema de huevo) rodean las gotas de aceite con la cabeza polar hacia afuera, creando carga negativa superficial (potencial Z = −35 a −45 mV). Esta repulsión electrostática previene la coalescencia.", color: "#00FF88" },
          { icon: "⚡", title: "El rol de los cationes divalentes", body: "Ca²⁺ y Mg²⁺ neutralizan la carga negativa de la superficie → las gotas ya no se repelen → se fusionan → se forma una capa de crema → la emulsión se rompe. La regla del 6: [Ca²⁺]+[Mg²⁺] total < 6 mEq/L por litro de emulsión.", color: "#f5a623" },
          { icon: "🌡️", title: "Temperatura y estabilidad", body: "El calor aumenta la energía cinética de las gotas → más colisiones → mayor coalescencia. Las mezclas 3 en 1 deben prepararse y almacenarse a 2-8°C. En infusión, no superar 37°C. Filtro de 1.2 μm (no 0.22 μm) para lípidos.", color: "#f87171" },
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
