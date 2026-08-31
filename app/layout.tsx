import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DadosEstruturados from "@/components/DadosEstruturados";
import { site } from "@/lib/site";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const serif = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-serif",
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
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.nome} — ${site.tagline}`,
    description: site.descricao,
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
    },
  ];

  return (
    <html lang="pt-PT" className={`${sans.variable} ${serif.variable}`}>
      <body className="min-h-screen">
        <DadosEstruturados dados={identidade} />
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60]
                     focus:rounded-lg focus:bg-ambar-400 focus:px-4 focus:py-2 focus:text-noite-900"
        >
          Saltar para o conteúdo
        </a>
        <Navbar />
        <main id="conteudo">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
