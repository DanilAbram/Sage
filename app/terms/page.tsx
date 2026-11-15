import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms for using Sage: subscriptions, the 7-day free trial, cancellation, and what AI career suggestions are and are not.",
  alternates: { canonical: "/terms" },
};

// Text lives in lib/legal.ts (all site languages). NOTE: starter text, not legal advice.
export default function Page() {
  return <LegalPage doc="terms" />;
}
