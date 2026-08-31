import Image from "next/image";
import type { MetaArtigo } from "@/lib/artigos";

/**
 * Capa de um artigo, num unico sitio.
 *
 * Se a imagem ja foi descarregada (scripts/descarregar-imagens.ts), usa next/image
 * com as dimensoes reais — sem pedido a dominio terceiro e sem salto de layout.
 * Se ainda nao foi, cai para o URL remoto do frontmatter, para o site nunca
 * depender de o script ter corrido.
 *
 * next.config.mjs tem images.unoptimized por causa do export estatico: o next/image
 * aqui serve para as dimensoes, o lazy loading e a reserva de espaco, nao para
 * redimensionar no servidor.
 */
export default function ImagemArtigo({
  artigo,
  className = "",
  preencher = false,
  sizes,
  prioridade = false,
}: {
  artigo: MetaArtigo;
  className?: string;
  /** true: preenche o contentor posicionado (tiles). false: usa as dimensoes reais. */
  preencher?: boolean;
  sizes?: string;
  prioridade?: boolean;
}) {
  const alt = artigo.imagemAlt ?? "";

  if (artigo.imagemLocal && artigo.imagemLargura && artigo.imagemAltura) {
    if (preencher) {
      return (
        <Image
          src={artigo.imagemLocal}
          alt={alt}
          fill
          sizes={sizes ?? "(max-width: 768px) 100vw, 33vw"}
          priority={prioridade}
          className={className}
        />
      );
    }

    return (
      <Image
        src={artigo.imagemLocal}
        alt={alt}
        width={artigo.imagemLargura}
        height={artigo.imagemAltura}
        sizes={sizes ?? "100vw"}
        priority={prioridade}
        className={className}
      />
    );
  }

  if (!artigo.imagem) return null;

  // Ainda nao descarregada: URL remoto, sem dimensoes conhecidas.
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={artigo.imagem}
      alt={alt}
      loading={prioridade ? "eager" : "lazy"}
      className={preencher ? `absolute inset-0 h-full w-full ${className}` : className}
    />
  );
}
