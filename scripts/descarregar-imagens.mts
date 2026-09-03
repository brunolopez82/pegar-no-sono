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
async function capas(): Promise<{ slug: string; imagem?: string }[]> {
  const pasta = path.join("content", "artigos");
  const nomes = (await readdir(pasta)).filter((f) => f.endsWith(".mdx"));
  return Promise.all(
    nomes.map(async (f) => ({
      slug: f.replace(/\.mdx$/, ""),
      imagem: matter(await readFile(path.join(pasta, f), "utf8")).data.imagem,
    })),
  );
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

for (const artigo of await capas()) {
  if (!artigo.imagem) {
    console.log(`  — ${artigo.slug}: sem capa, ignorado`);
    continue;
  }

  const resposta = await fetch(artigo.imagem);
  if (!resposta.ok) {
    throw new Error(`${artigo.slug}: a imagem devolveu ${resposta.status} — ${artigo.imagem}`);
  }

  const bruto = Buffer.from(await resposta.arrayBuffer());
  const meta = await sharp(bruto).metadata();
  if (!meta.width || !meta.height) throw new Error(`${artigo.slug}: dimensoes ilegiveis`);

  // Nunca aumentar: se o original for menor, essa largura nao e' gerada.
  const larguras = LARGURAS.filter((l) => l <= meta.width!);
  if (larguras.length === 0) larguras.push(meta.width);

  const pesos: string[] = [];

  for (const l of larguras) {
    const base = sharp(bruto).resize({ width: l, withoutEnlargement: true });
    const jpg = await base.clone().jpeg({ quality: 80, progressive: true, mozjpeg: true }).toBuffer();
    const webp = await base.clone().webp({ quality: 74 }).toBuffer();

    await writeFile(path.join(PASTA, `${artigo.slug}-${l}.jpg`), jpg);
    await writeFile(path.join(PASTA, `${artigo.slug}-${l}.webp`), webp);

    pesos.push(`${l}px ${Math.round(jpg.length / 1024)}/${Math.round(webp.length / 1024)} KB`);
  }

  // Copia sem sufixo: e' o `src` de recurso, para quem nao percebe srcset.
  const maior = larguras[larguras.length - 1];
  await sharp(bruto)
    .resize({ width: maior, withoutEnlargement: true })
    .jpeg({ quality: 80, progressive: true, mozjpeg: true })
    .toFile(path.join(PASTA, `${artigo.slug}.jpg`));

  manifesto[artigo.slug] = {
    ficheiro: `/imagens/artigos/${artigo.slug}.jpg`,
    largura: meta.width,
    altura: meta.height,
    origem: artigo.imagem,
    larguras,
  };

  console.log(`  ✓ ${artigo.slug}`);
  console.log(`      jpg/webp por largura: ${pesos.join("  ·  ")}`);
}

await writeFile(MANIFESTO, JSON.stringify(manifesto, null, 2) + "\n", "utf8");
console.log(`\n  ${MANIFESTO} escrito com ${Object.keys(manifesto).length} entradas`);
