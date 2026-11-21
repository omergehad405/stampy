"use client";

import React, { useState, useRef, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
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
import WelcomeStampModal from "./components/WelcomeStampModal";

function DedicatedCafePageContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = params?.slug;

  const { cafe, isLoading } = useCafeData(slug);
  const { user, isCafeJoined, getMembership, joinCafe, isAuthenticated } = useLoyaltyStore();

  const isJoined = isCafeJoined(slug);
  const membership = getMembership(slug);

  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);
  const [isBadgeHighlighted, setIsBadgeHighlighted] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const qrSectionRef = useRef(null);

  // Detect welcome flag from signup auto-join or info page redirect
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasWelcomeParam = searchParams?.get("welcome") === "true";
      const hasSessionFlag =
        sessionStorage.getItem(`stampy_welcome_stamp_${slug}`) === "true";

      if (hasWelcomeParam || hasSessionFlag) {
        setIsWelcomeModalOpen(true);
        sessionStorage.removeItem(`stampy_welcome_stamp_${slug}`);
      }
    }
  }, [searchParams, slug]);

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
          "stampy_pending_cafe_join",
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
        setIsWelcomeModalOpen(true);
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

  const currentStamps = membership?.stamps ?? 0;
  const totalStamps = membership?.totalStamps ?? cafe?.stampTarget ?? 10;
  const recentActivities = (membership?.history || []).slice(0, 5);

  return (
    <div className="w-full max-w-md md:max-w-4xl lg:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-10 pb-12">
      <CafeTopBar cafe={cafe} />

      <div className="md:grid md:grid-cols-12 md:gap-6 lg:gap-10 items-start mt-4 lg:mt-8">
        <div className="md:col-span-7 flex flex-col gap-6">
          <CafeGreeting cafe={cafe} user={user} />
          <StampProgress currentStamps={currentStamps} totalStamps={totalStamps} />
          <StampsGrid currentStamps={currentStamps} totalStamps={totalStamps} />
          <RecentActivity activities={recentActivities} slug={slug} />
        </div>

        <div className="md:col-span-5 mt-6 md:mt-0 md:sticky md:top-6 lg:top-8">
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

      {/* 🌟 Welcome Bonus Stamp Physical Animation Modal */}
      <WelcomeStampModal
        cafe={cafe}
        isOpen={isWelcomeModalOpen}
        onClose={() => setIsWelcomeModalOpen(false)}
        totalStamps={totalStamps}
      />
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
