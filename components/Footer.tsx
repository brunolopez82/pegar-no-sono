import Link from "next/link";
import { site, pilares, ordemPilares } from "@/lib/site";

export default function Footer() {
  return (
    <div className="tile rounded-b-[14px] p-8 lg:p-12">
      <div className="mb-8 grid gap-8 border-b border-border pb-8 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <p className="mb-1 font-display text-xl font-black tracking-tight text-foreground">
            {site.nome}
          </p>
          <p className="max-w-sm text-sm text-muted-foreground">
            {site.tagline}. Com as fontes à vista.
          </p>
          <a
            href={`mailto:${site.autor.email}`}
            className="mt-4 inline-block text-sm text-muted-foreground underline decoration-black/20 underline-offset-4 transition-colors hover:text-foreground"
          >
            {site.autor.email}
          </a>
        </div>

        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-foreground/40">
            Temas
          </p>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            {ordemPilares.map((p) => (
              <li key={p}>
                <Link href={`/temas/${p}/`} className="transition-colors hover:text-foreground">
                  {pilares[p].nome}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-foreground/40">
            Site
          </p>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li>
              <Link href="/artigos/" className="transition-colors hover:text-foreground">
                Todos os artigos
              </Link>
            </li>
            <li>
              <Link href="/sobre/" className="transition-colors hover:text-foreground">
                Sobre e método
              </Link>
            </li>
            <li>
              <Link href="/privacidade/" className="transition-colors hover:text-foreground">
                Privacidade
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-4 text-xs text-muted-foreground md:flex-row">
        <span>
          © {new Date().getFullYear()} {site.nome}
        </span>
        <span className="max-w-2xl md:text-right">
          Conteúdo informativo, não substitui aconselhamento médico. Nunca altere nem interrompa
          medicação prescrita sem falar com o seu médico.
        </span>
      </div>
    </div>
  );
}
