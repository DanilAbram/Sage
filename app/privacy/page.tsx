import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Sage uses your email, the hobbies you enter, and payment data handled by Stripe, how AI processing works, and how to delete your account.",
  alternates: { canonical: "/privacy" },
};

// Text lives in lib/legal.ts (all site languages). NOTE: starter text, not legal advice.
export default function Page() {
  return <LegalPage doc="privacy" />;
}
