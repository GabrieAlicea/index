import type { MetadataRoute } from "next";

import { BLOG_POSTS } from "@/lib/data/blog";
import { SERVICE_CATEGORIES } from "@/lib/data/services";

const STATIC_ROUTES = [
  "",
  "/how-it-works",
  "/services",
  "/pricing",
  "/fleets",
  "/roadside-assistance",
  "/become-a-mechanic",
  "/about",
  "/faq",
  "/support",
  "/contact",
  "/blog",
  "/careers",
  "/legal/terms",
  "/legal/privacy",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://revvy.com";
  const now = new Date();

  const staticEntries = STATIC_ROUTES.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
  }));

  const serviceEntries = SERVICE_CATEGORIES.map((category) => ({
    url: `${siteUrl}/services/${category.slug}`,
    lastModified: now,
  }));

  const blogEntries = BLOG_POSTS.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
  }));

  return [...staticEntries, ...serviceEntries, ...blogEntries];
}
