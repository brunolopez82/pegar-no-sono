import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CartaoArtigo from "@/components/CartaoArtigo";
import GrelhaPilares from "@/components/GrelhaPilares";
import OQueRecebe from "@/components/OQueRecebe";
import SobreAutor from "@/components/SobreAutor";
import Subscrever from "@/components/Subscrever";
import Footer from "@/components/Footer";
import { todosOsArtigos, artigoEmDestaque } from "@/lib/artigos";

export default function Pagina() {
  const destaque = artigoEmDestaque();
  const restantes = todosOsArtigos()
    .filter((a) => a.slug !== destaque?.slug)
    .slice(0, 3);

  return (
    <>
      <Navbar />

      {/* Bento: o fundo preto passa nos intervalos de 2px entre tiles. */}
      <main id="conteudo" className="pagina">
        <div className="bento">
          <Hero destaque={destaque} />

          {restantes.length > 0 && (
            <div className="grid grid-cols-1 gap-[2px] md:grid-cols-3">
              {restantes.map((a, i) => (
                <CartaoArtigo
                  key={a.slug}
                  artigo={a}
                  variante={i === 1 ? "imagem" : "gradiente"}
                  atraso={i * 0.08}
                  nivel={2}
                />
              ))}
            </div>
          )}

          <GrelhaPilares />
          <OQueRecebe />
          <SobreAutor />
          <Subscrever />
          <Footer />
        </div>
      </main>
    </>
  );
}
