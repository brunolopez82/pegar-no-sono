import Link from "next/link";
import { site, pilares, ordemPilares } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/8 bg-noite-900">
      <div className="envolve grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <p className="font-serif text-lg font-semibold">{site.nome}</p>
          <p className="mt-3 max-w-sm text-[14.5px] leading-relaxed text-texto-fraco">
            {site.tagline}. Técnicas, não substâncias. Escrito em português de Portugal.
          </p>
        </div>

        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-texto-fraco">
            Temas
          </p>
          <ul className="mt-4 space-y-2.5 text-[14.5px] text-texto-suave">
            {ordemPilares.map((p) => (
              <li key={p}>
                <Link href={`/temas/${p}/`} className="transition hover:text-ambar-300">
                  {pilares[p].nome}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-texto-fraco">
            Site
          </p>
          <ul className="mt-4 space-y-2.5 text-[14.5px] text-texto-suave">
            <li><Link href="/artigos/" className="transition hover:text-ambar-300">Todos os artigos</Link></li>
            <li><Link href="/sobre/" className="transition hover:text-ambar-300">Sobre e método</Link></li>
            <li><Link href="/privacidade/" className="transition hover:text-ambar-300">Privacidade</Link></li>
            <li>
              <a href={`mailto:${site.autor.email}`} className="transition hover:text-ambar-300">
                {site.autor.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/8">
        <div className="envolve flex flex-col gap-3 py-6 text-[13px] text-texto-fraco sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.nome}
          </p>
          <p className="max-w-xl sm:text-right">
            Conteúdo informativo. Não substitui aconselhamento médico e nunca deve servir para
            iniciar, alterar ou interromper medicação. Fale com o seu médico de família.
          </p>
        </div>
      </div>
    </footer>
  );
}
