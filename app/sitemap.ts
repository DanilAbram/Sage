import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
  // the contact page is only worth indexing once it shows a real address
  if (process.env.NEXT_PUBLIC_CONTACT_EMAIL) {
    pages.push({ url: `${SITE}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.3 });
  }
  return pages;
}
