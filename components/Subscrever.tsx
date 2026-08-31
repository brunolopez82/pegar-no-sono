import FormularioSubscricao from "./FormularioSubscricao";

export default function Subscrever() {
  return (
    <div id="subscrever" className="scroll-mt-6 bg-foreground p-8 text-center lg:p-14">
      <h2 className="mb-4 font-display text-3xl font-black tracking-tight text-background lg:text-5xl">
        Comece esta noite
      </h2>
      <p className="mx-auto mb-10 max-w-xl text-base text-background/50 lg:text-lg">
        Uma técnica por semana, com a fonte à vista e o que observei ao testá-la. Sem spam, sem
        nada para vender.
      </p>

      <FormularioSubscricao
        variante="escuro"
        textoBotao="Quero dormir melhor"
      />

      <p className="mt-6 text-xs text-background/30">
        O seu email nunca é partilhado nem vendido.
      </p>
    </div>
  );
}
