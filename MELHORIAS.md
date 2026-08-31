# Prompts para melhorar o "Pegar no Sono"

Contexto que todos os prompts assumem (não repetir ao assistente, mas ele deve
respeitar): é um blog em **Next.js 15, App Router, TypeScript, Tailwind**,
com `output: 'export'` (HTML estático em `out/`), conteúdo em `.mdx` dentro de
`content/artigos/` lido via `gray-matter`, frontmatter com campos obrigatórios
validado em `lib/artigos.ts`, e um sistema de "pilares" definido em
`lib/site.ts`. O objetivo declarado do site é ser citado por IAs — nenhuma
sugestão deve exigir servidor, API routes dinâmicas em runtime, ou abandonar o
export estático.

Cola cada prompt separadamente. São independentes entre si.

---

## 1. Fechar o cluster "Respiração" antes de abrir outro pilar

```
Estás a trabalhar no repositório "pegar-no-sono", um blog Next.js 15 App
Router com export estático. O pilar "respiracao" (lib/site.ts) já tem 3
artigos em content/artigos/: metodo-4-7-8-para-adormecer,
respiracao-em-caixa-box-breathing, tecnica-militar-para-adormecer-em-dois-minutos.

A descrição do pilar em lib/site.ts menciona "respiração diafragmática" mas
não existe artigo sobre isso. Segue o formato exato de
ESCREVER-ARTIGO.md e o modelo de metodo-4-7-8-para-adormecer.mdx (frontmatter
completo: titulo, descricao, resposta ~40 palavras, pilar, data, imagem
Unsplash já vista, imagemAlt, passos, faq, fontes com DOI/PubMed) e escreve
o artigo "respiracao-diafragmatica-para-dormir.mdx". Respeita as regras não
negociáveis do ficheiro: técnicas nunca substâncias, aditivo nunca subtrativo
em relação a medicação, nenhum número sem fonte primária, português de
Portugal. Liga-o como relacionado aos 3 artigos existentes e atualiza os
`relacionados` deles para o incluir.
```

---

## 2. Impedir que pilares vazios sejam indexados como "thin content"

```
No repositório "pegar-no-sono" (Next.js App Router, export estático), os
pilares em lib/site.ts que ainda não têm artigos (rotina, ambiente,
ansiedade, ritmo-circadiano, medir) geram páginas em
app/temas/[pilar]/page.tsx e entram no sitemap (app/sitemap.ts) com
priority 0.8, mesmo estando vazios.

Sem mudar a arquitetura estática: altera app/sitemap.ts para só incluir um
tema se artigosDoPilar(pilar).length > 0, e em app/temas/[pilar]/page.tsx
adiciona `robots: { index: false }` no generateMetadata quando o pilar
estiver vazio (mantendo a página acessível por navegação interna, só sem
indexação). Em components/GrelhaPilares.tsx, marca visualmente os pilares
vazios como "brevemente" em vez de um link normal para uma listagem vazia.
Não altera lib/artigos.ts nem a lógica de leitura de MDX.
```

---

## 3. Favicon, ícone Apple e manifest (convenções do App Router)

```
No repositório "pegar-no-sono" (Next.js 15 App Router) não existe nenhum
favicon, apple-touch-icon nem manifest. Usa as convenções de ficheiro do App
Router: cria app/icon.png (512x512, monograma preto sobre fundo
--background, coerente com o estilo bento/Montserrat já usado no resto do
site — vê components/SobreAutor.tsx para o monograma do autor como
referência de estilo), app/apple-icon.png, e app/manifest.ts a exportar um
MetadataRoute.Manifest com name, short_name, theme_color e background_color
tirados de lib/site.ts. Não uses pacotes externos de geração de ícones;
gera os PNG com o que já está disponível no projeto (sharp já é dependência
transitiva do Next.js, podes usá-lo num script one-off).
```

---

## 4. Imagem OG por defeito para páginas sem imagem própria

```
No repositório "pegar-no-sono" (Next.js App Router, output: 'export'), só as
páginas de artigo com campo `imagem` no frontmatter têm imagem Open Graph
(ver generateMetadata em app/artigos/[slug]/page.tsx). A homepage, /sobre/ e
as páginas de /temas/[pilar]/ não têm nenhuma imagem ao partilhar.

Como o site é 100% export estático, não uses next/og com rota dinâmica em
runtime (não existe servidor). Em vez disso: cria um ficheiro estático
public/og-default.png (1200x630, usa o gradiente --grad-cta e o nome do site
de lib/site.ts como referência visual, à mão ou com um script que corre só
no build) e usa-o como `openGraph.images` fallback em app/layout.tsx e em
qualquer generateMetadata que hoje não define `images`. Os artigos com
`imagem` própria continuam a usá-la; só os que não têm ficam com este
fallback.
```

