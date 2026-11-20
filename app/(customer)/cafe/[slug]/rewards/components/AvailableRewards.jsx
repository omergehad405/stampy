"use client";

import React from "react";
import { motion } from "framer-motion";
import { LuGift } from "react-icons/lu";

import RewardCard from "./RewardCard";

export default function AvailableRewards({ cafe, rewards, stampsBalance, onRedeem }) {
  return (
    <motion.div
      key="available"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      {rewards.length === 0 ? (
        <div className="py-12 px-6 text-center rounded-3xl bg-(--mainColor)/5 border border-(--mainColor)/10 flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-(--secondColor)/20 flex items-center justify-center mb-3">
            <LuGift className="w-6 h-6 text-(--mainColor)" />
          </div>
          <p className="text-base font-bold text-(--mainColor)">No Rewards Available Yet</p>
          <p className="text-xs text-(--mainColor)/70 max-w-sm mt-1 leading-relaxed">
            {cafe?.name || "This café"} hasn’t published any reward tiers yet. Keep collecting stamps and check back soon!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {rewards.map((reward) => (
            <RewardCard
              key={reward.id || reward._id}
              reward={reward}
              stampsBalance={stampsBalance}
              onRedeem={onRedeem}
            />
          ))}
        </div>
      )}

      <div className="mt-8 p-4 rounded-2xl bg-(--mainColor) text-(--bgColor) border border-(--bgColor)/15 text-xs text-(--bgColor)/85 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
        <p>
          💡 <strong>Tip:</strong> Redeem any unlocked reward whenever you visit {cafe?.name || "the café"}. Stamps are deducted only upon confirmed cashier scan.
        </p>
        <span className="opacity-70 text-[11px]">
          {cafe?.name || "Café"} Loyalty
        </span>
      </div>
    </motion.div>
  );
}
