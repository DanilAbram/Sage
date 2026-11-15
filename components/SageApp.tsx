"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { LANGS, STRINGS, fmt, PRICES, FAQ_COUNT, type Lang } from "@/lib/i18n";
import type { Career } from "@/lib/careers";
import { SAMPLE, SAMPLE_I18N, SAMPLE_INPUT } from "@/lib/sample";
import AuthModal, { type SageUser } from "./AuthModal";

type Settings = { theme: "dark" | "light" | "system"; size: "s" | "m" | "l"; reduce: boolean };
const SETTINGS_KEY = "sage-settings";
const deviceReduce = () => {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
};
// mirrors the inline script in app/layout.tsx, which applies saved settings before first paint
function applySettings(st: Settings) {
  const r = document.documentElement;
  r.dataset.theme = st.theme;
  if (st.size === "m") delete r.dataset.size;
  else r.dataset.size = st.size;
  if (st.reduce) r.dataset.motion = "reduce";
  else delete r.dataset.motion;
}
const PENDING_KEY = "sage-pending";
const CONTACT = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

type Plan = "monthly" | "yearly";
type Source = "ai" | "demo";
type Result = { text: string; careers: Career[]; full: boolean; source: Source };
type HistoryItem = { id: number; text: string; careers: Career[]; at: number };
type PayErr = { where: "lock" | "fees"; key: string } | null;
type Banner = { key: string; action?: "billing" } | null;

const json = { "Content-Type": "application/json" };
const post = (url: string, body: unknown = {}) => fetch(url, { method: "POST", headers: json, body: JSON.stringify(body) });

function savePending(r: Result | null) {
  try {
    if (r) sessionStorage.setItem(PENDING_KEY, JSON.stringify(r));
    else sessionStorage.removeItem(PENDING_KEY);
  } catch {}
}
function readPending(): Result | null {
  try {
    const raw = sessionStorage.getItem(PENDING_KEY);
    return raw ? (JSON.parse(raw) as Result) : null;
  } catch {
    return null;
  }
}

/* ---------- small icons (hairline, currentColor) ---------- */
const Arrow = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
const Check = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 12.5l5 5L20 6.5" />
  </svg>
);
const Lock = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="5" y="11" width="14" height="9" rx="1.5" /><path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
);
const Close = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);
const Plus = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
    <path d="M12 5v14M5 12h14" />
  </svg>
);
const Gear = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
  </svg>
);

/* ---------- hero specimen: a wireframe leaf that draws itself (decorative) ---------- */
const LEAF = "M70 530 C 70 250, 250 70, 530 70 C 530 350, 350 530, 70 530 Z";
type Pt = [number, number];
const sampleCubic = (a: Pt, b: Pt, c: Pt, e: Pt, n = 96): Pt[] =>
  Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n, u = 1 - t;
    return [
      u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * e[0],
      u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * e[1],
    ];
  });
// the two halves of LEAF, as polylines, so every vein can end exactly on the outline
const EDGE_UL = sampleCubic([70, 530], [70, 250], [250, 70], [530, 70]);
const EDGE_LR = sampleCubic([530, 70], [530, 350], [350, 530], [70, 530]);
function rayHit(p: Pt, d: Pt, poly: Pt[]): number {
  let best = Infinity;
  for (let i = 0; i < poly.length - 1; i++) {
    const [ax, ay] = poly[i], [bx, by] = poly[i + 1];
    const ex = bx - ax, ey = by - ay;
    const den = d[0] * ey - d[1] * ex;
    if (Math.abs(den) < 1e-9) continue;
    const t = ((ax - p[0]) * ey - (ay - p[1]) * ex) / den;
    const u = ((ax - p[0]) * d[1] - (ay - p[1]) * d[0]) / den;
    if (t > 0 && u >= 0 && u <= 1) best = Math.min(best, t);
  }
  return best;
}
// veins leave the midrib at matching points on both sides and curve forward to the outline
const VEINS: string[] = (() => {
  const s = Math.SQRT1_2;
  const f: Pt = [s, -s]; // along the midrib, toward the tip
  const out: string[] = [];
  for (const t of [0.16, 0.28, 0.4, 0.52, 0.64, 0.76]) {
    const p: Pt = [70 + 460 * t, 530 - 460 * t];
    for (const [n, edge] of [[[-s, -s], EDGE_UL], [[s, s], EDGE_LR]] as [Pt, Pt[]][]) {
      const raw: Pt = [n[0] + f[0] * 0.7, n[1] + f[1] * 0.7];
      const m = Math.hypot(raw[0], raw[1]);
      const dir: Pt = [raw[0] / m, raw[1] / m];
      const len = rayHit(p, dir, edge);
      if (!Number.isFinite(len)) continue;
      const end: Pt = [p[0] + dir[0] * len, p[1] + dir[1] * len];
      const ctl: Pt = [p[0] + n[0] * len * 0.45 + f[0] * len * 0.2, p[1] + n[1] * len * 0.45 + f[1] * len * 0.2];
      const r = (v: number) => v.toFixed(1);
      out.push(`M${r(p[0])} ${r(p[1])} Q ${r(ctl[0])} ${r(ctl[1])} ${r(end[0])} ${r(end[1])}`);
    }
  }
  return out;
})();

