import Link from "next/link";
import FormularioSubscricao from "./FormularioSubscricao";
import ImagemArtigo from "./ImagemArtigo";
import type { MetaArtigo } from "@/lib/artigos";
import { pilares } from "@/lib/site";

export default function Hero({ destaque }: { destaque?: MetaArtigo }) {
  return (
    <div className="flex flex-col gap-[2px]">
      <div className="grid grid-cols-1 gap-[2px] lg:grid-cols-2">
        {/* Titulo */}
        <div className="tile flex min-h-[420px] flex-col justify-center rounded-tl-[14px] p-8 lg:min-h-[540px] lg:p-14">
          {/* Nada aqui usa <Revelar>. Este bloco e' o primeiro ecra: escondê-lo
              atras de JavaScript atrasava o LCP ate a' hidratacao (4,4 s medidos
              a 01/09/2026). O movimento fica para o que esta abaixo da dobra. */}
            <h1 className="font-display text-5xl font-black leading-[0.95] tracking-tighter text-foreground lg:text-7xl">
              Aprenda a adormecer outra vez
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground lg:text-lg">
              Métodos naturais para quem se deita com a cabeça acelerada. Respiração, rotinas e
              ambiente — explicados com as fontes à vista e com a força de cada uma dita em voz alta.
              Sem promessas e sem publicidade disfarçada.
            </p>
        </div>

        <div className="flex flex-col gap-[2px]">
          {/* Estatistica com fonte. Nao ha numeros sem fonte neste site. */}
          <div className="tile flex flex-1 flex-col justify-end rounded-tr-[14px] p-8 lg:p-10">
            <p className="font-display text-xl font-black leading-snug text-foreground lg:text-2xl">
              Portugal é o país da OCDE onde se consomem mais ansiolíticos, hipnóticos e
              sedativos. Escreve-se muito sobre o que tomar. Quase nada sobre o que fazer.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Fonte:{" "}
              <a
                href="https://www.infarmed.pt/documents/15786/17838/Estudo-BZD.pdf/b8951315-1c12-43b0-a1bc-53246c2b8482"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-black/20 underline-offset-4 hover:text-foreground"
              >
                INFARMED
              </a>
            </p>
          </div>

          {/* Artigo em destaque, com imagem */}
          {destaque?.imagem && (
            <Link
              href={`/artigos/${destaque.slug}/`}
              className="group relative block min-h-[280px] flex-1 overflow-hidden"
            >
              {/*
                `prioridade` nao e' decoracao: esta e' a maior imagem acima da
                dobra da pagina inicial e, por isso, a candidata a LCP. Sem ela
                sai com loading="lazy" e o browser adia-a — que era exatamente
                o que estava a acontecer, e o que segurava o Speed Index em
                movel.
              */}
              <ImagemArtigo
                artigo={destaque}
                preencher
                prioridade
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8 lg:p-10">
                <span className="mb-3 block text-xs font-semibold uppercase tracking-widest text-white/60">
                  {pilares[destaque.pilar].nome} · {destaque.minutos} min
                </span>
                <p className="font-display text-xl font-black leading-snug text-white lg:text-2xl">
                  {destaque.titulo}
                </p>
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Barra de subscricao */}
      <div className="tile p-4 lg:p-5">
        <FormularioSubscricao etiqueta="Receba uma técnica por semana" />
      </div>
    </div>
  );
}
