import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de privacidade",
  description:
    "Que dados o Pegar no Sono recolhe, para que servem e como os pode apagar. Escrito para ser lido, não para ser aceite às cegas.",
  alternates: { canonical: "/privacidade/" },
  robots: { index: false, follow: true },
};

export default function Pagina() {
  return (
    <>
      <Navbar />
      <main id="conteudo" className="pagina">
        <div className="bento">
          <div className="tile rounded-t-[14px] px-6 py-12 lg:px-14 lg:py-16">
            <h1 className="mb-10 font-display text-4xl font-black leading-[0.95] tracking-tighter text-foreground lg:text-5xl">
              Política de privacidade
            </h1>

            <div className="artigo max-w-none">
          <p>
            Versão curta: este site não tem publicidade, não vende dados e não usa cookies de
            seguimento. A única informação pessoal que pode chegar aqui é o endereço de email, e
            só se o escrever de propósito no formulário.
          </p>

          <h2>O que é recolhido</h2>
          <ul>
            <li>
              <strong>Email</strong> — apenas se subscrever a lista. Serve exclusivamente para
              enviar os textos do {site.nome}. Não é partilhado nem vendido a ninguém.
            </li>
            <li>
              <strong>Registos do servidor</strong> — o alojamento guarda registos técnicos
              habituais (endereço IP, data e hora, página pedida) para funcionar e ficar seguro.
            </li>
          </ul>

          <h2>Cookies</h2>
          <p>
            Este site não coloca cookies de publicidade nem de perfilagem. Se, mais tarde, for
            adicionada uma ferramenta de estatísticas, será uma que não use cookies nem
            identifique visitantes, e esta página é atualizada antes disso acontecer.
          </p>

          <h2>Os seus direitos</h2>
          <p>
            Ao abrigo do RGPD, pode pedir acesso aos seus dados, a correção, o apagamento ou a
            portabilidade. Cada email da lista inclui uma ligação para sair, que funciona de
            imediato. Para qualquer pedido, escreva para{" "}
            <a href={`mailto:${site.autor.email}`}>{site.autor.email}</a> — respondo em pessoa.
          </p>

          <h2>Conteúdo e saúde</h2>
          <p>
            Os textos deste site são informativos e não constituem aconselhamento médico. Nada
            aqui deve servir para iniciar, alterar ou interromper medicação. Para isso existe o
            seu médico de família.
          </p>

          <h2>Alterações</h2>
          <p>
            Se esta política mudar, a alteração fica descrita nesta página. Responsável pelo
            tratamento dos dados: {site.autor.nome}, {site.autor.email}.
          </p>
            </div>
          </div>
          <Footer />
        </div>
      </main>
    </>
  );
}
