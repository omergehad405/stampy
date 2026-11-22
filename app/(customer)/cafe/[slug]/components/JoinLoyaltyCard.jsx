"use client";

import React from "react";
import { LuPlus } from "react-icons/lu";

export default function JoinLoyaltyCard({ cafe, isJoining, onJoin }) {
  return (
    <section className="mt-6 p-5 sm:p-6 rounded-3xl bg-(--mainColor) text-(--bgColor) border border-(--bgColor)/15 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-(--bgColor)">
            Start earning stamps with {cafe.name}
          </h3>
          <p className="text-xs sm:text-sm text-(--bgColor)/75 mt-1 max-w-lg">
            Join with your existing Notch account in one tap. Every visit earns you a stamp towards free specialty coffee, pastries, and exclusive discounts.
          </p>
        </div>

        <button
          type="button"
          onClick={onJoin}
          disabled={isJoining}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-(--secondColor) text-[#3b2418] font-bold text-xs sm:text-sm shadow-xs hover:opacity-95 active:scale-95 transition cursor-pointer"
        >
          <LuPlus className="w-4 h-4" />
          <span>Join Now (Free)</span>
        </button>
      </div>
    </section>
  );
}
