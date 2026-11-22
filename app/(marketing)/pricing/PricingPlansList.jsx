"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { LuCheck, LuX, LuSparkles, LuArrowRight } from "react-icons/lu";
import { DEFAULT_PLANS } from "../content";
import { API_BASE } from "@/app/lib/apiClient";

const FEATURE_LABELS = {
  digital_menu: "Digital online menu showcase",
  activity_history: "Live visit activity log",
  multi_staff: "Multi-staff barista accounts",
  promotional_campaigns: "Free exposure on Discover (Featured Cafe)",
  unlimited_customers: "Unlimited regular customers",
  unlimited_rewards: "Unlimited reward offerings",
};

function formatFeature(feat) {
  if (FEATURE_LABELS[feat]) return FEATURE_LABELS[feat];
  return feat;
}

function hasFeature(plan, keyword) {
  if (!Array.isArray(plan.features)) return false;
  return plan.features.some((f) =>
    f.toLowerCase().includes(keyword.toLowerCase())
  );
}

export function DetailedTierComparisonTable({ plans }) {
  const comparisonRows = [
    {
      feature: "Monthly Price",
      getValue: (p) =>
        p.price === 0 ? "Free" : `${p.price} ${p.currency || "EGP"}`,
    },
    {
      feature: "Included Active Customers",
      getValue: (p) =>
        p.isUnlimitedCustomers || p.maxCustomers >= 1000
          ? "Unlimited"
          : `${p.maxCustomers}`,
    },
    {
      feature: "Barista & Staff Workstations",
      getValue: (p) => (p.maxStaff >= 20 ? "Unlimited" : `${p.maxStaff}`),
    },
    {
      feature: "Active Reward Offerings",
      getValue: (p) =>
        p.isUnlimitedRewards || p.maxRewards >= 50
          ? "Unlimited"
          : `${p.maxRewards} tiers`,
    },
    {
      feature: "Repeat-Customer Rewards (Digital Stamps)",
      getValue: () => true,
    },
    {
      feature: "Web-Based Barista Scanner Terminal",
      getValue: () => true,
    },
    {
      feature: "Anti-Fraud 1-Visit-per-Day Protection",
      getValue: () => true,
    },
    {
      feature: "Live Visit Activity Log",
      getValue: (p) => hasFeature(p, "activity") || true,
    },
    {
      feature: "Searchable Customer Directory",
      getValue: (p) => p.maxCustomers > 50 || p.isUnlimitedCustomers,
    },
    {
      feature: "Free Exposure on Discover (New Customers)",
      getValue: (p) => {
        const hasExposure =
          hasFeature(p, "promotional") ||
          hasFeature(p, "discover") ||
          hasFeature(p, "exposure");
        if (!hasExposure && p.price === 0) return false;
        return p.isPopular ? "Featured" : p.price > 500 ? "Priority Placement" : "Included";
      },
    },
    {
      feature: "Digital Online Menu",
      getValue: (p) => {
        const hasMenu = hasFeature(p, "menu") || p.price > 500;
        return hasMenu ? "Included (Coming soon)" : false;
      },
    },
    {
      feature: "Advanced Retention Analytics",
      getValue: (p) => {
        const hasAnalytics = hasFeature(p, "analytics") || p.price > 500;
        return hasAnalytics ? "Included (Coming soon)" : false;
      },
    },
    {
      feature: "Support Channel",
      getValue: (p) =>
        p.price === 0
          ? "Standard Email"
          : p.isPopular
          ? "Priority WhatsApp"
          : "Dedicated Manager",
    },
  ];

  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-16 sm:mt-24">
      <div className="rounded-3xl border border-(--mainColor)/15 bg-(--mainColor)/5 p-6 sm:p-10">
        <h2 className="text-xl sm:text-2xl font-extrabold text-(--mainColor) text-center mb-8">
          Detailed Tier Comparison
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-(--mainColor)/15 text-(--mainColor)/60 font-bold uppercase">
                <th className="py-3.5 px-3 text-start min-w-[180px]">Feature</th>
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
                          ? "Free"
                          : `${plan.price} ${plan.currency || "EGP"}/${plan.billingPeriod || "mo"}`}
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
    </section>
  );
}

