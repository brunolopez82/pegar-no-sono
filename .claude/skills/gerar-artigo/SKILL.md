---
name: gerar-artigo
description: Escreve e publica um artigo novo no Pegar no Sono, do zero até estar online. Entrevista o Bruno primeiro para apanhar o ângulo dele, investiga as fontes primárias, escreve o .mdx completo com resposta, passos, FAQ e fontes, descarrega a capa, compila, faz push e confirma que ficou no ar. Usar quando ele disser "gerar artigo", "novo artigo", "o artigo desta semana", ou nomear um tema — e tambem na rotina automatica de quinta-feira, em que corre sozinha sem ninguem para responder.
---

# Gerar artigo

Publicar aqui é criar **um ficheiro** em `content/artigos/`. Tudo o resto — listagem,
página de tema, sitemap, RSS, `llms.txt`, dados estruturados — atualiza-se sozinho.

A regra que governa esta skill inteira: **o artigo tem de trazer alguma coisa que só o
Bruno pode escrever.** Os quatro primeiros artigos do site são explicadores bem
documentados a partir de fontes públicas — exatamente o que um modelo reconstrói sozinho.
Se este artigo sair igual, não valeu a pena publicá-lo.

Com ele presente, isso vem da entrevista. Sem ele — na quinta-feira automática — vem do
que estiver escrito no `NOTAS-DO-BRUNO.md` e na entrada da fila. **Se não houver nada
escrito, o artigo sai sem material pessoal e diz-se isso na descrição do branch.** Nunca
se inventa uma experiência dele: é a regra 5, e é o único erro deste sistema que não tem
volta, porque sai publicado sob o nome dele.

Sem material pessoal, o que distingue o artigo continua a existir e não é pouco: fonte
primária em vez de fonte secundária, a fragilidade da fonte escrita no texto, o detalhe
específico que os outros deixam cair, e a tabela onde os outros põem parágrafos.

## Antes de começar

Ler `ESCREVER-ARTIGO.md` na raiz do repositório. É a norma; esta skill é o processo.
Em caso de conflito, ganha o `ESCREVER-ARTIGO.md`.

Ler também `ARQUITETURA-DE-ARTIGOS.md`, que decide a forma: qual dos seis formatos, que
comprimento, por que ordem vão as secções, e onde ligar. O modelo de plano no fim desse
ficheiro é o que se preenche na Fase 3, antes de escrever uma linha.

## Fase 0 — Qual é o artigo

```bash
npm run proximo
```

Diz o tema, lendo a fila do `PLANO-EDITORIAL.md` e cruzando-a com o que já está
publicado. **Não se escolhe nem se discute.** Se o Bruno nomeou um tema, esse ganha e o
`proximo` fica para a semana seguinte.

## Fase 1 — Material do Bruno

Há dois modos, e a diferença é só se ele está lá para responder.

### Modo A — com ele presente

**Perguntar em texto simples, numerado. Nunca usar o AskUserQuestion** — ele dispensa-o
e responde melhor a escrever.

**Perguntar em texto simples, numerado. Nunca usar o AskUserQuestion** — ele dispensa-o
e responde melhor a escrever.

Três a cinco perguntas de cada vez, e esperar pela resposta antes de avançar.

**Ronda 1 — o assunto e o ângulo**
1. Qual é a pergunta a que este artigo responde? Escreva-a como a pessoa a escreveria no Google.
2. O que é que já sabe sobre isto que não encontrou escrito em lado nenhum em português?
3. Experimentou isto em si? O quê, durante quanto tempo, e o que aconteceu — incluindo o que não funcionou?

**Ronda 2 — enquadramento**
4. A quem se dirige este artigo em concreto? (quem não dorme por ansiedade, quem trabalha por turnos, quem acorda de madrugada…)
5. Há alguma coisa que os outros sites dizem sobre isto e que o irrita, ou que está errada?
6. Este vai ser o artigo em destaque na página inicial?

Se uma resposta vier vaga, **insistir uma vez**. "Não sei" a todas as perguntas da ronda 1
significa que ainda não há artigo — dizer isso e parar, em vez de escrever um explicador
genérico.

### Modo B — sozinho, na quinta-feira

Ninguém vai responder. Não perguntar, não esperar, não parar.

1. Ler o `NOTAS-DO-BRUNO.md` e procurar entrada para este tema.
2. Ler a entrada do tema no `PLANO-EDITORIAL.md` — algumas já trazem material dele
   registado, como a do `acordar-as-3-da-manha`.
3. Se houver material, usá-lo tal como está escrito, sem o esticar.
4. Se não houver, escrever sem ele. **Não substituir por uma história inventada,
   nem por «muitas pessoas relatam», que é prova social sem prova.**