function Wire() {
  const veins = VEINS;
  const d = (ms: number) => ({ "--d": ms }) as React.CSSProperties;
  return (
    <svg className="wire" viewBox="0 0 600 600" aria-hidden="true" focusable="false">
      {[0.8, 0.6, 0.4].map((k, i) => (
        <path key={k} className="faint" pathLength={1} style={d(500 + i * 180)} d={LEAF} transform={`translate(300 300) scale(${k}) translate(-300 -300)`} />
      ))}
      <path pathLength={1} style={d(200)} d={LEAF} />
      <path pathLength={1} style={d(450)} d="M30 570 L 530 70" />
      {veins.map((v, i) => (
        <path key={i} pathLength={1} style={d(800 + i * 60)} d={v} />
      ))}
    </svg>
  );
}

/* ---------- one catalog entry ---------- */
function Entry({ c, i, full, demo, t, delay }: { c: Career; i: number; full: boolean; demo: boolean; t: (k: string) => string; delay?: number }) {
  return (
    <li className="entry" style={delay !== undefined ? { animationDelay: `${delay}ms` } : undefined}>
      <div className="entry-no num" aria-hidden="true">
        <small>{t("res.entry")}</small>
        {String(i + 1).padStart(2, "0")}
      </div>
      <article className="entry-body" aria-label={c.name}>
        <div className="entry-top">
          <h3>{c.name}</h3>
          {!demo && (
            <p className="match num">
              {c.match}% <span>{t("res.match")}</span>
            </p>
          )}
        </div>
        <dl className="fields">
          <div className="field-row">
            <dt>{t("res.why")}</dt>
            <dd>{c.why}</dd>
          </div>
          <div className="field-row">
            <dt>{t("res.step")}</dt>
            <dd>{c.step}</dd>
          </div>
          {full && c.daily && (
            <div className="field-row">
              <dt>{t("res.daily")}</dt>
              <dd>{c.daily}</dd>
            </div>
          )}
          {full && c.path && (
            <div className="field-row">
              <dt>{t("res.path")}</dt>
              <dd>{c.path}</dd>
            </div>
          )}
          {full && c.plan.length > 0 && (
            <div className="field-row wide">
              <dt>{t("res.plan")}</dt>
              <dd>
                <ol className="plan">
                  {c.plan.map((p, n) => {
                    // "Week 1: …" in any language ("Semana 1:", "Неделя 1:")
                    const m = p.match(/^(\p{L}[\p{L} ]{0,18}\d+)\s*[:.–-]\s*(.*)$/u);
                    return (
                      <li key={n}>
                        <b>{m ? m[1] : n + 1}</b>
                        {m ? m[2] : p}
                      </li>
                    );
                  })}
                </ol>
              </dd>
            </div>
          )}
        </dl>
        {!full && (
          <div className="locked">
            <small>{t("res.locked")}:</small>
            <span><Lock /> {t("res.daily")}</span>
            <span><Lock /> {t("res.path")}</span>
            <span><Lock /> {t("res.plan")}</span>
          </div>
        )}
      </article>
    </li>
  );
}

