import FaqAccordion from "../components/FaqAccordion";
import PricingPlansList from "./PricingPlansList";

export const metadata = {
  title: "Pricing & Cafe Growth Plans in Egypt",
  description:
    "Transparent plans for independent cafes in Egypt. Start free, upgrade as your regulars grow. Customers always use Notch for free – choose the tier that fits your cafe's monthly volume.",
  alternates: {
    canonical: "https://notchloyalty.com/pricing",
  },
  openGraph: {
    title: "Pricing & Cafe Growth Plans | Notch Egypt",
    description:
      "Starter (free), Growth (399 EGP/mo), and Pro Unlimited (899 EGP/mo). Real pricing, no hidden fees. Compare tiers and pick what fits your coffee shop.",
    url: "https://notchloyalty.com/pricing",
    type: "website",
  },
};

export default function PricingPage() {
  return (
    <div className="space-y-24 py-12 sm:py-16">
      {/* Header */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="inline-block rounded-full bg-(--secondColor)/30 px-3 py-1 text-xs font-bold text-(--mainColor)">
          Cafe Subscriptions
        </span>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-(--mainColor) tracking-tight">
          Transparent plans for every coffee shop
        </h1>
        <p className="mx-auto max-w-2xl text-sm sm:text-base leading-relaxed text-(--mainColor)/75">
          Customers always collect stamps for free. Choose the tier that matches your monthly regulars and staff setup.
        </p>
      </section>

      {/* Plan Cards & Detailed Tier Comparison Table (Loaded live from /api/plans) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PricingPlansList showComparison={true} />
      </section>

      {/* FAQ on pricing */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center space-y-3 mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-(--mainColor)">
            Pricing & Plan Questions
          </h2>
          <p className="text-sm text-(--mainColor)/75">
            Need custom limits or multi-location support? Contact us for tailored setups.
          </p>
        </div>

        <FaqAccordion />
      </section>
    </div>
  );
}
