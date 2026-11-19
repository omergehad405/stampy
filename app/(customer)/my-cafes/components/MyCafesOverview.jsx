"use client";

import React from "react";

export default function MyCafesOverview({ cafeCount }) {
  return (
    <section className="mt-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <p className="text-xs font-semibold tracking-wider uppercase opacity-60">
          YOUR LOYALTY HUBS
        </p>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mt-0.5 tracking-tight flex items-center gap-2 text-(--mainColor)">
          <span>My Cafes</span>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-(--secondColor) text-[#3b2418]">
            {cafeCount} {cafeCount === 1 ? "Cafe" : "Cafes"}
          </span>
        </h1>
        <p className="text-xs sm:text-sm lg:text-base opacity-75 mt-1 max-w-xl">
          All cafes you have joined with your Stampy account. Open any cafe to view your loyalty card, stamp slots, and rewards.
        </p>
      </div>
    </section>
  );
}
