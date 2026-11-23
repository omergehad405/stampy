"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LuLock,
  LuSparkles,
  LuArrowUpRight,
  LuArrowLeft,
  LuX,
} from "react-icons/lu";
import { useDashboardStore } from "@/app/stores/useDashboardStore";

export default function PlanLockedFeature({
  featureKey,
  featureName = "This Feature",
  description = "This feature is not included in your current subscription plan. Upgrade your plan to unlock full access.",
  locale = "en",
}) {
  const { cafe, getPlanLimits } = useDashboardStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const limits = getPlanLimits ? getPlanLimits() : null;
  const isArabic = locale === "ar";

  return (
    <div dir={isArabic ? "rtl" : undefined} lang={isArabic ? "ar" : undefined} className="flex flex-col items-center justify-center rounded-3xl border border-(--bgColor)/15 bg-(--mainColor) px-6 py-16 text-center text-(--bgColor) shadow-sm space-y-6 max-w-3xl mx-auto my-8">
      {/* Icon Badge */}
      <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-(--secondColor) text-[#3B2418] shadow-md">
        <LuLock className="h-10 w-10" />
        <span className="absolute -top-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-(--bgColor) text-(--mainColor) shadow-sm">
          <LuSparkles className="h-4 w-4" />
        </span>
      </div>

      {/* Copy */}
      <div className="max-w-md space-y-2.5">
        <span className="inline-block text-[11px] font-bold px-3 py-1 rounded-full bg-(--secondColor) text-[#3B2418] uppercase tracking-wider">
          {isArabic ? "تتطلب هذه الميزة ترقية الباقة" : "Plan Upgrade Required"}
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-(--bgColor)">
          {isArabic ? `${featureName} غير متاحة` : `${featureName} is Locked`}
        </h2>
        <p className="text-xs sm:text-sm text-(--bgColor)/75 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Current Plan Pill */}
      {limits?.planName && (
        <div className="inline-flex items-center gap-2 rounded-xl bg-(--bgColor)/10 px-3.5 py-1.5 text-xs text-(--bgColor)/80 border border-(--bgColor)/15">
          <span>{isArabic ? "الباقة الحالية:" : "Current Active Tier:"}</span>
          <span className="font-bold text-(--secondColor)">{limits.planName}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 rounded-xl border border-(--bgColor)/30 px-4 py-2.5 text-xs font-bold text-(--bgColor) hover:bg-(--bgColor)/10 transition cursor-pointer"
        >
          <LuArrowLeft className="h-4 w-4" />
          <span>{isArabic ? "لوحة التحكم" : "Dashboard Overview"}</span>
        </Link>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-(--secondColor) px-5 py-2.5 text-xs font-bold text-[#3B2418] hover:opacity-95 active:scale-95 transition shadow-xs cursor-pointer"
        >
          <span>{isArabic ? "ترقية الاشتراك" : "Upgrade Subscription"}</span>
          <LuArrowUpRight className="h-4 w-4" />
        </button>
      </div>

      {/* Upgrade Contact Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs text-left">
          <div dir={isArabic ? "rtl" : undefined} lang={isArabic ? "ar" : undefined} className={`w-full max-w-md rounded-3xl border border-(--bgColor)/20 bg-(--mainColor) p-6 text-(--bgColor) shadow-2xl space-y-5 ${isArabic ? "text-right" : ""}`}>
            <div className="flex items-center justify-between border-b border-(--bgColor)/15 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-(--secondColor) text-[#3B2418]">
                  <LuSparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-(--bgColor)">
                    {isArabic ? `تفعيل ${featureName}` : `Unlock ${featureName}`}
                  </h3>
                  <p className="text-xs text-(--bgColor)/70">
                    {isArabic ? "الترقية إلى باقة تشمل هذه الميزة" : "Upgrade to an eligible tier"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-xl text-(--bgColor)/70 hover:bg-(--bgColor)/10 hover:text-(--bgColor)"
              >
                <LuX className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-(--bgColor)/85 leading-relaxed">
              {isArabic
                ? "تواصل مع فريقنا أو مسؤول المنصة لترقية باقة مقهاك وتفعيل هذه الميزة."
                : `This feature is unlocked on higher tier plans. Contact our team or your platform administrator to immediately upgrade your plan for ${cafe.name || "your cafe"}.`}
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-(--bgColor)/15">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl border border-(--bgColor)/20 px-4 py-2 font-bold text-xs text-(--bgColor) hover:bg-(--bgColor)/10"
              >
                {isArabic ? "إغلاق" : "Close"}
              </button>
              <a
                href={isArabic
                  ? `mailto:info@notchloyalty.com?subject=${encodeURIComponent(`ترقية باقة ${cafe.name || "المقهى"}`)}`
                  : `mailto:support@notch.app?subject=Upgrade Plan for ${encodeURIComponent(cafe.name || "Cafe")} to unlock ${encodeURIComponent(featureName)}&body=Hello Notch Team,%0D%0A%0D%0AI would like to upgrade our cafe plan to unlock ${encodeURIComponent(featureName)}.`}
                className="rounded-xl bg-(--secondColor) px-4 py-2 font-bold text-xs text-[#3B2418] hover:opacity-95 transition"
              >
                {isArabic ? "تواصل للترقية" : "Contact to Upgrade"}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
