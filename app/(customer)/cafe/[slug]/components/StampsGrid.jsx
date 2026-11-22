"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuCoffee, LuSparkles } from "react-icons/lu";

function TamperIcon({ className = "w-5 h-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="4.8" r="2.8" />
      <rect x="10.8" y="7.6" width="2.4" height="4.2" rx="0.4" />
      <path d="M8.5 11.8h7a0.8 0.8 0 0 1 0.8 0.8v1.2H7.7v-1.2a0.8 0.8 0 0 1 0.8-0.8z" />
      <rect x="6.5" y="14.2" width="11" height="2.6" rx="0.6" />
      <rect x="5.5" y="17.4" width="13" height="1.6" rx="0.5" />
    </svg>
  );
}

export default function StampsGrid({
  currentStamps,
  totalStamps,
  animatingStamps = [],
  onAnimationComplete,
}) {
  const effectiveTotal = totalStamps > 0 ? totalStamps : 10;
  const completedCycles = Math.floor(currentStamps / effectiveTotal);
  const displayStamps = currentStamps % effectiveTotal;
  const stamps = Array.from({ length: effectiveTotal }, (_, i) => i + 1);

  // Clear animation after all slots complete their animations
  useEffect(() => {
    if (animatingStamps.length > 0) {
      const timer = setTimeout(() => {
        if (onAnimationComplete) onAnimationComplete();
      }, animatingStamps.length * 400 + 1500);
      return () => clearTimeout(timer);
    }
  }, [animatingStamps, onAnimationComplete]);

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-base lg:text-lg font-bold">Your Stamps</h3>
          {completedCycles > 0 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-(--secondColor) text-[#3b2418]">
              Card #{completedCycles + 1}
            </span>
          )}
        </div>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-(--mainColor)/10 text-(--mainColor)">
          {displayStamps} of {effectiveTotal} collected
        </span>
      </div>

      <div className="grid grid-cols-5 gap-2 sm:gap-3 lg:gap-3.5">
        {stamps.map((num) => {
          const isCollected = num <= displayStamps;
          const isAnimating = animatingStamps.includes(num);
          const animationOrderIndex = isAnimating
            ? animatingStamps.indexOf(num)
            : 0;
          const delayTime = animationOrderIndex * 0.35; // Sequential stamp drop delay

          return (
            <div
              key={num}
              className={`relative aspect-[4/5] rounded-2xl lg:rounded-3xl flex flex-col items-center justify-center gap-1.5 lg:gap-2 transition-all duration-300 overflow-hidden ${
                isCollected
                  ? "bg-(--mainColor) text-(--bgColor) shadow-sm"
                  : "bg-(--bgColor) text-(--mainColor) border border-(--mainColor) opacity-70"
              }`}
            >
              {/* If this slot is actively receiving a new stamp */}
              {isAnimating ? (
                <>
                  {/* Ink Shockwave Ring upon impact */}
                  <motion.div
                    initial={{ scale: 0.3, opacity: 0 }}
                    animate={{ scale: [0.3, 1.6, 2], opacity: [0, 0.9, 0] }}
                    transition={{
                      delay: delayTime + 0.35,
                      duration: 0.7,
                      ease: "easeOut",
                    }}
                    className="absolute inset-0 rounded-2xl border-4 border-(--secondColor) pointer-events-none"
                  />

                  {/* Tamper / Barista Stamp Tool Slamming Down into the slot */}
                  <motion.div
                    initial={{ y: -65, scale: 2.2, opacity: 0, rotate: -12 }}
                    animate={{
                      y: [-65, 0, -4, 0],
                      scale: [2.2, 1, 1.08, 1],
                      opacity: [0, 1, 1, 1],
                      rotate: [-12, 0, 2, 0],
                    }}
                    transition={{
                      delay: delayTime,
                      duration: 0.55,
                      times: [0, 0.65, 0.85, 1],
                      ease: [0.18, 0.89, 0.32, 1.28], // Energetic stamp slam easing
                    }}
                    className="flex flex-col items-center justify-center gap-1.5 lg:gap-2 z-10"
                  >
                    <TamperIcon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-(--secondColor) drop-shadow-md" />
                    <span className="text-[11px] sm:text-xs lg:text-sm font-extrabold text-(--secondColor)">
                      {num}
                    </span>
                  </motion.div>

                  {/* Golden Sparkles radiating outward */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: [0, 1, 0], scale: [0.5, 1.3, 1.5] }}
                    transition={{
                      delay: delayTime + 0.38,
                      duration: 0.65,
                    }}
                    className="absolute -top-1 -right-1 text-(--secondColor) pointer-events-none"
                  >
                    <LuSparkles className="w-4 h-4" />
                  </motion.div>
                </>
              ) : (
                /* Normal collected or empty slot */
                <>
                  {isCollected ? (
                    <TamperIcon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                  ) : (
                    <LuCoffee className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                  )}
                  <span className="text-[11px] sm:text-xs lg:text-sm font-semibold">
                    {num}
                  </span>
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
