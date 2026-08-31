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
    host: site.dominio,
  };
}
