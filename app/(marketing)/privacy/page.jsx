import Link from "next/link";
import { BRAND } from "../content";

export const metadata = {
  title: "Privacy Policy",
  description:
    "How Notch collects, uses, and protects your data as a customer or cafe partner in Egypt.",
  robots: { index: false, follow: false },
};

export default function PrivacyPage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b border-(--mainColor)/15 pb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-(--secondColor)">
            Legal & Data Protection
          </span>
          <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-(--mainColor)">
            Privacy Policy
          </h1>
          <p className="mt-2 text-xs text-(--mainColor)/60">
            Last updated: November 2026
          </p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm leading-relaxed text-(--mainColor)/80">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-(--mainColor)">
              1. Information We Collect
            </h2>
            <p>
              {BRAND.name} collects basic account information required to provide loyalty services:
              your name, email address, voluntary phone number, and transaction logs of stamps earned
              and rewards redeemed at participating cafes.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-(--mainColor)">
              2. How Your Loyalty QR Code Works
            </h2>
            <p>
              Your personal customer QR code contains only an opaque, cryptographically generated token
              identifier. It does not expose your password, payment information, or contact details to
              anyone scanning the code.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-(--mainColor)">
              3. Data Isolation Between Cafes
            </h2>
            <p>
              Each cafe’s visit logs, stamp configuration, and customer activity are scoped securely to
              that business. One cafe cannot view another cafe’s private revenue or staff operations.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-(--mainColor)">
              4. Contact Us
            </h2>
            <p>
              For privacy inquiries or account deletion requests, please contact our support team via
              our{" "}
              <Link href="/contact" className="underline font-bold text-(--mainColor)">
                Contact page
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
