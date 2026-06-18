"use client";

import dynamic from "next/dynamic";

const OsmolarityCalc = dynamic(() => import("./OsmolarityCalc"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="w-10 h-10 rounded-full border-t-2 animate-spin mx-auto mb-3"
          style={{ borderColor: "var(--teal)" }} />
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>Cargando calculadora...</p>
      </div>
    </div>
  ),
});

export default function OsmolarityCalcWrapper() {
  return <OsmolarityCalc />;
}
