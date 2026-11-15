// Add a new language by adding an entry to LANGS and a full dictionary to STRINGS.
// Prices live in PRICES so copy and schema never drift. {m}/{y}/{ym} are filled in by fmt().
import { de } from "./locales/de";
import { es } from "./locales/es";
import { fr } from "./locales/fr";
import { ru } from "./locales/ru";

export type Lang = "en" | "es" | "fr" | "de" | "ru";

// `ai` is the language name given to Gemini so career results come back in the visitor's language
export const LANGS: Record<Lang, { label: string; name: string; dir: "ltr" | "rtl"; ai: string }> = {
  en: { label: "EN", name: "English", dir: "ltr", ai: "English" },
  es: { label: "ES", name: "Español", dir: "ltr", ai: "Spanish" },
  fr: { label: "FR", name: "Français", dir: "ltr", ai: "French" },
  de: { label: "DE", name: "Deutsch", dir: "ltr", ai: "German" },
  ru: { label: "RU", name: "Русский", dir: "ltr", ai: "Russian" },
};

// change prices here only; the anchor ("12 x monthly") and the saving are calculated from them
const PRICE = { monthly: 4.99, yearly: 29.99 };
const usd = (n: number) => `$${n.toFixed(2)}`;
export const PRICES = {
  monthly: usd(PRICE.monthly),
  yearly: usd(PRICE.yearly),
  yearlyPerMonth: usd(Math.round((PRICE.yearly / 12) * 100) / 100),
  monthlyYear: usd(PRICE.monthly * 12),
  yearSave: usd(PRICE.monthly * 12 - PRICE.yearly),
};

export const FAQ_COUNT = 8;

