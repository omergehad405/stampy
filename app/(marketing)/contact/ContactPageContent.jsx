"use client";

import React from "react";
import { LuMail } from "react-icons/lu";
import { CONTACT_PAGE_CONTENT } from "../content";
import ContactForm from "./ContactForm";
import {
  MotionHeroItem,
  MotionStagger,
  MotionStaggerItem,
} from "../components/MotionPrimitives";
import { useMarketingLanguage, I18N_CONTENT } from "../i18n";

export default function ContactPageContent() {
  const { language } = useMarketingLanguage();
  const t = I18N_CONTENT[language] || I18N_CONTENT.en;

  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Information & Partnership Column */}
          <div className="lg:col-span-5 space-y-6">
            <MotionHeroItem delay={0}>
              <span className="inline-block rounded-full bg-(--secondColor)/30 px-3 py-1 text-xs font-bold text-(--mainColor)">
                {t.contactPage.tag}
              </span>
            </MotionHeroItem>
            <MotionHeroItem delay={0.06}>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-(--mainColor) tracking-tight">
                {t.contactPage.title}
              </h1>
            </MotionHeroItem>
            <MotionHeroItem delay={0.12}>
              <p className="text-sm sm:text-base leading-relaxed text-(--mainColor)/75">
                {t.contactPage.subtitle}
              </p>
            </MotionHeroItem>

            <MotionHeroItem delay={0.18}>
              <div className="rounded-2xl border border-(--mainColor)/15 bg-(--mainColor)/5 p-6 space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-(--mainColor)">
                  {t.contactPage.stepsTitle}
                </h2>
                <MotionStagger className="space-y-3 text-xs sm:text-sm text-(--mainColor)/80">
                  {[t.contactPage.step1, t.contactPage.step2, t.contactPage.step3].map((step, i) => (
                    <MotionStaggerItem key={i} className="flex items-start gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-(--secondColor) text-[#3B2418] font-bold text-xs">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </MotionStaggerItem>
                  ))}
                </MotionStagger>

                <div className="pt-3 border-t border-(--mainColor)/10 text-xs text-(--mainColor)/70 flex items-center gap-1.5">
                  <LuMail className="h-4 w-4 text-(--mainColor)/60 shrink-0" />
                  <span>{t.contactPage.directInquiries}</span>
                  <a
                    href={`mailto:${CONTACT_PAGE_CONTENT.contactEmail}`}
                    className="font-bold text-(--mainColor) underline"
                  >
                    {CONTACT_PAGE_CONTENT.contactEmail}
                  </a>
                </div>
              </div>
            </MotionHeroItem>
          </div>

          {/* Form Column */}
          <MotionHeroItem delay={0.1} className="lg:col-span-7">
            <ContactForm />
          </MotionHeroItem>
        </div>
      </div>
    </div>
  );
}
