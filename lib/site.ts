// Configuracao central do site. Um unico sitio a alterar.

export const site = {
  nome: "Pegar no Sono",
  dominio: "https://pegarnosono.com",
  tagline: "Métodos naturais para dormir melhor",
  // Serve de meta description da pagina inicial: tem de caber nos 160.
  descricao:
    "Métodos naturais para dormir melhor: respiração, rotinas, ambiente e hábitos. Com as fontes primárias à vista e a força de cada uma dita em voz alta.",
  idioma: "pt-PT",
  autor: {
    nome: "Bruno Lopes",
    funcao: "Designer e programador. Não sou médico.",
    // Sem credencial clínica. Dizer isto em voz alta é o que torna o site citável.
    bio: "Quando acordava a meio da noite, fumava um cigarro. Achava que me acalmava. Não me acalmava. Depois pegava no telemóvel — e essa, provavelmente, também já fez. Construo sites para viver e durmo mal há anos; quando fui procurar melhor, encontrei páginas paradas há uma década e publicidade a comprimidos. Por isso fui às fontes primárias e comecei a testar em mim, uma variável de cada vez. Não sou médico e não vendo nada que se tome.",
    email: "ola@pegarnosono.com",
    /**
     * Perfis publicos do autor, para `sameAs` no schema Person.
     *
     * Isto e' o que liga "Bruno Lopes" a uma pessoa verificavel em vez de a um
     * nome numa pagina. Em conteudo de saude conta desproporcionadamente: um
     * autor sem presenca externa comprovavel e' E-E-A-T fraco.
     *
     * Regra: so entram aqui perfis que existem mesmo e que sao do autor. Um
     * `sameAs` errado e' pior do que nenhum. Se a lista ficar vazia, a
     * propriedade nao e' emitida de todo.
     */
    perfis: [
      "https://github.com/brunolopez82",
      // Acrescentar quando existirem — o LinkedIn e' o que mais pesa aqui:
      // "https://www.linkedin.com/in/...",
      // "https://www.instagram.com/...",
    ] as string[],
  },
} as const;

/**
 * Cores da marca em hexadecimal, para onde CSS nao chega: manifest, icones,
 * imagem Open Graph. Os mesmos valores estao em app/globals.css como tokens.
 */
export const cores = {
  fundo: "#F3F3F5",
  tinta: "#000000",
  gradiente: ["#F5C6B0", "#F4A5A0", "#E8A0BF"],
} as const;

/**
 * Imagem Open Graph por defeito, para paginas sem imagem propria.
 * Ficheiro estatico em public/ — o site e' export estatico, nao ha next/og
 * em runtime. Gerado por scripts/gerar-og.mjs.
 */
export const ogPadrao = {
  url: "/og-default.png",
  width: 1200,
  height: 630,
  alt: "Pegar no Sono — métodos naturais para dormir melhor",
};

/**
 * Foto do autor, em public/autor.jpg. Entra sozinha na pagina inicial, na barra
 * de cada artigo e no /sobre/ — nao ha nada a ligar a' mao.
 *
 * A que la' esta' e' um retrato real do Bruno, recortado de
 * bruno-lopes.png do projecto Inpry. Se for substituida, tem de continuar a
 * ser ele: conteudo de saude assinado com o retrato de um desconhecido e' o
 * oposto do que torna um site citavel. Sem ficheiro, desenha-se um monograma.
 */
export function temFotoAutor(): boolean {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const fs = require("node:fs") as typeof import("node:fs");
  const path = require("node:path") as typeof import("node:path");
  return fs.existsSync(path.join(process.cwd(), "public", "autor.jpg"));
}

export type PilarSlug =
  | "fundamentos"
  | "respiracao"
  | "rotina"
  | "ambiente"
  | "ansiedade"
  | "ritmo-circadiano"
  | "biohacking"
  | "medir";

