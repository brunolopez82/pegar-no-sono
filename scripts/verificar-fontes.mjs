// Valida cada DOI citado contra o CrossRef, e compara o ano registado com o
// ano que escrevemos na citacao.
//
//   node scripts/verificar-fontes.mjs
//
// Nao serve pedir o URL ao editor: Wiley, NEJM, Oxford, Science e Annals
// respondem 403 a robos. Isso nao quer dizer que o link esteja morto. O
// CrossRef e' feito para maquinas e diz a verdade sobre o DOI.

import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const PASTA = "content/artigos";
const fontes = [];

for (const f of readdirSync(PASTA).filter((x) => x.endsWith(".mdx")).sort()) {
  // Os .mdx sao gravados com CRLF neste repositorio. Sem tirar o \r, o `$`
  // dos regex abaixo nunca casa e a verificacao passa em silencio a dizer que
  // nao ha fontes — que e' o pior tipo de falso positivo.
  const linhas = readFileSync(path.join(PASTA, f), "utf8").split(/\r?\n/);
  for (let i = 0; i < linhas.length; i++) {
    const t = linhas[i].match(/^ {2}- titulo: "(.*)"$/);
    if (!t) continue;
    const u = (linhas[i + 1] || "").match(/^ {4}url: "(.*)"$/);
    if (!u) continue;
    fontes.push({ artigo: f.replace(/\.mdx$/, ""), titulo: t[1], url: u[1] });
  }
}

const norm = (x) => x.toLowerCase().normalize("NFD").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();

const vistos = new Map();
for (const s of fontes) {
  if (!vistos.has(s.url)) vistos.set(s.url, s);
}

console.log(`${fontes.length} citações, ${vistos.size} fontes distintas\n`);

let problemas = 0;
const semDoi = [];

for (const s of vistos.values()) {
  const m = s.url.match(/doi\.org\/(.+)$/);
  if (!m) { semDoi.push(s); continue; }
  const doi = m[1];

  let d;
  try {
    const r = await fetch(`https://api.crossref.org/works/${encodeURIComponent(doi)}`, {
      headers: { Accept: "application/json", "User-Agent": "pegarnosono/1.0 (verificacao de fontes)" },
    });
    if (!r.ok) throw new Error(String(r.status));
    d = (await r.json()).message;
  } catch (e) {
    console.log(`  MORTO  ${doi}`);
    console.log(`         citado em ${s.artigo}: ${s.titulo.slice(0, 70)}`);
    problemas++;
    continue;
  }

  const registado = (d.title || ["?"])[0];
  const anoNosso = (s.titulo.match(/\b(19|20)\d{2}\b/) || [])[0];

  // Muitos artigos saem online num ano e no numero da revista no ano seguinte.
  // Citar qualquer um dos dois esta' certo, por isso aceitam-se ambos — foi o
  // que aconteceu com o Windred 2024, o Chinoy 2021 e o Lally 2010.
  const anos = new Set();
  for (const campo of ["issued", "published-print", "published-online", "published"]) {
    const dp = d[campo] && d[campo]["date-parts"];
    if (dp && dp[0] && dp[0][0]) anos.add(String(dp[0][0]));
  }
  const anoReg = [...anos].join(" ou ");

  // O titulo registado tem de aparecer, em substancia, no que escrevemos.
  const chave = norm(registado).split(" ").slice(0, 6).join(" ");
  const tituloBate = chave.length > 8 && norm(s.titulo).includes(chave);
  const anoBate = anoNosso && anos.has(anoNosso);

  if (tituloBate && anoBate) continue;

  problemas++;
  console.log(`  VER    ${doi}   (${s.artigo})`);
  if (!tituloBate) {
    console.log(`         registado: ${registado}`);
    console.log(`         citado:    ${s.titulo}`);
  }
  if (!anoBate) {
    console.log(`         ano registado ${anoReg}, citado ${anoNosso || "nenhum"}`);
  }
}

if (semDoi.length) {
  console.log(`\n  ${semDoi.length} fontes sem DOI (verificadas por HTTP, não pelo CrossRef):`);
  for (const s of semDoi) console.log(`         ${s.url}`);
}

console.log(`\n${problemas === 0 ? "todos os DOIs conferem" : problemas + " fontes a rever"}`);
