import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import DadosEstruturados from "@/components/DadosEstruturados";
import { site, ogPadrao } from "@/lib/site";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const display = Montserrat({
  subsets: ["latin"],
  // 600 porque font-semibold e usado; 800 saiu porque font-extrabold nao e usado.
  weight: ["600", "700", "900"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.dominio),
  title: {
    default: `${site.nome} — ${site.tagline}`,
    template: `%s | ${site.nome}`,
  },
  description: site.descricao,
  authors: [{ name: site.autor.nome }],
  creator: site.autor.nome,
  openGraph: {
    type: "website",
    locale: "pt_PT",
    siteName: site.nome,
    title: `${site.nome} — ${site.tagline}`,
    description: site.descricao,
    url: site.dominio,
    images: [ogPadrao],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.nome} — ${site.tagline}`,
    description: site.descricao,
    images: [ogPadrao.url],
  },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const identidade = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: site.nome,
      url: site.dominio,
      inLanguage: "pt-PT",
      description: site.descricao,
      publisher: { "@id": `${site.dominio}/#autor` },
    },
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": `${site.dominio}/#autor`,
      name: site.autor.nome,
      description: site.autor.bio,
      url: `${site.dominio}/sobre/`,
      email: site.autor.email,
      knowsAbout: [
        "sono",
        "insónia",
        "técnicas de respiração",
        "higiene do sono",
        "ritmo circadiano",
      ],
      // So emite `sameAs` se houver perfis reais. Uma lista vazia no schema
      // e' ruido; um perfil errado e' pior do que nenhum.
      ...(site.autor.perfis.length > 0 ? { sameAs: site.autor.perfis } : {}),
    },
  ];

  return (
    <html lang="pt-PT" className={`${sans.variable} ${display.variable}`}>
      <head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`${site.nome} — artigos`}
          href="/feed.xml"
        />
        {/* Sem JavaScript, o conteudo tem de aparecer na mesma. */}
        <noscript>
          <style>{`.revelar{opacity:1 !important}`}</style>
        </noscript>
      </head>
      <body className="min-h-screen bg-background">
        <DadosEstruturados dados={identidade} />
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60]
                     focus:rounded-full focus:bg-foreground focus:px-4 focus:py-2 focus:text-background"
        >
          Saltar para o conteúdo
        </a>
        {children}
      </body>
    </html>
  );
}
