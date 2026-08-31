import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import CartaoArtigo from "@/components/CartaoArtigo";
import Subscrever from "@/components/Subscrever";
import DadosEstruturados from "@/components/DadosEstruturados";
import { artigosDoPilar } from "@/lib/artigos";
import { pilares, ordemPilares, site, type PilarSlug } from "@/lib/site";

type Props = { params: Promise<{ pilar: string }> };

export function generateStaticParams() {
  return ordemPilares.map((pilar) => ({ pilar }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pilar } = await params;
  const dados = pilares[pilar as PilarSlug];
  if (!dados) return {};
  return {
    title: dados.titulo,
    description: dados.descricao,
    alternates: { canonical: `/temas/${pilar}/` },
    openGraph: { title: dados.titulo, description: dados.descricao, type: "website" },
  };
}

export default async function Pagina({ params }: Props) {
  const { pilar } = await params;
  const slug = pilar as PilarSlug;
  const dados = pilares[slug];
  if (!dados) notFound();

  const artigos = artigosDoPilar(slug);
  const outros = ordemPilares.filter((p) => p !== slug);

  const lista = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: dados.titulo,
    description: dados.descricao,
    url: `${site.dominio}/temas/${slug}/`,
    inLanguage: "pt-PT",
    isPartOf: { "@type": "WebSite", name: site.nome, url: site.dominio },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: artigos.map((a, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${site.dominio}/artigos/${a.slug}/`,
        name: a.titulo,
      })),
    },
  };

  return (
    <>
      <DadosEstruturados dados={lista} />

      <section className="envolve py-16 sm:py-20">
        <nav aria-label="Migalhas" className="text-[13px] text-texto-fraco">
          <Link href="/" className="transition hover:text-ambar-300">Início</Link>
          <span className="px-2">/</span>
          <Link href="/artigos/" className="transition hover:text-ambar-300">Artigos</Link>
          <span className="px-2">/</span>
          <span className="text-texto-suave">{dados.nome}</span>
        </nav>

        <h1 className="mt-6 max-w-3xl font-serif text-[36px] font-semibold leading-tight sm:text-[50px]">
          {dados.titulo}
        </h1>
        <p className="mt-5 max-w-2xl font-serif text-[20px] leading-relaxed text-texto-suave sm:text-[23px]">
          {dados.resumo}
        </p>
        <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-texto-fraco">
          {dados.descricao}
        </p>

        <div className="mt-12">
          {artigos.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {artigos.map((a) => (
                <CartaoArtigo key={a.slug} artigo={a} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/12 p-8 text-center">
              <p className="font-serif text-[19px]">Este tema ainda está por escrever.</p>
              <p className="mx-auto mt-2 max-w-md text-[15px] leading-relaxed text-texto-suave">
                Um tema só é publicado quando está completo — artigos soltos espalhados por seis
                temas não servem a ninguém.
              </p>
              <Link href="/#newsletter" className="botao-secundario mt-6">
                Avisar-me quando sair
              </Link>
            </div>
          )}
        </div>

        <div className="mt-16 border-t border-white/8 pt-8">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-texto-fraco">
            Outros temas
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {outros.map((p) => (
              <Link
                key={p}
                href={`/temas/${p}/`}
                className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-[13.5px] text-texto-suave transition hover:border-ambar-400/40 hover:text-ambar-300"
              >
                {pilares[p].nome}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Subscrever />
    </>
  );
}
