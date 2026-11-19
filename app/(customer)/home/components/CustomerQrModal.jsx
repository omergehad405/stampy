"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuX, LuCopy, LuCheck, LuQrCode, LuUser, LuSun } from "react-icons/lu";

// High-contrast SVG QR Code
function CustomerQRCodeGraphic({ className = "w-44 h-44" }) {
  return (
    <svg
      viewBox="0 0 29 29"
      fill="currentColor"
      className={className}
      shapeRendering="crispEdges"
      aria-label="Customer Loyalty QR Code"
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
      {/* Alignment Pattern */}
      <rect x="18" y="18" width="5" height="5" fill="currentColor" />
      <rect x="19" y="19" width="3" height="3" fill="#FFFFFF" />
      <rect x="20" y="20" width="1" height="1" fill="currentColor" />
      {/* Timing Patterns */}
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
      {/* Data Modules */}
      <rect x="10" y="2" width="2" height="1" fill="currentColor" />
      <rect x="14" y="2" width="1" height="2" fill="currentColor" />
      <rect x="17" y="3" width="2" height="1" fill="currentColor" />
      <rect x="11" y="7" width="3" height="1" fill="currentColor" />
      <rect x="16" y="8" width="2" height="2" fill="currentColor" />
      <rect x="10" y="10" width="2" height="2" fill="currentColor" />
      <rect x="13" y="10" width="2" height="1" fill="currentColor" />
      <rect x="17" y="11" width="1" height="3" fill="currentColor" />
      <rect x="20" y="10" width="2" height="1" fill="currentColor" />
      <rect x="24" y="11" width="2" height="2" fill="currentColor" />
      <rect x="11" y="13" width="1" height="3" fill="currentColor" />
      <rect x="13" y="13" width="3" height="2" fill="currentColor" />
      <rect x="21" y="13" width="3" height="1" fill="currentColor" />
      <rect x="2" y="11" width="2" height="1" fill="currentColor" />
      <rect x="7" y="11" width="1" height="2" fill="currentColor" />
      <rect x="2" y="14" width="1" height="2" fill="currentColor" />
      <rect x="10" y="17" width="2" height="2" fill="currentColor" />
      <rect x="14" y="17" width="2" height="1" fill="currentColor" />
      <rect x="25" y="16" width="2" height="2" fill="currentColor" />
      <rect x="11" y="21" width="2" height="1" fill="currentColor" />
      <rect x="14" y="20" width="1" height="3" fill="currentColor" />
      <rect x="16" y="22" width="2" height="1" fill="currentColor" />
      <rect x="24" y="21" width="2" height="2" fill="currentColor" />
      <rect x="10" y="25" width="3" height="1" fill="currentColor" />
      <rect x="15" y="24" width="2" height="2" fill="currentColor" />
      <rect x="19" y="25" width="2" height="1" fill="currentColor" />
      <rect x="23" y="25" width="3" height="1" fill="currentColor" />
    </svg>
  );
}

export default function CustomerQrModal({ isOpen, onClose, user }) {
  const [copied, setCopied] = useState(false);

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

  if (!isOpen) return null;

  const memberCode = user?.memberCode || "STAMPY-7842";
  const customerName = user?.name || "Customer";

  const handleCopy = () => {
    navigator.clipboard?.writeText(memberCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Content */}
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="customer-qr-modal-title"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative z-10 bg-(--mainColor) text-(--bgColor) rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-(--bgColor)/15 flex flex-col items-center text-center"
        >
          {/* Close button */}
          <button
            type="button"
            aria-label="Close QR Modal"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-(--bgColor)/10 text-(--bgColor)/80 hover:text-(--bgColor) transition-colors cursor-pointer"
          >
            <LuX className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="w-12 h-12 rounded-2xl bg-(--secondColor) text-[#3b2418] flex items-center justify-center mb-3 shadow-sm">
            <LuQrCode className="w-6 h-6" />
          </div>

          <h3
            id="customer-qr-modal-title"
            className="text-lg sm:text-xl font-bold tracking-tight text-(--bgColor)"
          >
            Your Loyalty QR Code
          </h3>
          <p className="text-xs sm:text-sm text-(--bgColor)/75 mt-1 max-w-xs">
            Present this code to the barista at any participating café to collect stamps.
          </p>

          {/* QR Code Container with High-Contrast White Background */}
          <div className="mt-5 p-4 rounded-3xl bg-white border-2 border-(--bgColor)/20 shadow-md text-[#3B2418] flex flex-col items-center">
            <CustomerQRCodeGraphic className="w-44 h-44 text-[#3B2418]" />
            <div className="mt-2 text-center">
              <span className="text-[11px] font-bold tracking-wider uppercase text-[#3B2418]/60">
                Customer ID
              </span>
              <p className="text-sm font-mono font-extrabold text-[#3B2418] tracking-wider">
                {memberCode}
              </p>
            </div>
          </div>

          {/* Member info & copy */}
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs font-semibold text-(--bgColor)/85 flex items-center gap-1.5">
              <LuUser className="w-3.5 h-3.5 opacity-70" />
              <span>{customerName}</span>
            </span>
            <span className="text-(--bgColor)/30">•</span>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1 text-xs font-bold text-(--secondColor) hover:underline px-2 py-1 rounded-lg transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <LuCheck className="w-3.5 h-3.5 text-emerald-300" />
                  <span className="text-emerald-300">Copied</span>
                </>
              ) : (
                <>
                  <LuCopy className="w-3.5 h-3.5" />
                  <span>Copy ID</span>
                </>
              )}
            </button>
          </div>

          {/* Brightness hint */}
          <p className="text-[11px] text-(--bgColor)/65 mt-4 flex items-center justify-center gap-1.5">
            <LuSun className="w-3.5 h-3.5 opacity-80" />
            <span>Turn up screen brightness for faster scanning</span>
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
