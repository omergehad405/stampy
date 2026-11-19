"use client";

import React from "react";
import Link from "next/link";

import RewardVisual from "../rewards/components/RewardVisual";

export default function RewardsPreview({ cafe, slug }) {
  return (
    <section className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-semibold tracking-wider uppercase opacity-60">
            LOYALTY CATALOG
          </p>
          <h2 className="text-lg sm:text-xl font-bold text-(--mainColor)">
            Rewards You&apos;ll Unlock
          </h2>
        </div>
        <Link
          href={`/cafe/${slug}/rewards`}
          className="text-xs font-semibold text-(--mainColor) underline underline-offset-4"
        >
          View Full Menu
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(cafe.rewards || []).map((reward) => (
          <div
            key={reward.id}
            className="rounded-2xl p-4 bg-(--mainColor) text-(--bgColor) border border-(--bgColor)/15 shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-(--bgColor)/15 p-1 border border-(--bgColor)/20 shrink-0">
                <RewardVisual iconType={reward.iconType} className="w-10 h-10" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-(--bgColor) truncate">
                  {reward.name}
                </h4>
                <p className="text-xs text-(--bgColor)/70 line-clamp-2 mt-0.5">
                  {reward.description}
                </p>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-(--bgColor)/15 flex items-center justify-between text-xs">
              <span className="font-bold text-(--secondColor)">
                {reward.stampsRequired} Stamps
              </span>
              <span className="text-[11px] text-(--bgColor)/60">
                {reward.tag}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
