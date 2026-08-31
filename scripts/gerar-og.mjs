// Gera a imagem Open Graph por defeito (1200x630) para as paginas sem imagem propria.
// Correr a mao quando o nome ou a paleta mudarem:  node scripts/gerar-og.mjs
//
// Nota: o site usa Montserrat Black, que nao esta instalado nesta maquina e o
// sharp so' consegue usar tipos de letra do sistema. Usa-se a alternativa mais
// proxima disponivel. O ficheiro gerado fica versionado, por isso so' precisa
// de correr uma vez — nao e' um passo do build.

import sharp from "sharp";

const L = 1200;
const A = 630;
const GRAD = ["#F5C6B0", "#F4A5A0", "#E8A0BF"]; // var(--grad-cta)
const FONTE = "Segoe UI Black, Impact, Arial Black, sans-serif";

const r = 88;
const cx = 1010;
const cy = 150;
const d = 46;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${L}" height="${A}" viewBox="0 0 ${L} ${A}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${GRAD[0]}"/>
      <stop offset="50%" stop-color="${GRAD[1]}"/>
      <stop offset="100%" stop-color="${GRAD[2]}"/>
    </linearGradient>
    <mask id="lua">
      <rect width="${L}" height="${A}" fill="black"/>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="white"/>
      <circle cx="${cx + d}" cy="${cy - d * 0.55}" r="${r * 0.92}" fill="black"/>
    </mask>
  </defs>

  <rect width="${L}" height="${A}" fill="url(#g)"/>
  <rect width="${L}" height="${A}" fill="#000000" mask="url(#lua)" opacity="0.85"/>

  <text x="80" y="330" font-family="${FONTE}" font-size="104" fill="#000000">Pegar no Sono</text>
  <text x="80" y="410" font-family="${FONTE}" font-size="40" fill="#000000" opacity="0.62">Métodos naturais para dormir melhor</text>

  <rect x="80" y="470" width="150" height="5" fill="#000000" opacity="0.35"/>
  <text x="80" y="540" font-family="${FONTE}" font-size="30" fill="#000000" opacity="0.55">Técnicas, não substâncias · Português de Portugal</text>
</svg>`;

await sharp(Buffer.from(svg, "utf8")).png().toFile("public/og-default.png");
console.log("  public/og-default.png  1200x630");
