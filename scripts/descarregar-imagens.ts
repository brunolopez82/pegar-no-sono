// Descarrega as capas dos artigos para public/imagens/artigos/ e regista as
// dimensoes reais em content/imagens.json.
//
//   node scripts/descarregar-imagens.ts
//
// Porque: o campo `imagem` no frontmatter aponta para o Unsplash. Isso significa
// tres coisas mas: um pedido a um dominio terceiro em cada visita, nenhuma
// garantia de que a foto continua la' daqui a um ano, e nenhuma dimensao
// conhecida — logo, salto de layout enquanto a imagem carrega.
//
// O frontmatter continua a ser a fonte da verdade. Isto e' so' cache local.

import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { todosOsArtigos } from "../lib/artigos.ts";

const PASTA = path.join("public", "imagens", "artigos");
const MANIFESTO = path.join("content", "imagens.json");

type Entrada = { ficheiro: string; largura: number; altura: number; origem: string };

const manifesto: Record<string, Entrada> = {};

await mkdir(PASTA, { recursive: true });

for (const artigo of todosOsArtigos()) {
  if (!artigo.imagem) {
    console.log(`  — ${artigo.slug}: sem capa, ignorado`);
    continue;
  }

  const resposta = await fetch(artigo.imagem);
  if (!resposta.ok) {
    throw new Error(`${artigo.slug}: a imagem devolveu ${resposta.status} — ${artigo.imagem}`);
  }

  const bruto = Buffer.from(await resposta.arrayBuffer());

  // Reencodifica para jpeg progressivo: tamanho previsivel e dimensoes fiaveis.
  const imagem = sharp(bruto).jpeg({ quality: 82, progressive: true });
  const { width, height } = await imagem.metadata();
  if (!width || !height) throw new Error(`${artigo.slug}: nao foi possivel ler as dimensoes`);

  const ficheiro = `${artigo.slug}.jpg`;
  await imagem.toFile(path.join(PASTA, ficheiro));

  manifesto[artigo.slug] = {
    ficheiro: `/imagens/artigos/${ficheiro}`,
    largura: width,
    altura: height,
    origem: artigo.imagem,
  };

  console.log(`  ✓ ${artigo.slug}  ${width}x${height}`);
}

await writeFile(MANIFESTO, JSON.stringify(manifesto, null, 2) + "\n", "utf8");
console.log(`\n  ${MANIFESTO} escrito com ${Object.keys(manifesto).length} entradas`);
