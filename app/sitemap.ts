import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: "https://unleaf.lol", changeFrequency: "monthly", priority: 1 }];
}
