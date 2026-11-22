"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LuCoffee, LuBell, LuQrCode, LuUser, LuSparkles } from "react-icons/lu";
import ThemeToggle from "@/app/components/ui/ThemeToggle";
import NotificationBox from "@/app/components/layout/NotificationBox";
import CustomerQrModal from "./CustomerQrModal";
import { useNotificationStore } from "@/app/stores/useNotificationStore";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
}

export default function WelcomeHeader({ user }) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  const { notifications } = useNotificationStore();
  const unreadCount = notifications.filter((n) => n.unread).length;

  const greeting = getGreeting();
  const fullName = user?.name || "Customer";
  const firstName = fullName.split(" ")[0];

  // Derive initials for avatar
  const initials = fullName
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="space-y-6">
      {/* Top Global Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-(--mainColor)/10">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl  flex items-center justify-center text-(--bgColor) shadow-sm shrink-0">
            <img src="/logo.png" alt="" className="rounded-xl" />
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
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-(--secondColor) opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-(--secondColor)"></span>
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Greeting & Customer Profile Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div className="flex items-center gap-3.5 sm:gap-4">
          {/* Avatar with click to profile */}
          <Link
            href="/profile"
            aria-label="View Profile"
            className="group relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-(--mainColor) text-(--bgColor) flex items-center justify-center font-bold text-base sm:text-lg shadow-sm hover:scale-105 transition-transform shrink-0 border-2 border-(--bgColor)/20 overflow-hidden"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={fullName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              initials || <LuUser className="w-6 h-6" />
            )}
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-(--bgColor)" />
          </Link>

          <div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-(--mainColor) mt-0.5">
              <span>{greeting}, </span>
              <span className="underline decoration-(--secondColor) decoration-4 underline-offset-4">
                {firstName}
              </span>
              <span>!</span>
            </h1>

            <p className="text-xs sm:text-sm text-(--mainColor)/75 mt-1">
              Here&apos;s what&apos;s happening with your loyalty journey.
            </p>
          </div>
        </div>

        {/* Quick QR code CTA */}
        <div className="flex items-center gap-2.5 sm:self-center shrink-0">
          <button
            type="button"
            onClick={() => setIsQrModalOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-(--secondColor) hover:opacity-90 active:scale-95 text-[#3B2418] font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
          >
            <LuQrCode className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            <span>My Loyalty QR</span>
          </button>
        </div>
      </div>

      {/* Notifications Drawer */}
      <NotificationBox
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />

      {/* Personal QR Code Modal */}
      <CustomerQrModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        user={user}
      />
    </header>
  );
}
