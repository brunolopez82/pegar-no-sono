import Link from "next/link";
import { pilares } from "@/lib/site";
import { dataExtenso, type MetaArtigo } from "@/lib/artigos";

export default function CartaoArtigo({
  artigo,
  grande = false,
}: {
  artigo: MetaArtigo;
  grande?: boolean;
}) {
  return (
    <article className={`cartao group flex flex-col ${grande ? "p-7 sm:p-9" : "p-6"}`}>
      <div className="flex items-center gap-3 text-[12px] text-texto-fraco">
        <Link
          href={`/temas/${artigo.pilar}/`}
          className="rounded-full border border-ambar-400/25 bg-ambar-400/8 px-2.5 py-0.5 font-medium text-ambar-300 transition hover:bg-ambar-400/15"
        >
          {pilares[artigo.pilar].nome}
        </Link>
        <span>{artigo.minutos} min de leitura</span>
      </div>

      <h3
        className={`mt-4 font-serif font-semibold leading-snug ${
          grande ? "text-[28px] sm:text-[34px]" : "text-[21px]"
        }`}
      >
        <Link href={`/artigos/${artigo.slug}/`} className="transition group-hover:text-ambar-300">
          {artigo.titulo}
        </Link>
      </h3>

      <p
        className={`mt-3 flex-1 leading-relaxed text-texto-suave ${
          grande ? "text-[16.5px]" : "text-[15px]"
        }`}
      >
        {grande ? artigo.resposta : artigo.descricao}
      </p>

      <div className="mt-6 flex items-center justify-between border-t border-white/8 pt-4 text-[13px] text-texto-fraco">
        <time dateTime={artigo.data}>{dataExtenso(artigo.data)}</time>
        <Link
          href={`/artigos/${artigo.slug}/`}
          className="font-medium text-texto-suave transition group-hover:text-ambar-300"
        >
          Ler →
        </Link>
      </div>
    </article>
  );
}