export type Pilar = {
  nome: string;
  /** H1 da pagina do tema. */
  titulo: string;
  /** Titulo curto so' para a etiqueta <title>, quando o `titulo` e' longo. */
  tituloSeo?: string;
  /** Paragrafo na pagina do tema. Sem limite apertado. */
  descricao: string;
  /** Meta description, quando a `descricao` passa dos 160 caracteres. */
  meta?: string;
  resumo: string;
  /** Gradiente do tile no bento. Definido em globals.css. */
  gradiente: string;
  /** Ocupa a linha toda na grelha. Reservado ao pilar-base. */
  largo?: boolean;
};

export const pilares: Record<PilarSlug, Pilar> = {
  fundamentos: {
    nome: "Fundamentos",
    titulo: "Porque é que o sono importa",
    descricao:
      "O que o corpo faz enquanto dorme, porque é que uma noite má arrasta o dia inteiro atrás dela, e o que muda quando se trata o sono como um hábito em vez de uma emergência.",
    meta:
      "O que o corpo faz enquanto dorme, e porque é que uma noite má arrasta o dia inteiro atrás dela.",
    resumo:
      "Antes das técnicas, a razão. O sono não é mais um item na lista das coisas saudáveis — é o que decide se consegue fazer as outras.",
    gradiente: "var(--grad-bruma)",
    largo: true,
  },
  respiracao: {
    nome: "Respiração",
    titulo: "Respiração para dormir",
    descricao:
      "Técnicas de respiração para adormecer: método 4-7-8, respiração em caixa, a técnica militar e a respiração diafragmática, passo a passo.",
    meta:
      "Técnicas de respiração para adormecer: método 4-7-8, respiração em caixa, técnica militar e diafragmática. Passo a passo.",
    resumo:
      "A respiração é a única função automática do corpo que consegue controlar de propósito. É por isso que é o caminho mais curto entre uma cabeça acelerada e um corpo pronto para dormir.",
    gradiente: "var(--grad-roxo)",
  },
  rotina: {
    nome: "Rotinas",
    titulo: "Rotinas de noite e de manhã",
    descricao:
      "O que fazer na hora antes de deitar e nos primeiros minutos depois de acordar: banho quente, alongamentos, horários fixos, luz da manhã e o que fazer antes do primeiro café.",
    meta:
      "O que fazer na hora antes de deitar e nos primeiros minutos depois de acordar. As duas pontas do dia que decidem a noite.",
    resumo:
      "Ninguém adormece a um interruptor. O sono é a última etapa de um processo que começa uma a duas horas antes de se deitar — e a noite de hoje começa a ser decidida na manhã de hoje.",
    gradiente: "var(--grad-verde)",
  },
  ambiente: {
    nome: "Ambiente do quarto",
    titulo: "O quarto certo para dormir",
    descricao:
      "Temperatura, escuridão e ruído. Como preparar o quarto para dormir num apartamento sem ar condicionado e com vizinhos por cima.",
    resumo:
      "O quarto ou trabalha a favor do seu sono ou contra ele. Não há posição neutra.",
    gradiente: "var(--grad-azul)",
  },
  ansiedade: {
    nome: "Ansiedade e mente",
    titulo: "Ansiedade, pensamentos e sono",
    descricao:
      "Acordar às 3 da manhã, ruminação noturna, não conseguir desligar a cabeça. O que fazer com a mente quando é ela que não o deixa dormir.",
    resumo:
      "Para muita gente o problema não é o corpo cansado — é a cabeça que só começa a trabalhar quando a luz se apaga.",
    gradiente: "var(--grad-pessego)",
  },
  "ritmo-circadiano": {
    nome: "Ritmo circadiano",
    titulo: "Ritmo circadiano: luz, cafeína e horários",
    descricao:
      "Luz da manhã, cafeína, álcool, exercício e sestas. Como o relógio interno decide a que horas tem sono — e como o acertar.",
    resumo:
      "A hora a que adormece é decidida muito antes da noite. É decidida pela luz que apanhou de manhã e pelo que bebeu à tarde.",
    gradiente: "var(--grad-areia)",
  },
  biohacking: {
    nome: "Biohacking",
    titulo: "Biohacking do sono: o que resiste à evidência",
    tituloSeo: "Biohacking do sono: o que resiste",
    descricao:
      "Banho gelado, jejum, sauna, exposição ao frio, protocolos de luz. Os hábitos que toda a gente experimenta à volta do sono, testados um a um contra o que os estudos mostram — e separados dos que são apenas moda.",
    meta:
      "Banho gelado, jejum, frio e luz. Os hábitos que toda a gente experimenta à volta do sono, testados contra o que os estudos mostram.",
    resumo:
      "Mudar uma variável de cada vez, medir, e ficar com o que resiste. É isso que a palavra quer dizer aqui — e não há nada de obscuro nela.",
    gradiente: "var(--grad-gelo)",
  },
  medir: {
    nome: "Medir",
    titulo: "Medir o sono",
    descricao:
      "Aplicações, anéis e relógios de sono avaliados a sério: o que medem bem, o que inventam, e o que os dados valem mesmo no dia seguinte.",
    resumo:
      "Medir só vale a pena se mudar alguma coisa no que faz. Caso contrário é ansiedade com gráficos.",
    gradiente: "var(--grad-rosa)",
  },
};

