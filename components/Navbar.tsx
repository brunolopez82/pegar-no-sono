import Link from "next/link";
import { site } from "@/lib/site";

const links = [
  { href: "/artigos/", texto: "Artigos" },
  { href: "/temas/respiracao/", texto: "Respiração" },
  { href: "/sobre/", texto: "Sobre" },
];

export default function Navbar() {
  return (
    <header className="flex h-[100px] items-center px-5 lg:px-10">
      <div className="flex w-full items-center justify-between">
        <Link
          href="/"
          className="font-display text-xl font-black tracking-tight text-foreground"
        >
          {site.nome}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
            >
              {l.texto}
            </Link>
          ))}
          <Link href="/#subscrever" className="botao-preto">
            Subscrever
          </Link>
        </nav>

        <Link href="/#subscrever" className="botao-preto md:hidden">
          Subscrever
        </Link>
      </div>
    </header>
  );
}
