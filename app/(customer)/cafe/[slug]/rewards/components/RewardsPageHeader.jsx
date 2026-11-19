"use client";

import React from "react";

export default function RewardsPageHeader({ cafe }) {
  return (
    <section className="mt-4 lg:mt-6">
      <p className="text-xs font-semibold tracking-wider uppercase opacity-60">
        {cafe.name} LOYALTY REWARDS
      </p>
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mt-0.5 tracking-tight flex items-center gap-2">
        <span>Rewards</span>
        <span className="text-2xl sm:text-3xl lg:text-4xl">🎁</span>
      </h1>
      <p className="text-xs sm:text-sm lg:text-base opacity-75 mt-1 max-w-lg">
        Turn your {cafe.name} stamps into free drinks, treats, and perks.
      </p>
    </section>
  );
}
