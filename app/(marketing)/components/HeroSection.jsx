"use client";

import React from "react";
import Link from "next/link";
import {
  LuSparkles,
  LuArrowRight,
  LuArrowLeft,
  LuCompass,
  LuSmartphone,
  LuClock,
  LuShieldCheck,
  LuStar,
} from "react-icons/lu";
import HeroPhoneMockup from "./HeroPhoneMockup";
import { MotionHeroItem } from "./MotionPrimitives";
import { useMarketingLanguage, I18N_CONTENT } from "../i18n";

export default function HeroSection({
  trustedCafesCount = "20+",
  socialProofAvatars = [
    { name: "Cairo Roastery", initial: "CR", color: "bg-amber-800 text-amber-100" },
    { name: "Espresso Lab", initial: "EL", color: "bg-stone-800 text-stone-100" },
    { name: "Al-Moez Coffee", initial: "MC", color: "bg-amber-900 text-amber-100" },
    { name: "Alex Beans", initial: "AB", color: "bg-yellow-900 text-yellow-100" },
  ],
}) {
  const { language } = useMarketingLanguage();
  const t = I18N_CONTENT[language] || I18N_CONTENT.en;
  const isRtl = language === "ar";
  const ArrowIcon = isRtl ? LuArrowLeft : LuArrowRight;

  const trustIcons = {
    app: LuSmartphone,
    setup: LuClock,
    free: LuShieldCheck,
  };

  return (
    <section
      aria-labelledby="hero-heading"
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-2 pb-12 sm:pt-6 sm:pb-16"
    >
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-8">
        {/* Left Side: Copy & Calls to Action */}
        <div className="text-center lg:col-span-7 lg:text-start space-y-6">
          {/* 1. Badge & Social Proof Pill */}
          <MotionHeroItem delay={0}>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
              {/* Primary Egypt Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-(--mainColor)/15 bg-(--secondColor)/20 px-3.5 py-1.5 text-xs font-bold text-(--mainColor) shadow-2xs">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-(--secondColor) text-[#271307]">
                  <LuSparkles className="h-3 w-3" />
                </span>
                <span>{t.hero.badge}</span>
              </div>

              {/* Social Proof Pill (Prop-driven count) */}
              <div className="inline-flex items-center gap-1.5 rounded-full border border-(--mainColor)/15 bg-(--mainColor)/5 px-3 py-1.5 text-xs font-bold text-(--mainColor)">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{t.hero.trusted.replace("{count}", trustedCafesCount)}</span>
              </div>
            </div>
          </MotionHeroItem>

          {/* 2. Headline */}
          <MotionHeroItem delay={0.06}>
            <h1
              id="hero-heading"
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-(--mainColor) leading-[1.12] [text-wrap:balance]"
            >
              <span>{t.hero.headlinePrefix} </span>
              <span className="relative inline-block border-b-4 border-(--secondColor) pb-0.5 text-(--mainColor)">
                {t.hero.headlineHighlight}
              </span>
            </h1>
          </MotionHeroItem>

          {/* 3. Shortened 2-line benefit paragraph */}
          <MotionHeroItem delay={0.12}>
            <p className="mx-auto max-w-xl text-base sm:text-lg font-medium leading-relaxed text-(--mainColor)/85 lg:mx-0 [text-wrap:pretty]">
              {t.hero.subline}
            </p>
          </MotionHeroItem>

          {/* 4. Action CTAs */}
          <MotionHeroItem delay={0.18}>
            <div className="flex flex-col items-center justify-center gap-3 pt-1 sm:flex-row lg:justify-start">
            {/* Primary CTA (Start for free, filled with accent color) */}
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-(--secondColor) px-7 py-3.5 text-base font-black text-[#271307] shadow-sm transition duration-200 hover:opacity-95 hover:shadow-md active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--secondColor)"
            >
              <span>{t.hero.ctaPrimary}</span>
              <ArrowIcon className="h-4.5 w-4.5 ms-1" />
            </Link>

            {/* Secondary CTA (Customers, outline/ghost button) */}
            <Link
              href="/login?as=customer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-(--mainColor) bg-transparent px-6 py-3.5 text-base font-bold text-(--mainColor) transition duration-200 hover:bg-(--mainColor) hover:text-(--bgColor) active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--mainColor)"
            >
              <LuCompass className="h-5 w-5" />
              <span>{t.hero.ctaSecondary}</span>
            </Link>
            </div>
          </MotionHeroItem>

          {/* 5. Trust Line & 6. Social Proof Row */}
          <MotionHeroItem delay={0.24}>
            <div className="pt-2 space-y-4">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2 text-xs sm:text-sm font-bold text-(--mainColor)/90">
                {t.hero.trustItems.map((item) => {
                  const Icon = trustIcons[item.id] || LuShieldCheck;
                  return (
                    <div key={item.id} className="flex items-center gap-1.5">
                      <Icon className="h-4 w-4 text-(--secondColor) shrink-0" />
                      <span>{item.label}</span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-(--mainColor)/10 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                {/* Avatar Group */}
                <div className="flex -space-x-2 rtl:space-x-reverse overflow-hidden">
                  {socialProofAvatars.map((av) => (
                    <div
                      key={av.name}
                      title={av.name}
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-(--bgColor) ${av.color} text-[11px] font-black shadow-2xs`}
                    >
                      {av.initial}
                    </div>
                  ))}
                </div>

                {/* Star Rating & Endorsement */}
                <div className="flex flex-col items-center lg:items-start text-xs text-start">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <LuStar key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                    <span className="ms-1 font-black text-(--mainColor)">
                      {t.hero.socialProof.rating}
                    </span>
                  </div>
                  <span className="font-bold text-(--mainColor)/80">
                    {t.hero.socialProof.text}
                  </span>
                </div>
              </div>
            </div>
          </MotionHeroItem>
        </div>

        {/* Right Side: Phone Mockup */}
        <MotionHeroItem delay={0.14} className="lg:col-span-5 flex justify-center pt-4 lg:pt-0">
          <HeroPhoneMockup />
        </MotionHeroItem>
      </div>
    </section>
  );
}
