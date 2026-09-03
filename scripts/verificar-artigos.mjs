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

// Suplementos passaram a ser assunto legitimo a 3 set 2026, mas com quatro
// obrigacoes — ver a regra 1 do ESCREVER-ARTIGO.md. Estas sao as que uma
// maquina consegue verificar. O gatilho e' o nome concreto de um suplemento,
// nao a palavra "suplemento" solta, senao os paragrafos que falam da linha
// editorial em abstrato disparavam sozinhos.
const SUPLEMENTOS = /\b(melatonina|valeriana|hiperic[ãa]o|magn[ée]sio|tript[oó]fano|ashwagandha|GABA|passiflora|camomila|glicina|5-HTP|L-teanina)\b/i;

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

  // ------------------------------------------------------------- destaque
  // O bloco `> ` e' a unidade mais fotografada e mais citada da pagina: sai
  // a toda a largura, em Montserrat 900. Vale por ser raro e por dizer a
  // tese — nao por partir o texto. Um por artigo, nem zero nem dois.
  const destaques = (corpo.match(/^> .+$/gm) || []).map((d) => d.slice(2).trim());
  if (destaques.length === 0) avisos.push("sem destaque — falta a frase que resume o artigo");
  if (destaques.length > 1) avisos.push(`${destaques.length} destaques — o bloco vale por ser raro, use um`);

  for (const d of destaques) {
    // Arrancado da pagina, tem de continuar a dizer alguma coisa.
    if (/^(Isso|Isto|Ele|Ela|Essa|Esse|Nesse|Nessa|Neste|Nesta|Aqui|Ali|Assim|Por isso)\b/.test(d)) {
      avisos.push(`destaque abre com pronome solto e não se aguenta sozinho: "${d.slice(0, 44)}…"`);
    }
    // Repetir uma frase que esta' mesmo ao lado obriga a ler duas vezes.
    const corpoSemDestaques = corpo.replace(/^> .+$/gm, "");
    const frases = d.split(/(?<=[.!?])\s+/).filter((f) => f.split(/\s+/).length >= 6);
    for (const f of frases) {
      if (corpoSemDestaques.includes(f.trim())) {
        avisos.push(`destaque repete uma frase do corpo: "${f.trim().slice(0, 44)}…"`);
      }
    }
  }

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

  // As obrigacoes da regra 1 quando um suplemento e' nomeado. Um artigo que
  // fale de melatonina sem dizer que ela mexe com antidepressivos, com a
  // pilula e com a tensao nao e' um artigo incompleto — e' um artigo perigoso.
  const supl = (fm + corpo).match(SUPLEMENTOS);
  if (supl) {
    const tudo = fm + corpo;
    if (!/intera(ç|c)(ão|ao|ões|oes)|interage|interagem/i.test(tudo)) {
      avisos.push(`nomeia "${supl[0]}" e não tem secção de interações — obrigatória (regra 1)`);
    }
    if (!/m[ée]dico|farmac[êe]utic/i.test(tudo)) {
      avisos.push(`nomeia "${supl[0]}" e não encaminha para o médico ou o farmacêutico`);
    }
    if (/crian[çc]a|beb[ée]|filho/i.test(tudo) && !/pediatra/i.test(tudo)) {
      avisos.push(`fala de "${supl[0]}" e de crianças sem encaminhar para o pediatra`);
    }
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
