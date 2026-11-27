import FeaturesContent from "./FeaturesContent";

export const metadata = {
  title: "Platform Features for Egyptian Cafes",
  description:
    "Everything your cafe needs to grow: QR-based digital stamp rewards, a web barista scanner, searchable customer directory, free Discover exposure for new customers, and an online digital menu. Explore all Notch features.",
  alternates: {
    canonical: "https://notchloyalty.com/features",
  },
  openGraph: {
    title: "Platform Features for Egyptian Cafes | Notch",
    description:
      "QR digital stamps, barista scanner terminal, Discover exposure, online menu, customer directory, rewards manager, and staff accounts – all in one platform built for cafes in Egypt.",
    url: "https://notchloyalty.com/features",
    type: "website",
  },
};

export default function FeaturesPage() {
  return <FeaturesContent />;
}
