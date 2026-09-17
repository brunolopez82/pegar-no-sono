// Serve o `out/` e conduz um Chromium contra ele.
//
//   node .claude/skills/run-pegar-no-sono/driver.mjs                        # a home
//   node .claude/skills/run-pegar-no-sono/driver.mjs --artigo <slug>        # um artigo, com as asserções todas
//   node .claude/skills/run-pegar-no-sono/driver.mjs /temas/ansiedade/ /sobre/
//
// Porque é que isto existe em vez de um `npm start`: o next.config.mjs tem
// `output: 'export'`, e o `next start` recusa-se a arrancar com essa
// configuração. O que se serve é a pasta `out/`, que é o que vai para
// produção. Ver o SKILL.md ao lado.

import { spawn } from "node:child_process";
import { existsSync, mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import net from "node:net";

const RAIZ = process.cwd();
const OUT = path.join(RAIZ, "out");
const CAPTURAS = path.join(RAIZ, ".claude/skills/run-pegar-no-sono/capturas");
const CHROMIUM = "/opt/pw-browsers/chromium";

// ---------------------------------------------------------------- argumentos
const args = process.argv.slice(2);
let rotas = [];
let slugArtigo = null;
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--artigo") slugArtigo = args[++i];
  else rotas.push(args[i]);
}
if (slugArtigo) rotas.unshift(`/artigos/${slugArtigo}/`);
if (!rotas.length) rotas = ["/"];

// ------------------------------------------------------------------- guardas
if (!existsSync(OUT)) {
  console.error(`sem ${OUT}\n\nCorra primeiro:  npm run build`);
  process.exit(1);
}
if (!existsSync(CHROMIUM)) {
  console.error(`sem Chromium em ${CHROMIUM}\n\nEste driver conta com o browser pre-instalado do ambiente.`);
  process.exit(1);
}

// Import dinamico de proposito: o `playwright-core` nao e' dependencia do
// projeto e instala-se dentro da pasta desta skill. Com um import estatico,
// um clone novo levava com um ERR_MODULE_NOT_FOUND e uma pilha de stack em
// vez do comando que resolve o problema.
let chromium;
try {
  ({ chromium } = await import("playwright-core"));
} catch {
  console.error("falta o playwright-core, que nao e' dependencia do projeto.\n");
  console.error("Uma vez por clone:");
  console.error("  npm install --prefix .claude/skills/run-pegar-no-sono playwright-core");
  process.exit(1);
}

async function portaLivre() {
  return new Promise((ok) => {
    const s = net.createServer();
    s.listen(0, "127.0.0.1", () => {
      const p = s.address().port;
      s.close(() => ok(p));
    });
  });
}

const porta = await portaLivre();
const base = `http://127.0.0.1:${porta}`;

// O `python3 -m http.server` resolve /rota/ -> /rota/index.html, que e'
// exatamente o que o `trailingSlash: true` do next.config.mjs produz.
const servidor = spawn("python3", ["-m", "http.server", String(porta), "--bind", "127.0.0.1"], {
  cwd: OUT,
  stdio: "ignore",
});
const pararServidor = () => { try { servidor.kill("SIGKILL"); } catch {} };
process.on("exit", pararServidor);
process.on("SIGINT", () => { pararServidor(); process.exit(130); });

// Sondar em vez de dormir: o http.server arranca em ~100 ms, mas falhar
// em silencio num `sleep` fixo custa mais a diagnosticar do que esperar.
{
  const limite = Date.now() + 20_000;
  for (;;) {
    try {
      const r = await fetch(base + "/", { signal: AbortSignal.timeout(1000) });
      if (r.ok) break;
    } catch {}
    if (Date.now() > limite) { console.error("o servidor estatico nao respondeu em 20s"); process.exit(1); }
    await new Promise((r) => setTimeout(r, 100));
  }
}
console.log(`servidor: ${base}  (raiz: out/)\n`);

rmSync(CAPTURAS, { recursive: true, force: true });
mkdirSync(CAPTURAS, { recursive: true });

