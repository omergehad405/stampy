"use client";

import React from "react";
import Link from "next/link";
import {
  MotionHeroItem,
  MotionStagger,
  MotionStaggerItem,
} from "../components/MotionPrimitives";
import { useMarketingLanguage, I18N_CONTENT } from "../i18n";

export default function TermsPageContent() {
  const { language } = useMarketingLanguage();
  const t = I18N_CONTENT[language] || I18N_CONTENT.en;
  const p = t.termsPage;

  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
        <MotionHeroItem delay={0}>
          <div className="border-b border-(--mainColor)/15 pb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-(--secondColor)">
              {p.badge}
            </span>
            <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-(--mainColor)">
              {p.title}
            </h1>
            <p className="mt-2 text-xs text-(--mainColor)/60">
              {p.lastUpdated}
            </p>
          </div>
        </MotionHeroItem>

        <MotionStagger className="space-y-6 text-xs sm:text-sm leading-relaxed text-(--mainColor)/80">
          <MotionStaggerItem className="space-y-2">
            <h2 className="text-base font-bold text-(--mainColor)">{p.s1Title}</h2>
            <p>{p.s1Text}</p>
          </MotionStaggerItem>

          <MotionStaggerItem className="space-y-2">
            <h2 className="text-base font-bold text-(--mainColor)">{p.s2Title}</h2>
            <p>{p.s2Text}</p>
          </MotionStaggerItem>

          <MotionStaggerItem className="space-y-2">
            <h2 className="text-base font-bold text-(--mainColor)">{p.s3Title}</h2>
            <p>{p.s3Text}</p>
          </MotionStaggerItem>

          <MotionStaggerItem className="space-y-2">
            <h2 className="text-base font-bold text-(--mainColor)">{p.s4Title}</h2>
            <p>
              {p.s4Text}{" "}
              <Link href="/contact" className="underline font-bold text-(--mainColor)">
                {language === "ar" ? "صفحة التواصل" : "Contact page"}
              </Link>
              .
            </p>
          </MotionStaggerItem>
        </MotionStagger>
      </div>
    </div>
  );
}
