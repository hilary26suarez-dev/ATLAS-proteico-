"use client";

import dynamic from "next/dynamic";

const NPBagVisual = dynamic(() => import("./NPBagVisual"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-16">
      <div className="text-center">
        <div className="w-10 h-10 rounded-full border-t-2 animate-spin mx-auto mb-3"
          style={{ borderColor: "#f5a623" }} />
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>Cargando visualización...</p>
      </div>
    </div>
  ),
});

export default function NPBagVisualWrapper() {
  return <NPBagVisual />;
}
