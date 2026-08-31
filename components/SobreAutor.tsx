import Link from "next/link";
import Revelar from "./Revelar";
import { site, temFotoAutor } from "@/lib/site";

/** Monograma usado enquanto nao existir public/autor.jpg. Nunca uma foto de outra pessoa. */
function Monograma({ tamanho = "grande" }: { tamanho?: "grande" | "pequeno" }) {
  const iniciais = site.autor.nome
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2);

  return (
    <span
      className={
        tamanho === "grande"
          ? "flex h-36 w-36 shrink-0 items-center justify-center rounded-2xl font-display text-4xl font-black text-foreground/70 lg:h-44 lg:w-44 lg:text-5xl"
          : "flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-display text-sm font-black text-foreground/70"
      }
      style={{ background: "var(--grad-pessego)" }}
      aria-hidden="true"
    >
      {iniciais}
    </span>
  );
}

export function AvatarAutor({ tamanho = "pequeno" }: { tamanho?: "grande" | "pequeno" }) {
  if (!temFotoAutor()) return <Monograma tamanho={tamanho} />;

  return (
    <img
      src="/autor.jpg"
      alt={site.autor.nome}
      className={
        tamanho === "grande"
          ? "h-36 w-36 shrink-0 rounded-2xl object-cover grayscale lg:h-44 lg:w-44"
          : "h-11 w-11 shrink-0 rounded-full object-cover grayscale"
      }
    />
  );
}

export default function SobreAutor() {
  return (
    <div className="tile flex flex-col items-center gap-10 p-8 md:flex-row md:items-start lg:gap-12 lg:p-12">
      <Revelar>
        <AvatarAutor tamanho="grande" />
      </Revelar>

      <Revelar atraso={0.1} className="flex-1">
        <div className="text-center md:text-left">
          <h2 className="mb-1 font-display text-2xl font-black tracking-tight text-foreground lg:text-3xl">
            {site.autor.nome}
          </h2>
          <p className="mb-5 text-sm font-medium text-muted-foreground">{site.autor.funcao}</p>
          <p className="mb-7 text-sm leading-relaxed text-muted-foreground">{site.autor.bio}</p>
          <Link href="/sobre/" className="botao-preto">
            As regras com que escrevo
          </Link>
        </div>
      </Revelar>
    </div>
  );
}
