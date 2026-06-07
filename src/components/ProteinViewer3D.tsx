"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface Props {
  pdbId: string;
  proteinName: string;
  mode: "student" | "researcher";
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    NGL: any;
  }
}

type RepresentationType = "cartoon" | "ball+stick" | "surface" | "spacefill" | "licorice";

const REPRESENTATIONS: {
  label: string;
  value: RepresentationType;
  mode: "student" | "researcher" | "both";
  desc: string;
}[] = [
  { label: "Cartoon",    value: "cartoon",    mode: "both",       desc: "Estructura secundaria (hélices α y láminas β)" },
  { label: "Space Fill", value: "spacefill",  mode: "both",       desc: "Esferas de van der Waals — modelo CPK" },
  { label: "Superficie", value: "surface",    mode: "researcher", desc: "Superficie molecular accesible al solvente" },
  { label: "Ball+Stick", value: "ball+stick", mode: "researcher", desc: "Átomos y enlaces individuales" },
  { label: "Licorice",   value: "licorice",   mode: "researcher", desc: "Cadenas laterales y ligandos" },
];

// Color schemes that only make sense on the 'surface' representation
const SURFACE_ONLY = new Set(["electrostatic", "hydrophobicity"]);

function buildParams(rep: RepresentationType, colorScheme: string): Record<string, unknown> {
  // If a surface-only color is requested on a non-surface rep → fall back to chainname
  const color = SURFACE_ONLY.has(colorScheme) && rep !== "surface" ? "chainname" : colorScheme;

  switch (rep) {
    case "cartoon":
      return { colorScheme: color, quality: "medium" };

    case "spacefill":
      // radiusType:"vdw" = van der Waals radii — the correct NGL param for spacefill
      // radiusScale:0.8 — slightly smaller than 1.0 so the view isn't too crowded
      // sphereDetail:1  — low polygon count, avoids WebGL memory issues on big proteins
      return { colorScheme: color, radiusType: "vdw", radiusScale: 0.8, sphereDetail: 1 };

    case "surface":
      // useWorker:false avoids a silent web-worker message failure on some browsers
      return { colorScheme: color, roughness: 0.5, metalness: 0.0, opacity: 0.88, useWorker: false };

    case "ball+stick":
      return { colorScheme: color, aspectRatio: 1.5, bondScale: 0.3 };

    case "licorice":
      return { colorScheme: color };

    default:
      return { colorScheme: color };
  }
}

