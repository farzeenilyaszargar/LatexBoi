import type { MetadataRoute } from "next";
import { SITE_URL } from "./seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/guide"].map(path => ({ url: `${SITE_URL}${path}`, changeFrequency: "monthly", priority: path ? 0.8 : 1 }));
}
