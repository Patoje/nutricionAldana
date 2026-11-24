import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const page = (path: string, priority: number, changeFrequency: "monthly" | "yearly") => ({
    url: new URL(path, base).toString(),
    lastModified: new Date(),
    changeFrequency,
    priority,
  });
  return [page("/", 1, "monthly"), page("/privacidad", 0.2, "yearly"), page("/aviso-legal", 0.2, "yearly")];
}