export default function ProteinViewer3D({ pdbId, proteinName, mode }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stageRef     = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const compRef      = useRef<any>(null);
  // Always tracks the last rep that rendered successfully → used for fallback
  const lastOkRef    = useRef<{ rep: RepresentationType; color: string }>({
    rep: "cartoon",
    color: "chainname",
  });

  const [nglReady,    setNglReady]    = useState(false);
  const [loading,     setLoading]     = useState(true);
  const [repBusy,     setRepBusy]     = useState(false);
  const [repError,    setRepError]    = useState<string | null>(null);
  const [loadError,   setLoadError]   = useState<string | null>(null);
  const [activeRep,   setActiveRep]   = useState<RepresentationType>("cartoon");
  const [spinning,    setSpinning]    = useState(true);
  const [colorScheme, setColorScheme] = useState("chainname");

  // ── 1. Load NGL from CDN once ──────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.NGL) { setNglReady(true); return; }

    const s = document.createElement("script");
    s.src     = "https://cdn.jsdelivr.net/npm/ngl@2.0.0-dev.40/dist/ngl.js";
    s.onload  = () => setNglReady(true);
    s.onerror = () => setLoadError("No se pudo cargar el visualizador 3D (CDN).");
    document.head.appendChild(s);
  }, []);

  // ── 2. Init stage + load PDB whenever pdbId changes ───────────────
  useEffect(() => {
    if (!nglReady || !containerRef.current) return;

    // Reset state for new protein
    setLoading(true);
    setLoadError(null);
    setRepError(null);
    setActiveRep("cartoon");
    setColorScheme("chainname");
    lastOkRef.current = { rep: "cartoon", color: "chainname" };

    const stage = new window.NGL.Stage(containerRef.current, {
      backgroundColor: "transparent",
      quality: "medium",
    });
    stageRef.current = stage;

    const onResize = () => stage.handleResize();
    window.addEventListener("resize", onResize);

    const url = `https://files.rcsb.org/download/${pdbId.toUpperCase()}.pdb`;

    stage
      .loadFile(url, { defaultRepresentation: false })
      .then((comp: any) => {
        compRef.current = comp;
        applyDirect(comp, "cartoon", "chainname");
        comp.autoView();
        setLoading(false);
        stage.setSpin([0, 1, 0], 0.005);
      })
      .catch(() => {
        setLoadError(`Estructura "${pdbId.toUpperCase()}" no disponible en RCSB PDB.`);
        setLoading(false);
      });

    return () => {
      window.removeEventListener("resize", onResize);
      // Null refs BEFORE dispose so any stale callbacks don't use them
      compRef.current  = null;
      stageRef.current = null;
      try { stage.dispose(); } catch (_) { /* ignore */ }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nglReady, pdbId]);

  // ── 3. Core: apply representation synchronously ───────────────────
  // Returns true on success, false on failure (UI is restored to lastOk)
  const applyDirect = useCallback(
    (comp: any, rep: RepresentationType, color: string): boolean => {
      if (!comp) return false;
      try {
        comp.removeAllRepresentations();
        comp.addRepresentation(rep, buildParams(rep, color));
        lastOkRef.current = { rep, color };
        return true;
      } catch (err) {
        console.warn("[NGL] addRepresentation failed:", rep, err);
        // Best-effort restore to last known-good rep
        try {
          comp.removeAllRepresentations();
          comp.addRepresentation(
            lastOkRef.current.rep,
            buildParams(lastOkRef.current.rep, lastOkRef.current.color)
          );
        } catch (_) { /* truly stuck — leave viewer empty */ }
        return false;
      }
    },
    []
  );

  // ── 4. User-facing change handler ─────────────────────────────────
  // Uses double-rAF so React renders the "busy" overlay BEFORE NGL
  // blocks the main thread (especially important for 'surface').
  function changeRep(rep: RepresentationType) {
    if (repBusy || !compRef.current) return;
    setRepBusy(true);
    setRepError(null);

    // First rAF → React commits the busy state to DOM
    requestAnimationFrame(() => {
      // Second rAF → browser has painted the overlay; safe to do heavy work
      requestAnimationFrame(() => {
        const ok = applyDirect(compRef.current, rep, colorScheme);

        if (ok) {
          setActiveRep(rep);
          // If current color is surface-only but we're now on a non-surface rep,
          // reset color selector to chainname
          if (SURFACE_ONLY.has(colorScheme) && rep !== "surface") {
            setColorScheme("chainname");
          }
          setRepError(null);
        } else {
          // Snap UI back to the last successful state
          setActiveRep(lastOkRef.current.rep);
          setColorScheme(lastOkRef.current.color);
          setRepError(`"${rep}" no está disponible para esta proteína. Volviendo a ${lastOkRef.current.rep}.`);
        }

        setRepBusy(false);
      });
    });
  }

  function changeColor(color: string) {
    if (repBusy || !compRef.current) return;
    setRepBusy(true);
    setRepError(null);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const ok = applyDirect(compRef.current, activeRep, color);
        if (ok) {
          setColorScheme(color);
        } else {
          setColorScheme(lastOkRef.current.color);
          setRepError("Esquema de color no disponible. Restaurado.");
        }
        setRepBusy(false);
      });
    });
  }

  function toggleSpin() {
    if (!stageRef.current) return;
    const next = !spinning;
    setSpinning(next);
    stageRef.current.setSpin(next ? [0, 1, 0] : null, next ? 0.005 : 0);
  }

  function resetView() {
    compRef.current?.autoView();
  }

  const visibleReps = REPRESENTATIONS.filter(
    (r) => r.mode === "both" || r.mode === mode
  );

  const colorOptions = [
    { value: "chainname",    label: "Por cadena" },
    { value: "element",      label: "Por elemento" },
    { value: "residueindex", label: "Por residuo" },
    { value: "bfactor",      label: "B-factor" },
    ...(activeRep === "surface"
      ? [
          { value: "electrostatic",  label: "Electrostático" },
          { value: "hydrophobicity", label: "Hidrofobicidad" },
        ]
      : []),
  ];

  // ── Render ─────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full">

      {/* Controls bar */}
      <div className="flex flex-wrap items-center gap-2 p-3 border-b border-slate-800/50 bg-slate-900/50">
        <div className="flex flex-wrap gap-1.5">
          {visibleReps.map((r) => {
            const isActive = activeRep === r.value;
            const isBusy   = repBusy && isActive;
            return (
              <button
                key={r.value}
                onClick={() => changeRep(r.value)}
                title={r.desc}
                disabled={repBusy || loading}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                  isActive
                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
                    : "bg-slate-800/60 text-slate-400 border border-slate-700/50 hover:text-white hover:border-slate-600"
                }`}
              >
                {isBusy ? (
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full border border-t-cyan-400 border-slate-600 animate-spin inline-block" />
                    {r.label}
                  </span>
                ) : r.label}
              </button>
            );
          })}
        </div>

        <div className="flex gap-1.5 ml-auto">
          {mode === "researcher" && (
            <select
              value={colorOptions.find((o) => o.value === colorScheme) ? colorScheme : "chainname"}
              onChange={(e) => changeColor(e.target.value)}
              disabled={repBusy || loading}
              className="px-2 py-1.5 rounded-lg text-xs bg-slate-800 border border-slate-700 text-slate-300 focus:outline-none focus:border-slate-500 disabled:opacity-40"
            >
              {colorOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          )}

          <button
            onClick={toggleSpin}
            disabled={loading}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all disabled:opacity-40 ${
              spinning
                ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"
            }`}
          >
            {spinning ? "⏸ Parar" : "▶ Girar"}
          </button>

          <button
            onClick={resetView}
            disabled={loading}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700 hover:text-white transition-all disabled:opacity-40"
          >
            ⌖ Centrar
          </button>
        </div>
      </div>

      {/* Error toast (representation errors — non-fatal) */}
      {repError && (
        <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 text-amber-400 text-xs">
          <span>⚠</span>
          <span>{repError}</span>
          <button
            onClick={() => setRepError(null)}
            className="ml-auto text-amber-600 hover:text-amber-400"
          >
            ✕
          </button>
        </div>
      )}

      {/* Viewer area */}
      <div className="relative flex-1 min-h-[400px] bg-gradient-to-br from-slate-950 to-slate-900">

        {/* Initial load spinner */}
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20" />
              <div className="absolute inset-0 rounded-full border-t-2 border-cyan-500 animate-spin" />
              <div className="absolute inset-2 rounded-full border-2 border-violet-500/20" />
              <div
                className="absolute inset-2 rounded-full border-t-2 border-violet-500 animate-spin"
                style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
              />
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-400">Cargando estructura 3D</p>
              <p className="text-xs text-slate-600 font-mono mt-1">{pdbId.toUpperCase()} · RCSB PDB</p>
            </div>
          </div>
        )}

        {/* Representation-change overlay */}
        {repBusy && !loading && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-slate-950/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 px-5 py-3 rounded-xl glass border border-slate-700 text-sm text-slate-300">
              <div className="w-4 h-4 rounded-full border-t-2 border-cyan-400 animate-spin flex-shrink-0" />
              Aplicando representación...
            </div>
          </div>
        )}

        {/* Fatal load error */}
        {loadError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10 p-6 text-center">
            <div className="text-4xl">⚠️</div>
            <p className="text-slate-300 text-sm">{loadError}</p>
            <div className="flex gap-3">
              <a
                href={`https://alphafold.ebi.ac.uk/entry/${pdbId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-violet-500/10 border border-violet-500/30 text-violet-400 text-sm hover:opacity-80 transition-opacity"
              >
                Ver en AlphaFold ↗
              </a>
              <a
                href={`https://www.rcsb.org/structure/${pdbId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm hover:opacity-80 transition-opacity"
              >
                Ver en RCSB ↗
              </a>
            </div>
          </div>
        )}

        {/* NGL canvas */}
        <div ref={containerRef} className="w-full h-full" style={{ minHeight: 400 }} />

        {/* Status bar */}
        {!loading && !loadError && (
          <>
            <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
              {pdbId.toUpperCase()} · {proteinName}
            </div>
            <div className="absolute bottom-3 right-3 text-xs text-slate-700 text-right leading-relaxed">
              <p>Arrastrar: rotar · Scroll: zoom</p>
              <p>Clic derecho: trasladar</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
