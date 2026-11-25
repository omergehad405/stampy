"use client";

import React, { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { LuQrCode } from "react-icons/lu";
import { toast } from "react-toastify";

import CafeTopBar from "./CafeTopBar";
import { useCafeData } from "../data/useCafeData";
import { useLoyaltyStore } from "@/app/stores/useLoyaltyStore";
import { getAuthToken } from "@/app/lib/apiClient";

import CafeNotFound from "./components/CafeNotFound";
import PublicCafeHero from "./components/PublicCafeHero";
import JoinLoyaltyCard from "./components/JoinLoyaltyCard";
import RewardsPreview from "./components/RewardsPreview";
import CafeAboutTeaser from "./components/CafeAboutTeaser";
import CafeGreeting from "./components/CafeGreeting";
import StampProgress from "./components/StampProgress";
import StampsGrid from "./components/StampsGrid";
import RecentActivity from "./components/RecentActivity";
import CafeQrCard from "./components/CafeQrCard";
import QrScrollBadge from "./components/QrScrollBadge";
import CafeQrModal from "./components/CafeQrModal";

function DedicatedCafePageContent() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug;

  const { cafe, isLoading } = useCafeData(slug);
  const {
    user,
    isCafeJoined,
    getMembership,
    joinCafe,
    isAuthenticated,
    fetchCurrentUser,
    fetchCafeActivities,
  } = useLoyaltyStore();

  const isJoined = isCafeJoined(slug);
  const membership = getMembership(slug);

  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isBadgeHighlighted, setIsBadgeHighlighted] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const qrSectionRef = useRef(null);

  // Active stamps tracking and celebration animation state
  const currentStamps = membership?.stamps ?? 0;
  const totalStamps = membership?.totalStamps ?? cafe?.stampTarget ?? 10;
  const prevStampsRef = useRef(null);
  const [animatingStamps, setAnimatingStamps] = useState([]); // array of slot numbers e.g. [3] or [3, 4]

  // Fetch real customer cafe activities (visits, stamps, redemptions)
  useEffect(() => {
    if (isJoined && slug) {
      fetchCafeActivities(slug);
    }
  }, [isJoined, slug, fetchCafeActivities]);

  // Background polling every 3.5s so barista scan is immediately picked up
  useEffect(() => {
    if (!isJoined) return;

    const intervalId = setInterval(() => {
      fetchCurrentUser();
    }, 3500);

    return () => clearInterval(intervalId);
  }, [isJoined, fetchCurrentUser]);

  // Detect when customer's stamps increase (e.g. barista scan awarded stamp)
  useEffect(() => {
    if (!isJoined || membership?.stamps === undefined) return;

    if (prevStampsRef.current !== null && membership.stamps > prevStampsRef.current) {
      const startStamp = prevStampsRef.current + 1;
      const endStamp = membership.stamps;
      const newSlots = [];
      for (let s = startStamp; s <= endStamp; s++) {
        newSlots.push(s);
      }

      // 1. Close QR modal if open so customer watches stamps get stamped on the card
      setIsQrModalOpen(false);

      // 2. Automatically navigate smoothly to top if scrolled down on mobile
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      // 3. Trigger realistic sequential stamp animation in the grid
      setAnimatingStamps(newSlots);

      if (newSlots.length > 0) {
        toast.success(`🎉 +${newSlots.length} stamp awarded!`);
      }
    }

    prevStampsRef.current = membership.stamps;
  }, [isJoined, membership?.stamps, totalStamps]);

  const scrollToQr = () => {
    setIsBadgeHighlighted(true);
    if (qrSectionRef.current) {
      qrSectionRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    setTimeout(() => {
      setIsBadgeHighlighted(false);
    }, 2500);
  };

  const handleJoinCafe = async () => {
    const token = getAuthToken();
    if (!isAuthenticated || !token) {
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "Notch_pending_cafe_join",
          JSON.stringify({
            cafeId: cafe?.id || cafe?._id || slug,
            slug,
            name: cafe?.name || "This Café",
          })
        );
      }
      toast.info(`Please sign in or create an account to join ${cafe?.name || "this café"}.`);
      router.push(`/login?redirect=/cafe/${slug}&autoJoin=true`);
      return;
    }

    setIsJoining(true);
    try {
      const result = await joinCafe(cafe?.id || cafe?._id || slug);
      if (result.success) {
        toast.success(`🎉 Welcome to ${cafe?.name}! Your loyalty card is ready.`, {
          position: "top-right",
          autoClose: 3500,
        });
      } else {
        toast.error(result.error || "Failed to join cafe loyalty program.");
      }
    } catch (err) {
      toast.error(err.message || "Failed to join cafe.");
    } finally {
      setIsJoining(false);
    }
  };

  if (!cafe) {
    return <CafeNotFound />;
  }

  if (!isJoined) {
    return (
      <div className="w-full max-w-md md:max-w-4xl lg:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-10 pb-16">
        <CafeTopBar cafe={cafe} />
        <PublicCafeHero cafe={cafe} isJoining={isJoining} onJoin={handleJoinCafe} />
        <JoinLoyaltyCard cafe={cafe} isJoining={isJoining} onJoin={handleJoinCafe} />
        <RewardsPreview cafe={cafe} slug={slug} />
        <CafeAboutTeaser cafe={cafe} slug={slug} />
      </div>
    );
  }

  const recentActivities = membership?.history || [];

  return (
    <div className="w-full max-w-md md:max-w-4xl lg:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-10 pb-12">
      <CafeTopBar cafe={cafe} />

      <div className="md:grid md:grid-cols-12 md:gap-6 lg:gap-10 items-start mt-4 lg:mt-8">
        <div className="md:col-span-7 flex flex-col gap-6">
          <CafeGreeting cafe={cafe} user={user} />
          <StampProgress
            currentStamps={currentStamps}
            totalStamps={totalStamps}
            rewards={cafe?.rewards || []}
          />

          {/* 📱 Mobile Quick Present QR Code Bar (< md screens) */}
          <div className="block md:hidden">
            <button
              type="button"
              onClick={() => setIsQrModalOpen(true)}
              className="w-full flex items-center justify-between p-4 rounded-2xl border border-(--mainColor)/15 bg-(--mainColor)/5 text-(--mainColor) hover:bg-(--mainColor)/10 active:scale-[0.99] transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-(--mainColor)/10 flex items-center justify-center">
                  <LuQrCode className="w-6 h-6 text-(--mainColor)" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-(--secondColor)">
                    Personal QR (Staff Fallback)
                  </h3>
                  <p className="text-[11px] text-(--mainColor)/65">
                    Show this if the cafe QR is unavailable
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-(--mainColor)/10 text-(--mainColor)">
                Show
              </span>
            </button>
          </div>

          <StampsGrid
            currentStamps={currentStamps}
            totalStamps={totalStamps}
            animatingStamps={animatingStamps}
            onAnimationComplete={() => setAnimatingStamps([])}
          />

          {/* 📱 On Mobile, QR card is placed right under StampsGrid so customer doesn't scroll past activities */}
          <div className="block md:hidden">
            <CafeQrCard
              ref={qrSectionRef}
              cafe={cafe}
              user={user}
              isHighlighted={isBadgeHighlighted}
              onShowQr={() => setIsQrModalOpen(true)}
            />
          </div>

          <RecentActivity activities={recentActivities} slug={slug} />
        </div>

        {/* 💻 Desktop Sticky QR Column (hidden on mobile, sticky on desktop) */}
        <div className="hidden md:block md:col-span-5 md:sticky md:top-6 lg:top-8">
          <CafeQrCard
            ref={qrSectionRef}
            cafe={cafe}
            user={user}
            isHighlighted={isBadgeHighlighted}
            onShowQr={() => setIsQrModalOpen(true)}
          />
        </div>
      </div>

      <QrScrollBadge isHighlighted={isBadgeHighlighted} onClick={scrollToQr} />

      {isQrModalOpen && (
        <CafeQrModal
          cafe={cafe}
          user={user}
          totalStamps={totalStamps}
          onClose={() => setIsQrModalOpen(false)}
        />
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
