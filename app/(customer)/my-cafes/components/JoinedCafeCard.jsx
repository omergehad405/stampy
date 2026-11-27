"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { LuCoffee, LuArrowRight, LuSparkles, LuStore } from "react-icons/lu";

export default function JoinedCafeCard({ cafe, onLeave }) {
  const progressPercent = Math.min(
    Math.round((cafe.currentStamps / cafe.totalStamps) * 100),
    100
  );

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group relative flex flex-col justify-between rounded-3xl p-5 sm:p-6 bg-(--mainColor) text-(--bgColor) border border-(--bgColor)/15 shadow-sm hover:shadow-md hover:border-(--secondColor) transition-all duration-300"
    >
      <div>
        <div className="flex items-start gap-4">
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-(--bgColor)/10 shrink-0 border border-(--bgColor)/20">
            {cafe.logoImage ? (
              <Image
                src={cafe.logoImage}
                alt={cafe.name}
                fill
                unoptimized
                sizes="64px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-(--bgColor)">
                <LuStore className="w-7 h-7" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base sm:text-lg font-bold text-(--bgColor) truncate">
                {cafe.name}
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-(--secondColor) text-[#3b2418] shrink-0">
                Joined
              </span>
            </div>

            <p className="text-xs text-(--bgColor)/75 truncate mt-0.5">
              {cafe.category || cafe.tagline}
            </p>

            <p className="text-[11px] text-(--bgColor)/60 mt-1 flex items-center gap-1">
              <span>{cafe.location?.district || cafe.location?.city}</span>
              <span>•</span>
              <span>{cafe.totalStamps} Stamp Card</span>
            </p>
          </div>
        </div>

        <div className="mt-5 p-3.5 sm:p-4 rounded-2xl bg-(--bgColor)/10 border border-(--bgColor)/15">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-(--bgColor)">
            <span className="flex items-center gap-1.5">
              <LuCoffee className="w-3.5 h-3.5 opacity-80" />
              <span>Stamp Progress</span>
            </span>
            <span className="text-xs font-extrabold bg-(--secondColor) text-[#3b2418] px-2.5 py-0.5 rounded-full">
              {cafe.currentStamps} / {cafe.totalStamps}
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-(--bgColor)/20 mt-2.5 overflow-hidden">
            <div
              className="h-full bg-(--secondColor) rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-(--bgColor)/85 pt-2.5 border-t border-(--bgColor)/15">
            <span className="flex items-center gap-1 truncate font-medium">
              <LuSparkles className="w-3.5 h-3.5 text-(--secondColor) shrink-0" />
              <span className="truncate">
                {cafe.nextReward
                  ? `Next: ${cafe.nextReward.name} (${cafe.nextReward.stampsRequired} stamps)`
                  : "Reward unlocked!"}
              </span>
            </span>
            <span className="text-[11px] font-semibold text-(--bgColor)/70 shrink-0 ml-2">
              {Math.max(0, (cafe.nextReward?.stampsRequired || cafe.totalStamps) - cafe.currentStamps)} to go
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-(--bgColor)/15 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onLeave(cafe.slug)}
          className="text-xs text-(--bgColor)/60 hover:text-rose-400 transition-colors cursor-pointer py-1 px-2"
          title="Leave this cafe's loyalty program"
        >
          Leave
        </button>

        <Link
          href={`/cafe/${cafe.slug}`}
          className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-(--secondColor) hover:opacity-95 active:scale-95 text-[#3b2418] font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
        >
          <span>Open Cafe</span>
          <LuArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
}
