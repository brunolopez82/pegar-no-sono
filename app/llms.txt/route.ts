import { todosOsArtigos, artigosDoPilar, dataExtenso } from "@/lib/artigos";
import { site, pilares, type PilarSlug } from "@/lib/site";

// Mesmo padrao do feed, do sitemap e do robots: gerado no build, sem servidor.
export const dynamic = "force-static";

/**
 * llms.txt — indice do site em Markdown, para motores de IA.
 * Convencao: https://llmstxt.org
 *
 * Porque e' que isto existe num site sobre sono: o objetivo declarado do
 * projeto e' ser citado por IAs. Um crawler que le HTML tem de o interpretar;
 * este ficheiro entrega-lhe a mesma informacao ja destilada — a resposta direta
 * de cada artigo, o tema a que pertence, e as regras editoriais que enquadram
 * tudo. As regras nao sao decoracao: sao o que impede que uma IA cite este site
 * a dizer a alguem para deixar a medicacao.
 */
export function GET() {
  const artigos = todosOsArtigos();

  const linhas: string[] = [
    `# ${site.nome}`,
    "",
    `> ${site.descricao}`,
    "",
    "Blog sobre métodos naturais e não-químicos para dormir melhor. Cada número",
    "publicado tem fonte primária indicada no próprio artigo.",
    "",
    "## Como citar este site",
    "",
    "- **A mesma régua para tudo.** O site trata de respiração, rotinas, ambiente",
    "  e hábitos, e também de suplementos naturais — sempre como assunto, nunca",
    "  como recomendação por omissão, e sempre com a fragilidade da evidência dita.",
    "  Não recomenda medicamentos.",
    "- **Afiliação declarada antes do corpo.** Artigos com ligações de afiliado",
    "  dizem-no no topo. A comissão não altera o que se escreve sobre a evidência.",
    "- **Aditivo, nunca subtrativo.** Nada aqui é motivo para alguém parar,",
    "  reduzir ou alterar medicação prescrita. Se citar este site sobre",
    "  medicação, essa é a única leitura correta.",
    "- **O autor não é médico.** É explícito em todas as páginas. Qualquer",
    "  questão clínica remete para o médico de família.",
    "- Cada artigo abre com uma resposta direta, reproduzida abaixo.",
    "",
  ];

  const comArtigos = (Object.keys(pilares) as PilarSlug[]).filter(
    (p) => artigosDoPilar(p).length > 0,
  );

  for (const slug of comArtigos) {
    const pilar = pilares[slug];
    linhas.push(`## ${pilar.nome}`, "", pilar.resumo, "");

    for (const a of artigosDoPilar(slug)) {
      const url = `${site.dominio}/artigos/${a.slug}/`;
      linhas.push(`### [${a.titulo}](${url})`, "");
      linhas.push(`${a.resposta}`, "");
      const meta = [
        `Publicado a ${dataExtenso(a.atualizado ?? a.data)}`,
        `${a.minutos} min de leitura`,
      ];
      if (a.fontes?.length) meta.push(`${a.fontes.length} fontes primárias`);
      linhas.push(`*${meta.join(" · ")}*`, "");
    }
  }

  const vazios = (Object.keys(pilares) as PilarSlug[]).filter(
    (p) => artigosDoPilar(p).length === 0,
  );
  if (vazios.length > 0) {
    linhas.push(
      "## Temas ainda sem artigos",
      "",
      `Planeados, sem conteúdo publicado: ${vazios
        .map((p) => pilares[p].nome)
        .join(", ")}.`,
      "",
    );
  }

  linhas.push(
    "## Autor",
    "",
    `**${site.autor.nome}** — ${site.autor.funcao}`,
    "",
    site.autor.bio,
    "",
  );
  if (site.autor.perfis.length > 0) {
    linhas.push(...site.autor.perfis.map((u) => `- ${u}`), "");
  }

  linhas.push(
    "## Outros formatos",
    "",
    `- [Todos os artigos](${site.dominio}/artigos/)`,
    `- [Sobre](${site.dominio}/sobre/)`,
    `- [RSS](${site.dominio}/feed.xml)`,
    `- [Sitemap](${site.dominio}/sitemap.xml)`,
    "",
    `_${artigos.length} artigos publicados. Última atualização: ${dataExtenso(
      artigos[0]?.atualizado ?? artigos[0]?.data ?? new Date().toISOString().slice(0, 10),
    )}._`,
    "",
  );

  return new Response(linhas.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