export default function PricingPlansList({
  isPreview = false,
  maxFeatures = 5,
  showComparison = false,
}) {
  const [plans, setPlans] = useState(DEFAULT_PLANS);
  const [isLiveLoaded, setIsLiveLoaded] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    async function loadLivePlans() {
      try {
        const res = await fetch(`${API_BASE}/api/plans`);
        if (!res.ok) return;
        const json = await res.json();
        if (
          !isCancelled &&
          json.success &&
          Array.isArray(json.data?.plans) &&
          json.data.plans.length > 0
        ) {
          const liveList = json.data.plans.map((p) => {
            const matchingDefault = DEFAULT_PLANS.find(
              (dp) => dp.name.toLowerCase() === p.name.toLowerCase()
            );

            // Format features
            let featuresList = [];
            if (Array.isArray(p.features) && p.features.length > 0) {
              featuresList = p.features.map(formatFeature);
            } else if (matchingDefault) {
              featuresList = matchingDefault.features;
            }

            return {
              id: p.id || p._id,
              name: p.name,
              description: p.description || matchingDefault?.description || "",
              price: p.price ?? matchingDefault?.price ?? 0,
              currency: p.currency || matchingDefault?.currency || "EGP",
              billingPeriod:
                p.billingPeriod || matchingDefault?.billingPeriod || "month",
              isPopular: Boolean(p.isPopular),
              maxCustomers: p.maxCustomers,
              maxStaff: p.maxStaff,
              maxRewards: p.maxRewards,
              isUnlimitedCustomers: p.isUnlimitedCustomers,
              isUnlimitedRewards: p.isUnlimitedRewards,
              features: featuresList,
              cta:
                matchingDefault?.cta ||
                (p.price === 0
                  ? "Start Free"
                  : p.isPopular
                  ? "Apply for Growth"
                  : "Talk to Our Team"),
              ctaHref:
                matchingDefault?.ctaHref ||
                `/contact?plan=${encodeURIComponent(p.name)}`,
            };
          });

          setPlans(liveList);
          setIsLiveLoaded(true);
        }
      } catch (err) {
        console.warn("[PricingPlansList] Error fetching live /api/plans:", err.message);
      }
    }

    loadLivePlans();

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <>
      {/* 3 Tier Cards */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 items-stretch">
        {plans.map((plan) => {
          const displayedFeatures =
            isPreview && maxFeatures
              ? plan.features.slice(0, maxFeatures)
              : plan.features;

          return (
            <div
              key={plan.id}
              className={`relative flex flex-col justify-between rounded-3xl p-6 sm:p-8 transition-all ${
                plan.isPopular
                  ? "border-2 border-(--mainColor) bg-(--mainColor)/10 shadow-xl lg:-translate-y-2"
                  : "border border-(--mainColor)/15 bg-(--bgColor) shadow-2xs"
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-(--secondColor) px-3.5 py-1 text-[11px] font-black uppercase tracking-wider text-[#3B2418] shadow-xs flex items-center gap-1">
                  <LuSparkles className="h-3 w-3" />
                  <span>Most Popular Tier</span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-extrabold text-(--mainColor)">
                    {plan.name}
                  </h2>
                  {isLiveLoaded && (
                    <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full">
                      Live
                    </span>
                  )}
                </div>

                <p className="mt-1.5 text-xs text-(--mainColor)/70 leading-relaxed min-h-[40px]">
                  {plan.description}
                </p>

                <div className="mt-6 flex items-baseline gap-1.5 border-b border-(--mainColor)/10 pb-6">
                  <span className="text-4xl sm:text-5xl font-extrabold text-(--mainColor)">
                    {plan.price} {plan.currency || "EGP"}
                  </span>
                  <span className="text-xs font-bold text-(--mainColor)/60">
                    /{plan.billingPeriod}
                  </span>
                </div>

                <div className="mt-6 space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-(--mainColor)/60">
                    Included Capabilities
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
                  href={plan.ctaHref || `/contact?plan=${encodeURIComponent(plan.name)}`}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-xs sm:text-sm font-bold shadow-xs transition active:scale-[0.98] ${
                    plan.isPopular
                      ? "bg-(--mainColor) text-(--bgColor) hover:opacity-90"
                      : "border-2 border-(--mainColor) bg-transparent text-(--mainColor) hover:bg-(--mainColor) hover:text-(--bgColor)"
                  }`}
                >
                  <span>{plan.cta || "Get Started"}</span>
                  <LuArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Tier Comparison Table (Rendered with the real plans) */}
      {showComparison && <DetailedTierComparisonTable plans={plans} />}
    </>
  );
}
