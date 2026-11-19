"use client";

import React from "react";
import { LuCoffee, LuCakeSlice, LuPercent, LuSparkles, LuPackage } from "react-icons/lu";

export default function RewardVisual({ iconType, className = "w-12 h-12" }) {
  switch (iconType) {
    case "coffee":
      return (
        <div className={`rounded-2xl bg-(--mainColor)/10 text-(--mainColor) flex items-center justify-center p-3 ${className}`}>
          <LuCoffee className="w-full h-full" />
        </div>
      );
    case "dessert":
      return (
        <div className={`rounded-2xl bg-amber-500/10 text-amber-700 dark:text-amber-300 flex items-center justify-center p-3 ${className}`}>
          <LuCakeSlice className="w-full h-full" />
        </div>
      );
    case "discount":
      return (
        <div className={`rounded-2xl bg-(--secondColor)/25 text-(--mainColor) flex items-center justify-center p-3 ${className}`}>
          <LuPercent className="w-full h-full" />
        </div>
      );
    case "specialty":
      return (
        <div className={`rounded-2xl bg-sky-500/15 text-sky-700 dark:text-sky-300 flex items-center justify-center p-3 ${className}`}>
          <LuSparkles className="w-full h-full" />
        </div>
      );
    case "beans":
      return (
        <div className={`rounded-2xl bg-stone-500/15 text-stone-700 dark:text-stone-300 flex items-center justify-center p-3 ${className}`}>
          <LuPackage className="w-full h-full" />
        </div>
      );
    default:
      return (
        <div className={`rounded-2xl bg-(--mainColor)/10 text-(--mainColor) flex items-center justify-center p-3 ${className}`}>
          <LuCoffee className="w-full h-full" />
        </div>
      );
  }
}
