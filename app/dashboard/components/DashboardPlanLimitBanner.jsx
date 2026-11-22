"use client";

import React, { useState } from "react";
import {
  LuTriangleAlert,
  LuSparkles,
  LuX,
  LuArrowUpRight,
  LuClock,
  LuUsers,
  LuGift,
  LuShieldAlert,
} from "react-icons/lu";
import { useDashboardStore } from "@/app/stores/useDashboardStore";

export default function DashboardPlanLimitBanner() {
  const { getPlanLimits, cafe } = useDashboardStore();
  const [isDismissed, setIsDismissed] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  if (isDismissed) return null;

  const limits = getPlanLimits ? getPlanLimits() : null;
  if (!limits) return null;

  const warnings = [];

  // 1. Subscription Expiry / End Date Countdown (Top priority when <= 7 days or expired)
  if (limits.subscriptionExpiry) {
    const expiryDate = new Date(limits.subscriptionExpiry);
    const diffDays =
      typeof limits.daysRemaining === "number"
        ? limits.daysRemaining
        : Math.ceil((expiryDate - new Date()) / (1000 * 60 * 60 * 24));

    const periodLabel =
      limits.billingPeriod === "week"
        ? "Weekly"
        : limits.billingPeriod === "year"
          ? "Yearly"
          : "Monthly";

    const formattedExpiry = !isNaN(expiryDate.getTime())
      ? expiryDate.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
      : "soon";

    const formattedJoined = limits.joiningDate
      ? new Date(limits.joiningDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
      : null;

    if (diffDays < 0 || limits.subscriptionStatus === "past_due") {
      warnings.push({
        id: "expired",
        type: "danger",
        icon: LuTriangleAlert,
        priority: 1,
        title: "Subscription Expired or Past Due",
        message: `Your ${limits.planName} (${periodLabel}) ended on ${formattedExpiry}. Please renew or upgrade your plan now to continue loyalty visits without interruption.`,
      });
    } else if (diffDays <= 7) {
      let countdownTitle = "";
      if (diffDays === 0) {
        countdownTitle = "Subscription Ending Today";
      } else if (diffDays === 1) {
        countdownTitle = "Subscription Ending Tomorrow: 1 Day Left";
      } else {
        countdownTitle = `Subscription Ending Soon: ${diffDays} Days Left`;
      }

      warnings.push({
        id: "expiring-soon",
        type: diffDays <= 3 ? "urgent" : "warning",
        icon: LuClock,
        priority: 1,
        title: countdownTitle,
        daysLeft: diffDays,
        message: `Your ${limits.planName} (${periodLabel} plan${formattedJoined ? `, joined ${formattedJoined}` : ""
          }) will end on ${formattedExpiry}. There ${diffDays === 1 ? "is 1 day" : `are ${diffDays} days`
          } remaining for this subscription period. Please renew or upgrade to keep your benefits active.`,
      });
    }
  }

  // 2. Check Customer Limit
  if (limits.isCustomersLimitReached) {
    warnings.push({
      id: "limit-customers",
      type: "limit",
      icon: LuUsers,
      title: "Customer Limit Reached",
      message: `You have reached ${limits.customersCount}/${limits.maxCustomers} registered customers on the ${limits.planName}. New customers cannot join your loyalty program until you upgrade to a higher or unlimited tier.`,
    });
  } else if (
    !limits.isUnlimitedCustomers &&
    limits.maxCustomers &&
    limits.customersCount >= limits.maxCustomers * 0.9
  ) {
    warnings.push({
      id: "near-customers",
      type: "warning",
      icon: LuUsers,
      title: "Approaching Customer Limit",
      message: `You are nearing your customer limit (${limits.customersCount}/${limits.maxCustomers} customers). Consider upgrading your plan soon so your customers can keep registering smoothly.`,
    });
  }

  // 3. Check Rewards Tier Limit
  if (limits.isRewardsLimitReached) {
    warnings.push({
      id: "limit-rewards",
      type: "limit",
      icon: LuGift,
      title: "Reward Tier Limit Reached",
      message: `You have used ${limits.rewardsCount}/${limits.maxRewards} reward tiers permitted by the ${limits.planName}. Upgrade your plan to configure additional rewards and incentives.`,
    });
  }

  // 4. Check Staff Accounts Limit
  if (limits.isStaffLimitReached) {
    warnings.push({
      id: "limit-staff",
      type: "limit",
      icon: LuShieldAlert,
      title: "Staff Accounts Limit Reached",
      message: `You have reached the maximum allowed ${limits.maxStaff} staff account(s) on your plan. Upgrade your plan to invite more barista and manager team members.`,
    });
  }

  if (warnings.length === 0) {
    return null;
  }

  const primaryWarning = warnings[0];
  const Icon = primaryWarning.icon || LuTriangleAlert;

  const isDanger = primaryWarning.type === "danger";
  const isUrgent = primaryWarning.type === "urgent";

  const bannerTheme = isDanger
    ? {
      border: "border-rose-500/40 bg-rose-500/10",
      iconBg: "bg-rose-500",
      tagBg: "bg-rose-500/20 text-rose-950",
    }
    : isUrgent
      ? {
        border: "border-amber-600/40 bg-amber-500/15",
        iconBg: "bg-amber-600",
        tagBg: "bg-amber-600/20 text-amber-950",
      }
      : {
        border: "border-amber-500/30 bg-amber-500/10",
        iconBg: "bg-amber-500",
        tagBg: "bg-amber-500/20 text-amber-900",
      };

  return (
    <>
      <div className="w-full px-4 pt-3 sm:px-6 lg:px-8">
        <div
          className={`relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 rounded-2xl border ${bannerTheme.border} p-4 text-(--mainColor) shadow-2xs backdrop-blur-xs transition animate-in fade-in slide-in-from-top-2 duration-200`}
        >
          <div className="flex items-start gap-3 min-w-0 pr-6">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${bannerTheme.iconBg} text-white shadow-2xs`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div className="text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-(--mainColor)">
                  {primaryWarning.title}
                </span>
                {warnings.length > 1 && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${bannerTheme.tagBg}`}
                  >
                    +{warnings.length - 1} more alert
                  </span>
                )}
              </div>
              <p className="mt-1 text-(--mainColor)/85 leading-relaxed max-w-3xl">
                {primaryWarning.message}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              type="button"
              onClick={() => setIsUpgradeModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-(--mainColor) px-4 py-2 text-xs font-bold text-(--secondColor) hover:opacity-90 transition active:scale-95 cursor-pointer shadow-2xs"
            >
              <span>Upgrade Plan</span>
              <LuArrowUpRight className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setIsDismissed(true)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-(--mainColor)/60 hover:bg-(--mainColor)/10 hover:text-(--mainColor) transition"
              title="Dismiss for this session"
              aria-label="Dismiss banner"
            >
              <LuX className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Upgrade Details Modal */}
      {isUpgradeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl border border-(--bgColor)/20 bg-(--mainColor) p-6 text-(--bgColor) shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-(--bgColor)/15 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-(--secondColor) text-[#3B2418]">
                  <LuSparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-(--bgColor)">
                    Upgrade Your Subscription Plan
                  </h3>
                  <p className="text-xs text-(--bgColor)/70">
                    Current tier: <span className="font-semibold text-(--secondColor)">{limits.planName}</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsUpgradeModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-xl text-(--bgColor)/70 hover:bg-(--bgColor)/10 hover:text-(--bgColor)"
              >
                <LuX className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-(--bgColor)/85 leading-relaxed">
                To expand your limits and unlock exclusive growth features (such as unlimited customers, additional reward tiers, multi-staff accounts, digital menu, or promotional campaigns), please contact your platform administrator or review available upgrade tiers.
              </p>

              <div className="rounded-2xl bg-(--bgColor)/10 p-4 border border-(--bgColor)/15 space-y-2">
                <span className="text-[11px] font-bold text-(--secondColor) uppercase tracking-wider block">
                  Current Usage Summary
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-(--bgColor)/60 block">Customers:</span>
                    <span className="font-bold">
                      {limits.customersCount} / {limits.isUnlimitedCustomers ? "Unlimited" : limits.maxCustomers}
                    </span>
                  </div>
                  <div>
                    <span className="text-(--bgColor)/60 block">Active Rewards:</span>
                    <span className="font-bold">
                      {limits.rewardsCount} / {limits.isUnlimitedRewards ? "Unlimited" : limits.maxRewards}
                    </span>
                  </div>
                  <div>
                    <span className="text-(--bgColor)/60 block">Staff Accounts:</span>
                    <span className="font-bold">
                      {limits.staffCount} / {limits.maxStaff}
                    </span>
                  </div>
                  <div>
                    <span className="text-(--bgColor)/60 block">Billing Period:</span>
                    <span className="font-bold capitalize">
                      {limits.billingPeriod === "week"
                        ? "Weekly"
                        : limits.billingPeriod === "year"
                          ? "Yearly"
                          : "Monthly"}
                    </span>
                  </div>
                  <div>
                    <span className="text-(--bgColor)/60 block">Period Ends:</span>
                    <span className="font-bold">
                      {limits.subscriptionExpiry
                        ? new Date(limits.subscriptionExpiry).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                        : "Active"}{" "}
                      {typeof limits.daysRemaining === "number" && (
                        <span
                          className={
                            limits.daysRemaining <= 3
                              ? "text-rose-300 font-extrabold"
                              : "text-(--secondColor)"
                          }
                        >
                          ({limits.daysRemaining <= 0 ? "Today" : `${limits.daysRemaining}d left`})
                        </span>
                      )}
                    </span>
                  </div>
                  <div>
                    <span className="text-(--bgColor)/60 block">Status:</span>
                    <span className="font-bold capitalize text-emerald-400">
                      {limits.subscriptionStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-(--bgColor)/15">
              <button
                type="button"
                onClick={() => setIsUpgradeModalOpen(false)}
                className="rounded-xl border border-(--bgColor)/20 px-4 py-2 font-bold text-xs text-(--bgColor) hover:bg-(--bgColor)/10"
              >
                Close
              </button>
              <a
                href={`mailto:support@notch.app?subject=Upgrade Plan Request for ${encodeURIComponent(cafe.name || "Cafe")}&body=Hello Notch Team,%0D%0A%0D%0AI would like to upgrade our cafe subscription plan to unlock higher limits and additional features.`}
                className="rounded-xl bg-(--secondColor) px-4 py-2 font-bold text-xs text-[#3B2418] hover:opacity-95 transition"
              >
                Contact Support to Upgrade
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
