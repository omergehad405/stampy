"use client";

import React from "react";
import { motion } from "framer-motion";

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {rewards.map((reward) => (
          <RewardCard
            key={reward.id}
            reward={reward}
            stampsBalance={stampsBalance}
            onRedeem={onRedeem}
          />
        ))}
      </div>

      <div className="mt-8 p-4 rounded-2xl bg-(--mainColor) text-(--bgColor) border border-(--bgColor)/15 text-xs text-(--bgColor)/85 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
        <p>
          💡 <strong>Tip:</strong> Redeem any unlocked reward whenever you visit {cafe.name}. Stamps are deducted only upon confirmed cashier scan.
        </p>
        <span className="opacity-70 text-[11px]">
          {cafe.name} Loyalty
        </span>
      </div>
    </motion.div>
  );
}
