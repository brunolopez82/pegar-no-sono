import Figura from "../Figura";

/**
 * Hipnograma esquematico de uma noite de oito horas.
 *
 * SVG inline de proposito: nao gasta um pedido, nao salta o layout, escala em
 * qualquer ecra e usa os tokens de cor do site, por isso acompanha a marca sem
 * ficheiro nenhum para manter.
 *
 * IMPORTANTE: e' um esquema, nao dados. Desenha o padrao tipico descrito na
 * literatura — ondas lentas concentradas no inicio, REM a alongar-se para a
 * manha — e a legenda diz que e' um esquema. Um desenho apresentado como
 * medicao seria exatamente o tipo de coisa que este site nao faz.
 */

/** Alturas de cada fase no desenho. */
const Y = { acordado: 45, rem: 95, leve: 145, profundo: 200 } as const;

/** Linha em degraus: uma noite tipica, das 23h as 7h. */
const LINHA = [
  [100, 45], [121, 45], [121, 145], [138, 145], [138, 200], [245, 200],
  [245, 145], [266, 145], [266, 95], [296, 95], [296, 145], [321, 145],
  [321, 200], [381, 200], [381, 145], [402, 145], [402, 95], [444, 95],
  [444, 145], [474, 145], [474, 200], [500, 200], [500, 145], [529, 145],
  [529, 95], [585, 95], [585, 145], [606, 145], [606, 45], [614, 45],
  [614, 145], [653, 145], [653, 95], [712, 95], [712, 145], [733, 145],
  [733, 95], [780, 95], [780, 45],
]
  .map(([x, y]) => `${x},${y}`)
  .join(" ");

const HORAS = ["23h", "00h", "01h", "02h", "03h", "04h", "05h", "06h", "07h"];

export default function Hipnograma() {
  return (
    <Figura legenda="As duas fases não estão espalhadas por igual pela noite. Deitar-se mais tarde corta sobretudo sono profundo; acordar mais cedo corta sobretudo REM. Esquema do padrão típico — não são dados de uma noite real.">
      <svg
        viewBox="0 0 800 270"
        className="w-full"
        role="img"
        aria-labelledby="hipnograma-titulo hipnograma-desc"
      >
        <title id="hipnograma-titulo">
          Hipnograma esquemático de uma noite de oito horas
        </title>
        <desc id="hipnograma-desc">
          Gráfico das fases do sono ao longo da noite, das 23h às 7h. Os blocos de sono
          profundo são longos nas primeiras horas e desaparecem por completo depois das
          quatro e meia da manhã. Os períodos de sono REM começam curtos e vão ficando
          progressivamente mais longos até ao acordar.
        </desc>

        {/* Zonas: o que o desenho existe para mostrar. */}
        <rect x="100" y="32" width="281" height="183" fill="var(--dia-profundo)" opacity="0.5" />
        <rect x="500" y="32" width="280" height="183" fill="var(--dia-rem)" opacity="0.5" />

        <text x="240" y="24" className="dia-zona" textAnchor="middle">
          o sono profundo vive aqui
        </text>
        <text x="640" y="24" className="dia-zona" textAnchor="middle">
          o REM vive aqui
        </text>

        {/* Linhas-guia de cada fase. */}
        {Object.values(Y).map((y) => (
          <line key={y} x1="100" y1={y} x2="780" y2={y} className="dia-grelha" />
        ))}

        {/* Fases. */}
        {(
          [
            ["Acordado", Y.acordado],
            ["REM", Y.rem],
            ["Leve", Y.leve],
            ["Profundo", Y.profundo],
          ] as const
        ).map(([nome, y]) => (
          <text key={nome} x="90" y={y + 4} className="dia-fase" textAnchor="end">
            {nome}
          </text>
        ))}

        <polyline points={LINHA} className="dia-linha" />

        {/* Eixo do tempo. */}
        <line x1="100" y1="228" x2="780" y2="228" className="dia-grelha" />
        {HORAS.map((h, i) => (
          <text key={h} x={100 + i * 85} y="248" className="dia-hora" textAnchor="middle">
            {h}
          </text>
        ))}
      </svg>
    </Figura>
  );
}
