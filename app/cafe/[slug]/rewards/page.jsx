"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  LuSparkles,
  LuHistory,
  LuGift,
  LuStore,
} from "react-icons/lu";

import CafeTopBar from "../CafeTopBar";
import { getCafeBySlug } from "@/app/features/cafe/cafesCatalog";
import { useLoyaltyStore } from "@/app/stores/useLoyaltyStore";

import StampBalanceCard from "@/app/features/rewards/StampBalanceCard";
import RewardCard from "@/app/features/rewards/RewardCard";
import MyRewardsSection from "@/app/features/rewards/MyRewardsSection";
import RedeemConfirmationModal from "@/app/features/rewards/RedeemConfirmationModal";
import RedemptionQrModal from "@/app/features/rewards/RedemptionQrModal";

function DedicatedCafeRewardsContent() {
  const params = useParams();
  const slug = params?.slug;

  const cafe = getCafeBySlug(slug);
  const {
    isCafeJoined,
    getMembership,
    redeemCafeReward,
    joinCafe,
  } = useLoyaltyStore();

  const isJoined = isCafeJoined(slug);
  const membership = getMembership(slug);

  const [activeTab, setActiveTab] = useState("available"); // "available" | "history"
  const [selectedRewardToRedeem, setSelectedRewardToRedeem] = useState(null);
  const [activeQrRedemption, setActiveQrRedemption] = useState(null);

  if (!cafe) {
    return (
      <div className="w-full max-w-md mx-auto px-4 py-16 text-center">
        <LuStore className="w-10 h-10 mx-auto mb-2 opacity-60" />
        <h2 className="text-xl font-bold">Cafe Not Found</h2>
      </div>
    );
  }

  // Scoped cafe rewards & balance
  const stampsBalance = membership?.stamps ?? 0;
  const rewards = cafe.rewards || [];
  const redemptions = membership?.redemptions || [];

  // Derived stats
  const unlockedRewards = rewards.filter((r) => stampsBalance >= r.stampsRequired);
  const lockedRewards = rewards.filter((r) => stampsBalance < r.stampsRequired);
  const nextReward = lockedRewards.length > 0 ? lockedRewards[0] : null;
  const pendingRedemptionsCount = redemptions.filter((r) => r.status === "pending").length;

  const showToast = (msg, type = "success") => {
    toast(msg, { type });
  };

  const handleInitiateRedeem = (reward) => {
    if (!isJoined) {
      showToast(`Please join ${cafe.name} loyalty program first!`, "info");
      return;
    }
    setSelectedRewardToRedeem(reward);
  };

  const handleConfirmRedeem = (reward) => {
    const result = redeemCafeReward(slug, reward.id);
    setSelectedRewardToRedeem(null);

    if (result.success && result.redemption) {
      setActiveQrRedemption(result.redemption);
      showToast(`🎉 Redeemed ${reward.name}! Show reward QR code to the cashier.`);
    } else if (result.error) {
      showToast(`⚠️ ${result.error}`, "error");
    }
  };

  const handleOpenExistingQr = (redemption) => {
    setActiveQrRedemption(redemption);
  };

  return (
    <div className="w-full max-w-md md:max-w-4xl lg:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-10 pb-12">
      {/* Top Bar with Return to My Cafes */}
      <CafeTopBar cafe={cafe} />

      {/* Page Title & Subtitle */}
      <section className="mt-4 lg:mt-6">
        <p className="text-xs font-semibold tracking-wider uppercase opacity-60">
          {cafe.name} LOYALTY REWARDS
        </p>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mt-0.5 tracking-tight flex items-center gap-2">
          <span>Rewards</span>
          <span className="text-2xl sm:text-3xl lg:text-4xl">🎁</span>
        </h1>
        <p className="text-xs sm:text-sm lg:text-base opacity-75 mt-1 max-w-lg">
          Turn your {cafe.name} stamps into free drinks, treats, and perks.
        </p>
      </section>

      {/* Non-member Notice */}
      {!isJoined && (
        <div className="mt-4 p-4 rounded-2xl bg-[var(--secondColor)]/20 border border-[var(--secondColor)]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-[var(--mainColor)]">
              You haven&apos;t joined {cafe.name} yet
            </p>
            <p className="text-xs opacity-80">
              Join now to start collecting stamps towards these rewards.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              joinCafe(slug);
              showToast(`🎉 Welcome to ${cafe.name}!`, "success");
            }}
            className="px-4 py-2 rounded-xl bg-[var(--mainColor)] text-[var(--bgColor)] font-bold text-xs shrink-0 cursor-pointer shadow-xs"
          >
            Join Loyalty Program
          </button>
        </div>
      )}

      {/* Stamp Balance Card */}
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
              <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-[var(--secondColor)] text-[#3b2418]">
                {unlockedRewards.length} Unlocked
              </span>
            )}
          </button>

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
          Exclusive to {cafe.name}
        </span>
      </div>

      {/* Tab Content Area */}
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

              <div className="mt-8 p-4 rounded-2xl bg-[var(--mainColor)] text-[var(--bgColor)] border border-[var(--bgColor)]/15 text-xs text-[var(--bgColor)]/85 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
                <p>
                  💡 <strong>Tip:</strong> Redeem any unlocked reward whenever you visit {cafe.name}. Stamps are deducted only upon confirmed cashier scan.
                </p>
                <span className="opacity-70 text-[11px]">
                  {cafe.name} Loyalty
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
                  {cafe.name} Redemption History & QR Codes
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
    </div>
  );
}

export default function DedicatedCafeRewardsPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-sm opacity-60">Loading rewards...</div>}>
      <DedicatedCafeRewardsContent />
    </React.Suspense>
  );
}
