"use client";

import { useEffect, useRef, useState } from "react";

declare global { interface Window { NGL: any; } }

type RepMode = "cartoon" | "surface" | "both" | "hydrophobicity";

interface Props {
  pdbId: string;
  showLigands?: boolean;
  proteinName?: string;
  ligandName?: string;
  kcalMol?: number;
  resolution?: string;
  method?: string;
}

export default function DockingViewer3D({
  pdbId, showLigands = true,
  proteinName, ligandName, kcalMol, resolution, method,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef     = useRef<any>(null);
  const compRef      = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [ready,   setReady]   = useState(false);
  const [rep, setRep]         = useState<RepMode>("cartoon");
  const [spinning, setSpinning] = useState(true);

  // Apply representation when rep or ready changes
  useEffect(() => {
    const comp = compRef.current;
    const stage = stageRef.current;
    if (!comp || !ready) return;

    comp.removeAllRepresentations();

    if (rep === "hydrophobicity") {
      comp.addRepresentation("surface", {
        sele: "protein",
        colorScheme: "hydrophobicity",
        opacity: 0.82,
        useWorker: false,
      });
    } else if (rep === "cartoon" || rep === "both") {
      comp.addRepresentation("cartoon", {
        colorScheme: "chainname",
        quality: "medium",
        opacity: rep === "both" ? 0.55 : showLigands ? 0.72 : 1.0,
      });
    }

    if (rep === "surface" || rep === "both") {
      comp.addRepresentation("surface", {
        sele: "protein",
        colorScheme: "chainname",
        opacity: rep === "both" ? 0.18 : 0.35,
        useWorker: false,
      });
    }

    if (showLigands) {
      comp.addRepresentation("ball+stick", {
        sele: "heteroatom and not water",
        colorScheme: "element",
        aspectRatio: 2.2,
      });
      if (rep !== "surface") {
        comp.addRepresentation("surface", {
          sele: "heteroatom and not water",
          colorScheme: "element",
          opacity: 0.28,
          useWorker: false,
        });
      }
    }
  }, [rep, ready, showLigands]);

  // Mount NGL stage
  useEffect(() => {
    if (typeof window === "undefined") return;
    setLoading(true); setReady(false);
    compRef.current = null;
    let disposed = false;

    function mountStage() {
      if (disposed || !containerRef.current) return;
      if (stageRef.current) { try { stageRef.current.dispose(); } catch { /* */ } }

      let stage: any;
      try {
        stage = new window.NGL.Stage(containerRef.current, {
          backgroundColor: "rgba(0,0,0,0)",
          quality: "medium",
          cameraFov: 40,
        });
      } catch { return; }
      stageRef.current = stage;

      const onResize = () => stage.handleResize();
      window.addEventListener("resize", onResize, { passive: true });
      const ro = new ResizeObserver(() => stage.handleResize());
      if (containerRef.current) ro.observe(containerRef.current);

      stage.loadFile(`https://files.rcsb.org/download/${pdbId.toUpperCase()}.pdb`, {
        defaultRepresentation: false,
      })
      .then((comp: any) => {
        if (disposed) return;
        compRef.current = comp;

        comp.addRepresentation("cartoon", {
          colorScheme: "chainname", quality: "medium",
          opacity: showLigands ? 0.72 : 1.0,
        });
        if (showLigands) {
          comp.addRepresentation("ball+stick", {
            sele: "heteroatom and not water",
            colorScheme: "element", aspectRatio: 2.2,
          });
          comp.addRepresentation("surface", {
            sele: "heteroatom and not water",
            colorScheme: "element", opacity: 0.28, useWorker: false,
          });
        }

        comp.autoView();
        setLoading(false); setReady(true);
        requestAnimationFrame(() => {
          if (disposed) return;
          stage.handleResize(); comp.autoView();
          stage.setSpin([0, 1, 0], 0.005);
        });
      })
      .catch(() => { if (!disposed) setLoading(false); });

      return () => {
        window.removeEventListener("resize", onResize);
        ro.disconnect();
      };
    }

    let cleanup: (() => void) | undefined;
    if (window.NGL) { cleanup = mountStage() ?? undefined; }
    else {
      const s = document.createElement("script");
      s.src    = "https://cdn.jsdelivr.net/npm/ngl@2.3.1/dist/ngl.js";
      s.onload = () => { if (!disposed) cleanup = mountStage() ?? undefined; };
      s.onerror = () => { if (!disposed) setLoading(false); };
      document.head.appendChild(s);
    }

    return () => {
      disposed = true;
      cleanup?.();
      try { stageRef.current?.dispose(); } catch { /* */ }
      stageRef.current = null;
    };
  }, [pdbId, showLigands]);

  // Spin toggle
  useEffect(() => {
    if (!stageRef.current || !ready) return;
    stageRef.current.setSpin([0, 1, 0], spinning ? 0.005 : 0);
  }, [spinning, ready]);

  const repButtons: { id: RepMode; label: string; tip?: string }[] = [
    { id: "cartoon",       label: "Cartoon",         tip: "Cintas de cadena" },
    { id: "surface",       label: "Surface",          tip: "Superficie molecular" },
    { id: "both",          label: "Ambos",            tip: "Superficie + cintas" },
    { id: "hydrophobicity",label: "Hidrofobicidad",   tip: "Bolsillos hidrofóbicos (naranja) vs hidrofílicos (azul)" },
  ];

  return (
    <div className="relative w-full h-full flex flex-col" style={{ background: "#07080F" }}>
      {/* Top toolbar */}
      <div className="flex items-center justify-between px-3 py-2 flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(0,255,136,0.07)", background: "rgba(0,0,0,0.4)" }}>
        <div className="flex gap-1">
          {repButtons.map((b) => (
            <button key={b.id} onClick={() => setRep(b.id)}
              className="px-3 py-1 rounded-lg text-xs font-mono transition-all"
              style={{
                background: rep === b.id ? "rgba(0,255,136,0.1)" : "transparent",
                color: rep === b.id ? "var(--teal)" : "#6B7BA0",
                border: `1px solid ${rep === b.id ? "rgba(0,255,136,0.25)" : "transparent"}`,
              }}>
              {b.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {showLigands && (
            <button
              onClick={() => {
                if (compRef.current) compRef.current.autoView("heteroatom and not water", 600);
              }}
              className="px-3 py-1 rounded-lg text-xs font-mono transition-all"
              style={{ color: "var(--amber)", background: "rgba(245,166,35,0.06)", border: "1px solid rgba(245,166,35,0.2)" }}
              title="Enfocar el sitio de unión del ligando">
              🎯 Sitio activo
            </button>
          )}
          <button onClick={() => setSpinning(!spinning)}
            className="px-3 py-1 rounded-lg text-xs font-mono transition-all"
            style={{ color: spinning ? "var(--teal)" : "#6B7BA0", background: spinning ? "rgba(0,255,136,0.06)" : "transparent", border: "1px solid transparent" }}>
            {spinning ? "⟳ Girando" : "⏸ Pausa"}
          </button>
          <button
            onClick={() => { if (compRef.current) compRef.current.autoView(500); }}
            className="px-3 py-1 rounded-lg text-xs font-mono"
            style={{ color: "#6B7BA0", background: "transparent", border: "1px solid transparent" }}>
            ⊞ Reset
          </button>
        </div>
      </div>

      {/* NGL container */}
      <div className="relative flex-1">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10"
            style={{ background: "#07080F" }}>
            <div style={{
              width: 38, height: 38, borderRadius: "50%",
              border: "2px solid rgba(0,255,136,0.1)",
              borderTopColor: "var(--teal)",
              animation: "hero-spin 0.9s linear infinite",
            }} />
            <span style={{ fontFamily: "monospace", fontSize: "0.65rem", color: "var(--teal)", letterSpacing: "0.12em" }}>
              CARGANDO {pdbId.toUpperCase()} · RCSB PDB
            </span>
          </div>
        )}

        {/* Bottom overlay: structure info */}
        {ready && (
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between z-10 pointer-events-none">
            <div className="flex flex-col gap-1">
              {showLigands && (
                <div className="flex items-center gap-2" style={{ fontFamily: "monospace", fontSize: "0.6rem" }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#FFD700", display: "inline-block" }} />
                  <span style={{ color: "#B0BAD4" }}>{ligandName ?? "Ligando"}</span>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--teal)", display: "inline-block", marginLeft: 4 }} />
                  <span style={{ color: "#B0BAD4" }}>{proteinName ?? "Proteína"}</span>
                </div>
              )}
              <div style={{ fontFamily: "monospace", fontSize: "0.55rem", color: "#6B7BA0" }}>
                PDB: {pdbId.toUpperCase()}{resolution ? ` · ${resolution}` : ""}{method ? ` · ${method}` : ""}
              </div>
            </div>
            {kcalMol !== undefined && (
              <div className="rounded-lg px-3 py-1.5 text-right"
                style={{ background: "rgba(0,0,0,0.7)", border: "1px solid rgba(0,255,136,0.15)", backdropFilter: "blur(6px)" }}>
                <div style={{ fontFamily: "monospace", fontSize: "0.55rem", color: "#6B7BA0" }}>ΔG afinidad</div>
                <div style={{ fontFamily: "monospace", fontSize: "0.9rem", fontWeight: "bold", color: kcalMol < -8 ? "#00FF88" : kcalMol < -6 ? "#fbbf24" : "#ef4444" }}>
                  {kcalMol.toFixed(1)} kcal/mol
                </div>
              </div>
            )}
          </div>
        )}

        <div ref={containerRef} className="w-full h-full" />
      </div>
    </div>
  );
}
