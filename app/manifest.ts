import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sage: careers from your hobbies",
    short_name: "Sage",
    description: "Write what you enjoy. Sage suggests careers that fit, explains why, and gives you a first step.",
    start_url: "/",
    display: "standalone",
    background_color: "#141B12",
    theme_color: "#141B12",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
