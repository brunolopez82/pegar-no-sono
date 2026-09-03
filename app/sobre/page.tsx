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
    titulo: "A comissão diz-se antes",
    texto:
      "Alguns artigos terão ligações de afiliado, e quando tiverem está escrito no topo do artigo — antes da recomendação, não no rodapé depois de já ter clicado. A comissão não muda o que aqui se escreve: nada é recomendado por render, e um produto com evidência fraca é descrito como tendo evidência fraca mesmo que dê dinheiro.",
    grad: "var(--grad-areia)",
  },
  {
    titulo: "A mesma régua para tudo",
    texto:
      "Respiração, rotinas, luz, temperatura, ruído, horários — e também os suplementos que toda a gente experimenta, porque ficar calado sobre eles não é neutralidade. O que não muda é a régua: fonte primária, e a fragilidade dela dita em voz alta. Nada aqui é recomendação por omissão.",
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
    titulo: "Aplicável à casa de quem lê",
    texto:
      "Apartamentos sem ar condicionado em agosto, vizinhos por cima, turnos, horários reais de quem trabalha. E quando é preciso encaminhar para um médico, o artigo diz onde. São os detalhes que decidem se um conselho se aplica à sua casa ou se é apenas bonito.",
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
                Durante anos, o que eu fazia às três da manhã era isto: levantava-me e ia fumar um
                cigarro. Fazia-o com a convicção de quem sabe o que está a fazer — o cigarro
                acalmava-me, portanto ajudava-me a voltar a adormecer. Nunca me passou pela cabeça
                que pudesse ser ao contrário.
              </p>
              <p>
                Quando o cigarro não chegava, pegava no telemóvel. Essa parte não preciso de
                explicar a ninguém que esteja a ler isto às duas da manhã.
              </p>
              <p>
                Nenhuma das duas resultou, uma única vez. E o que demorei a perceber não foi que
                não resultavam — isso via-se todas as noites. Foi que uma delas estava a fazer o
                oposto do que eu julgava, e que eu tinha passado anos sem nunca ter ido verificar.
              </p>
              <p>
                Quando finalmente fui procurar melhor, encontrei um muro. Voltaram listas de dez
                dicas iguais entre si, todas sem uma única fonte. Voltaram páginas institucionais
                atualizadas pela última vez numa década anterior. E voltou publicidade, muita
                publicidade, a coisas para tomar. Em inglês estava tudo lá: os estudos, as
                revisões, as normas clínicas. Em português, entre mim e essa informação, não estava
                praticamente nada.
              </p>
              <p>
                Chamo-me {site.autor.nome}. Construo sites para viver e durmo mal há anos, o que faz
                de mim exatamente duas coisas: alguém que conhece este problema por dentro, e alguém
                sem qualquer credencial clínica para o tratar.
              </p>
              <p>
                <strong>Não sou médico, nem psicólogo, nem terapeuta do sono.</strong> Digo-o aqui em
                cima e não no rodapé, porque é a coisa mais importante a saber antes de ler o resto
                desta página.
              </p>
              <p>
                O que sei fazer é outra coisa, e é a única coisa que este site promete. Ir à fonte:
                ler o estudo em vez da notícia sobre o estudo. Reparar quando um número que toda a
                gente repete vem de um livro e não de um ensaio — e escrever no artigo que é frágil,
                sobretudo quando dava mais jeito não escrever. E depois passar tudo isso para
                linguagem simples, com prédios com vizinhos e com agosto sem ar condicionado.
              </p>
              <p>
                Este site existe por causa de um número. Portugal é o país da OCDE onde se consomem
                mais ansiolíticos, hipnóticos e sedativos. Escreve-se muito, em português, sobre o
                que tomar para dormir. Quase nada sobre o que fazer antes disso. É essa metade que
                falta, e é só essa metade que se escreve aqui.
              </p>
              <p>
                Por isso não lhe vou prometer que dorme hoje. Vou dizer-lhe o que a evidência
                mostra, quão sólida ela é, e onde é frágil — e o que pode experimentar esta noite
                sem comprar nada. O resto faz-se com semanas, não com uma noite.
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
              <h2>Uma palavra que costuma assustar: biohacking</h2>
              <p>
                Vai encontrar esta palavra aqui, por isso mais vale explicá-la já — sobretudo
                porque metade dela é <em>hacking</em>, e essa metade traz uma bagagem que não lhe
                pertence.
              </p>
              <p>
                <strong>Hacking, no sentido original, não tem nada que ver com invadir
                computadores.</strong> Quer dizer abrir um sistema para perceber como funciona,
                mexer numa peça de cada vez e observar o que muda. É o que faz quem desmonta um
                motor para perceber o ruído, ou quem tira um bocado de código para ver o que deixa
                de acontecer. Junte-lhe <em>bio</em> e o sistema que se está a abrir passa a ser o
                seu próprio corpo.
              </p>
              <p>Na prática, aqui, resume-se a quatro passos sem nada de exótico:</p>
              <ol>
                <li>Escolher <strong>uma</strong> coisa para mudar.</li>
                <li>Mudar só essa, e manter o resto igual.</li>
                <li>Registar o que acontece durante duas a quatro semanas.</li>
                <li>Ficar com o que resistiu e largar o resto sem pena nenhuma.</li>
              </ol>
              <p>
                É metodologia aborrecida a fingir que é futurismo. A parte difícil não é a
                tecnologia — é a disciplina de mudar uma variável de cada vez quando apetece mudar
                cinco.
              </p>
              <p>
                E porquê num site sobre sono? Porque o sono é a variável que mexe em todas as
                outras. Quase tudo o que se experimenta — o banho gelado de manhã, comer mais tarde
                ou mais cedo, apanhar sol nos primeiros minutos do dia, treinar à noite — acaba
                julgado pela mesma pergunta: <em>dormi melhor, e como me senti no dia seguinte?</em>{" "}
                O sono é a base, e é por isso que é ele o assunto desta casa. O resto ancora-se
                nele.
              </p>
              <p>
                Duas fronteiras, para saber o que esperar. A primeira:{" "}
                <strong>nada aqui é recomendação por omissão.</strong> Escrevo sobre técnicas,
                sobre hábitos e também sobre os suplementos que toda a gente experimenta — mas
                escrever sobre uma coisa não é receitá-la, e qualquer artigo que toque num
                suplemento leva a secção de interações e manda quem já toma medicação falar com
                o médico ou o farmacêutico primeiro. A segunda:{" "}
                <strong>a maior parte do que se vende com este nome tem evidência fraca</strong>, e
                aqui isso é dito. Quando um hábito famoso não se aguenta em pé, o artigo diz que
                não se aguenta — e continua a valer a pena tê-lo escrito.
              </p>
              <p>
                Se um hábito envolver alterar padrões alimentares, exposição ao frio intenso, ou se
                tiver alguma condição de saúde, essa conversa é com o seu médico antes de ser
                consigo.
              </p>

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
