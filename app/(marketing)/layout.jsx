import MarketingHeader from "./components/MarketingHeader";
import MarketingFooter from "./components/MarketingFooter";

export const metadata = {
  title: {
    template: "%s | Notch",
    default: "Notch | Digital Loyalty Cards for Cafes",
  },
  description:
    "Replace paper stamp cards with digital loyalty rewards. A seamless QR stamp card for coffee lovers and a fast scanner terminal for independent cafes.",
  openGraph: {
    title: "Notch - Digital Loyalty Platform for Independent Cafes",
    description:
      "Say goodbye to lost paper punch cards. Notch brings digital stamp cards and reward tracking to modern cafes and coffee lovers.",
    type: "website",
    locale: "en_US",
  },
};

export default function MarketingLayout({ children }) {
  return (
    <div className="-mb-32 md:-mb-28 min-h-screen flex flex-col justify-between bg-(--bgColor) text-(--mainColor) transition-colors">
      <MarketingHeader />
      <div className="flex-1">{children}</div>
      <MarketingFooter />
    </div>
  );
}