export const STRINGS: Record<Lang, Record<string, string>> = {
  en: {
    skip: "Skip to content",
    "nav.how": "How it works", "nav.sample": "Sample", "nav.pricing": "Fees", "nav.faq": "Questions",
    "nav.cta": "Try it free", "nav.lang": "Change language",

    "hero.title": "Turn what you already love into a career direction.",
    "hero.t1": "Free preview: no sign-up, no card",
    "hero.t2": "For students, career changers and parents",
    "hero.t3": "Every match comes with a first step",

    "form.label": "What do you like doing?",
    "form.ph": "e.g. drawing, video games, helping friends with problems, hiking, cooking…",
    "form.chips": "Quick picks",
    "form.btn": "Show my 3 careers", "form.loading": "Typesetting your careers…",
    "form.fine": "Free preview: 3 careers, why each fits, and a first step.",
    "form.err": "Write at least one hobby or interest first.",
    "form.fail": "Something went wrong on our side. Please try again in a moment.",
    "form.limit": "You have used this hour's free searches. Try again later, or start the free trial for more.",

    "res.title": "Careers that could fit you", "res.note": "Based on: ",
    "res.entry": "No.", "res.match": "match",
    "res.why": "Why it fits", "res.step": "First step", "res.daily": "A typical day",
    "res.path": "How to get there", "res.plan": "Your first 4 weeks", "res.locked": "In the full report",
    "res.demo": "Live matching is busy right now, so these are general sample ideas, not matched to your words. Try again in a minute for your personal result.",
    "res.lockTitle": "Keep these careers and see the full plan",
    "res.lockText": "Five careers per search instead of three. Each one adds what a typical day looks like, the usual study or training route, and a 4-week starter plan. Every search is saved so you can come back to it.",
    "res.lockBtn": "Start 7-day free trial",
    "res.lockBtnPaid": "Subscribe",
    "res.lockFine": "$0 today. Card needed to start. Cancel before day 7 and you pay nothing. Then {y}/year or {m}/month.",
    "res.lockFinePaid": "{y}/year or {m}/month. Cancel any time.",
    "res.disc": "Suggestions are guidance, not guarantees. Sage uses AI and can be wrong. Jobs and training routes vary by country.",

    "ex.title": "What a full report looks like",
    "ex.label": "A real Sage result, shown as an example. Yours is based on your own words.",
    "ex.input": "Someone wrote:",
    "ex.cta": "Try it with your hobbies",

    "how.title": "How Sage works",
    "how.s1t": "Write what you enjoy", "how.s1p": "Hobbies, interests, things you lose track of time doing. A few words are enough.",
    "how.s2t": "See careers tied to your words", "how.s2p": "Sage suggests careers and explains each match using what you wrote.",
    "how.s3t": "Take a first step", "how.s3p": "Each career ends with one action for this month. The full report adds a 4-week starter plan.",

    "pr.title": "Fees", "pr.sub": "Start with the free preview. When you want the full report, the first 7 days are free.",
    "pr.feature": "What you get",
    "pr.free": "Free preview", "pr.monthly": "Monthly", "pr.yearly": "Yearly", "pr.best": "Best value",
    "pr.permonth": "/ month", "pr.peryear": "/ year", "pr.freePrice": "$0", "pr.yearEq": "{ym} a month, billed yearly",
    "pr.r1": "Careers per search", "pr.r1free": "3", "pr.r1paid": "5",
    "pr.r2": "Why each fits, and a first step",
    "pr.r3": "Typical day, study path, 4-week plan",
    "pr.r4": "Every search saved to your history",
    "pr.r5": "Searches", "pr.r5free": "10 an hour", "pr.r5paid": "60 an hour",
    "pr.freeBtn": "Try it now",
    "pr.trial": "Start 7-day free trial", "pr.subscribe": "Subscribe",
    "pr.terms": "Card required. You're charged after day 7 unless you cancel first. The trial is for first-time subscribers. Prices in USD.",
    "pr.termsPaid": "You've had a trial before, so billing starts today. Cancel any time. Prices in USD.",
    "pr.current": "Your plan", "pr.yes": "Included", "pr.no": "Not included",

    "faq.title": "Questions",
    "faq.q1": "Is the free trial really free?",
    "faq.a1": "Yes, for 7 days. You add a card to start, and you're charged only if you don't cancel before day 7 ends. The free preview on this page needs no card and no account. The trial is for first-time subscribers.",
    "faq.q2": "How accurate are the suggestions?",
    "faq.a2": "Sage is an AI, so treat results as a starting point for exploring, not a prediction. Every suggestion explains the link to what you wrote, so you can judge it yourself. Sage doesn't promise any job or outcome.",
    "faq.q3": "Can I cancel any time?",
    "faq.a3": "Yes. Open Manage subscription in your account menu and cancel there. Cancel during the trial and you're not charged; after that, you keep access until the end of the period you paid for.",
    "faq.q4": "Is my information private?",
    "faq.a4": "We use what you write to create your results, and to save your history if you subscribe. We don't sell your data. Your text is sent to Google's Gemini AI to generate the results.",
    "faq.q5": "What do I get in the free preview?",
    "faq.a5": "Three careers for what you wrote, each with why it fits and a first step. No sign-up and no card.",
    "faq.q6": "What does the subscription add?",
    "faq.a6": "Five careers per search instead of three. Each adds a typical day, the usual study or training route, and a 4-week starter plan. Your searches are saved in your account.",
    "faq.q7": "Who is Sage for?",
    "faq.a7": "Anyone working out what to do next: students choosing what to study, adults thinking about a change, and parents helping a teenager think it through.",
    "faq.q8": "Does Sage show salaries?",
    "faq.a8": "No. Pay varies a lot by country, employer and experience, so Sage gives no figures. It focuses on what the work is like and how to start.",

    "cta.title": "See what your hobbies point to.",
    "cta.text": "It takes a minute. No sign-up, no card.",
    "cta.btn": "Find my careers",

    "ft.privacy": "Privacy", "ft.terms": "Terms", "ft.contact": "Contact",

    "auth.signin": "Sign in", "auth.signup": "Create account", "auth.signout": "Sign out",
    "auth.continue": "Continue to payment", "auth.wait": "One moment…",
    "auth.titleIn": "Welcome back", "auth.titleUp": "Create your account",
    "auth.titleUpTrial": "Create your account to start your trial",
    "auth.subUp": "Save your results and unlock full reports when you're ready.",
    "auth.subUpTrial": "Next, Stripe's secure page asks for a card. Nothing is charged for 7 days.",
    "auth.subInTrial": "Sign in to continue to checkout.",
    "auth.planYearly": "Yearly plan: $0 today, then {y}/year after 7 days",
    "auth.planMonthly": "Monthly plan: $0 today, then {m}/month after 7 days",
    "auth.fine": "Payments are handled by Stripe. We never see your card.",
    "auth.email": "Email", "auth.password": "Password", "auth.passHint": "At least 8 characters",
    "auth.show": "Show password", "auth.hide": "Hide password",
    "auth.toUp": "New here? Create an account", "auth.toIn": "Already have an account? Sign in",
    "auth.close": "Close",
    "auth.err.email": "Enter a valid email address.", "auth.err.password": "Use at least 8 characters for your password.",
    "auth.err.exists": "An account with this email already exists.", "auth.err.existsBtn": "Sign in instead",
    "auth.err.invalid": "That email and password don't match.",
    "auth.err.limit": "Too many attempts. Wait a few minutes and try again.",
    "auth.err.generic": "Something went wrong. Please try again.",

    "acct.menu": "Account", "acct.billing": "Manage subscription", "acct.upgrade": "Start free trial",
    "acct.trialing": "Free trial active", "acct.active": "Subscriber", "acct.free": "Free account",
    "acct.pastDue": "Payment problem",
    "acct.welcome": "Your 7-day trial has started. You now get 5 careers per search with the full report.",
    "acct.welcomePaid": "You're subscribed. You now get 5 careers per search with the full report.",
    "acct.pending": "Payment details received. Unlocking your account…",
    "acct.confirmFail": "We couldn't confirm your payment yet. If you were charged, refresh in a minute or contact us.",
    "acct.canceled": "Checkout canceled. Nothing was charged. Your free results are still here.",
    "acct.opening": "Opening secure checkout…",
    "acct.already": "You already have an active subscription.",
    "acct.fixCard": "Your last payment didn't go through. Update your card to keep the full report.",
    "acct.fixCardBtn": "Update card",

    "pay.fail": "We couldn't open checkout. Please try again, or contact us.",
    "pay.off": "Payments aren't switched on yet. Please check back soon.",

    "hist.title": "Your saved results", "hist.empty": "Your searches will appear here.", "hist.open": "Open",
    "dismiss": "Dismiss",

    "form.chipList": "drawing, video games, music, sports, building things, helping people",

    "set.open": "Settings", "set.title": "Settings", "set.close": "Close settings",
    "set.lang": "Language", "set.langHint": "Career results are written in this language too.",
    "set.theme": "Theme", "set.dark": "Dark", "set.light": "Light", "set.system": "Device",
    "set.size": "Text size", "set.small": "Small", "set.default": "Default", "set.large": "Large",
    "set.motion": "Reduce motion", "set.motionHint": "Turns off page animations.",
    "set.saved": "Saved on this device.", "set.reset": "Reset to default",

    "form.btnPaid": "Show my 5 careers",
    "res.lockYours": "Your careers",
    "res.lockLose": "These results aren't saved. Close this page and they're gone. Subscribers keep every search in their history.",
    "auth.stepsLabel": "Steps to start your trial",
    "auth.step1": "Plan chosen",
    "auth.step2": "Your account",
    "auth.step3": "Card on Stripe",
    "auth.stepDone": "done",
    "auth.yours": "Your search",
    "auth.yoursNote": "After checkout, Sage runs it again as a full report and saves it to your account.",
    "pr.yearWas": "{m12} if paid monthly",
    "pr.save": "You save {save} a year",
    "nf.title": "This page isn't here",
    "nf.text": "The link may be old or mistyped. Your careers are one step away: write what you enjoy and see where it leads.",
    "nf.btn": "Find my careers",
    "nf.faq": "Read the questions",
  },
  es,
  fr,
  de,
  ru,
};

export function fmt(s: string) {
  return s
    .replace("{m}", PRICES.monthly)
    .replace("{y}", PRICES.yearly)
    .replace("{ym}", PRICES.yearlyPerMonth)
    .replace("{m12}", PRICES.monthlyYear)
    .replace("{save}", PRICES.yearSave);
}
