"use client";

import { useRef, useEffect, useState, useCallback } from "react";

interface Particle {
  x: number; y: number; vx: number; vy: number;
  type: "ca" | "phos";
  bonded: boolean;
  bondTo: number | null;
  trail: { x: number; y: number }[];
  phase: number; // for pulsing
}

function calcRisk(ca: number, phos: number, ph: number, aa: number): number {
  const phFactor = Math.pow(10, (ph - 6.8) * 1.2);
  const aaProt = 1 - Math.min(1, aa / 120);
  return Math.min(100, ca * phos * phFactor * aaProt * 0.18);
}

export default function CaPhosSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);
  const frameRef = useRef<number>(0);

  const [ca, setCa]   = useState(5);
  const [phos, setPhos] = useState(10);
  const [ph, setPh]   = useState(7.0);
  const [aa, setAa]   = useState(50);
  const [crystals, setCrystals] = useState(0);

  const risk = calcRisk(ca, phos, ph, aa);
  const riskLevel = risk < 30 ? "safe" : risk < 65 ? "caution" : "critical";

  const initParticles = useCallback(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const W = canvas.width, H = canvas.height;
    const caCount  = Math.min(20, Math.round(ca * 1.5));
    const phosCount = Math.min(20, Math.round(phos));
    const pts: Particle[] = [];
    for (let i = 0; i < caCount + phosCount; i++) {
      pts.push({
        x: 30 + Math.random() * (W - 60),
        y: 30 + Math.random() * (H - 100),
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        type: i < caCount ? "ca" : "phos",
        bonded: false, bondTo: null,
        trail: [],
        phase: Math.random() * Math.PI * 2,
      });
    }
    particlesRef.current = pts;
    setCrystals(0);
  }, [ca, phos]);

  useEffect(() => { initParticles(); }, [initParticles]);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;

    // HiDPI
    const dpr = window.devicePixelRatio ?? 1;
    const W = canvas.offsetWidth, H = canvas.offsetHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.scale(dpr, dpr);
    const CW = W, CH = H;
    const FILTER_Y = CH - 45;

    let localCrystals = 0;

    const drawDotGrid = () => {
      ctx.save();
      ctx.fillStyle = "rgba(0,255,136,0.04)";
      const sp = 24;
      for (let gx = 0; gx < CW; gx += sp) {
        for (let gy = 0; gy < FILTER_Y; gy += sp) {
          ctx.beginPath();
          ctx.arc(gx, gy, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    };

    const glowCircle = (x: number, y: number, r: number, color: string, glow: number) => {
      ctx.save();
      ctx.shadowBlur = glow;
      ctx.shadowColor = color;
      const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.05, x, y, r);
      const [h1, h2] = color === "#f5a623" ? ["#FFD080","#f5a62360"] : ["#93c5fd","#60a5fa50"];
      g.addColorStop(0, h1); g.addColorStop(1, h2);
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = g; ctx.fill();
      ctx.strokeStyle = color; ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    };

    const animate = () => {
      frameRef.current++;
      ctx.clearRect(0, 0, CW, CH);

      // Background
      const bg = ctx.createLinearGradient(0, 0, 0, CH);
      bg.addColorStop(0, "#07080F"); bg.addColorStop(1, "#0D0E18");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, CW, CH);
      drawDotGrid();

      // Filter line
      ctx.save();
      ctx.shadowBlur = 8; ctx.shadowColor = "rgba(0,255,136,0.4)";
      ctx.beginPath(); ctx.moveTo(0, FILTER_Y); ctx.lineTo(CW, FILTER_Y);
      ctx.strokeStyle = "rgba(0,255,136,0.35)"; ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 5]); ctx.stroke(); ctx.setLineDash([]);
      ctx.restore();
      ctx.font = "9px monospace"; ctx.fillStyle = "rgba(0,255,136,0.5)";
      ctx.textAlign = "left"; ctx.fillText("▼ FILTRO 0.22 μm", 8, FILTER_Y - 6);

      const particles = particlesRef.current;
      localCrystals = 0;

      particles.forEach((p, i) => {
        p.phase += 0.05;
        if (p.bonded && p.bondTo !== null) { localCrystals++; return; }

        // Brownian + speed based on temp
        const brownStrength = 0.25 + (risk / 100) * 0.3;
        p.vx += (Math.random() - 0.5) * brownStrength;
        p.vy += (Math.random() - 0.5) * brownStrength;
        const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (spd > 2.2) { p.vx *= 2.2 / spd; p.vy *= 2.2 / spd; }
        p.x += p.vx; p.y += p.vy;

        // Walls
        if (p.x < 8) { p.x = 8; p.vx = Math.abs(p.vx); }
        if (p.x > CW - 8) { p.x = CW - 8; p.vx = -Math.abs(p.vx); }
        if (p.y < 8) { p.y = 8; p.vy = Math.abs(p.vy); }
        if (p.y > FILTER_Y - 8) { p.y = FILTER_Y - 8; p.vy = -Math.abs(p.vy); }

        // Trail
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 8) p.trail.shift();

        // Draw trail
        if (p.trail.length > 1) {
          for (let t = 1; t < p.trail.length; t++) {
            const opacity = (t / p.trail.length) * 0.2;
            ctx.beginPath();
            ctx.moveTo(p.trail[t - 1].x, p.trail[t - 1].y);
            ctx.lineTo(p.trail[t].x, p.trail[t].y);
            ctx.strokeStyle = p.type === "ca" ? `rgba(245,166,35,${opacity})` : `rgba(96,165,250,${opacity})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
        }

        // Attraction lines + bonding
        if (riskLevel !== "safe") {
          const attractRange = riskLevel === "critical" ? 80 : 50;
          for (let j = i + 1; j < particles.length; j++) {
            const q = particles[j];
            if (p.type === q.type || q.bonded) continue;
            const dx = q.x - p.x, dy = q.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < attractRange) {
              // Force field line
              const lineOpacity = (1 - dist / attractRange) * 0.35;
              ctx.save();
              ctx.beginPath();
              ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
              ctx.strokeStyle = `rgba(255,255,255,${lineOpacity})`;
              ctx.lineWidth = 0.7; ctx.stroke();
              ctx.restore();

              // Attract
              const force = riskLevel === "critical" ? 0.07 : 0.025;
              p.vx += (dx / dist) * force;
              p.vy += (dy / dist) * force;

              if (dist < 13) {
                // Bond → crystallize
                p.bonded = true; p.bondTo = j;
                q.bonded = true; q.bondTo = i;
                const cx = (p.x + q.x) / 2;
                p.x = cx - 4; p.y = FILTER_Y + 12 + Math.random() * 18;
                q.x = cx + 4; q.y = p.y;
              }
            }
          }
        }

        // Particle
        const pulsedR = 5.5 + Math.sin(p.phase) * 0.8;
        const color = p.type === "ca" ? "#f5a623" : "#60a5fa";
        const glowAmt = riskLevel === "critical" ? 20 : riskLevel === "caution" ? 12 : 6;
        glowCircle(p.x, p.y, pulsedR, color, glowAmt);

        // Charge label
        ctx.save();
        ctx.font = "bold 7px monospace";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(p.type === "ca" ? "Ca²⁺" : "PO₄³⁻", p.x, p.y + 2.5);
        ctx.restore();
      });

      // Draw crystals at filter
      particles.forEach((p, i) => {
        if (!p.bonded || p.bondTo === null || i > p.bondTo) return;
        localCrystals++;
        // Hexagonal crystal cell
        ctx.save();
        ctx.translate(p.x + 2, p.y);
        ctx.shadowBlur = 10; ctx.shadowColor = "rgba(180,200,255,0.6)";
        ctx.beginPath();
        for (let h = 0; h < 6; h++) {
          const a = (h * Math.PI) / 3;
          h === 0 ? ctx.moveTo(Math.cos(a) * 5, Math.sin(a) * 5)
                  : ctx.lineTo(Math.cos(a) * 5, Math.sin(a) * 5);
        }
        ctx.closePath();
        ctx.fillStyle = "rgba(180,210,255,0.25)";
        ctx.fill();
        ctx.strokeStyle = "rgba(180,210,255,0.6)";
        ctx.lineWidth = 0.8; ctx.stroke();
        ctx.restore();
      });

      // Filter blockage overlay
      if (localCrystals > 0) {
        const blockPct = Math.min(1, localCrystals / 14);
        ctx.save();
        ctx.fillStyle = `rgba(239,68,68,${blockPct * 0.3})`;
        ctx.fillRect(0, FILTER_Y + 2, CW, 40);
        if (blockPct > 0.25) {
          ctx.shadowBlur = 15; ctx.shadowColor = "#ef4444";
          ctx.font = "bold 10px monospace"; ctx.fillStyle = "#ef4444";
          ctx.textAlign = "center";
          ctx.fillText(`⚠ FILTRO BLOQUEADO ${Math.round(blockPct * 100)}%`, CW / 2, FILTER_Y + 24);
        }
        ctx.restore();
      }

      // HUD top-right
      ctx.save();
      ctx.font = "9px monospace"; ctx.textAlign = "right";
      const ksp = (ca * phos * Math.pow(10, (ph - 6.8) * 1.2)).toFixed(1);
      ctx.fillStyle = "rgba(0,255,136,0.5)";
      ctx.fillText(`[Ca²⁺]×[PO₄³⁻] = ${ksp}`, CW - 8, 18);
      ctx.fillStyle = riskLevel === "critical" ? "rgba(239,68,68,0.7)" : riskLevel === "caution" ? "rgba(251,191,36,0.7)" : "rgba(34,211,238,0.7)";
      ctx.fillText(`STATUS: ${riskLevel.toUpperCase()}`, CW - 8, 32);
      ctx.restore();

      setCrystals(localCrystals);
      animRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animRef.current);
  }, [riskLevel, risk, ca, phos, ph]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Canvas */}
        <div className="rounded-2xl overflow-hidden flex flex-col"
          style={{ background: "#07080F", border: `1px solid ${riskLevel === "critical" ? "rgba(239,68,68,0.35)" : riskLevel === "caution" ? "rgba(251,191,36,0.2)" : "rgba(0,255,136,0.15)"}`, boxShadow: riskLevel === "critical" ? "0 0 30px rgba(239,68,68,0.08)" : riskLevel === "caution" ? "0 0 30px rgba(251,191,36,0.05)" : "none" }}>
          <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: `1px solid rgba(0,255,136,0.08)` }}>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#00FF88", boxShadow: "0 0 6px #00FF88" }} />
              <span style={{ color: "#00FF88" }}>SIMULACIÓN IÓNICA · TIEMPO REAL</span>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono" style={{ color: "#6B7BA0" }}>
              <span>🟡 Ca²⁺</span><span>🔵 HPO₄³⁻</span>
              <span style={{ color: crystals > 0 ? "#ef4444" : "#6B7BA0" }}>◈ Cristales: {crystals}</span>
            </div>
          </div>
          <canvas ref={canvasRef} className="w-full" style={{ height: 320 }} />
        </div>

        {/* Controls */}
        <div className="space-y-3">
          {[
            { label: "Ca²⁺ (mEq/L)", value: ca, min: 0, max: 20, step: 0.5, color: "#f5a623", set: setCa, safe: "< 10", warn: "> 15", reinit: true },
            { label: "Fosfato (mmol/L)", value: phos, min: 0, max: 40, step: 1,   color: "#60a5fa", set: setPhos, safe: "< 15", warn: "> 25", reinit: true },
            { label: "pH", value: ph,   min: 6.5, max: 8.0, step: 0.1, color: "#a78bfa", set: setPh,   safe: "6.5–7.0", warn: "> 7.4", reinit: false },
            { label: "Aminoácidos (g/L)", value: aa, min: 0, max: 120, step: 5, color: "#34d399", set: setAa, safe: "> 70", warn: "< 20", reinit: false },
          ].map((c) => (
            <div key={c.label} className="rounded-xl p-4" style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-mono font-bold" style={{ color: c.color }}>{c.label}</span>
                <span className="text-sm font-bold font-mono px-2 py-0.5 rounded-lg" style={{ background: `${c.color}12`, color: c.color }}>{c.value}</span>
              </div>
              <input type="range" min={c.min} max={c.max} step={c.step} value={c.value}
                onChange={(e) => { c.set(parseFloat(e.target.value)); if (c.reinit) initParticles(); }}
                className="w-full" style={{ accentColor: c.color }} />
              <div className="flex justify-between text-xs mt-1.5 font-mono" style={{ color: "#6B7BA0" }}>
                <span>✓ {c.safe}</span><span>⚠ {c.warn}</span>
              </div>
            </div>
          ))}

          {/* Risk gauge */}
          <div className="rounded-xl p-4 transition-all duration-500"
            style={{ background: riskLevel === "critical" ? "rgba(239,68,68,0.07)" : riskLevel === "caution" ? "rgba(251,191,36,0.06)" : "rgba(0,255,136,0.05)", border: `1px solid ${riskLevel === "critical" ? "rgba(239,68,68,0.3)" : riskLevel === "caution" ? "rgba(251,191,36,0.25)" : "rgba(0,255,136,0.2)"}` }}>
            <div className="flex justify-between text-xs font-mono mb-2">
              <span style={{ color: "#B0BAD4" }}>RIESGO DE PRECIPITACIÓN</span>
              <span className="font-bold" style={{ color: riskLevel === "critical" ? "#ef4444" : riskLevel === "caution" ? "#fbbf24" : "#00FF88" }}>
                {Math.round(risk)}% · {riskLevel === "safe" ? "SEGURO" : riskLevel === "caution" ? "PRECAUCIÓN" : "⚠ CRÍTICO"}
              </span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${risk}%`, background: riskLevel === "critical" ? "linear-gradient(90deg,#fbbf24,#ef4444)" : riskLevel === "caution" ? "linear-gradient(90deg,#00FF88,#fbbf24)" : "linear-gradient(90deg,#00FF88,#22d3ee)" }} />
            </div>
            <p className="text-xs mt-2 leading-relaxed" style={{ color: "#9BA3BE" }}>
              {riskLevel === "safe" ? "Mezcla estable. Los aminoácidos actúan como quelantes del Ca²⁺." :
               riskLevel === "caution" ? "Monitorear. Revisar orden de adición y temperatura de preparación." :
               "RIESGO REAL. CaHPO₄ puede precipitar y bloquear el filtro o embolizar pulmones."}
            </p>
          </div>
        </div>
      </div>

      {/* Context cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: "⚗️", title: "¿Por qué precipita?", body: "Cuando [Ca²⁺] × [HPO₄²⁻] supera el producto de solubilidad (Ksp ≈ 2.2×10⁻⁷), se forman cristales insolubles de CaHPO₄. El pH alto convierte HPO₄²⁻ → PO₄³⁻ que precipita aún más fácilmente.", color: "#f5a623" },
          { icon: "💀", title: "Consecuencia mortal", body: "Los microcristales bloquean el filtro de 0.22 μm, embolizan capilares pulmonares y han causado muertes documentadas por la FDA en 1994 y 2011. Es la complicación farmacéutica más grave en NP.", color: "#ef4444" },
          { icon: "🛡️", title: "Reglas de seguridad", body: "Añadir Ca y fosfato al final y en extremos opuestos. Aminoácidos >5% actúan como quelantes. Temperatura <25°C aumenta solubilidad. Calcio gluconato precipita menos que CaCl₂.", color: "#34d399" },
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
