import Link from "next/link";
import { site } from "@/lib/site";

const links = [
  { href: "/artigos/", texto: "Artigos" },
  { href: "/temas/respiracao/", texto: "Respiração" },
  { href: "/temas/ansiedade/", texto: "Ansiedade" },
  { href: "/sobre/", texto: "Sobre" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-noite-800/85 backdrop-blur-xl">
      <nav className="envolve flex h-16 items-center justify-between gap-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-serif text-[17px] font-semibold tracking-tight"
        >
          <span className="grid h-7 w-7 place-items-center rounded-full bg-ambar-400/12 text-ambar-400">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
            </svg>
          </span>
          {site.nome}
        </Link>

        <ul className="hidden items-center gap-7 text-[14px] text-texto-suave md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="transition hover:text-texto">
                {l.texto}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/#newsletter"
          className="rounded-lg bg-ambar-400 px-4 py-2 text-[13.5px] font-semibold text-noite-900 transition hover:bg-ambar-300"
        >
          Receber por email
        </Link>
      </nav>
    </header>
  );
}
