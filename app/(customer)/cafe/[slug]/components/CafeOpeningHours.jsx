"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LuClock,
  LuChevronDown,
  LuChevronUp,
  LuCalendarCheck,
  LuInfo,
} from "react-icons/lu";

// Format 24-hour time "07:30" to friendly "7:30 AM"
function formatTime12h(timeStr) {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const adjustedH = h % 12 || 12;
  const formattedM = m > 0 ? `:${m.toString().padStart(2, "0")}` : "";
  return `${adjustedH}${formattedM} ${period}`;
}

export default function CafeOpeningHours({ openingHours, operatingStatus }) {
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  if (!openingHours || !Array.isArray(openingHours.schedule) || openingHours.schedule.length === 0) {
    return null;
  }

  const { schedule, holidayNotice } = openingHours;
  const todayName = operatingStatus?.todayDayName || "";
  const todayItem = schedule.find(
    (item) => item.day.toLowerCase() === todayName.toLowerCase()
  );

  return (
    <div className="w-full rounded-2xl bg-(--mainColor) text-(--bgColor) border border-(--bgColor)/15 p-4 sm:p-5 shadow-sm">
      {/* Header Row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-(--bgColor)/15 text-(--bgColor) shrink-0 mt-0.5">
            <LuClock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-bold text-(--bgColor)">
                Opening Hours
              </h3>
              {operatingStatus?.statusLabel && (
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${operatingStatus.isOpenNow
                    ? "bg-emerald-500/25 text-emerald-300 border border-emerald-500/30"
                    : "bg-amber-500/25 text-amber-300 border border-amber-500/30"
                    }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${operatingStatus.isOpenNow
                      ? "bg-emerald-400"
                      : "bg-amber-400"
                      }`}
                  />
                  <span>
                    {operatingStatus.isOpenNow ? "Open Today" : "Closed Now"}
                  </span>
                </span>
              )}
            </div>

            {/* Today's schedule summary */}
            <p className="text-xs sm:text-sm text-(--bgColor)/80 mt-1 font-medium">
              {todayItem ? (
                todayItem.isClosed ? (
                  <span>Closed today ({todayItem.day})</span>
                ) : (
                  <span>
                    Today ({todayItem.day}):{" "}
                    <strong className="text-(--bgColor) font-bold">
                      {formatTime12h(todayItem.open)} – {formatTime12h(todayItem.close)}
                    </strong>
                  </span>
                )
              ) : (
                <span>Check full weekly schedule below</span>
              )}
            </p>
          </div>
        </div>

        {/* Toggle Schedule Button */}
        <button
          type="button"
          onClick={() => setIsScheduleOpen((prev) => !prev)}
          className="p-2 rounded-xl text-(--bgColor)/75 hover:text-(--bgColor) hover:bg-(--bgColor)/10 transition-colors shrink-0 cursor-pointer"
          aria-label={isScheduleOpen ? "Hide weekly hours" : "Show weekly hours"}
          title={isScheduleOpen ? "Hide weekly hours" : "Show weekly hours"}
        >
          {isScheduleOpen ? (
            <LuChevronUp className="w-5 h-5" />
          ) : (
            <LuChevronDown className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Expandable Weekly Schedule Table */}
      <AnimatePresence initial={false}>
        {isScheduleOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-3 border-t border-(--bgColor)/15 space-y-1.5">
              {schedule.map((item) => {
                const isToday =
                  item.day.toLowerCase() === todayName.toLowerCase();

                return (
                  <div
                    key={item.day}
                    className={`flex items-center justify-between py-1.5 px-2.5 rounded-lg text-xs sm:text-sm transition-colors ${isToday
                      ? "bg-(--secondColor) font-bold text-[#3B2418]"
                      : "text-(--bgColor)/85 hover:bg-(--bgColor)/10"
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      {isToday && (
                        <LuCalendarCheck className="w-3.5 h-3.5 text-[#3B2418] shrink-0" />
                      )}
                      <span>{item.day}</span>
                      {isToday && (
                        <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-[#3B2418] text-(--bgColor)">
                          Today
                        </span>
                      )}
                    </div>

                    <div className="tabular-nums">
                      {item.isClosed ? (
                        <span className="opacity-60 italic">Closed</span>
                      ) : (
                        <span>
                          {formatTime12h(item.open)} – {formatTime12h(item.close)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {holidayNotice && (
                <div className="mt-3 pt-2 text-[11px] sm:text-xs text-(--bgColor)/70 flex items-center gap-1.5 italic">
                  <LuInfo className="w-3.5 h-3.5 shrink-0" />
                  <span>{holidayNotice}</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
