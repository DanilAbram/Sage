// Public site address. Set NEXT_PUBLIC_SITE_URL in production (e.g. https://sage.example).
export const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3100").replace(/\/+$/, "");

if (process.env.NODE_ENV === "production" && !process.env.NEXT_PUBLIC_SITE_URL) {
  console.warn("[sage] NEXT_PUBLIC_SITE_URL is not set: canonical links, sitemap and social cards will point at localhost.");
}

export const SITE_NAME = "Sage";
export const DEFAULT_TITLE = "AI Career Finder From Your Hobbies | Sage";
export const DEFAULT_DESCRIPTION =
  "Tell Sage what you love doing. AI matches your hobbies to real careers, explains why each fits, and gives you a first step to take. Try it free.";
