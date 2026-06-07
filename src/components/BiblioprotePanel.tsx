"use client";

import { useEffect, useState } from "react";

interface ArticleInfo {
  title: string;
  abstract: string | null;
  doi: string | null;
  pubmedId: string;
}

interface Props {
  pubmedId?: string;
}

export default function BiblioprotePanel({ pubmedId }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [article, setArticle] = useState<ArticleInfo | null>(null);

  useEffect(() => {
    if (!pubmedId) return;
    let mounted = true;
    setLoading(true);
    setError(null);

    const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${encodeURIComponent(
      pubmedId
    )}&retmode=xml`;

    fetch(url)
      .then((res) => res.text())
      .then((xmlText) => {
        if (!mounted) return;
        try {
          const parser = new DOMParser();
          const doc = parser.parseFromString(xmlText, "application/xml");
          const articleEl = doc.querySelector("PubmedArticle Article");
          if (!articleEl) {
            setError("No se encontró información del artículo.");
            setLoading(false);
            return;
          }

          const titleEl = articleEl.querySelector("ArticleTitle");
          const abstractEl = articleEl.querySelector("AbstractText");
          const idEls = doc.querySelectorAll("ArticleIdList ArticleId");
          let doi: string | null = null;
          idEls.forEach((idEl) => {
            if ((idEl as Element).getAttribute("IdType") === "doi") {
              doi = idEl.textContent?.trim() ?? null;
            }
          });

          const info: ArticleInfo = {
            title: titleEl?.textContent?.trim() ?? `Artículo ${pubmedId}`,
            abstract: abstractEl?.textContent?.trim() ?? null,
            doi,
            pubmedId: String(pubmedId),
          };

          setArticle(info);
        } catch (e) {
          console.error(e);
          setError("Error al parsear respuesta de PubMed.");
        }
      })
      .catch((e) => {
        console.error(e);
        setError("No se pudo obtener datos desde PubMed.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [pubmedId]);

  if (!pubmedId) return null;

  return (
    <div className="glass rounded-2xl border border-slate-800/50 p-6">
      <h3 className="text-base font-bold text-slate-200 mb-3">📚 Biblioprote</h3>
      {loading && <p className="text-slate-400 text-sm">Obteniendo referencia desde PubMed...</p>}
      {error && <p className="text-amber-400 text-sm">{error}</p>}

      {article && (
        <div className="space-y-3">
          <a
            href={`https://pubmed.ncbi.nlm.nih.gov/${article.pubmedId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-cyan-400 hover:underline"
          >
            {article.title}
          </a>

          {article.abstract ? (
            <p className="text-sm text-slate-300 leading-relaxed">{article.abstract.slice(0, 600)}{article.abstract.length > 600 ? '…' : ''}</p>
          ) : (
            <p className="text-sm text-slate-400">Resumen no disponible.</p>
          )}

          <div className="flex items-center gap-3">
            {article.doi ? (
              <a
                href={`https://doi.org/${article.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-amber-400 hover:underline"
              >
                DOI: {article.doi}
              </a>
            ) : (
              <span className="text-xs text-slate-500">DOI no disponible</span>
            )}

            <a
              href={`https://pubmed.ncbi.nlm.nih.gov/${article.pubmedId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-400 hover:underline ml-auto"
            >
              Ver en PubMed ↗
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
