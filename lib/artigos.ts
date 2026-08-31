import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import { ordemPilares, type PilarSlug } from "./site";

const PASTA = path.join(process.cwd(), "content", "artigos");
const MANIFESTO_IMAGENS = path.join(process.cwd(), "content", "imagens.json");

type EntradaImagem = {
  ficheiro: string;
  largura: number;
  altura: number;
  origem: string;
  /** Larguras geradas em .jpg e .webp por scripts/descarregar-imagens.ts. */
  larguras: number[];
};

/**
 * Capas ja descarregadas para public/, escritas por scripts/descarregar-imagens.ts.
 * Ter as dimensoes reais aqui e' o que permite usar next/image sem salto de layout.
 * Se o ficheiro nao existir, o site continua a funcionar com os URLs remotos.
 */
const imagensLocais: Record<string, EntradaImagem> = fs.existsSync(MANIFESTO_IMAGENS)
  ? JSON.parse(fs.readFileSync(MANIFESTO_IMAGENS, "utf8"))
  : {};

// ---------------------------------------------------------------------------
// Esquema do frontmatter
//
// A disciplina e' a de sempre: um artigo mal formado parte o build com o nome
// do ficheiro e do campo, em vez de ser publicado em silencio com um campo
// vazio ou um pilar que nao existe.
// ---------------------------------------------------------------------------

const DATA_ISO = /^\d{4}-\d{2}-\d{2}$/;

/** O YAML converte datas sem aspas em Date. Normaliza-se antes de validar. */
const dataCurta = z.preprocess(
  (v) => (v instanceof Date ? v.toISOString().slice(0, 10) : v),
  z.string().regex(DATA_ISO, "tem de estar no formato AAAA-MM-DD"),
);

const esquemaPasso = z.object({
  nome: z.string().min(1),
  texto: z.string().min(1),
});

const esquemaPergunta = z.object({
  pergunta: z.string().min(1),
  resposta: z.string().min(1),
});

const esquemaFonte = z.object({
  titulo: z.string().min(1),
  url: z.url("tem de ser um URL completo, com https://"),
  nota: z.string().optional(),
});

const esquemaFrontmatter = z
  .object({
    titulo: z.string().min(1),
    descricao: z.string().min(1),
    resposta: z.string().min(1),
    pilar: z.enum(ordemPilares as [PilarSlug, ...PilarSlug[]]),
    data: dataCurta,
    atualizado: dataCurta.optional(),
    destaque: z.boolean().optional(),
    imagem: z.url("tem de ser um URL completo, com https://").optional(),
    imagemAlt: z.string().min(1).optional(),
    passos: z.array(esquemaPasso).min(1).optional(),
    faq: z.array(esquemaPergunta).min(1).optional(),
    fontes: z.array(esquemaFonte).min(1).optional(),
    relacionados: z.array(z.string().min(1)).optional(),
  })
  // Uma capa sem descricao e' uma capa invisivel para quem usa leitor de ecra.
  .refine((d) => !d.imagem || Boolean(d.imagemAlt), {
    path: ["imagemAlt"],
    message: "obrigatorio sempre que existe `imagem`",
  });

export type Passo = z.infer<typeof esquemaPasso>;
export type Pergunta = z.infer<typeof esquemaPergunta>;
export type Fonte = z.infer<typeof esquemaFonte>;

export type MetaArtigo = {
  slug: string;
  titulo: string;
  descricao: string;
  /** Resposta direta em ~40 palavras. Sai no topo do artigo e alimenta os motores de IA. */
  resposta: string;
  pilar: PilarSlug;
  data: string;
  atualizado?: string;
  destaque?: boolean;
  /** Imagem de capa: usada no tile da listagem e no topo do artigo. */
  imagem?: string;
  imagemAlt?: string;
  /** Caminho local da capa, quando ja foi descarregada. Preferir sempre a este. */
  imagemLocal?: string;
  imagemLargura?: number;
  imagemAltura?: number;
  /** Larguras disponiveis para srcset. Vazio quando nao ha copia local. */
  imagemLarguras?: number[];
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

  const resultado = esquemaFrontmatter.safeParse(data);
  if (!resultado.success) {
    const problemas = resultado.error.issues
      .map((i) => `  - ${i.path.join(".") || "(raiz)"}: ${i.message}`)
      .join("\n");
    throw new Error(`content/artigos/${ficheiro} — frontmatter invalido:\n${problemas}`);
  }

  const fm = resultado.data;
  const palavras = content.trim().split(/\s+/).length;

  return {
    slug,
    ...fm,
    imagemLocal: imagensLocais[slug]?.ficheiro,
    imagemLargura: imagensLocais[slug]?.largura,
    imagemAltura: imagensLocais[slug]?.altura,
    imagemLarguras: imagensLocais[slug]?.larguras,
    palavras,
    // 200 palavras/minuto, arredondado, minimo de 1.
    minutos: Math.max(1, Math.round(palavras / 200)),
    corpo: content,
  };
}

/**
 * Segunda passagem: so' se pode verificar depois de todos os artigos estarem
 * lidos. Um `relacionados` a apontar para um slug que nao existe daria uma
 * ligacao para 404 — e' preferivel partir o build.
 */
function validarReferencias(artigos: Artigo[]): void {
  const existentes = new Set(artigos.map((a) => a.slug));
  const erros: string[] = [];

  for (const a of artigos) {
    for (const alvo of a.relacionados ?? []) {
      if (alvo === a.slug) {
        erros.push(`content/artigos/${a.slug}.mdx — relacionados: aponta para si proprio`);
      } else if (!existentes.has(alvo)) {
        erros.push(
          `content/artigos/${a.slug}.mdx — relacionados: "${alvo}" nao corresponde a nenhum artigo`,
        );
      }
    }
  }

  const destaques = artigos.filter((a) => a.destaque).map((a) => a.slug);
  if (destaques.length > 1) {
    erros.push(`destaque: so' pode haver um, e estao marcados ${destaques.length}: ${destaques.join(", ")}`);
  }

  if (erros.length) throw new Error(`Referencias invalidas:\n${erros.map((e) => `  - ${e}`).join("\n")}`);
}

// Em producao le-se e valida-se uma vez. Em desenvolvimento nao se guarda em
// cache, para que editar um .mdx apareca no ecra sem reiniciar o servidor.
const emProducao = process.env.NODE_ENV === "production";
let cache: Artigo[] | null = null;

export function todosOsArtigos(): Artigo[] {
  if (emProducao && cache) return cache;

  const artigos = ficheiros()
    .map(ler)
    .sort((a, b) => (a.data < b.data ? 1 : -1));

  validarReferencias(artigos);

  if (emProducao) cache = artigos;
  return artigos;
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
