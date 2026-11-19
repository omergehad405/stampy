"use client";

import React from "react";
import { motion } from "framer-motion";

import MyRewardsSection from "./MyRewardsSection";

export default function RewardsHistory({ cafe, redemptions, onOpenQr }) {
  return (
    <motion.div
      key="history"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <div className="mb-2">
        <h3 className="text-base sm:text-lg font-bold">
          {cafe.name} Redemption History & QR Codes
        </h3>
        <p className="text-xs sm:text-sm opacity-70">
          Tap &ldquo;View QR Code&rdquo; on any active reward to present it to the cashier.
        </p>
      </div>

      <MyRewardsSection
        redemptions={redemptions}
        onOpenQr={onOpenQr}
      />
    </motion.div>
  );
}
