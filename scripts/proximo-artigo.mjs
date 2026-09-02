// Diz qual e' o artigo da semana. Sem discussao, sem escolher.
//   npm run proximo
//
// A fila esta' no PLANO-EDITORIAL.md e e' a unica coisa mantida a mao. O
// estado — o que ja' saiu, que pilares fecharam — e' lido da pasta dos
// artigos, para nao poder ficar desatualizado. Foi o que aconteceu ao
// plano em setembro de 2026: dizia "ansiedade: 0 artigos" com dois ja'
// publicados, e quem o lesse escolhia um tema repetido.

import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const PASTA = "content/artigos";

const publicados = new Map();
for (const f of readdirSync(PASTA).filter((x) => x.endsWith(".mdx"))) {
  const t = readFileSync(path.join(PASTA, f), "utf8");
  const pilar = (t.match(/^pilar: "(.*)"$/m) || [])[1] || "?";
  const data = (t.match(/^data: "(.*)"$/m) || [])[1] || "";
  publicados.set(f.replace(/\.mdx$/, ""), { pilar, data });
}

// A fila: linhas numeradas do plano, com o slug em crase.
const plano = readFileSync("PLANO-EDITORIAL.md", "utf8");
const fila = [];
for (const l of plano.split(/\r?\n/)) {
  const m = l.match(/^(\d+)\.\s+`([a-z0-9-]+)`\s*(?:—\s*(.*))?$/);
  if (m) fila.push({ n: +m[1], slug: m[2], nota: (m[3] || "").replace(/\*\*/g, "").trim() });
}

const porPilar = new Map();
for (const { pilar } of publicados.values()) porPilar.set(pilar, (porPilar.get(pilar) || 0) + 1);

console.log(`${publicados.size} artigos publicados\n`);
for (const [p, n] of [...porPilar].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${p.padEnd(18)} ${n}`);
}

const porFazer = fila.filter((x) => !publicados.has(x.slug));
const feitos = fila.filter((x) => publicados.has(x.slug));

console.log(`\nfila: ${fila.length} temas, ${feitos.length} publicados, ${porFazer.length} por fazer`);

if (!porFazer.length) {
  console.log("\nA fila acabou. Acrescentar temas ao PLANO-EDITORIAL.md antes da proxima quinta.");
  process.exit(0);
}

const proximo = porFazer[0];
console.log("\n" + "=".repeat(72));
console.log(`PROXIMO:  ${proximo.slug}`);
if (proximo.nota) console.log(`          ${proximo.nota}`);
console.log("=".repeat(72));

console.log("\ndepois desse:");
for (const x of porFazer.slice(1, 4)) console.log(`  ${x.slug}`);

// A regra da fila: um pilar fecha antes de o seguinte abrir. Vale a pena
// dize-lo aqui em vez de esperar que alguem se lembre.
const restaNoPilar = porFazer.filter((x) => {
  const i = plano.indexOf("`" + x.slug + "`");
  const cab = plano.slice(0, i).match(/### Pilar [^\n]+/g);
  const iP = plano.indexOf("`" + proximo.slug + "`");
  const cabP = plano.slice(0, iP).match(/### Pilar [^\n]+/g);
  return cab && cabP && cab[cab.length - 1] === cabP[cabP.length - 1];
});
console.log(`\nfaltam ${restaNoPilar.length} para fechar este pilar.`);
