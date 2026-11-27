import PricingPageContent from "./PricingPageContent";

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
  return <PricingPageContent />;
}
