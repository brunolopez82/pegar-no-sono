"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Entrada = {
  slug: string;
  titulo: string;
  descricao: string;
  pilar: string;
  minutos: number;
};

/** Sem acentos e em minusculas: "respiracao" tem de encontrar "Respiração". */
function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

export default function Pesquisa() {
  const [indice, setIndice] = useState<Entrada[] | null>(null);
  const [termo, setTermo] = useState("");

  // O indice so' e' pedido quando alguem comeca mesmo a escrever: quem nunca
  // usa a pesquisa nao paga o download.
  useEffect(() => {
    if (!termo || indice) return;
    let cancelado = false;
    fetch("/indice-pesquisa.json")
      .then((r) => r.json())
      .then((d: Entrada[]) => {
        if (!cancelado) setIndice(d);
      })
      .catch(() => {
        if (!cancelado) setIndice([]);
      });
    return () => {
      cancelado = true;
    };
  }, [termo, indice]);

  const resultados = useMemo(() => {
    const q = normalizar(termo.trim());
    if (q.length < 2 || !indice) return null;
    return indice.filter((e) =>
      normalizar(`${e.titulo} ${e.descricao} ${e.pilar}`).includes(q),
    );
  }, [termo, indice]);

  return (
    <div>
      <label htmlFor="pesquisa" className="sr-only">
        Pesquisar nos artigos
      </label>
      <input
        id="pesquisa"
        type="search"
        value={termo}
        onChange={(e) => setTermo(e.target.value)}
        placeholder="Pesquisar — respiração, ansiedade, 4-7-8…"
        className="campo max-w-md"
        autoComplete="off"
      />

      {resultados && (
        <div className="mt-5" aria-live="polite">
          {resultados.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nada encontrado para <strong className="text-foreground">{termo}</strong>. O site
              ainda é pequeno — talvez esse artigo esteja por escrever.
            </p>
          ) : (
            <>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-foreground/40">
                {resultados.length === 1 ? "1 resultado" : `${resultados.length} resultados`}
              </p>
              <ul className="divide-y divide-border border-y border-border">
                {resultados.map((r) => (
                  <li key={r.slug}>
                    <Link
                      href={`/artigos/${r.slug}/`}
                      className="group flex flex-col gap-1 py-4 transition-opacity hover:opacity-70"
                    >
                      <span className="flex items-baseline gap-3">
                        <span className="font-display text-base font-black text-foreground">
                          {r.titulo}
                        </span>
                        <span className="shrink-0 text-xs text-foreground/40">
                          {r.pilar} · {r.minutos} min
                        </span>
                      </span>
                      <span className="text-sm text-muted-foreground">{r.descricao}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}
