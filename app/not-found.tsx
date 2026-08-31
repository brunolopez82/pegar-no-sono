import Link from "next/link";

export default function NaoEncontrado() {
  return (
    <section className="envolve py-28 text-center">
      <p className="etiqueta">Erro 404</p>
      <h1 className="mt-6 font-serif text-[34px] font-semibold sm:text-[44px]">
        Esta página não existe
      </h1>
      <p className="mx-auto mt-4 max-w-md text-[16.5px] leading-relaxed text-texto-suave">
        Deve ter sido movida ou o endereço está trocado. O arquivo completo está a um clique.
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link href="/artigos/" className="botao-primario">Ver todos os artigos</Link>
        <Link href="/" className="botao-secundario">Voltar ao início</Link>
      </div>
    </section>
  );
}
