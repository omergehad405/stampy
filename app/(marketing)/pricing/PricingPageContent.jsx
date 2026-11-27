"use client";

import React from "react";
import FaqAccordion from "../components/FaqAccordion";
import PricingPlansList from "./PricingPlansList";
import { MotionHeroItem, MotionReveal } from "../components/MotionPrimitives";
import { useMarketingLanguage, I18N_CONTENT } from "../i18n";

export default function PricingPageContent() {
  const { language } = useMarketingLanguage();
  const t = I18N_CONTENT[language] || I18N_CONTENT.en;

  return (
    <div className="space-y-24 py-12 sm:py-16">
      {/* Header */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <MotionHeroItem delay={0}>
          <span className="inline-block rounded-full bg-(--secondColor)/30 px-3 py-1 text-xs font-bold text-(--mainColor)">
            {t.pricingPage.badge}
          </span>
        </MotionHeroItem>
        <MotionHeroItem delay={0.06}>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-(--mainColor) tracking-tight">
            {t.pricingPage.title}
          </h1>
        </MotionHeroItem>
        <MotionHeroItem delay={0.12}>
          <p className="mx-auto max-w-2xl text-sm sm:text-base leading-relaxed text-(--mainColor)/75">
            {t.pricingPage.subtitle}
          </p>
        </MotionHeroItem>
        <MotionHeroItem delay={0.16}>
          <p className="text-xs sm:text-sm font-semibold text-(--secondColor)">
            {t.pricingPage.trialNote}
          </p>
        </MotionHeroItem>
      </section>

      {/* Plan Cards & Detailed Tier Comparison Table */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PricingPlansList showComparison={true} />
      </section>

      {/* FAQ on pricing */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <MotionReveal className="mx-auto max-w-2xl text-center space-y-3 mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-(--mainColor)">
            {t.pricingPage.faqTitle}
          </h2>
          <p className="text-sm text-(--mainColor)/75">
            {t.pricingPage.faqSubtitle}
          </p>
        </MotionReveal>

        <MotionReveal delay={0.08}>
          <FaqAccordion />
        </MotionReveal>
      </section>
    </div>
  );
}
