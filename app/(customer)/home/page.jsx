"use client";

import React, { useState, useMemo, useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { useLoyaltyStore } from "@/app/stores/useLoyaltyStore";
import { getAuthToken } from "@/app/lib/apiClient";
import { getAllRegisteredCafes, getCafeBySlug } from "../cafe/data/cafesCatalog";

import HomeSkeleton from "./components/HomeSkeleton";
import WelcomeHeader from "./components/WelcomeHeader";
import LoyaltyOverviewStats from "./components/LoyaltyOverviewStats";
import ActiveLoyaltyCards from "./components/ActiveLoyaltyCards";
import DiscoverCafesSection from "./components/DiscoverCafesSection";
import RecentActivityTimeline from "./components/RecentActivityTimeline";
import AvailableRewardsSection from "./components/AvailableRewardsSection";
import HowNotchWorks from "./components/HowNotchWorks";

import RedeemConfirmationModal from "../cafe/[slug]/rewards/components/RedeemConfirmationModal";
import RedemptionQrModal from "../cafe/[slug]/rewards/components/RedemptionQrModal";

const emptySubscribe = () => () => { };

function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export default function HomePage() {
  const router = useRouter();
  const isMounted = useIsClient();

  // Redemption interactive modals state
  const [selectedRewardToRedeem, setSelectedRewardToRedeem] = useState(null);
  const [activeQrRedemption, setActiveQrRedemption] = useState(null);
  const [activeQrCafeSlug, setActiveQrCafeSlug] = useState(null);

  // Loyalty store state & actions
  const {
    user,
    isAuthenticated,
    memberships,
    getJoinedCafes,
    isCafeJoined,
    joinCafe,
    redeemCafeReward,
    markCafeRedemptionAsUsed,
    fetchCurrentUser,
  } = useLoyaltyStore();

  // Check auth and redirect to /login if unauthenticated
  useEffect(() => {
    const token = getAuthToken();
    if (!token && !isAuthenticated) {
      router.replace("/login");
      return;
    }
    fetchCurrentUser().then((res) => {
      if (res && res.unauthenticated) {
        router.replace("/login");
      }
    });
  }, [fetchCurrentUser, isAuthenticated, router]);

  // Joined Cafes
  const joinedCafes = useMemo(() => {
    if (!isMounted) return [];
    return getJoinedCafes();
  }, [isMounted, getJoinedCafes]);

  // Unjoined Cafes for Discovery
  const unjoinedCafes = useMemo(() => {
    if (!isMounted) return [];
    const all = getAllRegisteredCafes();
    return all.filter((c) => !isCafeJoined(c.slug));
  }, [isMounted, isCafeJoined]);

  // Total Stamps Collected (Current active stamps + stamps spent across redemptions)
  const totalStamps = useMemo(() => {
    if (!isMounted || !memberships) return 0;
    return Object.values(memberships).reduce((acc, m) => {
      const current = m.stamps || 0;
      const spent = (m.redemptions || []).reduce(
        (rAcc, r) => rAcc + (r.stampsSpent || 0),
        0
      );
      return acc + current + spent;
    }, 0);
  }, [isMounted, memberships]);

  // Available Rewards: ONLY rewards the customer already can redeem
  const availableRedeemableRewards = useMemo(() => {
    if (!isMounted || !memberships) return [];
    const collected = [];

    Object.entries(memberships).forEach(([slug, m]) => {
      const cafe = getCafeBySlug(slug);
      if (!cafe || !cafe.rewards) return;

      cafe.rewards.forEach((r) => {
        const stampsBalance = m.stamps || 0;
        const isUnlocked = stampsBalance >= r.stampsRequired;

        // Only include rewards the user already has enough stamps to redeem
        if (isUnlocked) {
          collected.push({
            ...r,
            cafeSlug: slug,
            cafeName: cafe.name,
            cafeLogo: cafe.logoImage,
            stampsBalance,
            isUnlocked: true,
          });
        }
      });
    });

    // Sort by lowest stamps required first
    return collected.sort((a, b) => a.stampsRequired - b.stampsRequired);
  }, [isMounted, memberships]);

  // Count of currently redeemable rewards
  const availableRewardsCount = useMemo(() => {
    return availableRedeemableRewards.length;
  }, [availableRedeemableRewards]);

  // Total Redeemed Rewards count
  const redeemedRewardsCount = useMemo(() => {
    if (!isMounted || !memberships) return 0;
    return Object.values(memberships).reduce((acc, m) => {
      const usedOrPending = (m.redemptions || []).filter(
        (r) => r.status === "used" || r.status === "pending"
      ).length;
      return acc + usedOrPending;
    }, 0);
  }, [isMounted, memberships]);

  // Recent Activities across all joined cafes
  const activities = useMemo(() => {
    if (!isMounted || !memberships) return [];
    const list = [];

    Object.entries(memberships).forEach(([slug, m]) => {
      const cafe = getCafeBySlug(slug);
      (m.history || []).forEach((act) => {
        list.push({
          ...act,
          cafeSlug: slug,
          cafeName: cafe?.name || m?.name || "Café",
        });
      });
    });

    return list.sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    );
  }, [isMounted, memberships]);

  // Handle opening reward redemption modal
  const handleSelectRewardToRedeem = (rewardItem) => {
    setSelectedRewardToRedeem({
      reward: rewardItem,
      cafeSlug: rewardItem.cafeSlug,
      currentStamps: rewardItem.stampsBalance,
    });
  };

  // Confirm redemption
  const handleConfirmRedeem = () => {
    if (!selectedRewardToRedeem) return;
    const { cafeSlug, reward } = selectedRewardToRedeem;

    const result = redeemCafeReward(cafeSlug, reward.id);
    if (result.success && result.redemption) {
      toast.success(`🎉 You've unlocked "${reward.name}"!`);
      setActiveQrRedemption(result.redemption);
      setActiveQrCafeSlug(cafeSlug);
      setSelectedRewardToRedeem(null);
    } else {
      toast.error(result.error || "Failed to redeem reward.");
      setSelectedRewardToRedeem(null);
    }
  };

  // Mark redemption as used
  const handleMarkRedemptionUsed = (redemptionId) => {
    if (activeQrCafeSlug && redemptionId) {
      markCafeRedemptionAsUsed(activeQrCafeSlug, redemptionId);
      toast.info("Voucher marked as used. Enjoy!");
    }
    setActiveQrRedemption(null);
    setActiveQrCafeSlug(null);
  };

  // Render Skeleton before client hydration or if not authenticated (redirecting to /login)
  const isAuthorized = Boolean(
    typeof window !== "undefined" && (getAuthToken() || isAuthenticated)
  );

  if (!isMounted || !isAuthorized) {
    return <HomeSkeleton />;
  }

  const isNewCustomer = joinedCafes.length === 0;

  return (
    <div className="w-full max-w-md md:max-w-4xl lg:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-10 pb-12 space-y-8 sm:space-y-10">
      {/* Section 1: Welcome Header */}
      <WelcomeHeader user={user} />

      {/* Conditional: New customer onboarding guide */}
      {isNewCustomer && <HowNotchWorks />}

      {/* Section 2: Loyalty Overview Statistics (Sourced directly from Backend User Data) */}
      <LoyaltyOverviewStats
        totalStamps={user?.totalStamps !== undefined && user?.totalStamps !== null ? user.totalStamps : totalStamps}
        availableRewards={user?.availableRewards !== undefined && user?.availableRewards !== null ? user.availableRewards : availableRewardsCount}
        joinedCafesCount={user?.joinedCafes !== undefined && user?.joinedCafes !== null ? user.joinedCafes : joinedCafes.length}
        redeemedRewards={user?.redeemedRewards !== undefined && user?.redeemedRewards !== null ? user.redeemedRewards : redeemedRewardsCount}
      />

      {/* Section 3: Continue Your Journey (Active Loyalty Cards) */}
      <ActiveLoyaltyCards joinedCafes={joinedCafes} />

      {/* Section 4: Discover Cafés (Shown ONLY if user is not joining any cafes) */}
      {joinedCafes.length === 0 && (
        <DiscoverCafesSection onJoinCafe={joinCafe} />
      )}

      {/* Section 5 & 6: Grid on larger screens or stacked on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-start">
        {/* Section 5: Recent Activity (5 cols on desktop) */}
        <div className="lg:col-span-5 order-2 lg:order-1">
          <RecentActivityTimeline activities={activities} />
        </div>

        {/* Section 6: Available Rewards (7 cols on desktop) */}
        <div className="lg:col-span-7 order-1 lg:order-2">
          <AvailableRewardsSection
            rewards={availableRedeemableRewards}
            onRedeemReward={handleSelectRewardToRedeem}
          />
        </div>
      </div>

      {/* Interactive Redeem Confirmation Modal */}
      <RedeemConfirmationModal
        isOpen={Boolean(selectedRewardToRedeem)}
        reward={selectedRewardToRedeem?.reward}
        currentBalance={selectedRewardToRedeem?.currentStamps}
        onConfirm={handleConfirmRedeem}
        onCancel={() => setSelectedRewardToRedeem(null)}
      />

      {/* Interactive Redemption QR Voucher Modal */}
      <RedemptionQrModal
        isOpen={Boolean(activeQrRedemption)}
        redemption={activeQrRedemption}
        cafeSlug={activeQrCafeSlug}
        onClose={() => {
          setActiveQrRedemption(null);
          setActiveQrCafeSlug(null);
        }}
        onMarkUsed={handleMarkRedemptionUsed}
      />
    </div>
  );
}
