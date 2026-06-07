import { NextResponse } from "next/server";

// Human Protein Atlas API proxy — avoids CORS in the browser
// Docs: https://www.proteinatlas.org/about/download
// Columns: g=gene, eg=ensembl, up=uniprot, t=tissue, sc=subcell,
//          cc=cancer, d=disease, mp=mouse phenotype

const HPA_COLS = [
  "g",          // Gene name
  "eg",         // Ensembl Gene ID
  "up",         // UniProt accession
  "pe",         // Protein existence (confidence)
  "t",          // Tissue expression (HPA)
  "t2",         // Tissue expression (consensus)
  "sc",         // Subcellular location
  "d",          // Disease relevance
  "ca",         // Cancer categories
  "rnats",      // RNA tissue specificity
].join(",");

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ gene: string }> }
) {
  const { gene } = await params;

  if (!gene || gene.length < 2 || gene.length > 20) {
    return NextResponse.json({ error: "Invalid gene name" }, { status: 400 });
  }

  const url = `https://www.proteinatlas.org/api/search_download.php?search=${encodeURIComponent(gene)}&format=json&columns=${HPA_COLS}&compress=no`;

  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 86400 }, // cache 24h
    });

    if (!res.ok) {
      return NextResponse.json({ error: `HPA returned ${res.status}` }, { status: 502 });
    }

    const data = await res.json();

    // HPA returns an array; find the exact gene match (case-insensitive)
    const geneUpper = gene.toUpperCase();
    const exact = Array.isArray(data)
      ? data.find((d: Record<string, string>) =>
          d["Gene"]?.toUpperCase() === geneUpper ||
          d["Gene synonym"]?.toUpperCase() === geneUpper
        ) ?? data[0]
      : data;

    if (!exact) {
      return NextResponse.json({ error: "Gene not found in HPA" }, { status: 404 });
    }

    // Normalize field names to clean camelCase
    const ensemblId: string = exact["Ensembl"] ?? exact["eg"] ?? "";
    const normalized = {
      gene: exact["Gene"] ?? gene,
      ensemblId,
      uniprotId: exact["UniProt"] ?? "",
      proteinExistence: exact["Protein existence"] ?? "",
      // Tissue expression
      tissueExpression: exact["Tissue expression (HPA)"] ?? exact["RNA tissue category"] ?? "",
      tissueSpecificity: exact["RNA tissue specificity"] ?? "",
      tissueConsensus: exact["Tissue expression (consensus dataset)"] ?? "",
      // Subcellular
      subcellularLocation: exact["Subcellular location"] ?? "",
      // Disease
      disease: exact["Disease involvement"] ?? "",
      cancer: exact["Prognostic cancer markers"] ?? "",
      // Direct links
      hpaUrl: ensemblId
        ? `https://www.proteinatlas.org/${ensemblId}-${exact["Gene"] ?? gene}/tissue`
        : `https://www.proteinatlas.org/search/${gene}`,
      subcellUrl: ensemblId
        ? `https://www.proteinatlas.org/${ensemblId}-${exact["Gene"] ?? gene}/subcellular`
        : `https://www.proteinatlas.org/search/${gene}`,
      diseaseUrl: ensemblId
        ? `https://www.proteinatlas.org/${ensemblId}-${exact["Gene"] ?? gene}/pathology`
        : `https://www.proteinatlas.org/search/${gene}`,
    };

    return NextResponse.json(normalized, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600",
      },
    });
  } catch (err) {
    console.error("HPA API error:", err);
    return NextResponse.json({ error: "Failed to fetch from Human Protein Atlas" }, { status: 502 });
  }
}
