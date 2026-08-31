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

**3. Publicar**

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
