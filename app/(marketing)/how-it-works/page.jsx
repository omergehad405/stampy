import Link from "next/link";
import {
  LuSparkles,
  LuStore,
  LuQrCode,
  LuCheck,
  LuShieldCheck,
  LuClock,
  LuArrowRight,
  LuRepeat,
  LuLock,
} from "react-icons/lu";
import { HOW_IT_WORKS_CONTENT } from "../content";

export const metadata = {
  title: "How Notch Works for Customers & Cafes in Egypt",
  description:
    "Discover how Notch turns one-time cafe visitors into regulars: browse local online menus, scan your QR code at checkout, and enjoy free coffee rewards.",
};

export default function HowItWorksPage() {
  const { customerSteps, cafeRow, scannerDeepDive } = HOW_IT_WORKS_CONTENT;

  return (
    <div className="space-y-24 py-12 sm:py-16">
      {/* Page Header */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="inline-block rounded-full bg-(--secondColor)/30 px-3 py-1 text-xs font-bold text-(--mainColor)">
          Step-by-Step Walkthrough
        </span>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-(--mainColor) tracking-tight">
          How Notch Works
        </h1>
        <p className="mx-auto max-w-2xl text-sm sm:text-base leading-relaxed text-(--mainColor)/75">
          Everything designed to save precious seconds at the coffee counter. Here is how both sides of the experience connect seamlessly.
        </p>
      </section>

      {/* Customer Journey - Vertical Timeline */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="border-b border-(--mainColor)/15 pb-4 mb-8">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-(--secondColor) text-[#3B2418] font-bold text-xs">
              01
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-(--mainColor)">
              The Customer Experience
            </h2>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-(--mainColor)/70">
            From discovering a neighborhood spot to claiming your free flat white.
          </p>
        </div>

        <div className="relative border-s-2 border-(--mainColor)/20 ms-4 sm:ms-6 space-y-10 sm:space-y-12">
          {customerSteps.map((step) => (
            <div key={step.step} className="relative ps-6 sm:ps-10">
              {/* Dot */}
              <div className="absolute -start-[11px] top-1.5 flex h-5 w-5 items-center justify-center rounded-full border-4 border-(--bgColor) bg-(--secondColor)" />

              <div className="rounded-2xl border border-(--mainColor)/15 bg-(--mainColor)/5 p-6 sm:p-8 space-y-2">
                <span className="font-mono text-xs font-extrabold text-(--mainColor)/60">
                  Step {step.step}
                </span>
                <h3 className="text-lg font-bold text-(--mainColor)">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed text-(--mainColor)/75">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cafe Staff Journey */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="border-b border-(--mainColor)/15 pb-4 mb-8">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-(--mainColor) text-(--bgColor) font-bold text-xs">
              02
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-(--mainColor)">
              The Cafe Barista Workflow
            </h2>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-(--mainColor)/70">
            Speed-optimized for morning rush hours with zero bulky hardware.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {cafeRow.steps.map((step) => (
            <div
              key={step.step}
              className="rounded-2xl border border-(--mainColor)/15 bg-(--bgColor) p-6 sm:p-7 shadow-2xs space-y-3"
            >
              <span className="inline-block rounded-md bg-(--mainColor) px-2 py-0.5 font-mono text-xs font-bold text-(--bgColor)">
                Step {step.step}
              </span>
              <h3 className="text-base font-bold text-(--mainColor)">
                {step.title}
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed text-(--mainColor)/75">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* "What Happens When You Scan" Security & Integrity Deep Dive */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border-2 border-(--mainColor)/15 bg-(--mainColor)/5 p-8 sm:p-12 space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-(--secondColor) text-[#3B2418]">
              <LuShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-(--mainColor)">
                {scannerDeepDive.title}
              </h2>
              <p className="text-xs sm:text-sm text-(--mainColor)/70">
                Behind the scenes of our trusted visit and redemption architecture.
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm leading-relaxed text-(--mainColor)/80">
            {scannerDeepDive.description}
          </p>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 pt-2">
            {scannerDeepDive.securityPoints.map((pt) => (
              <div
                key={pt}
                className="flex items-start gap-2.5 rounded-xl border border-(--mainColor)/10 bg-(--bgColor) p-3.5 text-xs text-(--mainColor)"
              >
                <LuCheck className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                <span className="font-medium">{pt}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="rounded-3xl bg-(--mainColor) text-(--bgColor) p-8 sm:p-10 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold">
            Ready to turn one-time visitors into loyal regulars?
          </h2>
          <p className="text-xs sm:text-sm text-(--bgColor)/75 max-w-xl mx-auto">
            Setup takes less than 10 minutes. No extra hardware, POS modifications, or contracts.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-(--secondColor) px-6 py-3 text-xs sm:text-sm font-bold text-[#3B2418] hover:opacity-90"
            >
              <span>Apply for Your Cafe</span>
              <LuArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
