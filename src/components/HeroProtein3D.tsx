"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window { NGL: any; }
}

interface Props {
  pdbId?: string;
  label?: string;
}

export default function HeroProtein3D({
  pdbId = "1AO6",
  label = "PDB: 1AO6 · Albúmina sérica humana",
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef     = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [ready,   setReady]   = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let disposed = false;

    function mountStage() {
      if (disposed || !containerRef.current) return;

      let stage: any;
      try {
        stage = new window.NGL.Stage(containerRef.current, {
          backgroundColor: "rgba(0,0,0,0)",
          quality: "medium",
        });
      } catch {
        return;
      }
      stageRef.current = stage;

      const onResize = () => stage.handleResize();
      window.addEventListener("resize", onResize, { passive: true });

      const ro = new ResizeObserver(() => stage.handleResize());
      if (containerRef.current) ro.observe(containerRef.current);

      stage
        .loadFile(`https://files.rcsb.org/download/${pdbId.toUpperCase()}.pdb`, {
          defaultRepresentation: false,
        })
        .then((comp: any) => {
          if (disposed) return;
          comp.addRepresentation("cartoon", {
            colorScheme: "chainname",
            quality: "medium",
          });
          comp.autoView();
          setLoading(false);
          setReady(true);
          requestAnimationFrame(() => {
            if (disposed) return;
            stage.handleResize();
            comp.autoView();
            stage.setSpin([0, 1, 0], 0.007);
          });
        })
        .catch(() => {
          if (!disposed) setLoading(false);
        });

      return () => {
        window.removeEventListener("resize", onResize);
        ro.disconnect();
      };
    }

    let cleanupResize: (() => void) | undefined;

    if (window.NGL) {
      cleanupResize = mountStage() ?? undefined;
    } else {
      const s = document.createElement("script");
      s.src    = "https://cdn.jsdelivr.net/npm/ngl@2.3.1/dist/ngl.js";
      s.onload = () => { if (!disposed) cleanupResize = mountStage() ?? undefined; };
      s.onerror = () => { if (!disposed) setLoading(false); };
      document.head.appendChild(s);
    }

    return () => {
      disposed = true;
      cleanupResize?.();
      try { stageRef.current?.dispose(); } catch { /* ignore */ }
      stageRef.current = null;
    };
  }, [pdbId]);

  return (
    <div className="hero-3d-wrapper">
      <div className={`hero-3d-glow${ready ? " hero-3d-glow--active" : ""}`} />
      <div className="hero-3d-ring" />

      <div className="hero-3d-container" aria-label={`Proteína 3D interactiva: ${label}`}>
        {loading && (
          <div className="hero-3d-loading">
            <div className="hero-3d-spinner" />
            <span className="hero-3d-loading-text">CARGANDO ESTRUCTURA...</span>
          </div>
        )}
        <div ref={containerRef} className="w-full h-full" />
      </div>

      <div className="hero-3d-label">
        <span className="hero-3d-label-dot" />
        {label}
      </div>
    </div>
  );
}
