import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { PilarSlug } from "./site";

const PASTA = path.join(process.cwd(), "content", "artigos");
const MANIFESTO_IMAGENS = path.join(process.cwd(), "content", "imagens.json");

type EntradaImagem = { ficheiro: string; largura: number; altura: number; origem: string };

/**
 * Capas ja descarregadas para public/, escritas por scripts/descarregar-imagens.ts.
 * Ter as dimensoes reais aqui e' o que permite usar next/image sem salto de layout.
 * Se o ficheiro nao existir, o site continua a funcionar com os URLs remotos.
 */
const imagensLocais: Record<string, EntradaImagem> = fs.existsSync(MANIFESTO_IMAGENS)
  ? JSON.parse(fs.readFileSync(MANIFESTO_IMAGENS, "utf8"))
  : {};

export type Passo = { nome: string; texto: string };
export type Pergunta = { pergunta: string; resposta: string };
export type Fonte = { titulo: string; url: string; nota?: string };

export type MetaArtigo = {
  slug: string;
  titulo: string;
  descricao: string;
  /** Resposta direta em ~40 palavras. Sai no topo do artigo e alimenta os motores de IA. */
  resposta: string;
  pilar: PilarSlug;
  data: string;
  /** Imagem de capa: usada no tile da listagem e no topo do artigo. */
  imagem?: string;
  imagemAlt?: string;
  /** Caminho local da capa, quando ja foi descarregada. Preferir sempre a este. */
  imagemLocal?: string;
  imagemLargura?: number;
  imagemAltura?: number;
  atualizado?: string;
  destaque?: boolean;
  passos?: Passo[];
  faq?: Pergunta[];
  fontes?: Fonte[];
  /** Slugs de artigos relacionados. Se vazio, usa-se o resto do pilar. */
  relacionados?: string[];
  minutos: number;
  palavras: number;
};

export type Artigo = MetaArtigo & { corpo: string };

function ficheiros(): string[] {
  if (!fs.existsSync(PASTA)) return [];
  return fs.readdirSync(PASTA).filter((f) => f.endsWith(".mdx"));
}

function ler(ficheiro: string): Artigo {
  const slug = ficheiro.replace(/\.mdx$/, "");
  const bruto = fs.readFileSync(path.join(PASTA, ficheiro), "utf8");
  const { data, content } = matter(bruto);

  const palavras = content.trim().split(/\s+/).length;

  const obrigatorios = ["titulo", "descricao", "resposta", "pilar", "data"];
  for (const campo of obrigatorios) {
    if (!data[campo]) {
      throw new Error(`content/artigos/${ficheiro}: falta o campo "${campo}" no frontmatter.`);
    }
  }

  return {
    slug,
    titulo: data.titulo,
    descricao: data.descricao,
    resposta: data.resposta,
    pilar: data.pilar,
    data: String(data.data),
    imagem: data.imagem ?? undefined,
    imagemAlt: data.imagemAlt ?? undefined,
    imagemLocal: imagensLocais[slug]?.ficheiro,
    imagemLargura: imagensLocais[slug]?.largura,
    imagemAltura: imagensLocais[slug]?.altura,
    atualizado: data.atualizado ? String(data.atualizado) : undefined,
    destaque: Boolean(data.destaque),
    passos: data.passos ?? undefined,
    faq: data.faq ?? undefined,
    fontes: data.fontes ?? undefined,
    relacionados: data.relacionados ?? undefined,
    palavras,
    // 200 palavras/minuto, arredondado para cima, minimo de 1.
    minutos: Math.max(1, Math.round(palavras / 200)),
    corpo: content,
  };
}

export function todosOsArtigos(): Artigo[] {
  return ficheiros()
    .map(ler)
    .sort((a, b) => (a.data < b.data ? 1 : -1));
}

export function artigoPorSlug(slug: string): Artigo | undefined {
  return todosOsArtigos().find((a) => a.slug === slug);
}

export function artigosDoPilar(pilar: PilarSlug): Artigo[] {
  return todosOsArtigos().filter((a) => a.pilar === pilar);
}

export function artigoEmDestaque(): Artigo | undefined {
  const todos = todosOsArtigos();
  return todos.find((a) => a.destaque) ?? todos[0];
}

/** Relacionados explicitos; caso nao existam, o resto do mesmo pilar. */
export function relacionados(artigo: Artigo, quantos = 3): MetaArtigo[] {
  const todos = todosOsArtigos();

  if (artigo.relacionados?.length) {
    const escolhidos = artigo.relacionados
      .map((s) => todos.find((a) => a.slug === s))
      .filter((a): a is Artigo => Boolean(a));
    if (escolhidos.length) return escolhidos.slice(0, quantos);
  }

  const mesmoPilar = todos.filter((a) => a.pilar === artigo.pilar && a.slug !== artigo.slug);
  const outros = todos.filter((a) => a.pilar !== artigo.pilar && a.slug !== artigo.slug);
  return [...mesmoPilar, ...outros].slice(0, quantos);
}

const MESES = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

/** "2026-08-31" -> "31 de agosto de 2026" */
export function dataExtenso(iso: string): string {
  const [ano, mes, dia] = iso.split("-").map(Number);
  return `${dia} de ${MESES[mes - 1]} de ${ano}`;
}
