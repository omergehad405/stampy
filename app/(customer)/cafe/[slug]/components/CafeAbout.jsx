"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuSparkles, LuChevronDown, LuChevronUp, LuCircleCheck } from "react-icons/lu";

export default function CafeAbout({ about }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!about) return null;

  const { shortDescription, fullDescription, highlights = [] } = about;

  // Decide if expansion is beneficial
  const hasFullDescription =
    fullDescription && fullDescription !== shortDescription;

  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
      className="w-full rounded-3xl bg-(--mainColor) text-(--bgColor) border border-(--bgColor)/15 p-5 sm:p-6 shadow-sm relative overflow-hidden"
    >
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="p-1.5 rounded-lg bg-(--secondColor) text-[#3b2418]">
          <LuSparkles className="w-4 h-4" />
        </span>
        <h2 className="text-base sm:text-lg font-bold text-(--bgColor)">
          About Us
        </h2>
      </div>

      {/* Description Content */}
      <div className="text-sm sm:text-base leading-relaxed text-(--bgColor)/85">
        <p className="font-normal">{shortDescription}</p>

        {hasFullDescription && (
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <p className="pt-3 font-normal text-(--bgColor)/80">
                  {fullDescription}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {hasFullDescription && (
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="mt-3 inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-(--secondColor) hover:underline cursor-pointer focus:outline-none"
          >
            <span>{isExpanded ? "Show less" : "Read our full story"}</span>
            {isExpanded ? (
              <LuChevronUp className="w-4 h-4" />
            ) : (
              <LuChevronDown className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* Highlights / Amenities Chips */}
      {highlights.length > 0 && (
        <div className="mt-5 pt-4 border-t border-(--bgColor)/15">
          <p className="text-xs uppercase font-bold tracking-wider text-(--secondColor) mb-2.5">
            What We Offer
          </p>
          <div className="flex flex-wrap gap-2">
            {highlights.map((item, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-(--bgColor)/10 text-(--bgColor) border border-(--bgColor)/20 hover:border-(--secondColor) transition-colors"
              >
                <LuCircleCheck className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                <span>{item}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.section>
  );
}
