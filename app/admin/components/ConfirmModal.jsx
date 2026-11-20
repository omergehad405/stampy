"use client";

import React from "react";
import { LuTriangleAlert, LuX } from "react-icons/lu";

export default function ConfirmModal({
  isOpen,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmVariant = "danger", // "danger" | "primary"
  onConfirm,
  onCancel,
  isLoading = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] p-6 shadow-xl">
        {/* Close Button */}
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="absolute right-4 top-4 rounded-lg p-1 text-(--mainColor)/60 hover:bg-[#eee3d1] hover:text-(--mainColor)"
          aria-label="Close modal"
        >
          <LuX className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-3.5">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
              confirmVariant === "danger"
                ? "bg-rose-100 text-rose-700"
                : "bg-(--secondColor)/30 text-(--mainColor)"
            }`}
          >
            <LuTriangleAlert className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-(--mainColor)">{title}</h3>
            <p className="mt-1 text-xs text-(--mainColor)/70 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-4 py-2 text-xs font-bold text-(--mainColor) hover:bg-[#eee3d1] transition disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`rounded-xl px-4 py-2 text-xs font-bold shadow-xs transition disabled:opacity-50 ${
              confirmVariant === "danger"
                ? "bg-rose-600 text-white hover:bg-rose-700"
                : "bg-(--mainColor) text-(--secondColor) hover:opacity-95"
            }`}
          >
            {isLoading ? "Processing..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