/**
 * Momento do dia a que um artigo se aplica.
 *
 * O pilar diz de que assunto e' o artigo; o momento diz **quando se faz**. Sao
 * eixos diferentes: a respiracao diafragmatica e' do pilar Respiracao e faz-se
 * ja na cama; o banho gelado e' de Biohacking e faz-se de manha.
 *
 * E' isto que permite, mais tarde, montar um protocolo por ordem de relogio a
 * partir dos artigos que ja existem, sem manter lista nenhuma a' mao.
 */
export type MomentoSlug =
  | "manha"
  | "dia"
  | "fim-de-tarde"
  | "antes-de-deitar"
  | "na-cama"
  | "de-madrugada";

export const momentos: Record<MomentoSlug, { nome: string; ordem: number }> = {
  manha: { nome: "Ao acordar", ordem: 1 },
  dia: { nome: "Durante o dia", ordem: 2 },
  "fim-de-tarde": { nome: "Fim de tarde", ordem: 3 },
  "antes-de-deitar": { nome: "Uma hora antes de deitar", ordem: 4 },
  "na-cama": { nome: "Já na cama", ordem: 5 },
  "de-madrugada": { nome: "Se acordar de madrugada", ordem: 6 },
};

export const ordemMomentos: MomentoSlug[] = (
  Object.keys(momentos) as MomentoSlug[]
).sort((a, b) => momentos[a].ordem - momentos[b].ordem);

// Guarda de build. Os motores cortam a descricao por volta dos 160 caracteres,
// e uma descricao truncada e' pior do que uma curta. Falha alto em vez de
// publicar em silencio — a mesma disciplina do frontmatter dos artigos.
const SUFIXO_TITULO = ` | ${site.nome}`.length;

for (const [slug, p] of Object.entries(pilares)) {
  const m = p.meta ?? p.descricao;
  if (m.length > 160) {
    throw new Error(
      `lib/site.ts — pilar "${slug}": meta description com ${m.length} caracteres (max 160). ` +
        "Acrescente um campo `meta` curto.",
    );
  }

  // O <title> real leva " | Pegar no Sono" colado atras. E' o total que o
  // Google corta, por volta dos 60.
  const t = (p.tituloSeo ?? p.titulo).length + SUFIXO_TITULO;
  if (t > 60) {
    throw new Error(
      `lib/site.ts — pilar "${slug}": <title> com ${t} caracteres contando o sufixo (max 60). ` +
        "Acrescente um campo `tituloSeo` curto.",
    );
  }
}

export const ordemPilares: PilarSlug[] = [
  "fundamentos",
  "respiracao",
  "rotina",
  "ambiente",
  "ansiedade",
  "ritmo-circadiano",
  "biohacking",
  "medir",
];
