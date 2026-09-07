// Descarrega as capas dos artigos, gera as variantes por largura e regista tudo
// em content/imagens.json.
//
//   node scripts/descarregar-imagens.ts
//
// Porque: o campo `imagem` no frontmatter aponta para o Unsplash. Isso significa
// tres coisas mas: um pedido a um dominio terceiro em cada visita, nenhuma
// garantia de que a foto continua la' daqui a um ano, e nenhuma dimensao
// conhecida — logo, salto de layout enquanto a imagem carrega.
//
// E porque servir 1800 px a um telemovel de 375 px e' desperdicar 5x os bytes:
// medido a 01/09/2026, a capa da pagina inicial pesava 321 KB de um total de
// 564 KB, para ser mostrada a 331 px de largura.
//
// O frontmatter continua a ser a fonte da verdade. Isto e' so' cache local.

import { writeFile, mkdir, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import matter from "gray-matter";

// Le o frontmatter directamente em vez de importar lib/artigos.ts: assim o
// script nao depende da cadeia de imports do site (que ja o partiu uma vez,
// quando lib/artigos.ts passou a importar um valor de ./site).
// Cada imagem a descarregar, seja capa ou fotografia do corpo. A `chave` da'
// nome ao ficheiro e e' a entrada no manifesto: o slug para a capa,
// `slug--id` para uma fotografia do corpo (ver chaveFotografia em
// lib/artigos.ts — os dois lados tem de concordar ou o site cai para o URL
// remoto sem dizer nada).
type Alvo = { chave: string; url: string; descricao: string };

async function alvos(): Promise<Alvo[]> {
  const pasta = path.join("content", "artigos");
  const nomes = (await readdir(pasta)).filter((f) => f.endsWith(".mdx"));
  const lista: Alvo[] = [];

  for (const f of nomes) {
    const slug = f.replace(/\.mdx$/, "");
    const dados = matter(await readFile(path.join(pasta, f), "utf8")).data;

    if (dados.imagem) {
      lista.push({ chave: slug, url: dados.imagem, descricao: `${slug} (capa)` });
    } else {
      console.log(`  — ${slug}: sem capa, ignorado`);
    }

    for (const foto of dados.fotografias ?? []) {
      lista.push({
        chave: `${slug}--${foto.id}`,
        url: foto.url,
        descricao: `${slug} · ${foto.id}`,
      });
    }
  }

  return lista;
}

const PASTA = path.join("public", "imagens", "artigos");
const MANIFESTO = path.join("content", "imagens.json");

/** 480 cobre telemovel, 768 telemovel retina, 1200 tablet, 1800 o artigo em ecra grande. */
const LARGURAS = [480, 768, 1200, 1800];

type Entrada = {
  ficheiro: string;
  largura: number;
  altura: number;
  origem: string;
  larguras: number[];
};

const manifesto: Record<string, Entrada> = {};

await mkdir(PASTA, { recursive: true });

for (const alvo of await alvos()) {
  const resposta = await fetch(alvo.url);
  if (!resposta.ok) {
    throw new Error(`${alvo.descricao}: a imagem devolveu ${resposta.status} — ${alvo.url}`);
  }

  const bruto = Buffer.from(await resposta.arrayBuffer());
  const meta = await sharp(bruto).metadata();
  if (!meta.width || !meta.height) throw new Error(`${alvo.descricao}: dimensoes ilegiveis`);

  // Nunca aumentar: se o original for menor, essa largura nao e' gerada.
  const larguras = LARGURAS.filter((l) => l <= meta.width!);
  if (larguras.length === 0) larguras.push(meta.width);

  const pesos: string[] = [];

  for (const l of larguras) {
    const base = sharp(bruto).resize({ width: l, withoutEnlargement: true });
    const jpg = await base.clone().jpeg({ quality: 80, progressive: true, mozjpeg: true }).toBuffer();
    const webp = await base.clone().webp({ quality: 74 }).toBuffer();

    await writeFile(path.join(PASTA, `${alvo.chave}-${l}.jpg`), jpg);
    await writeFile(path.join(PASTA, `${alvo.chave}-${l}.webp`), webp);

    pesos.push(`${l}px ${Math.round(jpg.length / 1024)}/${Math.round(webp.length / 1024)} KB`);
  }

  // Copia sem sufixo: e' o `src` de recurso, para quem nao percebe srcset.
  const maior = larguras[larguras.length - 1];
  await sharp(bruto)
    .resize({ width: maior, withoutEnlargement: true })
    .jpeg({ quality: 80, progressive: true, mozjpeg: true })
    .toFile(path.join(PASTA, `${alvo.chave}.jpg`));

  manifesto[alvo.chave] = {
    ficheiro: `/imagens/artigos/${alvo.chave}.jpg`,
    largura: meta.width,
    altura: meta.height,
    origem: alvo.url,
    larguras,
  };

  console.log(`  ✓ ${alvo.descricao}`);
  console.log(`      jpg/webp por largura: ${pesos.join("  ·  ")}`);
}

await writeFile(MANIFESTO, JSON.stringify(manifesto, null, 2) + "\n", "utf8");
console.log(`\n  ${MANIFESTO} escrito com ${Object.keys(manifesto).length} entradas`);
