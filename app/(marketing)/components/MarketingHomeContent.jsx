"use client";

import React from "react";
import Link from "next/link";
import {
  LuSparkles,
  LuCoffee,
  LuQrCode,
  LuUserX,
  LuStore,
  LuScanLine,
  LuUsers,
  LuGift,
  LuShieldCheck,
  LuUtensils,
  LuRefreshCw,
  LuSmartphone,
  LuLayers,
  LuTrendingUp,
  LuEyeOff,
} from "react-icons/lu";
import HeroSection from "./HeroSection";
import FaqAccordion from "./FaqAccordion";
import {
  MotionReveal,
  MotionStagger,
  MotionStaggerItem,
} from "./MotionPrimitives";
import { useMarketingLanguage, I18N_CONTENT } from "../i18n";

export default function MarketingHomeContent() {
  const { language } = useMarketingLanguage();
  const t = I18N_CONTENT[language] || I18N_CONTENT.en;

  const problemIcons = [LuUserX, LuEyeOff, LuUtensils];

  const cafeFeatureIcons = [
    LuGift,
    LuScanLine,
    LuUsers,
    LuSparkles,
    LuShieldCheck,
    LuTrendingUp,
  ];

  const menuIcons = [LuRefreshCw, LuSmartphone, LuLayers];

  return (
    <div className="space-y-20 sm:space-y-28 pt-2 pb-12 sm:pt-6 sm:pb-16">
      {/* 1. HERO SECTION */}
      <HeroSection trustedCafesCount="20+" />

      {/* 2. THE PROBLEM SECTION */}
      <section
        aria-labelledby="problem-heading"
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <MotionReveal className="rounded-[32px] border border-(--mainColor)/15 bg-(--mainColor)/5 p-8 sm:p-12 lg:p-16">
          <div className="mx-auto max-w-2xl text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-(--secondColor)">
              {t.home.problems.tag}
            </span>
            <h2
              id="problem-heading"
              className="text-2xl font-extrabold text-(--mainColor) sm:text-3xl lg:text-4xl"
            >
              {t.home.problems.title}
            </h2>
            <p className="text-sm leading-relaxed text-(--mainColor)/75">
              {t.home.problems.subtitle}
            </p>
          </div>

          <MotionStagger className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {t.home.problems.items.map((item, idx) => {
              const IconComp = problemIcons[idx] || LuUserX;
              return (
                <MotionStaggerItem
                  key={item.title}
                  hoverLift
                  className="rounded-2xl border border-(--mainColor)/10 bg-(--bgColor) p-6 sm:p-8 shadow-2xs space-y-3 text-start"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-(--secondColor) text-[#3B2418]">
                    <IconComp className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-(--mainColor)">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-(--mainColor)/70">
                    {item.description}
                  </p>
                </MotionStaggerItem>
              );
            })}
          </MotionStagger>
        </MotionReveal>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section
        aria-labelledby="how-it-works-heading"
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <MotionReveal className="mx-auto max-w-2xl text-center space-y-3 mb-12 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-(--secondColor)">
            {t.home.howItWorks.tag}
          </span>
          <h2
            id="how-it-works-heading"
            className="text-2xl font-extrabold text-(--mainColor) sm:text-3xl lg:text-4xl"
          >
            {t.home.howItWorks.title}
          </h2>
          <p className="text-sm leading-relaxed text-(--mainColor)/75">
            {t.home.howItWorks.subtitle}
          </p>
        </MotionReveal>

        {/* Customer 3-Step Flow */}
        <div className="space-y-4">
          <MotionReveal className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-(--secondColor) text-[#3B2418] text-xs font-bold">
              1
            </span>
            <h3 className="text-sm font-bold uppercase tracking-wider text-(--mainColor)">
              {t.home.howItWorks.customersTitle}
            </h3>
          </MotionReveal>

          <MotionStagger className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {t.home.howItWorks.customerSteps.map((step) => (
              <MotionStaggerItem
                key={step.step}
                hoverLift
                className="relative rounded-2xl border border-(--mainColor)/15 bg-(--mainColor)/5 p-6 shadow-2xs space-y-3 text-start"
              >
                <span className="inline-block rounded-md bg-(--secondColor) px-2 py-0.5 font-mono text-xs font-extrabold text-[#3B2418]">
                  {step.step}
                </span>
                <h4 className="text-base font-bold text-(--mainColor)">
                  {step.title}
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed text-(--mainColor)/75">
                  {step.description}
                </p>
              </MotionStaggerItem>
            ))}
          </MotionStagger>
        </div>

        {/* Cafe 3-Step Flow */}
        <div className="mt-12 space-y-4">
          <MotionReveal className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-(--mainColor) text-(--bgColor) text-xs font-bold">
              2
            </span>
            <h3 className="text-sm font-bold uppercase tracking-wider text-(--mainColor)">
              {t.home.howItWorks.cafesTitle}
            </h3>
          </MotionReveal>

          <MotionStagger className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {t.home.howItWorks.cafeSteps.map((step) => (
              <MotionStaggerItem
                key={step.step}
                hoverLift
                className="relative rounded-2xl border border-(--mainColor)/15 bg-(--bgColor) p-6 shadow-2xs space-y-3 text-start"
              >
                <span className="inline-block rounded-md bg-(--mainColor) px-2 py-0.5 font-mono text-xs font-extrabold text-(--bgColor)">
                  {step.step}
                </span>
                <h4 className="text-base font-bold text-(--mainColor)">
                  {step.title}
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed text-(--mainColor)/75">
                  {step.description}
                </p>
              </MotionStaggerItem>
            ))}
          </MotionStagger>
        </div>
      </section>

      {/* 4. DIGITAL MENU SECTION */}
      <section
        id="menu"
        aria-labelledby="menu-heading"
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 scroll-mt-24"
      >
        <MotionReveal className="rounded-[32px] border border-(--mainColor)/15 bg-(--mainColor)/5 p-8 sm:p-12 lg:p-14">
          <div className="mx-auto max-w-2xl text-center space-y-3 mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-(--secondColor)">
              {t.home.digitalMenu.tag}
            </span>
            <h2
              id="menu-heading"
              className="text-2xl font-extrabold text-(--mainColor) sm:text-3xl lg:text-4xl"
            >
              {t.home.digitalMenu.title}
            </h2>
            <p className="text-sm leading-relaxed text-(--mainColor)/75">
              {t.home.digitalMenu.subtitle}
            </p>
          </div>

          <MotionStagger className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {t.home.digitalMenu.items.map((item, idx) => {
              const Icon = menuIcons[idx] || LuUtensils;
              return (
                <MotionStaggerItem
                  key={item.title}
                  hoverLift
                  className="rounded-2xl border border-(--mainColor)/10 bg-(--bgColor) p-6 shadow-2xs space-y-3 text-start relative"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-(--secondColor) text-[#3B2418]">
                      <Icon className="h-5 w-5" />
                    </div>
                    {item.comingSoon && (
                      <span className="rounded-full bg-(--secondColor)/30 px-2.5 py-0.5 text-[10px] font-bold text-(--mainColor)">
                        {language === "ar" ? "قريباً" : "Coming Soon"}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-(--mainColor)">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-(--mainColor)/75">
                    {item.description}
                  </p>
                </MotionStaggerItem>
              );
            })}
          </MotionStagger>
        </MotionReveal>
      </section>

      {/* 5. FREE EXPOSURE SECTION */}
      <section
        id="exposure"
        aria-labelledby="exposure-heading"
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 scroll-mt-24"
      >
        <MotionReveal className="rounded-[32px] border border-(--mainColor)/15 bg-(--bgColor) p-8 sm:p-12 shadow-sm">
          <div className="mx-auto max-w-2xl text-center space-y-3 mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-(--secondColor)">
              {t.home.exposure.tag}
            </span>
            <h2
              id="exposure-heading"
              className="text-2xl font-extrabold text-(--mainColor) sm:text-3xl lg:text-4xl"
            >
              {t.home.exposure.title}
            </h2>
            <p className="text-sm leading-relaxed text-(--mainColor)/75">
              {t.home.exposure.subtitle}
            </p>
          </div>

          <MotionStagger className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {t.home.exposure.items.map((pt) => (
              <MotionStaggerItem
                key={pt.title}
                hoverLift
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
              </MotionStaggerItem>
            ))}
          </MotionStagger>
        </MotionReveal>
      </section>

      {/* 6. FOR CUSTOMERS SECTION */}
      <section
        aria-labelledby="customers-heading"
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <MotionReveal className="mx-auto max-w-2xl text-center space-y-3 mb-12 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-(--secondColor)">
            {t.home.customerBenefits.tag}
          </span>
          <h2
            id="customers-heading"
            className="text-2xl font-extrabold text-(--mainColor) sm:text-3xl lg:text-4xl"
          >
            {t.home.customerBenefits.title}
          </h2>
          <p className="text-sm leading-relaxed text-(--mainColor)/75">
            {t.home.customerBenefits.subtitle}
          </p>
        </MotionReveal>

        <MotionStagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {t.home.customerBenefits.items.map((b) => (
            <MotionStaggerItem
              key={b.title}
              hoverLift
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
                <span>{t.home.customerBenefits.freeLabel}</span>
                <LuQrCode className="h-4 w-4" />
              </div>
            </MotionStaggerItem>
          ))}
        </MotionStagger>
      </section>

      {/* 7. FOR CAFES SECTION */}
      <section
        aria-labelledby="cafes-heading"
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <MotionReveal className="mx-auto max-w-2xl text-center space-y-3 mb-12 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-(--secondColor)">
            {t.home.cafeFeatures.tag}
          </span>
          <h2
            id="cafes-heading"
            className="text-2xl font-extrabold text-(--mainColor) sm:text-3xl lg:text-4xl"
          >
            {t.home.cafeFeatures.title}
          </h2>
          <p className="text-sm leading-relaxed text-(--mainColor)/75">
            {t.home.cafeFeatures.subtitle}
          </p>
        </MotionReveal>

        <MotionStagger className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {t.home.cafeFeatures.items.map((feat, idx) => {
            const Icon = cafeFeatureIcons[idx] || LuStore;
            return (
              <MotionStaggerItem
                key={feat.title}
                hoverLift
                className="rounded-2xl border border-(--mainColor)/15 bg-(--bgColor) p-6 sm:p-7 shadow-2xs space-y-3 text-start transition hover:border-(--mainColor)/30 hover:shadow-sm relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-(--secondColor) text-[#3B2418]">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-(--mainColor)">
                    {feat.title}
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-(--mainColor)/75 mt-1.5">
                    {feat.description}
                  </p>
                </div>
              </MotionStaggerItem>
            );
          })}
        </MotionStagger>
      </section>

      {/* 8. PLATFORM NOTE SECTION */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <MotionReveal className="relative rounded-3xl border-2 border-dashed border-(--mainColor)/20 bg-(--secondColor)/15 p-8 text-center sm:p-10 space-y-3">
          <span className="inline-block rounded-full bg-(--mainColor) px-3 py-1 text-xs font-bold text-(--bgColor)">
            {t.home.platformNote.badge}
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold text-(--mainColor)">
            {t.home.platformNote.headline}
          </h3>
          <p className="mx-auto max-w-xl text-xs sm:text-sm leading-relaxed text-(--mainColor)/80">
            {t.home.platformNote.detail}
          </p>
        </MotionReveal>
      </section>

      {/* 9. FAQ ACCORDION SECTION */}
      <section
        id="faq"
        aria-labelledby="faq-heading"
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 scroll-mt-24"
      >
        <MotionReveal className="mx-auto max-w-2xl text-center space-y-3 mb-10 sm:mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-(--secondColor)">
            {t.home.faq.tag}
          </span>
          <h2
            id="faq-heading"
            className="text-2xl font-extrabold text-(--mainColor) sm:text-3xl lg:text-4xl"
          >
            {t.home.faq.title}
          </h2>
          <p className="text-sm leading-relaxed text-(--mainColor)/75">
            {t.home.faq.subtitle}
          </p>
        </MotionReveal>

        <MotionReveal delay={0.08}>
          <FaqAccordion />
        </MotionReveal>
      </section>

      {/* 10. FINAL CTA BAND */}
      <section
        aria-labelledby="cta-band-heading"
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <MotionReveal className="relative rounded-[36px] bg-(--mainColor) text-(--bgColor) p-8 sm:p-12 lg:p-16 text-center space-y-6 shadow-xl overflow-hidden">
          <div
            className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-(--secondColor)/15 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-(--secondColor)/10 blur-3xl"
            aria-hidden="true"
          />

          <span className="inline-block rounded-full bg-(--secondColor) px-3 py-1 text-xs font-black uppercase tracking-wider text-[#3B2418]">
            {t.home.finalCta.badge}
          </span>

          <h2
            id="cta-band-heading"
            className="mx-auto max-w-2xl text-3xl font-extrabold sm:text-4xl lg:text-5xl tracking-tight leading-tight"
          >
            {t.home.finalCta.headline}
          </h2>

          <p className="mx-auto max-w-xl text-sm sm:text-base leading-relaxed text-(--bgColor)/75">
            {t.home.finalCta.subline}
          </p>

          <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-(--secondColor) px-7 py-3.5 text-sm font-extrabold text-[#3B2418] shadow-md transition hover:opacity-95 active:scale-[0.98]"
            >
              <LuStore className="h-4 w-4" />
              <span>{t.home.finalCta.ctaCafe}</span>
            </Link>
            <Link
              href="/login?as=customer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-(--bgColor)/30 bg-transparent px-7 py-3.5 text-sm font-extrabold text-(--bgColor) transition hover:bg-(--bgColor)/10 active:scale-[0.98]"
            >
              <LuCoffee className="h-4 w-4" />
              <span>{t.home.finalCta.ctaCustomer}</span>
            </Link>
          </div>
        </MotionReveal>
      </section>
    </div>
  );
}
