"use client";

import React from "react";
import { motion } from "framer-motion";
import { LuUtensils, LuCoffee, LuCroissant, LuSparkles, LuLayers } from "react-icons/lu";

export default function CafeMenuTeaser({ menuPreview }) {
  if (!menuPreview || !menuPreview.isAvailable) return null;

  const { note, categories = [] } = menuPreview;

  const getCategoryIcon = (id) => {
    switch (id) {
      case "cat-espresso":
        return <LuCoffee className="w-4 h-4" />;
      case "cat-bakery":
        return <LuCroissant className="w-4 h-4" />;
      case "cat-iced":
        return <LuSparkles className="w-4 h-4" />;
      default:
        return <LuUtensils className="w-4 h-4" />;
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.3, ease: "easeOut" }}
      className="w-full rounded-3xl bg-[var(--mainColor)]/[0.03] border border-dashed border-[var(--mainColor)]/20 p-5 sm:p-6"
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-[var(--secondColor)]/30 text-[var(--mainColor)]">
            <LuLayers className="w-4 h-4" />
          </span>
          <h2 className="text-base sm:text-lg font-bold text-[var(--mainColor)]">
            Digital Menu
          </h2>
        </div>

        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[var(--secondColor)]/30 text-[var(--mainColor)] border border-[var(--secondColor)]/50">
          Coming Soon
        </span>
      </div>

      <p className="text-xs sm:text-sm text-[var(--mainColor)]/75 max-w-xl">
        {note || "Digital interactive menu ordering will be available directly inside Stampy soon. Here is a glance at our signature craft categories."}
      </p>

      {/* Categories Preview Grid */}
      {categories.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center gap-3 p-3 rounded-2xl bg-[var(--bgColor)] border border-[var(--mainColor)]/10 shadow-xs"
            >
              <div className="p-2.5 rounded-xl bg-[var(--mainColor)]/5 text-[var(--mainColor)] shrink-0">
                {getCategoryIcon(cat.id)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-[var(--mainColor)] truncate">
                    {cat.title}
                  </h4>
                  <span className="text-[10px] font-medium text-[var(--mainColor)]/50 shrink-0">
                    {cat.count}
                  </span>
                </div>
                <p className="text-[11px] text-[var(--mainColor)]/70 truncate mt-0.5">
                  {cat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.section>
  );
}
