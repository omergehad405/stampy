import AboutPageContent from "./AboutPageContent";

export const metadata = {
  title: "About Notch",
  description:
    "Learn how Notch helps independent cafes in Egypt build customer loyalty with digital stamps, rewards, and online discovery.",
  alternates: { canonical: "https://notchloyalty.com/about" },
  robots: { index: true, follow: true },
};

export default function AboutPage() {
  return <AboutPageContent />;
}
