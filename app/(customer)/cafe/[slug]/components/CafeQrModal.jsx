"use client";

import React, { useEffect } from "react";
import { LuX } from "react-icons/lu";

import QRCodeGraphic from "./QRCodeGraphic";

export default function CafeQrModal({ cafe, user, totalStamps, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="qr-modal-title"
        className="relative z-10 bg-(--mainColor) text-(--bgColor) rounded-3xl p-6 sm:p-8 max-w-sm sm:max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col items-center text-center border border-(--bgColor)/15"
      >
        <button
          type="button"
          aria-label="Close modal"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-(--bgColor) hover:bg-(--bgColor)/10 transition cursor-pointer"
        >
          <LuX className="w-5 h-5" />
        </button>

        <h3 id="qr-modal-title" className="text-xl sm:text-2xl font-bold mt-2">
          Scan to Collect Stamps
        </h3>
        <p className="text-xs sm:text-sm opacity-70 mt-1">
          Show this code to the barista at {cafe.name}
        </p>

        <div className="w-52 h-52 sm:w-64 sm:h-64 p-4 border-2 border-(--bgColor)/30 rounded-2xl bg-white shadow-md my-4 flex items-center justify-center">
          <QRCodeGraphic
            value={user?.qrCode || user?.memberCode || ""}
            className="w-full h-full"
            size={240}
          />
        </div>

        <div className="text-xs sm:text-sm font-semibold bg-(--bgColor)/10 border border-(--bgColor)/15 px-4 py-1.5 rounded-full">
          {user?.name || "Omar"} • {user?.memberCode || "STAMPY-7842"} • {cafe.name}
        </div>

        <p className="text-xs opacity-60 mt-3">
          One visit per calendar day. Reward unlocked at {totalStamps} stamps.
        </p>

        <button
          type="button"
          onClick={onClose}
          className="w-full mt-5 bg-(--secondColor) hover:opacity-90 active:scale-[0.99] text-[#3b2418] font-semibold text-sm sm:text-base py-3.5 px-4 rounded-xl text-center transition-all cursor-pointer shadow-sm"
        >
          Done
        </button>
      </div>
    </div>
  );
}
