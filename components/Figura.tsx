/**
 * Figura dentro do corpo de um artigo: o diagrama e a sua legenda.
 *
 * Um unico sitio a definir espacamento, largura e tipografia da legenda, para
 * que todos os diagramas do site se comportem da mesma maneira sem que cada um
 * traga o seu proprio CSS.
 *
 * A legenda nao repete o alt. O `alt` (ou aria-label do SVG) descreve o
 * desenho para quem nao o ve; a legenda diz o que se deve concluir dele — e e'
 * lida por toda a gente. Sao textos diferentes de proposito.
 */
export default function Figura({
  legenda,
  fonte,
  children,
}: {
  /** O que se deve concluir do desenho. Nao e' o alt. */
  legenda: string;
  /** Opcional: de onde vem o que esta desenhado, quando sao dados de alguem. */
  fonte?: string;
  children: React.ReactNode;
}) {
  return (
    <figure className="figura">
      <div className="figura-tela">{children}</div>
      <figcaption>
        {legenda}
        {fonte ? <span className="figura-fonte">{fonte}</span> : null}
      </figcaption>
    </figure>
  );
}
