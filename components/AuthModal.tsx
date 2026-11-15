"use client";

import { useEffect, useId, useRef, useState } from "react";

export type SageUser = {
  email: string;
  subscribed: boolean;
  status: string | null;
  hasBilling: boolean;
  trialUsed: boolean;
};

type Props = {
  t: (k: string) => string;
  initialMode: "in" | "up";
  plan?: "monthly" | "yearly" | null;
  trialUsed?: boolean;
  /** the free search the visitor just ran, shown back to them so the account protects something they made */
  search?: { text: string; names: string[] } | null;
  onClose: () => void;
  onDone: (user: SageUser) => void;
};

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function AuthModal({ t, initialMode, plan = null, trialUsed = false, search = null, onClose, onDone }: Props) {
  const [mode, setMode] = useState<"in" | "up">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [exists, setExists] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [busy, setBusy] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const closeRef = useRef(onClose);
  const errId = useId();
  const hintId = useId();

  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  // mount only: focus the first field, trap Tab inside the dialog, close on Escape, restore focus after
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    emailRef.current?.focus();
    const main = document.getElementById("main");
    const header = document.querySelector<HTMLElement>(".site-header");
    main?.setAttribute("inert", "");
    header?.setAttribute("inert", "");

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeRef.current();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const items = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      main?.removeAttribute("inert");
      header?.removeAttribute("inert");
      opener?.focus?.();
    };
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setExists(false);
    setBusy(true);
    try {
      const res = await fetch(mode === "up" ? "/api/auth/signup" : "/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const known = ["email", "password", "exists", "invalid", "limit"];
        setError(t(`auth.err.${known.includes(data.error) ? data.error : "generic"}`));
        setExists(data.error === "exists");
        return;
      }
      onDone(data.user as SageUser);
    } catch {
      setError(t("auth.err.generic"));
    } finally {
      setBusy(false);
    }
  }

  const invalid = error ? true : undefined;
  const trial = !!plan && !trialUsed;
  const title = mode === "up" ? (trial ? t("auth.titleUpTrial") : t("auth.titleUp")) : t("auth.titleIn");
  const sub = mode === "up" ? (trial ? t("auth.subUpTrial") : t("auth.subUp")) : plan ? t("auth.subInTrial") : "";
  const submitLabel = plan ? t("auth.continue") : mode === "up" ? t("auth.signup") : t("auth.signin");
  const switchMode = (m: "in" | "up") => { setMode(m); setError(""); setExists(false); };

  return (
    <div className="modal-back" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        ref={dialogRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
        aria-describedby={sub ? "auth-sub" : undefined}
      >
        <button type="button" className="modal-x" onClick={onClose} aria-label={t("auth.close")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        {/* progress never starts at zero: choosing a plan already counts as step one (it really is done) */}
        {plan && (
          <ol className="modal-steps" aria-label={t("auth.stepsLabel")}>
            <li className="is-done">
              <span className="modal-step-n" aria-hidden="true">✓</span>
              {t("auth.step1")}
              <span className="sr-only"> ({t("auth.stepDone")})</span>
            </li>
            <li className="is-now" aria-current="step">
              <span className="modal-step-n" aria-hidden="true">2</span>
              {t("auth.step2")}
            </li>
            <li>
              <span className="modal-step-n" aria-hidden="true">3</span>
              {t("auth.step3")}
            </li>
          </ol>
        )}
        <h2 id="auth-title" className="modal-title">{title}</h2>
        {sub && <p id="auth-sub" className="modal-sub">{sub}</p>}
        {plan && !trialUsed && (
          <p className="modal-plan">{plan === "yearly" ? t("auth.planYearly") : t("auth.planMonthly")}</p>
        )}
        {plan && search && (
          <div className="modal-yours">
            <p className="modal-yours-label">{t("auth.yours")}: <span>“{search.text.slice(0, 80)}”</span></p>
            <ul>
              {search.names.map((n) => <li key={n}>{n}</li>)}
            </ul>
            <p className="modal-yours-note">{t("auth.yoursNote")}</p>
          </div>
        )}
        <form onSubmit={submit} noValidate>
          <label className="field">
            <span>{t("auth.email")}</span>
            <input
              ref={emailRef}
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-invalid={invalid}
              aria-describedby={error ? errId : undefined}
            />
          </label>
          <label className="field">
            <span>{t("auth.password")}</span>
            <span className="pass-wrap">
            <input
              type={showPass ? "text" : "password"}
              autoComplete={mode === "up" ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              aria-invalid={invalid}
              aria-describedby={[mode === "up" ? hintId : "", error ? errId : ""].filter(Boolean).join(" ") || undefined}
            />
            <button type="button" onClick={() => setShowPass((v) => !v)} aria-label={showPass ? t("auth.hide") : t("auth.show")} aria-pressed={showPass}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" />
                {showPass && <path d="M4 4l16 16" />}
              </svg>
            </button>
            </span>
            {mode === "up" && <small id={hintId} className="field-hint">{t("auth.passHint")}</small>}
          </label>
          {error && (
            <p id={errId} className="error" role="alert">
              {error}{" "}
              {exists && <button type="button" className="link-btn" onClick={() => switchMode("in")}>{t("auth.err.existsBtn")}</button>}
            </p>
          )}
          <button className="btn btn-block" type="submit" disabled={busy} aria-busy={busy}>
            {busy ? t("auth.wait") : submitLabel}
          </button>
        </form>
        <button type="button" className="link-btn modal-switch" onClick={() => switchMode(mode === "up" ? "in" : "up")}>
          {mode === "up" ? t("auth.toIn") : t("auth.toUp")}
        </button>
        {plan && <p className="modal-fine">{t("auth.fine")}</p>}
      </div>
    </div>
  );
}
