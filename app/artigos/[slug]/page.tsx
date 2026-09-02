import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import CartaoArtigo from "@/components/CartaoArtigo";
import Revelar from "@/components/Revelar";
import Subscrever from "@/components/Subscrever";
import Footer from "@/components/Footer";
import DadosEstruturados from "@/components/DadosEstruturados";
import { AvatarAutor } from "@/components/SobreAutor";
import ImagemArtigo from "@/components/ImagemArtigo";
import Figura from "@/components/Figura";
import Hipnograma from "@/components/diagramas/Hipnograma";

/**
 * Componentes que um artigo pode usar no corpo em MDX.
 *
  * Sem isto, um Hipnograma escrito no .mdx e uma etiqueta que nao renderiza. Um
 * diagrama novo entra aqui e fica disponivel a todos os artigos.
 */
const componentesMDX = { Figura, Hipnograma };
import { todosOsArtigos, artigoPorSlug, relacionados, dataExtenso, metaDescricao } from "@/lib/artigos";
import { site, pilares, momentos, ogPadrao } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

/** Uma pasta por artigo no build. E' isto que torna o site estatico. */
export function generateStaticParams() {
  return todosOsArtigos().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = artigoPorSlug(slug);
  if (!a) return {};

  // Preferir a copia local: nao depende do Unsplash continuar a servir a foto.
  const capa = a.imagemLocal ?? a.imagem;

  const meta = metaDescricao(a);

  return {
    title: a.titulo,
    description: meta,
    alternates: { canonical: `/artigos/${slug}/` },
    openGraph: {
      type: "article",
      locale: "pt_PT",
      title: a.titulo,
      description: meta,
      publishedTime: a.data,
      modifiedTime: a.atualizado ?? a.data,
      authors: [site.autor.nome],
      url: `${site.dominio}/artigos/${slug}/`,
      images: capa ? [{ url: capa, alt: a.imagemAlt ?? a.titulo }] : [ogPadrao],
    },
    twitter: {
      card: "summary_large_image",
      images: [capa ?? ogPadrao.url],
    },
  };
}

