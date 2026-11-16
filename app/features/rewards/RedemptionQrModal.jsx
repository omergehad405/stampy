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
  LuQrCode,
  LuSparkles,
} from "react-icons/lu";

// High-contrast crisp SVG QR Code for redemption
function RedemptionQRCodeGraphic({ code, className = "w-44 h-44" }) {
  // Generate deterministic variations in data modules based on the redemption code string
  const hash = code ? code.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) : 42;
  const modA = hash % 2 === 0;
  const modB = hash % 3 === 0;

  return (
    <svg
      viewBox="0 0 29 29"
      fill="currentColor"
      className={className}
      shapeRendering="crispEdges"
      aria-label={`Redemption QR Code for ${code}`}
    >
      {/* Top-Left Finder */}
      <rect x="2" y="2" width="7" height="7" fill="currentColor" />
      <rect x="3" y="3" width="5" height="5" fill="#FFFFFF" />
      <rect x="4" y="4" width="3" height="3" fill="currentColor" />

      {/* Top-Right Finder */}
      <rect x="20" y="2" width="7" height="7" fill="currentColor" />
      <rect x="21" y="3" width="5" height="5" fill="#FFFFFF" />
      <rect x="22" y="4" width="3" height="3" fill="currentColor" />

      {/* Bottom-Left Finder */}
      <rect x="2" y="20" width="7" height="7" fill="currentColor" />
      <rect x="3" y="21" width="5" height="5" fill="#FFFFFF" />
      <rect x="4" y="22" width="3" height="3" fill="currentColor" />

      {/* Center & Timing modules */}
      <rect x="10" y="5" width="1" height="1" fill="currentColor" />
      <rect x="12" y="5" width="1" height="1" fill="currentColor" />
      <rect x="14" y="5" width="1" height="1" fill="currentColor" />
      <rect x="16" y="5" width="1" height="1" fill="currentColor" />
      <rect x="18" y="5" width="1" height="1" fill="currentColor" />
      <rect x="5" y="10" width="1" height="1" fill="currentColor" />
      <rect x="5" y="12" width="1" height="1" fill="currentColor" />
      <rect x="5" y="14" width="1" height="1" fill="currentColor" />
      <rect x="5" y="16" width="1" height="1" fill="currentColor" />
      <rect x="5" y="18" width="1" height="1" fill="currentColor" />

      {/* Unique dynamic data pattern modules */}
      <rect x="11" y="11" width="3" height="3" fill="currentColor" />
      <rect x="15" y="11" width="2" height="1" fill="currentColor" />
      <rect x="11" y="15" width="1" height="3" fill="currentColor" />
      <rect x="14" y="14" width="3" height="3" fill={modA ? "currentColor" : "#FFFFFF"} />
      <rect x="18" y="13" width="2" height="2" fill="currentColor" />
      <rect x="10" y="18" width="3" height="2" fill={modB ? "currentColor" : "#FFFFFF"} />
      <rect x="19" y="18" width="4" height="2" fill="currentColor" />
      <rect x="10" y="2" width="2" height="2" fill="currentColor" />
      <rect x="14" y="2" width="2" height="2" fill="currentColor" />
      <rect x="17" y="2" width="2" height="2" fill="currentColor" />
      <rect x="2" y="11" width="2" height="2" fill="currentColor" />
      <rect x="2" y="15" width="2" height="2" fill="currentColor" />
      <rect x="24" y="11" width="2" height="2" fill="currentColor" />
      <rect x="24" y="15" width="2" height="2" fill="currentColor" />
      <rect x="10" y="24" width="2" height="2" fill="currentColor" />
      <rect x="14" y="24" width="2" height="2" fill="currentColor" />
      <rect x="18" y="24" width="2" height="2" fill="currentColor" />
      <rect x="22" y="24" width="2" height="2" fill="currentColor" />
    </svg>
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
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
          className="relative z-10 bg-[var(--bgColor)] text-[var(--mainColor)] rounded-3xl p-6 sm:p-8 max-w-sm sm:max-w-md w-full shadow-2xl border border-[var(--mainColor)]/15 flex flex-col items-center text-center max-h-[90vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            type="button"
            aria-label="Close dialog"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-[var(--mainColor)]/10 text-[var(--mainColor)] transition-colors cursor-pointer"
          >
            <LuX className="w-5 h-5" />
          </button>

          {/* Success / Status Header */}
          {isPending && (
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mb-3">
              <LuSparkles className="w-6 h-6 animate-pulse" />
            </div>
          )}

          {isUsed && (
            <div className="w-12 h-12 rounded-2xl bg-[var(--mainColor)]/10 text-[var(--mainColor)] flex items-center justify-center mb-3">
              <LuCircleCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          )}

          <span className="text-xs font-bold uppercase tracking-wider opacity-70">
            {isUsed ? "Reward Claimed" : "Ready to Redeem"}
          </span>

          <h3 id="qr-modal-title" className="text-xl sm:text-2xl font-bold mt-1">
            {redemption.rewardName}
          </h3>

          {/* Status Badge */}
          <div className="mt-2 flex items-center gap-1.5">
            {isPending && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-800 dark:text-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Active • Single-Use Only
              </span>
            )}
            {isUsed && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-[var(--mainColor)]/10 text-[var(--mainColor)]">
                <LuCheck className="w-3.5 h-3.5 text-emerald-600" />
                Scanned by Barista • Used
              </span>
            )}
            {isExpired && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-red-500/15 text-red-700 dark:text-red-300">
                <LuClock className="w-3.5 h-3.5" />
                Expired
              </span>
            )}
          </div>

          {/* High-Contrast QR Code Card */}
          <div
            className={`w-52 h-52 sm:w-60 sm:h-60 p-4 sm:p-5 border-2 rounded-2xl bg-white shadow-md my-4 flex items-center justify-center transition-all ${
              isUsed
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
          <div className="flex items-center gap-2 bg-white/70 dark:bg-black/20 border border-[var(--mainColor)]/10 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-mono font-bold">
            <span>{redemption.code}</span>
            <button
              type="button"
              onClick={handleCopy}
              className="p-1 rounded-md hover:bg-[var(--mainColor)]/10 text-[var(--mainColor)] transition-colors cursor-pointer"
              title="Copy redemption code"
              aria-label="Copy redemption code"
            >
              {copied ? (
                <LuCheck className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <LuCopy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* Security & Instructions */}
          <div className="flex items-center justify-center gap-1.5 text-xs opacity-75 mt-3">
            <LuShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
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
            className="w-full mt-5 bg-[var(--mainColor)] hover:opacity-90 active:scale-[0.99] text-[var(--bgColor)] font-semibold text-sm sm:text-base py-3.5 px-4 rounded-xl text-center transition-all cursor-pointer shadow-sm"
          >
            Done
          </button>

          <p className="text-[11px] opacity-60 mt-2">
            You can access this QR code anytime from your &ldquo;My Rewards&rdquo; history.
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
