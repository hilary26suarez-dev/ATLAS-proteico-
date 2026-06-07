"use client";

interface Props {
  mode: "student" | "researcher";
  onChange: (mode: "student" | "researcher") => void;
}

export default function ModeToggle({ mode, onChange }: Props) {
  return (
    <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800">
      <button
        onClick={() => onChange("student")}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
          mode === "student"
            ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm"
            : "text-slate-500 hover:text-slate-300"
        }`}
      >
        <span className="text-base">🎓</span>
        <span>Estudiante</span>
      </button>
      <button
        onClick={() => onChange("researcher")}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
          mode === "researcher"
            ? "bg-violet-500/15 text-violet-400 border border-violet-500/30 shadow-sm"
            : "text-slate-500 hover:text-slate-300"
        }`}
      >
        <span className="text-base">🔬</span>
        <span>Investigador</span>
      </button>
    </div>
  );
}
