"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  LuArrowDown,
  LuCalendar,
  LuCircleCheck,
  LuClock,
  LuCoffee,
  LuQrCode,
  LuScanQrCode,
  LuX,
  LuSparkles,
  LuStore,
  LuGift,
  LuCheck,
  LuMapPin,
  LuPlus,
  LuHistory,
} from "react-icons/lu";

import CafeTopBar from "./CafeTopBar";
import { getCafeBySlug } from "@/app/features/cafe/cafesCatalog";
import { useLoyaltyStore } from "@/app/stores/useLoyaltyStore";
import RewardVisual from "@/app/features/rewards/RewardVisual";

// Barista coffee tamper icon for earned stamps
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

// Clean scalable QR Code SVG
function QRCodeGraphic({ className = "w-36 h-36" }) {
  return (
    <svg
      viewBox="0 0 29 29"
      fill="currentColor"
      className={className}
      shapeRendering="crispEdges"
      aria-label="Loyalty QR Code"
    >
      <rect x="2" y="2" width="7" height="7" fill="currentColor" />
      <rect x="3" y="3" width="5" height="5" fill="var(--whiteCardBg, white)" />
      <rect x="4" y="4" width="3" height="3" fill="currentColor" />
      <rect x="20" y="2" width="7" height="7" fill="currentColor" />
      <rect x="21" y="3" width="5" height="5" fill="var(--whiteCardBg, white)" />
      <rect x="22" y="4" width="3" height="3" fill="currentColor" />
      <rect x="2" y="20" width="7" height="7" fill="currentColor" />
      <rect x="3" y="21" width="5" height="5" fill="var(--whiteCardBg, white)" />
      <rect x="4" y="22" width="3" height="3" fill="currentColor" />
      <rect x="18" y="18" width="5" height="5" fill="currentColor" />
      <rect x="19" y="19" width="3" height="3" fill="var(--whiteCardBg, white)" />
      <rect x="20" y="20" width="1" height="1" fill="currentColor" />
      <rect x="10" y="5" width="1" height="1" fill="currentColor" />
      <rect x="12" y="5" width="1" height="1" fill="currentColor" />
      <rect x="14" y="5" width="1" height="1" fill="currentColor" />
      <rect x="16" y="5" width="1" height="1" fill="currentColor" />
      <rect x="18" y="5" width="1" height="1" fill="currentColor" />
      <rect x="5" y="10" width="1" height="1" fill="currentColor" />
      <rect x="5" y="12" width="1" height="1" fill="currentColor" />
      <rect x="5" y="14" width="1" height="1" fill="currentColor" />
      <rect x="5" y="16" width="1" height="1" fill="currentColor" />
      <rect x="5" y="18" width="1" height="1" fill="currentColor" />
      <rect x="10" y="2" width="2" height="1" fill="currentColor" />
      <rect x="14" y="2" width="1" height="2" fill="currentColor" />
      <rect x="17" y="3" width="2" height="1" fill="currentColor" />
      <rect x="11" y="7" width="3" height="1" fill="currentColor" />
      <rect x="16" y="8" width="2" height="2" fill="currentColor" />
      <rect x="10" y="10" width="2" height="2" fill="currentColor" />
      <rect x="13" y="10" width="2" height="1" fill="currentColor" />
      <rect x="17" y="11" width="1" height="3" fill="currentColor" />
      <rect x="20" y="10" width="2" height="1" fill="currentColor" />
      <rect x="24" y="11" width="2" height="2" fill="currentColor" />
      <rect x="11" y="13" width="1" height="3" fill="currentColor" />
      <rect x="13" y="13" width="3" height="2" fill="currentColor" />
      <rect x="21" y="13" width="3" height="1" fill="currentColor" />
      <rect x="2" y="11" width="2" height="1" fill="currentColor" />
      <rect x="7" y="11" width="1" height="2" fill="currentColor" />
      <rect x="2" y="14" width="1" height="2" fill="currentColor" />
      <rect x="10" y="17" width="2" height="2" fill="currentColor" />
      <rect x="14" y="17" width="2" height="1" fill="currentColor" />
      <rect x="25" y="16" width="2" height="2" fill="currentColor" />
      <rect x="11" y="21" width="2" height="1" fill="currentColor" />
      <rect x="14" y="20" width="1" height="3" fill="currentColor" />
      <rect x="16" y="22" width="2" height="1" fill="currentColor" />
      <rect x="24" y="21" width="2" height="2" fill="currentColor" />
      <rect x="10" y="25" width="3" height="1" fill="currentColor" />
      <rect x="15" y="24" width="2" height="2" fill="currentColor" />
      <rect x="19" y="25" width="2" height="1" fill="currentColor" />
      <rect x="23" y="25" width="3" height="1" fill="currentColor" />
    </svg>
  );
}

