import SageApp from "@/components/SageApp";
import { FAQ_COUNT, STRINGS } from "@/lib/i18n";
import { SITE } from "@/lib/site";

// Structured data, rendered on the server from the same strings the page shows.
// Offers are left out on purpose until prices are final (Google compares schema prices with the page).
function jsonLd() {
  const s = STRINGS.en;
  const faq = Array.from({ length: FAQ_COUNT }, (_, i) => ({
    "@type": "Question",
    name: s[`faq.q${i + 1}`],
    acceptedAnswer: { "@type": "Answer", text: s[`faq.a${i + 1}`] },
  }));
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": `${SITE}/#org`, name: "Sage", url: `${SITE}/`, logo: `${SITE}/logo.svg` },
      { "@type": "WebSite", "@id": `${SITE}/#website`, url: `${SITE}/`, name: "Sage", inLanguage: "en", publisher: { "@id": `${SITE}/#org` } },
      {
        "@type": "SoftwareApplication",
        "@id": `${SITE}/#app`,
        name: "Sage",
        applicationCategory: "LifestyleApplication",
        operatingSystem: "Web",
        url: `${SITE}/`,
        description:
          "AI career finder that turns your hobbies and interests into career suggestions, explains why each fits, and gives a first step.",
      },
      { "@type": "FAQPage", mainEntity: faq },
    ],
  };
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()).replace(/</g, "\\u003c") }}
      />
      <SageApp />
    </>
  );
}
