"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  LuMapPin,
  LuPlus,
  LuStore,
  LuCompass,
  LuGift,
  LuExternalLink,
  LuSparkles,
} from "react-icons/lu";

import { useLoyaltyStore } from "@/app/stores/useLoyaltyStore";
import { apiGetCafes } from "@/app/lib/cafeApi";
import { getAllRegisteredCafes } from "@/app/(customer)/cafe/data/cafesCatalog";

// Helper to shuffle an array randomly using Fisher-Yates
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function SuggestedCafesSection() {
  const router = useRouter();
  const { isCafeJoined, joinCafe } = useLoyaltyStore();

  const [suggestedCafes, setSuggestedCafes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [joiningSlug, setJoiningSlug] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    async function loadSuggested() {
      setIsLoading(true);
      try {
        let list = await apiGetCafes();
        if (!list || list.length === 0) {
          list = getAllRegisteredCafes();
        }

        if (isCancelled) return;

        // Filter ONLY cafes whose plan includes promotional campaigns
        const promoCafes = (list || []).filter((c) => {
          if (c.hasPromotionalCampaigns) return true;
          if (c.isPromoted) return true;
          if (Array.isArray(c.features) && c.features.some((f) => f.toLowerCase().includes("promotional"))) return true;
          if (Array.isArray(c.currentPlan?.features) && c.currentPlan.features.some((f) => f.toLowerCase().includes("promotional"))) return true;
          return false;
        });

        // Filter out already joined cafes if possible, or show available promo cafes
        const unjoined = promoCafes.filter((c) => !isCafeJoined(c.slug));
        const finalCafes = unjoined.length > 0 ? unjoined : promoCafes;
        setSuggestedCafes(finalCafes);
      } catch (err) {
        if (!isCancelled) {
          console.warn("[SuggestedCafes] API fetch error:", err.message);
          setSuggestedCafes([]);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    loadSuggested();

    return () => {
      isCancelled = true;
    };
  }, [isCafeJoined]);

  const handleJoin = async (cafe) => {
    setJoiningSlug(cafe.slug);
    try {
      const res = await joinCafe(cafe.slug);
      if (res?.success) {
        toast.success(`Welcome to ${cafe.name}! 🎉 Your loyalty card is ready!`, {
          position: "top-right",
          autoClose: 3000,
        });
        router.push(`/cafe/${cafe.slug}`);
      } else {
        toast.error(res?.error || "Failed to join cafe.");
      }
    } catch (err) {
      toast.error(err.message || "Failed to join cafe.");
    } finally {
      setJoiningSlug(null);
    }
  };

  // If loading finished and no cafe has promotional campaigns in their plan, render the Coming Soon section
  if (!isLoading && suggestedCafes.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 sm:p-10 rounded-3xl bg-(--mainColor) text-(--bgColor) border border-(--bgColor)/15 shadow-sm text-center space-y-4"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-(--secondColor) text-[#3B2418] shadow-sm">
          <LuSparkles className="w-7 h-7" />
        </div>
        <div className="max-w-md mx-auto space-y-2">
          <span className="inline-block text-[11px] font-bold px-3 py-1 rounded-full bg-(--secondColor) text-[#3B2418] uppercase tracking-wider">
            Coming Soon
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-(--bgColor)">
            Exclusive Featured Cafés On The Way
          </h3>
          <p className="text-xs sm:text-sm text-(--bgColor)/75 italic leading-relaxed">
            &ldquo;Great coffee is worth the wait. Exciting new partner cafés and limited-edition promotional loyalty campaigns will be featured here very soon!&rdquo;
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 sm:p-7 rounded-3xl bg-(--mainColor) text-(--bgColor) border border-(--bgColor)/15 shadow-sm space-y-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-(--bgColor)/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-(--secondColor) text-[#3B2418]">
              <LuCompass className="w-4 h-4" />
            </span>
            <h3 className="text-base sm:text-lg font-bold text-(--bgColor)">
              Suggested Cafés Near You
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-(--bgColor)/75 mt-1">
            Explore nearby specialty cafés to start collecting stamps and unlocking free perks.
          </p>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-(--secondColor) text-[#3B2418] shrink-0">
          <LuSparkles className="w-3 h-3" />
          <span>Recommended</span>
        </span>
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 rounded-2xl bg-(--bgColor)/10 animate-pulse border border-(--bgColor)/15"
            />
          ))}
        </div>
      ) : (
        /* Cafes List */
        <div className="space-y-3.5">
          {suggestedCafes.map((cafe) => {
            const isJoining = joiningSlug === cafe.slug;
            const locationText =
              cafe.location?.district ||
              cafe.location?.city ||
              cafe.location?.address ||
              "Nearby Location";

            return (
              <div
                key={cafe.slug || cafe.id}
                className="group p-3.5 sm:p-4 rounded-2xl bg-(--bgColor)/10 border border-(--bgColor)/15 hover:border-(--secondColor)/60 hover:bg-(--bgColor)/15 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3.5"
              >
                {/* Left: Thumbnail & Cafe Info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white shrink-0 border border-white/20 shadow-xs">
                    {cafe.logoImage || cafe.coverImage ? (
                      <img
                        src={cafe.logoImage || cafe.coverImage}
                        alt={cafe.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#3B2418]">
                        <LuStore className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-(--bgColor) truncate group-hover:text-(--secondColor) transition-colors">
                        {cafe.name}
                      </h4>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-(--secondColor) text-[#3B2418] shrink-0">
                        {cafe.stampTarget || 10} stamps
                      </span>
                    </div>

                    <p className="text-xs text-(--bgColor)/75 flex items-center gap-1 mt-0.5 truncate">
                      <LuMapPin className="w-3 h-3 text-(--secondColor) shrink-0" />
                      <span className="truncate">{locationText}</span>
                      {cafe.location?.directionsHint && (
                        <span className="hidden md:inline text-[11px] opacity-75 truncate">
                          • {cafe.location.directionsHint}
                        </span>
                      )}
                    </p>

                    {cafe.rewards && cafe.rewards[0] && (
                      <p className="text-[11px] text-(--secondColor) flex items-center gap-1 mt-1 truncate">
                        <LuGift className="w-3 h-3 shrink-0" />
                        <span className="truncate">
                          Perk: {cafe.rewards[0].name || cafe.rewards[0].title}
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <a
                    href={`/cafe/${cafe.slug}/info`}
                    className="px-3 py-2 rounded-xl border border-(--bgColor)/30 hover:bg-(--bgColor)/10 text-(--bgColor) font-bold text-xs transition-colors flex items-center gap-1"
                  >
                    <span>Info</span>
                    <LuExternalLink className="w-3 h-3 opacity-70" />
                  </a>

                  <button
                    type="button"
                    disabled={isJoining}
                    onClick={() => handleJoin(cafe)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-(--secondColor) hover:opacity-95 active:scale-95 text-[#3B2418] font-bold text-xs shadow-xs transition-all cursor-pointer disabled:opacity-50"
                  >
                    <LuPlus className="w-3.5 h-3.5" />
                    <span>{isJoining ? "Joining..." : "Join Café"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
