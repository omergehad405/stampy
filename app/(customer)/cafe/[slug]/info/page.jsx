"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { LuCoffee, LuStore, LuCircleCheck, LuArrowRight } from "react-icons/lu";
import { toast } from "react-toastify";

import CafeTopBar from "../CafeTopBar";
import { useCafeData } from "../../data/useCafeData";
import { useLoyaltyStore } from "@/app/stores/useLoyaltyStore";
import { getAuthToken } from "@/app/lib/apiClient";

import CafeHeader from "../components/CafeHeader";
import JoinLoyaltyCard from "../components/JoinLoyaltyCard";
import CafeAbout from "../components/CafeAbout";
import CafeInformation from "../components/CafeInformation";
import CafeSocialLinks from "../components/CafeSocialLinks";
import CafeMenuTeaser from "../components/CafeMenuTeaser";
import CafeSkeleton from "../components/CafeSkeleton";

function DedicatedCafeInfoContent() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug;

  const { cafe, isLoading, operatingStatus } = useCafeData(slug);
  const { isAuthenticated, isCafeJoined, joinCafe } = useLoyaltyStore();

  const isJoined = isCafeJoined(slug);
  const [isJoining, setIsJoining] = useState(false);

  const handleJoinClick = async () => {
    const token = getAuthToken();

    // 1. If not logged in: save pending join intent and navigate to login
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

    // 2. If logged in: join cafe directly and redirect to loyalty card
    setIsJoining(true);
    try {
      const res = await joinCafe(cafe?.id || cafe?._id || slug);
      if (res?.success) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem(`stampy_welcome_stamp_${slug}`, "true");
        }
        toast.success(`🎉 Welcome to ${cafe?.name}! Your loyalty card is ready.`);
        router.push(`/cafe/${slug}?welcome=true`);
      } else {
        toast.error(res?.error || "Could not join café loyalty program.");
      }
    } catch (err) {
      toast.error(err.message || "Failed to join café.");
    } finally {
      setIsJoining(false);
    }
  };

  if (!cafe && !isLoading) {
    return (
      <div className="w-full max-w-md mx-auto px-4 py-16 text-center">
        <LuStore className="w-10 h-10 mx-auto mb-2 opacity-60" />
        <h2 className="text-xl font-bold">Cafe Not Found</h2>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md md:max-w-4xl lg:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-10 pb-16">
      {/* Top Bar with Return to My Cafes */}
      <CafeTopBar cafe={cafe} />

      {/* Main Content Area */}
      {isLoading ? (
        <CafeSkeleton />
      ) : (
        <main className="space-y-6 sm:space-y-8 mt-6">
          {/* Section A: Cover & Identity Header */}
          <CafeHeader cafe={cafe} operatingStatus={operatingStatus} />

          {/* Section B: Loyalty Program Join / Status Card */}
          {isJoined ? (
            <div className="p-5 sm:p-6 rounded-3xl bg-emerald-950/10 border border-emerald-600/25 text-(--mainColor) flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <LuCircleCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-(--mainColor)">
                    You are enrolled in {cafe?.name}&apos;s Loyalty Program
                  </h3>
                  <p className="text-xs text-(--mainColor)/70 mt-0.5">
                    Your digital stamp card is active. Show your QR code at the counter to collect stamps!
                  </p>
                </div>
              </div>
              <Link
                href={`/cafe/${slug}`}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-(--mainColor) text-(--secondColor) font-bold text-xs sm:text-sm hover:opacity-95 transition cursor-pointer self-start sm:self-auto shrink-0 shadow-xs"
              >
                <span>View My Loyalty Card</span>
                <LuArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <JoinLoyaltyCard
              cafe={cafe}
              isJoining={isJoining}
              onJoin={handleJoinClick}
            />
          )}

          {/* Section C: About the Cafe */}
          <CafeAbout about={cafe?.about} />

          {/* Section D: Cafe Information (Location, Hours, Contact, Website) */}
          <CafeInformation cafe={cafe} operatingStatus={operatingStatus} />

          {/* Section E: Social Media Accounts */}
          <CafeSocialLinks socialMedia={cafe?.socialMedia} />

          {/* Section F: Digital Menu Teaser Section */}
          <CafeMenuTeaser menuPreview={cafe?.menuPreview} />

          {/* Trust & Brand Footer Note */}
          <footer className="pt-6 sm:pt-8 text-center text-xs text-(--mainColor)/50 border-t border-(--mainColor)/10">
            <p className="flex items-center justify-center gap-1.5">
              <LuCoffee className="w-3.5 h-3.5 text-(--mainColor)/40" />
              <span>
                {cafe?.name || "This cafe"} on Stampy Digital Loyalty
              </span>
            </p>
            <p className="mt-1 text-[11px] opacity-75">
              Digital Loyalty Card Platform • Every visit counts
            </p>
          </footer>
        </main>
      )}
    </div>
  );
}

export default function DedicatedCafeInfoPage() {
  return (
    <React.Suspense fallback={<CafeSkeleton />}>
      <DedicatedCafeInfoContent />
    </React.Suspense>
  );
}
