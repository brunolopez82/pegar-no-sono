import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Crawlers de IA explicitamente convidados: ser citado por respostas de IA
      // e' um objetivo declarado deste site, nao um efeito lateral.
      { userAgent: ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended", "OAI-SearchBot"], allow: "/" },
      { userAgent: "*", allow: "/", disallow: "/privacidade/" },
    ],
    sitemap: `${site.dominio}/sitemap.xml`,
    // O feed nao e' um sitemap, mas e' uma segunda porta de entrada para
    // agregadores e crawlers que preferem RSS a HTML.
    host: site.dominio,
  };
}
