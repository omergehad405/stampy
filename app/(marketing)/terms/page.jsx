import TermsPageContent from "./TermsPageContent";

export const metadata = {
  title: "Terms of Service",
  description:
    "Terms and conditions governing use of the Notch platform for cafe owners, baristas, and customers in Egypt.",
  robots: { index: false, follow: false },
};

export default function TermsPage() {
  return <TermsPageContent />;
}
