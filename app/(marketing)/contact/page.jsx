import ContactPageContent from "./ContactPageContent";

export const metadata = {
  title: "Apply Your Cafe – Partner with Notch in Egypt",
  description:
    "Join Notch and start rewarding your returning customers. Fill in your cafe details and our team in Cairo will reach out within 1 business day to get you set up.",
  alternates: { canonical: "https://notchloyalty.com/contact" },
  openGraph: {
    title: "Apply Your Cafe | Notch Egypt",
    description:
      "Partner with Notch to reward your loyal customers and get discovered by new coffee lovers across Egypt. Apply in 2 minutes.",
    url: "https://notchloyalty.com/contact",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function ContactPage() {
  return <ContactPageContent />;
}
