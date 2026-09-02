// Verificacao completa do corpus, contra a ARQUITETURA-DE-ARTIGOS.md.
//   npm run verificar
//
// Nao substitui `npm run auditar`, que olha para o HTML compilado. Este olha
// para o texto: estrutura, checklist de AEO e linha editorial.

import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const PASTA = "content/artigos";
const ficheiros = readdirSync(PASTA).filter((f) => f.endsWith(".mdx")).sort();

const MOMENTOS = ["manha", "dia", "fim-de-tarde", "antes-de-deitar", "na-cama", "de-madrugada"];
const PILARES = ["fundamentos", "respiracao", "rotina", "ambiente", "ansiedade", "ritmo-circadiano", "biohacking", "medir"];

// Grafias e termos que nao pertencem a portugues de Portugal.
const NAO_PT_PT = [
  ["fato de", "facto de"], ["usuário", "utilizador"], ["celular", "telemóvel"],
  ["time de", "equipa de"], ["café da manhã", "pequeno-almoço"], ["ônibus", "autocarro"],
  ["planejar", "planear"], ["registrar", "registar"], ["gênero", "género"],
  ["econômic", "económic"], ["acadêmic", "académic"], ["dormitório", "quarto"],
];

// Formulacoes que quebram a linha editorial: nunca subtrativo em relacao a medicacao.
const PROIBIDO = [
  /deix(e|ar) de tomar/i, /parar? (a|o) (medicaç|comprimid)/i,
  /reduz(a|ir) a dose/i, /substitu(a|ir) (o|a) (medicaç|comprimid)/i,
  /suplement(o|os) recomendad/i,
];

let totalAvisos = 0;
const resumo = [];

for (const f of ficheiros) {
  const bruto = readFileSync(path.join(PASTA, f), "utf8");
  const partes = bruto.split("---");
  const fm = partes[1];
  const corpo = partes.slice(2).join("---");
  const slug = f.replace(/\.mdx$/, "");
  const avisos = [];

  const campo = (n) => (fm.match(new RegExp(`^${n}: "(.*)"$`, "m")) || [])[1];
  const conta = (re, txt) => (txt.match(re) || []).length;

  // ---------------------------------------------------------------- estrutura
  const palavras = corpo.trim().split(/\s+/).length;
  const h2 = conta(/^## /gm, corpo);
  const perguntas = conta(/^## .*\?$/gm, corpo);
  const tabelas = conta(/^\|---/gm, corpo);
  const ligacoes = conta(/\]\((\/artigos\/|\/temas\/)/g, corpo);
  const faq = conta(/^ {2}- pergunta:/gm, fm);
  const fontes = conta(/^ {2}- titulo:/gm, fm);

  if (perguntas < 2) avisos.push(`só ${perguntas} cabeçalho(s) em forma de pergunta (mínimo 2)`);
  if (tabelas === 0) avisos.push("sem tabela — toda a comparação devia estar em tabela");
  if (ligacoes < 3) avisos.push(`${ligacoes} ligações internas (alvo 3 a 5)`);
  if (ligacoes > 8) avisos.push(`${ligacoes} ligações internas — acima de 8 distrai`);
  if (faq < 4) avisos.push(`${faq} perguntas na FAQ (mínimo 4)`);
  if (fontes === 0) avisos.push("sem fontes primárias");
  if (h2 > 0 && palavras / h2 > 400) avisos.push(`${Math.round(palavras / h2)} palavras por secção — secções longas de mais`);

  // ------------------------------------------------------------- frontmatter
  const resposta = campo("resposta");
  if (!resposta) avisos.push("sem campo resposta");
  else {
    const n = resposta.split(/\s+/).length;
    if (n < 30 || n > 60) avisos.push(`resposta com ${n} palavras (alvo ~40)`);
  }

  const pilar = campo("pilar");
  if (!PILARES.includes(pilar)) avisos.push(`pilar inválido: ${pilar}`);

  const momento = campo("momento");
  const temPassos = /^passos:/m.test(fm);
  if (temPassos && !momento) avisos.push("tem passos mas não tem momento");
  if (momento && !MOMENTOS.includes(momento)) avisos.push(`momento inválido: ${momento}`);

  if (campo("imagem") && !campo("imagemAlt")) avisos.push("imagem sem imagemAlt");

  // ------------------------------------------------------------------- AEO
  const paragrafos = corpo.split("\n\n").map((p) => p.trim()).filter(Boolean);
  const pronomes = paragrafos.filter((p) => /^(Isso|Isto|Ele|Ela|Essa|Esse|Aqui|Nesta|Neste|Dito isto)\b/.test(p));
  for (const p of pronomes) avisos.push(`parágrafo abre com pronome solto: "${p.slice(0, 44)}…"`);

  for (const q of corpo.match(/^## .*\?$/gm) || []) {
    const i = corpo.indexOf(q);
    const seguinte = corpo.slice(i + q.length).trim().split("\n\n")[0] || "";
    if (seguinte.length < 40) avisos.push(`secção "${q.slice(3, 40)}" não responde no primeiro parágrafo`);
  }

  // ------------------------------------------------------- linha editorial
  for (const [erro, certo] of NAO_PT_PT) {
    if (new RegExp(erro, "i").test(corpo)) avisos.push(`"${erro}" não é português de Portugal (usar "${certo}")`);
  }
  for (const re of PROIBIDO) {
    const m = corpo.match(re);
    if (m) avisos.push(`linha editorial: "${m[0]}" — nunca subtrativo em relação a medicação`);
  }

  // Numeros grandes no corpo devem ter ano ou fonte por perto.
  for (const m of corpo.matchAll(/(\d[\d\s.,]{2,})\s*%/g)) {
    // Janela larga de proposito: um numero numa lista herda o contexto do
    // paragrafo que a introduz, e esse paragrafo pode ser longo.
    const janela = corpo.slice(Math.max(0, m.index - 500), m.index + 300);
    if (!/\b(19|20)\d{2}\b|estudo|ensaio|revisão|meta-análise|painel/i.test(janela)) {
      avisos.push(`percentagem "${m[0].trim()}" sem estudo nem ano por perto`);
    }
  }

  totalAvisos += avisos.length;
  resumo.push({ slug, palavras, h2, perguntas, tabelas, ligacoes, faq, fontes, momento: momento || "—", avisos });
}

console.log(`${ficheiros.length} artigos verificados\n`);
console.log(
  "artigo".padEnd(46) + "palav".padStart(6) + "  ?" + " tab" + " lig" + " faq" + " fon" + "  momento",
);
console.log("-".repeat(88));
for (const r of resumo) {
  console.log(
    r.slug.slice(0, 45).padEnd(46) +
      String(r.palavras).padStart(6) +
      String(r.perguntas).padStart(3) +
      String(r.tabelas).padStart(4) +
      String(r.ligacoes).padStart(4) +
      String(r.faq).padStart(4) +
      String(r.fontes).padStart(4) +
      "  " + r.momento,
  );
}

console.log("\n" + "=".repeat(88));
const comAvisos = resumo.filter((r) => r.avisos.length);
if (!comAvisos.length) console.log("sem avisos em nenhum artigo");
else {
  for (const r of comAvisos) {
    console.log(`\n${r.slug}`);
    for (const a of r.avisos) console.log(`   ${a}`);
  }
  console.log(`\n${totalAvisos} avisos em ${comAvisos.length} de ${ficheiros.length} artigos`);
}
