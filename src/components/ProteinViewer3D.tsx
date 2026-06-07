"use client";

import { useEffect, useRef, useState } from "react";

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
  { label: "Space Fill", value: "spacefill",  mode: "both",       desc: "Modelo CPK — esferas de van der Waals por átomo" },
  { label: "Superficie", value: "surface",    mode: "researcher", desc: "Superficie molecular accesible al solvente" },
  { label: "Ball+Stick", value: "ball+stick", mode: "researcher", desc: "Átomos y enlaces individuales" },
  { label: "Licorice",   value: "licorice",   mode: "researcher", desc: "Vista de ligandos y cadenas laterales" },
];

// Color schemes that require surface calculation — only valid for 'surface' rep
const SURFACE_ONLY_SCHEMES = new Set(["electrostatic", "hydrophobicity"]);

// Per-representation safe parameters (avoid passing surface-only WebGL params to atom reps)
function getRepParams(rep: RepresentationType, colorScheme: string) {
  const safeColor = SURFACE_ONLY_SCHEMES.has(colorScheme) && rep !== "surface"
    ? "chainname"
    : colorScheme;

  const base = { colorScheme: safeColor };

  switch (rep) {
    case "surface":
      return { ...base, roughness: 0.5, metalness: 0.0, opacity: 0.85, useWorker: false };
    case "spacefill":
      return { ...base, radius: 1.5 };
    case "ball+stick":
      return { ...base, aspectRatio: 1.5 };
    case "cartoon":
      return { ...base, quality: "medium" };
    default:
      return base;
  }
}

