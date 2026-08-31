import Link from "next/link";
import { pilares, ordemPilares } from "@/lib/site";
import { todosOsArtigos } from "@/lib/artigos";

export default function GrelhaPilares() {
  const artigos = todosOsArtigos();

  return (
    <section className="envolve py-20 sm:py-24">
      <div className="max-w-2xl">
        <p className="etiqueta">Os seis temas</p>
        <h2 className="mt-5 font-serif text-3xl font-semibold leading-tight sm:text-[40px]">
          O sono não se resolve num artigo
        </h2>
        <p className="mt-4 text-[16.5px] leading-relaxed text-texto-suave">
          Resolve-se por camadas. Cada tema é um conjunto fechado de artigos, escrito para ser lido
          por ordem. Começa-se pela respiração porque é a única que se pode experimentar hoje à
          noite, sem comprar nada e sem mudar a vida.
        </p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ordemPilares.map((slug, i) => {
          const pilar = pilares[slug];
          const total = artigos.filter((a) => a.pilar === slug).length;

          return (
            <Link
              key={slug}
              href={`/temas/${slug}/`}
              className="cartao group flex flex-col p-6"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-serif text-[13px] text-ambar-400/70">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[12px] text-texto-fraco">
                  {total === 0 ? "em preparação" : total === 1 ? "1 artigo" : `${total} artigos`}
                </span>
              </div>
              <h3 className="mt-3 font-serif text-[20px] font-semibold transition group-hover:text-ambar-300">
                {pilar.nome}
              </h3>
              <p className="mt-2.5 text-[14.5px] leading-relaxed text-texto-suave">
                {pilar.resumo}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
