// Gera os icones do site a partir de um unico SVG.
// Correr a mao quando a marca mudar:  node scripts/gerar-icones.mjs
//
// A marca e' uma lua em quarto crescente, desenhada em path — sem dependencia
// de tipos de letra instalados no sistema, por isso o resultado e' identico em
// qualquer maquina. Duas letras num quadrado de 16 px seriam ilegiveis.

import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const FUNDO = ["#F5C6B0", "#F4A5A0", "#E8A0BF"]; // var(--grad-cta)
const TINTA = "#000000";

/** Lua em quarto crescente: um circulo cheio menos um circulo deslocado. */
function svg(tamanho) {
  const r = tamanho * 0.3;
  const cx = tamanho * 0.55; // a massa do crescente cai a esquerda; compensa-se aqui
  const cy = tamanho * 0.5;
  const desloc = tamanho * 0.16;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${tamanho}" height="${tamanho}" viewBox="0 0 ${tamanho} ${tamanho}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${FUNDO[0]}"/>
      <stop offset="50%" stop-color="${FUNDO[1]}"/>
      <stop offset="100%" stop-color="${FUNDO[2]}"/>
    </linearGradient>
    <mask id="m">
      <rect width="${tamanho}" height="${tamanho}" fill="black"/>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="white"/>
      <circle cx="${cx + desloc}" cy="${cy - desloc * 0.55}" r="${r * 0.92}" fill="black"/>
    </mask>
  </defs>
  <rect width="${tamanho}" height="${tamanho}" fill="url(#g)"/>
  <rect width="${tamanho}" height="${tamanho}" fill="${TINTA}" mask="url(#m)"/>
</svg>`;
}

const saidas = [
  { caminho: "app/icon.png", tamanho: 512 },
  { caminho: "app/apple-icon.png", tamanho: 180 },
  { caminho: "public/icone-192.png", tamanho: 192 },
  { caminho: "public/icone-512.png", tamanho: 512 },
];

await mkdir("public", { recursive: true });

for (const { caminho, tamanho } of saidas) {
  await sharp(Buffer.from(svg(tamanho))).png().toFile(caminho);
  console.log(`  ${caminho}  ${tamanho}x${tamanho}`);
}
