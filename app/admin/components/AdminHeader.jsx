"use client";

import React from "react";
import Link from "next/link";
import { LuMenu, LuShieldCheck, LuExternalLink, LuCoffee } from "react-icons/lu";
import { useAdminAuthStore } from "@/app/stores/useAdminAuthStore";

export default function AdminHeader({ onToggleSidebar }) {
  const { currentAdmin } = useAdminAuthStore();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#e3d7c0] bg-[#faf6ed]/95 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      {/* Left side: Hamburger (mobile) & Live indicator */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e0d3bc] bg-[#f5ecdd] text-(--mainColor) shadow-2xs hover:bg-[#ebdcc8] lg:hidden"
          aria-label="Open sidebar"
        >
          <LuMenu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-(--mainColor)/70">
            Super Admin Console • Live
          </span>
        </div>
      </div>

      {/* Right side: Cafe Portal link & Admin Profile */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Switch to Cafe Portal Link */}
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 py-1.5 text-xs font-semibold text-(--mainColor) hover:bg-[#eee3d1] transition shadow-2xs"
          title="Open Cafe Dashboard in support mode"
        >
          <LuCoffee className="h-3.5 w-3.5 text-(--mainColor)" />
          <span className="hidden sm:inline">Cafe Portal</span>
          <LuExternalLink className="h-3 w-3 text-(--mainColor)/60" />
        </Link>

        {/* Admin User Info */}
        <div className="flex items-center gap-2.5 border-l border-[#e5d8be] pl-3 sm:pl-4">
          <img
            src={
              currentAdmin?.avatar ||
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
            }
            alt={currentAdmin?.name || "Admin"}
            className="h-8 w-8 rounded-full object-cover border border-[#d6c7b3]"
          />
          <div className="hidden xl:flex flex-col text-left">
            <span className="text-xs font-bold text-(--mainColor) leading-tight">
              {currentAdmin?.name || "Stampy Admin"}
            </span>
            <span className="text-[10px] text-rose-700 font-bold uppercase tracking-wider">
              {currentAdmin?.role || "Super Admin"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
