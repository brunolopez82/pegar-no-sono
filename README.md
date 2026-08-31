# Pegar no Sono

Blog sobre métodos naturais e não-químicos para dormir melhor — respiração, rotinas,
ambiente e hábitos — para adultos portugueses cujo sono está partido por ansiedade e stress.
Escrito em português de Portugal.

**pegarnosono.com**

---

## Porque é que é estático

O objetivo declarado deste site é ser **citado por respostas de IA**, não apenas indexado
pelo Google. Os crawlers de IA (GPTBot, ClaudeBot, PerplexityBot) na sua maioria não
executam JavaScript: leem o HTML em bruto. Uma SPA entrega-lhes uma página vazia.

Por isso tudo aqui é gerado no build:

- `output: 'export'` — HTML puro em `out/`, sem servidor. Um artigo típico entrega
  **~1900 palavras já no HTML**, antes de qualquer JavaScript correr.
- Dados estruturados por artigo: `Article`, `BreadcrumbList`, e — quando o frontmatter os
  tiver — `HowTo` e `FAQPage`. Nada é inventado: sem `passos` não há HowTo.
- `sitemap.xml` e `robots.txt` gerados a partir do conteúdo real.
- Uma entidade `Person` do autor, ligada por `@id` em todas as páginas. Conteúdo de saúde
  anónimo não é citado.
- Cada artigo abre com uma **resposta direta em ~40 palavras** — o bloco que um motor de IA
  consegue citar inteiro.

## Estrutura

```
app/
  page.tsx                 pagina inicial
  artigos/page.tsx         arquivo completo, agrupado por tema
  artigos/[slug]/page.tsx  o artigo: MDX + schema + FAQ + fontes
  temas/[pilar]/page.tsx   pagina de cluster, uma por pilar
  sobre/  privacidade/     entidade do autor e RGPD
  sitemap.ts  robots.ts    gerados no build
components/                Navbar, Footer, Hero, cartoes, formulario
content/artigos/*.mdx      >>> o conteudo. E' so' isto que se toca para publicar
lib/site.ts                nome, dominio, autor, os seis pilares
lib/artigos.ts             leitura do MDX, tempo de leitura, relacionados
lib/subscribe.ts           ponto unico de ligacao da lista de emails
```

**Adicionar um artigo = criar um ficheiro em `content/artigos/`.** Menus, listagens,
páginas de tema, sitemap e dados estruturados atualizam-se sozinhos.
Ver [ESCREVER-ARTIGO.md](./ESCREVER-ARTIGO.md).

## Comandos

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # gera out/
```

## Publicação

`git push` para `main` dispara a Action `.github/workflows/deploy.yml`, que compila e
publica **apenas o HTML** no branch `deploy`. A Hostinger fica ligada ao branch `deploy`,
nunca ao `main` — assim o alojamento nunca vê `node_modules` nem o código-fonte.

## Lista de emails

Ainda não está ligada, de propósito. O formulário está isolado em `lib/subscribe.ts`:
defina `NEXT_PUBLIC_ENDPOINT_SUBSCRICAO` em `.env.local` e ajuste o corpo do pedido ao
serviço escolhido. Enquanto estiver vazio, o formulário não envia nada e diz isso ao
visitante.

Não há contadores de subscritores nem prova social em lado nenhum deste site, e não devem
ser acrescentados.

## Linha editorial

Detalhe completo em [ESCREVER-ARTIGO.md](./ESCREVER-ARTIGO.md). O essencial:

- **Técnicas, nunca substâncias.**
- **Aditivo, nunca subtrativo em relação a medicação.** Nada aqui serve para iniciar,
  alterar ou interromper um medicamento. Interromper certos medicamentos por conta própria
  é perigoso. Qualquer questão clínica aponta para o médico de família.
- **Nenhum número sem fonte primária.** Quando um número famoso é frágil, escreve-se que é
  frágil — essa honestidade é a vantagem competitiva.
- **Português de Portugal**, sem exceções.
