import Link from "next/link";
import FormularioSubscricao from "./FormularioSubscricao";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-ambar-400/10 blur-[110px] animate-respirar"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ambar-400/30 to-transparent"
      />

      <div className="envolve relative py-20 sm:py-28">
        <div className="mx-auto max-w-3xl text-center animate-subir">
          <p className="etiqueta">Técnicas, não substâncias</p>

          <h1 className="mt-6 font-serif text-[38px] font-semibold leading-[1.1] tracking-tight sm:text-[58px]">
            Deitou-se cansado.
            <br />
            <span className="text-ambar-300">A cabeça é que não se deitou.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-[17.5px] leading-relaxed text-texto-suave">
            Métodos naturais para adormecer mais depressa e voltar a adormecer a meio da noite:
            respiração, rotinas, luz, temperatura e horários. Sem suplementos, sem promessas e em
            português de Portugal.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/temas/respiracao/" className="botao-primario w-full sm:w-auto">
              Começar pela respiração
            </Link>
            <Link href="/artigos/" className="botao-secundario w-full sm:w-auto">
              Ver todos os artigos
            </Link>
          </div>

          <div className="mx-auto mt-14 max-w-md">
            <p className="mb-3 text-[13px] uppercase tracking-[0.14em] text-texto-fraco">
              Ou receba uma técnica por semana
            </p>
            <FormularioSubscricao compacto />
          </div>
        </div>
      </div>
    </section>
  );
}
