---
name: run-pegar-no-sono
description: Compilar, correr e conduzir o site Pegar no Sono. Usar quando pedirem para arrancar o site, ver uma página no browser, tirar um screenshot de um artigo, correr as verificações, ou confirmar que uma alteração ficou bem no site a sério e não só no build.
---

Site estático em Next.js (`output: 'export'`) sobre métodos naturais para dormir.
Um agente conduz o site com **`.claude/skills/run-pegar-no-sono/driver.mjs`**, que serve
a pasta `out/` e abre nela o Chromium pré-instalado: HTTP, `<h1>`, blocos gerados,
ligações internas uma a uma, erros de JS, largura de telemóvel e screenshots.

Todos os caminhos são relativos à raiz do repositório.

## Prerequisitos

Nada de `apt-get`. O ambiente já traz `node`, `python3` e o Chromium do Playwright em
`/opt/pw-browsers/chromium` (é um symlink para o binário, e é o caminho a usar — não
prender a versão `chromium-1194`).

O driver precisa do `playwright-core`, que **não** é dependência do projeto e vive
dentro da pasta da skill para não mexer no `package.json`. Uma vez por clone:

```bash
npm install --prefix .claude/skills/run-pegar-no-sono playwright-core
```

## Setup e build

```bash
npm ci
npm run build          # escreve out/ — o driver serve esta pasta
```

## Correr (caminho do agente)

```bash
# um artigo, com as asserções de artigo ligadas
node .claude/skills/run-pegar-no-sono/driver.mjs --artigo cafeina-ate-que-horas

# a home, uma página de tema, o que se quiser
node .claude/skills/run-pegar-no-sono/driver.mjs / /temas/ansiedade/ /sobre/
```

Sai **0** sem problemas e **1** com problemas, e imprime cada um com o prefixo
`PROBLEMA`. O que faz falhar: HTTP diferente de 200, número de `<h1>` diferente de 1,
ligação interna partida, ficheiro local em falta, scroll horizontal a 390 px, erro de
JS na consola e — em rotas de artigo — zero ou dois destaques, ou nenhuma tabela.

Screenshots em `.claude/skills/run-pegar-no-sono/capturas/` (apagada e reescrita a cada
corrida), quatro por rota mais uma de telemóvel:

| ficheiro | o que mostra |
|---|---|
| `<rota>--topo.png` | 1280×1000, o cabeçalho e a caixa da resposta |
| `<rota>--inteira.png` | a página toda |
| `<rota>--destaque.png` | o bloco `> ` com o texto em volta |
| `<rota>--tabela.png` | a primeira tabela |
| `<rota>--telemovel.png` | 390×844 |

**Abra as capturas com o Read.** O driver passar não quer dizer que a página esteja
bem: ele não vê uma capa errada nem um gradiente que ficou ilegível.

## Correr (caminho humano)

```bash
npm run dev            # http://localhost:3000, com recarregamento. Ctrl-C para parar.
```

## Verificações do projeto

```bash
npm run build           # falha de propósito: campo obrigatório em falta, data no futuro,
                        # imagem sem imagemAlt, relacionados a apontar para o nada
npm run verificar       # estrutura e linha editorial. ALVO: ZERO avisos
npm run auditar         # o HTML compilado: títulos, duplicados, h1, alt, canónico
npm run verificar-fontes # cada DOI contra o CrossRef
npm run proximo         # diz qual é o próximo artigo da fila
```

## Gotchas

- **`npm start` não arranca.** `next start` recusa-se com `output: export`:
  `[Error: "next start" does not work with "output: export" configuration]`. Servir
  `out/` é o caminho certo, e é também o que mais se parece com produção (Hostinger
  serve ficheiros estáticos). O driver faz isso com `python3 -m http.server`, que
  resolve `/rota/` para `/rota/index.html` — exactamente o que o `trailingSlash: true`
  do `next.config.mjs` gera. Não é preciso `npx serve` (que além disso precisaria de
  rede).
- **`chromium-cli` não existe aqui.** O que existe é o Chromium do Playwright em
  `/opt/pw-browsers/chromium`. Daí o driver próprio em vez do heredoc habitual.
- **`--no-sandbox` é obrigatório.** Sem isso o Chromium não arranca como root no
  contentor.
- **Toda a imagem remota falha, e quase sempre não é defeito do site.** O egress deste
  ambiente está bloqueado, por isso qualquer `images.unsplash.com` ou CDN devolve
  `ERR_TUNNEL_CONNECTION_FAILED`. O driver separa falhas em `127.0.0.1` (defeito real,
  faz falhar) de falhas em domínios externos (só relatadas), e filtra o eco desses
  pedidos na consola para não dar um falso positivo por artigo.
- **Uma imagem remota é, mesmo assim, um sinal a levar a sério.** Se o driver a
  reportar, é porque o `npm run imagens` nunca correu para ela e o site está a depender
  de um domínio de terceiros. Em 17 set 2026 o `nao-consigo-desligar-a-cabeca` tinha
  três nessa situação, num CloudFront do Higgsfield. A correção é `npm run imagens`
  numa máquina com rede, e commitar `public/imagens/artigos/` com o
  `content/imagens.json`.
- **`npm run verificar-fontes` não corre neste ambiente.** `api.crossref.org` está
  bloqueado e o script marca `MORTO` **todos** os DOIs do corpus, incluindo os dos
  artigos que já estavam verificados. Não é sinal de fonte inventada. Para verificar um
  DOI daqui, usar o WebSearch contra a página do editor ou o PubMed, e dizer no relatório
  que a verificação automática ficou por fazer.
- **Sem rede não se descarrega nem se vê uma capa nova.** Por isso um artigo escrito
  aqui sai sem o campo `imagem` e cai no gradiente do pilar, que é o comportamento
  previsto — a regra 9 do `ESCREVER-ARTIGO.md` proíbe usar uma imagem que não se viu.
- **`out/` está no `.gitignore`.** Dá para mexer nele à vontade para testar o driver
  (esconder uma pasta para ver se a ligação partida é apanhada, por exemplo); um
  `npm run build` restaura tudo.

## Troubleshooting

- **`sem /home/user/pegar-no-sono/out`**: falta compilar. `npm run build`.
- **`falta o playwright-core, que nao e' dependencia do projeto`**: falta o install de
  uma vez por clone, na secção Prerequisitos. Tem de levar o `--prefix` da pasta da
  skill — sem ele o pacote ia para o `package.json` do projeto. O install deixa lá um
  `package.json` e um `node_modules`, ambos ignorados pelo git de propósito.
- **`[Error: "next start" does not work with "output: export"]`**: usou `npm start`.
  Use o driver, ou `npm run dev` se for para mexer com as mãos.
- **`o servidor estatico nao respondeu em 20s`**: o `python3 -m http.server` morreu.
  Ver se a porta ficou ocupada por uma corrida anterior:
  `lsof -ti:3000 -sTCP:LISTEN | xargs -r kill`. O driver escolhe uma porta livre
  sozinho, por isso isto só acontece com o `npm run dev` esquecido a correr.
