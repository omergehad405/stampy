import Link from "next/link";
import { BRAND } from "../content";
import { PUBLIC_SITE_INFO } from "@/lib/agentContent";

export const metadata = {
  title: "About Notch",
  description:
    "Learn how Notch helps independent cafes in Egypt build customer loyalty with digital stamps, rewards, and online discovery.",
  alternates: { canonical: "https://notchloyalty.com/about" },
  robots: { index: true, follow: true },
};

export default function AboutPage() {
  return (
    <article className="py-12 sm:py-16">
      <div className="mx-auto max-w-3xl space-y-6 px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-wider text-(--secondColor)">
          About {BRAND.name}
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight text-(--mainColor) sm:text-4xl">
          Helping independent cafes grow regulars
        </h1>
        <p className="text-base leading-relaxed text-(--mainColor)/80">
          {PUBLIC_SITE_INFO.description}
        </p>
        <p className="text-sm leading-relaxed text-(--mainColor)/75">
          Notch gives cafes tools to reward returning visitors, share their
          menus online, and help coffee lovers discover local spots. Customers
          use a personal QR code to collect stamps at participating cafes;
          each cafe manages its own loyalty program and rewards.
        </p>
        <p className="text-sm leading-relaxed text-(--mainColor)/75">
          Notch serves independent cafes and coffee lovers across Egypt. Cafe
          owners interested in joining can{" "}
          <Link
            href="/contact"
            className="font-bold text-(--mainColor) underline"
          >
            contact our team
          </Link>
          .
        </p>
      </div>
    </article>
  );
}
