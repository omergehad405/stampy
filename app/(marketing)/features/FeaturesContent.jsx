"use client";

import React from "react";
import Link from "next/link";
import {
  LuScanLine,
  LuUsers,
  LuGift,
  LuShieldCheck,
  LuCoffee,
  LuQrCode,
  LuSparkles,
  LuArrowRight,
  LuArrowLeft,
  LuLayers,
  LuUtensils,
  LuTrendingUp,
  LuRefreshCw,
  LuSmartphone,
} from "react-icons/lu";
import {
  MotionHeroItem,
  MotionReveal,
  MotionStagger,
  MotionStaggerItem,
} from "../components/MotionPrimitives";
import { useMarketingLanguage, I18N_CONTENT } from "../i18n";

export default function FeaturesContent() {
  const { language } = useMarketingLanguage();
  const t = I18N_CONTENT[language] || I18N_CONTENT.en;
  const isRtl = language === "ar";
  const ArrowIcon = isRtl ? LuArrowLeft : LuArrowRight;

  const cafeIcons = [
    LuGift,
    LuScanLine,
    LuUsers,
    LuSparkles,
    LuShieldCheck,
    LuTrendingUp,
  ];

  const menuIcons = [LuRefreshCw, LuSmartphone, LuLayers];

  return (
    <div className="space-y-24 py-12 sm:py-16">
      {/* Page Header */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <MotionHeroItem delay={0}>
          <span className="inline-block rounded-full bg-(--secondColor)/30 px-3 py-1 text-xs font-bold text-(--mainColor)">
            {t.featuresPage.badge}
          </span>
        </MotionHeroItem>
        <MotionHeroItem delay={0.06}>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-(--mainColor) tracking-tight">
            {t.featuresPage.title}
          </h1>
        </MotionHeroItem>
        <MotionHeroItem delay={0.12}>
          <p className="mx-auto max-w-2xl text-sm sm:text-base leading-relaxed text-(--mainColor)/75">
            {t.featuresPage.subtitle}
          </p>
        </MotionHeroItem>
      </section>

      {/* 1. Cafe Features Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <MotionReveal className="border-b border-(--mainColor)/15 pb-4 mb-8">
          <h2 className="text-xl sm:text-2xl font-extrabold text-(--mainColor)">
            {t.featuresPage.sectionTitle}
          </h2>
          <p className="text-xs sm:text-sm text-(--mainColor)/70">
            {t.featuresPage.sectionSubtitle}
          </p>
        </MotionReveal>

        <MotionStagger className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {t.home.cafeFeatures.items.map((feat, idx) => {
            const Icon = cafeIcons[idx] || LuCoffee;
            return (
              <MotionStaggerItem
                key={feat.title}
                hoverLift
                className="rounded-2xl border border-(--mainColor)/15 bg-(--bgColor) p-6 sm:p-7 shadow-2xs space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-(--secondColor) text-[#3B2418]">
                      <Icon className="h-6 w-6" />
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

      {/* 2. Customer Benefits */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <MotionReveal className="border-b border-(--mainColor)/15 pb-4 mb-8">
          <h2 className="text-xl sm:text-2xl font-extrabold text-(--mainColor)">
            {t.home.customerBenefits.title}
          </h2>
          <p className="text-xs sm:text-sm text-(--mainColor)/70">
            {t.home.customerBenefits.subtitle}
          </p>
        </MotionReveal>

        <MotionStagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {t.home.customerBenefits.items.map((b) => (
            <MotionStaggerItem
              key={b.title}
              hoverLift
              className="rounded-2xl border-2 border-(--mainColor)/15 bg-(--mainColor)/5 p-6 shadow-xs flex flex-col justify-between"
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

      {/* 3. Online Menu & Exposure Highlights */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Menu Box */}
          <MotionReveal className="rounded-3xl border border-(--mainColor)/15 bg-(--mainColor)/5 p-8 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-(--secondColor)">
                {t.home.digitalMenu.tag}
              </span>
              <h3 className="text-2xl font-extrabold text-(--mainColor) mt-1">
                {t.home.digitalMenu.title}
              </h3>
              <p className="text-xs sm:text-sm text-(--mainColor)/75 mt-2">
                {t.home.digitalMenu.subtitle}
              </p>
            </div>

            <MotionStagger className="space-y-4">
              {t.home.digitalMenu.items.map((item, idx) => {
                const Icon = menuIcons[idx] || LuUtensils;
                return (
                  <MotionStaggerItem
                    key={item.title}
                    className="flex items-start gap-3 rounded-xl border border-(--mainColor)/10 bg-(--bgColor) p-4"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-(--secondColor) text-[#3B2418]">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-(--mainColor)">
                        {item.title}
                      </h4>
                      <p className="text-xs text-(--mainColor)/70 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </MotionStaggerItem>
                );
              })}
            </MotionStagger>
          </MotionReveal>

          {/* Exposure Box */}
          <MotionReveal delay={0.08} className="rounded-3xl border border-(--mainColor)/15 bg-(--bgColor) p-8 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-(--secondColor)">
                {t.home.exposure.tag}
              </span>
              <h3 className="text-2xl font-extrabold text-(--mainColor) mt-1">
                {t.home.exposure.title}
              </h3>
              <p className="text-xs sm:text-sm text-(--mainColor)/75 mt-2">
                {t.home.exposure.subtitle}
              </p>
            </div>

            <MotionStagger className="space-y-4">
              {t.home.exposure.items.map((pt) => (
                <MotionStaggerItem
                  key={pt.title}
                  className="rounded-xl border border-(--mainColor)/15 bg-(--mainColor)/5 p-4 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-(--mainColor)">
                      {pt.title}
                    </h4>
                    <span className="rounded-full bg-(--secondColor) px-2 py-0.5 text-[9px] font-bold text-[#3B2418]">
                      {pt.badge}
                    </span>
                  </div>
                  <p className="text-xs text-(--mainColor)/75">
                    {pt.description}
                  </p>
                </MotionStaggerItem>
              ))}
            </MotionStagger>
          </MotionReveal>
        </div>
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
