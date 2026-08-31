import { todosOsArtigos } from "@/lib/artigos";
import { site, pilares } from "@/lib/site";

// Mesmo padrao do sitemap e do robots: gerado no build, sem servidor.
export const dynamic = "force-static";

/** Escapa o que nao pode entrar em bruto num documento XML. */
function esc(texto: string): string {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** "2026-08-31" -> data RFC 822, que e' o formato que o RSS 2.0 exige. */
function rfc822(iso: string): string {
  return new Date(`${iso}T09:00:00Z`).toUTCString();
}

export function GET() {
  const artigos = todosOsArtigos();
  const atualizado = artigos[0] ? rfc822(artigos[0].atualizado ?? artigos[0].data) : new Date().toUTCString();

  const itens = artigos
    .map((a) => {
      const url = `${site.dominio}/artigos/${a.slug}/`;
      return `    <item>
      <title>${esc(a.titulo)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${esc(a.resposta)}</description>
      <category>${esc(pilares[a.pilar].nome)}</category>
      <pubDate>${rfc822(a.data)}</pubDate>
      <dc:creator>${esc(site.autor.nome)}</dc:creator>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${esc(site.nome)}</title>
    <link>${site.dominio}/</link>
    <description>${esc(site.descricao)}</description>
    <language>pt-pt</language>
    <lastBuildDate>${atualizado}</lastBuildDate>
    <atom:link href="${site.dominio}/feed.xml" rel="self" type="application/rss+xml"/>
${itens}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
