"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LANGS, type Lang } from "@/lib/i18n";
import { LEGAL, type LegalDocId } from "@/lib/legal";

/** Reads the visitor's saved language (or the device language), defaulting to English. */
export function useSiteLang(): Lang {
  const [lang, setLang] = useState<Lang>("en");
  useEffect(() => {
    let next: Lang = "en";
    try {
      const saved = localStorage.getItem("sage-lang");
      if (saved && Object.hasOwn(LANGS, saved)) next = saved as Lang;
      else {
        const dev = (navigator.languages ?? [navigator.language]).map((l) => l.slice(0, 2).toLowerCase()).find((l) => Object.hasOwn(LANGS, l));
        if (dev) next = dev as Lang;
      }
    } catch {}
    // restoring a saved preference after hydration is intentional here
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLang(next);
    document.documentElement.lang = next;
  }, []);
  return lang;
}

export function SiteBar({ back }: { back: string }) {
  return (
    <header className="site-header">
      <div className="wrap bar">
        <Link className="brand" href="/" aria-label="Sage home">
          <img src="/logo.svg" alt="" width={34} height={34} />
          <span>Sage</span>
        </Link>
        <Link className="btn btn-small" href="/">← {back}</Link>
      </div>
    </header>
  );
}

export default function LegalPage({ doc, email }: { doc: LegalDocId; email?: string }) {
  const lang = useSiteLang();
  const pack = LEGAL[lang];
  const d = pack.docs[doc];
  return (
    <>
      <SiteBar back={pack.back} />
      <main className="wrap narrow legal" id="main">
        <h1>{d.title}</h1>
        {doc !== "contact" && <p>{pack.updated}</p>}
        {pack.note && doc !== "contact" && <p className="muted">{pack.note}</p>}
        {d.sections.map(([h, p], i) => (
          <section key={i}>
            {h && <h2>{h}</h2>}
            <p>{p}</p>
          </section>
        ))}
        {doc === "contact" &&
          (email ? (
            <p><a href={`mailto:${email}`}>{email}</a></p>
          ) : (
            <p className="muted">{pack.contactSoon}</p>
          ))}
      </main>
    </>
  );
}