export default function SageApp() {
  const [lang, setLang] = useState<Lang>("en");
  const [settings, setSettings] = useState<Settings>({ theme: "dark", size: "m", reduce: false });
  const langRef = useRef<Lang>("en");
  const [open, setOpen] = useState<"lang" | "acct" | null>(null);
  const [text, setText] = useState("");
  const [error, setError] = useState<{ key: string; trial?: boolean } | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [runId, setRunId] = useState(0);
  const [user, setUser] = useState<SageUser | null>(null);
  const [authMode, setAuthMode] = useState<"in" | "up" | null>(null);
  const [pendingPlan, setPendingPlan] = useState<Plan | null>(null);
  const [banner, setBanner] = useState<Banner>(null);
  const [payErr, setPayErr] = useState<PayErr>(null);
  const [busyPlan, setBusyPlan] = useState<Plan | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const resultsHead = useRef<HTMLHeadingElement>(null);
  const langBtn = useRef<HTMLButtonElement>(null);
  const acctBtn = useRef<HTMLButtonElement>(null);

  const t = useCallback((k: string) => fmt(STRINGS[lang][k] ?? STRINGS.en[k] ?? k), [lang]);

  const loadHistory = useCallback(async () => {
    try {
      const res = await fetch("/api/history");
      if (res.ok) setHistory(((await res.json()) as { items: HistoryItem[] }).items);
    } catch {}
  }, []);

  const show = useCallback((r: Result) => {
    setResult(r);
    setRunId((n) => n + 1);
    requestAnimationFrame(() => {
      resultsHead.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      resultsHead.current?.focus({ preventScroll: true });
    });
  }, []);

  const runSearch = useCallback(
    async (q: string) => {
      setError(null);
      setLoading(true);
      try {
        const res = await post("/api/careers", { text: q, lang: langRef.current });
        if (res.status === 429) {
          setError({ key: "form.limit", trial: true });
          return;
        }
        if (!res.ok) {
          setError({ key: "form.fail" });
          return;
        }
        const data = (await res.json()) as { careers: Career[]; full: boolean; source: Source };
        show({ text: q, careers: data.careers, full: data.full, source: data.source });
        if (data.full && data.source === "ai") loadHistory();
      } catch {
        setError({ key: "form.fail" });
      } finally {
        setLoading(false);
      }
    },
    [show, loadHistory],
  );

  // restore language and session, and handle the return from Stripe Checkout
  useEffect(() => {
    try {
      const saved = localStorage.getItem("sage-lang") as Lang | null;
      // restoring a saved preference after hydration is intentional here
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved && Object.hasOwn(LANGS, saved)) setLang(saved);
      else {
        // smart default: no saved choice yet, so start in the device's language when Sage has it (not saved until chosen)
        const fromDevice = (navigator.languages ?? [navigator.language])
          .map((l) => l.slice(0, 2).toLowerCase())
          .find((l): l is Lang => Object.hasOwn(LANGS, l));
        if (fromDevice) setLang(fromDevice);
      }
      const st = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}") as Partial<Settings>;
      setSettings({ theme: st.theme ?? "dark", size: st.size ?? "m", reduce: st.reduce ?? deviceReduce() });
    } catch {}

    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    const canceled = params.get("canceled");
    const clearUrl = () => window.history.replaceState({}, "", window.location.pathname + window.location.hash);

    const me = async () => {
      try {
        const data = (await (await fetch("/api/me")).json()) as { user: SageUser | null };
        setUser(data.user);
        return data.user;
      } catch {
        return null;
      }
    };

    const confirm = async (attempt: number): Promise<void> => {
      try {
        const res = await post("/api/checkout/confirm", { sessionId });
        const data = (await res.json().catch(() => ({}))) as { user?: SageUser | null; error?: string };
        if (res.ok && data.user?.subscribed) {
          setUser(data.user);
          setBanner({ key: data.user.status === "trialing" ? "acct.welcome" : "acct.welcomePaid" });
          clearUrl();
          const pending = readPending();
          savePending(null);
          if (pending?.text) runSearch(pending.text);
          return;
        }
        if (data.error === "incomplete" && attempt === 0) {
          if (data.user) setUser(data.user);
          setBanner({ key: "acct.pending" });
          await new Promise((r) => setTimeout(r, 3000));
          return confirm(1);
        }
      } catch {}
      // could not confirm: still show who is signed in, keep the URL so a refresh retries
      const u = await me();
      if (u?.subscribed) {
        setBanner({ key: "acct.welcome" });
        clearUrl();
      } else {
        setBanner({ key: "acct.confirmFail" });
      }
    };

    (async () => {
      if (sessionId) {
        await confirm(0);
        return;
      }
      const u = await me();
      if (canceled) {
        setBanner({ key: "acct.canceled" });
        const pending = readPending();
        savePending(null);
        if (pending?.careers?.length) show(pending);
        clearUrl();
      } else if (u && (u.status === "past_due" || u.status === "unpaid") && u.hasBilling) {
        setBanner({ key: "acct.fixCard", action: "billing" });
      }
    })();
  }, [runSearch, show]);

  useEffect(() => {
    // fetch saved results once the account is known to be subscribed
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (user?.subscribed) loadHistory();
    else setHistory([]);
  }, [user?.subscribed, loadHistory]);

  useEffect(() => {
    langRef.current = lang;
    document.documentElement.lang = lang;
    document.documentElement.dir = LANGS[lang].dir;
  }, [lang]);

  // popovers close on outside click and Escape (focus goes back to the button that opened them)
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!(e.target as Element | null)?.closest?.(".pop")) setOpen(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      (open === "lang" ? langBtn : acctBtn).current?.focus();
      setOpen(null);
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // scroll reveals: content stays visible by default; the "motion" class (set here) arms the hidden state
  useEffect(() => {
    document.documentElement.classList.add("motion");
    // watch each element's parent: a fully clipped element counts as invisible to IntersectionObserver
    const groups = new Map<Element, HTMLElement[]>();
    document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-in])").forEach((el) => {
      const p = el.parentElement ?? el;
      groups.set(p, [...(groups.get(p) ?? []), el]);
    });
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          groups.get(e.target)?.forEach((el) => (el.dataset.in = ""));
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0 },
    );
    groups.forEach((els, p) => {
      // anything already scrolled past (deep link, fast scroll before load) is shown at once
      if (p.getBoundingClientRect().bottom < 0) els.forEach((el) => (el.dataset.in = ""));
      else io.observe(p);
    });
    return () => io.disconnect();
  }, [result, history.length, user?.subscribed]);

  // the divider tab for the section being read lifts, like a pulled catalog tab
  const [active, setActive] = useState("");
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ["top", "sample", "how", "pricing", "faq"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  /* ---------- form ---------- */
  const chips = t("form.chipList").split(",").map((c) => c.trim().toLowerCase()).filter(Boolean);
  const parts = text.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  function toggleChip(v: string) {
    setText((prev) => {
      const items = prev.split(",").map((s) => s.trim()).filter(Boolean);
      if (items.some((s) => s.toLowerCase() === v)) return items.filter((s) => s.toLowerCase() !== v).join(", ");
      const base = prev.trim().replace(/[,\s]+$/, "");
      return base ? `${base}, ${v}` : v;
    });
  }
  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = text.trim();
    if (q.length < 3) {
      setError({ key: "form.err" });
      return;
    }
    runSearch(q);
  }

  /* ---------- billing ---------- */
  async function billing() {
    try {
      const res = await post("/api/portal");
      const data = await res.json().catch(() => ({}));
      if (data.url) window.location.assign(data.url);
      else setBanner({ key: "pay.fail" });
    } catch {
      setBanner({ key: "pay.fail" });
    }
  }

  async function checkout(plan: Plan, where: "lock" | "fees") {
    setPayErr(null);
    setBusyPlan(plan);
    try {
      const res = await post("/api/checkout", { plan });
      const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (data.url) {
        // keep the visitor's search so it is still here after Stripe (or re-run in full after payment)
        if (result) savePending(result);
        else if (text.trim()) savePending({ text: text.trim(), careers: [], full: false, source: "ai" });
        window.location.assign(data.url);
        return;
      }
      if (res.status === 401) {
        setPendingPlan(plan);
        setAuthMode("up");
      } else if (data.error === "use_portal") {
        await billing();
      } else if (data.error === "already") {
        try {
          const u = ((await (await fetch("/api/me")).json()) as { user: SageUser | null }).user;
          setUser(u);
        } catch {}
        setPayErr({ where, key: "acct.already" });
      } else if (data.error === "not_configured") {
        setPayErr({ where, key: "pay.off" });
      } else {
        setPayErr({ where, key: "pay.fail" });
      }
    } catch {
      setPayErr({ where, key: "pay.fail" });
    } finally {
      setBusyPlan(null);
    }
  }

  const [pendingWhere, setPendingWhere] = useState<"lock" | "fees">("fees");
  function startTrial(plan: Plan, where: "lock" | "fees") {
    if (!user) {
      setPendingPlan(plan);
      setPendingWhere(where);
      setAuthMode("up");
      return;
    }
    checkout(plan, where);
  }

  function authDone(u: SageUser) {
    setUser(u);
    setAuthMode(null);
    setOpen(null);
    const plan = pendingPlan;
    setPendingPlan(null);
    if (plan && !u.subscribed) checkout(plan, pendingWhere);
  }

  async function logout() {
    await post("/api/auth/logout").catch(() => {});
    setUser(null);
    setResult(null);
    setHistory([]);
    setBanner(null);
    setPayErr(null);
    setOpen(null);
    savePending(null);
  }

  function chooseLang(l: Lang) {
    setLang(l);
    try {
      localStorage.setItem("sage-lang", l);
    } catch {}
  }

  function updateSettings(patch: Partial<Settings>) {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      applySettings(next);
      try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }

  function resetSettings() {
    const next: Settings = { theme: "dark", size: "m", reduce: deviceReduce() };
    setSettings(next);
    applySettings(next);
    chooseLang("en");
    try {
      localStorage.removeItem(SETTINGS_KEY);
      localStorage.removeItem("sage-lang");
    } catch {}
  }

  const trialUsed = !!user?.trialUsed;
  const subscribed = !!user?.subscribed;
  const demo = result?.source === "demo";
  const statusLabel = !user
    ? ""
    : user.status === "trialing"
      ? t("acct.trialing")
      : user.subscribed
        ? t("acct.active")
        : user.status === "past_due" || user.status === "unpaid"
          ? t("acct.pastDue")
          : t("acct.free");
  const trialLabel = trialUsed ? t("pr.subscribe") : t("pr.trial");

  const feeRows: { label: string; free: string | boolean; paid: string | boolean }[] = [
    { label: t("pr.r1"), free: t("pr.r1free"), paid: t("pr.r1paid") },
    { label: t("pr.r2"), free: true, paid: true },
    { label: t("pr.r3"), free: false, paid: true },
    { label: t("pr.r4"), free: false, paid: true },
    { label: t("pr.r5"), free: t("pr.r5free"), paid: t("pr.r5paid") },
  ];
  const cell = (v: string | boolean) =>
    typeof v === "string" ? (
      <span className="num">{v}</span>
    ) : v ? (
      <span className="tick"><Check /><span className="sr">{t("pr.yes")}</span></span>
    ) : (
      <span className="dash" aria-label={t("pr.no")}>—</span>
    );

  const planAction = (p: Plan) =>
    subscribed ? (
      user?.hasBilling ? (
        <button type="button" className="btn btn-ghost btn-small" onClick={billing}>{t("acct.billing")}</button>
      ) : (
        <span className="muted">{t("pr.current")}</span>
      )
    ) : (
      <button
        type="button"
        className={`btn btn-small${p === "monthly" ? " btn-ghost" : ""}`}
        onClick={() => startTrial(p, "fees")}
        disabled={busyPlan !== null}
        aria-busy={busyPlan === p}
      >
        {busyPlan === p ? t("acct.opening") : trialLabel}
      </button>
    );

  return (
    <>
      <a className="skip" href="#main">{t("skip")}</a>

      <header className="site-header">
        <div className="wrap bar">
          <a className="brand" href="#top" aria-label="Sage home">
            <img src="/logo.svg" alt="" width={34} height={34} />
            <span>Sage</span>
          </a>
          <nav className="tabs" aria-label="Main">
            {(
              [
                ["sample", "nav.sample"],
                ["how", "nav.how"],
                ["pricing", "nav.pricing"],
                ["faq", "nav.faq"],
              ] as const
            ).map(([id, k]) => (
              <a key={id} href={`#${id}`} aria-current={active === id ? "true" : undefined}>
                {t(k)}
              </a>
            ))}
          </nav>
          <div className="bar-right">
            <div className="pop">
              <button
                ref={langBtn}
                type="button"
                className="pop-btn"
                aria-haspopup="dialog"
                aria-expanded={open === "lang"}
                aria-controls="settings-panel"
                aria-label={t("set.open")}
                onClick={() => setOpen((o) => (o === "lang" ? null : "lang"))}
              >
                <Gear />
                <span className="set-btn-label">{t("set.open")}</span>
              </button>
              {open === "lang" && (
                <div className="pop-panel settings" id="settings-panel" role="dialog" aria-labelledby="settings-title">
                  <h2 id="settings-title">{t("set.title")}</h2>
                  <fieldset className="set-group">
                    <legend>{t("set.lang")}</legend>
                    <ul className="lang-list">
                      {(Object.keys(LANGS) as Lang[]).map((l) => (
                        <li key={l}>
                          <button type="button" lang={l} aria-pressed={l === lang} onClick={() => chooseLang(l)} autoFocus={l === lang}>
                            {LANGS[l].name}
                            {l === lang && <Check />}
                          </button>
                        </li>
                      ))}
                    </ul>
                    <p className="set-hint">{t("set.langHint")}</p>
                  </fieldset>
                  <fieldset className="set-group">
                    <legend>{t("set.theme")}</legend>
                    <div className="seg">
                      {(["dark", "light", "system"] as const).map((v) => (
                        <button key={v} type="button" aria-pressed={settings.theme === v} onClick={() => updateSettings({ theme: v })}>
                          {t(`set.${v}`)}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                  <fieldset className="set-group">
                    <legend>{t("set.size")}</legend>
                    <div className="seg">
                      {(
                        [
                          ["s", "set.small"],
                          ["m", "set.default"],
                          ["l", "set.large"],
                        ] as const
                      ).map(([v, k]) => (
                        <button key={v} type="button" className={`size-${v}`} aria-pressed={settings.size === v} onClick={() => updateSettings({ size: v })}>
                          {t(k)}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                  <div className="set-group switch-row">
                    <div>
                      <span className="set-label" id="motion-label">{t("set.motion")}</span>
                      <p className="set-hint" id="motion-hint">{t("set.motionHint")}</p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      className="switch"
                      aria-checked={settings.reduce}
                      aria-labelledby="motion-label"
                      aria-describedby="motion-hint"
                      onClick={() => updateSettings({ reduce: !settings.reduce })}
                    />
                  </div>
                  <div className="set-foot">
                    <span>{t("set.saved")}</span>
                    <button type="button" className="link-btn" onClick={resetSettings}>{t("set.reset")}</button>
                  </div>
                </div>
              )}
            </div>

            {user ? (
              <div className="pop">
                <button
                  ref={acctBtn}
                  type="button"
                  className="pop-btn"
                  aria-haspopup="true"
                  aria-expanded={open === "acct"}
                  aria-controls="acct-panel"
                  aria-label={t("acct.menu")}
                  onClick={() => setOpen((o) => (o === "acct" ? null : "acct"))}
                >
                  <span className="acct-email">{user.email}</span>
                </button>
                {open === "acct" && (
                  <div className="pop-panel" id="acct-panel">
                    <p className="pop-status">
                      <strong>{user.email}</strong>
                      {statusLabel}
                    </p>
                    <ul>
                      {!subscribed && !(user.status === "past_due" || user.status === "unpaid") && (
                        <li>
                          <button type="button" autoFocus onClick={() => { setOpen(null); document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" }); }}>
                            {trialUsed ? t("pr.subscribe") : t("acct.upgrade")}
                          </button>
                        </li>
                      )}
                      {user.hasBilling && (
                        <li>
                          <button type="button" autoFocus={subscribed} onClick={billing}>{t("acct.billing")}</button>
                        </li>
                      )}
                      <li>
                        <button type="button" onClick={logout}>{t("auth.signout")}</button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <button type="button" className="link-btn" onClick={() => setAuthMode("in")}>{t("auth.signin")}</button>
            )}
            {!subscribed && <a className="btn btn-small" href="#start">{t("nav.cta")}</a>}
          </div>
        </div>
        <div className="scroll-progress" aria-hidden="true" />
      </header>

      {banner && (
        <div className="banner" role="status">
          <div className="wrap">
            <span>{t(banner.key)}</span>
            <span className="banner-actions">
              {banner.action === "billing" && (
                <button type="button" className="btn btn-small btn-paper" onClick={billing}>{t("acct.fixCardBtn")}</button>
              )}
              <button type="button" className="icon-btn" onClick={() => setBanner(null)} aria-label={t("dismiss")}>
                <Close />
              </button>
            </span>
          </div>
        </div>
      )}

      <main id="main">
        {/* ---------- the sage divider sheet ---------- */}
        <section className="hero" id="top">
          <Wire />
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <h1>
                {(() => {
                  // every word rises in; the last two ("career direction.") get a rule drawn under them
                  const words = t("hero.title").split(" ");
                  const word = (w: string, i: number) => (
                    <span className="hw" key={i} style={{ "--i": i } as React.CSSProperties}>
                      <span>{w}</span>
                    </span>
                  );
                  const cut = Math.max(0, words.length - 2);
                  // a short word just before the underlined pair ("a") stays on the line before it, never alone
                  const glue = cut >= 2 && words[cut - 1].length <= 2 ? cut - 2 : -1;
                  return (
                    <>
                      {words.slice(0, cut).map((w, i) =>
                        i === glue + 1 ? null : i === glue ? (
                          <span key={i}>
                            <span className="nowrap">
                              {word(w, i)}{" "}{word(words[i + 1], i + 1)}
                            </span>{" "}
                          </span>
                        ) : (
                          <span key={i}>{word(w, i)} </span>
                        ),
                      )}
                      {/* underline only the last word: on two lines it would otherwise sit on top of it */}
                      {words.slice(cut).map((w, j, arr) => (
                        <span key={j}>
                          {j > 0 && " "}
                          {j === arr.length - 1 ? (
                            <span className="hl" style={{ "--n": words.length } as React.CSSProperties}>
                              {word(w, cut + j)}
                            </span>
                          ) : (
                            word(w, cut + j)
                          )}
                        </span>
                      ))}
                    </>
                  );
                })()}
              </h1>
              <ul className="index">
                <li><Check /> {t("hero.t1")}</li>
                <li><Check /> {t("hero.t2")}</li>
                <li><Check /> {t("hero.t3")}</li>
              </ul>
            </div>

            <form className="entry-form" id="start" onSubmit={submit} noValidate>
              <label htmlFor="hobbies" className="form-title">{t("form.label")}</label>
              <textarea
                id="hobbies"
                rows={4}
                maxLength={600}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={t("form.ph")}
                aria-invalid={error?.key === "form.err" ? true : undefined}
                aria-describedby={error ? "form-error" : "form-fine"}
              />
              <fieldset className="chips">
                <legend>{t("form.chips")}</legend>
                {chips.map((c) => (
                  <button key={c} type="button" className="key" aria-pressed={parts.includes(c)} onClick={() => toggleChip(c)}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </button>
                ))}
              </fieldset>
              {error && (
                <p className="error" id="form-error" role="alert">
                  {t(error.key)}{" "}
                  {error.trial && !subscribed && (
                    <a className="link-btn" href="#pricing">{trialLabel}</a>
                  )}
                </p>
              )}
              <button className="btn btn-block" type="submit" disabled={loading} aria-busy={loading}>
                {loading ? t("form.loading") : subscribed ? t("form.btnPaid") : t("form.btn")}
                {!loading && <Arrow />}
              </button>
              {!subscribed && <p className="form-fine" id="form-fine">{t("form.fine")}</p>}
            </form>
          </div>
        </section>

        {/* ---------- results, typeset in entry by entry ---------- */}
        {result && (
          <section className="results" aria-labelledby="res-title">
            <div className="wrap">
              <div className="section-head">
                <h2 id="res-title" ref={resultsHead} tabIndex={-1}>{t("res.title")}</h2>
                <p>{t("res.note")}{result.text.slice(0, 140)}</p>
              </div>
              {demo && <p className="notice" role="status">{t("res.demo")}</p>}
              <ol className="entries" key={runId}>
                {result.careers.map((c, i) => (
                  <Entry key={c.name} c={c} i={i} full={result.full} demo={demo} t={t} delay={i * 140} />
                ))}
              </ol>

              {!result.full && !demo && !subscribed && (
                <div className="lock-sheet" data-reveal="wipe">
                  <h3>{t("res.lockTitle")}</h3>
                  <p>{t("res.lockText")}</p>
                  {/* what they already have: their own careers, by name, and the honest fact that they aren't kept */}
                  <div className="lock-own">
                    <p className="lock-own-label">{t("res.lockYours")}</p>
                    <ul>
                      {result.careers.map((c) => <li key={c.name}>{c.name}</li>)}
                    </ul>
                    <p className="lock-lose">{t("res.lockLose")}</p>
                  </div>
                  <div className="lock-cta">
                    <button type="button" className="btn" onClick={() => startTrial("yearly", "lock")} disabled={busyPlan !== null} aria-busy={busyPlan === "yearly"}>
                      {busyPlan === "yearly" ? t("acct.opening") : trialUsed ? t("res.lockBtnPaid") : t("res.lockBtn")}
                      <Arrow />
                    </button>
                    <p className="fine">{trialUsed ? t("res.lockFinePaid") : t("res.lockFine")}</p>
                  </div>
                </div>
              )}
              {payErr?.where === "lock" && <p className="pay-err" role="alert">{t(payErr.key)}</p>}
              <p className="disc">{t("res.disc")}</p>
            </div>
          </section>
        )}

        {subscribed && (
          <section className="section" aria-labelledby="hist-title">
            <div className="wrap">
              <div className="section-head">
                <h2 id="hist-title" data-reveal="type">{t("hist.title")}</h2>
              </div>
              {history.length === 0 ? (
                <p className="muted">{t("hist.empty")}</p>
              ) : (
                <ul className="hist" data-reveal="wipe">
                  {history.map((h) => (
                    <li key={h.id}>
                      <div>
                        <strong>{h.text.slice(0, 90)}</strong>
                        <p>
                          <span className="num">{new Date(h.at).toLocaleDateString(lang)}</span> · {h.careers.map((c) => c.name).join(", ")}
                        </p>
                      </div>
                      <button type="button" className="btn btn-small btn-ghost" onClick={() => show({ text: h.text, careers: h.careers, full: true, source: "ai" })}>
                        {t("hist.open")}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}

        {/* ---------- a real full report, as an example ---------- */}
        <section className="section paper-2" id="sample" aria-labelledby="sample-title">
          <div className="wrap sample-grid">
            <div className="sample-aside" data-reveal="type">
              <h2 id="sample-title">{t("ex.title")}</h2>
              <p>{t("ex.label")}</p>
              <blockquote>
                <span>{t("ex.input")}</span>
                “{SAMPLE_I18N[lang]?.input ?? SAMPLE_INPUT}”
              </blockquote>
              <a className="btn btn-ghost" href="#start">{t("ex.cta")} <Arrow /></a>
            </div>
            <ol className="entries sample-main" data-reveal="wipe">
              <Entry c={SAMPLE_I18N[lang]?.career ?? SAMPLE} i={0} full demo={false} t={t} />
            </ol>
          </div>
        </section>

        <section className="section" id="how" aria-labelledby="how-title">
          <div className="wrap">
            <div className="section-head">
              <h2 id="how-title" data-reveal="type">{t("how.title")}</h2>
            </div>
            <ol className="steps" data-reveal="list">
              {[1, 2, 3].map((n) => (
                <li className="step" key={n} style={{ "--i": n - 1 } as React.CSSProperties}>
                  <span className="step-n num" aria-hidden="true">{n}</span>
                  <h3>{t(`how.s${n}t`)}</h3>
                  <p>{t(`how.s${n}p`)}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------- fees: a schedule ---------- */}
        <section className="section fees" id="pricing" aria-labelledby="pr-title">
          <div className="wrap">
            <div className="section-head">
              <h2 id="pr-title" data-reveal="type">{t("pr.title")}</h2>
              <p>{t("pr.sub")}</p>
            </div>
            <div className="fee-scroll" data-reveal="wipe" tabIndex={0} role="region" aria-labelledby="pr-title">
              <table className="fee-table">
                <thead>
                  <tr>
                    <th scope="col">{t("pr.feature")}</th>
                    <th scope="col">
                      <span className="plan-name">{t("pr.free")}</span>
                      <span className="plan-was" aria-hidden="true" />
                      <span className="plan-price num">{t("pr.freePrice")}</span>
                      <span className="plan-eq" />
                    </th>
                    <th scope="col">
                      <span className="plan-name">{t("pr.monthly")}</span>
                      <span className="plan-was" aria-hidden="true" />
                      <span className="plan-price num">{PRICES.monthly} <small>{t("pr.permonth")}</small></span>
                      <span className="plan-eq" />
                    </th>
                    <th scope="col" className="col-best">
                      <span className="plan-name">{t("pr.yearly")}<span className="badge">{t("pr.best")}</span></span>
                      {/* the anchor comes first: a year of monthly billing, then the yearly price measured against it */}
                      <span className="plan-was num">{t("pr.yearWas")}</span>
                      <span className="plan-price num">{PRICES.yearly} <small>{t("pr.peryear")}</small></span>
                      <span className="plan-eq num">{t("pr.yearEq")}</span>
                      <span className="plan-save num">{t("pr.save")}</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {feeRows.map((r) => (
                    <tr key={r.label}>
                      <th scope="row">{r.label}</th>
                      <td>{cell(r.free)}</td>
                      <td>{cell(r.paid)}</td>
                      <td className="col-best">{cell(r.paid)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td />
                    <td><a className="btn btn-ghost btn-small" href="#start">{t("pr.freeBtn")}</a></td>
                    {(["monthly", "yearly"] as Plan[]).map((p) => (
                      <td key={p} className={p === "yearly" ? "col-best" : undefined}>
                        {planAction(p)}
                      </td>
                    ))}
                  </tr>
                </tfoot>
              </table>
            </div>
            <ul className="fee-cards" data-reveal="list">
              {(
                [
                  { id: "yearly", best: true },
                  { id: "monthly", best: false },
                  { id: "free", best: false },
                ] as const
              ).map(({ id, best }, i) => (
                <li key={id} className={`fee-card${best ? " is-best" : ""}`} style={{ "--i": i } as React.CSSProperties}>
                  <h3 className="plan-name">
                    {t(`pr.${id}`)}
                    {best && <span className="badge">{t("pr.best")}</span>}
                  </h3>
                  {id === "yearly" && <span className="plan-was num">{t("pr.yearWas")}</span>}
                  <span className="plan-price num">
                    {id === "free" ? t("pr.freePrice") : id === "monthly" ? PRICES.monthly : PRICES.yearly}{" "}
                    {id !== "free" && <small>{id === "monthly" ? t("pr.permonth") : t("pr.peryear")}</small>}
                  </span>
                  {id === "yearly" && <span className="plan-eq num">{t("pr.yearEq")}</span>}
                  {id === "yearly" && <span className="plan-save num">{t("pr.save")}</span>}
                  <dl className="fee-card-rows">
                    {feeRows.map((r) => (
                      <div key={r.label}>
                        <dt>{r.label}</dt>
                        <dd>{cell(id === "free" ? r.free : r.paid)}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="fee-card-cta">
                    {id === "free" ? <a className="btn btn-ghost btn-small" href="#start">{t("pr.freeBtn")}</a> : planAction(id)}
                  </div>
                </li>
              ))}
            </ul>
            {payErr?.where === "fees" && <p className="pay-err" role="alert">{t(payErr.key)}</p>}
            <p className="fee-terms">{trialUsed ? t("pr.termsPaid") : t("pr.terms")}</p>
          </div>
        </section>

        <section className="section" id="faq" aria-labelledby="faq-title">
          <div className="wrap faq-grid">
            <h2 id="faq-title" data-reveal="type">{t("faq.title")}</h2>
            <div className="faq-list" data-reveal="list">
              {Array.from({ length: FAQ_COUNT }, (_, i) => i + 1).map((n) => (
                <details key={n} style={{ "--i": n - 1 } as React.CSSProperties}>
                  <summary>
                    {t(`faq.q${n}`)}
                    <Plus />
                  </summary>
                  <p>{t(`faq.a${n}`)}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="band" aria-labelledby="cta-title">
          <div className="wrap band-inner">
            <h2 id="cta-title" data-reveal="type">{t("cta.title")}</h2>
            <p>{t("cta.text")}</p>
            <a className="btn btn-paper" href="#start">{t("cta.btn")} <Arrow /></a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="wrap foot">
          <span className="brand"><img src="/logo.svg" alt="" width={24} height={24} /> Sage</span>
          <nav aria-label="Legal">
            <Link href="/privacy">{t("ft.privacy")}</Link>
            <Link href="/terms">{t("ft.terms")}</Link>
            {CONTACT && <Link href="/contact">{t("ft.contact")}</Link>}
          </nav>
          <span className="muted num">© 2026 Sage</span>
        </div>
      </footer>

      {authMode && (
        <AuthModal
          t={t}
          initialMode={authMode}
          plan={pendingPlan}
          trialUsed={trialUsed}
          search={result && !result.full && !demo && result.careers.length ? { text: result.text, names: result.careers.map((c) => c.name) } : null}
          onClose={() => {
            setAuthMode(null);
            setPendingPlan(null);
          }}
          onDone={authDone}
        />
      )}
    </>
  );
}
