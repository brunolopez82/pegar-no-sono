import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Revelar from "@/components/Revelar";
import Subscrever from "@/components/Subscrever";
import Footer from "@/components/Footer";
import DadosEstruturados from "@/components/DadosEstruturados";
import { AvatarAutor } from "@/components/SobreAutor";
import { site, ogPadrao } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sobre e método editorial",
  description:
    "Quem escreve o Pegar no Sono, como os artigos são escritos, o que este site nunca faz e onde ficam os limites entre informação e aconselhamento médico.",
  alternates: { canonical: "/sobre/" },
  openGraph: {
    type: "profile",
    title: "Sobre e método editorial",
    description:
      "Quem escreve o Pegar no Sono, como os artigos são escritos, e onde ficam os limites entre informação e aconselhamento médico.",
    images: [ogPadrao],
  },
};

const regras = [
  {
    titulo: "Técnicas, nunca substâncias",
    texto:
      "Este site trata de respiração, rotinas, luz, temperatura, ruído e horários. Não recomenda suplementos, chás, melatonina nem qualquer produto que se tome. Não é uma posição contra nada — é uma delimitação do assunto.",
    grad: "var(--grad-roxo)",
  },
  {
    titulo: "Aditivo, nunca subtrativo",
    texto:
      "Se toma medicação para dormir, nada aqui é motivo para a reduzir ou parar. Interromper certos medicamentos por conta própria é perigoso. Estas técnicas somam-se ao que já faz; qualquer alteração de medicação decide-se com o seu médico de família.",
    grad: "var(--grad-pessego)",
  },
  {
    titulo: "Números só com fonte",
    texto:
      "Quando aparece uma percentagem ou um estudo, a ligação é para a fonte primária, não para um artigo sobre ela. Quando um número famoso é frágil — vem de um livro e não de um ensaio clínico — está escrito que é frágil.",
    grad: "var(--grad-verde)",
  },
  {
    titulo: "Escrito para Portugal",
    texto:
      "Português de Portugal, sem exceções. Preços em euros, disponibilidade real em Portugal, verões sem ar condicionado, prédios com vizinhos, horários portugueses. A maior parte do conteúdo sobre sono em português é brasileiro e erra estes detalhes.",
    grad: "var(--grad-azul)",
  },
  {
    titulo: "Sem prova social inventada",
    texto:
      "Não vai encontrar contadores de subscritores, testemunhos fabricados nem resultados pessoais que eu não tenha registado. Quando publicar dados do meu próprio sono, são os registos, com o método e as falhas à vista.",
    grad: "var(--grad-rosa)",
  },
];

export default function Pagina() {
  // Esta e' a pagina de E-E-A-T do site: e' aqui que um motor confirma quem
  // escreve e com que regras. Sem ProfilePage, e' apenas mais uma pagina de
  // texto; com ela, aponta explicitamente para a entidade Person ja declarada
  // no layout, e o `@id` liga tudo ao mesmo autor.
  const perfil = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: "Sobre e método editorial",
    url: `${site.dominio}/sobre/`,
    inLanguage: "pt-PT",
    isPartOf: { "@type": "WebSite", name: site.nome, url: site.dominio },
    mainEntity: { "@id": `${site.dominio}/#autor` },
  };

  return (
    <>
      <Navbar />
      <DadosEstruturados dados={perfil} />

      <main id="conteudo" className="pagina">
        <div className="bento">
          <div className="tile flex flex-col items-start gap-10 rounded-t-[14px] p-8 md:flex-row lg:p-14">
            <Revelar>
              <AvatarAutor tamanho="grande" />
            </Revelar>
            <Revelar atraso={0.1} className="flex-1">
              <span className="etiqueta">Sobre</span>
              <h1 className="font-display text-4xl font-black leading-[0.95] tracking-tighter text-foreground lg:text-6xl">
                Quem escreve, e com que regras
              </h1>
              <p className="mt-6 max-w-xl text-base text-muted-foreground lg:text-lg">
                {site.autor.bio}
              </p>
            </Revelar>
          </div>

          <div className="tile px-6 py-12 lg:px-14 lg:py-16">
            <div className="artigo max-w-none">
              <p>
                Chamo-me {site.autor.nome}. Construo sites para viver e durmo mal há anos — foi por
                aí que isto começou. Passei tempo demasiado a ler sobre sono em inglês e a
                encontrar, em português, ou conteúdo brasileiro com preços em reais, ou páginas
                institucionais paradas há uma década, ou marketing de farmácia.
              </p>
              <p>
                <strong>Não sou médico, nem psicólogo, nem terapeuta do sono.</strong> Digo isto no
                início e não no rodapé, porque é a coisa mais importante a saber antes de ler o
                resto. O que faço é ler as fontes primárias, escrever o que elas dizem em português
                claro, experimentar em mim, e registar o que acontece.
              </p>
              <p>
                Este site existe porque Portugal é o maior consumidor de ansiolíticos da OCDE.
                Escreve-se muito, em português, sobre o que tomar para dormir. Quase nada sobre o
                que fazer. É essa metade que falta.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-[2px] md:grid-cols-2 lg:grid-cols-3">
            {regras.map((r, i) => (
              <Revelar key={r.titulo} atraso={i * 0.06} className="h-full">
                <div
                  className="flex h-full min-h-[280px] flex-col justify-end p-8 lg:p-10"
                  style={{ background: r.grad }}
                >
                  <span className="mb-auto font-display text-sm font-black text-foreground/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="mb-3 mt-8 font-display text-xl font-black tracking-tight text-foreground lg:text-2xl">
                    {r.titulo}
                  </h2>
                  <p className="text-sm leading-relaxed text-foreground/70">{r.texto}</p>
                </div>
              </Revelar>
            ))}
          </div>

          <div className="tile px-6 py-12 lg:px-14 lg:py-16">
            <div className="artigo max-w-none">
              <h2>Quando isto não chega</h2>
              <p>
                Estas técnicas servem para o sono partido por stress, horários e hábitos. Não servem
                para tudo. Marque consulta com o seu médico de família se: a dificuldade em dormir
                dura há mais de três meses; dorme as horas todas e continua exausto; ressona com
                pausas na respiração; tem pernas inquietas que não o deixam estar parado; ou se o
                sono mudou de repente sem explicação.
              </p>
              <p>
                Se está a passar por uma crise de saúde mental, o SNS responde pela Linha SNS 24, no{" "}
                <strong>808 24 24 24</strong>.
              </p>

              <h2>Contacto</h2>
              <p>
                Correções, erros factuais e discordâncias são bem-vindos — sobretudo os erros.
                Escreva para <a href={`mailto:${site.autor.email}`}>{site.autor.email}</a>.
              </p>
              <p>
                <Link href="/artigos/">Ver todos os artigos</Link>
              </p>
            </div>
          </div>

          <Subscrever />
          <Footer />
        </div>
      </main>
    </>
  );
}
