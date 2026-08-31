import Link from "next/link";
import Revelar from "./Revelar";
import { pilares, ordemPilares } from "@/lib/site";
import { todosOsArtigos } from "@/lib/artigos";

export default function GrelhaPilares() {
  const artigos = todosOsArtigos();

  return (
    <div className="flex flex-col gap-[2px]">
      <div className="tile p-8 lg:p-14">
        <Revelar>
          <h2 className="max-w-2xl font-display text-3xl font-black leading-[1] tracking-tight text-foreground lg:text-5xl">
            O sono não se resolve num artigo
          </h2>
          <p className="mt-4 max-w-xl text-base text-muted-foreground lg:text-lg">
            Resolve-se por camadas. Cada tema é um conjunto fechado de artigos, escrito para ser
            lido por ordem. Começa-se pela respiração porque é a única que se pode experimentar
            hoje à noite, sem comprar nada e sem mudar a vida.
          </p>
        </Revelar>
      </div>

      <div className="grid grid-cols-1 gap-[2px] md:grid-cols-2 lg:grid-cols-3">
        {ordemPilares.map((slug, i) => {
          const pilar = pilares[slug];
          const total = artigos.filter((a) => a.pilar === slug).length;

          return (
            <Revelar key={slug} atraso={i * 0.06} className="h-full">
              <Link
                href={`/temas/${slug}/`}
                className="group flex h-full min-h-[260px] flex-col justify-end p-8 lg:p-10"
                style={{ background: pilar.gradiente }}
              >
                <div className="mb-auto flex items-baseline justify-between">
                  <span className="font-display text-sm font-black text-foreground/30">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-xs text-foreground/40">
                    {total === 0 ? "em preparação" : total === 1 ? "1 artigo" : `${total} artigos`}
                  </span>
                </div>
                <h3 className="mb-2.5 mt-8 font-display text-xl font-black tracking-tight text-foreground lg:text-2xl">
                  {pilar.nome}
                </h3>
                <p className="text-sm leading-relaxed text-foreground/60">{pilar.resumo}</p>
              </Link>
            </Revelar>
          );
        })}
      </div>
    </div>
  );
}
