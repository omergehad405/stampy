"use client";

import React, { useState } from "react";
import { LuCoffee, LuBell, LuStore } from "react-icons/lu";

import ThemeToggle from "@/app/components/ui/ThemeToggle";
import NotificationBox from "@/app/components/layout/NotificationBox";
import { useNotificationStore } from "@/app/stores/useNotificationStore";

import { useCafeData } from "@/app/features/cafe/useCafeData";
import CafeHeader from "@/app/features/cafe/CafeHeader";
import CafeAbout from "@/app/features/cafe/CafeAbout";
import CafeInformation from "@/app/features/cafe/CafeInformation";
import CafeSocialLinks from "@/app/features/cafe/CafeSocialLinks";
import CafeMenuTeaser from "@/app/features/cafe/CafeMenuTeaser";
import CafeSkeleton from "@/app/features/cafe/CafeSkeleton";

export default function CafeProfilePage() {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { notifications } = useNotificationStore();
  const unreadCount = notifications.filter((n) => n.unread).length;

  const { cafe, isLoading, operatingStatus } = useCafeData();

  return (
    <div className="w-full max-w-md md:max-w-4xl lg:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-10 pb-12">
      {/* Top Bar Navigation */}
      <header className="flex items-center justify-between pb-4 sm:pb-6">
        {/* Brand identity pill */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-[var(--mainColor)] flex items-center justify-center text-[var(--bgColor)] shadow-sm">
            <LuStore className="w-4 h-4 lg:w-5 lg:h-5" />
          </div>
          <div>
            <h2 className="text-sm lg:text-base font-bold leading-tight text-[var(--mainColor)]">
              {cafe?.name || "Cafe Partner"}
            </h2>
            <p className="text-xs lg:text-sm font-medium leading-tight opacity-70">
              Loyalty Program Host
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
            type="button"
            aria-label="Open notifications"
            onClick={() => setIsNotificationOpen(true)}
            className="relative p-2 rounded-full hover:bg-[var(--mainColor)]/10 text-[var(--mainColor)] transition-colors cursor-pointer"
          >
            <LuBell className="w-5 h-5 lg:w-6 lg:h-6" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--secondColor)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--secondColor)]"></span>
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      {isLoading ? (
        <CafeSkeleton />
      ) : (
        <main className="space-y-6 sm:space-y-8">
          {/* Section A: Cover & Identity Header */}
          <CafeHeader cafe={cafe} operatingStatus={operatingStatus} />

          {/* Section B: About the Cafe */}
          <CafeAbout about={cafe?.about} />

          {/* Section C: Cafe Information (Location, Hours, Contact, Website) */}
          <CafeInformation cafe={cafe} operatingStatus={operatingStatus} />

          {/* Section D: Social Media Accounts */}
          <CafeSocialLinks socialMedia={cafe?.socialMedia} />

          {/* Section E: Future Digital Menu Teaser Section */}
          <CafeMenuTeaser menuPreview={cafe?.menuPreview} />

          {/* Trust & Brand Footer Note */}
          <footer className="pt-6 sm:pt-8 text-center text-xs text-[var(--mainColor)]/50 border-t border-[var(--mainColor)]/10">
            <p className="flex items-center justify-center gap-1.5">
              <LuCoffee className="w-3.5 h-3.5 text-[var(--mainColor)]/40" />
              <span>
                You scanned {cafe?.name || "this cafe"}&apos;s code on Stampy
              </span>
            </p>
            <p className="mt-1 text-[11px] opacity-75">
              Digital Loyalty Card Platform • Every visit counts
            </p>
          </footer>
        </main>
      )}

      {/* Notification Drawer */}
      <NotificationBox
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </div>
  );
}
