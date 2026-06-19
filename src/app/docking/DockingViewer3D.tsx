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
  const ligandReprRef = useRef<any>(null);

  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(false);
  const [retryKey,   setRetryKey]   = useState(0);
  const [ready,      setReady]      = useState(false);
  const [repLoading, setRepLoading] = useState(false);
  const [switching,  setSwitching]  = useState(false);
  const [rep,        setRep]        = useState<RepMode>("cartoon");
  const [spinning,   setSpinning]   = useState(true);
  const [zoomHint,   setZoomHint]   = useState<string | null>(null);

  // ── Representaciones ───────────────────────────────────────────────────────
  useEffect(() => {
    const comp  = compRef.current;
    const stage = stageRef.current;
    if (!comp || !ready) return;

    // Cubrir el canvas con overlay opaco ANTES de cualquier cambio
    // Esto evita que el estado anterior sea visible durante la transición
    setSwitching(true);
    comp.removeAllRepresentations();
    ligandReprRef.current = null;

    const needsSurface = rep === "surface" || rep === "both" || rep === "hydrophobicity";
    setRepLoading(needsSurface);

    // Proteína
    if (rep === "hydrophobicity") {
      comp.addRepresentation("surface", {
        sele: "protein", colorScheme: "hydrophobicity", opacity: 0.88,
      });
    }
    if (rep === "cartoon" || rep === "both") {
      comp.addRepresentation("cartoon", {
        colorScheme: "chainname", quality: "medium",
        opacity: rep === "both" ? 0.38 : 1.0,
      });
    }
    if (rep === "surface" || rep === "both") {
      comp.addRepresentation("surface", {
        sele: "protein", colorScheme: "chainname",
        opacity: rep === "both" ? 0.48 : 0.55,
      });
    }

    // Ligando — solo ball+stick (sin surface del ligando para evitar WebWorker extra)
    if (showLigands) {
      const bsRepr = comp.addRepresentation("ball+stick", {
        sele: "heteroatom and not water",
        colorScheme: "element", aspectRatio: 2.4, radiusScale: 1.1,
      });
      ligandReprRef.current = bsRepr;
    }

    if (needsSurface && stage) {
      let active = true;
      const check = () => {
        if (!active) return;
        if ((stage.tasks?.count ?? 0) === 0) {
          active = false;
          setRepLoading(false);
          setSwitching(false);
        }
      };
      const unsub = stage.signals?.taskCountChanged?.add(check);
      check();
      const poll = setInterval(check, 400);
      return () => {
        active = false;
        clearInterval(poll);
        try { unsub?.(); } catch { /* */ }
        setSwitching(false);
      };
    } else {
      // Modos sin superficie: esperar un frame para que NGL renderice antes de quitar overlay
      const t = setTimeout(() => setSwitching(false), 100);
      return () => { clearTimeout(t); setSwitching(false); };
    }
  }, [rep, ready, showLigands]);

  // ── Montar stage ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    setLoading(true); setError(false); setReady(false);
    setRepLoading(false); setSwitching(false);
    compRef.current = null; ligandReprRef.current = null;
    let disposed = false;

    function mount() {
      if (disposed || !containerRef.current) return;
      if (stageRef.current) { try { stageRef.current.dispose(); } catch { /* */ } }

      // Limpiar canvas residual
      while (containerRef.current.firstChild) {
        containerRef.current.removeChild(containerRef.current.firstChild);
      }

      let stage: any;
      try {
        stage = new window.NGL.Stage(containerRef.current, {
          backgroundColor: "#07080F", // Sólido: evita que elementos detrás se vean a través
          quality: "medium", cameraFov: 40,
        });
      } catch { return; }
      stageRef.current = stage;

      const onResize = () => stage.handleResize();
      window.addEventListener("resize", onResize, { passive: true });
      const ro = new ResizeObserver(() => stage.handleResize());
      if (containerRef.current) ro.observe(containerRef.current);

      const id = pdbId.toUpperCase();
      const onLoad = (comp: any) => {
        if (disposed) return;
        compRef.current = comp;
        comp.autoView();
        setLoading(false);
        setReady(true);
        requestAnimationFrame(() => {
          if (disposed) return;
          stage.handleResize(); comp.autoView();
          stage.setSpin([0, 1, 0], 0.005);
        });
      };

      stage.loadFile(`https://files.rcsb.org/download/${id}.pdb`, {
        defaultRepresentation: false,
      })
      .then(onLoad)
      .catch(() => {
        if (disposed) return Promise.resolve();
        return stage.loadFile(`https://files.rcsb.org/download/${id}.cif`, {
          defaultRepresentation: false,
        }).then(onLoad);
      })
      .catch(() => { if (!disposed) { setLoading(false); setError(true); } });

      return () => { window.removeEventListener("resize", onResize); ro.disconnect(); };
    }

    let cleanup: (() => void) | undefined;
    if (window.NGL) {
      cleanup = mount() ?? undefined;
    } else {
      // Evitar agregar el script si ya está en el documento
      const existing = document.querySelector('script[data-ngl]');
      if (existing) {
        existing.addEventListener("load", () => { if (!disposed) cleanup = mount() ?? undefined; });
      } else {
        const s = document.createElement("script");
        s.setAttribute("data-ngl", "1");
        s.src    = "https://cdn.jsdelivr.net/npm/ngl@2.3.1/dist/ngl.js";
        s.onload = () => { if (!disposed) cleanup = mount() ?? undefined; };
        s.onerror = () => { if (!disposed) setLoading(false); };
        document.head.appendChild(s);
      }
    }

    return () => {
      disposed = true; cleanup?.();
      try { stageRef.current?.dispose(); } catch { /* */ }
      stageRef.current = null;
      try {
        if (containerRef.current) {
          while (containerRef.current.firstChild) {
            containerRef.current.removeChild(containerRef.current.firstChild);
          }
        }
      } catch { /* */ }
    };
  }, [pdbId, showLigands, retryKey]);

  // ── Spin ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!stageRef.current || !ready) return;
    stageRef.current.setSpin([0, 1, 0], spinning ? 0.005 : 0);
  }, [spinning, ready]);

  // ── Zoom al ligando ────────────────────────────────────────────────────────
  const zoomToLigand = () => {
    const stage = stageRef.current;
    if (!stage) return;
    stage.setSpin(null, 0);
    setSpinning(false);
    const repr = ligandReprRef.current;
    if (repr) {
      repr.autoView(900);
      setZoomHint("Sitio de unión · arrastra para explorar · scroll para zoom");
      setTimeout(() => setZoomHint(null), 3800);
    } else {
      compRef.current?.autoView(800);
    }
  };

  const REP_BUTTONS: { id: RepMode; label: string; color: string; tip: string }[] = [
    { id: "cartoon",        label: "Cintas",         color: "#00FF88", tip: "Estructura secundaria (α-hélice, β-hoja)" },
    { id: "surface",        label: "Superficie",     color: "#60a5fa", tip: "Contorno molecular completo" },
    { id: "both",           label: "Combinado",      color: "#a78bfa", tip: "Superficie semitransparente + cintas internas" },
    { id: "hydrophobicity", label: "Hidrofobicidad", color: "#fbbf24", tip: "Naranja=hidrofóbico · Azul=polar" },
  ];

  const isTransitioning = !error && (loading || repLoading || switching);

  return (
    <div className="relative w-full h-full flex flex-col" style={{ background: "#07080F" }}>

      {/* Toolbar */}
      <div className="flex-shrink-0 px-3 py-2 space-y-2"
        style={{ borderBottom: "1px solid rgba(0,255,136,0.08)", background: "rgba(0,0,0,0.55)" }}>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-mono" style={{ color: "#6B7BA0" }}>Vista:</span>
          {REP_BUTTONS.map((b) => (
            <button key={b.id} onClick={() => setRep(b.id)} title={b.tip}
              disabled={isTransitioning && !loading}
              className="px-3 py-1 rounded-lg text-xs font-mono transition-all"
              style={{
                background: rep === b.id ? `${b.color}15` : "rgba(255,255,255,0.03)",
                color: rep === b.id ? b.color : "#6B7BA0",
                border: `1px solid ${rep === b.id ? b.color + "40" : "rgba(255,255,255,0.05)"}`,
              }}>
              {repLoading && rep === b.id ? "⏳ procesando…" : b.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {showLigands && (
            <button onClick={zoomToLigand}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono"
              style={{ color: "#fbbf24", background: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.28)" }}>
              🔍 Enfocar ligando
            </button>
          )}
          <button onClick={() => setSpinning(!spinning)}
            className="px-3 py-1 rounded-lg text-xs font-mono"
            style={{ color: spinning ? "#00FF88" : "#6B7BA0", background: spinning ? "rgba(0,255,136,0.06)" : "transparent", border: `1px solid ${spinning ? "rgba(0,255,136,0.2)" : "transparent"}` }}>
            {spinning ? "⟳ Girando" : "▶ Girar"}
          </button>
          <button onClick={() => { compRef.current?.autoView(600); setSpinning(true); }}
            className="px-3 py-1 rounded-lg text-xs font-mono" style={{ color: "#6B7BA0" }}>
            ⊞ Centrar
          </button>
          <span className="text-xs font-mono ml-auto hidden sm:block" style={{ color: "#6B7BA0" }}>
            🖱 Arrastrar · Scroll zoom
          </span>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative flex-1">

        {/* Error overlay */}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-20"
            style={{ background: "#07080F" }}>
            <span style={{ fontSize: "1.5rem" }}>⚠️</span>
            <span style={{ fontFamily: "monospace", fontSize: "0.65rem", color: "#ef4444", letterSpacing: "0.12em" }}>
              ERROR AL CARGAR {pdbId.toUpperCase()}
            </span>
            <span style={{ fontFamily: "monospace", fontSize: "0.55rem", color: "#6B7BA0" }}>
              No se pudo obtener la estructura desde RCSB PDB
            </span>
            <button onClick={() => { setError(false); setLoading(true); setRetryKey(k => k + 1); }}
              style={{ fontFamily: "monospace", fontSize: "0.6rem", color: "var(--teal)", border: "1px solid rgba(0,255,136,0.3)", background: "rgba(0,255,136,0.06)", padding: "6px 14px", borderRadius: 8, cursor: "pointer" }}>
              Reintentar
            </button>
          </div>
        )}

        {/* Transición / Carga / Cómputo overlay — cubre siempre el canvas durante cambios */}
        {isTransitioning && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-20"
            style={{
              background: loading ? "#07080F" : "rgba(7,8,15,0.94)",
              backdropFilter: repLoading ? "blur(3px)" : "none",
            }}>
            {(loading || repLoading) && (
              <>
                <div style={{ width: 38, height: 38, borderRadius: "50%", border: "2px solid rgba(0,255,136,0.1)", borderTopColor: "var(--teal)", animation: "hero-spin 0.9s linear infinite" }} />
                <span style={{ fontFamily: "monospace", fontSize: "0.65rem", color: "var(--teal)", letterSpacing: "0.12em" }}>
                  {loading ? `CARGANDO ${pdbId.toUpperCase()} · RCSB PDB` : "COMPUTANDO SUPERFICIE…"}
                </span>
                {repLoading && (
                  <span style={{ fontFamily: "monospace", fontSize: "0.58rem", color: "#6B7BA0" }}>
                    Puede tardar 5–20 seg en proteínas grandes
                  </span>
                )}
              </>
            )}
          </div>
        )}

        {/* Zoom hint toast */}
        {zoomHint && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-xl text-xs font-mono"
            style={{ background: "rgba(245,166,35,0.12)", border: "1px solid rgba(245,166,35,0.35)", color: "#fbbf24", whiteSpace: "nowrap" }}>
            🔍 {zoomHint}
          </div>
        )}

        {/* Info overlay */}
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
                style={{ background: "rgba(0,0,0,0.78)", border: "1px solid rgba(0,255,136,0.15)", backdropFilter: "blur(6px)" }}>
                <div style={{ fontFamily: "monospace", fontSize: "0.55rem", color: "#6B7BA0" }}>ΔG afinidad</div>
                <div style={{ fontFamily: "monospace", fontSize: "0.9rem", fontWeight: "bold", color: kcalMol < -8 ? "#00FF88" : kcalMol < -6 ? "#fbbf24" : "#ef4444" }}>
                  {kcalMol.toFixed(1)} kcal/mol
                </div>
              </div>
            )}
          </div>
        )}

        <div ref={containerRef} className="relative w-full h-full" />
      </div>
    </div>
  );
}
