"use client";

import React from "react";
import { motion } from "framer-motion";
import { LuCoffee, LuGift, LuStore, LuCircleCheck } from "react-icons/lu";

export default function LoyaltyOverviewStats({
  totalStamps,
  availableRewards,
  joinedCafesCount,
  redeemedRewards,
}) {
  const stats = [
    {
      id: "total-stamps",
      label: "Total Stamps Collected",
      sublabel: "Earned across all cafés",
      value: totalStamps,
      icon: LuCoffee,
      iconBg: "bg-[var(--bgColor)]/15 text-[var(--bgColor)]",
    },
    {
      id: "available-rewards",
      label: "Available Rewards",
      sublabel: "Ready to redeem now",
      value: availableRewards,
      icon: LuGift,
      iconBg: "bg-[var(--secondColor)] text-[#3B2418]",
      highlight: availableRewards > 0,
    },
    {
      id: "joined-cafes",
      label: "Joined Cafés",
      sublabel: "Active programs",
      value: joinedCafesCount,
      icon: LuStore,
      iconBg: "bg-[var(--bgColor)]/15 text-[var(--bgColor)]",
    },
    {
      id: "redeemed-rewards",
      label: "Redeemed Rewards",
      sublabel: "Claimed treats",
      value: redeemedRewards,
      icon: LuCircleCheck,
      iconBg: "bg-emerald-500/25 text-emerald-300",
    },
  ];

  return (
    <section aria-label="Loyalty Overview Statistics">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-[var(--mainColor)] text-[var(--bgColor)] border transition-all duration-200 ${
                stat.highlight
                  ? "border-[var(--secondColor)] shadow-md"
                  : "border-[var(--bgColor)]/15 shadow-xs hover:border-[var(--bgColor)]/30"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 ${stat.iconBg}`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>

                {stat.highlight && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--secondColor)] text-[#3B2418]">
                    Ready
                  </span>
                )}
              </div>

              <div className="mt-4">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--bgColor)] tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-bold text-[var(--bgColor)] mt-0.5 leading-tight">
                  {stat.label}
                </div>
                <div className="text-[11px] text-[var(--bgColor)]/70 mt-0.5 truncate">
                  {stat.sublabel}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
