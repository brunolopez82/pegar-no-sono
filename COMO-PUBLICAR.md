# Como publicar — do ficheiro ao site online

Duas coisas: uma configuração que se faz **uma vez**, e o procedimento que se repete a
cada artigo.

Para escrever o artigo em si, ver [ESCREVER-ARTIGO.md](./ESCREVER-ARTIGO.md).

---

## Passo único: ligar a Hostinger ao repositório

**hPanel → Websites → Dashboard → Advanced → Git**

| Campo | Valor |
|---|---|
| Repositório | `brunolopez82/pegar-no-sono` |
| Branch | **`deploy`** |
| Root directory | `public_html` |

### O branch tem de ser `deploy`, nunca `main`

Esta é a única forma de partir o site, por isso fica escrita em voz alta.

- `main` — o projeto: código-fonte, `package.json`, `app/`, `content/`. Não é um site.
  Apontar a Hostinger para aqui deixa a página em branco.
- `deploy` — só o HTML compilado, já com `.htaccess`, `sitemap.xml` e `robots.txt`.
  É este que o alojamento serve.

Depois de ligado, a Hostinger cria o webhook sozinha: cada push para `deploy` dispara um
deployment automático.

---

## Procedimento por artigo

**1. Criar o ficheiro**

`content/artigos/o-slug-do-artigo.mdx` — modelo pronto a copiar em
[ESCREVER-ARTIGO.md](./ESCREVER-ARTIGO.md).

**2. Ver como ficou**

```bash
npm run dev
```

**3. Se o artigo tiver capa, descarregá-la**

```bash
node scripts/descarregar-imagens.ts
```

**4. Publicar**

```bash
git add -A && git commit -m "Artigo: o-slug-do-artigo" && git push
```

Acabou. Não se toca em mais nada.

---

## O que acontece sozinho

```
push para main
   ↓  ~20s   GitHub Actions arranca
   ↓  ~60s   npm ci + next build  (gera out/)
   ↓         force-push do HTML compilado para o branch deploy
   ↓  ~10s   webhook da Hostinger dispara
   ↓         Hostinger puxa o deploy para public_html
online em ~90 segundos
```

O artigo aparece sozinho em **sete** sítios:

1. Página própria em `/artigos/<slug>/`
2. Cartão na página inicial
3. Listagem em `/artigos/`
4. Página do tema em `/temas/<pilar>/`
5. `sitemap.xml`
6. Dados estruturados — `Article`, e `HowTo` / `FAQPage` conforme o frontmatter
7. Imagem de partilha (Open Graph / Twitter)

