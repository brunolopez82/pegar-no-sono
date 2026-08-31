import Link from "next/link";
import Hero from "@/components/Hero";
import GrelhaPilares from "@/components/GrelhaPilares";
import CartaoArtigo from "@/components/CartaoArtigo";
import Subscrever from "@/components/Subscrever";
import { todosOsArtigos, artigoEmDestaque } from "@/lib/artigos";
import { site } from "@/lib/site";

export default function Pagina() {
  const destaque = artigoEmDestaque();
  const restantes = todosOsArtigos()
    .filter((a) => a.slug !== destaque?.slug)
    .slice(0, 6);

  return (
    <>
      <Hero />

      {destaque && (
        <section className="envolve pb-4">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="font-serif text-[22px] font-semibold text-texto-suave">
              Comece por aqui
            </h2>
            <Link href="/artigos/" className="text-[14px] text-texto-fraco transition hover:text-ambar-300">
              Todos os artigos →
            </Link>
          </div>
          <CartaoArtigo artigo={destaque} grande />

          {restantes.length > 0 && (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {restantes.map((a) => (
                <CartaoArtigo key={a.slug} artigo={a} />
              ))}
            </div>
          )}
        </section>
      )}

      <GrelhaPilares />

      <section className="envolve pb-4">
        <div className="rounded-3xl border border-white/8 bg-noite-700/40 p-8 sm:p-12">
          <p className="etiqueta">Porque é que este site existe</p>
          <div className="mt-6 grid gap-8 lg:grid-cols-2">
            <p className="font-serif text-[22px] leading-snug text-texto sm:text-[26px]">
              Portugal é o maior consumidor de ansiolíticos da OCDE. Escreve-se muito sobre o que
              tomar para dormir. Quase nada sobre o que fazer.
            </p>
            <div className="space-y-4 text-[16px] leading-relaxed text-texto-suave">
              <p>
                Este site trata da segunda parte, e só dela: respiração, rotinas, luz, temperatura,
                horários. Coisas que se experimentam esta noite e que não se compram.
              </p>
              <p>
                Nada aqui é motivo para começar, mudar ou parar medicação — essa conversa é com o
                seu médico de família, e só com ele. O que estas páginas fazem é somar, nunca
                subtrair.
              </p>
              <p>
                <Link href="/sobre/" className="text-ambar-300 underline decoration-ambar-400/40 underline-offset-4">
                  Quem escreve e como é escrito
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <Subscrever />
    </>
  );
}
