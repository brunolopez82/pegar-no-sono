import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import CartaoArtigo from "@/components/CartaoArtigo";
import Revelar from "@/components/Revelar";
import Pesquisa from "@/components/Pesquisa";
import Subscrever from "@/components/Subscrever";
import Footer from "@/components/Footer";
import { todosOsArtigos } from "@/lib/artigos";
import { pilares, ordemPilares, ogPadrao } from "@/lib/site";

export const metadata: Metadata = {
  title: "Todos os artigos",
  description:
    "Todos os artigos do Pegar no Sono, organizados por tema: respiração, rotina noturna, ambiente do quarto, ansiedade, ritmo circadiano e medição do sono.",
  alternates: { canonical: "/artigos/" },
  openGraph: {
    type: "website",
    title: "Todos os artigos",
    description:
      "Todos os artigos do Pegar no Sono, organizados por tema: respiração, rotina noturna, ambiente do quarto, ansiedade, ritmo circadiano e medição do sono.",
    images: [ogPadrao],
  },
};

export default function Pagina() {
  const artigos = todosOsArtigos();
  const comArtigos = ordemPilares.filter((p) => artigos.some((a) => a.pilar === p));

  return (
    <>
      <Navbar />

      <main id="conteudo" className="pagina">
        <div className="bento">
          <div className="tile rounded-t-[14px] p-8 lg:p-14">
            <Revelar>
              <span className="etiqueta">Arquivo</span>
              <h1 className="font-display text-5xl font-black leading-[0.95] tracking-tighter text-foreground lg:text-7xl">
                Todos os artigos
              </h1>
              <p className="mt-6 max-w-lg text-base text-muted-foreground lg:text-lg">
                {artigos.length === 1 ? "1 artigo" : `${artigos.length} artigos`}, agrupados por
                tema. Dentro de cada tema, a ordem de leitura é de cima para baixo.
              </p>

              <div className="mt-8">
                <Pesquisa />
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                {comArtigos.map((p) => (
                  <Link
                    key={p}
                    href={`/temas/${p}/`}
                    className="rounded-full border border-black/10 px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                  >
                    {pilares[p].nome}
                  </Link>
                ))}
              </div>
            </Revelar>
          </div>

          {comArtigos.map((p) => {
            const doPilar = artigos.filter((a) => a.pilar === p);
            return (
              <div key={p} className="flex flex-col gap-[2px]">
                <div
                  className="flex flex-wrap items-baseline justify-between gap-3 px-8 py-6 lg:px-14"
                  style={{ background: pilares[p].gradiente }}
                >
                  <h2 className="font-display text-2xl font-black tracking-tight text-foreground lg:text-3xl">
                    {pilares[p].nome}
                  </h2>
                  <Link
                    href={`/temas/${p}/`}
                    className="text-sm font-semibold text-foreground/60 transition-colors hover:text-foreground"
                  >
                    Ver o tema completo →
                  </Link>
                </div>

                <div className="grid grid-cols-1 gap-[2px] md:grid-cols-2 lg:grid-cols-3">
                  {doPilar.map((a, i) => (
                    <CartaoArtigo
                      key={a.slug}
                      artigo={a}
                      variante={i % 3 === 1 ? "imagem" : "liso"}
                      atraso={i * 0.06}
                    />
                  ))}
                </div>
              </div>
            );
          })}

          <Subscrever />
          <Footer />
        </div>
      </main>
    </>
  );
}
