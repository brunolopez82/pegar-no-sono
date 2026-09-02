# Arquitetura de artigos

Como se desenha um artigo do Pegar no Sono antes de o escrever.

O [ESCREVER-ARTIGO.md](./ESCREVER-ARTIGO.md) diz **onde** vão as coisas e que campos são
obrigatórios. Este documento diz **porquê** e **por que ordem**.

## Uma nota sobre os números deste documento

Não há aqui um único benchmark de indústria. O site não tem tráfego para medir e não vou
inventar médias de mercado — seria contradizer a regra que governa tudo o resto.

O que há são **medições do próprio corpus**: 11 artigos publicados, medidos a 2 de setembro
de 2026. Servem para manter a coerência entre artigos, não como prova de que este formato
converte melhor do que outro. Quando houver Search Console com dados a sério, este
documento passa a ter uma secção de desempenho e esta nota sai.

| | Média | Intervalo |
|---|---|---|
| Palavras | 1353 | 960 – 2402 |
| Secções `##` | 7,3 | 6 – 10 |
| Palavras por secção | 186 | — |
| Perguntas na FAQ | 4,6 | 4 – 5 |
| Passos | 5,0 | 0 – 6 |
| Fontes primárias | 4,5 | 2 – 10 |
| Ligações internas | 2,5 | 0 – 8 |
| Palavras na `resposta` | 44 | 41 – 48 |

---

## 1. Os seis formatos, e quando usar cada um

### Técnica

O formato central. Ensina uma coisa que se faz esta noite.

Leva sempre `passos` (gera schema `HowTo`) e `momento`. Estrutura: origem → mecanismo →
passo a passo → erros → quando não usar → onde encaixa.

Exemplos: `metodo-4-7-8-para-adormecer`, `respiracao-em-caixa-box-breathing`.
Comprimento típico no corpus: 1000–1100 palavras.

### Explicador

Responde a uma pergunta de fundo que sustenta o resto do pilar. Não ensina a fazer nada.

Sem `passos`. Vive de estrutura conceptual e de fontes: é o formato onde entram mais
referências primárias.

Exemplos: `porque-e-que-o-sono-e-importante` (2402 palavras, 10 fontes),
`sono-profundo-e-sono-rem`. Comprimento típico: 1350–2400.

### Desmontagem de mito

Pega numa crença muito repetida, dá-lhe crédito pela parte que tem razão, e mostra
exactamente onde a conta não fecha.

**É o formato com maior vantagem competitiva deste site**, porque exige duas coisas que
quase ninguém junta: ir às fontes primárias e estar disposto a contrariar o que dá mais
cliques. Estrutura: a lógica que toda a gente faz → porque está certa → o número que se
cita → o denominador que ninguém lê → onde se desfaz → a pergunta melhor.

Exemplo: `banho-gelado-emagrece` (2030 palavras, 7 fontes).

### Diagnóstico

O leitor tem um sintoma e não sabe a causa. O artigo separa as causas possíveis e diz qual
é qual.

Assinatura: uma promessa numerada logo na `resposta` — *"quase sempre é uma de quatro
coisas"* — e uma secção por causa. Tem de encaminhar explicitamente para o médico na causa
que é clínica.

Exemplo: `dormir-8-horas-e-acordar-cansado`.

### Comparação

Duas coisas que as pessoas confundem. Separa-as e diz o que fazer com a diferença.

Exemplo: `sono-profundo-e-sono-rem`.

### Registo n=1

**Ainda não existe no site, e é o maior activo por explorar.**

Um modelo de linguagem reconstrói qualquer um dos cinco formatos acima a partir de fontes
públicas. Não consegue reconstruir catorze noites dos teus registos. É o único formato
estruturalmente impossível de copiar.

Requisito de entrada: dados reais registados, com o método e as falhas à vista. Sem
registos, não se escreve — nem os que dariam jeito.

### O que não se escreve aqui

