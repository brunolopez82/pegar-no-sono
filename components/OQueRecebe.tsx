import Revelar from "./Revelar";

const pontos = [
  { texto: "Uma técnica de cada vez, pronta a usar nessa mesma noite", grad: "linear-gradient(135deg, #F5C6B0, #F4A5A0)" },
  { texto: "As fontes primárias à vista, sempre — o estudo, não o artigo sobre o estudo", grad: "linear-gradient(135deg, #D4A5E5, #C0B8F0)" },
  { texto: "Quando um número famoso é frágil, digo que é frágil", grad: "linear-gradient(135deg, #A8C8F0, #88D4F0)" },
  { texto: "Zero suplementos e zero publicidade disfarçada", grad: "linear-gradient(135deg, #B8E8C8, #8DD8D8)" },
  { texto: "Sem prova social inventada: nada de contadores nem testemunhos", grad: "linear-gradient(135deg, #F2B8D0, #E8A0BF)" },
  { texto: "Nunca sobre medicação: essa conversa é com o seu médico", grad: "linear-gradient(135deg, #F8E8E0, #F5D5C8)" },
];

export default function OQueRecebe() {
  return (
    <div className="tile p-8 lg:p-14">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Revelar>
          <h2 className="font-display text-3xl font-black leading-[1] tracking-tight text-foreground lg:text-5xl">
            O que vai encontrar aqui
          </h2>
          <p className="mt-4 max-w-md text-base text-muted-foreground lg:text-lg">
            Sem teorias soltas e sem listas de vinte dicas. Um método de cada vez, explicado até
            ao fim, com o que a evidência mostra e com o que ainda não mostra.
          </p>
        </Revelar>

        <div className="flex flex-col gap-4">
          {pontos.map((p, i) => (
            <Revelar key={p.texto} atraso={i * 0.06}>
              <div className="flex items-center gap-4">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                  style={{ background: p.grad }}
                  aria-hidden="true"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span className="text-sm font-semibold text-foreground lg:text-base">
                  {p.texto}
                </span>
              </div>
            </Revelar>
          ))}
        </div>
      </div>
    </div>
  );
}
