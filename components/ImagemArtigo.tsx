import type { MetaArtigo } from "@/lib/artigos";

/**
 * Capa de um artigo, num unico sitio.
 *
 * Se ja foi descarregada (scripts/descarregar-imagens.ts), serve-se do proprio
 * dominio em WebP com JPEG de recurso, e com srcset por largura — o browser
 * escolhe o ficheiro certo para o ecra em vez de descarregar 1800 px para os
 * mostrar a 331 px. Se ainda nao foi, cai para o URL remoto do frontmatter.
 *
 * Nao se usa next/image: com images.unoptimized (obrigatorio no export estatico)
 * ele nao gera variantes nenhumas, so' acrescentaria peso. Aqui o srcset e' real.
 */
export default function ImagemArtigo({
  artigo,
  className = "",
  preencher = false,
  sizes = "100vw",
  prioridade = false,
}: {
  artigo: MetaArtigo;
  className?: string;
  /** true: preenche o contentor posicionado (tiles). */
  preencher?: boolean;
  sizes?: string;
  prioridade?: boolean;
}) {
  const alt = artigo.imagemAlt ?? "";
  const local = artigo.imagemLocal;
  const larguras = artigo.imagemLarguras ?? [];

  const classes = preencher
    ? `absolute inset-0 h-full w-full ${className}`
    : className;

  if (!local || larguras.length === 0) {
    if (!artigo.imagem) return null;
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={artigo.imagem}
        alt={alt}
        loading={prioridade ? "eager" : "lazy"}
        decoding="async"
        className={classes}
      />
    );
  }

  const base = local.replace(/\.jpg$/, "");
  const conjunto = (ext: string) =>
    larguras.map((l) => `${base}-${l}.${ext} ${l}w`).join(", ");

  return (
    <picture>
      <source type="image/webp" srcSet={conjunto("webp")} sizes={sizes} />
      <source type="image/jpeg" srcSet={conjunto("jpg")} sizes={sizes} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={local}
        alt={alt}
        width={artigo.imagemLargura}
        height={artigo.imagemAltura}
        loading={prioridade ? "eager" : "lazy"}
        {...(prioridade ? { fetchPriority: "high" as const } : {})}
        decoding="async"
        className={classes}
      />
    </picture>
  );
}
