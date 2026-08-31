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
| `descricao` | sim | meta description e texto do cartão na listagem |
| `resposta` | sim | resposta direta em ~40 palavras, na caixa do topo |
| `pilar` | sim | um de: `respiracao`, `rotina`, `ambiente`, `ansiedade`, `ritmo-circadiano`, `medir` |
| `data` | sim | `AAAA-MM-DD` |
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

## 4. Verificar

```bash
npm run build
```

Se compilar, está pronto. `git push` para `main` e a Action publica no branch `deploy`.

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
7. **Resposta primeiro.** O campo `resposta` responde à pergunta por completo em ~40
   palavras. É esse bloco que um motor de IA cita.
8. **Fechar clusters.** Acabar um pilar antes de começar outro. Artigos soltos por seis
   temas não ranqueiam para nada.

---

## Modelo para copiar

```mdx
---
titulo: "Título com a pesquisa lá dentro"
descricao: "Uma ou duas frases. Aparece no Google e no cartão da listagem."
resposta: "A resposta completa em cerca de 40 palavras, sem rodeios e sem introdução."
pilar: "respiracao"
data: "2026-09-05"
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
