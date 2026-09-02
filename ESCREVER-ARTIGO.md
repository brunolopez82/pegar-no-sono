# Como adicionar um artigo

Publicar um artigo = **criar um ficheiro**. Mais nada. Não se toca em menus, listagens,
sitemap, páginas de tema nem dados estruturados — tudo isso se atualiza sozinho a partir
do ficheiro.

```bash
npm run dev
```

## 1. Criar o ficheiro

`content/artigos/<slug>.mdx`

O nome do ficheiro é o URL: `content/artigos/luz-da-manha.mdx` fica em
`pegarnosono.com/artigos/luz-da-manha/`.

Regras do slug: minúsculas, sem acentos, palavras separadas por hífen, e — sempre que
possível — igual à pesquisa que a pessoa faz no Google.

## 2. Preencher o frontmatter

O bloco entre `---` no topo. Cinco campos são obrigatórios; o resto acrescenta-se conforme
o artigo pedir.

| Campo | Obrigatório | Para que serve |
|---|---|---|
| `titulo` | sim | H1 e title da página |
| `descricao` | sim | texto do cartão na listagem. Pode ser longo |
| `meta` | se a `descricao` passar dos 160 | a meta description que vai para o Google. 25 a 160 caracteres |
| `resposta` | sim | resposta direta em ~40 palavras, na caixa do topo |
| `pilar` | sim | **de que assunto é.** Um de: `fundamentos`, `respiracao`, `rotina`, `ambiente`, `ansiedade`, `ritmo-circadiano`, `biohacking`, `medir` |
| `momento` | recomendado | **quando se faz.** Um de: `manha`, `dia`, `fim-de-tarde`, `antes-de-deitar`, `na-cama`, `de-madrugada` |
| `data` | sim | `AAAA-MM-DD` |
| `imagem` | recomendado | capa do artigo: topo da página, tile na listagem e imagem de partilha |
| `imagemAlt` | com `imagem` | descrição da foto para leitores de ecrã. Nunca deixar vazio |
| `atualizado` | não | `AAAA-MM-DD`, quando o artigo for revisto |
| `destaque` | não | `true` põe o artigo em grande na página inicial. Só um de cada vez |
| `passos` | não | gera o bloco "Resumo em passos" **e** o schema HowTo |
| `faq` | não | gera as perguntas frequentes **e** o schema FAQPage |
| `fontes` | não | gera a secção Fontes; ligar sempre à fonte primária |
| `relacionados` | não | lista de slugs. Sem isto, usa-se o resto do pilar |

O tempo de leitura e a contagem de palavras são calculados no build. Não se escrevem.

Se faltar um campo obrigatório, **o build falha com o nome do ficheiro e do campo**. É
propositado: é melhor falhar no build do que publicar um artigo sem resposta direta.

## 3. Escrever o corpo

Markdown normal, por baixo do frontmatter. O `##` mais alto a usar é `h2` — o `h1` é o
título e já está feito.

Ligações internas com caminho absoluto e barra no fim:
`[método 4-7-8](/artigos/metodo-4-7-8-para-adormecer/)`.

## 4. Escolher a imagem

A capa entra em três sítios: no topo do artigo (com o título por cima, a branco), no tile
da listagem, e na pré-visualização quando o link é partilhado.

Do Unsplash, o formato é `https://images.unsplash.com/photo-ID?w=1800&h=1000&fit=crop&auto=format&q=85`.
Antes de a usar: abrir o URL e **ver a fotografia**. Sem imagem, o artigo continua a
funcionar — usa o gradiente do tema no lugar da foto.

## 5. Descarregar a capa

Sempre que acrescentar um artigo **com** `imagem`:

```bash
node scripts/descarregar-imagens.ts
```

Descarrega a foto para `public/imagens/artigos/<slug>.jpg` e escreve as dimensões reais em
`content/imagens.json`. É isso que permite servir a imagem do próprio domínio, sem pedidos
ao Unsplash e sem salto de layout. Ambos os ficheiros são versionados — commitar junto com
o artigo.

Se se esquecer, o site continua a funcionar: cai para o URL remoto do frontmatter.

## 6. Verificar

```bash
npm run build
```

Se compilar, está pronto. O build **falha de propósito** se faltar um campo obrigatório, se
o `pilar` não existir, se uma data ou um URL estiverem mal formados, se houver `imagem` sem
`imagemAlt`, ou se um `relacionados` apontar para um artigo que não existe — sempre com o
nome do ficheiro e do campo.

