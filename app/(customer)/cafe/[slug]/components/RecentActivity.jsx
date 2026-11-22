"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LuCoffee,
  LuGift,
  LuSparkles,
  LuChevronDown,
  LuChevronUp,
} from "react-icons/lu";

export default function RecentActivity({ activities = [], slug }) {
  const [showAll, setShowAll] = useState(false);
  const displayedActivities = showAll ? activities : activities.slice(0, 5);

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-base lg:text-lg font-bold">Recent Activity</h3>
          {activities.length > 0 && (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-(--mainColor)/10 text-(--mainColor)">
              {activities.length} total
            </span>
          )}
        </div>
        <Link
          href={`/cafe/${slug}/rewards`}
          className="text-xs font-semibold px-2.5 py-1 rounded-full bg-(--secondColor)/20 text-(--mainColor) hover:opacity-90 transition"
        >
          Rewards History →
        </Link>
      </div>

      {activities.length === 0 ? (
        <div className="rounded-2xl p-5 border border-(--mainColor)/15 bg-(--bgColor)/40 text-center text-xs opacity-75">
          No visits recorded yet. Show your QR code at the counter to earn your first stamp!
        </div>
      ) : (
        <div className="space-y-2.5">
          {displayedActivities.map((act) => {
            const isRedemption = act.type === "redemption";
            const isJoin = act.type === "join";

            return (
              <div
                key={act.id}
                className="rounded-2xl p-3.5 sm:p-4 border border-(--bgColor)/15 bg-(--mainColor) text-(--bgColor) shadow-xs flex items-center justify-between gap-3 text-xs sm:text-sm transition-all hover:border-(--secondColor)/30"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isRedemption
                        ? "bg-(--secondColor)/25 text-(--secondColor)"
                        : isJoin
                        ? "bg-(--secondColor)/15 text-(--secondColor)"
                        : "bg-(--bgColor)/15 text-(--bgColor)"
                    }`}
                  >
                    {isRedemption ? (
                      <LuGift className="w-4 h-4" />
                    ) : isJoin ? (
                      <LuSparkles className="w-4 h-4" />
                    ) : (
                      <LuCoffee className="w-4 h-4" />
                    )}
                  </div>
                  <div className="min-w-0 truncate">
                    <p className="font-bold text-(--bgColor) truncate">{act.title}</p>
                    <p className="text-[11px] text-(--bgColor)/75 truncate">
                      {act.date} • {act.description}
                    </p>
                  </div>
                </div>

                <div className="shrink-0">
                  {act.stampsDelta !== 0 ? (
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                        act.stampsDelta > 0
                          ? "text-emerald-300 bg-emerald-500/20"
                          : "text-[#3B2418] bg-(--secondColor)"
                      }`}
                    >
                      {act.stampsDelta > 0
                        ? `+${act.stampsDelta}`
                        : act.stampsDelta}
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-(--secondColor) bg-(--secondColor)/15 px-2 py-0.5 rounded-md">
                      Enrolled
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {activities.length > 5 && (
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="w-full py-2 flex items-center justify-center gap-1.5 text-xs font-bold text-(--mainColor) hover:opacity-80 transition cursor-pointer"
            >
              {showAll ? (
                <>
                  <span>Show Less</span>
                  <LuChevronUp className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  <span>View All {activities.length} Activities</span>
                  <LuChevronDown className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          )}
        </div>
      )}
    </section>
  );
}
