"use client";

import React from "react";
import Link from "next/link";
import { LuArrowRight, LuArrowLeft } from "react-icons/lu";
import {
  MotionHeroItem,
  MotionReveal,
  MotionStagger,
  MotionStaggerItem,
} from "../components/MotionPrimitives";
import { useMarketingLanguage, I18N_CONTENT } from "../i18n";

export default function HowItWorksContent() {
  const { language } = useMarketingLanguage();
  const t = I18N_CONTENT[language] || I18N_CONTENT.en;
  const isRtl = language === "ar";
  const ArrowIcon = isRtl ? LuArrowLeft : LuArrowRight;

  return (
    <div className="space-y-24 py-12 sm:py-16">
      {/* Page Header */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <MotionHeroItem delay={0}>
          <span className="inline-block rounded-full bg-(--secondColor)/30 px-3 py-1 text-xs font-bold text-(--mainColor)">
            {t.howItWorksPage.badge}
          </span>
        </MotionHeroItem>
        <MotionHeroItem delay={0.06}>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-(--mainColor) tracking-tight">
            {t.howItWorksPage.title}
          </h1>
        </MotionHeroItem>
        <MotionHeroItem delay={0.12}>
          <p className="mx-auto max-w-2xl text-sm sm:text-base leading-relaxed text-(--mainColor)/75">
            {t.howItWorksPage.subtitle}
          </p>
        </MotionHeroItem>
      </section>

      {/* Customer Journey - Vertical Timeline */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <MotionReveal className="border-b border-(--mainColor)/15 pb-4 mb-8">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-(--secondColor) text-[#3B2418] font-bold text-xs">
              01
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-(--mainColor)">
              {t.howItWorksPage.customerTitle}
            </h2>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-(--mainColor)/70">
            {t.howItWorksPage.customerSubtitle}
          </p>
        </MotionReveal>

        <MotionStagger className="relative border-s-2 border-(--mainColor)/20 ms-4 sm:ms-6 space-y-10 sm:space-y-12">
          {t.home.howItWorks.customerSteps.map((step) => (
            <MotionStaggerItem key={step.step} className="relative ps-6 sm:ps-10">
              {/* Dot */}
              <div className="absolute -start-[11px] top-1.5 flex h-5 w-5 items-center justify-center rounded-full border-4 border-(--bgColor) bg-(--secondColor)" />

              <div className="rounded-2xl border border-(--mainColor)/15 bg-(--mainColor)/5 p-6 sm:p-8 space-y-2">
                <span className="font-mono text-xs font-extrabold text-(--mainColor)/60">
                  {language === "ar" ? `الخطوة ${step.step}` : `Step ${step.step}`}
                </span>
                <h3 className="text-lg font-bold text-(--mainColor)">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed text-(--mainColor)/75">
                  {step.description}
                </p>
              </div>
            </MotionStaggerItem>
          ))}
        </MotionStagger>
      </section>

      {/* Cafe Staff Journey */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <MotionReveal className="border-b border-(--mainColor)/15 pb-4 mb-8">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-(--mainColor) text-(--bgColor) font-bold text-xs">
              02
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-(--mainColor)">
              {t.howItWorksPage.cafeTitle}
            </h2>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-(--mainColor)/70">
            {t.howItWorksPage.cafeSubtitle}
          </p>
        </MotionReveal>

        <MotionStagger className="relative border-s-2 border-(--mainColor)/20 ms-4 sm:ms-6 space-y-10 sm:space-y-12">
          {t.home.howItWorks.cafeSteps.map((step) => (
            <MotionStaggerItem key={step.step} className="relative ps-6 sm:ps-10">
              {/* Dot */}
              <div className="absolute -start-[11px] top-1.5 flex h-5 w-5 items-center justify-center rounded-full border-4 border-(--bgColor) bg-(--mainColor)" />

              <div className="rounded-2xl border border-(--mainColor)/15 bg-(--bgColor) p-6 sm:p-8 space-y-2 shadow-2xs">
                <span className="font-mono text-xs font-extrabold text-(--mainColor)/60">
                  {language === "ar" ? `الخطوة ${step.step}` : `Step ${step.step}`}
                </span>
                <h3 className="text-lg font-bold text-(--mainColor)">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed text-(--mainColor)/75">
                  {step.description}
                </p>
              </div>
            </MotionStaggerItem>
          ))}
        </MotionStagger>
      </section>

      {/* CTA Box */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        <MotionReveal className="rounded-3xl bg-(--mainColor) text-(--bgColor) p-8 sm:p-12 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold">
            {t.home.finalCta.headline}
          </h2>
          <p className="mx-auto max-w-lg text-xs sm:text-sm text-(--bgColor)/75">
            {t.home.finalCta.subline}
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-2xl bg-(--secondColor) px-7 py-3 text-sm font-extrabold text-[#3B2418] shadow-md transition hover:opacity-95 active:scale-[0.98]"
            >
              <span>{t.home.finalCta.ctaCafe}</span>
              <ArrowIcon className="h-4 w-4" />
            </Link>
          </div>
        </MotionReveal>
      </section>
    </div>
  );
}
