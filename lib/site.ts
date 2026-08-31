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
    funcao: "Autor e editor",
    // Sem credencial clínica. Dizer isto em voz alta é o que torna o site citável.
    bio: "Escrevo sobre sono a partir de leitura de fontes primárias e de experimentação registada no meu próprio sono. Não sou médico nem terapeuta do sono, e este site nunca substitui uma consulta.",
    email: "ola@pegarnosono.com",
  },
} as const;

export type PilarSlug =
  | "respiracao"
  | "rotina"
  | "ambiente"
  | "ansiedade"
  | "ritmo-circadiano"
  | "medir";

export const pilares: Record<
  PilarSlug,
  { nome: string; titulo: string; descricao: string; resumo: string }
> = {
  respiracao: {
    nome: "Respiração",
    titulo: "Respiração para dormir",
    descricao:
      "Técnicas de respiração para adormecer: método 4-7-8, respiração em caixa, a técnica militar e a respiração diafragmática. Passo a passo, em português de Portugal.",
    resumo:
      "A respiração é a única função automática do corpo que consegue controlar de propósito. É por isso que é o caminho mais curto entre uma cabeça acelerada e um corpo pronto para dormir.",
  },
  rotina: {
    nome: "Rotina noturna",
    titulo: "Rotina noturna para dormir melhor",
    descricao:
      "O que fazer na hora antes de deitar: banho quente, alongamentos, horários fixos e leitura. A rotina que prepara o corpo para o sono.",
    resumo:
      "Ninguém adormece a um interruptor. O sono é a última etapa de um processo que começa uma a duas horas antes de se deitar.",
  },
  ambiente: {
    nome: "Ambiente do quarto",
    titulo: "O quarto certo para dormir",
    descricao:
      "Temperatura, escuridão e ruído. Como preparar o quarto para dormir num apartamento português, sem ar condicionado e com vizinhos.",
    resumo:
      "O quarto ou trabalha a favor do seu sono ou contra ele. Não há posição neutra.",
  },
  ansiedade: {
    nome: "Ansiedade e mente",
    titulo: "Ansiedade, pensamentos e sono",
    descricao:
      "Acordar às 3 da manhã, ruminação noturna, não conseguir desligar a cabeça. O que fazer com a mente quando é ela que não o deixa dormir.",
    resumo:
      "Para muita gente o problema não é o corpo cansado — é a cabeça que só começa a trabalhar quando a luz se apaga.",
  },
  "ritmo-circadiano": {
    nome: "Ritmo circadiano",
    titulo: "Ritmo circadiano: luz, cafeína e horários",
    descricao:
      "Luz da manhã, cafeína, álcool, exercício e sestas. Como o relógio interno decide a que horas tem sono — e como o acertar.",
    resumo:
      "A hora a que adormece é decidida muito antes da noite. É decidida pela luz que apanhou de manhã e pelo que bebeu à tarde.",
  },
  medir: {
    nome: "Medir",
    titulo: "Medir o sono",
    descricao:
      "Aplicações, anéis e relógios de sono avaliados para o mercado português: preços em euros, disponibilidade real e o que os dados valem mesmo.",
    resumo:
      "Medir só vale a pena se mudar alguma coisa no que faz. Caso contrário é ansiedade com gráficos.",
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