**Listicles** ("15 dicas para dormir melhor"). São o que já satura o SERP, são o que uma IA
resume em duas linhas, e não têm nada que só este site possa dizer.

**Opinião pura.** Sem credencial clínica, opinião sobre sono não vale nada. O que vale é
ler as fontes e reportá-las com honestidade — inclusive quando são fracas.

---

## 2. Comprimento

**A regra: o comprimento segue a pergunta, não um alvo.** Um artigo escrito para chegar às
2000 palavras enche-se, e enchimento é a primeira coisa que um leitor às duas da manhã
detecta.

Os intervalos abaixo são descritivos do corpus, não metas:

| Formato | Palavras |
|---|---|
| Técnica | 950 – 1100 |
| Diagnóstico / comparação | 1350 – 1500 |
| Explicador / desmontagem | 2000 – 2400 |

**Se um artigo de técnica passar das 1400 palavras**, quase sempre são dois artigos. O
`respiracao-diafragmatica-para-dormir` nasceu assim: era uma secção do 4-7-8 que não cabia.

**Se um explicador ficar abaixo das 1200**, provavelmente não respondeu à pergunta — só a
enunciou.

---

## 3. Arquitectura do plano, antes de escrever

Sete decisões, por esta ordem. Nenhuma linha de texto antes de as sete estarem tomadas.

1. **A pergunta**, escrita como a pessoa a escreve no Google. É o `titulo` e é o `slug`.
2. **A `resposta`**, em ~40 palavras, completa. Se não se consegue responder em 40 palavras,
   ainda não se percebeu o assunto o suficiente para escrever 1300.
3. **O formato**, dos seis acima.
4. **As fontes primárias**, verificadas, com o que cada uma sustenta — e o que **não**
   sustenta.
5. **O que só o Bruno pode escrever.** Se a resposta for "nada", o artigo é um explicador
   genérico e vale a pena adiá-lo.
6. **Os `##`, por ordem**, com uma frase a dizer o que cada um faz.
7. **O `momento` e o `pilar`.** Onde encaixa no dia e no mapa.

Escrever a `resposta` no passo 2, antes do corpo, não é detalhe. É o teste de que existe
artigo: obriga a ter uma tese antes de ter parágrafos.

---

## 4. Cabeçalhos

**`##` é o nível mais alto do corpo.** O `#` é o `titulo`, gerado. `###` só dentro de uma
secção longa que tenha mesmo subpartes — no corpus, sete dos onze artigos não usam nenhum.

**Densidade medida: ~186 palavras por secção.** Uma secção acima das 400 quer quase sempre
dividir-se; abaixo das 80, quer fundir-se com a vizinha.

**Um cabeçalho é uma afirmação, não uma etiqueta.** É a diferença entre um índice legível e
uma lista de substantivos:

| Etiqueta | Afirmação |
|---|---|
| "Evidência" | "O que a evidência mostra — e o que não mostra" |
| "Origem" | "Os 350% que toda a gente cita" |
| "Considerações" | "Onde a conta se desfaz de vez" |

Quem lê em diagonal — que é quase toda a gente — lê só os `##`. Se a sequência de
cabeçalhos, lida sozinha, já contar a história, o artigo está bem estruturado. Se não
contar, o problema é de estrutura, não de escrita.

**A hierarquia é validada no build.** Saltar de `h1` para `h3` parte o build. Ver
`npm run auditar`.

---

## 5. Introdução

**Regra única: o sintoma antes do tema.** O primeiro parágrafo descreve o que a pessoa
sente, não o assunto do artigo.

Nunca:

> O sono é um dos pilares da saúde e afecta todos os aspectos da nossa vida.

Sim:

> Deita-se cansado e, mal apaga a luz, a cabeça arranca. Amanhã, a conversa de ontem, a
> fatura por pagar.

O leitor tem de se reconhecer na primeira frase. Se se reconhecer, dá-te os dois minutos
seguintes.

