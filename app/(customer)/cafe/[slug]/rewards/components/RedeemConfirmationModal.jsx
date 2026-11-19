"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuX, LuSparkles, LuArrowRight, LuCircleAlert } from "react-icons/lu";
import RewardVisual from "./RewardVisual";

export default function RedeemConfirmationModal({
  isOpen,
  reward,
  currentBalance,
  onConfirm,
  onCancel,
}) {
  // Close on Escape key & lock scroll
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onCancel();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onCancel]);

  if (!isOpen || !reward) return null;

  const newBalance = currentBalance - reward.stampsRequired;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onCancel}
        />

        {/* Modal Card */}
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="redeem-modal-title"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative z-10 bg-(--mainColor) text-(--bgColor) rounded-3xl p-6 sm:p-8 max-w-sm sm:max-w-md w-full shadow-2xl border border-(--bgColor)/15 flex flex-col"
        >
          {/* Close button */}
          <button
            type="button"
            aria-label="Close dialog"
            onClick={onCancel}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-(--bgColor)/10 text-(--bgColor)/80 hover:text-(--bgColor) transition-colors cursor-pointer"
          >
            <LuX className="w-5 h-5" />
          </button>

          {/* Icon & Title */}
          <div className="flex flex-col items-center text-center">
            <div className="rounded-2xl bg-(--bgColor)/15 p-2 border border-(--bgColor)/20 mb-3">
              <RewardVisual iconType={reward.iconType} className="w-16 h-16 sm:w-20 sm:h-20" />
            </div>

            <span className="text-xs font-bold uppercase tracking-wider text-(--secondColor)">
              Confirm Redemption
            </span>

            <h3 id="redeem-modal-title" className="text-xl sm:text-2xl font-bold mt-1 text-(--bgColor)">
              {reward.name}
            </h3>

            <p className="text-xs sm:text-sm text-(--bgColor)/75 mt-1 max-w-xs">
              {reward.description}
            </p>
          </div>

          {/* Stamp Calculation Box */}
          <div className="bg-(--bgColor)/10 rounded-2xl p-4 my-5 border border-(--bgColor)/15">
            <div className="flex items-center justify-between text-xs sm:text-sm font-semibold pb-2 border-b border-(--bgColor)/15">
              <span className="opacity-75">Current Balance:</span>
              <span>{currentBalance} stamps</span>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm font-semibold py-2 border-b border-(--bgColor)/15 text-(--secondColor)">
              <span>Required for Reward:</span>
              <span>-{reward.stampsRequired} stamps</span>
            </div>

            <div className="flex items-center justify-between text-sm sm:text-base font-bold pt-2 text-(--bgColor)">
              <span>Balance After:</span>
              <span className="flex items-center gap-1.5">
                <span className="opacity-50">{currentBalance}</span>
                <LuArrowRight className="w-3.5 h-3.5 text-(--secondColor)" />
                <span className="text-(--secondColor) font-extrabold">{newBalance} stamps</span>
              </span>
            </div>
          </div>

          {/* Security Notice */}
          <div className="flex items-start gap-2.5 bg-(--bgColor)/10 text-(--bgColor) rounded-xl p-3 text-xs leading-relaxed border border-(--bgColor)/10">
            <LuCircleAlert className="w-4 h-4 shrink-0 mt-0.5 text-(--secondColor)" />
            <p className="text-(--bgColor)/85">
              Stamps are deducted upon confirmation. A unique single-use QR code will be generated for the barista to scan.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="w-full sm:w-1/2 py-3 px-4 rounded-xl border border-(--bgColor)/20 hover:bg-(--bgColor)/10 font-semibold text-sm text-(--bgColor) text-center transition-all cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => onConfirm(reward)}
              className="w-full sm:w-1/2 flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl bg-(--secondColor) hover:opacity-95 active:scale-[0.99] text-[#3B2418] font-bold text-sm text-center transition-all cursor-pointer shadow-sm"
            >
              <LuSparkles className="w-4 h-4" />
              Confirm & Get QR
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