Depois de publicar o branch, deixar escrito na descrição se o artigo saiu com ou sem
material dele. É por aí que ele decide se quer acrescentar uma secção antes de fazer
merge.

## Fase 2 — Investigação

Antes de escrever uma linha:

- Procurar as **fontes primárias**. O estudo, não o artigo sobre o estudo. DOI ou PubMed.
- Verificar **cada número** que vá aparecer. Se um número muito citado for frágil — vem de
  um livro, de um comunicado, de um estudo com 12 participantes — **escrever no artigo que
  é frágil**. Essa honestidade é a vantagem competitiva do site, não um risco.
- Ver o que ja existe em português sobre o tema e onde falha: quase sempre falta a fonte,
  falta o número, ou falta a aplicação à casa de quem lê (o calor sem ar condicionado, os
  vizinhos, os turnos, os horários reais). Essa falha é o ângulo do artigo.
- Nunca inventar uma fonte, um DOI ou uma estatística. Sem fonte, o número não entra.

## Fase 3 — Checkpoint antes de escrever

**Modo A, com ele presente:** mostrar e **esperar aprovação**. Corrigir aqui é barato;
corrigir depois do artigo escrito é refazer tudo.

**Modo B, sozinho:** não há aprovação para esperar. O plano escreve-se na descrição do
branch e o branch é que é o checkpoint — nunca se faz push para `main`, porque `main`
publica sozinho em produção e isto é conteúdo de saúde com o nome dele à frente.

Em qualquer dos modos, o plano é o mesmo:

- o `titulo` e o `slug` propostos (o slug é o URL e não se muda depois sem partir links)
- a **`resposta`** completa, em ~40 palavras — é o bloco que os motores de IA citam, e é a
  peça mais importante do artigo
- os `##` que vai ter, por ordem
- as fontes encontradas, com o que cada uma sustenta
- o material dele que vai entrar, e de onde veio — ou que não há nenhum

## Fase 4 — Escrever o `.mdx`

`content/artigos/<slug>.mdx`. Slug em minúsculas, sem acentos, com hífenes, igual à
pesquisa sempre que possível.

Frontmatter completo. Obrigatórios: `titulo`, `descricao`, `resposta`, `pilar`, `data`.
Preencher também, porque é o que faz o site ser citado:

- `imagem` + `imagemAlt`
- `passos` — gera o bloco de resumo **e** o schema `HowTo`
- `faq` — gera as perguntas **e** o schema `FAQPage`. Cada resposta tem de fazer sentido
  fora do contexto do artigo, porque é assim que é citada
- `fontes` — com `url` para a fonte primária e uma `nota` de meia linha
- `relacionados` — slugs de artigos do mesmo pilar

**Se levar `destaque: true`, tirar o `destaque` do artigo que o tem hoje.** Só pode haver
um. Verificar com `grep -l "^destaque:" content/artigos/*.mdx`.

Corpo em Markdown, `##` como nível mais alto. Primeiro parágrafo: o problema como a pessoa
o sente — nunca uma introdução sobre a importância do sono. Ligações internas com caminho
absoluto e barra no fim.

## Fase 5 — Capa

1. Escolher uma foto do Unsplash: `https://images.unsplash.com/photo-ID?w=1800&h=1000&fit=crop&auto=format&q=85`
2. **Abrir a imagem e vê-la.** Não é opcional: uma capa errada estraga a página inteira, e
   já aconteceu neste site sair um gato aconchegado num artigo sobre acordar em pânico.
   Se não a conseguir ver, dizê-lo e pedir ao Bruno que escolha.
3. Descarregar: `node scripts/descarregar-imagens.ts`
4. Commitar `public/imagens/artigos/<slug>.*` e `content/imagens.json` junto com o artigo.

## Fase 6 — Publicar

```bash
npm run build
```

O build **falha de propósito** se faltar um campo obrigatório, se o pilar não existir, se
uma data ou URL estiverem mal formados, se houver `imagem` sem `imagemAlt`, ou se um
`relacionados` apontar para um artigo inexistente. Se falhar, corrigir — nunca contornar a
validação.

Compilar não chega. As três verificações a seguir são o que impede este artigo de sair
pior do que os doze que já lá estão:

```bash
npm run verificar
```

Estrutura e linha editorial: cabeçalhos em pergunta, tabela, ligações internas, FAQ,
parágrafos a abrir com pronome solto, grafia, e percentagens sem estudo por perto. **O
alvo é zero avisos** — em 2026-09-02 os doze artigos estavam a zero, e um artigo novo com
avisos baixa a média do site.

```bash
npm run verificar-fontes
```

Valida cada DOI contra o CrossRef e compara o título e o ano registados com o que está
escrito na citação. Apanha o erro que nenhuma leitura apanha: o DOI certo com o título
errado. Não serve pedir o URL ao editor — Wiley, NEJM, Oxford, Science e Annals respondem
403 a robôs, e isso não diz nada sobre o link estar vivo.