**Três a cinco parágrafos, e depois o primeiro `##`.** A caixa da `resposta` já está no topo
da página, portanto quem quer só o essencial já o teve — a introdução não tem de o repetir,
tem de dar razão para continuar.

**O ângulo entra no segundo ou terceiro parágrafo.** É a promessa de que este artigo não é
igual aos outros oito resultados: *"o número que toda a gente cita é mais frágil do que
parece"*.

---

## 6. Corpo

Sequência que funciona nos cinco formatos que não são n=1:

1. **Reconhecimento** — o problema como se sente
2. **Mecanismo** — porque acontece, em linguagem física e concreta
3. **Prova** — o que os estudos mostram, com a força real deles
4. **Limite** — onde a prova acaba e começa a extrapolação
5. **Aplicação** — o que fazer, quando, e o que esperar
6. **Encaminhamento** — quando isto não chega e é caso para médico

O passo 4 é o que distingue este site. Quase todo o conteúdo salta do 3 para o 5.

**Transições:** cada secção fecha a deixar uma pergunta aberta que a seguinte responde.
*"Provam que os ingredientes não são fantasia"* → a secção seguinte trata dos erros que
fazem a coisa falhar mesmo assim.

**Um número por secção, no máximo.** Três percentagens num parágrafo não são rigor, são
ruído — e nenhuma fica.

**Negrito para a frase que se leva**, não para palavras-chave. Quem folheia lê os `##` e os
negritos; esses dois, juntos, têm de dar o artigo.

---

## 7. Pontos de quebra

Não tenho dados de scroll do site. O que se segue são pontos **estruturais** — sítios onde
o texto dá ao leitor uma razão para sair — e o que os fecha.

**Logo a seguir à caixa da `resposta`.** O leitor já tem a resposta. Porquê continuar?
→ O primeiro parágrafo tem de prometer alguma coisa que a resposta não deu: um porquê, um
número frágil por desmontar, um erro comum.

**Aos 30–40%, quando entra o mecanismo.** É onde o texto fica abstracto.
→ Uma citação em destaque com a ideia toda numa frase. No corpus há uma por artigo, quase
sempre aqui. *"A expiração é o travão."*

**A meio da secção de evidência.** Nomes de estudos e ressalvas cansam.
→ Partir em lista curta. As quatro ressalvas do `respiracao-diafragmatica` são quatro linhas
de lista, não um parágrafo — sobrevivem à leitura em diagonal.

**Antes da FAQ.** O leitor sente que o artigo acabou.
→ O bloco de passos entra aqui: é a parte prática e é a que se guarda no telemóvel.

**Ponto de saída legítimo: o fim.** Um leitor que sai depois de ter o que precisava não é
uma falha. A conclusão não serve para o prender, serve para lhe dizer o que fazer a seguir.

---

## 8. Conclusão

**Nunca um resumo.** Quem chegou ao fim não precisa que se repita o meio.

Três coisas, por esta ordem:

1. **A resposta outra vez, mais dura.** *"Não de forma que interesse."*
2. **A reformulação da pergunta.** O que o leitor devia ter perguntado em vez do que
   perguntou. É aqui que se ganha a confiança dele.
3. **Uma acção para esta noite.** Concreta, gratuita, e possível sem mudar de vida.

Depois disso, e sempre: o aviso clínico. É automático no template, mas o texto não pode
contradizê-lo.

**Não há CTA de venda.** O único pedido é a subscrição, e vive no rodapé do artigo, não no
meio. Um artigo que interrompe a explicação para pedir o email perde as duas coisas.

---

## 9. Imagens

**Capa:** obrigatória sempre que exista uma que não minta. `imagem` + `imagemAlt` — o build
falha se houver imagem sem descrição. Descarregada para o próprio domínio por
`scripts/descarregar-imagens.ts`, em quatro larguras e WebP.

