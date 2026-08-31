import type { Metadata } from "next";
import Link from "next/link";
import CartaoArtigo from "@/components/CartaoArtigo";
import Subscrever from "@/components/Subscrever";
import { todosOsArtigos } from "@/lib/artigos";
import { pilares, ordemPilares, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Todos os artigos",
  description:
    "Todos os artigos do Pegar no Sono, organizados por tema: respiração, rotina noturna, ambiente do quarto, ansiedade, ritmo circadiano e medição do sono.",
  alternates: { canonical: "/artigos/" },
};

export default function Pagina() {
  const artigos = todosOsArtigos();
  const comArtigos = ordemPilares.filter((p) => artigos.some((a) => a.pilar === p));

  return (
    <>
      <section className="envolve py-16 sm:py-20">
        <p className="etiqueta">Arquivo</p>
        <h1 className="mt-5 max-w-2xl font-serif text-[36px] font-semibold leading-tight sm:text-[48px]">
          Todos os artigos
        </h1>
        <p className="mt-4 max-w-xl text-[16.5px] leading-relaxed text-texto-suave">
          {artigos.length === 1 ? "1 artigo" : `${artigos.length} artigos`}, agrupados por tema.
          Dentro de cada tema, a ordem de leitura é de cima para baixo.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {comArtigos.map((p) => (
            <a
              key={p}
              href={`#${p}`}
              className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-[13.5px] text-texto-suave transition hover:border-ambar-400/40 hover:text-ambar-300"
            >
              {pilares[p].nome}
            </a>
          ))}
        </div>

        <div className="mt-14 space-y-16">
          {comArtigos.map((p) => (
            <div key={p} id={p} className="scroll-mt-24">
              <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3 border-b border-white/8 pb-4">
                <h2 className="font-serif text-[26px] font-semibold">{pilares[p].nome}</h2>
                <Link
                  href={`/temas/${p}/`}
                  className="text-[14px] text-texto-fraco transition hover:text-ambar-300"
                >
                  Ver o tema completo →
                </Link>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {artigos
                  .filter((a) => a.pilar === p)
                  .map((a) => (
                    <CartaoArtigo key={a.slug} artigo={a} />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Subscrever />
    </>
  );
}