const browser = await chromium.launch({
  executablePath: CHROMIUM,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

let problemas = 0;
const aviso = (m) => { problemas++; console.log(`   PROBLEMA  ${m}`); };
const nome = (r) => (r.replace(/^\/|\/$/g, "") || "home").replace(/\//g, "-");

// Ruido de consola que e' so' o eco de um pedido de rede falhado. Neste
// ambiente o egress esta' bloqueado, por isso toda a imagem remota produz
// isto — contar como erro de JS dava um falso positivo por artigo e
// ensinava a ignorar o codigo de saida.
const RUIDO_DE_REDE = /Failed to load resource|ERR_TUNNEL_CONNECTION_FAILED|ERR_NAME_NOT_RESOLVED|ERR_CONNECTION_|ERR_PROXY/;
const dependenciasRemotas = new Set();

for (const rota of rotas) {
  console.log(`=== ${rota}`);
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 1000 } });
  const p = await ctx.newPage();

  // Separar o que falha por ser local do que falha por ser remoto. Neste
  // ambiente o egress esta' bloqueado, por isso QUALQUER imagem remota
  // falha — e isso nao e' defeito do site. Um falhanco em 127.0.0.1 e'.
  const falhasLocais = [], falhasRemotas = [], errosConsola = [];
  p.on("requestfailed", (r) => (r.url().includes("127.0.0.1") ? falhasLocais : falhasRemotas).push(r.url()));
  p.on("console", (m) => { if (m.type() === "error") errosConsola.push(m.text()); });
  p.on("pageerror", (e) => errosConsola.push("pageerror: " + e.message));

  const resp = await p.goto(base + rota, { waitUntil: "load" });
  console.log(`   HTTP        ${resp.status()}`);
  if (resp.status() !== 200) aviso(`${rota} devolveu ${resp.status()}`);

  await p.waitForSelector("h1", { timeout: 10_000 });
  const h1s = await p.locator("h1").count();
  console.log(`   <title>     ${await p.title()}`);
  console.log(`   h1          ${(await p.textContent("h1")).trim().slice(0, 70)}${h1s !== 1 ? `  (${h1s} h1!)` : ""}`);
  if (h1s !== 1) aviso(`${h1s} elementos h1 — devia ser exatamente 1`);

  // --------------------------------------------------- asserções de artigo
  if (rota.startsWith("/artigos/") && rota !== "/artigos/") {
    const destaques = await p.locator("article blockquote, main blockquote").count();
    const tabelas = await p.locator("table").count();
    console.log(`   h2 ${await p.locator("h2").count()} · tabelas ${tabelas} · destaques ${destaques}`);
    if (destaques !== 1) aviso(`${destaques} destaques — a arquitetura pede exatamente 1`);
    if (tabelas === 0) aviso("sem tabela — toda a comparacao devia estar em tabela");

    for (const bloco of ["Resposta curta", "Resumo em passos", "Perguntas frequentes", "Fontes", "A seguir"]) {
      const ha = await p.getByText(bloco, { exact: false }).count();
      console.log(`   ${ha ? "ok " : "-- "} bloco "${bloco}"${ha ? "" : "  (ausente)"}`);
    }
  }

  // ------------------------------------------ ligacoes internas, uma a uma
  const hrefs = await p.$$eval('a[href^="/"]', (as) =>
    [...new Set(as.map((a) => a.getAttribute("href")))].filter((h) => !h.startsWith("//")));
  let partidas = 0;
  for (const h of hrefs) {
    const r = await p.request.get(base + h);
    if (r.status() !== 200) { aviso(`ligacao interna ${r.status()}: ${h}`); partidas++; }
  }
  console.log(`   ligacoes    ${hrefs.length} internas, ${partidas} partidas`);

  // ------------------------------------------------------------- capturas
  const n = nome(rota);
  await p.screenshot({ path: path.join(CAPTURAS, `${n}--topo.png`) });
  await p.screenshot({ path: path.join(CAPTURAS, `${n}--inteira.png`), fullPage: true });
  const bq = p.locator("article blockquote, main blockquote").first();
  if (await bq.count()) { await bq.scrollIntoViewIfNeeded(); await p.screenshot({ path: path.join(CAPTURAS, `${n}--destaque.png`) }); }
  const tb = p.locator("table").first();
  if (await tb.count()) { await tb.scrollIntoViewIfNeeded(); await p.screenshot({ path: path.join(CAPTURAS, `${n}--tabela.png`) }); }

  // --------------------------------------------------------- telemovel
  const mob = await (await browser.newContext({ viewport: { width: 390, height: 844 } })).newPage();
  await mob.goto(base + rota, { waitUntil: "load" });
  await mob.waitForSelector("h1");
  const transborda = await mob.evaluate(() =>
    document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  console.log(`   telemovel   ${transborda ? "SCROLL HORIZONTAL" : "sem scroll horizontal"}`);
  if (transborda) aviso("scroll horizontal a 390px");
  await mob.screenshot({ path: path.join(CAPTURAS, `${n}--telemovel.png`) });

  const errosReais = errosConsola.filter((e) => !RUIDO_DE_REDE.test(e));
  console.log(`   consola     ${errosReais.length ? errosReais.slice(0, 3).join(" | ") : "sem erros de JS"}`);
  if (errosReais.length) aviso(`${errosReais.length} erros de JS na consola`);
  if (falhasLocais.length) { for (const u of falhasLocais.slice(0, 5)) aviso(`ficheiro local em falta: ${u}`); }
  if (falhasRemotas.length) {
    // Nao e' um defeito do codigo e nao faz falhar o driver: e' o site a
    // depender de um dominio de terceiros em vez do proprio. Daqui nao se
    // consegue saber se o URL esta' vivo — so' que nao foi localizado.
    for (const u of falhasRemotas) dependenciasRemotas.add(u);
    console.log(`   remotos     ${new Set(falhasRemotas).size} imagem(ns) servida(s) de dominio externo, nao do proprio site`);
    for (const u of [...new Set(falhasRemotas)].slice(0, 5)) console.log(`               ${u}`);
  }
  console.log();
  await ctx.close();
}

await browser.close();
pararServidor();

console.log(`capturas em ${path.relative(RAIZ, CAPTURAS)}/  — VEJA-AS com o Read, nao basta o driver passar`);

if (dependenciasRemotas.size) {
  console.log(`\nATENCAO: ${dependenciasRemotas.size} imagem(ns) apontam para um dominio de terceiros e nao`);
  console.log("foram localizadas. Corrija num sitio com acesso a rede:");
  console.log("  npm run imagens   # e commitar public/imagens/artigos/ + content/imagens.json");
  console.log("Daqui nao se sabe se esses URLs ainda estao vivos — o egress esta' bloqueado.");
}

console.log(problemas === 0 ? "\nsem problemas" : `\n${problemas} problema(s)`);
process.exit(problemas === 0 ? 0 : 1);