**Regra de escolha, aprendida à custa:** ver a fotografia antes de a usar. Já entrou um gato
aconchegado num artigo sobre acordar em pânico. E rejeitar clichés — silhuetas ao pôr do
sol, meditação em retiro — que contradizem o tom de um site que se define por não ter hype.

**Sem capa, o artigo não parte:** cai para o gradiente do pilar, que é comportamento
previsto. É preferível a uma foto errada.

**Imagens no corpo:** ainda não há nenhuma no site. Onde valem a pena, por ordem de retorno:

1. **Diagrama de mecanismo** — o diafragma a descer, as fases da noite. Substitui parágrafos.
2. **Tabela comparativa** — já se usa em Markdown e funciona.
3. **Fotografia ilustrativa a meio** — a de menor retorno. Se não acrescenta compreensão, é
   peso.

O que o Bing pede aqui é explícito: a imagem reforça o texto, nunca é a única fonte da
informação.

---

## 10. Ligações internas

Média actual: **2,5 por artigo**. Distribuição desigual — o explicador de fundamentos tem 8,
o banho gelado tem 0, por ser o primeiro do pilar.

**Três regras:**

1. **Para trás, sempre.** Um artigo novo liga aos que o sustentam. O 4-7-8 liga à
   diafragmática porque assume a mecânica dela.
2. **Para a frente, nunca a vazio.** Não se liga a um artigo que ainda não existe. Menciona-se
   sem link.
3. **No sítio onde a pergunta nasce**, não numa lista no fim. A ligação boa é a que responde a
   uma dúvida no momento em que o leitor a tem.

**Dois eixos para encontrar candidatos:**

- **`pilar`** — mesmo assunto. Liga por profundidade.
- **`momento`** — mesma hora do dia, assunto diferente. Liga por contexto: a respiração em
  caixa (`antes-de-deitar`) e o banho gelado (`manha`) são pilares diferentes, mas ambos
  vivem no protocolo de um dia.

O campo `relacionados` alimenta o bloco "A seguir" no fim. **É validado no build:** um slug
que não exista parte a compilação.

**Alvo prático:** 3 a 5 ligações num artigo de 1300 palavras. Abaixo de 2, o artigo está
isolado. Acima de 8, está a distrair.

---

## 11. Ser citado, não só indexado

O SEO clássico ganha-se com uma página que responde bem. O **AEO** — otimização para
motores de resposta: AI Overviews, ChatGPT, Perplexity, Copilot — ganha-se com uma página
de onde se consegue **arrancar um pedaço** e usá-lo isolado, sem o resto.

São objetivos diferentes e ambos se servem da mesma escrita, desde que se respeitem seis
regras.

### 11.1. Cada afirmação tem de sobreviver sozinha

É a regra que muda mais texto. Um motor de resposta extrai um parágrafo e mostra-o fora do
contexto. Se esse parágrafo depender do anterior, chega ao leitor partido.

| Não sobrevive | Sobrevive |
|---|---|
| "Isso acontece porque o corpo arrefece." | "A temperatura do corpo desce cerca de um grau antes de adormecer." |
| "Como vimos, o número é frágil." | "O número dos 96% vem de um livro de 1981, não de um ensaio clínico." |
| "Ele recomenda quatro ciclos." | "Andrew Weil recomenda quatro ciclos de 4-7-8, duas vezes por dia." |

**Teste prático:** tapar tudo menos um parágrafo. Se ficar ambíguo — "isso", "ele", "como
vimos", "este método" sem nome — reescrever com o sujeito explícito.

Não significa repetir o nome em todas as frases. Significa que **o primeiro parágrafo de
cada `##`** tem de nomear o assunto.

### 11.2. Definir antes de discutir

Um motor de resposta procura definições. Quando um artigo introduz um conceito, a primeira
frase define-o na forma **"X é Y"**:

