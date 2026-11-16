"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  LuCoffee,
  LuBell,
  LuSparkles,
  LuHistory,
  LuGift,
} from "react-icons/lu";

import ThemeToggle from "@/app/components/ui/ThemeToggle";
import NotificationBox from "@/app/components/layout/NotificationBox";
import { useLoyaltyStore } from "@/app/stores/useLoyaltyStore";

import StampBalanceCard from "@/app/features/rewards/StampBalanceCard";
import RewardCard from "@/app/features/rewards/RewardCard";
import MyRewardsSection from "@/app/features/rewards/MyRewardsSection";
import RedeemConfirmationModal from "@/app/features/rewards/RedeemConfirmationModal";
import RedemptionQrModal from "@/app/features/rewards/RedemptionQrModal";

export default function RewardsPage() {
  const [activeTab, setActiveTab] = useState("available"); // "available" | "history"
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Modals state
  const [selectedRewardToRedeem, setSelectedRewardToRedeem] = useState(null);
  const [activeQrRedemption, setActiveQrRedemption] = useState(null);

  // Loyalty store state & actions
  const {
    stampsBalance,
    rewards,
    redemptions,
    redeemReward,
    markRedemptionAsUsed,
  } = useLoyaltyStore();

  // Derived statistics
  const unlockedRewards = rewards.filter((r) => stampsBalance >= r.stampsRequired);
  const lockedRewards = rewards.filter((r) => stampsBalance < r.stampsRequired);
  const nextReward = lockedRewards.length > 0 ? lockedRewards[0] : null;
  const pendingRedemptionsCount = redemptions.filter((r) => r.status === "pending").length;

  const showToast = (msg, type = "success") => {
    toast(msg, { type });
  };

  // Step 1: User clicks "Redeem Reward" -> Open Confirmation Modal
  const handleInitiateRedeem = (reward) => {
    setSelectedRewardToRedeem(reward);
  };

  // Step 2: User confirms in Modal -> Deduct stamps, create redemption, open QR modal
  const handleConfirmRedeem = (reward) => {
    const result = redeemReward(reward.id);
    setSelectedRewardToRedeem(null);

    if (result.success && result.redemption) {
      setActiveQrRedemption(result.redemption);
      showToast(`🎉 Redeemed ${reward.name}! Show reward QR code to the cashier.`);
    } else if (result.error) {
      showToast(`⚠️ ${result.error}`);
    }
  };

  // Step 3: Open QR modal for an existing redemption from "My Rewards"
  const handleOpenExistingQr = (redemption) => {
    setActiveQrRedemption(redemption);
  };

  return (
    <div className="w-full max-w-md md:max-w-4xl lg:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-10 pb-8">
      {/* Top Bar */}
      <header className="flex items-center justify-between pb-2">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-[var(--mainColor)] flex items-center justify-center text-[var(--bgColor)] shadow-sm">
            <LuCoffee className="w-4 h-4 lg:w-5 lg:h-5" />
          </div>
          <div>
            <h2 className="text-sm lg:text-base font-bold leading-tight">
              Coffee House
            </h2>
            <p className="text-xs lg:text-sm font-medium leading-tight opacity-70">
              Your loyalty card
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
            type="button"
            aria-label="Open notifications"
            onClick={() => setIsNotificationOpen(true)}
            className="relative p-2 rounded-full hover:bg-[var(--mainColor)]/10 text-[var(--mainColor)] transition-colors cursor-pointer"
          >
            <LuBell className="w-5 h-5 lg:w-6 lg:h-6" />
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--secondColor)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--secondColor)]"></span>
            </span>
          </button>
        </div>
      </header>

      {/* Page Title & Subtitle */}
      <section className="mt-4 lg:mt-6">
        <p className="text-xs font-semibold tracking-wider uppercase opacity-60">
          STAMPY REWARDS
        </p>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mt-0.5 tracking-tight flex items-center gap-2">
          <span>Rewards</span>
          <span className="text-2xl sm:text-3xl lg:text-4xl">🎁</span>
        </h1>
        <p className="text-xs sm:text-sm lg:text-base opacity-75 mt-1 max-w-lg">
          Turn your stamps into something special. Redeem as soon as you have enough stamps.
        </p>
      </section>

      {/* Section B: Stamp Balance Card */}
      <div className="mt-6">
        <StampBalanceCard
          stampsBalance={stampsBalance}
          unlockedCount={unlockedRewards.length}
          nextReward={nextReward}
        />
      </div>

      {/* Navigation Tabs: Available Rewards vs My Rewards */}
      <div className="mt-8 flex items-center justify-between border-b border-[var(--mainColor)]/15 pb-2">
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Available Rewards Tab */}
          <button
            type="button"
            onClick={() => setActiveTab("available")}
            className={`relative flex items-center gap-2 text-sm sm:text-base font-bold py-2 px-3 sm:px-4 rounded-xl transition-all cursor-pointer ${
              activeTab === "available"
                ? "bg-[var(--mainColor)] text-[var(--bgColor)] shadow-xs"
                : "text-[var(--mainColor)]/70 hover:text-[var(--mainColor)] hover:bg-[var(--mainColor)]/5"
            }`}
          >
            <LuGift className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Available Rewards</span>
            {unlockedRewards.length > 0 && (
              <span
                className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full ${
                  activeTab === "available"
                    ? "bg-[var(--secondColor)] text-[#3b2418]"
                    : "bg-[var(--secondColor)] text-[#3b2418]"
                }`}
              >
                {unlockedRewards.length} Unlocked
              </span>
            )}
          </button>

          {/* My Rewards Tab */}
          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={`relative flex items-center gap-2 text-sm sm:text-base font-bold py-2 px-3 sm:px-4 rounded-xl transition-all cursor-pointer ${
              activeTab === "history"
                ? "bg-[var(--mainColor)] text-[var(--bgColor)] shadow-xs"
                : "text-[var(--mainColor)]/70 hover:text-[var(--mainColor)] hover:bg-[var(--mainColor)]/5"
            }`}
          >
            <LuHistory className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>My Rewards</span>
            {pendingRedemptionsCount > 0 && (
              <span className="flex items-center gap-1 text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500 text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                {pendingRedemptionsCount} Ready
              </span>
            )}
          </button>
        </div>

        <span className="hidden sm:inline-block text-xs opacity-60">
          Flexible redemption system
        </span>
      </div>

      {/* Content Area */}
      <div className="mt-6">
        <AnimatePresence mode="wait">
          {activeTab === "available" ? (
            <motion.div
              key="available"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Flexible Rewards Catalog Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {rewards.map((reward) => (
                  <RewardCard
                    key={reward.id}
                    reward={reward}
                    stampsBalance={stampsBalance}
                    onRedeem={handleInitiateRedeem}
                  />
                ))}
              </div>

              {/* Informational Footer Note */}
              <div className="mt-8 p-4 rounded-2xl bg-white/50 dark:bg-black/20 border border-[var(--mainColor)]/10 text-xs text-[var(--mainColor)]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <p>
                  💡 <strong>Tip:</strong> You don&apos;t have to wait for 10 or 15 stamps! You can redeem any unlocked reward at any time.
                </p>
                <span className="opacity-60 text-[11px]">
                  Stamps deducted only upon confirmed redemption.
                </span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-2">
                <h3 className="text-base sm:text-lg font-bold">
                  Redemption History & Active QR Codes
                </h3>
                <p className="text-xs sm:text-sm opacity-70">
                  Tap &ldquo;View QR Code&rdquo; on any active reward to present it to the cashier.
                </p>
              </div>

              <MyRewardsSection
                redemptions={redemptions}
                onOpenQr={handleOpenExistingQr}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Confirmation Modal */}
      <RedeemConfirmationModal
        isOpen={Boolean(selectedRewardToRedeem)}
        reward={selectedRewardToRedeem}
        currentBalance={stampsBalance}
        onConfirm={handleConfirmRedeem}
        onCancel={() => setSelectedRewardToRedeem(null)}
      />

      {/* QR Code Presentation Modal */}
      <RedemptionQrModal
        isOpen={Boolean(activeQrRedemption)}
        redemption={activeQrRedemption}
        onClose={() => setActiveQrRedemption(null)}
      />

      {/* Notification Box (Slide-in Drawer) */}
      <NotificationBox
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </div>
  );
}
