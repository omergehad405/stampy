"use client";

import React from "react";
import { motion } from "framer-motion";
import { LuCoffee } from "react-icons/lu";

export default function MyCafesEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-3xl bg-(--mainColor) text-(--bgColor) border border-(--bgColor)/15 shadow-sm"
    >
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-(--bgColor)/15 text-(--bgColor) flex items-center justify-center mb-4">
        <LuCoffee className="w-8 h-8 sm:w-10 sm:h-10 opacity-80" />
      </div>

      <h3 className="text-lg sm:text-xl font-bold text-(--bgColor)">
        No Cafes Joined Yet
      </h3>
      <p className="text-xs sm:text-sm text-(--bgColor)/75 mt-1.5 max-w-sm">
        You haven&apos;t joined any cafe loyalty programs yet. Visit a participating cafe and scan their QR code to start collecting stamps!
      </p>
    </motion.div>
  );
}
