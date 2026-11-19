"use client";

import React from "react";
import Link from "next/link";
import {
  LuMenu,
  LuQrCode,
} from "react-icons/lu";
import { useDashboardAuthStore } from "@/app/stores/useDashboardAuthStore";
import { useDashboardStore } from "@/app/stores/useDashboardStore";

export default function DashboardHeader({ onToggleSidebar }) {
  const { currentUser } = useDashboardAuthStore();
  const { cafe } = useDashboardStore();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#e3d7c0] bg-[#faf6ed]/95 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      {/* Left side: Hamburger & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e0d3bc] bg-[#f5ecdd] text-(--mainColor) shadow-2xs hover:bg-[#ebdcc8] lg:hidden"
          aria-label="Open sidebar"
        >
          <LuMenu className="h-5 w-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-(--mainColor)/70">
            {cafe.name} • Live Session
          </span>
        </div>
      </div>

      {/* Right side: Quick Actions & Staff Status */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Quick Scan Action */}
        <Link
          href="/dashboard/scan"
          className="flex items-center gap-2 rounded-xl bg-(--mainColor) px-3 py-2 text-xs font-bold text-(--secondColor) shadow-xs transition hover:opacity-95 active:scale-98"
        >
          <LuQrCode className="h-4 w-4" />
          <span className="hidden sm:inline">Scan Customer QR</span>
          <span className="sm:hidden">Scan</span>
        </Link>

        {/* Staff badge */}
        <div className="flex items-center gap-2 border-l border-[#e5d8be] pl-3 sm:pl-4">
          <img
            src={
              currentUser?.avatar ||
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
            }
            alt={currentUser?.name || "User"}
            className="h-8 w-8 rounded-full object-cover border border-[#d6c7b3]"
          />
          <div className="hidden xl:flex flex-col text-left">
            <span className="text-xs font-bold text-(--mainColor) leading-tight">
              {currentUser?.name || "Elena Rostova"}
            </span>
            <span className="text-[10px] text-(--mainColor)/60 font-medium">
              {currentUser?.role || "Manager"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
