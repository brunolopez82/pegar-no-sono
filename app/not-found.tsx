import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NaoEncontrado() {
  return (
    <>
      <Navbar />
      <main id="conteudo" className="pagina">
        <div className="bento">
          <div
            className="rounded-t-[14px] p-8 py-24 text-center lg:p-14 lg:py-32"
            style={{ background: "var(--grad-pessego)" }}
          >
            <span className="etiqueta">Erro 404</span>
            <h1 className="font-display text-4xl font-black leading-[0.95] tracking-tighter text-foreground lg:text-6xl">
              Esta página não existe
            </h1>
            <p className="mx-auto mt-6 max-w-md text-base text-foreground/60 lg:text-lg">
              Deve ter sido movida, ou o endereço está trocado. O arquivo completo está a um clique.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/artigos/" className="botao-preto">Ver todos os artigos</Link>
              <Link href="/" className="text-sm font-semibold text-foreground/60 underline decoration-black/20 underline-offset-4 hover:text-foreground">
                Voltar ao início
              </Link>
            </div>
          </div>
          <Footer />
        </div>
      </main>
    </>
  );
}
