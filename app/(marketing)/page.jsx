import Link from "next/link";
import {
  LuSparkles,
  LuArrowRight,
  LuCoffee,
  LuQrCode,
  LuUserX,
  LuSearch,
  LuStore,
  LuScanLine,
  LuUsers,
  LuGift,
  LuShieldCheck,
  LuListOrdered,
  LuSlidersHorizontal,
  LuCheck,
  LuCompass,
  LuUtensils,
  LuRefreshCw,
  LuSmartphone,
  LuLayers,
  LuTrendingUp,
  LuEyeOff,
} from "react-icons/lu";
import HeroPhoneMockup from "./components/HeroPhoneMockup";
import FaqAccordion from "./components/FaqAccordion";
import {
  HERO_CONTENT,
  PROBLEMS_CONTENT,
  HOW_IT_WORKS_CONTENT,
  CUSTOMER_BENEFITS,
  CAFE_FEATURES,
  ONLINE_MENU_CONTENT,
  EXPOSURE_CONTENT,
  PLATFORM_NOTE,
} from "./content";

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
  const problemIcons = [LuUserX, LuEyeOff, LuUtensils];

  const cafeFeatureIcons = {
    gift: LuGift,
    scanner: LuScanLine,
    users: LuUsers,
    sparkles: LuSparkles,
    shield: LuShieldCheck,
    list: LuListOrdered,
    menu: LuUtensils,
    analytics: LuTrendingUp,
  };

  const menuIcons = {
    refresh: LuRefreshCw,
    smartphone: LuSmartphone,
    layers: LuLayers,
  };

  return (
    <div className="space-y-24 sm:space-y-32 py-10 sm:py-16">
      {/* 1. HERO SECTION */}
      <section
        aria-labelledby="hero-heading"
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Copy Side */}
          <div className="text-center lg:col-span-7 lg:text-start space-y-6">
            {/* Egypt Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-(--mainColor)/15 bg-(--secondColor)/25 px-3.5 py-1.5 text-xs font-bold text-(--mainColor) shadow-2xs">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-(--secondColor) text-[#3B2418]">
                <LuSparkles className="h-3 w-3" />
              </span>
              <span>{HERO_CONTENT.badge}</span>
            </div>

            {/* Headline */}
            <h1
              id="hero-heading"
              className="text-4xl font-extrabold tracking-tight text-(--mainColor) sm:text-5xl lg:text-6xl leading-[1.12]"
            >
              <span>{HERO_CONTENT.headlinePrefix} </span>
              <span className="relative inline-block text-(--mainColor) underline decoration-(--secondColor) decoration-wavy decoration-from-font">
                {HERO_CONTENT.headlineHighlight}
              </span>
            </h1>

            {/* Subline */}
            <p className="mx-auto max-w-2xl text-base sm:text-lg leading-relaxed text-(--mainColor)/80 lg:mx-0">
              {HERO_CONTENT.subline}
            </p>

            {/* Two CTAs */}
            <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row lg:justify-start">
              <Link
                href={HERO_CONTENT.ctaCustomerHref}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-(--secondColor) px-6 py-3.5 text-sm font-extrabold text-[#3B2418] shadow-sm transition hover:opacity-95 active:scale-[0.98]"
              >
                <LuCoffee className="h-4 w-4" />
                <span>{HERO_CONTENT.ctaCustomer}</span>
                <LuArrowRight className="h-4 w-4 ms-1" />
              </Link>
              <Link
                href={HERO_CONTENT.ctaCafeHref}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-(--mainColor) bg-transparent px-6 py-3.5 text-sm font-extrabold text-(--mainColor) transition hover:bg-(--mainColor) hover:text-(--bgColor) active:scale-[0.98]"
              >
                <LuStore className="h-4 w-4" />
                <span>{HERO_CONTENT.ctaCafe}</span>
              </Link>
            </div>

            <p className="text-xs text-(--mainColor)/65">
              Instant mobile web experience. No app store installation required.
            </p>
          </div>

          {/* Visual Phone Mockup Side */}
          <div className="lg:col-span-5 flex justify-center">
            <HeroPhoneMockup />
          </div>
        </div>
      </section>

      {/* 2. THE PROBLEM SECTION */}
      <section
        aria-labelledby="problem-heading"
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="rounded-[32px] border border-(--mainColor)/15 bg-(--mainColor)/5 p-8 sm:p-12 lg:p-16">
          <div className="mx-auto max-w-2xl text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-(--secondColor)">
              {PROBLEMS_CONTENT.tag}
            </span>
            <h2
              id="problem-heading"
              className="text-2xl font-extrabold text-(--mainColor) sm:text-3xl lg:text-4xl"
            >
              {PROBLEMS_CONTENT.title}
            </h2>
            <p className="text-sm leading-relaxed text-(--mainColor)/75">
              {PROBLEMS_CONTENT.subtitle}
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {PROBLEMS_CONTENT.items.map((item, idx) => {
              const IconComp = problemIcons[idx] || LuUserX;
              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-(--mainColor)/10 bg-(--bgColor) p-6 sm:p-8 shadow-2xs space-y-3 text-start"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-(--secondColor) text-(--mainColor)">
                    <IconComp className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-(--mainColor)">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-(--mainColor)/70">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section
        aria-labelledby="how-it-works-heading"
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-2xl text-center space-y-3 mb-12 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-(--secondColor)">
            {HOW_IT_WORKS_CONTENT.tag}
          </span>
          <h2
            id="how-it-works-heading"
            className="text-2xl font-extrabold text-(--mainColor) sm:text-3xl lg:text-4xl"
          >
            {HOW_IT_WORKS_CONTENT.title}
          </h2>
          <p className="text-sm leading-relaxed text-(--mainColor)/75">
            {HOW_IT_WORKS_CONTENT.subtitle}
          </p>
        </div>

        {/* Customer 3-Step Flow */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-(--secondColor) text-[#3B2418] text-xs font-bold">
              1
            </span>
            <h3 className="text-sm font-bold uppercase tracking-wider text-(--mainColor)">
              For Coffee Lovers
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {HOW_IT_WORKS_CONTENT.customerSteps.map((step) => (
              <div
                key={step.step}
                className="relative rounded-2xl border border-(--mainColor)/15 bg-(--mainColor)/5 p-6 shadow-2xs space-y-3 text-start"
              >
                <span className="inline-block rounded-md bg-(--secondColor) px-2 py-0.5 font-mono text-xs font-extrabold text-[#3B2418]">
                  Step {step.step}
                </span>
                <h4 className="text-base font-bold text-(--mainColor)">
                  {step.title}
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed text-(--mainColor)/75">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Cafe 3-Step Flow */}
        <div className="mt-12 space-y-4">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-(--mainColor) text-(--bgColor) text-xs font-bold">
              2
            </span>
            <h3 className="text-sm font-bold uppercase tracking-wider text-(--mainColor)">
              For Cafe Owners & Teams
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {HOW_IT_WORKS_CONTENT.cafeRow.steps.map((step) => (
              <div
                key={step.step}
                className="relative rounded-2xl border border-(--mainColor)/15 bg-(--bgColor) p-6 shadow-2xs space-y-3 text-start"
              >
                <span className="inline-block rounded-md bg-(--mainColor) px-2 py-0.5 font-mono text-xs font-extrabold text-(--bgColor)">
                  Step {step.step}
                </span>
                <h4 className="text-base font-bold text-(--mainColor)">
                  {step.title}
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed text-(--mainColor)/75">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. DIGITAL MENU SECTION (NEW) */}
      <section
        id="menu"
        aria-labelledby="menu-heading"
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 scroll-mt-24"
      >
        <div className="rounded-[32px] border border-(--mainColor)/15 bg-(--mainColor)/5 p-8 sm:p-12 lg:p-14">
          <div className="mx-auto max-w-2xl text-center space-y-3 mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-(--secondColor)">
              {ONLINE_MENU_CONTENT.tag}
            </span>
            <h2
              id="menu-heading"
              className="text-2xl font-extrabold text-(--mainColor) sm:text-3xl lg:text-4xl"
            >
              {ONLINE_MENU_CONTENT.title}
            </h2>
            <p className="text-sm leading-relaxed text-(--mainColor)/75">
              {ONLINE_MENU_CONTENT.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {ONLINE_MENU_CONTENT.highlights.map((item) => {
              const Icon = menuIcons[item.icon] || LuUtensils;
              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-(--mainColor)/10 bg-(--bgColor) p-6 shadow-2xs space-y-3 text-start relative"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-(--secondColor) text-[#3B2418]">
                      <Icon className="h-5 w-5" />
                    </div>
                    {item.comingSoon && (
                      <span className="rounded-full bg-(--secondColor)/30 px-2.5 py-0.5 text-[10px] font-bold text-(--mainColor)">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-(--mainColor)">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-(--mainColor)/75">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. FREE EXPOSURE SECTION (NEW) */}
      <section
        id="exposure"
        aria-labelledby="exposure-heading"
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 scroll-mt-24"
      >
        <div className="rounded-[32px] border border-(--mainColor)/15 bg-(--bgColor) p-8 sm:p-12 shadow-sm">
          <div className="mx-auto max-w-2xl text-center space-y-3 mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-(--secondColor)">
              {EXPOSURE_CONTENT.tag}
            </span>
            <h2
              id="exposure-heading"
              className="text-2xl font-extrabold text-(--mainColor) sm:text-3xl lg:text-4xl"
            >
              {EXPOSURE_CONTENT.title}
            </h2>
            <p className="text-sm leading-relaxed text-(--mainColor)/75">
              {EXPOSURE_CONTENT.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {EXPOSURE_CONTENT.points.map((pt) => (
              <div
                key={pt.title}
                className="rounded-2xl border border-(--mainColor)/15 bg-(--mainColor)/5 p-6 shadow-2xs space-y-3 text-start flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <span className="inline-block rounded-full bg-(--secondColor) px-2.5 py-0.5 text-[10px] font-bold text-[#3B2418]">
                    {pt.badge}
                  </span>
                  <h3 className="text-base font-bold text-(--mainColor)">
                    {pt.title}
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-(--mainColor)/75">
                    {pt.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FOR CUSTOMERS SECTION */}
      <section
        aria-labelledby="customers-heading"
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-2xl text-center space-y-3 mb-12 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-(--secondColor)">
            {CUSTOMER_BENEFITS.tag}
          </span>
          <h2
            id="customers-heading"
            className="text-2xl font-extrabold text-(--mainColor) sm:text-3xl lg:text-4xl"
          >
            {CUSTOMER_BENEFITS.title}
          </h2>
          <p className="text-sm leading-relaxed text-(--mainColor)/75">
            {CUSTOMER_BENEFITS.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CUSTOMER_BENEFITS.items.map((b) => (
            <div
              key={b.title}
              className="relative rounded-2xl border-2 border-(--mainColor)/15 bg-(--mainColor)/5 p-6 shadow-xs overflow-hidden flex flex-col justify-between"
            >
              <div className="space-y-3">
                <span className="inline-block rounded-full bg-(--secondColor)/30 px-2.5 py-0.5 text-[11px] font-bold text-(--mainColor)">
                  {b.badge}
                </span>
                <h3 className="text-base font-bold text-(--mainColor)">
                  {b.title}
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed text-(--mainColor)/75">
                  {b.description}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-dashed border-(--mainColor)/20 flex items-center justify-between text-xs text-(--mainColor)/60">
                <span>Free for Coffee Lovers</span>
                <LuQrCode className="h-4 w-4" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. FOR CAFES SECTION */}
      <section
        aria-labelledby="cafes-heading"
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-2xl text-center space-y-3 mb-12 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-(--secondColor)">
            {CAFE_FEATURES.tag}
          </span>
          <h2
            id="cafes-heading"
            className="text-2xl font-extrabold text-(--mainColor) sm:text-3xl lg:text-4xl"
          >
            {CAFE_FEATURES.title}
          </h2>
          <p className="text-sm leading-relaxed text-(--mainColor)/75">
            {CAFE_FEATURES.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {CAFE_FEATURES.features.map((feat) => {
            const Icon = cafeFeatureIcons[feat.icon] || LuStore;
            return (
              <div
                key={feat.title}
                className="rounded-2xl border border-(--mainColor)/15 bg-(--bgColor) p-6 sm:p-7 shadow-2xs space-y-3 text-start transition hover:border-(--mainColor)/30 hover:shadow-sm relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-(--secondColor) text-[#3B2418]">
                      <Icon className="h-5 w-5" />
                    </div>
                    {feat.comingSoon && (
                      <span className="rounded-full bg-(--secondColor)/30 px-2 py-0.5 text-[9px] font-bold text-(--mainColor)">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-(--mainColor)">
                    {feat.title}
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-(--mainColor)/75 mt-1.5">
                    {feat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. PLATFORM NOTE SECTION */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl border-2 border-dashed border-(--mainColor)/20 bg-(--secondColor)/15 p-8 text-center sm:p-10 space-y-3">
          <span className="inline-block rounded-full bg-(--mainColor) px-3 py-1 text-xs font-bold text-(--bgColor)">
            {PLATFORM_NOTE.badge}
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold text-(--mainColor)">
            {PLATFORM_NOTE.headline}
          </h3>
          <p className="mx-auto max-w-xl text-xs sm:text-sm leading-relaxed text-(--mainColor)/80">
            {PLATFORM_NOTE.detail}
          </p>
        </div>
      </section>

      {/* 10. FAQ ACCORDION SECTION */}
      <section
        id="faq"
        aria-labelledby="faq-heading"
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 scroll-mt-24"
      >
        <div className="mx-auto max-w-2xl text-center space-y-3 mb-10 sm:mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-(--secondColor)">
            Frequently Asked Questions
          </span>
          <h2
            id="faq-heading"
            className="text-2xl font-extrabold text-(--mainColor) sm:text-3xl lg:text-4xl"
          >
            Questions & Answers
          </h2>
          <p className="text-sm leading-relaxed text-(--mainColor)/75">
            Clear answers for coffee lovers and cafe owners.
          </p>
        </div>

        <FaqAccordion />
      </section>

      {/* 11. FINAL CTA BAND */}
      <section
        aria-labelledby="cta-band-heading"
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="relative rounded-[36px] bg-(--mainColor) text-(--bgColor) p-8 sm:p-12 lg:p-16 text-center space-y-6 shadow-xl overflow-hidden">
          <div
            className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-(--secondColor)/15 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-(--secondColor)/10 blur-3xl"
            aria-hidden="true"
          />

          <span className="inline-block rounded-full bg-(--secondColor) px-3 py-1 text-xs font-black uppercase tracking-wider text-[#3B2418]">
            Built for Egypt&apos;s Coffee Scene
          </span>

          <h2
            id="cta-band-heading"
            className="mx-auto max-w-2xl text-3xl font-extrabold sm:text-4xl lg:text-5xl tracking-tight leading-tight"
          >
            Ready to turn visitors into regulars?
          </h2>

          <p className="mx-auto max-w-xl text-sm sm:text-base leading-relaxed text-(--bgColor)/75">
            Join independent coffee shops across Cairo, Giza, and Alexandria growing repeat visits with Notch.
          </p>

          <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-(--secondColor) px-7 py-3.5 text-sm font-extrabold text-[#3B2418] shadow-md transition hover:opacity-95 active:scale-[0.98]"
            >
              <LuStore className="h-4 w-4" />
              <span>Apply for Your Cafe</span>
            </Link>
            <Link
              href="/login?as=customer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-(--bgColor)/30 bg-transparent px-7 py-3.5 text-sm font-extrabold text-(--bgColor) transition hover:bg-(--bgColor)/10 active:scale-[0.98]"
            >
              <LuCoffee className="h-4 w-4" />
              <span>Explore as Customer</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