function DedicatedCafePageContent() {
  const params = useParams();
  const slug = params?.slug;

  const cafe = getCafeBySlug(slug);
  const { user, isCafeJoined, getMembership, joinCafe } = useLoyaltyStore();

  const isJoined = isCafeJoined(slug);
  const membership = getMembership(slug);

  // Home Page State
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isBadgeHighlighted, setIsBadgeHighlighted] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const qrSectionRef = useRef(null);

  const scrollToQr = () => {
    setIsBadgeHighlighted(true);
    if (qrSectionRef.current) {
      qrSectionRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    setTimeout(() => {
      setIsBadgeHighlighted(false);
    }, 2500);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsQrModalOpen(false);
    };
    if (isQrModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isQrModalOpen]);

  // Handle Joining Cafe
  const handleJoinCafe = () => {
    setIsJoining(true);
    setTimeout(() => {
      const result = joinCafe(slug);
      setIsJoining(false);
      if (result.success) {
        toast(`🎉 Welcome to ${cafe?.name}! Your loyalty card is ready.`, {
          type: "success",
        });
      }
    }, 300);
  };

  if (!cafe) {
    return (
      <div className="w-full max-w-md mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[var(--mainColor)]/10 text-[var(--mainColor)] flex items-center justify-center mx-auto mb-4">
          <LuStore className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold">Cafe Not Found</h2>
        <p className="text-xs opacity-75 mt-1.5">
          The cafe identifier you scanned is not registered on Stampy.
        </p>
        <Link
          href="/my-cafes"
          className="mt-6 inline-flex px-5 py-2.5 rounded-xl bg-[var(--secondColor)] text-[#3b2418] font-bold text-xs"
        >
          View My Cafes
        </Link>
      </div>
    );
  }

  // --- SCENARIO A: PUBLIC CAFE LANDING (Customer has NOT joined yet) ---
  if (!isJoined) {
    return (
      <div className="w-full max-w-md md:max-w-4xl lg:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-10 pb-16">
        <CafeTopBar cafe={cafe} />

        {/* Public Hero Banner */}
        <section className="relative mt-6 rounded-3xl overflow-hidden border border-[var(--mainColor)]/15 shadow-sm bg-[var(--mainColor)] text-[var(--bgColor)]">
          <div className="relative h-48 sm:h-64 lg:h-72 w-full">
            {cafe.coverImage && (
              <Image
                src={cafe.coverImage}
                alt={cafe.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-cover opacity-45"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--mainColor)] via-[var(--mainColor)]/70 to-transparent" />

            <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-white/20 border-2 border-[var(--bgColor)]/30 shrink-0 shadow-md">
                  {cafe.logoImage ? (
                    <Image
                      src={cafe.logoImage}
                      alt={cafe.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <LuStore className="w-6 h-6" />
                    </div>
                  )}
                </div>

                <div>
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-[var(--secondColor)] text-[#3b2418] px-2.5 py-0.5 rounded-full">
                    {cafe.category}
                  </span>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold mt-1">
                    {cafe.name}
                  </h1>
                  <p className="text-xs sm:text-sm opacity-80 flex items-center gap-1 mt-0.5">
                    <LuMapPin className="w-3.5 h-3.5" />
                    <span>{cafe.location?.district || cafe.location?.city}</span>
                    <span>•</span>
                    <span>{cafe.stampTarget}-Stamp Loyalty Program</span>
                  </p>
                </div>
              </div>

              {/* Join CTA on Hero */}
              <button
                type="button"
                onClick={handleJoinCafe}
                disabled={isJoining}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--secondColor)] text-[#3b2418] font-bold text-sm sm:text-base hover:opacity-95 active:scale-95 transition-all shadow-md cursor-pointer shrink-0"
              >
                <LuSparkles className="w-4 h-4 text-amber-800" />
                <span>{isJoining ? "Joining..." : "Join Loyalty Program"}</span>
              </button>
            </div>
          </div>
        </section>

        {/* Value Proposition Card */}
        <section className="mt-6 p-5 sm:p-6 rounded-3xl bg-white/70 dark:bg-black/20 border border-[var(--mainColor)]/15 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[var(--mainColor)]">
                Start earning stamps with {cafe.name}
              </h3>
              <p className="text-xs sm:text-sm text-[var(--mainColor)]/75 mt-1 max-w-lg">
                Join with your existing Stampy account in one tap. Every visit earns you a stamp towards free specialty coffee, pastries, and exclusive discounts.
              </p>
            </div>

            <button
              type="button"
              onClick={handleJoinCafe}
              disabled={isJoining}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--mainColor)] text-[var(--bgColor)] font-bold text-xs sm:text-sm shadow-xs hover:opacity-90 active:scale-95 transition cursor-pointer"
            >
              <LuPlus className="w-4 h-4" />
              <span>Join Now (Free)</span>
            </button>
          </div>
        </section>

        {/* Preview of Rewards */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-semibold tracking-wider uppercase opacity-60">
                LOYALTY CATALOG
              </p>
              <h2 className="text-lg sm:text-xl font-bold text-[var(--mainColor)]">
                Rewards You&apos;ll Unlock
              </h2>
            </div>
            <Link
              href={`/cafe/${slug}/rewards`}
              className="text-xs font-semibold text-[var(--mainColor)] underline underline-offset-4"
            >
              View Full Menu
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(cafe.rewards || []).map((reward) => (
              <div
                key={reward.id}
                className="rounded-2xl p-4 bg-white/60 dark:bg-black/20 border border-[var(--mainColor)]/10 shadow-xs flex flex-col justify-between"
              >
                <div className="flex items-start gap-3">
                  <RewardVisual iconType={reward.iconType} className="w-10 h-10 shrink-0" />
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-[var(--mainColor)] truncate">
                      {reward.name}
                    </h4>
                    <p className="text-xs opacity-70 line-clamp-2 mt-0.5">
                      {reward.description}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[var(--mainColor)]/10 flex items-center justify-between text-xs">
                  <span className="font-bold text-[var(--mainColor)]">
                    {reward.stampsRequired} Stamps
                  </span>
                  <span className="text-[11px] opacity-60">
                    {reward.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cafe Information Teaser */}
        <section className="mt-8 p-5 sm:p-6 rounded-3xl bg-white/50 dark:bg-black/10 border border-[var(--mainColor)]/10">
          <h3 className="text-base font-bold text-[var(--mainColor)]">
            About {cafe.name}
          </h3>
          <p className="text-xs sm:text-sm text-[var(--mainColor)]/75 mt-1.5 leading-relaxed">
            {cafe.about?.shortDescription || cafe.tagline}
          </p>

          <div className="mt-4 flex items-center gap-3">
            <Link
              href={`/cafe/${slug}/info`}
              className="text-xs font-bold text-[var(--mainColor)] underline underline-offset-4"
            >
              Read full hours, location & story →
            </Link>
          </div>
        </section>
      </div>
    );
  }

  // --- SCENARIO B: CAFE HOME PAGE (Customer HAS joined) ---
  const currentStamps = membership?.stamps ?? 0;
  const totalStamps = membership?.totalStamps ?? cafe?.stampTarget ?? 10;
  const stamps = Array.from({ length: totalStamps }, (_, i) => i + 1);
  const recentActivities = (membership?.history || []).slice(0, 5);

  return (
    <div className="w-full max-w-md md:max-w-4xl lg:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-10 pb-12">
      {/* Top Bar with Return to My Cafes */}
      <CafeTopBar cafe={cafe} />

      {/* Main Responsive Layout */}
      <div className="md:grid md:grid-cols-12 md:gap-6 lg:gap-10 items-start mt-4 lg:mt-8">
        {/* Left Column: Greeting, Progress, Stamps */}
        <div className="md:col-span-7 flex flex-col gap-6">
          {/* Greeting */}
          <section>
            <p className="text-xs font-semibold tracking-wider uppercase opacity-60">
              {cafe.name} LOYALTY CARD
            </p>
            <h1 className="text-2xl lg:text-3xl font-bold mt-0.5 flex items-center gap-2">
              <span>Hello, {user?.name?.split(" ")[0] || "Customer"}</span>
              <span className="text-2xl lg:text-3xl">👋</span>
            </h1>
            <p className="text-xs sm:text-sm lg:text-base opacity-70 mt-1">
              Your next reward at {cafe.name} is getting closer!
            </p>
          </section>

          {/* Progress Card */}
          <section className="bg-[var(--mainColor)] text-[var(--bgColor)] rounded-2xl lg:rounded-3xl p-4 sm:p-5 lg:p-6 shadow-sm transition-colors duration-300">
            <div className="flex items-center justify-between text-sm lg:text-base font-bold">
              <span>Your Progress</span>
              <span>
                {currentStamps} / {totalStamps}
              </span>
            </div>

            <div
              className="grid gap-1.5 sm:gap-2 my-3 lg:my-4"
              style={{ gridTemplateColumns: `repeat(${totalStamps}, minmax(0, 1fr))` }}
            >
              {stamps.map((num) => (
                <div
                  key={num}
                  className={`h-1.5 sm:h-2 rounded-full transition-colors duration-300 ${
                    num <= currentStamps
                      ? "bg-[var(--bgColor)]"
                      : "opacity-30 bg-[var(--bgColor)]"
                  }`}
                />
              ))}
            </div>

            <p className="text-xs sm:text-sm opacity-80">
              Collect {Math.max(0, totalStamps - currentStamps)} more stamps to unlock your reward.
            </p>
          </section>

          {/* Stamps Grid */}
          <section>
            <h3 className="text-base lg:text-lg font-bold mb-3">Your Stamps</h3>

            <div className="grid grid-cols-5 gap-2 sm:gap-3 lg:gap-3.5">
              {stamps.map((num) => {
                const isCollected = num <= currentStamps;
                return (
                  <div
                    key={num}
                    className={`aspect-[4/5] rounded-2xl lg:rounded-3xl flex flex-col items-center justify-center gap-1.5 lg:gap-2 transition-all duration-300 ${
                      isCollected
                        ? "bg-[var(--mainColor)] text-[var(--bgColor)] shadow-sm hover:scale-[1.03]"
                        : "bg-[var(--bgColor)] text-[var(--mainColor)] border border-[var(--mainColor)] opacity-70"
                    }`}
                  >
                    {isCollected ? (
                      <TamperIcon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                    ) : (
                      <LuCoffee className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                    )}
                    <span className="text-[11px] sm:text-xs lg:text-sm font-semibold">
                      {num}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Recent 5 Activities Section */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base lg:text-lg font-bold">Recent Activity</h3>
              <Link
                href={`/cafe/${slug}/rewards`}
                className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--secondColor)]/20 text-[var(--mainColor)] hover:opacity-90 transition"
              >
                Rewards History →
              </Link>
            </div>

            {recentActivities.length === 0 ? (
              <div className="rounded-2xl p-4 border border-[var(--mainColor)]/10 text-center text-xs opacity-70">
                No visits recorded yet. Show your QR code at the cashier!
              </div>
            ) : (
              <div className="space-y-2.5">
                {recentActivities.map((act) => (
                  <div
                    key={act.id}
                    className="rounded-2xl p-3.5 sm:p-4 border border-[var(--mainColor)]/15 bg-white/60 dark:bg-black/20 shadow-xs flex items-center justify-between gap-3 text-xs sm:text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[var(--mainColor)] text-[var(--bgColor)] flex items-center justify-center shrink-0">
                        {act.type === "redemption" ? (
                          <LuGift className="w-4 h-4" />
                        ) : (
                          <LuCoffee className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-[var(--mainColor)]">
                          {act.title}
                        </p>
                        <p className="text-[11px] opacity-70">
                          {act.date} • {act.description}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                        act.stampsDelta > 0
                          ? "text-emerald-700 bg-emerald-100"
                          : "text-amber-700 bg-amber-100"
                      }`}
                    >
                      {act.stampsDelta > 0 ? `+${act.stampsDelta}` : act.stampsDelta}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right Column: QR Code Card */}
        <div className="md:col-span-5 mt-6 md:mt-0 md:sticky md:top-6 lg:top-8">
          <section
            ref={qrSectionRef}
            id="qr-section"
            className={`bg-white rounded-3xl p-5 sm:p-6 lg:p-7 shadow-sm border transition-all duration-500 ${
              isBadgeHighlighted
                ? "border-[var(--secondColor)] ring-4 ring-[var(--secondColor)]/70 shadow-xl scale-[1.01]"
                : "border-[#3b2418]"
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <LuScanQrCode className="w-4 h-4 lg:w-5 lg:h-5 opacity-70 text-[#3b2418]" />
              <h4 className="text-sm lg:text-base font-bold text-[#3b2418]">
                {cafe.name} QR Code
              </h4>
            </div>

            <div className="border border-[#3b2418] rounded-2xl lg:rounded-3xl p-4 sm:p-6 bg-white flex items-center justify-center my-3 max-w-[210px] sm:max-w-[230px] lg:max-w-[250px] mx-auto w-full aspect-square transition-colors duration-300">
              <QRCodeGraphic className="w-32 h-32 sm:w-36 sm:h-36 lg:w-44 lg:h-44 text-[#3b2418]" />
            </div>

            <p className="text-xs sm:text-sm text-center opacity-70 mt-3 text-[#3b2418]">
              Show this code to the barista at {cafe.name} to collect stamps.
            </p>

            <button
              type="button"
              onClick={() => setIsQrModalOpen(true)}
              className="w-full mt-4 lg:mt-6 bg-[var(--secondColor)] hover:opacity-90 active:scale-[0.99] text-[#3b2418] font-semibold text-sm lg:text-base py-3.5 px-4 rounded-xl text-center transition-all cursor-pointer shadow-sm"
            >
              Show QR Code
            </button>
          </section>
        </div>
      </div>

      {/* Floating Right-Edge QR Badge (Mobile Only) */}
      <button
        type="button"
        onClick={scrollToQr}
        aria-label="Scroll down to QR Code"
        className={`fixed right-0 top-[120px] text-[#3b2418] -translate-y-1/2 z-30 md:hidden flex items-center gap-2 pl-3.5 pr-2.5 py-2.5 rounded-l-2xl shadow-xl border-y border-l border-[var(--mainColor)]/20 cursor-pointer transition-all duration-300 select-none ${
          isBadgeHighlighted
            ? "bg-[var(--secondColor)] ring-4 ring-[var(--secondColor)]/80 scale-105 shadow-[0_0_20px_rgba(142,197,255,0.7)]"
            : "bg-[var(--secondColor)] hover:scale-105 active:scale-95 shadow-md"
        }`}
      >
        <div className="relative flex items-center justify-center">
          <LuQrCode className="w-5 h-5 shrink-0" />
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--mainColor)] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--mainColor)]"></span>
          </span>
        </div>

        <div className="flex flex-col items-start text-left leading-tight">
          <span className="text-xs font-bold tracking-tight">QR Code</span>
          <span className="text-[10px] font-semibold opacity-90 flex items-center gap-0.5">
            Scroll <LuArrowDown className="w-2.5 h-2.5 animate-bounce" />
          </span>
        </div>
      </button>

      {/* QR Code Modal */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsQrModalOpen(false)}
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="qr-modal-title"
            className="relative z-10 bg-white text-[#3b2418] rounded-3xl p-6 sm:p-8 max-w-sm sm:max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col items-center text-center"
          >
            <button
              type="button"
              aria-label="Close modal"
              onClick={() => setIsQrModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-[#3b2418] hover:bg-[#f2ebda] transition cursor-pointer"
            >
              <LuX className="w-5 h-5" />
            </button>

            <h3 id="qr-modal-title" className="text-xl sm:text-2xl font-bold mt-2">
              Scan to Collect Stamps
            </h3>
            <p className="text-xs sm:text-sm opacity-70 mt-1">
              Show this code to the barista at {cafe.name}
            </p>

            <div className="w-52 h-52 sm:w-64 sm:h-64 p-4 border-2 border-[#3b2418] rounded-2xl bg-white shadow-md my-4 flex items-center justify-center">
              <QRCodeGraphic className="w-full h-full text-[#3b2418]" />
            </div>

            <div className="text-xs sm:text-sm font-semibold bg-[var(--bgColor)] px-4 py-1.5 rounded-full">
              {user?.name || "Omar"} • {user?.memberCode || "STAMPY-7842"} • {cafe.name}
            </div>

            <p className="text-xs opacity-60 mt-3">
              One visit per calendar day. Reward unlocked at {totalStamps} stamps.
            </p>

            <button
              type="button"
              onClick={() => setIsQrModalOpen(false)}
              className="w-full mt-5 bg-[var(--secondColor)] hover:opacity-90 active:scale-[0.99] text-[#3b2418] font-semibold text-sm sm:text-base py-3.5 px-4 rounded-xl text-center transition-all cursor-pointer shadow-sm"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DedicatedCafePage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-sm opacity-60">Loading cafe experience...</div>}>
      <DedicatedCafePageContent />
    </React.Suspense>
  );
}
