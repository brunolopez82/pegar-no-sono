import FormularioSubscricao from "./FormularioSubscricao";

export default function Subscrever() {
  return (
    <section id="newsletter" className="envolve scroll-mt-24 py-20 sm:py-28">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-noite-700/70 px-6 py-14 sm:px-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-28 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-ambar-400/12 blur-3xl animate-respirar"
        />
        <div className="relative mx-auto max-w-xl text-center">
          <p className="etiqueta">Uma carta por semana</p>
          <h2 className="mt-5 font-serif text-3xl font-semibold leading-tight sm:text-[38px]">
            Uma técnica de cada vez, à quinta-feira à noite
          </h2>
          <p className="mt-4 text-[16.5px] leading-relaxed text-texto-suave">
            Recebe uma técnica para experimentar nessa mesma noite, o que a evidência diz sobre
            ela, e o que eu próprio observei ao testá-la. Nada para comprar.
          </p>
          <div className="mt-8">
            <FormularioSubscricao />
          </div>
        </div>
      </div>
    </section>
  );
}
