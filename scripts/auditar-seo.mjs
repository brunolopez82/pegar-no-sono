// Auditoria on-page do HTML ja' compilado.
//   npm run build && node scripts/auditar-seo.mjs
//
// Verifica o que um crawler verifica: titulos, descricoes, H1, alt das imagens,
// canonical, e ligacoes internas que apontam para paginas que nao existem.

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import path from "node:path";

const RAIZ = "out";
const paginas = [];

function percorrer(dir) {
  for (const n of readdirSync(dir)) {
    const p = path.join(dir, n);
    if (statSync(p).isDirectory()) percorrer(p);
    else if (n === "index.html") paginas.push(p);
  }
}
percorrer(RAIZ);

const desescapar = (s) =>
  s.replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&amp;/g, "&")
   .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#x2F;/g, "/");

const url = (p) => {
  const rel = path.relative(RAIZ, path.dirname(p)).split(path.sep).join("/");
  return rel === "" ? "/" : `/${rel}/`;
};

const avisos = [];
const titulos = new Map();
const descricoes = new Map();

for (const p of paginas) {
  const h = readFileSync(p, "utf8");
  const u = url(p);
  const reportar = (m) => avisos.push({ u, m });

  // Uma pagina com noindex esta' fora do indice de proposito. Exigir-lhe
  // canonical, ou acusa-la de duplicar o title de outra, e' ruido: nenhum
  // motor vai comparar as duas.
  const foraDoIndice = /<meta name="robots" content="[^"]*noindex/.test(h);

  // --- title ---
  const t = h.match(/<title>(.*?)<\/title>/s);
  const titulo = t ? desescapar(t[1]) : null;
  if (!titulo) reportar("sem <title>");
  else {
    if (titulo.length > 60) reportar(`title com ${titulo.length} caracteres (o Google corta a ~60)`);
    if (titulo.length < 15) reportar(`title com apenas ${titulo.length} caracteres`);
    if (!foraDoIndice) {
      if (!titulos.has(titulo)) titulos.set(titulo, []);
      titulos.get(titulo).push(u);
    }
  }

  // --- description ---
  const d = h.match(/<meta name="description" content="(.*?)"\/>/s);
  if (!d) reportar("sem meta description");
  else {
    const desc = desescapar(d[1]);
    if (!foraDoIndice) {
      if (!descricoes.has(desc)) descricoes.set(desc, []);
      descricoes.get(desc).push(u);
    }
  }

  // --- H1 ---
  const h1 = h.match(/<h1[^>]*>/g) || [];
  if (h1.length === 0) reportar("sem H1");
  if (h1.length > 1) reportar(`${h1.length} elementos H1 (devia ser um)`);

  // --- imagens sem alt ---
  for (const img of h.match(/<img[^>]*>/g) || []) {
    if (!/\balt=/.test(img)) reportar("imagem sem atributo alt: " + img.slice(0, 70));
  }

  // --- canonical ---
  const can = h.match(/<link rel="canonical" href="([^"]*)"/);
  if (!can) {
    if (!foraDoIndice) reportar("sem canonical");
  } else if (!can[1].endsWith(u)) {
    reportar(`canonical aponta para ${can[1]}, mas a pagina e' ${u}`);
  }

  // --- ligacoes internas partidas ---
  for (const m of h.matchAll(/href="(\/[^"#?]*)"/g)) {
    const alvo = m[1];
    if (alvo.startsWith("/_next/")) continue;
    const semBarra = alvo.replace(/\/$/, "");
    const existe =
      existsSync(path.join(RAIZ, alvo)) ||
      existsSync(path.join(RAIZ, semBarra, "index.html")) ||
      existsSync(path.join(RAIZ, semBarra));
    if (!existe) reportar(`ligacao interna para pagina inexistente: ${alvo}`);
  }
}

for (const [t, us] of titulos) if (us.length > 1) avisos.push({ u: us.join(", "), m: `title duplicado: "${t}"` });
for (const [, us] of descricoes) if (us.length > 1) avisos.push({ u: us.join(", "), m: "meta description duplicada" });

console.log(`${paginas.length} paginas analisadas\n`);
if (avisos.length === 0) console.log("  sem problemas");
else {
  const porPagina = new Map();
  for (const a of avisos) {
    if (!porPagina.has(a.u)) porPagina.set(a.u, []);
    porPagina.get(a.u).push(a.m);
  }
  for (const [u, ms] of porPagina) {
    console.log(`  ${u}`);
    for (const m of [...new Set(ms)]) console.log(`      ${m}`);
  }
  console.log(`\n  ${avisos.length} avisos em ${porPagina.size} paginas`);
}