`git push` para `main` e a Action publica no branch `deploy`.

---

## `descricao` e `meta` também são coisas diferentes

A `descricao` é o texto do cartão nas listagens: pode respirar e ser longo.

A `meta` é o que sai no resultado de pesquisa, e tem um orçamento duro. Os motores cortam
por volta dos **160 caracteres**, e uma descrição cortada a meio é pior do que uma curta.

Se a `descricao` couber nos 160, não é preciso `meta` nenhum — usa-se a `descricao`. Se não
couber, **o build falha** e diz quantos caracteres tem a mais.

```
content/artigos/exemplo.mdx — meta description com 251 caracteres (max 160).
Acrescente um campo `meta` curto; a `descricao` pode continuar longa para o cartão.
```

O mesmo vale para os pilares em `lib/site.ts`, que têm um campo `meta` opcional pela mesma
razão e uma guarda de build igual.

---

## Pilar e momento são eixos diferentes

O `pilar` diz **de que assunto** é o artigo. O `momento` diz **a que horas se faz**.

A respiração diafragmática é do pilar `respiracao` e faz-se `na-cama`. O banho gelado é de
`biohacking` e faz-se de `manha`. São coisas independentes, e é por serem independentes
que mais tarde se consegue montar um protocolo por ordem de relógio a partir dos artigos
que já existem — sem manter lista nenhuma à mão.

Preencher o `momento` sempre que o artigo descreva algo que se **faz**. Um artigo
explicativo (porque é que o sono importa) pode não ter momento nenhum.

---

## As regras editoriais, que não são negociáveis

Isto não é estilo. É o que separa este site do resto do que existe em português.

1. **Técnicas, nunca substâncias.** Respiração, rotinas, luz, temperatura, ruído,
   horários. Sem suplementos, sem chás, sem melatonina.
2. **Aditivo, nunca subtrativo em relação a medicação.** Nunca se sugere reduzir, parar ou
   alterar o que quer que seja. Qualquer questão clínica aponta para o médico de família.
   Todos os artigos levam o aviso — é automático, mas o texto também não deve contradizê-lo.
3. **Nenhum número sem fonte.** Se um número famoso é frágil (vem de um livro e não de um
   ensaio), escreve-se que é frágil. Essa honestidade é a vantagem competitiva, não um risco.
4. **Fonte primária.** Liga-se ao estudo, não ao artigo sobre o estudo. DOI ou PubMed.
5. **Sem prova social inventada.** Nada de contadores de subscritores, testemunhos ou
   resultados pessoais que não existam em registo.
6. **Português de Portugal.** Sempre. Preços em euros, realidade portuguesa, SNS, Linha SNS 24.
   Escrever para a casa do leitor — não comparar com o que outros escrevem.
7. **Resposta primeiro.** O campo `resposta` responde à pergunta por completo em ~40
   palavras. É esse bloco que um motor de IA cita.
8. **Imagens só depois de vistas.** Nunca colar um URL de imagem sem abrir a imagem
   primeiro. Uma capa errada num artigo sobre sono estraga a página inteira.
9. **Fechar clusters.** Acabar um pilar antes de começar outro. Artigos soltos por seis
   temas não ranqueiam para nada.

---

## Modelo para copiar

```mdx
---
titulo: "Título com a pesquisa lá dentro"
descricao: "Uma ou duas frases. Aparece no Google e no cartão da listagem."
resposta: "A resposta completa em cerca de 40 palavras, sem rodeios e sem introdução."
pilar: "respiracao"
momento: "na-cama"
data: "2026-09-05"
imagem: "https://images.unsplash.com/photo-XXXX?w=1800&h=1000&fit=crop&auto=format&q=85"
imagemAlt: "O que se ve na foto, numa frase"
relacionados:
  - "slug-de-outro-artigo"
passos:
  - nome: "Primeiro passo"
    texto: "O que fazer, numa frase."
faq:
  - pergunta: "Uma pergunta tal como é escrita no Google?"
    resposta: "Resposta completa e autónoma, que se percebe fora do contexto do artigo."
fontes:
  - titulo: "Autor et al., Título do estudo, Revista, ano"
    url: "https://doi.org/..."
    nota: "o que este estudo mostra, em meia linha"
---

Primeiro parágrafo: o problema, tal como a pessoa o sente. Sem introduções sobre a
importância do sono.

## Primeiro subtítulo

Corpo do artigo.
```
