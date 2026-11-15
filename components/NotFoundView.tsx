"use client";

import Link from "next/link";
import { STRINGS, fmt } from "@/lib/i18n";
import { LEGAL } from "@/lib/legal";
import { SiteBar, useSiteLang } from "./LegalPage";

export default function NotFoundView() {
  const lang = useSiteLang();
  const t = (k: string) => fmt(STRINGS[lang][k] ?? STRINGS.en[k] ?? k);
  return (
    <>
      <SiteBar back={LEGAL[lang].back} />
      <main className="wrap nf" id="main">
        <p className="nf-code num" aria-hidden="true">404</p>
        <h1>{t("nf.title")}</h1>
        <p className="nf-text">{t("nf.text")}</p>
        <div className="nf-actions">
          <Link className="btn" href="/#start">{t("nf.btn")} <span aria-hidden="true">→</span></Link>
          <Link className="btn btn-ghost" href="/#faq">{t("nf.faq")}</Link>
        </div>
      </main>
    </>
  );
}