export default async function Pagina({ params }: Props) {
  const { slug } = await params;
  const a = artigoPorSlug(slug);
  if (!a) notFound();

  const pilar = pilares[a.pilar];
  const url = `${site.dominio}/artigos/${slug}/`;
  const proximos = relacionados(a);

  // Dados estruturados montados a partir do frontmatter: sem passos nao ha HowTo,
  // sem faq nao ha FAQPage. Nada e' inventado aqui.
  const grafo: Record<string, unknown>[] = [
    {
      "@type": "Article",
      "@id": `${url}#artigo`,
      headline: a.titulo,
      description: a.descricao,
      abstract: a.resposta,
      inLanguage: "pt-PT",
      datePublished: a.data,
      dateModified: a.atualizado ?? a.data,
      wordCount: a.palavras,
      articleSection: pilar.nome,
      author: { "@id": `${site.dominio}/#autor` },
      publisher: { "@id": `${site.dominio}/#autor` },
      mainEntityOfPage: url,
      isPartOf: { "@type": "WebSite", name: site.nome, url: site.dominio },
      // O schema.org exige URL absoluto em `image`. A capa local vem como
      // caminho relativo ("/imagens/..."), por isso tem de levar o dominio a
      // frente — senao os validadores nao a resolvem.
      ...(() => {
        const capa = a.imagemLocal ?? a.imagem;
        if (!capa) return {};
        return { image: capa.startsWith("http") ? capa : `${site.dominio}${capa}` };
      })(),
      ...(a.fontes?.length ? { citation: a.fontes.map((f) => f.titulo) } : {}),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: site.dominio },
        {
          "@type": "ListItem",
          position: 2,
          name: pilar.nome,
          item: `${site.dominio}/temas/${a.pilar}/`,
        },
        { "@type": "ListItem", position: 3, name: a.titulo, item: url },
      ],
    },
  ];

  if (a.passos?.length) {
    grafo.push({
      "@type": "HowTo",
      name: a.titulo,
      description: a.resposta,
      inLanguage: "pt-PT",
      step: a.passos.map((p, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: p.nome,
        text: p.texto,
      })),
    });
  }

  if (a.faq?.length) {
    grafo.push({
      "@type": "FAQPage",
      mainEntity: a.faq.map((f) => ({
        "@type": "Question",
        name: f.pergunta,
        acceptedAnswer: { "@type": "Answer", text: f.resposta },
      })),
    });
  }

  return (
    <>
      <DadosEstruturados dados={{ "@context": "https://schema.org", "@graph": grafo }} />

      {/* Cabecalho fixo com migalhas */}
      <header className="sticky top-0 z-50 flex h-[72px] items-center bg-background/80 px-5 backdrop-blur-xl lg:h-[100px] lg:px-10">
        <div className="flex w-full items-center justify-between gap-4">
          <nav aria-label="Migalhas" className="flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-foreground">Início</Link>
            <span>/</span>
            <Link href={`/temas/${a.pilar}/`} className="transition-colors hover:text-foreground">
              {pilar.nome}
            </Link>
          </nav>
          <Link
            href="/"
            className="shrink-0 font-display text-lg font-black tracking-tight text-foreground lg:text-xl"
          >
            {site.nome}
          </Link>
        </div>
      </header>

      <main id="conteudo" className="mx-auto max-w-artigo px-5 pb-5 lg:px-10 lg:pb-10">
        <article className="bento">
          {/* Capa */}
          {a.imagem ? (
            <div className="relative overflow-hidden rounded-t-[14px]">
              <ImagemArtigo
                artigo={a}
                prioridade
                sizes="(max-width: 860px) 100vw, 860px"
                className="h-[50vh] w-full object-cover lg:h-[62vh]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8 lg:p-14">
                <span className="mb-3 block text-xs font-semibold uppercase tracking-widest text-white/60">
                  {pilar.nome} · {a.minutos} min de leitura
                </span>
                <h1 className="max-w-4xl font-display text-4xl font-black leading-[0.95] tracking-tighter text-white lg:text-6xl">
                  {a.titulo}
                </h1>
              </div>
            </div>
          ) : (
            <div
              className="rounded-t-[14px] p-8 lg:p-14"
              style={{ background: pilar.gradiente }}
            >
              <span className="etiqueta">
                {pilar.nome} · {a.minutos} min de leitura
              </span>
              <h1 className="max-w-4xl font-display text-4xl font-black leading-[0.95] tracking-tighter text-foreground lg:text-6xl">
                {a.titulo}
              </h1>
            </div>
          )}

          {/* Barra do autor */}
          <div className="tile flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center lg:px-14 lg:py-6">
            <div className="flex items-center gap-4">
              <AvatarAutor />
              <div>
                <p className="text-sm font-bold text-foreground">{site.autor.nome}</p>
                <p className="text-xs text-muted-foreground">
                  <time dateTime={a.data}>{dataExtenso(a.data)}</time>
                  {a.atualizado && a.atualizado !== a.data && (
                    <> · atualizado a {dataExtenso(a.atualizado)}</>
                  )}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {/* Quando se faz. E' este eixo que permite montar um protocolo
                  por ordem de relogio a partir dos artigos que existem. */}
              {a.momento && (
                <span className="rounded-full border border-black/15 px-4 py-1.5 text-xs font-semibold text-foreground/70">
                  {momentos[a.momento].nome}
                </span>
              )}
              <Link
                href={`/temas/${a.pilar}/`}
                className="rounded-full px-4 py-1.5 text-xs font-semibold text-foreground/70 transition-opacity hover:opacity-80"
                style={{ background: pilar.gradiente }}
              >
                {pilar.nome}
              </Link>
            </div>
          </div>

          {/* Resposta direta: o bloco que um motor de IA cita inteiro */}
          <div className="p-8 lg:px-14 lg:py-10" style={{ background: "var(--grad-cta)" }}>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-foreground/70">
              Resposta curta
            </p>
            <p className="font-display text-xl font-black leading-snug tracking-tight text-foreground lg:text-3xl">
              {a.resposta}
            </p>
          </div>

          {/* Corpo */}
          <div className="tile px-6 py-12 lg:px-14 lg:py-20">
            <div className="artigo">
              <MDXRemote
                source={a.corpo}
                components={componentesMDX}
                options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
              />
            </div>

            {a.passos && a.passos.length > 0 && (
              <Revelar>
                <section className="mt-16 rounded-2xl bg-muted p-6 lg:p-10">
                  <h2 className="font-display text-2xl font-black tracking-tight text-foreground lg:text-3xl">
                    Resumo em passos
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Para guardar no telemóvel e ter à mão na cama.
                  </p>
                  <ol className="mt-8 space-y-5">
                    {a.passos.map((p, i) => (
                      <li key={p.nome} className="flex gap-4">
                        <span
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-display text-sm font-black text-foreground"
                          style={{ background: "var(--grad-cta)" }}
                        >
                          {i + 1}
                        </span>
                        <div>
                          <p className="font-bold text-foreground">{p.nome}</p>
                          <p className="mt-1 text-sm leading-relaxed text-muted-foreground lg:text-base">
                            {p.texto}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </section>
              </Revelar>
            )}

            {a.faq && a.faq.length > 0 && (
              <section className="mt-16">
                <h2 className="font-display text-2xl font-black tracking-tight text-foreground lg:text-3xl">
                  Perguntas frequentes
                </h2>
                <div className="mt-6 divide-y divide-border border-y border-border">
                  {a.faq.map((f) => (
                    <details key={f.pergunta} className="group py-5">
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-bold text-foreground">
                        {f.pergunta}
                        <span
                          className="mt-0.5 shrink-0 text-xl leading-none text-foreground/70 transition-transform group-open:rotate-45"
                          aria-hidden="true"
                        >
                          +
                        </span>
                      </summary>
                      <p className="mt-3 leading-relaxed text-muted-foreground">{f.resposta}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {a.fontes && a.fontes.length > 0 && (
              <section className="mt-16">
                <h2 className="font-display text-xl font-black tracking-tight text-foreground lg:text-2xl">
                  Fontes
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Ligações para as fontes primárias, não para artigos sobre elas.
                </p>
                <ul className="mt-5 space-y-3">
                  {a.fontes.map((f) => (
                    <li key={f.url} className="text-sm leading-relaxed">
                      <a
                        href={f.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-foreground underline decoration-black/25 underline-offset-4 hover:decoration-black"
                      >
                        {f.titulo}
                      </a>
                      {f.nota && <span className="text-muted-foreground"> — {f.nota}</span>}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <aside className="mt-16 rounded-2xl border border-border p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-foreground/70">
                Aviso
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Este texto é informativo e não substitui uma consulta. Se a insónia dura há mais de
                três meses, se dorme e continua exausto durante o dia, ou se toma medicação para
                dormir, fale com o seu médico de família. Nada aqui serve para iniciar, alterar ou
                interromper qualquer medicamento.
              </p>
            </aside>
          </div>

          {/* Autor */}
          <div className="tile flex flex-col items-start gap-6 p-8 sm:flex-row lg:px-14 lg:py-10">
            <AvatarAutor tamanho="grande" />
            <div>
              <p className="font-display text-xl font-black tracking-tight text-foreground">
                {site.autor.nome}
              </p>
              <p className="mt-1 text-sm font-medium text-muted-foreground">{site.autor.funcao}</p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{site.autor.bio}</p>
              <Link href="/sobre/" className="botao-preto mt-5">
                As regras com que escrevo
              </Link>
            </div>
          </div>

          {proximos.length > 0 && (
            <>
              <div className="tile px-8 py-6 lg:px-14">
                <h2 className="font-display text-2xl font-black tracking-tight text-foreground lg:text-3xl">
                  A seguir
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-[2px] md:grid-cols-2">
                {proximos.slice(0, 2).map((r, i) => (
                  <CartaoArtigo
                    key={r.slug}
                    artigo={r}
                    variante={i === 0 ? "imagem" : "gradiente"}
                    atraso={i * 0.08}
                  />
                ))}
              </div>
            </>
          )}

          <Subscrever />
          <Footer />
        </article>
      </main>
    </>
  );
}
