import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import CartaoArtigo from "@/components/CartaoArtigo";
import Revelar from "@/components/Revelar";
import Subscrever from "@/components/Subscrever";
import Footer from "@/components/Footer";
import DadosEstruturados from "@/components/DadosEstruturados";
import { artigosDoPilar } from "@/lib/artigos";
import { pilares, ordemPilares, site, ogPadrao, type PilarSlug } from "@/lib/site";

type Props = { params: Promise<{ pilar: string }> };

export function generateStaticParams() {
  return ordemPilares.map((pilar) => ({ pilar }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pilar } = await params;
  const dados = pilares[pilar as PilarSlug];
  if (!dados) return {};

  // Tema ainda sem artigos: continua acessivel por navegacao interna, mas fora
  // do indice. Uma pagina vazia indexada e' thin content e arrasta o dominio.
  const vazio = artigosDoPilar(pilar as PilarSlug).length === 0;

  return {
    title: dados.titulo,
    description: dados.descricao,
    alternates: { canonical: `/temas/${pilar}/` },
    openGraph: {
      title: dados.titulo,
      description: dados.descricao,
      type: "website",
      images: [ogPadrao],
    },
    ...(vazio ? { robots: { index: false, follow: true } } : {}),
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
      <Navbar />
      <DadosEstruturados dados={lista} />

      <main id="conteudo" className="pagina">
        <div className="bento">
          {/* Cabecalho com o gradiente do tema */}
          <div
            className="rounded-t-[14px] p-8 lg:p-14"
            style={{ background: dados.gradiente }}
          >
            <Revelar>
              <nav aria-label="Migalhas" className="mb-6 flex items-center gap-1.5 text-sm text-foreground/70">
                <Link href="/" className="transition-colors hover:text-foreground">Início</Link>
                <span>/</span>
                <Link href="/artigos/" className="transition-colors hover:text-foreground">Artigos</Link>
                <span>/</span>
                <span className="font-medium text-foreground">{dados.nome}</span>
              </nav>

              <h1 className="max-w-3xl font-display text-4xl font-black leading-[0.95] tracking-tighter text-foreground lg:text-6xl">
                {dados.titulo}
              </h1>
              <p className="mt-6 max-w-2xl font-display text-lg font-bold leading-snug text-foreground/70 lg:text-2xl">
                {dados.resumo}
              </p>
              <p className="mt-4 max-w-2xl text-sm text-foreground/70 lg:text-base">
                {dados.descricao}
              </p>
            </Revelar>
          </div>

          {artigos.length > 0 ? (
            <div className="grid grid-cols-1 gap-[2px] md:grid-cols-2 lg:grid-cols-3">
              {artigos.map((a, i) => (
                <CartaoArtigo
                  key={a.slug}
                  artigo={a}
                  variante={i % 2 === 0 ? "imagem" : "liso"}
                  atraso={i * 0.06}
                />
              ))}
            </div>
          ) : (
            <div className="tile p-12 text-center lg:p-20">
              <p className="font-display text-2xl font-black tracking-tight lg:text-3xl">
                Este tema ainda está por escrever.
              </p>
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground lg:text-base">
                Um tema só é publicado quando está completo — artigos soltos espalhados por seis
                temas não servem a ninguém.
              </p>
              <Link href="/#subscrever" className="botao-gradiente mt-8">
                Avisar-me quando sair
              </Link>
            </div>
          )}

          <div className="tile p-8 lg:p-12">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-foreground/70">
              Outros temas
            </p>
            <div className="flex flex-wrap gap-2">
              {outros.map((p) => (
                <Link
                  key={p}
                  href={`/temas/${p}/`}
                  className="rounded-full px-4 py-1.5 text-sm font-medium text-foreground/70 transition-opacity hover:opacity-80"
                  style={{ background: pilares[p].gradiente }}
                >
                  {pilares[p].nome}
                </Link>
              ))}
            </div>
          </div>

          <Subscrever />
          <Footer />
        </div>
      </main>
    </>
  );
}
