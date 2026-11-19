"use client";

import React from "react";
import { LuArrowDown, LuQrCode } from "react-icons/lu";

export default function QrScrollBadge({ isHighlighted, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Scroll down to QR Code"
      className={`fixed right-0 top-30 text-[#3b2418] -translate-y-1/2 z-30 md:hidden flex items-center gap-2 pl-3.5 pr-2.5 py-2.5 rounded-l-2xl shadow-xl border-y border-l border-(--mainColor)/20 cursor-pointer transition-all duration-300 select-none ${isHighlighted
        ? "bg-(--secondColor) ring-4 ring-(--secondColor)/80 scale-105 shadow-[0_0_20px_rgba(142,197,255,0.7)]"
        : "bg-(--secondColor) hover:scale-105 active:scale-95 shadow-md"
        }`}
    >
      <div className="relative flex items-center justify-center">
        <LuQrCode className="w-5 h-5 shrink-0" />
        <span className="absolute -top-1 -right-1 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-(--mainColor) opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-(--mainColor)"></span>
        </span>
      </div>

      <div className="flex flex-col items-start text-left leading-tight">
        <span className="text-xs font-bold tracking-tight">QR Code</span>
        <span className="text-[10px] font-semibold opacity-90 flex items-center gap-0.5">
          Scroll <LuArrowDown className="w-2.5 h-2.5 animate-bounce" />
        </span>
      </div>
    </button>
  );
}
