"use client";

import React from "react";

export default function LogoutConfirmModal({ onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 bg-white text-[#3b2418] rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center border border-(--bgColor)/15"
      >
        <h3 className="text-xl font-bold">Log Out?</h3>
        <p className="text-xs opacity-75 mt-2">
          Are you sure you want to log out of your Notch customer account?
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-[#3b2418]/20 text-xs sm:text-sm font-semibold hover:bg-[#3b2418]/10 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white text-xs sm:text-sm font-bold shadow-sm hover:bg-rose-700 active:scale-95 transition cursor-pointer"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
