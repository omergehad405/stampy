import MarketingHomeContent from "./components/MarketingHomeContent";
import { PUBLIC_SITE_INFO, SITE_URL } from "@/lib/agentContent";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: PUBLIC_SITE_INFO.name,
      url: `${SITE_URL}/`,
      logo: `${SITE_URL}/logo.png`,
      description: PUBLIC_SITE_INFO.description,
      email: PUBLIC_SITE_INFO.email,
      areaServed: {
        "@type": "Country",
        name: PUBLIC_SITE_INFO.areaServed,
      },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: PUBLIC_SITE_INFO.email,
        url: `${SITE_URL}/contact`,
        areaServed: PUBLIC_SITE_INFO.areaServed,
        availableLanguage: ["English", "Arabic"],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: "Notch",
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en",
    },
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/#webpage`,
      url: `${SITE_URL}/`,
      name: "Notch – Turn Cafe Visitors into Regulars | Egypt",
      description: PUBLIC_SITE_INFO.description,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en",
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#software`,
      name: "Notch",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: `${SITE_URL}/`,
      description: PUBLIC_SITE_INFO.description,
      provider: { "@id": `${SITE_URL}/#organization` },
      audience: {
        "@type": "Audience",
        audienceType: "Independent cafes and coffee lovers",
        geographicArea: {
          "@type": "Country",
          name: PUBLIC_SITE_INFO.areaServed,
        },
      },
    },
  ],
};

export const metadata = {
  title: "Notch – Turn Cafe Visitors into Regulars | Egypt",
  description:
    "Discover a new way for cafes in Egypt to reward returning customers. Personal QR codes, digital stamp rewards, free Discover exposure, and an online menu — all in one platform.",
  alternates: {
    canonical: "https://notchloyalty.com",
  },
  openGraph: {
    title: "Notch – Turn Cafe Visitors into Regulars | Egypt",
    description:
      "Reward returning customers with digital stamps, get discovered in Discover, and manage your online menu. Free for coffee lovers, transparent plans for cafes.",
    url: "https://notchloyalty.com",
    type: "website",
  },
};

export default function MarketingHomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <MarketingHomeContent />
    </>
  );
}
