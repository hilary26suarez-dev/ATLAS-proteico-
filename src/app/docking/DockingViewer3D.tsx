"use client";

import { useEffect, useRef, useState } from "react";

declare global { interface Window { NGL: any; } }

interface Props {
  pdbId: string;
  showLigands?: boolean;
}

export default function DockingViewer3D({ pdbId, showLigands = true }: Props) {
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
      } catch { return; }
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

          // Proteína: cartoon semi-transparente
          comp.addRepresentation("cartoon", {
            colorScheme: "chainname",
            quality: "medium",
            opacity: showLigands ? 0.72 : 1.0,
          });

          if (showLigands) {
            // Ligandos / heteroátomos: ball+stick en amarillo neón
            comp.addRepresentation("ball+stick", {
              sele: "heteroatom and not water",
              colorScheme: "element",
              aspectRatio: 2.0,
            });
            // Superficie alrededor del sitio de unión
            comp.addRepresentation("surface", {
              sele: "heteroatom and not water",
              colorScheme: "element",
              opacity: 0.35,
              useWorker: false,
            });
          }

          comp.autoView();
          setLoading(false);
          setReady(true);
          requestAnimationFrame(() => {
            if (disposed) return;
            stage.handleResize();
            comp.autoView();
            stage.setSpin([0, 1, 0], 0.004);
          });
        })
        .catch(() => { if (!disposed) setLoading(false); });

      return () => {
        window.removeEventListener("resize", onResize);
        ro.disconnect();
      };
    }

    let cleanup: (() => void) | undefined;
    if (window.NGL) {
      cleanup = mountStage() ?? undefined;
    } else {
      const s = document.createElement("script");
      s.src    = "https://cdn.jsdelivr.net/npm/ngl@2.3.1/dist/ngl.js";
      s.onload = () => { if (!disposed) cleanup = mountStage() ?? undefined; };
      s.onerror = () => { if (!disposed) setLoading(false); };
      document.head.appendChild(s);
    }

    return () => {
      disposed = true;
      cleanup?.();
      try { stageRef.current?.dispose(); } catch { /* ignore */ }
      stageRef.current = null;
    };
  }, [pdbId, showLigands]);

  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10"
          style={{ background: "rgba(10,10,15,0.85)" }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            border: "2px solid rgba(0,255,136,0.12)",
            borderTopColor: "var(--teal)",
            animation: "hero-spin 0.9s linear infinite",
          }} />
          <span style={{
            fontFamily: "var(--font-mono, monospace)", fontSize: "0.65rem",
            color: "var(--teal)", letterSpacing: "0.1em", opacity: 0.7,
          }}>
            CARGANDO COMPLEJO...
          </span>
        </div>
      )}
      {ready && showLigands && (
        <div className="absolute bottom-3 left-3 flex items-center gap-2 z-10" style={{
          fontFamily: "var(--font-mono, monospace)", fontSize: "0.65rem", color: "var(--text-muted)",
        }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#FFD700", display: "inline-block" }} />
          Ligando · Ball&amp;Stick
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--teal)", display: "inline-block", marginLeft: "0.5rem" }} />
          Proteína · Cartoon
        </div>
      )}
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}
