import Link from "next/link";
import Revelar from "./Revelar";
import ImagemArtigo from "./ImagemArtigo";
import { pilares } from "@/lib/site";
import { dataExtenso, type MetaArtigo } from "@/lib/artigos";

/**
 * Tile de artigo no bento.
 * - "imagem": foto de capa com sobreposicao escura e texto branco
 * - "gradiente": gradiente do pilar
 * - "liso": bg-card
 */
export default function CartaoArtigo({
  artigo,
  variante = "gradiente",
  atraso = 0,
  nivel = 3,
  prioridade = false,
}: {
  artigo: MetaArtigo;
  variante?: "imagem" | "gradiente" | "liso";
  atraso?: number;
  /**
   * Reservado ao primeiro cartao com imagem de cada pagina: e' a candidata a
   * LCP. Sem isto sai em loading="lazy" e o browser adia-a.
   */
  prioridade?: boolean;
  /**
   * Nivel do titulo do cartao. Onde os cartoes vem logo a seguir ao H1, sem
   * cabecalho de seccao pelo meio, tem de ser 2 — saltar de H1 para H3 parte a
   * hierarquia para quem navega por titulos e para os motores.
   */
  nivel?: 2 | 3;
}) {
  const Titulo = (nivel === 2 ? "h2" : "h3") as "h2" | "h3";
  const pilar = pilares[artigo.pilar];
  const comImagem = variante === "imagem" && Boolean(artigo.imagem);

  if (comImagem) {
    return (
      <Revelar atraso={atraso} className="h-full">
        <Link
          href={`/artigos/${artigo.slug}/`}
          className="group relative flex h-full min-h-[360px] flex-col justify-end overflow-hidden"
        >
          <ImagemArtigo
            artigo={artigo}
            preencher
            prioridade={prioridade}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
          <div className="relative p-8 lg:p-10">
            <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-widest text-white/60">
              {pilar.nome}
            </span>
            <Titulo className="mb-3 font-display text-xl font-black leading-tight text-white lg:text-2xl">
              {artigo.titulo}
            </Titulo>
            <p className="mb-6 text-sm leading-relaxed text-white/70">{artigo.descricao}</p>
            <div className="flex items-center justify-between border-t border-white/20 pt-5">
              <span className="text-xs text-white/50">{artigo.minutos} min de leitura</span>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-white transition-all duration-200 group-hover:gap-2.5">
                Ler <span aria-hidden="true">→</span>
              </span>
            </div>
          </div>
        </Link>
      </Revelar>
    );
  }

  return (
    <Revelar atraso={atraso} className="h-full">
      <Link
        href={`/artigos/${artigo.slug}/`}
        className="group flex h-full min-h-[360px] flex-col justify-end p-8 lg:p-10"
        style={
          variante === "gradiente"
            ? { background: pilar.gradiente }
            : { background: "hsl(var(--card))" }
        }
      >
        <span className="etiqueta">{pilar.nome}</span>
        <Titulo className="mb-3 font-display text-xl font-black leading-tight text-foreground lg:text-2xl">
          {artigo.titulo}
        </Titulo>
        <p className="mb-6 text-sm leading-relaxed text-foreground/70">{artigo.descricao}</p>
        <div className="flex items-center justify-between border-t border-black/10 pt-5">
          <span className="text-xs text-foreground/70">
            <time dateTime={artigo.data}>{dataExtenso(artigo.data)}</time> · {artigo.minutos} min
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground transition-all duration-200 group-hover:gap-2.5">
            Ler <span aria-hidden="true">→</span>
          </span>
        </div>
      </Link>
    </Revelar>
  );
}
