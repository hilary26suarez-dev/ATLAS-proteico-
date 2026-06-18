"use client";

import { useRef, useEffect, useState, useCallback } from "react";

interface Particle {
  x: number; y: number; vx: number; vy: number;
  type: "ca" | "phos";
  bonded: boolean;
  bondPartner: number | null;
}

function calcPrecipitationRisk(ca: number, phos: number, ph: number): number {
  // Simplified solubility product model: risk = Ca × Phos × pH factor
  const phFactor = Math.pow(10, (ph - 6.5) * 0.8);
  return ca * phos * phFactor;
}

const THRESHOLDS = { safe: 60, caution: 120, critical: 200 };

export default function CaPhosSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);
  const [ca, setCa] = useState(5);
  const [phos, setPhos] = useState(10);
  const [ph, setPh] = useState(7.0);
  const [aa, setAa] = useState(50);
  const [crystalCount, setCrystalCount] = useState(0);

  const risk = calcPrecipitationRisk(ca, phos, ph) * (1 - aa / 200);
  const riskPct = Math.min(100, (risk / THRESHOLDS.critical) * 100);
  const riskLevel = risk < THRESHOLDS.safe ? "safe" : risk < THRESHOLDS.caution ? "caution" : "critical";

  const initParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = canvas.width, H = canvas.height;
    const caCount = Math.round(ca * 2);
    const phosCount = Math.round(phos * 1.5);
    const particles: Particle[] = [];
    for (let i = 0; i < caCount + phosCount; i++) {
      particles.push({
        x: Math.random() * (W - 40) + 20,
        y: Math.random() * (H - 80) + 20,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        type: i < caCount ? "ca" : "phos",
        bonded: false,
        bondPartner: null,
      });
    }
    particlesRef.current = particles;
    setCrystalCount(0);
  }, [ca, phos]);

  useEffect(() => { initParticles(); }, [initParticles]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width, H = canvas.height;
    const filterY = H - 40;
    let localCrystals = 0;

    const animate = () => {
      ctx.clearRect(0, 0, W, H);

      // Background gradient - simulates IV bag cross section
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "rgba(15,23,42,0.95)");
      bg.addColorStop(1, "rgba(10,16,30,0.98)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Draw filter line
      ctx.beginPath();
      ctx.moveTo(0, filterY);
      ctx.lineTo(W, filterY);
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.font = "9px monospace";
      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.fillText("FILTRO DE LÍNEA (0.22 μm)", 6, filterY - 4);

      const particles = particlesRef.current;
      localCrystals = 0;

      particles.forEach((p, i) => {
        if (p.bonded && p.bondPartner !== null) { localCrystals++; return; }

        // Brownian motion
        p.vx += (Math.random() - 0.5) * 0.3;
        p.vy += (Math.random() - 0.5) * 0.3;
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 2) { p.vx *= 2 / speed; p.vy *= 2 / speed; }

        p.x += p.vx;
        p.y += p.vy;

        // Walls
        if (p.x < 8) { p.x = 8; p.vx = Math.abs(p.vx); }
        if (p.x > W - 8) { p.x = W - 8; p.vx = -Math.abs(p.vx); }
        if (p.y < 8) { p.y = 8; p.vy = Math.abs(p.vy); }
        if (p.y > filterY - 6) { p.y = filterY - 6; p.vy = -Math.abs(p.vy); }

        // Check attraction to opposite ion
        if (riskLevel !== "safe") {
          for (let j = i + 1; j < particles.length; j++) {
            const q = particles[j];
            if (p.type === q.type || q.bonded) continue;
            const dx = q.x - p.x;
            const dy = q.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const attractRange = riskLevel === "critical" ? 60 : 35;
            if (dist < attractRange && dist > 0) {
              const force = riskLevel === "critical" ? 0.08 : 0.03;
              p.vx += (dx / dist) * force;
              p.vy += (dy / dist) * force;
              if (dist < 14) {
                // Crystal bond formed!
                p.bonded = true;
                p.bondPartner = j;
                q.bonded = true;
                q.bondPartner = i;
                // Drop to filter
                const filterX = Math.random() * (W - 20) + 10;
                p.x = filterX;
                p.y = filterY + 10 + Math.random() * 15;
                q.x = filterX + 4;
                q.y = filterY + 10 + Math.random() * 15;
              }
            }
          }
        }

        // Draw particle
        const r = 5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        const color = p.type === "ca" ? "#f5a623" : "#60a5fa";
        const grd = ctx.createRadialGradient(p.x - 1, p.y - 1, 1, p.x, p.y, r);
        grd.addColorStop(0, p.type === "ca" ? "#ffd080" : "#93c5fd");
        grd.addColorStop(1, color + "80");
        ctx.fillStyle = grd;
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Label
        ctx.font = "bold 6px monospace";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(p.type === "ca" ? "Ca²⁺" : "PO₄", p.x, p.y + 2);
      });

      // Draw bonded crystals
      particles.forEach((p, i) => {
        if (!p.bonded || !p.bondPartner) return;
        if (i > p.bondPartner) return; // draw once
        const q = particles[p.bondPartner];
        // Crystal shape
        ctx.beginPath();
        ctx.rect(Math.min(p.x, q.x) - 3, filterY + 8, 12, 8);
        ctx.fillStyle = "rgba(180,200,255,0.35)";
        ctx.fill();
        ctx.strokeStyle = "rgba(180,200,255,0.6)";
        ctx.lineWidth = 0.5;
        ctx.stroke();
        localCrystals++;
      });

      // Filter blockage indicator
      if (localCrystals > 0) {
        const blockPct = Math.min(1, localCrystals / 15);
        ctx.fillStyle = `rgba(239,68,68,${blockPct * 0.35})`;
        ctx.fillRect(0, filterY + 2, W, 35);
        if (blockPct > 0.3) {
          ctx.font = "bold 10px monospace";
          ctx.fillStyle = `rgba(239,68,68,${Math.min(1, blockPct * 2)})`;
          ctx.textAlign = "center";
          ctx.fillText("⚠ FILTRO BLOQUEADO", W / 2, filterY + 22);
        }
      }

      setCrystalCount(localCrystals);
      animRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animRef.current);
  }, [riskLevel, ca, phos]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">

        {/* Canvas */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "#0f172a", border: "1px solid rgba(245,166,35,0.2)" }}>
          <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(245,166,35,0.1)" }}>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
              <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>SIMULACIÓN Ca²⁺ · HPO₄²⁻</span>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono" style={{ color: "var(--text-muted)" }}>
              <span>🟡 Ca²⁺</span><span>🔵 HPO₄²⁻</span><span>◻ Cristales: {crystalCount}</span>
            </div>
          </div>
          <canvas ref={canvasRef} width={480} height={320} className="w-full" />
        </div>

        {/* Controls */}
        <div className="space-y-4">
          {[
            { label: "Ca²⁺ (mEq/L)", value: ca, min: 0, max: 20, step: 0.5, color: "#f5a623", set: setCa, safe: "< 10", risky: "> 15" },
            { label: "Fosfato (mmol/L)", value: phos, min: 0, max: 40, step: 1, color: "#60a5fa", set: setPhos, safe: "< 15", risky: "> 25" },
            { label: "pH", value: ph, min: 6.5, max: 8.0, step: 0.1, color: "#a78bfa", set: setPh, safe: "6.5–7.0", risky: "> 7.5" },
            { label: "Aminoácidos (%)", value: aa, min: 0, max: 100, step: 5, color: "#34d399", set: setAa, safe: "> 60%", risky: "< 20%" },
          ].map((ctrl) => (
            <div key={ctrl.label} className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid rgba(255,255,255,0.04)" }}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-mono" style={{ color: ctrl.color }}>{ctrl.label}</span>
                <span className="text-sm font-bold font-mono" style={{ color: "var(--text)" }}>{ctrl.value}</span>
              </div>
              <input type="range" min={ctrl.min} max={ctrl.max} step={ctrl.step}
                value={ctrl.value} onChange={(e) => { ctrl.set(parseFloat(e.target.value)); initParticles(); }}
                className="w-full accent-current" style={{ accentColor: ctrl.color }} />
              <div className="flex justify-between text-xs mt-1" style={{ color: "var(--text-faint)" }}>
                <span>✅ {ctrl.safe}</span><span>⚠ {ctrl.risky}</span>
              </div>
            </div>
          ))}

          {/* Risk meter */}
          <div className="rounded-xl p-4" style={{
            background: riskLevel === "safe" ? "rgba(34,211,238,0.06)" : riskLevel === "caution" ? "rgba(251,191,36,0.06)" : "rgba(239,68,68,0.08)",
            border: `1px solid ${riskLevel === "safe" ? "rgba(34,211,238,0.2)" : riskLevel === "caution" ? "rgba(251,191,36,0.2)" : "rgba(239,68,68,0.25)"}`,
          }}>
            <div className="flex justify-between text-xs font-mono mb-2">
              <span style={{ color: riskLevel === "critical" ? "#ef4444" : riskLevel === "caution" ? "#fbbf24" : "#22d3ee" }}>
                RIESGO DE PRECIPITACIÓN
              </span>
              <span className="font-bold" style={{ color: riskLevel === "critical" ? "#ef4444" : riskLevel === "caution" ? "#fbbf24" : "#22d3ee" }}>
                {riskLevel === "safe" ? "SEGURO" : riskLevel === "caution" ? "PRECAUCIÓN" : "CRÍTICO ⚠"}
              </span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${riskPct}%`, background: riskLevel === "critical" ? "linear-gradient(90deg,#fbbf24,#ef4444)" : riskLevel === "caution" ? "#fbbf24" : "#22d3ee" }} />
            </div>
            <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
              {riskLevel === "safe" ? "La mezcla es estable. Los aminoácidos actúan como quelantes." :
               riskLevel === "caution" ? "Monitorear. Revisar orden de adición y temperatura." :
               "RIESGO DE PRECIPITACIÓN DE CaHPO₄ — Potencialmente fatal."}
            </p>
          </div>
        </div>
      </div>

      {/* Educational context */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: "🔬", title: "¿Por qué precipita?", body: "Ca²⁺ y HPO₄²⁻ forman CaHPO₄ insoluble cuando el producto iónico supera el Ksp (~2.2×10⁻⁷). El pH alto favorece PO₄³⁻ > HPO₄²⁻, que precipita más fácilmente con calcio.", color: "#f5a623" },
          { icon: "⚕️", title: "Consecuencia clínica", body: "Los microcristales de fosfato de calcio bloquean el filtro de 0.22 μm, embolizan capilares pulmonares y han causado muertes documentadas por la FDA (1994, 2011).", color: "#ef4444" },
          { icon: "🛡️", title: "Regla de protección", body: "Añadir calcio Y fosfato en último lugar, en extremos opuestos de la preparación. Los aminoácidos actúan como quelantes. Temperatura baja aumenta la solubilidad.", color: "#34d399" },
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