Não há nenhuma lista para manter à mão. Estado dos builds:
[Actions do repositório](https://github.com/brunolopez82/pegar-no-sono/actions).

---

## Na primeira publicação, confirmar o webhook

A Action faz o push para `deploy` com o token do GitHub. Em certos casos o GitHub não
propaga pushes feitos com esse token para integrações externas — e é o único elo desta
corrente que não se consegue testar sem publicar a sério.

Dois minutos depois do primeiro push, abrir o site:

- **Atualizou** → está tudo automático. Nunca mais é preciso pensar nisto.
- **Não atualizou** → o build está bom (confirma-se no branch `deploy`); o que falhou foi
  só o aviso à Hostinger. Duas saídas, ambas rápidas:
  1. trocar o `GITHUB_TOKEN` do workflow por um PAT pessoal, ou
  2. passar o deploy para FTP direto, que dispensa webhook e dispensa o branch `deploy`
     (há um exemplo pronto em `exemplos/deploy-hostinger.yml`, fora deste repositório).

---

## Se o site não muda depois de publicar

Verificado a 31/08/2026: a CDN da Hostinger guardou o `index.html` com
`s-maxage=31536000` — validade de um ano — e continuou a servir a versão anterior
mesmo com os ficheiros novos já no servidor.

**Como distinguir "não fez deploy" de "está em cache".** Pedir a página com uma query
string, que a CDN não tem em cache:

```bash
curl -s "https://pegarnosono.com/?bust=$(date +%s)" | grep -o "<title>.*</title>"
```

- Sai o conteúdo **novo** → o deploy correu bem; o problema é só a cache.
- Sai o conteúdo **antigo** → aí sim, o deploy falhou. Ver o branch `deploy` no GitHub.

Ver os cabeçalhos, para confirmar:

```bash
curl -sI https://pegarnosono.com/ | grep -i "x-hcdn-cache-status\|age\|cache-control"
```

`x-hcdn-cache-status: HIT` com um `Age` alto = está a ser servido da cache.

**Resolver:** hPanel → Websites → Dashboard → Performance → CDN → **Purge cache**.

**Resolver de vez**, para não repetir a cada artigo: no mesmo painel, desligar a cache de
HTML, ou **Disable** na CDN. Para um site estático e pequeno com público português, a CDN
acrescenta pouco e é a origem deste problema.

### O `.htaccess` não funciona neste alojamento — verificado

Testado a 31/08/2026 em pedidos que chegaram à origem (`x-hcdn-cache-status: DYNAMIC`,
sem cache pelo meio). Nenhuma directiva do `public/.htaccess` tem efeito:

| Directiva | Resultado |
|---|---|
| `Header always set X-Origem-Htaccess` | o cabeçalho não chega ao cliente |
| `RewriteRule` de www para o domínio | não redireciona, devolve 200 |
| `ErrorDocument 404` | 404 genérico, não o do site |

Prova decisiva: `/sobre` redireciona com **308**. O Apache a executar
`RewriteRule [R=301]` devolveria **301**. O 308 vem da camada de edge da Hostinger.

**Conclusão: o site é servido pela CDN, que trata dos redirecionamentos, ignora o
`.htaccess` e impõe `s-maxage=31536000` ao HTML.** O ficheiro fica no repositório porque
volta a ser útil em qualquer alojamento Apache normal, mas aqui é inerte — não percas
tempo a afiná-lo. A correcção é sempre no painel.

### Consequência: www e domínio podem divergir

A CDN guarda uma cópia por hostname. A 31/08/2026 `pegarnosono.com` servia a versão nova
e `www.pegarnosono.com` continuava na primeira versão, com ETags diferentes. Como o
`.htaccess` não pode redirecionar, o www tem de ser tratado no painel da Hostinger — ou
apontado para o domínio, ou não usado de todo.

---

## Indexação

**Google** — descobre pelo `sitemap.xml`, que o `robots.txt` já declara. Submeter uma vez
em [Search Console](https://search.google.com/search-console) → Sitemaps → `sitemap.xml`.
Escolher propriedade do tipo **Domínio**, não Prefixo de URL: cobre o www e o não-www de
uma vez.

**Bing, Yandex, Seznam, Naver** — avisados automaticamente a cada deploy pelo passo
IndexNow do workflow, que submete todos os URLs do sitemap. Não é preciso fazer nada.

A chave do IndexNow vive em dois sítios que **têm de coincidir**:

- `public/e21db589dfd8f6a4b157daf462a26e93.txt` (o conteúdo do ficheiro é o próprio nome,
  sem extensão)
- a variável `CHAVE` no passo "Avisar o IndexNow" em `.github/workflows/deploy.yml`

Se mudar uma, mudar a outra. Com as duas dessincronizadas o IndexNow devolve 403 e o passo
falha em silêncio — de propósito, porque um ping falhado não é motivo para marcar um deploy
como vermelho.

### "Discovered but not crawled" no Bing

Não é uma avaria. Quer dizer que o Bing sabe que o URL existe e ainda não o foi buscar. Num
domínio novo e sem ligações de fora, é o estado normal durante dias ou semanas, e a
redacção do painel ("URL cannot appear on Bing") é mais alarmante do que a situação.

Antes de procurar culpados, confirmar que o servidor responde ao robô:

```bash
curl -s -o /dev/null -w "%{http_code}
" -A "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)" https://pegarnosono.com/
```

200 significa que o problema não é do site. O que resolve a sério é o IndexNow, tempo, e
pelo menos uma ligação de fora a apontar para o domínio.

---

## Scripts do repositório

Nenhum destes corre no build. São ferramentas para correr à mão, e o resultado fica
versionado.

| Script | Quando |
|---|---|
| `npm run auditar` | depois de um `npm run build`, para verificar o HTML já compilado |
| `node scripts/descarregar-imagens.ts` | sempre que um artigo novo tiver `imagem` |
| `node scripts/auditar-contraste.mjs` | ao mexer nos gradientes ou na opacidade de texto |
| `node scripts/gerar-icones.mjs` | se a marca mudar (favicon, ícone Apple, manifest) |
| `node scripts/gerar-og.mjs` | se o nome do site ou a paleta mudarem |

---

## Auditoria on-page

```bash
npm run build && npm run auditar
```

Verifica o HTML já compilado, que é o que o crawler vê: comprimento e duplicação de
`<title>` e `meta description`, um único `H1` por página, imagens sem `alt`, canonical
presente e a apontar para si própria, e ligações internas para páginas que não existem.

Páginas com `noindex` são ignoradas nas verificações de indexação — uma página fora do
índice não precisa de canonical nem compete com nenhuma outra.

O que esta auditoria apanha **depois** do build, as guardas do `lib/artigos.ts` e do
`lib/site.ts` apanham **durante** — e essas partem a build. A auditoria é a rede de
segurança para o que ainda não tem guarda.

---

## Regras de ouro

**Nunca correr `npm run build` com o `npm run dev` ligado.** Os dois escrevem na mesma
pasta `.next` e a build de produção corrompe o servidor de desenvolvimento. O sintoma são
erros do género `Cannot find module './vendor-chunks/esprima.js'` ou
`Could not find the module ... in the React Client Manifest`.

A cura:

```bash
rm -rf .next
```

Localmente só é preciso o `npm run dev`. O `build` é trabalho da Action.

**Não editar nada no branch `deploy`.** É reescrito por inteiro a cada build; qualquer
alteração feita lá desaparece no push seguinte.

**Não ligar a Hostinger por FTP ao mesmo tempo que por Git.** Escolher um dos dois — os
dois em simultâneo sobrepõem-se e passa a ser impossível saber que versão está online.
