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
  const containerRef  = useRef<HTMLDivElement>(null);
  const stageRef      = useRef<any>(null);
  const compRef       = useRef<any>(null);
  const ligandReprRef = useRef<any>(null); // referencia directa a la repr del ligando
  const repPending    = useRef<RepMode>("cartoon"); // evitar doble render en switch

  const [loading,    setLoading]    = useState(true);
  const [ready,      setReady]      = useState(false);
  const [rep,        setRep]        = useState<RepMode>("cartoon");
  const [repLoading, setRepLoading] = useState(false); // true mientras superficie computa
  const [spinning,   setSpinning]   = useState(true);
  const [zoomHint,   setZoomHint]   = useState<string | null>(null);

  // ── Aplicar representación ─────────────────────────────────────────────────
  useEffect(() => {
    const comp  = compRef.current;
    const stage = stageRef.current;
    if (!comp || !ready) return;

    // Cancelar la representación anterior limpiamente
    comp.removeAllRepresentations();
    ligandReprRef.current = null;

    const needsSurface = rep === "surface" || rep === "both" || rep === "hydrophobicity";
    if (needsSurface) setRepLoading(true);

    // ── Proteína ──
    if (rep === "hydrophobicity") {
      comp.addRepresentation("surface", {
        sele: "protein",
        colorScheme: "hydrophobicity",
        opacity: 0.88,
        // useWorker por defecto = true → no bloquea el hilo principal
      });
    }
    if (rep === "cartoon" || rep === "both") {
      comp.addRepresentation("cartoon", {
        colorScheme: "chainname",
        quality: "medium",
        opacity: rep === "both" ? 0.50 : showLigands ? 0.72 : 1.0,
      });
    }
    if (rep === "surface" || rep === "both") {
      comp.addRepresentation("surface", {
        sele: "protein",
        colorScheme: "chainname",
        opacity: rep === "both" ? 0.16 : 0.32,
        // useWorker = true (default) → async en web worker, NO bloquea
      });
    }

    // ── Ligando ──
    if (showLigands) {
      const bsRepr = comp.addRepresentation("ball+stick", {
        sele: "heteroatom and not water",
        colorScheme: "element",
        aspectRatio: 2.4,
        radiusScale: 1.1,
      });
      ligandReprRef.current = bsRepr; // guardamos referencia para autoView

      if (rep !== "surface") {
        comp.addRepresentation("surface", {
          sele: "heteroatom and not water",
          colorScheme: "element",
          opacity: 0.25,
        });
      }
    }

    // Escuchar cuando NGL termina de computar la superficie
    if (needsSurface && stage) {
      const checkDone = () => {
        if ((stage.tasks?.count ?? 0) === 0) {
          setRepLoading(false);
        }
      };
      const unsub = stage.signals?.taskCountChanged?.add(checkDone);
      checkDone(); // por si ya terminó
      return () => { try { unsub?.(); } catch { /* */ } };
    }
  }, [rep, ready, showLigands]);

  // ── Montar NGL ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    setLoading(true); setReady(false); setRepLoading(false);
    compRef.current = null; ligandReprRef.current = null;
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
          const bsRepr = comp.addRepresentation("ball+stick", {
            sele: "heteroatom and not water",
            colorScheme: "element", aspectRatio: 2.4, radiusScale: 1.1,
          });
          ligandReprRef.current = bsRepr;
          comp.addRepresentation("surface", {
            sele: "heteroatom and not water",
            colorScheme: "element", opacity: 0.25,
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

      return () => { window.removeEventListener("resize", onResize); ro.disconnect(); };
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
      disposed = true; cleanup?.();
      try { stageRef.current?.dispose(); } catch { /* */ }
      stageRef.current = null;
    };
  }, [pdbId, showLigands]);

  // ── Spin toggle ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!stageRef.current || !ready) return;
    stageRef.current.setSpin([0, 1, 0], spinning ? 0.005 : 0);
  }, [spinning, ready]);

  // ── Zoom al ligando ────────────────────────────────────────────────────────
  const zoomToLigand = () => {
    const stage = stageRef.current;
    if (!stage) return;
    // Pausa el giro para que se vea bien
    stage.setSpin(null, 0);
    setSpinning(false);

    const repr = ligandReprRef.current;
    if (repr) {
      // autoView sobre la representación del ligando → zoom exacto al bolsillo
      repr.autoView(900);
      setZoomHint("Sitio de unión enfocado — usa el mouse para explorar");
      setTimeout(() => setZoomHint(null), 3500);
    } else if (compRef.current) {
      compRef.current.autoView(800);
    }
  };

  const REP_BUTTONS: { id: RepMode; label: string; desc: string; color: string }[] = [
    { id: "cartoon",        label: "Cintas",        desc: "Estructura secundaria (α-hélice, β-hoja)",       color: "#00FF88" },
    { id: "surface",        label: "Superficie",    desc: "Contorno molecular completo",                    color: "#60a5fa" },
    { id: "both",           label: "Combinado",     desc: "Superficie semitransparente + cintas internas",  color: "#a78bfa" },
    { id: "hydrophobicity", label: "Hidrofobicidad",desc: "Naranja = hidrofóbico · Azul = polar",           color: "#fbbf24" },
  ];

  return (
    <div className="relative w-full h-full flex flex-col" style={{ background: "#07080F" }}>

      {/* ── Toolbar ── */}
      <div className="flex-shrink-0 px-3 py-2"
        style={{ borderBottom: "1px solid rgba(0,255,136,0.07)", background: "rgba(0,0,0,0.5)" }}>

        {/* Rep buttons */}
        <div className="flex flex-wrap items-center gap-1.5 mb-2">
          <span className="text-xs font-mono mr-1" style={{ color: "#6B7BA0" }}>Vista:</span>
          {REP_BUTTONS.map((b) => (
            <button key={b.id} onClick={() => { repPending.current = b.id; setRep(b.id); }}
              title={b.desc}
              className="px-3 py-1 rounded-lg text-xs font-mono transition-all"
              style={{
                background: rep === b.id ? `${b.color}15` : "rgba(255,255,255,0.03)",
                color: rep === b.id ? b.color : "#6B7BA0",
                border: `1px solid ${rep === b.id ? b.color + "40" : "rgba(255,255,255,0.06)"}`,
              }}>
              {repLoading && rep === b.id ? "⏳ computando…" : b.label}
            </button>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {showLigands && (
            <button onClick={zoomToLigand}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-all"
              style={{ color: "#fbbf24", background: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.25)" }}>
              🔍 Enfocar ligando
            </button>
          )}
          <button onClick={() => setSpinning(!spinning)}
            className="px-3 py-1 rounded-lg text-xs font-mono transition-all"
            style={{ color: spinning ? "#00FF88" : "#6B7BA0", background: spinning ? "rgba(0,255,136,0.06)" : "transparent", border: `1px solid ${spinning ? "rgba(0,255,136,0.2)" : "transparent"}` }}>
            {spinning ? "⟳ Girando" : "▶ Girar"}
          </button>
          <button onClick={() => { if (compRef.current) { compRef.current.autoView(600); setSpinning(true); } }}
            className="px-3 py-1 rounded-lg text-xs font-mono"
            style={{ color: "#6B7BA0", background: "transparent", border: "1px solid transparent" }}>
            ⊞ Centrar
          </button>
          <span className="text-xs font-mono ml-auto" style={{ color: "#6B7BA0" }}>
            🖱 Arrastrar · Scroll zoom · Click derecho rotar
          </span>
        </div>
      </div>

      {/* ── NGL canvas ── */}
      <div className="relative flex-1">
        {/* Loading overlay */}
        {(loading || repLoading) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-20"
            style={{ background: loading ? "#07080F" : "rgba(7,8,15,0.6)", backdropFilter: repLoading ? "blur(2px)" : "none" }}>
            <div style={{
              width: 38, height: 38, borderRadius: "50%",
              border: "2px solid rgba(0,255,136,0.1)",
              borderTopColor: "var(--teal)",
              animation: "hero-spin 0.9s linear infinite",
            }} />
            <span style={{ fontFamily: "monospace", fontSize: "0.65rem", color: "var(--teal)", letterSpacing: "0.12em" }}>
              {loading ? `CARGANDO ${pdbId.toUpperCase()} · RCSB PDB` : "COMPUTANDO SUPERFICIE…"}
            </span>
            {repLoading && (
              <span style={{ fontFamily: "monospace", fontSize: "0.58rem", color: "#6B7BA0" }}>
                Las superficies moleculares tardan 5–15 seg en proteínas grandes
              </span>
            )}
          </div>
        )}

        {/* Zoom hint toast */}
        {zoomHint && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-xl text-xs font-mono transition-all"
            style={{ background: "rgba(245,166,35,0.12)", border: "1px solid rgba(245,166,35,0.3)", color: "#fbbf24", whiteSpace: "nowrap" }}>
            🔍 {zoomHint}
          </div>
        )}

        {/* Bottom info overlay */}
        {ready && !loading && (
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between z-10 pointer-events-none">
            <div className="flex flex-col gap-1">
              {showLigands && (
                <div className="flex items-center gap-2" style={{ fontFamily: "monospace", fontSize: "0.6rem" }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#FFD700", display: "inline-block" }} />
                  <span style={{ color: "#B0BAD4" }}>{ligandName ?? "Ligando"}</span>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#00FF88", display: "inline-block", marginLeft: 4 }} />
                  <span style={{ color: "#B0BAD4" }}>{proteinName ?? "Proteína"}</span>
                </div>
              )}
              <div style={{ fontFamily: "monospace", fontSize: "0.55rem", color: "#6B7BA0" }}>
                PDB: {pdbId.toUpperCase()}{resolution ? ` · ${resolution}` : ""}{method ? ` · ${method}` : ""}
              </div>
            </div>
            {kcalMol !== undefined && (
              <div className="rounded-lg px-3 py-1.5 text-right"
                style={{ background: "rgba(0,0,0,0.75)", border: "1px solid rgba(0,255,136,0.15)", backdropFilter: "blur(6px)" }}>
                <div style={{ fontFamily: "monospace", fontSize: "0.55rem", color: "#6B7BA0" }}>ΔG afinidad</div>
                <div style={{ fontFamily: "monospace", fontSize: "0.9rem", fontWeight: "bold",
                  color: kcalMol < -8 ? "#00FF88" : kcalMol < -6 ? "#fbbf24" : "#ef4444" }}>
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
