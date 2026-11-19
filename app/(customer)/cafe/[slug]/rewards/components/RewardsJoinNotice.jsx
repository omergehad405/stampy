"use client";

import React from "react";

export default function RewardsJoinNotice({ cafe, onJoin }) {
  return (
    <div className="mt-4 p-4 rounded-2xl bg-(--secondColor)/20 border border-(--secondColor)/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div>
        <p className="text-sm font-bold text-(--mainColor)">
          You haven&apos;t joined {cafe.name} yet
        </p>
        <p className="text-xs opacity-80">
          Join now to start collecting stamps towards these rewards.
        </p>
      </div>
      <button
        type="button"
        onClick={onJoin}
        className="px-4 py-2 rounded-xl bg-(--mainColor) text-(--bgColor) font-bold text-xs shrink-0 cursor-pointer shadow-xs"
      >
        Join Loyalty Program
      </button>
    </div>
  );
}