```bash
npm run auditar
```

O HTML compilado: títulos, descrições, duplicados, H1, `alt`, canónico, ligações internas
partidas e saltos na hierarquia de cabeçalhos.

Só depois de as três passarem:

**Modo A — com ele presente e com o plano aprovado:**

```bash
git add -A && git commit -m "Artigo: <titulo curto>" && git push
```

`main` publica sozinho em produção.

**Modo B — sozinho, na quinta-feira:**

```bash
git checkout -b artigo/<slug> && git add -A && git commit -m "Artigo: <titulo curto>" && git push -u origin artigo/<slug>
```

**Nunca para `main` neste modo.** `main` deploya para produção sem ninguém ver, e isto é
conteúdo de saúde publicado sob o nome dele. Na descrição do branch: o plano da fase 3, o
resultado das três verificações, e se o artigo saiu com ou sem material dele.

## Fase 7 — Confirmar que ficou online

Só no modo A. No modo B não há nada online para confirmar — o artigo está no branch
à espera dele.

O deploy demora cerca de dois minutos. **Não dizer que está publicado sem verificar no
servidor.** Sondar até responder 200:

```bash
for i in $(seq 1 24); do
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "https://pegarnosono.com/artigos/<slug>/")
  [ "$code" = "200" ] && { echo "ONLINE"; exit 0; }
  sleep 10
done; echo "ainda nao publicado"
```

Confirmar também que a `resposta` e o `FAQPage` saíram no HTML de produção, e dar o link
ao Bruno.

## As regras que não são negociáveis

Não são estilo. São o que separa este site do resto do que existe em português.

1. **Técnicas primeiro, suplementos com a mesma régua.** O site trata de respiração,
   rotinas, luz, temperatura, ruído e horários — e também de suplementos naturais, porque
   as pessoas tomam-nos de qualquer maneira. Ficar calado não é neutralidade: é deixá-las
   decidir com a bula de quem vende.

   O que não muda é a régua. **Um suplemento entra como assunto, nunca como recomendação
   por omissão**, e leva o mesmo tratamento de tudo o resto: fonte primária, e a
   fragilidade dela dita em voz alta. Se a evidência do magnésio é mais fraca do que o
   rótulo sugere, é isso que fica escrito.

   Quatro obrigações em qualquer artigo que toque num suplemento. Sem elas, não sai:

   - **«Natural» não é um selo de segurança, e o artigo di-lo.** A valeriana, o hipericão
     e a melatonina em dose alta interagem com medicação a sério. A palavra «natural» é
     marketing, não farmacologia — e desmontá-la é exatamente o trabalho deste site.
   - **Secção de interações, obrigatória.** A melatonina mexe com antidepressivos ISRS,
     contracetivos, antihipertensores e antidiabéticos. Quem já toma medicação vai ao
     médico ou ao farmacêutico antes de acrescentar seja o que for.
   - **Nunca dose para crianças.** Encaminhar para o pediatra e parar aí.
   - **Disponibilidade e enquadramento em Portugal.** Muito do que se lê vem dos Estados
     Unidos, onde a melatonina se compra ao balcão em gomas de 10 mg. Aqui não é assim, e
     o artigo diz como é.
2. **Aditivo, nunca subtrativo em relação a medicação.** Nunca sugerir reduzir, parar ou
   alterar seja o que for. Interromper benzodiazepinas por conta própria pode causar
   convulsões. Qualquer questão clínica aponta para o médico de família.
3. **Nenhum número sem fonte.** E se a fonte for fraca, dizê-lo no artigo.
4. **Fonte primária.** O estudo, não a notícia sobre o estudo.
5. **Sem prova social inventada.** Nada de subscritores, testemunhos ou resultados
   pessoais que não existam em registo. Nunca inventar dados do sono dele.
6. **Português de Portugal na escrita, sem o anunciar.** A grafia e o vocabulário são
   de Portugal, sempre. Mas o site deixou de se vender pela variante da língua: nenhum
   texto diz "escrito em português de Portugal", e nada exclui quem lê do Brasil, de
   Angola ou de Moçambique. O detalhe local entra como exemplo concreto — "num
   apartamento sem ar condicionado", "com vizinhos por cima" — e não como fronteira.
   O encaminhamento clínico diz de que país é: "em Portugal, a Linha SNS 24 atende no
   808 24 24 24".
7. **Resposta primeiro**, em ~40 palavras, completa e sem rodeios.
8. **Imagens só depois de vistas.**
9. **Fechar clusters.** Acabar um pilar antes de abrir outro. Se ele pedir um artigo de um
   pilar novo com o atual por fechar, dizê-lo uma vez — e depois fazer o que ele decidir.
