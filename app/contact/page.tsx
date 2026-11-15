import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Contact",
  description: "Questions, feedback, or an account deletion request? Contact the Sage team.",
  alternates: { canonical: "/contact" },
  // only index once a real contact address is shown
  robots: { index: !!process.env.NEXT_PUBLIC_CONTACT_EMAIL, follow: true },
};

// TODO: set your real support email in .env.local as NEXT_PUBLIC_CONTACT_EMAIL
const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

export default function Contact() {
  return <LegalPage doc="contact" email={email} />;
}