---

## 5. Imagens de artigo: sair da dependência total do Unsplash

```
No repositório "pegar-no-sono", os artigos usam URLs diretas do Unsplash
(https://images.unsplash.com/photo-ID?w=1800&...) no campo `imagem` do
frontmatter, e app/artigos/[slug]/page.tsx renderiza-as com uma tag <img>
simples, sem width/height explícitos (next.config.mjs já tem
images.unoptimized: true por causa do export estático).

Sem sair do output: 'export': cria um script em scripts/descarregar-imagens.ts
(corrido manualmente ou num passo do build) que lê todos os artigos via
todosOsArtigos() (lib/artigos.ts), descarrega cada `imagem` uma única vez
para public/imagens/artigos/<slug>.jpg, e passa a app/artigos/[slug]/page.tsx
e components/CartaoArtigo.tsx a usar next/image (com unoptimized, já que
está no next.config.mjs) apontando para o ficheiro local, com width/height
reais da imagem para eliminar layout shift. O campo `imagem` no frontmatter
mantém-se a fonte da verdade; o script só faz cache local.
```

---

## 6. Validação de frontmatter mais rigorosa que "o campo existe"

```
Em lib/artigos.ts, do repositório "pegar-no-sono", a função `ler()` só
verifica que os campos obrigatórios (titulo, descricao, resposta, pilar,
data) existem — não valida tipos, nem que `pilar` é um PilarSlug válido, nem
que os slugs em `relacionados` apontam para artigos que existem, nem que os
`url` em `fontes` e `imagem` são URLs bem formados.

Introduz o Zod como dependência (já é comum em projetos Next.js e não afeta
o output: 'export') e define um schema que valide o frontmatter completo em
lib/artigos.ts, incluindo uma segunda passagem depois de `todosOsArtigos()`
estar carregado que confirme que cada slug em `relacionados` de cada artigo
corresponde a outro artigo existente. Em caso de erro, lança com a mesma
disciplina que já existe hoje: mensagem com o nome do ficheiro e do campo,
para o build falhar alto e claro — nunca publicar em silêncio.
```

---

## 7. Feed RSS estático

```
No repositório "pegar-no-sono" (Next.js App Router, output: 'export') não
existe feed RSS. Segue o padrão já usado em app/sitemap.ts e app/robots.ts
(export const dynamic = "force-static") e cria app/feed.xml/route.ts que
devolve XML RSS 2.0 válido com todosOsArtigos() (lib/artigos.ts): título,
link, descricao, resposta como <description>, data de publicação e pilar
como categoria. Usa site.dominio e site.nome de lib/site.ts. Liga o feed no
<head> de app/layout.tsx com um <link rel="alternate" type="application/rss+xml">
e refere-o em app/robots.ts.
```

---

## 8. Pesquisa interna sem sair do estático

```
No repositório "pegar-no-sono", o site é 100% estático (output: 'export'),
sem backend. Quero pesquisa interna por título/descrição/pilar sem quebrar
isso. Gera no build um índice JSON leve (slug, titulo, descricao, pilar) a
partir de todosOsArtigos() (lib/artigos.ts) — pode ser em
public/indice-pesquisa.json, gerado por um pequeno script no build — e cria
um Client Component isolado (ex.: components/Pesquisa.tsx, com "use client")
que carrega esse JSON e filtra em memória com uma correspondência simples de
substring (não precisas de nenhuma biblioteca de pesquisa para o volume
atual de artigos). Mantém o resto do site inteiramente server-rendered/estático;
só este componente é interativo.
```

---

## 9. Auditoria de contraste dos gradientes de pilar

```
No repositório "pegar-no-sono", cada pilar em lib/site.ts tem um
`gradiente` (var(--grad-roxo), --grad-verde, --grad-azul, --grad-pessego,
--grad-areia, --grad-rosa, definidos em app/globals.css) usado como fundo em
app/temas/[pilar]/page.tsx e no cabeçalho de artigo sem imagem em
app/artigos/[slug]/page.tsx, com texto a preto ou branco por cima. Verifica
o contraste de cada gradiente (no ponto mais claro e mais escuro do próprio
gradiente) contra o texto que é sobreposto, segundo WCAG AA (4.5:1 para
texto normal, 3:1 para texto grande/bold). Reporta quais falham e ajusta só
os valores em app/globals.css (não a estrutura dos componentes) até
passarem.
```
