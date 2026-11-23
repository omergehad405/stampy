import MarketingHeader from "./components/MarketingHeader";
import MarketingFooter from "./components/MarketingFooter";
import MarketingAgentTools from "./components/MarketingAgentTools";

const SITE_URL = "https://notchloyalty.com";
const OG_IMAGE = `${SITE_URL}/og-image.png`;

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: "%s | Notch",
    default: "Notch – Turn Cafe Visitors into Regulars | Egypt",
  },
  description:
    "Notch is a growth platform for independent cafes in Egypt. Reward returning customers with QR-based digital stamps, showcase your menu online, and get discovered by new coffee lovers – all free for customers.",
  keywords: [
    "loyalty rewards Egypt",
    "cafe loyalty app Egypt",
    "coffee loyalty card Egypt",
    "digital stamps cafe",
    "notch loyalty",
    "cafe growth platform Egypt",
    "QR loyalty card",
    "reward customers cafe",
    "coffee shop Egypt",
    "كافيه مصر",
    "برنامج ولاء مصر",
  ],
  authors: [{ name: "Notch", url: SITE_URL }],
  creator: "Notch",
  publisher: "Notch",
  applicationName: "Notch",
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Notch – Turn Cafe Visitors into Regulars | Egypt",
    description:
      "Reward returning customers with digital stamps, get discovered in Discover, and manage your online menu. Free for coffee lovers, transparent plans for cafes.",
    url: SITE_URL,
    siteName: "Notch",
    locale: "en_EG",
    type: "website",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Notch – Digital Loyalty & Growth Platform for Cafes in Egypt",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Notch – Turn Cafe Visitors into Regulars | Egypt",
    description:
      "QR-based digital stamps, free Discover exposure, and online menus for independent cafes in Egypt. Free for customers, transparent plans for cafes.",
    images: [OG_IMAGE],
    creator: "@notchloyalty",
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function MarketingLayout({ children }) {
  return (
    <div className="-mb-32 md:-mb-28 min-h-screen flex flex-col justify-between bg-(--bgColor) text-(--mainColor) transition-colors">
      <MarketingHeader />
      <div className="flex-1">{children}</div>
      <MarketingFooter />
      <MarketingAgentTools />
    </div>
  );
}
