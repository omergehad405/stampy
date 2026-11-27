"use client";

import React from "react";
import Link from "next/link";
import { MotionHeroItem } from "../components/MotionPrimitives";
import { useMarketingLanguage, I18N_CONTENT } from "../i18n";

export default function AboutPageContent() {
  const { language } = useMarketingLanguage();
  const t = I18N_CONTENT[language] || I18N_CONTENT.en;

  return (
    <article className="py-12 sm:py-16">
      <div className="mx-auto max-w-3xl space-y-6 px-4 sm:px-6 lg:px-8">
        <MotionHeroItem delay={0}>
          <p className="text-xs font-bold uppercase tracking-wider text-(--secondColor)">
            {t.aboutPage.badge}
          </p>
        </MotionHeroItem>
        <MotionHeroItem delay={0.05}>
          <h1 className="text-3xl font-extrabold tracking-tight text-(--mainColor) sm:text-4xl">
            {t.aboutPage.title}
          </h1>
        </MotionHeroItem>
        <MotionHeroItem delay={0.1}>
          <p className="text-base leading-relaxed text-(--mainColor)/80">
            {t.aboutPage.p1}
          </p>
        </MotionHeroItem>
        <MotionHeroItem delay={0.15}>
          <p className="text-sm leading-relaxed text-(--mainColor)/75">
            {t.aboutPage.p2}
          </p>
        </MotionHeroItem>
        <MotionHeroItem delay={0.2}>
          <p className="text-sm leading-relaxed text-(--mainColor)/75">
            {t.aboutPage.p3}{" "}
            <Link
              href="/contact"
              className="font-bold text-(--mainColor) underline"
            >
              {t.aboutPage.contactLink}
            </Link>
            .
          </p>
        </MotionHeroItem>
      </div>
    </article>
  );
}
