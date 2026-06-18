"use client";

import dynamic from "next/dynamic";

const VitaminMoleculeViewer = dynamic(() => import("./VitaminMoleculeViewer"), {
  ssr: false,
  loading: () => (
    <div className="rounded-xl overflow-hidden flex items-center justify-center"
      style={{ height: 210, background: "#0A0A14", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="w-6 h-6 rounded-full border-t-2 border-cyan-500 animate-spin" />
    </div>
  ),
});

interface Props { vitaminId: string; color: string }

export default function VitaminMoleculeViewerWrapper({ vitaminId, color }: Props) {
  return <VitaminMoleculeViewer vitaminId={vitaminId} color={color} />;
}
