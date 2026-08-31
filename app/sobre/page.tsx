import type { Metadata } from "next";
import Link from "next/link";
import Subscrever from "@/components/Subscrever";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sobre e método editorial",
  description:
    "Quem escreve o Pegar no Sono, como os artigos são escritos, o que este site nunca faz e onde ficam os limites entre informação e aconselhamento médico.",
  alternates: { canonical: "/sobre/" },
};

const regras = [
  {
    titulo: "Técnicas, nunca substâncias",
    texto:
      "Este site trata de respiração, rotinas, luz, temperatura, ruído e horários. Não recomenda suplementos, chás, melatonina nem qualquer produto que se tome. Não é uma posição contra nada — é uma delimitação do assunto.",
  },
  {
    titulo: "Aditivo, nunca subtrativo",
    texto:
      "Se toma medicação para dormir, nada aqui é motivo para a reduzir ou parar. Interromper certos medicamentos por conta própria é perigoso. Estas técnicas somam-se ao que já faz; qualquer alteração de medicação decide-se com o seu médico de família.",
  },
  {
    titulo: "Números só com fonte",
    texto:
      "Quando aparece uma percentagem ou um estudo, a ligação é para a fonte primária, não para um artigo sobre ela. Quando um número famoso é frágil — vem de um livro e não de um ensaio clínico — está escrito que é frágil.",
  },
  {
    titulo: "Escrito para Portugal",
    texto:
      "Português de Portugal, sem exceções. Preços em euros, disponibilidade real em Portugal, verões sem ar condicionado, prédios com vizinhos, horários portugueses. A maior parte do conteúdo sobre sono em português é brasileiro e erra estes detalhes.",
  },
  {
    titulo: "Sem prova social inventada",
    texto:
      "Não vai encontrar contadores de subscritores, testemunhos fabricados nem resultados pessoais que eu não tenha registado. Quando publicar dados do meu próprio sono, são os registos, com o método e as falhas à vista.",
  },
];

export default function Pagina() {
  return (
    <>
      <section className="envolve py-16 sm:py-20">
        <div className="mx-auto max-w-leitura">
          <p className="etiqueta">Sobre</p>
          <h1 className="mt-6 font-serif text-[36px] font-semibold leading-tight sm:text-[48px]">
            Quem escreve, e com que regras
          </h1>

          <div className="artigo mt-10">
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
              Este site existe porque Portugal é o maior consumidor de ansiolíticos da OCDE e um
              dos maiores do mundo em benzodiazepinas. Escreve-se muito, em português, sobre o que
              tomar para dormir. Quase nada sobre o que fazer. É essa metade que falta.
            </p>

            <h2>As cinco regras</h2>
          </div>

          <div className="mt-8 space-y-4">
            {regras.map((r, i) => (
              <div key={r.titulo} className="cartao p-6">
                <div className="flex items-baseline gap-3">
                  <span className="font-serif text-[13px] text-ambar-400/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-serif text-[19px] font-semibold">{r.titulo}</h3>
                </div>
                <p className="mt-3 text-[15.5px] leading-relaxed text-texto-suave">{r.texto}</p>
              </div>
            ))}
          </div>

          <div className="artigo mt-14">
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
      </section>

      <Subscrever />
    </>
  );
}
