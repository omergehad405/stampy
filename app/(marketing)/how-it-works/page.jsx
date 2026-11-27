import HowItWorksContent from "./HowItWorksContent";

export const metadata = {
  title: "How Notch Works – For Customers & Cafes in Egypt",
  description:
    "Step-by-step: discover a cafe, scan your QR at checkout, collect digital stamps, and earn free rewards. See how cafe owners set up rewards and get discovered by new customers.",
  alternates: { canonical: "https://notchloyalty.com/how-it-works" },
  openGraph: {
    title: "How Notch Works – For Customers & Cafes in Egypt",
    description:
      "Browse menus, show your QR, collect stamps, get a free reward. For cafes: set up once, scan visits in a second, and grow your regulars.",
    url: "https://notchloyalty.com/how-it-works",
    type: "website",
  },
};

export default function HowItWorksPage() {
  return <HowItWorksContent />;
}
