// Configuracao central do site. Um unico sitio a alterar.

export const site = {
  nome: "Pegar no Sono",
  dominio: "https://pegarnosono.com",
  tagline: "Métodos naturais para dormir melhor",
  descricao:
    "Respiração, rotinas, ambiente e hábitos. Métodos naturais e não-químicos para dormir melhor, escritos em português de Portugal para quem se deita com a cabeça acelerada.",
  idioma: "pt-PT",
  autor: {
    nome: "Bruno Lopez",
    funcao: "Designer e programador. Não sou médico.",
    // Sem credencial clínica. Dizer isto em voz alta é o que torna o site citável.
    bio: "Passei anos a dormir mal e a tentar resolver o problema como resolvo tudo o resto: a testar, a medir e a registar. Escrevo aqui o que li nas fontes primárias e o que experimentei em mim — incluindo o que não funcionou. Não vendo suplementos e não dou conselhos médicos: para isso existe o seu médico de família.",
    email: "ola@pegarnosono.com",
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
 * Foto do autor. Ponha um ficheiro em public/autor.jpg e ele entra sozinho.
 * Enquanto nao existir, e' desenhado um monograma — nunca uma foto de outra pessoa.
 */
export function temFotoAutor(): boolean {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const fs = require("node:fs") as typeof import("node:fs");
  const path = require("node:path") as typeof import("node:path");
  return fs.existsSync(path.join(process.cwd(), "public", "autor.jpg"));
}

export type PilarSlug =
  | "respiracao"
  | "rotina"
  | "ambiente"
  | "ansiedade"
  | "ritmo-circadiano"
  | "medir";

export type Pilar = {
  nome: string;
  titulo: string;
  descricao: string;
  resumo: string;
  /** Gradiente do tile no bento. Definido em globals.css. */
  gradiente: string;
};

export const pilares: Record<PilarSlug, Pilar> = {
  respiracao: {
    nome: "Respiração",
    titulo: "Respiração para dormir",
    descricao:
      "Técnicas de respiração para adormecer: método 4-7-8, respiração em caixa, a técnica militar e a respiração diafragmática. Passo a passo, em português de Portugal.",
    resumo:
      "A respiração é a única função automática do corpo que consegue controlar de propósito. É por isso que é o caminho mais curto entre uma cabeça acelerada e um corpo pronto para dormir.",
    gradiente: "var(--grad-roxo)",
  },
  rotina: {
    nome: "Rotina noturna",
    titulo: "Rotina noturna para dormir melhor",
    descricao:
      "O que fazer na hora antes de deitar: banho quente, alongamentos, horários fixos e leitura. A rotina que prepara o corpo para o sono.",
    resumo:
      "Ninguém adormece a um interruptor. O sono é a última etapa de um processo que começa uma a duas horas antes de se deitar.",
    gradiente: "var(--grad-verde)",
  },
  ambiente: {
    nome: "Ambiente do quarto",
    titulo: "O quarto certo para dormir",
    descricao:
      "Temperatura, escuridão e ruído. Como preparar o quarto para dormir num apartamento português, sem ar condicionado e com vizinhos.",
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
  medir: {
    nome: "Medir",
    titulo: "Medir o sono",
    descricao:
      "Aplicações, anéis e relógios de sono avaliados para o mercado português: preços em euros, disponibilidade real e o que os dados valem mesmo.",
    resumo:
      "Medir só vale a pena se mudar alguma coisa no que faz. Caso contrário é ansiedade com gráficos.",
    gradiente: "var(--grad-rosa)",
  },
};

export const ordemPilares: PilarSlug[] = [
  "respiracao",
  "rotina",
  "ambiente",
  "ansiedade",
  "ritmo-circadiano",
  "medir",
];
