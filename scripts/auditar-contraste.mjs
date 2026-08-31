// Auditoria de contraste WCAG dos gradientes de pilar.
//   node scripts/auditar-contraste.mjs
//
// Le os gradientes de app/globals.css, e para cada um testa o ponto mais claro
// e o mais escuro contra cada nivel de opacidade de texto preto usado nos
// componentes. Texto preto a 60% sobre um fundo claro NAO e' preto: e' o
// resultado da composicao, e e' esse que conta.

import { readFileSync } from "node:fs";

const css = readFileSync("app/globals.css", "utf8");

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

function luminancia([r, g, b]) {
  const f = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

function contraste(a, b) {
  const [x, y] = [luminancia(a), luminancia(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}

/** Preto com opacidade `a` composto sobre `fundo`. */
const sobrepor = (fundo, a) => fundo.map((c) => Math.round(c * (1 - a)));

// --grad-nome: linear-gradient(...#AABBCC ... #DDEEFF ...);
const gradientes = [...css.matchAll(/--(grad-[a-z]+):\s*([^;]+);/g)].map(([, nome, valor]) => ({
  nome,
  paradas: [...valor.matchAll(/#[0-9A-Fa-f]{6}/g)].map((m) => hex(m[0])),
}));

// Onde cada opacidade e' usada, e que limiar se aplica.
const usos = [
  { alfa: 1.0, onde: "h1 / h3 (grande, bold)", limiar: 3.0 },
  { alfa: 0.7, onde: "todo o texto secundario", limiar: 4.5 },
];

let falhas = 0;

for (const g of gradientes) {
  const porLum = [...g.paradas].sort((a, b) => luminancia(a) - luminancia(b));
  const escuro = porLum[0];
  const claro = porLum[porLum.length - 1];

  console.log(`\n${g.nome}`);
  for (const u of usos) {
    const linhas = [
      ["mais escuro", escuro],
      ["mais claro ", claro],
    ].map(([rotulo, fundo]) => {
      const r = contraste(sobrepor(fundo, u.alfa), fundo);
      return { rotulo, r };
    });

    const pior = Math.min(...linhas.map((l) => l.r));
    const passa = pior >= u.limiar;
    if (!passa) falhas++;
    console.log(
      `  ${passa ? "PASSA" : "FALHA"}  ${String(u.alfa).padEnd(4)} ${u.onde.padEnd(34)} ` +
        `pior ${pior.toFixed(2)}:1  (min ${u.limiar}:1)`,
    );
  }
}

console.log(`\n${falhas === 0 ? "Sem falhas." : `${falhas} combinacoes abaixo do minimo WCAG AA.`}`);
