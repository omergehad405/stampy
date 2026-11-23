import Link from "next/link";
import { BRAND } from "../content";

export const metadata = {
  title: "Terms of Service",
  description:
    "Terms and conditions governing use of the Notch platform for cafe owners, baristas, and customers in Egypt.",
  robots: { index: false, follow: false },
};

export default function TermsPage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b border-(--mainColor)/15 pb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-(--secondColor)">
            Platform Terms
          </span>
          <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-(--mainColor)">
            Terms of Service
          </h1>
          <p className="mt-2 text-xs text-(--mainColor)/60">
            Last updated: November 2026
          </p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm leading-relaxed text-(--mainColor)/80">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-(--mainColor)">
              1. Platform Purpose
            </h2>
            <p>
              {BRAND.name} provides a digital loyalty platform connecting coffee consumers with participating
              independent cafes. We facilitate stamp tracking and reward redemptions.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-(--mainColor)">
              2. Fair Loyalty Usage & Anti-Abuse
            </h2>
            <p>
              Customer visits may only be recorded in person during an actual purchase at the cafe counter.
              Attempting to automate scans, spoof QR identifiers, or award unauthorized stamps constitutes
              grounds for immediate account suspension.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-(--mainColor)">
              3. Cafe Responsibility for Rewards
            </h2>
            <p>
              Participating cafes configure and honor their own rewards (such as free drinks or pastries)
              in accordance with their posted store policies and stock availability.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-(--mainColor)">
              4. Inquiries
            </h2>
            <p>
              Questions regarding these terms may be submitted through our{" "}
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
