"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  LuSparkles,
  LuCheck,
  LuGift,
  LuStore,
  LuCoffee,
  LuCakeSlice,
  LuPercent,
  LuPackage,
} from "react-icons/lu";

function RewardItemVisual({ iconType, className = "w-12 h-12" }) {
  const getIcon = () => {
    switch (iconType) {
      case "coffee":
        return <LuCoffee className="w-full h-full" />;
      case "dessert":
        return <LuCakeSlice className="w-full h-full" />;
      case "discount":
        return <LuPercent className="w-full h-full" />;
      case "specialty":
        return <LuSparkles className="w-full h-full" />;
      case "beans":
        return <LuPackage className="w-full h-full" />;
      default:
        return <LuGift className="w-full h-full" />;
    }
  };

  return (
    <div
      className={`rounded-2xl bg-[var(--bgColor)]/15 text-[var(--bgColor)] flex items-center justify-center p-3 border border-[var(--bgColor)]/20 ${className}`}
    >
      {getIcon()}
    </div>
  );
}

export default function AvailableRewardsSection({
  rewards,
  onRedeemReward,
}) {
  const redeemableRewards = rewards || [];

  return (
    <section aria-labelledby="available-rewards-heading" className="space-y-4">
      {/* Section Header */}
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2
              id="available-rewards-heading"
              className="text-lg sm:text-xl font-bold tracking-tight text-[var(--mainColor)] flex items-center gap-2"
            >
              <span>Available Rewards</span>
              {redeemableRewards.length > 0 && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[var(--secondColor)] text-[#3B2418]">
                  {redeemableRewards.length} Ready to Redeem
                </span>
              )}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--mainColor)]/70 mt-0.5">
            Perks and treats you have unlocked and can redeem right now.
          </p>
        </div>
      </div>

      {/* Rewards Grid or Empty State */}
      {redeemableRewards.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 sm:p-10 rounded-3xl bg-[var(--mainColor)] text-[var(--bgColor)] border border-[var(--bgColor)]/15 text-center flex flex-col items-center justify-center shadow-sm"
        >
          <div className="w-13 h-13 rounded-2xl bg-[var(--bgColor)]/15 text-[var(--bgColor)] flex items-center justify-center mb-3">
            <LuGift className="w-6 h-6" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-[var(--bgColor)]">
            No Rewards Ready to Redeem Yet
          </h3>
          <p className="text-xs sm:text-sm text-[var(--bgColor)]/75 mt-1.5 max-w-sm leading-relaxed">
            Keep visiting your joined cafés and collecting stamps. Once you reach a reward target, it will appear here ready to claim!
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {redeemableRewards.map((item, index) => {
            return (
              <motion.div
                key={`${item.cafeSlug}-${item.id}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.04 }}
                className="relative flex flex-col justify-between rounded-3xl p-5 bg-[var(--mainColor)] text-[var(--bgColor)] border border-[var(--bgColor)]/15 shadow-sm hover:shadow-md hover:border-[var(--secondColor)] transition-all duration-300"
              >
                <div>
                  {/* Top Bar: Cafe Identity & Stamps Pill */}
                  <div className="flex items-center justify-between gap-2 pb-3 border-b border-[var(--bgColor)]/15">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="relative w-6 h-6 rounded-lg overflow-hidden bg-[var(--bgColor)]/15 shrink-0 border border-[var(--bgColor)]/20">
                        {item.cafeLogo ? (
                          <Image
                            src={item.cafeLogo}
                            alt={item.cafeName}
                            fill
                            sizes="24px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[var(--bgColor)]">
                            <LuStore className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                      <span className="text-xs font-bold text-[var(--bgColor)] truncate">
                        {item.cafeName}
                      </span>
                    </div>

                    <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full shrink-0 bg-[var(--secondColor)] text-[#3B2418] shadow-xs">
                      {item.stampsRequired} Stamps
                    </span>
                  </div>

                  {/* Visual + Content */}
                  <div className="mt-4 flex items-start gap-3.5">
                    <RewardItemVisual
                      iconType={item.iconType}
                      className="w-12 h-12 shrink-0"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="text-base font-bold text-[var(--bgColor)] leading-snug">
                          {item.name}
                        </h3>
                        {item.tag && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[var(--secondColor)]/30 text-[var(--bgColor)]">
                            {item.tag}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[var(--bgColor)]/75 line-clamp-2 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Status indicator */}
                  <div className="mt-3.5 flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-300 bg-emerald-500/20 px-2.5 py-1 rounded-full">
                      <LuCheck className="w-3 h-3" />
                      <span>Ready to Redeem</span>
                    </span>

                    <span className="text-[11px] text-[var(--bgColor)]/70 font-semibold">
                      Balance: {item.stampsBalance} stamps
                    </span>
                  </div>
                </div>

                {/* Bottom CTA Button */}
                <div className="mt-4 pt-3 border-t border-[var(--bgColor)]/15">
                  <button
                    type="button"
                    onClick={() => onRedeemReward(item)}
                    className="w-full flex items-center justify-center gap-1.5 bg-[var(--secondColor)] hover:opacity-95 active:scale-95 text-[#3B2418] font-bold text-xs sm:text-sm py-2.5 px-3 rounded-xl transition-all cursor-pointer shadow-xs"
                  >
                    <LuSparkles className="w-4 h-4" />
                    <span>Redeem Reward</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}
