"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  LuCoffee,
  LuSparkles,
  LuQrCode,
  LuStore,
  LuUtensils,
  LuCompass,
  LuTrendingUp,
} from "react-icons/lu";
import { HERO_CONTENT } from "../content";
import { useMarketingLanguage, I18N_CONTENT } from "../i18n";

export default function HeroPhoneMockup() {
  const { language } = useMarketingLanguage();
  const t = (I18N_CONTENT[language] || I18N_CONTENT.en).hero.mockup;
  const isRtl = language === "ar";
  const shouldReduceMotion = useReducedMotion();

  const [activeTab, setActiveTab] = useState("card"); // "card" | "menu" | "qr"
  const targetStamps = 8;
  const currentStamps = 5;

  // Grid of 8 stamps: 5 completed, 3 remaining
  const slots = Array.from({ length: targetStamps }, (_, i) => ({
    number: i + 1,
    isStamped: i < currentStamps,
    isTarget: i === targetStamps - 1,
  }));

  // Subtle floating animation variants (6s easeInOut infinite)
  const floatVariant1 = {
    animate: shouldReduceMotion
      ? {}
      : {
          y: [-4, 5, -4],
          transition: {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          },
        },
  };

  const floatVariant2 = {
    animate: shouldReduceMotion
      ? {}
      : {
          y: [4, -5, 4],
          transition: {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          },
        },
  };

  const floatVariant3 = {
    animate: shouldReduceMotion
      ? {}
      : {
          y: [-5, 4, -5],
          transition: {
            duration: 6.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          },
        },
  };

  return (
    <div className="relative mx-auto w-full max-w-[340px] sm:max-w-[380px]">
      {/* Decorative Warm Ambient Glow Behind Phone */}
      <div
        className="pointer-events-none absolute -inset-4 rounded-[48px] bg-gradient-to-tr from-(--secondColor)/25 via-(--mainColor)/15 to-transparent blur-2xl dark:from-(--secondColor)/15 dark:via-(--mainColor)/25"
        aria-hidden="true"
      />

      {/* 1. Floating Card: Discover & Exposure (Repositioned with proper offset so it never clips) */}
      <motion.div
        variants={floatVariant1}
        animate="animate"
        className="absolute -top-3 -start-4 sm:-start-8 z-30 hidden items-center gap-2.5 rounded-2xl border border-(--mainColor)/15 bg-(--bgColor) px-3.5 py-2 shadow-lg sm:flex"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-(--secondColor) text-[#271307] shadow-2xs">
          <LuCompass className="h-4 w-4" />
        </span>
        <div className="text-start">
          <p className="text-xs font-bold text-(--mainColor) leading-tight">
            {t.floatingDiscovery.title}
          </p>
          <p className="text-[10px] font-medium text-(--mainColor)/70 leading-tight">
            {t.floatingDiscovery.subtitle}
          </p>
        </div>
      </motion.div>

      {/* 2. Floating Card: Growth & Retention for Cafe Owners (New Third Floating Card) */}
      <motion.div
        variants={floatVariant3}
        animate="animate"
        className="absolute top-1/3 -end-4 sm:-end-10 z-30 hidden items-center gap-2.5 rounded-2xl border border-(--mainColor)/15 bg-(--bgColor) px-3.5 py-2 shadow-lg sm:flex"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-(--mainColor) text-(--secondColor) shadow-2xs">
          <LuTrendingUp className="h-4 w-4" />
        </span>
        <div className="text-start">
          <p className="text-xs font-bold text-(--mainColor) leading-tight">
            {t.floatingGrowth.title}
          </p>
          <p className="text-[10px] font-medium text-(--mainColor)/70 leading-tight">
            {t.floatingGrowth.subtitle}
          </p>
        </div>
      </motion.div>

      {/* 3. Floating Card: Next Visit Reward */}
      <motion.div
        variants={floatVariant2}
        animate="animate"
        className="absolute -bottom-4 -end-3 sm:-end-6 z-30 hidden items-center gap-2.5 rounded-2xl border border-(--mainColor)/15 bg-(--bgColor) px-3.5 py-2 shadow-lg sm:flex"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#271307] text-(--secondColor) shadow-2xs">
          <LuCoffee className="h-4 w-4" />
        </span>
        <div className="text-start">
          <p className="text-xs font-bold text-(--mainColor) leading-tight">
            {t.floatingReward.title}
          </p>
          <p className="text-[10px] font-medium text-(--mainColor)/70 leading-tight">
            {t.floatingReward.subtitle}
          </p>
        </div>
      </motion.div>

      {/* Phone Hardware Frame */}
      <div className="relative rounded-[42px] border-4 border-[#3B2418]/85 bg-[#1F140E] p-3 shadow-2xl transition-all">
        {/* Dynamic Island / Speaker Pill */}
        <div className="mx-auto mb-2 h-4 w-24 rounded-full bg-black/60 flex items-center justify-center">
          <div className="h-2 w-2 rounded-full bg-black/80 ms-4" />
        </div>

        {/* Screen Content Canvas (Tightened vertical spacing, no awkward gap) */}
        <div className="relative min-h-[510px] rounded-[32px] bg-(--bgColor) p-4 text-(--mainColor) overflow-hidden flex flex-col justify-between">
          <div>
            {/* Header inside phone: Increased font sizes & removed duplicated sample text */}
            <div className="flex items-center justify-between border-b border-(--mainColor)/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-(--secondColor) text-[#271307] shadow-xs">
                  <LuStore className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold leading-tight text-(--mainColor)">
                    {t.cafeName}
                  </h4>
                  <p className="text-[11px] font-semibold text-(--mainColor)/70">
                    {t.category}
                  </p>
                </div>
              </div>

              {/* Single clean sample badge (no duplicated (Sample) text) */}
              <span className="rounded-full bg-(--secondColor)/25 px-2.5 py-1 text-[10px] font-bold text-(--mainColor) border border-(--secondColor)/40">
                {t.sampleBadge}
              </span>
            </div>

            {/* Quick Switch Tabs inside mockup: Increased font sizes */}
            <div className="mt-3.5 grid grid-cols-3 rounded-xl bg-(--mainColor)/10 p-1 text-xs font-bold text-center">
              <button
                type="button"
                onClick={() => setActiveTab("card")}
                className={`rounded-lg py-2 transition cursor-pointer ${
                  activeTab === "card"
                    ? "bg-(--bgColor) text-(--mainColor) shadow-xs font-black"
                    : "text-(--mainColor)/70 hover:text-(--mainColor)"
                }`}
              >
                {t.tabRewards}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("menu")}
                className={`rounded-lg py-2 transition cursor-pointer ${
                  activeTab === "menu"
                    ? "bg-(--bgColor) text-(--mainColor) shadow-xs font-black"
                    : "text-(--mainColor)/70 hover:text-(--mainColor)"
                }`}
              >
                {t.tabMenu}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("qr")}
                className={`rounded-lg py-2 transition cursor-pointer ${
                  activeTab === "qr"
                    ? "bg-(--bgColor) text-(--mainColor) shadow-xs font-black"
                    : "text-(--mainColor)/70 hover:text-(--mainColor)"
                }`}
              >
                {t.tabQr}
              </button>
            </div>
          </div>

          {/* Tab 1: Rewards Stamp Progress: Empty gap closed, moved up directly under tabs */}
          {activeTab === "card" && (
            <div className="pt-3 pb-2 space-y-3">
              <div className="relative rounded-2xl border-2 border-(--mainColor)/15 bg-(--mainColor)/5 p-3.5 shadow-xs">
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
                  <span className="text-xs font-extrabold tracking-wider text-(--mainColor)/80 uppercase">
                    {t.visitRewards}
                  </span>
                  <span className="font-mono text-sm font-extrabold text-(--mainColor)">
                    {t.visitsCount.replace("{current}", currentStamps).replace("{target}", targetStamps)}
                  </span>
                </div>

                {/* 8-Slot Stamp Grid */}
                <div className="mt-3.5 grid grid-cols-4 gap-2.5">
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
                            delay: 0.1 * idx,
                          }}
                          className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-dashed border-(--mainColor) bg-(--secondColor) text-[#271307] shadow-xs"
                        >
                          <LuCoffee className="h-5 w-5" />
                        </motion.div>
                      ) : slot.isTarget ? (
                        <div className="flex flex-col items-center justify-center text-center p-1">
                          <LuSparkles className="h-4 w-4 text-(--secondColor) animate-pulse" />
                          <span className="text-[10px] font-black text-(--mainColor)/75">
                            {t.freeTag}
                          </span>
                        </div>
                      ) : (
                        <span className="font-mono text-xs font-bold text-(--mainColor)/45">
                          {slot.number}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Reward Description */}
                <div className="mt-3 rounded-xl bg-(--secondColor)/20 p-2 text-center border border-(--secondColor)/30">
                  <p className="text-xs font-bold text-(--mainColor)">
                    {t.rewardText}
                  </p>
                </div>
              </div>

              {/* Show QR Action: Increased font size and padding */}
              <button
                type="button"
                onClick={() => setActiveTab("qr")}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-(--mainColor) py-3 text-xs sm:text-sm font-extrabold text-(--bgColor) shadow-xs transition hover:opacity-95 active:scale-[0.98] cursor-pointer"
              >
                <LuQrCode className="h-4.5 w-4.5" />
                <span>{t.showQrBtn}</span>
              </button>
            </div>
          )}

          {/* Tab 2: Digital Menu Preview inside phone */}
          {activeTab === "menu" && (
            <div className="pt-3 pb-2 space-y-2.5 text-start">
              <div className="flex items-center justify-between pb-1 border-b border-(--mainColor)/10">
                <span className="text-xs font-bold text-(--mainColor)">Specialty Drinks</span>
                <span className="text-[11px] font-bold text-(--secondColor)">Cairo Roastery</span>
              </div>

              {t.menuItems.map((item) => (
                <div
                  key={item.name}
                  className="rounded-xl border border-(--mainColor)/15 bg-(--mainColor)/5 p-2.5 flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-bold text-(--mainColor)">{item.name}</p>
                    <p className="text-[10px] text-(--mainColor)/65">{item.desc}</p>
                  </div>
                  <span className="text-xs font-extrabold text-(--mainColor)">{item.price}</span>
                </div>
              ))}

              <p className="text-[10px] text-center text-(--mainColor)/65 pt-1">
                {t.menuNote}
              </p>
            </div>
          )}

          {/* Tab 3: Customer QR Code View inside phone */}
          {activeTab === "qr" && (
            <div className="pt-3 pb-2 text-center space-y-3">
              <div className="rounded-2xl border-2 border-dashed border-(--mainColor)/20 bg-(--mainColor)/5 p-4">
                <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-2xl border-2 border-(--mainColor) bg-white p-2.5 shadow-sm">
                  {/* Stylized QR placeholder SVG with high contrast */}
                  <div className="grid h-full w-full grid-cols-4 gap-1 rounded-lg bg-(--mainColor) p-2 text-white">
                    <div className="rounded bg-white" />
                    <div className="rounded bg-(--mainColor)" />
                    <div className="rounded bg-white" />
                    <div className="rounded bg-white" />
                    <div className="rounded bg-white" />
                    <div className="rounded bg-(--secondColor)" />
                    <div className="rounded bg-white" />
                    <div className="rounded bg-(--mainColor)" />
                    <div className="rounded bg-(--mainColor)" />
                    <div className="rounded bg-white" />
                    <div className="rounded bg-(--secondColor)" />
                    <div className="rounded bg-white" />
                    <div className="rounded bg-white" />
                    <div className="rounded bg-white" />
                    <div className="rounded bg-(--mainColor)" />
                    <div className="rounded bg-white" />
                  </div>
                </div>

                <div className="mt-2.5">
                  <p className="font-mono text-xs font-black tracking-wider text-(--mainColor)">
                    {t.qrCodeHint}
                  </p>
                  <p className="text-[10px] font-medium text-(--mainColor)/70">
                    {t.qrInstruction}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Bar inside phone */}
          <div className="pt-2.5 border-t border-(--mainColor)/10 text-center">
            <span className="text-[10px] font-bold text-(--mainColor)/60">
              Instant mobile web • No app download
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
