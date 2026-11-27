"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { LuCheck, LuX, LuSparkles, LuArrowRight, LuArrowLeft } from "react-icons/lu";
import { API_BASE } from "@/app/lib/apiClient";
import {
  MotionReveal,
  MotionStagger,
  MotionStaggerItem,
} from "../components/MotionPrimitives";
import { useMarketingLanguage, I18N_CONTENT } from "../i18n";

let memoryCachedPlans = null;

function hasFeature(plan, keyword) {
  if (!Array.isArray(plan.features)) return false;
  return plan.features.some((f) =>
    String(f).toLowerCase().includes(keyword.toLowerCase())
  );
}

function PricingSkeleton({ showComparison = false }) {
  return (
    <>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 items-stretch">
        {[1, 2, 3].map((idx) => (
          <div
            key={idx}
            className={`relative flex flex-col justify-between rounded-3xl p-6 sm:p-8 animate-pulse ${
              idx === 2
                ? "border-2 border-(--mainColor)/20 bg-(--mainColor)/5 lg:-translate-y-2 shadow-sm"
                : "border border-(--mainColor)/10 bg-(--bgColor)"
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="h-6 w-28 rounded-lg bg-(--mainColor)/15" />
                {idx === 2 && (
                  <div className="h-5 w-24 rounded-full bg-(--secondColor)/30" />
                )}
              </div>
              <div className="mt-3 space-y-1.5 min-h-[40px]">
                <div className="h-3.5 w-full rounded bg-(--mainColor)/10" />
                <div className="h-3.5 w-4/5 rounded bg-(--mainColor)/10" />
              </div>
              <div className="mt-6 flex items-baseline gap-2 border-b border-(--mainColor)/10 pb-6">
                <div className="h-10 w-32 rounded-lg bg-(--mainColor)/15" />
                <div className="h-4 w-12 rounded bg-(--mainColor)/10" />
              </div>
            </div>
            <div className="mt-8 pt-4">
              <div className="h-12 w-full rounded-xl bg-(--mainColor)/15" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export function DetailedTierComparisonTable({ plans, t, isRtl }) {
  const comparisonRows = [
    {
      feature: t.pricingPage.table?.visitsCol || "Monthly Visit Scans",
      getValue: (p) =>
        p.isUnlimitedCustomers || p.maxCustomers >= 1000
          ? t.pricingPage.table?.unlimited || "Unlimited"
          : `${p.maxCustomers || 50} ${isRtl ? "زيارة" : "visits"}`,
    },
    {
      feature: t.pricingPage.table?.rewardsCol || "Active Reward Items",
      getValue: (p) =>
        p.isUnlimitedRewards || p.maxRewards >= 50
          ? t.pricingPage.table?.unlimited || "Unlimited"
          : `${p.maxRewards || 2} ${isRtl ? "مكافآت" : "rewards"}`,
    },
    {
      feature: t.pricingPage.table?.staffCol || "Barista Staff Accounts",
      getValue: (p) =>
        p.maxStaff >= 20
          ? t.pricingPage.table?.unlimited || "Unlimited"
          : `${p.maxStaff || 1} ${isRtl ? "باريستا" : "staff"}`,
    },
    {
      feature: t.pricingPage.table?.trialCol || "Free Trial",
      getValue: (p) =>
        p.price === 0
          ? t.pricingPage.table?.trialValue || "7 days free trial"
          : t.pricingPage.table?.notIncluded || "—",
    },
    {
      feature: isRtl ? "حماية الزيارة الواحدة باليوم" : "1-Visit-per-Day Fraud Shield",
      getValue: () => true,
    },
    {
      feature: t.pricingPage.table?.analyticsCol || "Visit Activity Log",
      getValue: () => true,
    },
    {
      feature: t.pricingPage.table?.exposureCol || "Discover Exposure",
      getValue: (p) => {
        if (p.price === 0) return false;
        return p.isPopular
          ? isRtl ? "ظهور مميز" : "Featured"
          : isRtl ? "مشمول" : "Included";
      },
    },
    {
      feature: t.pricingPage.table?.menuCol || "Online Digital Menu",
      getValue: (p) => (p.price > 0 ? (isRtl ? "مشمول" : "Included") : false),
    },
  ];

  return (
    <MotionReveal className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-16 sm:mt-24">
      <div className="rounded-3xl border border-(--mainColor)/15 bg-(--mainColor)/5 p-6 sm:p-10">
        <h2 className="text-xl sm:text-2xl font-extrabold text-(--mainColor) text-center mb-8">
          {t.pricingPage.compareTitle || "Detailed Plan Comparison"}
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-(--mainColor)/15 text-(--mainColor)/60 font-bold uppercase">
                <th className="py-3.5 px-3 text-start min-w-[180px]">
                  {t.pricingPage.table?.featureCol || "Feature"}
                </th>
                {plans.map((plan) => (
                  <th
                    key={plan.id || plan.name}
                    className={`py-3.5 px-3 text-center min-w-[120px] ${
                      plan.isPopular
                        ? "bg-(--mainColor)/10 rounded-t-xl text-(--mainColor)"
                        : ""
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <span className="font-extrabold text-sm sm:text-base text-(--mainColor)">
                        {plan.name}
                      </span>
                      <span className="text-[11px] font-bold normal-case text-(--mainColor)/65 mt-0.5">
                        {plan.price === 0
                          ? t.pricingPage.freeForever || "Free"
                          : `${plan.price} ${t.pricingPage.currency || "EGP"}${t.pricingPage.month || "/mo"}`}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-(--mainColor)/10">
              {comparisonRows.map((row) => (
                <tr key={row.feature} className="hover:bg-(--mainColor)/5 transition-colors">
                  <td className="py-3.5 px-3 font-medium text-(--mainColor)">
                    {row.feature}
                  </td>
                  {plans.map((plan) => {
                    const val = row.getValue(plan);
                    return (
                      <td
                        key={plan.id || plan.name}
                        className={`py-3.5 px-3 text-center ${
                          plan.isPopular
                            ? "bg-(--mainColor)/10 font-bold text-(--mainColor)"
                            : "text-(--mainColor)/80"
                        }`}
                      >
                        {typeof val === "boolean" ? (
                          val ? (
                            <LuCheck className="mx-auto h-4 w-4 text-emerald-600" />
                          ) : (
                            <LuX className="mx-auto h-4 w-4 text-rose-400" />
                          )
                        ) : (
                          <span>{val}</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MotionReveal>
  );
}

export default function PricingPlansList({
  isPreview = false,
  maxFeatures = 5,
  showComparison = false,
}) {
  const { language } = useMarketingLanguage();
  const t = I18N_CONTENT[language] || I18N_CONTENT.en;
  const isRtl = language === "ar";
  const ArrowIcon = isRtl ? LuArrowLeft : LuArrowRight;

  const [rawPlans, setRawPlans] = useState(() => memoryCachedPlans || []);
  const [isLoading, setIsLoading] = useState(() => !memoryCachedPlans);

  useEffect(() => {
    let isCancelled = false;
    async function loadLivePlans() {
      try {
        const res = await fetch(`${API_BASE}/api/plans`);
        if (!res.ok) {
          setIsLoading(false);
          return;
        }
        const json = await res.json();
        if (
          !isCancelled &&
          json.success &&
          Array.isArray(json.data?.plans) &&
          json.data.plans.length > 0
        ) {
          memoryCachedPlans = json.data.plans;
          setRawPlans(json.data.plans);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      } catch (err) {
        setIsLoading(false);
      }
    }

    if (!memoryCachedPlans) {
      loadLivePlans();
    }
  }, []);

  if (isLoading || rawPlans.length === 0) {
    return <PricingSkeleton showComparison={showComparison} />;
  }

  // Format plans localized dynamically based on active language
  const plans = rawPlans.map((p) => {
    const isFree = p.price === 0;
    const isGrowth = p.isPopular || p.name?.toLowerCase().includes("growth");

    let localizedFeatures = [];
    if (isFree) {
      localizedFeatures = [
        isRtl ? "7 أيام تجربة مجانية بدون بطاقة ائتمانية" : "7-day free trial (no card required)",
        isRtl ? "حد 50 زائر مسجل شهرياً" : "Up to 50 active regular customers",
        isRtl ? "مسح الزيارات في ثانية عبر المتصفح" : "1-second web barista scanner",
        isRtl ? "مكافأة واحدة نشطة للزبائن" : "1 active reward offering",
        isRtl ? "حماية الزيارة الواحدة باليوم" : "1-visit-per-day fraud protection",
      ];
    } else if (isGrowth) {
      localizedFeatures = [
        isRtl ? "حتى 500 زائر دائم مسجل" : "Up to 500 active regular customers",
        isRtl ? "ظهور مميز في صفحة الاستكشاف" : "Featured cafe placement in Discover",
        isRtl ? "3 عروض مكافآت نشطة" : "3 active reward offerings",
        isRtl ? "حسابات باريستا غير محدودة" : "Multi-staff barista accounts",
        isRtl ? "سجل زيارات كامل ومباشر" : "Live visit activity & history log",
      ];
    } else {
      localizedFeatures = [
        isRtl ? "زبائن دائمين غير محدودين" : "Unlimited active regular customers",
        isRtl ? "أولوية قصوى في الاستكشاف" : "Priority placement in Discover",
        isRtl ? "عروض مكافآت غير محدودة" : "Unlimited active reward items",
        isRtl ? "دعم وتنسيق مباشر مخصص" : "Dedicated setup and support",
        isRtl ? "عرض المنيو الرقمي (قريباً)" : "Digital online menu showcase",
      ];
    }

    return {
      id: p.id || p._id || p.name,
      name: p.name,
      description: isFree
        ? isRtl
          ? "الخطة المثالية لتجربة نوتش مجاناً لمدة 7 أيام بدون بطاقة ائتمانية."
          : "The ideal plan to try Notch with a 7-day free trial, no credit card required."
        : p.description || (isGrowth ? (isRtl ? "الخطة الأكثر طلباً للكافيهات سريعة النمو." : "Most popular for growing cafes.") : ""),
      price: p.price ?? 0,
      currency: t.pricingPage.currency || "EGP",
      billingPeriod: t.pricingPage.month || "/mo",
      isPopular: Boolean(p.isPopular),
      features: localizedFeatures,
      cta: isFree
        ? t.pricingPage.ctaFree || "Start Free Today"
        : t.pricingPage.ctaPaid || "Apply for this Plan",
      ctaHref: `/contact?plan=${encodeURIComponent(p.name)}`,
      badge: isFree
        ? t.pricingPage.freeTrialNotice || "7-day free trial"
        : p.isPopular
        ? t.pricingPage.mostPopular || "Most Popular"
        : null,
    };
  });

  return (
    <>
      <MotionStagger className="grid grid-cols-1 gap-8 lg:grid-cols-3 items-stretch">
        {plans.map((plan) => {
          const displayedFeatures =
            isPreview && maxFeatures
              ? plan.features.slice(0, maxFeatures)
              : plan.features;

          return (
            <MotionStaggerItem
              key={plan.id}
              hoverLift
              className={`relative flex flex-col justify-between rounded-3xl p-6 sm:p-8 transition-shadow ${
                plan.isPopular
                  ? "border-2 border-(--mainColor) bg-(--mainColor)/10 shadow-xl lg:-translate-y-2"
                  : "border border-(--mainColor)/15 bg-(--bgColor) shadow-2xs"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-(--secondColor) px-3.5 py-1 text-[11px] font-black uppercase tracking-wider text-[#3B2418] shadow-xs flex items-center gap-1">
                  <LuSparkles className="h-3 w-3" />
                  <span>{plan.badge}</span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-extrabold text-(--mainColor)">
                    {plan.name}
                  </h2>
                </div>

                <p className="mt-1.5 text-xs text-(--mainColor)/70 leading-relaxed min-h-[40px]">
                  {plan.description}
                </p>

                <div className="mt-6 flex items-baseline gap-1.5 border-b border-(--mainColor)/10 pb-6">
                  <span className="text-4xl sm:text-5xl font-extrabold text-(--mainColor)">
                    {plan.price === 0 ? (t.pricingPage.freeForever || "Free") : plan.price}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-xs font-bold text-(--mainColor)/60">
                      {plan.currency} {plan.billingPeriod}
                    </span>
                  )}
                </div>

                <div className="mt-6 space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-(--mainColor)/60">
                    {isRtl ? "المميزات المشمولة" : "Included Capabilities"}
                  </p>
                  <ul className="space-y-2.5 text-xs sm:text-sm">
                    {displayedFeatures.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5 text-(--mainColor)/80">
                        <LuCheck className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-4">
                <Link
                  href={plan.ctaHref}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-xs sm:text-sm font-bold shadow-xs transition active:scale-[0.98] ${
                    plan.isPopular
                      ? "bg-(--secondColor) text-[#271307] font-extrabold hover:opacity-95"
                      : "border-2 border-(--mainColor) bg-transparent text-(--mainColor) hover:bg-(--mainColor) hover:text-(--bgColor)"
                  }`}
                >
                  <span>{plan.cta}</span>
                  <ArrowIcon className="h-4 w-4 ms-0.5" />
                </Link>
              </div>
            </MotionStaggerItem>
          );
        })}
      </MotionStagger>

      {showComparison && (
        <DetailedTierComparisonTable plans={plans} t={t} isRtl={isRtl} />
      )}
    </>
  );
}