> A respiração em caixa é uma sequência de quatro fases iguais: inspirar quatro tempos,
> segurar quatro, expirar quatro, segurar quatro.

Só depois se discute origem, evidência ou variantes.

### 11.3. Cabeçalhos com a forma da pergunta

Quando a secção responde a uma pergunta que as pessoas fazem, o `##` **é** essa pergunta.
Quando não, mantém-se a afirmação (regra 4).

| Secção sobre | Cabeçalho |
|---|---|
| Dose | "Quantas vezes por dia se deve fazer?" |
| Segurança | "Quem não deve fazer isto" |
| Mecanismo | "Porque é que a expiração longa acalma" |

Mistura-se: um artigo todo em perguntas lê-se mal. Duas a três por artigo chegam.

### 11.4. Números com unidade, intervalo e fonte na mesma frase

Um número solto não é citável — não se sabe de onde veio. Um número com origem é.

> Um ensaio de 2016 com 3018 participantes encontrou menos 29% de dias de baixa, mas
> nenhuma redução dos dias de doença.

Contém quem, quando, quantos, o resultado e o limite. É extraível inteiro.

### 11.5. Tabelas para tudo o que é comparação

São o formato que os motores de resposta extraem melhor e o que o leitor em diagonal lê
primeiro. Sempre que houver duas ou mais coisas com os mesmos atributos — técnicas,
fases do sono, causas de um sintoma — é tabela, não prosa.

### 11.6. A FAQ é conteúdo, não apêndice

Cada `resposta` da FAQ tem de **fazer sentido isolada**, porque é assim que é citada: sem o
título do artigo, sem a pergunta ao lado, sem nada antes.

Regras: 40 a 70 palavras, começa por responder, repete o assunto por nome, e não diz "como
explicado acima".

### O que já é automático

Não é preciso pensar nisto — o sistema trata:

- `resposta` no topo, em ~40 palavras — o bloco que os motores citam inteiro
- schema `Article`, `HowTo`, `FAQPage`, `BreadcrumbList`, `Person`
- `llms.txt`, `feed.xml`, `sitemap.xml`
- `robots.txt` a convidar GPTBot, ClaudeBot, PerplexityBot e OAI-SearchBot
- HTML estático: ~1900 palavras entregues antes de correr JavaScript

### Checklist de reescrita

Um artigo está pronto quando:

- [ ] a `resposta` responde por completo em 40 palavras, sem rodeios
- [ ] cada `##` nomeia o assunto no primeiro parágrafo
- [ ] nenhum parágrafo começa por "isso", "isto", "ele" ou "como vimos"
- [ ] cada conceito novo tem uma frase "X é Y" antes de ser discutido
- [ ] duas a três secções têm forma de pergunta
- [ ] cada número tem quem, quando e quantos na mesma frase
- [ ] toda a comparação está em tabela
- [ ] cada resposta da FAQ se percebe fora do artigo
- [ ] 3 a 5 ligações internas, no sítio onde a dúvida nasce
- [ ] `momento` preenchido se o artigo descreve algo que se faz

---

## Modelo de plano

Para colar e preencher antes de escrever.

```
PERGUNTA (como se escreve no Google):
SLUG:
FORMATO:            técnica | explicador | mito | diagnóstico | comparação | n=1
PILAR:              MOMENTO:
RESPOSTA (~40 palavras):

FONTES
  1. [autor, revista, ano] — sustenta: … | NÃO sustenta: …
  2.

O QUE SÓ EU POSSO ESCREVER:

SECÇÕES
  ## …                    (reconhecimento)
  ## …                    (mecanismo)
  ## …                    (prova)
  ## …                    (limite da prova)
  ## …                    (aplicação)
  ## …                    (quando não chega)

CITAÇÃO EM DESTAQUE (a ideia toda numa frase):
PASSOS: … | FAQ: … | LIGAÇÕES INTERNAS: …
ACÇÃO PARA ESTA NOITE:
```
