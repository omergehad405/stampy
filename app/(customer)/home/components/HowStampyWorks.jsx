"use client";

import React from "react";
import { motion } from "framer-motion";
import { LuStore, LuQrCode, LuSparkles, LuArrowDown } from "react-icons/lu";

export default function HowStampyWorks() {
  const steps = [
    {
      step: "01",
      title: "Join Your Favorite Cafés",
      description:
        "Browse independent local cafés in our directory and join their loyalty cards with a single tap.",
      icon: LuStore,
      iconBg: "bg-(--secondColor) text-[#3B2418]",
    },
    {
      step: "02",
      title: "Show Your QR Code",
      description:
        "When paying at checkout, present your personal Stampy QR code to the barista to collect your stamp.",
      icon: LuQrCode,
      iconBg: "bg-(--bgColor)/15 text-(--bgColor)",
    },
    {
      step: "03",
      title: "Unlock Free Treats",
      description:
        "Watch your stamp progress grow and redeem free coffees, fresh pastries, and special member discounts.",
      icon: LuSparkles,
      iconBg: "bg-(--secondColor) text-[#3B2418]",
    },
  ];

  return (
    <section aria-label="How Stampy Works" className="space-y-4">
      <div className="rounded-3xl p-6 sm:p-8 bg-(--mainColor) text-(--bgColor) border border-(--bgColor)/15 shadow-sm">
        <div className="max-w-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-(--secondColor) flex items-center gap-1.5">
            <LuSparkles className="w-3.5 h-3.5" />
            <span>New to Stampy?</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-(--bgColor) tracking-tight mt-1">
            How Your Digital Loyalty Journey Works
          </h2>
          <p className="text-xs sm:text-sm text-(--bgColor)/75 mt-1 leading-relaxed">
            Never lose a paper loyalty card again. Collect stamps across all your favorite neighborhood cafés with one seamless account.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {steps.map((s, index) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.08 }}
                className="relative p-5 rounded-2xl bg-(--bgColor)/10 text-(--bgColor) border border-(--bgColor)/15 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${s.iconBg}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-(--bgColor)/15 text-(--bgColor)">
                      Step {s.step}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-(--bgColor)">
                    {s.title}
                  </h3>
                  <p className="text-xs text-(--bgColor)/75 mt-1 leading-relaxed">
                    {s.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-(--bgColor)/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-xs font-semibold text-(--bgColor)">
            Ready to get started? Explore cafés below to join your first loyalty program!
          </p>
          <a
            href="#discover-cafes-section"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-(--secondColor) hover:underline"
          >
            <span>Jump to Discover Cafés</span>
            <LuArrowDown className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
