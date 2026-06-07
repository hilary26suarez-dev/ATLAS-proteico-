import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-20 px-4">
      <div className="text-center max-w-lg">
        <div className="text-8xl mb-6">🧬</div>
        <h1 className="text-5xl font-black gradient-text-cyan mb-4">404</h1>
        <h2 className="text-2xl font-bold text-white mb-3">Estructura no encontrada</h2>
        <p className="text-slate-400 mb-8">
          Esta proteína no está en nuestra base de datos... todavía.
          El atlas crece constantemente.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:opacity-90 transition-opacity">
            Ir al inicio
          </Link>
          <Link href="/modules" className="px-6 py-3 rounded-xl border border-slate-700 text-slate-300 font-semibold hover:border-slate-500 transition-colors">
            Ver módulos
          </Link>
        </div>
      </div>
    </div>
  );
}
