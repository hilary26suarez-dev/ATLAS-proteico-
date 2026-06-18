"use client";

interface Props {
  mechanism: string;
  color: string;
}

function parseSteps(mechanism: string): string[] {
  if (mechanism.includes(" → ")) {
    return mechanism.replace(/\.$/, "").split(" → ").filter(Boolean);
  }
  return mechanism.split(/\.\s+/).filter((s) => s.trim().length > 3);
}

export default function MechanismSteps({ mechanism, color }: Props) {
  const steps = parseSteps(mechanism);

  const isPathway = mechanism.includes(" → ");

  return (
    <div className="rounded-2xl p-6"
      style={{ background: "var(--bg-raised)", border: `1px solid ${color}18` }}>
      <div className="flex items-center gap-2 mb-5">
        <span className="text-lg">⚡</span>
        <h3 className="font-bold text-base" style={{ color }}>
          {isPathway ? "Vía de señalización" : "Mecanismo molecular"}
        </h3>
      </div>

      {isPathway ? (
        /* Cascada con flechas horizontales → verticales en mobile */
        <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-2">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="px-3 py-2 rounded-lg text-xs font-medium text-center"
                style={{
                  background: i === 0 ? `${color}18` : "var(--bg-card)",
                  border: `1px solid ${i === 0 ? color + "40" : "rgba(255,255,255,0.06)"}`,
                  color: i === 0 ? color : "var(--text-muted)",
                  fontFamily: "var(--font-mono, monospace)",
                  minWidth: "80px",
                }}>
                {step}
              </div>
              {i < steps.length - 1 && (
                <svg className="w-3 h-3 flex-shrink-0 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  style={{ color: "#6B7BA0" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* Pasos numerados */
        <ol className="space-y-3">
          {steps.map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5"
                style={{ background: `${color}18`, color, border: `1px solid ${color}30`, fontFamily: "var(--font-mono, monospace)" }}>
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {step.replace(/\.$/, "")}
              </p>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
