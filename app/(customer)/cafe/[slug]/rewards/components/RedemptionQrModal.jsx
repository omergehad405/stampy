"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LuX,
  LuCheck,
  LuCopy,
  LuCircleCheck,
  LuClock,
  LuShieldCheck,
  LuSparkles,
} from "react-icons/lu";
import QRCodeImage from "@/app/components/ui/QRCodeImage";

// Scannable QR Code for reward redemption
function RedemptionQRCodeGraphic({ code, className = "w-44 h-44" }) {
  return (
    <QRCodeImage
      value={code || "Notch-REWARD"}
      size={200}
      className={className}
      alt={`Redemption QR Code for ${code}`}
      darkColor="#1B120C"
      lightColor="#FFFFFF"
    />
  );
}

export default function RedemptionQrModal({
  isOpen,
  redemption,
  onClose,
}) {
  const [copied, setCopied] = useState(false);

  // Close on Escape key & lock scroll
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
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
  }, [isOpen, onClose]);

  if (!isOpen || !redemption) return null;

  const handleCopy = () => {
    if (redemption?.code) {
      navigator.clipboard?.writeText(redemption.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isUsed = redemption.status === "used";
  const isExpired = redemption.status === "expired";
  const isPending = redemption.status === "pending";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Card */}
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="qr-modal-title"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative z-10 bg-(--mainColor) text-(--bgColor) rounded-3xl p-6 sm:p-8 max-w-sm sm:max-w-md w-full shadow-2xl border border-(--bgColor)/15 flex flex-col items-center text-center max-h-[90vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            type="button"
            aria-label="Close dialog"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-(--bgColor)/10 text-(--bgColor)/80 hover:text-(--bgColor) transition-colors cursor-pointer"
          >
            <LuX className="w-5 h-5" />
          </button>

          {/* Success / Status Header */}
          {isPending && (
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center mb-3">
              <LuSparkles className="w-6 h-6 animate-pulse" />
            </div>
          )}

          {isUsed && (
            <div className="w-12 h-12 rounded-2xl bg-(--bgColor)/15 text-(--bgColor) flex items-center justify-center mb-3">
              <LuCircleCheck className="w-6 h-6 text-emerald-400" />
            </div>
          )}

          <span className="text-xs font-bold uppercase tracking-wider text-(--secondColor)">
            {isUsed ? "Reward Claimed" : "Ready to Redeem"}
          </span>

          <h3 id="qr-modal-title" className="text-xl sm:text-2xl font-bold mt-1 text-(--bgColor)">
            {redemption.rewardName}
          </h3>

          {/* Status Badge */}
          <div className="mt-2 flex items-center gap-1.5">
            {isPending && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/25 text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Active • Single-Use Only
              </span>
            )}
            {isUsed && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-(--bgColor)/15 text-(--bgColor)">
                <LuCheck className="w-3.5 h-3.5 text-emerald-400" />
                Scanned by Barista • Used
              </span>
            )}
            {isExpired && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-red-500/20 text-red-300">
                <LuClock className="w-3.5 h-3.5" />
                Expired
              </span>
            )}
          </div>

          {/* High-Contrast QR Code Card */}
          <div
            className={`w-52 h-52 sm:w-60 sm:h-60 p-4 sm:p-5 border-2 rounded-2xl bg-white shadow-md my-4 flex items-center justify-center transition-all ${isUsed
              ? "border-stone-300 opacity-40 grayscale"
              : "border-[#3B2418]"
              }`}
          >
            <RedemptionQRCodeGraphic
              code={redemption.code}
              className="w-full h-full text-[#3B2418]"
            />
          </div>

          {/* Unique Redemption Code with Copy Action */}
          <div className="flex items-center gap-2 bg-(--bgColor)/15 border border-(--bgColor)/20 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-mono font-bold text-(--bgColor)">
            <span>{redemption.code}</span>
            <button
              type="button"
              onClick={handleCopy}
              className="p-1 rounded-md hover:bg-(--bgColor)/15 text-(--bgColor) transition-colors cursor-pointer"
              title="Copy redemption code"
              aria-label="Copy redemption code"
            >
              {copied ? (
                <LuCheck className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <LuCopy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* Security & Instructions */}
          <div className="flex items-center justify-center gap-1.5 text-xs text-(--bgColor)/75 mt-3">
            <LuShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              {isUsed
                ? "This QR code has been used and is no longer valid."
                : "Show this screen to the barista at the checkout counter."}
            </span>
          </div>

          {/* Done / Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-full mt-6 bg-(--secondColor) hover:opacity-95 active:scale-[0.99] text-[#3B2418] font-bold text-sm sm:text-base py-3 px-4 rounded-xl transition-all cursor-pointer shadow-sm"
          >
            Done
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
