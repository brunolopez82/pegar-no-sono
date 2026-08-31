import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import CartaoArtigo from "@/components/CartaoArtigo";
import Subscrever from "@/components/Subscrever";
import DadosEstruturados from "@/components/DadosEstruturados";
import { todosOsArtigos, artigoPorSlug, relacionados, dataExtenso } from "@/lib/artigos";
import { site, pilares } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

/** Uma pasta por artigo no build. E' isto que torna o site estatico. */
export function generateStaticParams() {
  return todosOsArtigos().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = artigoPorSlug(slug);
  if (!a) return {};

  return {
    title: a.titulo,
    description: a.descricao,
    alternates: { canonical: `/artigos/${slug}/` },
    openGraph: {
      type: "article",
      locale: "pt_PT",
      title: a.titulo,
      description: a.descricao,
      publishedTime: a.data,
      modifiedTime: a.atualizado ?? a.data,
      authors: [site.autor.nome],
      url: `${site.dominio}/artigos/${slug}/`,
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

      <article className="envolve py-12 sm:py-16">
        <div className="mx-auto max-w-leitura">
          <nav aria-label="Migalhas" className="text-[13px] text-texto-fraco">
            <Link href="/" className="transition hover:text-ambar-300">
              Início
            </Link>
            <span className="px-2">/</span>
            <Link href={`/temas/${a.pilar}/`} className="transition hover:text-ambar-300">
              {pilar.nome}
            </Link>
          </nav>

          <h1 className="mt-6 font-serif text-[34px] font-semibold leading-[1.14] tracking-tight sm:text-[46px]">
            {a.titulo}
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-[13.5px] text-texto-fraco">
            <span className="text-texto-suave">{site.autor.nome}</span>
            <span aria-hidden="true">·</span>
            <time dateTime={a.data}>{dataExtenso(a.data)}</time>
            {a.atualizado && a.atualizado !== a.data && (
              <>
                <span aria-hidden="true">·</span>
                <span>atualizado a {dataExtenso(a.atualizado)}</span>
              </>
            )}
            <span aria-hidden="true">·</span>
            <span>{a.minutos} min</span>
          </div>

          {/* Resposta direta no topo. E' isto que um motor de IA cita. */}
          <div className="mt-9 rounded-2xl border border-ambar-400/20 bg-ambar-400/[0.06] p-6">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-ambar-400/80">
              Resposta curta
            </p>
            <p className="mt-3 font-serif text-[19px] leading-relaxed text-texto sm:text-[21px]">
              {a.resposta}
            </p>
          </div>

          <div className="artigo mt-12">
            <MDXRemote
              source={a.corpo}
              options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
            />
          </div>

          {a.passos && a.passos.length > 0 && (
            <section className="mt-16 rounded-2xl border border-white/10 bg-noite-700/60 p-6 sm:p-8">
              <h2 className="font-serif text-[24px] font-semibold">Resumo em passos</h2>
              <p className="mt-2 text-[14.5px] text-texto-fraco">
                Para guardar no telemóvel e ter à mão na cama.
              </p>
              <ol className="mt-6 space-y-4">
                {a.passos.map((p, i) => (
                  <li key={p.nome} className="flex gap-4">
                    <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-ambar-400/30 bg-ambar-400/10 font-serif text-[13px] text-ambar-300">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-medium text-texto">{p.nome}</p>
                      <p className="mt-1 text-[15.5px] leading-relaxed text-texto-suave">
                        {p.texto}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {a.faq && a.faq.length > 0 && (
            <section className="mt-16">
              <h2 className="font-serif text-[26px] font-semibold">Perguntas frequentes</h2>
              <div className="mt-6 divide-y divide-white/8 border-y border-white/8">
                {a.faq.map((f) => (
                  <details key={f.pergunta} className="group py-5">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-medium text-texto">
                      {f.pergunta}
                      <span
                        className="mt-1 shrink-0 text-ambar-400 transition group-open:rotate-45"
                        aria-hidden="true"
                      >
                        +
                      </span>
                    </summary>
                    <p className="mt-3 text-[16px] leading-relaxed text-texto-suave">
                      {f.resposta}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          )}

          {a.fontes && a.fontes.length > 0 && (
            <section className="mt-16">
              <h2 className="font-serif text-[22px] font-semibold">Fontes</h2>
              <p className="mt-2 text-[14.5px] text-texto-fraco">
                Ligações para as fontes primárias, não para artigos sobre elas.
              </p>
              <ul className="mt-5 space-y-3">
                {a.fontes.map((f) => (
                  <li key={f.url} className="text-[15px] leading-relaxed">
                    <a
                      href={f.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ambar-300 underline decoration-ambar-400/35 underline-offset-4 hover:decoration-ambar-300"
                    >
                      {f.titulo}
                    </a>
                    {f.nota && <span className="text-texto-fraco"> — {f.nota}</span>}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <aside className="mt-16 rounded-2xl border border-white/10 bg-noite-700/40 p-6">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-texto-fraco">
              Aviso
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-texto-suave">
              Este texto é informativo e não substitui uma consulta. Se a insónia dura há mais de
              três meses, se dorme e continua exausto durante o dia, ou se toma medicação para
              dormir, fale com o seu médico de família. Nada aqui serve para iniciar, alterar ou
              interromper qualquer medicamento.
            </p>
          </aside>

          <div className="mt-14 rounded-2xl border border-white/8 p-6">
            <p className="font-serif text-[18px] font-semibold">{site.autor.nome}</p>
            <p className="mt-2 text-[15px] leading-relaxed text-texto-suave">{site.autor.bio}</p>
            <Link
              href="/sobre/"
              className="mt-3 inline-block text-[14px] text-ambar-300 underline decoration-ambar-400/40 underline-offset-4"
            >
              Como escrevo estes artigos
            </Link>
          </div>
        </div>

        {proximos.length > 0 && (
          <div className="mt-20">
            <h2 className="mb-6 font-serif text-[24px] font-semibold">A seguir</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {proximos.map((r) => (
                <CartaoArtigo key={r.slug} artigo={r} />
              ))}
            </div>
          </div>
        )}
      </article>

      <Subscrever />
    </>
  );
}
