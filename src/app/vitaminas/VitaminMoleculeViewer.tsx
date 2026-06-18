"use client";

import { useEffect, useRef, useState } from "react";

/* RCSB ideal SDF for each vitamin's active coenzyme form */
const VITAMIN_LIGAND: Record<string, { code: string; name: string }> = {
  b1:  { code: "TPP", name: "Tiamina pirofosfato" },
  b2:  { code: "FAD", name: "Flavín adenín dinucleótido" },
  b3:  { code: "NAD", name: "NAD⁺ (nicotinamida)" },
  b5:  { code: "COA", name: "Coenzima A" },
  b6:  { code: "PLP", name: "Piridoxal-5-fosfato" },
  b7:  { code: "BTN", name: "Biotina" },
  b9:  { code: "FOL", name: "Folato" },
  b12: { code: "B12", name: "Cobalamina (B12)" },
  c:   { code: "ASC", name: "Ascorbato (Vit C)" },
  a:   { code: "RTL", name: "Retinol (Vit A)" },
  d:   { code: "VD3", name: "Colecalciferol (Vit D3)" },
  e:   { code: "TOC", name: "α-Tocoferol (Vit E)" },
  k:   { code: "VK3", name: "Vitamina K3 (menadiona)" },
};

declare global { interface Window { NGL: any } }

interface Props { vitaminId: string; color: string }

export default function VitaminMoleculeViewer({ vitaminId, color }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const ligand = VITAMIN_LIGAND[vitaminId];

  useEffect(() => {
    if (!ligand || !containerRef.current) return;
    let cancelled = false;
    setLoading(true);
    setError(false);

    const init = () => {
      if (cancelled || !containerRef.current || !window.NGL) return;
      if (stageRef.current) { stageRef.current.dispose(); stageRef.current = null; }

      const stage = new window.NGL.Stage(containerRef.current, {
        backgroundColor: "#0A0A14",
        cameraType: "perspective",
        fog: false,
        lightIntensity: 0.9,
      });
      stageRef.current = stage;

      const onResize = () => stage.handleResize();
      window.addEventListener("resize", onResize);

      const url = `https://files.rcsb.org/ligands/download/${ligand.code}_ideal.sdf`;
      stage.loadFile(url, { ext: "sdf", defaultRepresentation: false })
        .then((comp: any) => {
          if (cancelled) return;
          comp.addRepresentation("ball+stick", {
            colorScheme: "element",
            ballScale: 0.35,
            bondScale: 0.22,
            roughness: 0.4,
            metalness: 0.1,
          });
          comp.addRepresentation("spacefill", {
            colorScheme: "element",
            opacity: 0.08,
          });
          comp.autoView(800);
          stage.setSpin([0, 1, 0], 0.008);
          setLoading(false);
        })
        .catch(() => { if (!cancelled) { setError(true); setLoading(false); } });

      return () => {
        cancelled = true;
        window.removeEventListener("resize", onResize);
        stage.dispose();
      };
    };

    if (window.NGL) {
      const cleanup = init();
      return cleanup;
    } else {
      /* NGL should already be preloaded via <link rel="preload"> in layout */
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/ngl@2.3.1/dist/ngl.js";
      script.onload = () => { if (!cancelled) init(); };
      document.head.appendChild(script);
    }
    return () => { cancelled = true; if (stageRef.current) { stageRef.current.dispose(); stageRef.current = null; } };
  }, [vitaminId]);

  if (!ligand) return null;

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${color}25` }}>
      <div className="flex items-center justify-between px-3 py-2"
        style={{ background: `${color}08`, borderBottom: `1px solid ${color}15` }}>
        <span className="text-xs font-mono font-bold" style={{ color }}>
          ◈ 3D — {ligand.name}
        </span>
        <span className="text-xs font-mono" style={{ color: "#6B7BA0" }}>
          RCSB · {ligand.code}
        </span>
      </div>
      <div className="relative" style={{ height: 210 }}>
        <div ref={containerRef} className="w-full h-full" style={{ background: "#0A0A14" }} />
        {loading && !error && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: "#0A0A14" }}>
            <div className="text-center">
              <div className="w-8 h-8 rounded-full border-t-2 animate-spin mx-auto mb-2" style={{ borderColor: color }} />
              <p className="text-xs font-mono" style={{ color: "#6B7BA0" }}>Cargando molécula...</p>
            </div>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: "#0A0A14" }}>
            <div className="text-center px-4">
              <p className="text-2xl mb-2">⚗️</p>
              <p className="text-xs font-mono text-center" style={{ color: "#6B7BA0" }}>
                Estructura no disponible localmente.<br />
                <a href={`https://www.rcsb.org/ligand/${ligand.code}`} target="_blank" rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity" style={{ color }}>
                  Ver {ligand.code} en RCSB ↗
                </a>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
