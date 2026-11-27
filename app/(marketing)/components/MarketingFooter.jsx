"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { BRAND, FOOTER_LINKS } from "../content";
import { MotionReveal } from "./MotionPrimitives";
import { useMarketingLanguage, I18N_CONTENT } from "../i18n";

export default function MarketingFooter() {
  const { language } = useMarketingLanguage();
  const t = I18N_CONTENT[language] || I18N_CONTENT.en;

  const productLinks = [
    { label: t.footer.links.features, href: "/features" },
    { label: t.footer.links.howItWorks, href: "/how-it-works" },
    { label: t.footer.links.pricing, href: "/pricing" },
    { label: t.footer.links.cafeDashboard, href: "/dashboard" },
  ];

  const communityLinks = [
    { label: t.footer.links.about, href: "/about" },
    { label: t.footer.links.applyCafe, href: "/contact" },
    { label: t.footer.links.customerLogin, href: "/login?as=customer" },
  ];

  const legalLinks = [
    { label: t.footer.links.privacy, href: "/privacy" },
    { label: t.footer.links.terms, href: "/terms" },
  ];

  return (
    <footer className="relative mt-20 border-t border-(--mainColor)/15 bg-(--mainColor)/5 text-(--mainColor) transition-colors">
      {/* Visual Perforation Motif (Punch card dotted line) */}
      <div className="absolute top-0 left-0 right-0 -translate-y-1/2 flex justify-between px-6 pointer-events-none select-none overflow-hidden">
        <span className="h-4 w-4 rounded-full bg-(--bgColor) border border-(--mainColor)/15 -ms-2" />
        <div className="flex-1 border-b-2 border-dashed border-(--mainColor)/20 my-auto mx-4" />
        <span className="h-4 w-4 rounded-full bg-(--bgColor) border border-(--mainColor)/15 -me-2" />
      </div>

      <MotionReveal className="mx-auto max-w-7xl px-4 pt-14 pb-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-5 lg:gap-12">
          {/* Brand Info & Mission */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl p-1">
                <Image
                  src="/logo.png"
                  alt={BRAND.name}
                  width={28}
                  height={28}
                  className="object-contain rounded-lg"
                />
              </div>
              <span className="text-lg font-extrabold tracking-tight text-(--mainColor)">
                {BRAND.name}
              </span>
            </Link>

            <p className="max-w-sm text-xs sm:text-sm leading-relaxed text-(--mainColor)/75">
              {t.footer.description}
            </p>

            {FOOTER_LINKS.socials.length > 0 && (
              <div className="flex items-center gap-2.5 pt-2">
                {FOOTER_LINKS.socials.map((soc) => (
                  <a
                    key={soc.name}
                    href={soc.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={soc.name}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-(--mainColor)/15 text-(--mainColor)/75 transition hover:border-(--mainColor) hover:bg-(--mainColor) hover:text-(--bgColor)"
                  >
                    {soc.name}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Column: Product */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-(--mainColor)">
              {t.footer.platformTitle}
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              {productLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-(--mainColor)/70 transition hover:text-(--mainColor) hover:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column: Community & Cafe Owners */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-(--mainColor)">
              {t.footer.communityTitle}
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              {communityLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-(--mainColor)/70 transition hover:text-(--mainColor) hover:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column: Legal & Trust */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-(--mainColor)">
              {t.footer.legalTitle}
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              {legalLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-(--mainColor)/70 transition hover:text-(--mainColor) hover:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-(--mainColor)/10 pt-6 text-xs text-(--mainColor)/60 sm:flex-row">
          <p>
            &copy; {BRAND.copyrightYear} {BRAND.name}. {t.common.allRightsReserved}{" "}
            {t.footer.builtForCafes}
          </p>
        </div>
      </MotionReveal>
    </footer>
  );
}
