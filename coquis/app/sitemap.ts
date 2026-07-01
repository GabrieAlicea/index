import type { MetadataRoute } from "next";

const BASE_URL = "https://coquis.example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/creator", "/gallery"];
  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
  }));
}
