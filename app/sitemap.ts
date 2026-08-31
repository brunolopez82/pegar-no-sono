import type { MetadataRoute } from "next";
import { todosOsArtigos } from "@/lib/artigos";
import { site, ordemPilares } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const artigos = todosOsArtigos();
  const maisRecente = artigos[0]?.atualizado ?? artigos[0]?.data ?? new Date().toISOString();

  return [
    { url: `${site.dominio}/`, lastModified: maisRecente, changeFrequency: "weekly", priority: 1 },
    { url: `${site.dominio}/artigos/`, lastModified: maisRecente, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site.dominio}/sobre/`, changeFrequency: "yearly", priority: 0.5 },
    ...ordemPilares.map((p) => ({
      url: `${site.dominio}/temas/${p}/`,
      lastModified: maisRecente,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...artigos.map((a) => ({
      url: `${site.dominio}/artigos/${a.slug}/`,
      lastModified: a.atualizado ?? a.data,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
