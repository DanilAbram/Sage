import type { Metadata, Viewport } from "next";
import { Overpass } from "next/font/google";
import "./globals.css";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, SITE, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  applicationName: SITE_NAME,
  title: { default: DEFAULT_TITLE, template: "%s | Sage" },
  description: DEFAULT_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    url: "/",
    title: "Turn what you love into a career | Sage",
    description:
      "Describe your hobbies and get careers that fit, with a reason for each and a concrete first step. Free preview, 7-day free trial.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Turn what you love into a career | Sage",
    description:
      "Describe your hobbies and get careers that fit, with a reason for each and a concrete first step. Free preview, 7-day free trial.",
  },
};

const sans = Overpass({ subsets: ["latin"], weight: ["200", "300", "400", "500", "600", "700"], variable: "--font-sans", display: "swap" });

export const viewport: Viewport = { themeColor: "#141B12" };

// Applies saved Settings (theme, text size, reduce motion, language) before first paint, so nothing flashes.
// Mirrors applySettings() in components/SageApp.tsx.
const SETTINGS_BOOT = `(function(){try{var r=document.documentElement,s=JSON.parse(localStorage.getItem("sage-settings")||"{}");r.dataset.theme=s.theme||"dark";if(s.size&&s.size!=="m")r.dataset.size=s.size;var m=s.reduce!=null?s.reduce:matchMedia("(prefers-reduced-motion: reduce)").matches;if(m)r.dataset.motion="reduce";var l=localStorage.getItem("sage-lang");if(l)r.lang=l;}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={sans.variable} data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SETTINGS_BOOT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
