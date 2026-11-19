"use client";

import React from "react";
import Link from "next/link";
import { LuCoffee, LuGift } from "react-icons/lu";

export default function RecentActivity({ activities, slug }) {
  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base lg:text-lg font-bold">Recent Activity</h3>
        <Link
          href={`/cafe/${slug}/rewards`}
          className="text-xs font-semibold px-2.5 py-1 rounded-full bg-(--secondColor)/20 text-(--mainColor) hover:opacity-90 transition"
        >
          Rewards History →
        </Link>
      </div>

      {activities.length === 0 ? (
        <div className="rounded-2xl p-4 border border-(--mainColor)/10 text-center text-xs opacity-70">
          No visits recorded yet. Show your QR code at the cashier!
        </div>
      ) : (
        <div className="space-y-2.5">
          {activities.map((act) => (
            <div
              key={act.id}
              className="rounded-2xl p-3.5 sm:p-4 border border-(--bgColor)/15 bg-(--mainColor) text-(--bgColor) shadow-xs flex items-center justify-between gap-3 text-xs sm:text-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-(--bgColor)/15 text-(--bgColor) flex items-center justify-center shrink-0">
                  {act.type === "redemption" ? (
                    <LuGift className="w-4 h-4" />
                  ) : (
                    <LuCoffee className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <p className="font-bold text-(--bgColor)">
                    {act.title}
                  </p>
                  <p className="text-[11px] text-(--bgColor)/70">
                    {act.date} • {act.description}
                  </p>
                </div>
              </div>

              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-md ${act.stampsDelta > 0
                  ? "text-emerald-300 bg-emerald-500/20"
                  : "text-[#3B2418] bg-(--secondColor)"
                  }`}
              >
                {act.stampsDelta > 0 ? `+${act.stampsDelta}` : act.stampsDelta}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
