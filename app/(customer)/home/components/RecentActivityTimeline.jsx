"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  LuCoffee,
  LuGift,
  LuSparkles,
  LuClock,
  LuStore,
} from "react-icons/lu";

export default function RecentActivityTimeline({ activities }) {
  const latestActivities = (activities || []).slice(0, 5);

  const getActivityIcon = (type, stampsDelta) => {
    if (type === "stamp" || stampsDelta > 0) {
      return {
        icon: LuCoffee,
        bg: "bg-(--bgColor)/15 text-(--bgColor)",
      };
    }
    if (type === "redemption" || (stampsDelta && stampsDelta < 0)) {
      return {
        icon: LuGift,
        bg: "bg-(--secondColor) text-[#3B2418]",
      };
    }
    if (type === "join") {
      return {
        icon: LuStore,
        bg: "bg-(--bgColor)/15 text-(--bgColor)",
      };
    }
    return {
      icon: LuSparkles,
      bg: "bg-emerald-500/25 text-emerald-300",
    };
  };

  return (
    <section aria-labelledby="recent-activity-heading" className="space-y-4">
      {/* Section Header */}
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2
              id="recent-activity-heading"
              className="text-lg sm:text-xl font-bold tracking-tight text-(--mainColor) flex items-center gap-2"
            >
              <span>Recent Activity</span>
              {latestActivities.length > 0 && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-(--mainColor)/10 text-(--mainColor)">
                  Latest {latestActivities.length}
                </span>
              )}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-(--mainColor)/70 mt-0.5">
            Your real-time visit stamps and reward transactions across all cafés.
          </p>
        </div>
      </div>

      {/* Activity List or Empty State */}
      {latestActivities.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 sm:p-10 rounded-3xl bg-(--mainColor) text-(--bgColor) border border-(--bgColor)/15 text-center flex flex-col items-center justify-center shadow-sm"
        >
          <div className="w-12 h-12 rounded-2xl bg-(--bgColor)/15 text-(--bgColor) flex items-center justify-center mb-3">
            <LuClock className="w-6 h-6 opacity-75" />
          </div>
          <h3 className="text-base font-bold text-(--bgColor)">
            No Activity Yet
          </h3>
          <p className="text-xs sm:text-sm text-(--bgColor)/75 mt-1 max-w-xs">
            Visit a participating café and present your QR code to record your first visit!
          </p>
        </motion.div>
      ) : (
        <div className="rounded-3xl p-4 sm:p-6 bg-(--mainColor) text-(--bgColor) border border-(--bgColor)/15 shadow-sm space-y-3">
          {latestActivities.map((act, index) => {
            const { icon: Icon, bg } = getActivityIcon(act.type, act.stampsDelta);
            const isLast = index === latestActivities.length - 1;

            return (
              <motion.div
                key={act.id || index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.04 }}
                className={`flex items-center justify-between gap-3.5 pb-3 ${!isLast ? "border-b border-(--bgColor)/15" : ""
                  }`}
              >
                {/* Left: Icon & Details */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${bg}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-(--bgColor) truncate">
                      {act.title}
                    </p>
                    <div className="flex items-center gap-1.5 text-[11px] text-(--bgColor)/75 mt-0.5 truncate">
                      <span className="font-medium text-(--bgColor) truncate">
                        {act.cafeName || act.description?.split("•")[0]?.trim() || "Notch Café"}
                      </span>
                      <span>•</span>
                      <span className="shrink-0">{act.date}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Stamp or Reward Badge */}
                {act.stampsDelta !== undefined && act.stampsDelta !== null && (
                  <div className="shrink-0">
                    <span
                      className={`text-xs font-extrabold px-2.5 py-1 rounded-full ${act.stampsDelta > 0
                        ? "bg-emerald-500/25 text-emerald-300"
                        : "bg-(--secondColor) text-[#3B2418]"
                        }`}
                    >
                      {act.stampsDelta > 0 ? `+${act.stampsDelta}` : act.stampsDelta}{" "}
                      {Math.abs(act.stampsDelta) === 1 ? "Stamp" : "Stamps"}
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}
