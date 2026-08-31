import { todosOsArtigos } from "@/lib/artigos";
import { pilares } from "@/lib/site";

// Mesmo padrao do sitemap, do robots e do feed: escrito no build, servido como
// ficheiro estatico. Assim o indice nunca fica dessincronizado do conteudo —
// nao ha um script separado que alguem se possa esquecer de correr.
export const dynamic = "force-static";

export function GET() {
  const indice = todosOsArtigos().map((a) => ({
    slug: a.slug,
    titulo: a.titulo,
    descricao: a.descricao,
    pilar: pilares[a.pilar].nome,
    minutos: a.minutos,
  }));

  return Response.json(indice);
}
