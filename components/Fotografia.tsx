import type { Artigo } from "@/lib/artigos";

/**
 * Fotografia dentro do corpo de um artigo.
 *
 * Escreve-se no .mdx como `<Fotografia id="cama" />`, no sitio exacto onde
 * entra; o resto — URL, `alt`, legenda — vive no frontmatter, junto do campo
 * `fotografias`. A separacao e' de proposito: quem esta a escrever o texto
 * decide o *onde*, e o *o que* fica todo num sitio so', ao lado da capa.
 *
 * Serve-se do proprio dominio em WebP com JPEG de recurso e srcset por
 * largura, quando `npm run imagens` ja' correu. Enquanto nao correu, cai para
 * o URL remoto — a pagina funciona, mas fica presa a um dominio de terceiros e
 * sem dimensoes conhecidas, logo com salto de layout. E' estado de passagem,
 * nao de chegada.
 *
 * Nao se usa next/image pela mesma razao que a capa: com images.unoptimized,
 * obrigatorio no export estatico, ele nao gera variante nenhuma.
 */
export default function Fotografia({
  artigo,
  id,
}: {
  artigo: Artigo;
  /** O `id` da entrada em `fotografias`, no frontmatter. */
  id: string;
}) {
  const foto = artigo.fotografias?.find((f) => f.id === id);

  // O build ja' recusa uma etiqueta sem entrada (ver validarReferencias), por
  // isso chegar aqui a nulo so' acontece em desenvolvimento, entre a etiqueta
  // ser escrita e o frontmatter ser preenchido. Nao mostrar nada e' melhor do
  // que rebentar a pagina inteira a meio de uma edicao.
  if (!foto) return null;

  const larguras = foto.larguras ?? [];
  const temLocal = Boolean(foto.local) && larguras.length > 0;

  // 860 px e' a largura util do artigo (max-w-artigo); abaixo disso, a coluna
  // ocupa a largura do ecra menos as margens.
  const sizes = "(max-width: 860px) 100vw, 860px";

  return (
    <figure className="figura figura-foto">
      <div className="figura-tela">
        {temLocal ? (
          <picture>
            <source
              type="image/webp"
              srcSet={larguras
                .map((l) => `${foto.local!.replace(/\.jpg$/, "")}-${l}.webp ${l}w`)
                .join(", ")}
              sizes={sizes}
            />
            <source
              type="image/jpeg"
              srcSet={larguras
                .map((l) => `${foto.local!.replace(/\.jpg$/, "")}-${l}.jpg ${l}w`)
                .join(", ")}
              sizes={sizes}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={foto.local}
              alt={foto.alt}
              width={foto.largura}
              height={foto.altura}
              loading="lazy"
              decoding="async"
            />
          </picture>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={foto.url} alt={foto.alt} loading="lazy" decoding="async" />
        )}
      </div>
      {foto.legenda ? <figcaption>{foto.legenda}</figcaption> : null}
    </figure>
  );
}
