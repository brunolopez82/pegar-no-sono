import type { MetadataRoute } from "next";
import { site, cores } from "@/lib/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.nome} — ${site.tagline}`,
    short_name: site.nome,
    description: site.descricao,
    lang: site.idioma,
    start_url: "/",
    display: "minimal-ui",
    background_color: cores.fundo,
    theme_color: cores.fundo,
    icons: [
      { src: "/icone-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icone-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icone-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
