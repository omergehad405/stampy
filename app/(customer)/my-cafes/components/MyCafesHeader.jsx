"use client";

import React, { useState } from "react";
import { LuCompass, LuBell } from "react-icons/lu";

import ThemeToggle from "@/app/components/ui/ThemeToggle";
import NotificationBox from "@/app/components/layout/NotificationBox";

export default function MyCafesHeader() {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between gap-3 pb-3 border-b border-(--mainColor)/10">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-(--mainColor) flex items-center justify-center text-(--bgColor) shadow-sm shrink-0">
            <LuCompass className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm lg:text-base font-bold leading-tight text-(--mainColor) truncate">
              Stampy
            </h2>
            <p className="text-[11px] sm:text-xs font-medium opacity-70 truncate">
              Digital Loyalty
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <ThemeToggle />

          <button
            type="button"
            aria-label="Open notifications"
            onClick={() => setIsNotificationOpen(true)}
            className="relative p-2 rounded-full hover:bg-(--mainColor)/10 text-(--mainColor) transition-colors cursor-pointer shrink-0"
          >
            <LuBell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-(--secondColor) opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-(--secondColor)"></span>
            </span>
          </button>
        </div>
      </header>

      <NotificationBox
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </>
  );
}
