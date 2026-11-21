"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LuCoffee,
  LuSparkles,
  LuCheck,
  LuPartyPopper,
  LuX,
} from "react-icons/lu";

export default function WelcomeStampModal({
  cafe,
  isOpen,
  onClose,
  totalStamps = 10,
  stampNumber = 1,
  isWelcome = true,
  unlockedReward = false,
  addedStamps = 1,
}) {
  const [animationStage, setAnimationStage] = useState("start"); // 'start' | 'stamping' | 'impact' | 'done'

  useEffect(() => {
    if (!isOpen) {
      setAnimationStage("start");
      return;
    }

    // Sequence of animations:
    // 1. Initial appearance (0ms)
    // 2. Stamp tool descends and slams down (400ms)
    // 3. Ink shockwave and stamp reveals (900ms)
    // 4. Celebration details finish (1400ms)
    const t1 = setTimeout(() => setAnimationStage("stamping"), 400);
    const t2 = setTimeout(() => setAnimationStage("impact"), 950);
    const t3 = setTimeout(() => setAnimationStage("done"), 1450);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isStamped = animationStage === "impact" || animationStage === "done";
  const displaySlotNumber = Math.min(totalStamps, Math.max(1, stampNumber));
  const remainingStamps = Math.max(0, totalStamps - displaySlotNumber);

  return (
    <AnimatePresence>
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs"
      >
        {/* Modal Outer Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-sm sm:max-w-md rounded-3xl border border-[#ebdcc8] bg-[#faf6ed] p-6 sm:p-7 shadow-2xl text-(--mainColor) overflow-hidden"
        >
          {/* Subtle Ambient Background Gradient */}
          <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-(--secondColor)/25 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-amber-200/30 blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close welcome modal"
            className="absolute top-4 right-4 p-2 rounded-full text-(--mainColor)/50 hover:text-(--mainColor) hover:bg-(--mainColor)/10 transition cursor-pointer z-20"
          >
            <LuX className="w-5 h-5" />
          </button>

          {/* Header pill */}
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                unlockedReward
                  ? "bg-purple-100 border border-purple-300 text-purple-900"
                  : isWelcome
                  ? "bg-(--secondColor)/30 border border-(--secondColor) text-(--mainColor)"
                  : "bg-emerald-100 border border-emerald-300 text-emerald-900"
              }`}
            >
              <LuSparkles className="w-3.5 h-3.5" />
              <span>
                {unlockedReward
                  ? "🎉 Reward Tier Unlocked!"
                  : isWelcome
                  ? "Welcome Gift Unlocked"
                  : "Visit Verified & Stamped"}
              </span>
            </motion.div>
          </div>

          {/* ========================================================================= */}
          {/* STAMPING ARENA                                                            */}
          {/* ========================================================================= */}
          <div className="relative my-6 flex flex-col items-center justify-center py-4">
            {/* The Floating Stamp Slot Target */}
            <div className="relative flex items-center justify-center">
              {/* Expanding Ink Shockwave Ripple on Impact */}
              {isStamped && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0.9 }}
                  animate={{ scale: 2.3, opacity: 0 }}
                  transition={{ duration: 0.65, ease: "easeOut" }}
                  className="absolute w-28 h-28 rounded-full border-4 border-(--secondColor) bg-(--secondColor)/25 pointer-events-none z-0"
                />
              )}

              {/* Decorative Particle Sparks */}
              {isStamped && (
                <>
                  <motion.div
                    initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                    animate={{ x: -45, y: -40, scale: 1.2, opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="absolute z-10 text-amber-500"
                  >
                    ✦
                  </motion.div>
                  <motion.div
                    initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                    animate={{ x: 50, y: -35, scale: 1.4, opacity: 0 }}
                    transition={{ duration: 0.65 }}
                    className="absolute z-10 text-(--secondColor)"
                  >
                    ★
                  </motion.div>
                  <motion.div
                    initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                    animate={{ x: -40, y: 35, scale: 1.1, opacity: 0 }}
                    transition={{ duration: 0.55 }}
                    className="absolute z-10 text-amber-600"
                  >
                    ✦
                  </motion.div>
                  <motion.div
                    initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                    animate={{ x: 45, y: 40, scale: 1.3, opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="absolute z-10 text-(--secondColor)"
                  >
                    ★
                  </motion.div>
                </>
              )}

              {/* Slot Box (Transforms on Impact) */}
              <motion.div
                animate={
                  isStamped
                    ? {
                        scale: [1, 1.15, 0.95, 1],
                        rotate: [0, -3, 3, 0],
                      }
                    : {}
                }
                transition={{ duration: 0.35, ease: "easeOut" }}
                className={`relative z-10 w-28 h-28 rounded-3xl flex flex-col items-center justify-center border-3 transition-colors duration-200 shadow-md ${
                  isStamped
                    ? "bg-(--mainColor) border-(--mainColor) text-(--secondColor)"
                    : "bg-white/80 border-dashed border-[#dacdb9] text-(--mainColor)/40"
                }`}
              >
                {/* Number Badge */}
                <span
                  className={`absolute top-2 left-2.5 text-[11px] font-black tracking-wider ${
                    isStamped ? "text-(--secondColor)/75" : "text-(--mainColor)/40"
                  }`}
                >
                  #{displaySlotNumber}
                </span>

                {isStamped ? (
                  <motion.div
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 14, stiffness: 260 }}
                    className="flex flex-col items-center"
                  >
                    <LuCoffee className="w-12 h-12 stroke-[2.5]" />
                    <span className="text-[10px] font-extrabold uppercase tracking-wider mt-1 text-(--secondColor)">
                      STAMPED
                    </span>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center opacity-40">
                    <LuCoffee className="w-10 h-10 stroke-[1.5]" />
                    <span className="text-[10px] font-semibold mt-1">
                      Slot #{displaySlotNumber}
                    </span>
                  </div>
                )}
              </motion.div>

              {/* The Descending Realistic Barista Stamp Tool */}
              <AnimatePresence>
                {animationStage === "stamping" && (
                  <motion.div
                    initial={{ y: -160, scale: 2.2, opacity: 0, rotate: -25 }}
                    animate={{
                      y: 0,
                      scale: 1,
                      opacity: 1,
                      rotate: 0,
                    }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{
                      duration: 0.45,
                      ease: [0.175, 0.885, 0.32, 1.275],
                    }}
                    className="absolute z-30 pointer-events-none flex flex-col items-center"
                  >
                    {/* Stamp wooden handle & chrome body */}
                    <div className="w-12 h-20 bg-gradient-to-b from-amber-900 via-amber-800 to-amber-950 rounded-t-full border-2 border-amber-950 shadow-2xl flex items-center justify-center" />
                    <div className="w-24 h-6 bg-gradient-to-r from-gray-300 via-gray-100 to-gray-400 rounded-md border border-gray-400 -mt-1 shadow-lg" />
                    <div className="w-26 h-3 bg-(--mainColor) rounded-b-lg -mt-0.5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Floating "+1 Stamp" Pill */}
            {isStamped && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.15, type: "spring" }}
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-(--secondColor) text-(--mainColor) px-3.5 py-1 text-xs font-black shadow-sm"
              >
                <LuPartyPopper className="w-4 h-4" />
                <span>
                  {isWelcome
                    ? "+1 Stamp Added Automatically!"
                    : `+${addedStamps || 1} Stamp Collected!`}
                </span>
              </motion.div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* CELEBRATORY MESSAGE & CALL TO ACTION                                      */}
          {/* ========================================================================= */}
          <div className="text-center space-y-2">
            <motion.h3
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl sm:text-2xl font-black text-(--mainColor)"
            >
              {unlockedReward
                ? "🎉 Stamp Target Reached!"
                : isWelcome
                ? `Welcome to ${cafe?.name || "the Café"}!`
                : `🎉 New Stamp Collected!`}
            </motion.h3>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xs sm:text-sm text-(--mainColor)/75 leading-relaxed max-w-xs mx-auto"
            >
              {unlockedReward ? (
                <>
                  Congratulations! You collected <strong>{displaySlotNumber} stamps</strong> at{" "}
                  <strong>{cafe?.name}</strong>. You unlocked your reward tier and can now claim your free item!
                </>
              ) : isWelcome ? (
                <>
                  We credited your <strong>first loyalty stamp</strong> right now as a welcome gift. Collect{" "}
                  <strong>{remainingStamps} more stamps</strong> on your next visits to claim free rewards!
                </>
              ) : (
                <>
                  Barista verified your visit at <strong>{cafe?.name}</strong>! Slot #
                  <strong>{displaySlotNumber}</strong> has been stamped. Collect{" "}
                  <strong>{remainingStamps} more stamps</strong> to unlock your reward.
                </>
              )}
            </motion.p>
          </div>

          {/* Progression Indicator Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-5 rounded-2xl border border-[#dacdb9] bg-[#f5ecdd] p-3.5 space-y-2 text-xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-(--mainColor) text-(--secondColor) flex items-center justify-center font-bold text-[11px]">
                  <LuCheck className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span className="font-bold text-(--mainColor)">
                  Card Progress
                </span>
              </div>
              <div className="font-extrabold text-(--mainColor)">
                {displaySlotNumber} / {totalStamps} Stamps
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-white/70 overflow-hidden border border-[#dacdb9]">
              <div
                className="h-full bg-(--mainColor) rounded-full transition-all duration-700"
                style={{
                  width: `${Math.min(100, (displaySlotNumber / totalStamps) * 100)}%`,
                }}
              />
            </div>
          </motion.div>

          {/* Dismiss Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6"
          >
            <button
              type="button"
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-(--mainColor) py-3.5 px-4 font-extrabold text-sm text-(--secondColor) shadow-md hover:opacity-95 active:scale-[0.99] transition cursor-pointer"
            >
              <span>Awesome! View My Loyalty Card</span>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
