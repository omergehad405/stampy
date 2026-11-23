import { LuMail } from "react-icons/lu";
import { CONTACT_PAGE_CONTENT } from "../content";
import ContactForm from "./ContactForm";

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
  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Information & Partnership Column */}
          <div className="lg:col-span-5 space-y-6">
            <span className="inline-block rounded-full bg-(--secondColor)/30 px-3 py-1 text-xs font-bold text-(--mainColor)">
              {CONTACT_PAGE_CONTENT.tag}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-(--mainColor) tracking-tight">
              {CONTACT_PAGE_CONTENT.title}
            </h1>
            <p className="text-sm sm:text-base leading-relaxed text-(--mainColor)/75">
              {CONTACT_PAGE_CONTENT.subtitle}
            </p>

            <div className="rounded-2xl border border-(--mainColor)/15 bg-(--mainColor)/5 p-6 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-(--mainColor)">
                What happens after you apply?
              </h2>
              <ul className="space-y-3 text-xs sm:text-sm text-(--mainColor)/80">
                <li className="flex items-start gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-(--secondColor) text-[#3B2418] font-bold text-xs">
                    1
                  </span>
                  <span>We confirm your cafe details and customize your stamp targets.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-(--secondColor) text-[#3B2418] font-bold text-xs">
                    2
                  </span>
                  <span>We issue your manager login and barista staff invitations.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-(--secondColor) text-[#3B2418] font-bold text-xs">
                    3
                  </span>
                  <span>Your staff starts scanning visits immediately—no new hardware required.</span>
                </li>
              </ul>

              <div className="pt-3 border-t border-(--mainColor)/10 text-xs text-(--mainColor)/70 flex items-center gap-1.5">
                <LuMail className="h-4 w-4 text-(--mainColor)/60 shrink-0" />
                <span>Direct inquiries: </span>
                <a
                  href={`mailto:${CONTACT_PAGE_CONTENT.contactEmail}`}
                  className="font-bold text-(--mainColor) underline"
                >
                  {CONTACT_PAGE_CONTENT.contactEmail}
                </a>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
