"use client";

import React from "react";
import { LuLogOut } from "react-icons/lu";

export default function ProfileLogout({ onLogout }) {
  return (
    <section className="mt-8 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
      <button
        type="button"
        onClick={onLogout}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border border-rose-300 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs sm:text-sm font-bold transition-all cursor-pointer"
      >
        <LuLogOut className="w-4 h-4" />
        <span>Log Out of Notch</span>
      </button>

      <p className="text-[11px] opacity-50 text-center sm:text-right">
        Notch v1.0 • Digital Loyalty Multi-Cafe Platform
      </p>
    </section>
  );
}