export default function ProteinViewer3D({ pdbId, proteinName, mode }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stageRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const componentRef = useRef<any>(null);
  const [loading, setLoading]           = useState(true);
  const [repLoading, setRepLoading]     = useState(false);
  const [error, setError]               = useState<string | null>(null);
  const [representation, setRepresentation] = useState<RepresentationType>("cartoon");
  const [spinning, setSpinning]         = useState(true);
  const [nglLoaded, setNglLoaded]       = useState(false);
  const [colorScheme, setColorScheme]   = useState<string>("chainname");

  // ── Load NGL from CDN ─────────────────────────────────────────────
  useEffect(() => {
    if (window.NGL) { setNglLoaded(true); return; }
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/ngl@2.0.0-dev.40/dist/ngl.js";
    script.onload  = () => setNglLoaded(true);
    script.onerror = () => setError("No se pudo cargar el visualizador 3D.");
    document.head.appendChild(script);
  }, []);

  // ── Init NGL Stage + load PDB ──────────────────────────────────────
  useEffect(() => {
    if (!nglLoaded || !containerRef.current) return;

    const stage = new window.NGL.Stage(containerRef.current, {
      backgroundColor: "transparent",
      quality: "medium",
    });
    stageRef.current = stage;

    const handleResize = () => stage.handleResize();
    window.addEventListener("resize", handleResize);

    const url = `https://files.rcsb.org/download/${pdbId.toUpperCase()}.pdb`;

    stage
      .loadFile(url, { defaultRepresentation: false })
      .then((component: any) => {
        componentRef.current = component;
        applyRepresentation(component, "cartoon", "chainname");
        component.autoView();
        setLoading(false);
        if (spinning) stage.setSpin([0, 1, 0], 0.005);
      })
      .catch(() => {
        setError(`Estructura PDB "${pdbId}" no disponible. Prueba AlphaFold DB.`);
        setLoading(false);
      });

    return () => {
      window.removeEventListener("resize", handleResize);
      stage.dispose();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nglLoaded, pdbId]);

  // ── Core: apply representation safely ─────────────────────────────
  function applyRepresentation(
    component: any,
    rep: RepresentationType,
    color: string
  ) {
    if (!component) return;
    try {
      component.removeAllRepresentations();
      component.addRepresentation(rep, getRepParams(rep, color));
    } catch (e) {
      console.warn("NGL representation error, falling back to cartoon:", e);
      try {
        component.removeAllRepresentations();
        component.addRepresentation("cartoon", { colorScheme: "chainname", quality: "medium" });
      } catch (_) { /* ignore */ }
    }
  }

  // ── Event handlers ─────────────────────────────────────────────────
  function changeRepresentation(rep: RepresentationType) {
    setRepresentation(rep);
    setRepLoading(true);
    // Surface can be slow — give React a tick to update UI before blocking
    setTimeout(() => {
      applyRepresentation(componentRef.current, rep, colorScheme);
      setRepLoading(false);
    }, 20);
  }

  function changeColor(color: string) {
    setColorScheme(color);
    setRepLoading(true);
    setTimeout(() => {
      applyRepresentation(componentRef.current, representation, color);
      setRepLoading(false);
    }, 20);
  }

  function toggleSpin() {
    if (!stageRef.current) return;
    const next = !spinning;
    setSpinning(next);
    stageRef.current.setSpin(next ? [0, 1, 0] : null, next ? 0.005 : 0);
  }

  function resetView() {
    componentRef.current?.autoView();
  }

  const availableReps = REPRESENTATIONS.filter(
    (r) => r.mode === "both" || r.mode === mode
  );

  // Color options — hide surface-only schemes for non-surface reps
  const colorOptions = [
    { value: "chainname",    label: "Por cadena" },
    { value: "element",      label: "Por elemento" },
    { value: "residueindex", label: "Por residuo" },
    { value: "bfactor",      label: "B-factor" },
    ...(representation === "surface"
      ? [
          { value: "electrostatic",  label: "Electrostático" },
          { value: "hydrophobicity", label: "Hidrofobicidad" },
        ]
      : []),
  ];

  return (
    <div className="flex flex-col h-full">
      {/* ── Controls bar ─────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2 p-3 border-b border-slate-800/50 bg-slate-900/50">
        <div className="flex flex-wrap gap-1.5">
          {availableReps.map((r) => (
            <button
              key={r.value}
              onClick={() => changeRepresentation(r.value)}
              title={r.desc}
              disabled={repLoading}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-50 ${
                representation === r.value
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
                  : "bg-slate-800/60 text-slate-400 border border-slate-700/50 hover:text-white hover:border-slate-600"
              }`}
            >
              {repLoading && representation === r.value
                ? <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full border border-t-cyan-400 border-slate-600 animate-spin inline-block" />{r.label}</span>
                : r.label}
            </button>
          ))}
        </div>

        <div className="flex gap-1.5 ml-auto">
          {mode === "researcher" && (
            <select
              value={SURFACE_ONLY_SCHEMES.has(colorScheme) && representation !== "surface" ? "chainname" : colorScheme}
              onChange={(e) => changeColor(e.target.value)}
              disabled={repLoading}
              className="px-2 py-1.5 rounded-lg text-xs bg-slate-800 border border-slate-700 text-slate-300 focus:outline-none focus:border-slate-500 disabled:opacity-50"
            >
              {colorOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          )}

          <button
            onClick={toggleSpin}
            disabled={loading || repLoading}
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

      {/* ── Viewer ───────────────────────────────────────────────── */}
      <div className="relative flex-1 min-h-[400px] bg-gradient-to-br from-slate-950 to-slate-900">
        {/* Initial load spinner */}
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20" />
              <div className="absolute inset-0 rounded-full border-t-2 border-cyan-500 animate-spin" />
              <div className="absolute inset-2 rounded-full border-2 border-violet-500/20" />
              <div className="absolute inset-2 rounded-full border-t-2 border-violet-500 animate-spin"
                style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-400">Cargando estructura 3D</p>
              <p className="text-xs text-slate-600 font-mono mt-1">{pdbId.toUpperCase()} · RCSB PDB</p>
            </div>
          </div>
        )}

        {/* Representation change overlay */}
        {repLoading && !loading && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-slate-950/40 backdrop-blur-sm">
            <div className="flex items-center gap-3 px-5 py-3 rounded-xl glass border border-slate-700 text-sm text-slate-300">
              <div className="w-4 h-4 rounded-full border-t-2 border-cyan-400 animate-spin" />
              Calculando representación...
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10 p-6 text-center">
            <div className="text-4xl">⚠️</div>
            <p className="text-slate-300 text-sm">{error}</p>
            <a
              href={`https://alphafold.ebi.ac.uk/entry/${pdbId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-violet-500/10 border border-violet-500/30 text-violet-400 text-sm hover:opacity-80 transition-opacity"
            >
              Ver en AlphaFold DB →
            </a>
          </div>
        )}

        <div ref={containerRef} className="w-full h-full" style={{ minHeight: 400 }} />

        {!loading && !error && (
          <>
            <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
              RCSB PDB · {pdbId.toUpperCase()}
            </div>
            <div className="absolute bottom-3 right-3 text-xs text-slate-700 text-right leading-relaxed">
              <p>Clic + arrastrar: rotar</p>
              <p>Scroll: zoom · Clic derecho: trasladar</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
