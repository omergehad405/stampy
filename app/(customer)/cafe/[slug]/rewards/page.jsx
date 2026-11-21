"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

import CafeTopBar from "../CafeTopBar";
import { useCafeData } from "../../data/useCafeData";
import { useLoyaltyStore } from "@/app/stores/useLoyaltyStore";

import StampBalanceCard from "./components/StampBalanceCard";
import RedeemConfirmationModal from "./components/RedeemConfirmationModal";
import RedemptionQrModal from "./components/RedemptionQrModal";

import RewardsNotFound from "./components/RewardsNotFound";
import RewardsPageHeader from "./components/RewardsPageHeader";
import RewardsJoinNotice from "./components/RewardsJoinNotice";
import RewardsTabs from "./components/RewardsTabs";
import AvailableRewards from "./components/AvailableRewards";
import RewardsHistory from "./components/RewardsHistory";

function DedicatedCafeRewardsContent() {
  const params = useParams();
  const slug = params?.slug;

  const { cafe, isLoading } = useCafeData(slug);
  const {
    isCafeJoined,
    getMembership,
    redeemCafeReward,
    fetchCafeRedemptions,
    joinCafe,
  } = useLoyaltyStore();

  const isJoined = isCafeJoined(slug);
  const membership = getMembership(slug);

  const [activeTab, setActiveTab] = useState("available");
  const [selectedRewardToRedeem, setSelectedRewardToRedeem] = useState(null);
  const [activeQrRedemption, setActiveQrRedemption] = useState(null);

  // Sync real customer redemptions from server for this cafe
  useEffect(() => {
    if (slug && isJoined) {
      fetchCafeRedemptions(slug);
    }
  }, [slug, isJoined, fetchCafeRedemptions]);

  if (isLoading) {
    return (
      <div className="w-full max-w-md md:max-w-4xl lg:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-10 pb-12 text-center">
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-(--mainColor)/20 border-t-(--mainColor)" />
          <p className="text-sm font-medium text-(--mainColor)/70">Loading rewards...</p>
        </div>
      </div>
    );
  }

  if (!cafe) {
    return <RewardsNotFound />;
  }

  const stampsBalance = membership?.stamps ?? 0;
  const rewards = cafe.rewards || [];
  const redemptions = membership?.redemptions || [];

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

  const handleConfirmRedeem = async (reward) => {
    const result = await redeemCafeReward(slug, reward.id);
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

  const handleJoin = async () => {
    const res = await joinCafe(cafe.id || slug);
    if (res?.success) {
      showToast(`🎉 Welcome to ${cafe.name}!`, "success");
    } else {
      showToast(res?.error || `Failed to join ${cafe.name}`, "error");
    }
  };

  return (
    <div className="w-full max-w-md md:max-w-4xl lg:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-10 pb-12">
      <CafeTopBar cafe={cafe} />

      <RewardsPageHeader cafe={cafe} />

      {!isJoined && (
        <RewardsJoinNotice cafe={cafe} onJoin={handleJoin} />
      )}

      <div className="mt-6">
        <StampBalanceCard
          stampsBalance={stampsBalance}
          unlockedCount={unlockedRewards.length}
          nextReward={nextReward}
        />
      </div>

      <RewardsTabs
        cafe={cafe}
        activeTab={activeTab}
        onChange={setActiveTab}
        unlockedCount={unlockedRewards.length}
        pendingCount={pendingRedemptionsCount}
      />

      <div className="mt-6">
        <AnimatePresence mode="wait">
          {activeTab === "available" ? (
            <AvailableRewards
              cafe={cafe}
              rewards={rewards}
              stampsBalance={stampsBalance}
              onRedeem={handleInitiateRedeem}
            />
          ) : (
            <RewardsHistory
              cafe={cafe}
              redemptions={redemptions}
              onOpenQr={handleOpenExistingQr}
            />
          )}
        </AnimatePresence>
      </div>

      <RedeemConfirmationModal
        isOpen={Boolean(selectedRewardToRedeem)}
        reward={selectedRewardToRedeem}
        currentBalance={stampsBalance}
        onConfirm={handleConfirmRedeem}
        onCancel={() => setSelectedRewardToRedeem(null)}
      />

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
