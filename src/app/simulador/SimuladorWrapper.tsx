"use client";

import dynamic from "next/dynamic";

const SimuladorClient = dynamic(() => import("./SimuladorClient"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-24">
      <div className="text-center">
        <div className="w-14 h-14 rounded-full border-t-2 animate-spin mx-auto mb-4"
          style={{ borderColor: "#f5a623" }} />
        <p className="text-sm font-mono" style={{ color: "var(--text-muted)" }}>
          Inicializando motor de simulación...
        </p>
      </div>
    </div>
  ),
});

export default function SimuladorWrapper() {
  return <SimuladorClient />;
}
