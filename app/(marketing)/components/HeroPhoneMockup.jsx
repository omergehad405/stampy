"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  LuCoffee,
  LuSparkles,
  LuCheck,
  LuQrCode,
  LuStore,
  LuUtensils,
  LuCompass,
} from "react-icons/lu";
import { HERO_CONTENT } from "../content";

export default function HeroPhoneMockup() {
  const { mockup } = HERO_CONTENT;
  const [activeTab, setActiveTab] = useState("card"); // "card" | "menu" | "qr"

  // Grid of 8 stamps: 5 completed, 3 remaining
  const slots = Array.from({ length: mockup.targetStamps }, (_, i) => ({
    number: i + 1,
    isStamped: i < mockup.currentStamps,
    isTarget: i === mockup.targetStamps - 1,
  }));

  return (
    <div className="relative mx-auto w-full max-w-[340px] sm:max-w-[380px]">
      {/* Decorative Warm Ambient Glow Behind Phone */}
      <div
        className="pointer-events-none absolute -inset-4 rounded-[48px] bg-gradient-to-tr from-(--secondColor)/30 via-(--mainColor)/15 to-transparent blur-2xl dark:from-(--secondColor)/15 dark:via-(--mainColor)/25"
        aria-hidden="true"
      />

      {/* Floating Badge: Discover & Exposure */}
      <motion.div
        initial={{ opacity: 0, x: -20, y: 10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="absolute -top-3 -left-4 z-20 hidden items-center gap-2 rounded-2xl border border-(--mainColor)/15 bg-(--bgColor) px-3 py-1.5 shadow-lg sm:flex"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-(--secondColor) text-[#3B2418]">
          <LuCompass className="h-3.5 w-3.5" />
        </span>
        <div className="text-start">
          <p className="text-[10px] font-bold text-(--mainColor)">Free Discovery</p>
          <p className="text-[9px] text-(--mainColor)/60">Featured in Cairo</p>
        </div>
      </motion.div>

      {/* Floating Badge: Next Visit Reward */}
      <motion.div
        initial={{ opacity: 0, x: 20, y: -10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 0.8, duration: 0.4 }}
        className="absolute -bottom-4 -right-4 z-20 hidden items-center gap-2 rounded-2xl border border-(--mainColor)/15 bg-(--bgColor) px-3 py-1.5 shadow-lg sm:flex"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#3B2418] text-[#8EC5FF]">
          <LuCoffee className="h-3.5 w-3.5" />
        </span>
        <div className="text-start">
          <p className="text-[10px] font-bold text-(--mainColor)">3 Visits to Free Drink</p>
          <p className="text-[9px] text-(--mainColor)/60">5 of 8 completed</p>
        </div>
      </motion.div>

      {/* Phone Hardware Frame */}
      <div className="relative rounded-[40px] border-4 border-[#3B2418]/80 bg-[#1F140E] p-3 shadow-2xl transition-all">
        {/* Dynamic Island / Speaker Pill */}
        <div className="mx-auto mb-2 h-4 w-24 rounded-full bg-black/60 flex items-center justify-center">
          <div className="h-2 w-2 rounded-full bg-black/80 ms-4" />
        </div>

        {/* Screen Content Canvas */}
        <div className="relative min-h-[580px] rounded-[32px] bg-(--bgColor) p-4 text-(--mainColor) overflow-hidden flex flex-col justify-between">
          {/* Header Bar inside phone */}
          <div>
            <div className="flex items-center justify-between border-b border-(--mainColor)/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-(--secondColor) text-[#3B2418] shadow-xs">
                  <LuStore className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold leading-tight text-(--mainColor)">
                    {mockup.cafeName}
                  </h4>
                  <p className="text-[10px] font-medium text-(--mainColor)/65">
                    {mockup.category}
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-(--secondColor)/30 px-2 py-0.5 text-[9px] font-bold text-(--mainColor)">
                Sample Cafe
              </span>
            </div>

            {/* Quick Switch Tabs inside mockup */}
            <div className="mt-3 grid grid-cols-3 rounded-xl bg-(--mainColor)/10 p-1 text-xs font-bold text-center">
              <button
                type="button"
                onClick={() => setActiveTab("card")}
                className={`rounded-lg py-1.5 text-[11px] transition ${activeTab === "card"
                    ? "bg-(--bgColor) text-(--mainColor) shadow-xs"
                    : "text-(--mainColor)/60 hover:text-(--mainColor)"
                  }`}
              >
                Rewards
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("menu")}
                className={`rounded-lg py-1.5 text-[11px] transition ${activeTab === "menu"
                    ? "bg-(--bgColor) text-(--mainColor) shadow-xs"
                    : "text-(--mainColor)/60 hover:text-(--mainColor)"
                  }`}
              >
                Menu
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("qr")}
                className={`rounded-lg py-1.5 text-[11px] transition ${activeTab === "qr"
                    ? "bg-(--bgColor) text-(--mainColor) shadow-xs"
                    : "text-(--mainColor)/60 hover:text-(--mainColor)"
                  }`}
              >
                My QR
              </button>
            </div>
          </div>

          {/* Tab 1: Rewards Stamp Progress */}
          {activeTab === "card" && (
            <div className="my-auto py-2">
              <div className="relative rounded-2xl border-2 border-(--mainColor)/15 bg-(--mainColor)/5 p-4 shadow-sm">
                {/* Left Cutout Notch */}
                <div
                  className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border-r-2 border-(--mainColor)/15 bg-(--bgColor)"
                  aria-hidden="true"
                />
                {/* Right Cutout Notch */}
                <div
                  className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border-l-2 border-(--mainColor)/15 bg-(--bgColor)"
                  aria-hidden="true"
                />

                <div className="flex items-center justify-between pb-2 border-b border-dashed border-(--mainColor)/20">
                  <span className="text-[11px] font-bold tracking-wider text-(--mainColor)/70 uppercase">
                    Visit Rewards
                  </span>
                  <span className="font-mono text-xs font-bold text-(--mainColor)">
                    {mockup.currentStamps}/{mockup.targetStamps} Visits
                  </span>
                </div>

                {/* 8-Slot Stamp Grid */}
                <div className="mt-4 grid grid-cols-4 gap-2.5">
                  {slots.map((slot, idx) => (
                    <div
                      key={slot.number}
                      className="relative flex aspect-square items-center justify-center rounded-xl border border-(--mainColor)/20 bg-(--bgColor) shadow-2xs"
                    >
                      {slot.isStamped ? (
                        <motion.div
                          initial={{ scale: 2.2, rotate: -25, opacity: 0 }}
                          animate={{ scale: 1, rotate: idx % 2 === 0 ? -6 : 8, opacity: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 18,
                            delay: 0.15 * idx,
                          }}
                          className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-dashed border-(--mainColor) bg-(--secondColor) text-[#3B2418] shadow-xs"
                        >
                          <LuCoffee className="h-5 w-5" />
                        </motion.div>
                      ) : slot.isTarget ? (
                        <div className="flex flex-col items-center justify-center text-center p-1">
                          <LuSparkles className="h-4 w-4 text-(--mainColor)/50 animate-pulse" />
                          <span className="text-[9px] font-bold text-(--mainColor)/60">FREE</span>
                        </div>
                      ) : (
                        <span className="font-mono text-xs font-semibold text-(--mainColor)/40">
                          {slot.number}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Reward Description */}
                <div className="mt-4 rounded-xl bg-(--secondColor)/20 p-2.5 text-center">
                  <p className="text-[11px] font-bold text-(--mainColor)">
                    {mockup.rewardText}
                  </p>
                </div>
              </div>

              {/* Show QR Action */}
              <button
                type="button"
                onClick={() => setActiveTab("qr")}
                className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-(--mainColor) py-2.5 text-xs font-bold text-(--bgColor) shadow-xs transition hover:opacity-90"
              >
                <LuQrCode className="h-4 w-4" />
                <span>Show QR Code at Checkout</span>
              </button>
            </div>
          )}

          {/* Tab 2: Digital Menu Preview inside phone */}
          {activeTab === "menu" && (
            <div className="my-auto py-2 space-y-2.5 text-start">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-(--mainColor)">Digital Menu</span>
                <span className="text-[10px] font-semibold text-(--mainColor)/60">Zamalek Branch</span>
              </div>

              <div className="rounded-xl border border-(--mainColor)/15 bg-(--mainColor)/5 p-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-(--mainColor)">Spanish Latte (Iced)</p>
                  <p className="text-[10px] text-(--mainColor)/60">Signature condensed milk blend</p>
                </div>
                <span className="text-xs font-bold text-(--mainColor)">95 EGP</span>
              </div>

              <div className="rounded-xl border border-(--mainColor)/15 bg-(--mainColor)/5 p-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-(--mainColor)">V60 Ethiopian Yirgacheffe</p>
                  <p className="text-[10px] text-(--mainColor)/60">Floral, jasmine, light roast</p>
                </div>
                <span className="text-xs font-bold text-(--mainColor)">110 EGP</span>
              </div>

              <div className="rounded-xl border border-(--mainColor)/15 bg-(--mainColor)/5 p-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-(--mainColor)">Pistachio Butter Croissant</p>
                  <p className="text-[10px] text-(--mainColor)/60">Baked fresh daily in-house</p>
                </div>
                <span className="text-xs font-bold text-(--mainColor)">85 EGP</span>
              </div>

              <p className="text-[10px] text-center text-(--mainColor)/60 pt-1">
                Updated live by cafe • No paper reprint needed
              </p>
            </div>
          )}

          {/* Tab 3: Customer QR Code View inside phone */}
          {activeTab === "qr" && (
            <div className="my-auto py-2 text-center">
              <div className="rounded-2xl border-2 border-(--mainColor)/15 bg-(--mainColor)/5 p-4 shadow-sm">
                <p className="text-xs font-bold text-(--mainColor)">
                  Your Customer Member Code
                </p>
                <p className="font-mono text-sm font-extrabold text-(--mainColor) mt-0.5">
                  {mockup.memberCode}
                </p>

                {/* Pure SVG QR Code Mockup */}
                <div className="mx-auto my-3 flex h-44 w-44 items-center justify-center rounded-2xl bg-white p-3 shadow-inner">
                  <svg
                    viewBox="0 0 100 100"
                    className="h-full w-full text-[#3B2418]"
                    fill="currentColor"
                  >
                    <rect x="5" y="5" width="28" height="28" rx="4" />
                    <rect x="9" y="9" width="20" height="20" rx="2" fill="white" />
                    <rect x="13" y="13" width="12" height="12" rx="1" fill="currentColor" />

                    <rect x="67" y="5" width="28" height="28" rx="4" />
                    <rect x="71" y="9" width="20" height="20" rx="2" fill="white" />
                    <rect x="75" y="13" width="12" height="12" rx="1" fill="currentColor" />

                    <rect x="5" y="67" width="28" height="28" rx="4" />
                    <rect x="9" y="71" width="20" height="20" rx="2" fill="white" />
                    <rect x="13" y="75" width="12" height="12" rx="1" fill="currentColor" />

                    <rect x="40" y="8" width="6" height="6" rx="1" />
                    <rect x="52" y="8" width="6" height="6" rx="1" />
                    <rect x="40" y="20" width="6" height="6" rx="1" />
                    <rect x="46" y="26" width="6" height="6" rx="1" />
                    <rect x="8" y="40" width="6" height="6" rx="1" />
                    <rect x="20" y="40" width="6" height="6" rx="1" />
                    <rect x="36" y="36" width="8" height="8" rx="2" />
                    <rect x="52" y="40" width="6" height="6" rx="1" />
                    <rect x="68" y="40" width="8" height="6" rx="1" />
                    <rect x="84" y="40" width="6" height="6" rx="1" />
                    <rect x="40" y="54" width="8" height="8" rx="1" />
                    <rect x="54" y="54" width="6" height="6" rx="1" />
                    <rect x="66" y="54" width="6" height="6" rx="1" />
                    <rect x="40" y="70" width="6" height="6" rx="1" />
                    <rect x="52" y="76" width="8" height="8" rx="1" />
                    <rect x="68" y="70" width="6" height="6" rx="1" />
                    <rect x="80" y="76" width="8" height="8" rx="1" />
                  </svg>
                </div>

                <p className="text-[11px] text-(--mainColor)/70 leading-tight">
                  {mockup.scanHint}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab("card")}
                className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl border border-(--mainColor)/20 py-2.5 text-xs font-bold text-(--mainColor) hover:bg-(--mainColor)/5"
              >
                <span>&larr; View Rewards Progress</span>
              </button>
            </div>
          )}

          {/* Bottom Bar inside phone */}
          <div className="flex items-center justify-between border-t border-(--mainColor)/10 pt-2 text-[10px] text-(--mainColor)/60">
            <span className="flex items-center gap-1">
              <LuCheck className="h-3 w-3 text-emerald-600" />
              Verified Cafe in Egypt
            </span>
            <span>Notch</span>
          </div>
        </div>
      </div>
    </div>
  );
}
