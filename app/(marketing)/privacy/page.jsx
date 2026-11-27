import PrivacyPageContent from "./PrivacyPageContent";

export const metadata = {
  title: "Privacy Policy",
  description:
    "How Notch collects, uses, and protects your data as a customer or cafe partner in Egypt.",
  robots: { index: false, follow: false },
};

export default function PrivacyPage() {
  return <PrivacyPageContent />;
}
