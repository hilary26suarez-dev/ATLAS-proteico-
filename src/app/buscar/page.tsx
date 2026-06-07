import SearchClient from "@/components/SearchClient";
import atlasData from "@/data/protein_atlas.json";

export default function SearchPage() {
  const allProteins = atlasData.modules.flatMap((mod) =>
    mod.proteins.map((p) => ({
      ...p,
      moduleId: mod.id,
      moduleName: mod.name,
      moduleIcon: mod.icon,
      moduleColor: mod.id,
    }))
  );

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-white mb-4">Buscar Proteína</h1>
          <p className="text-slate-400 text-lg">
            Busca por nombre, gen, función, categoría o relevancia clínica
          </p>
        </div>
        <SearchClient proteins={allProteins} />
      </div>
    </div>
  );
}
