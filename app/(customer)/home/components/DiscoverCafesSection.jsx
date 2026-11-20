"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  LuPlus,
  LuStore,
  LuArrowRight,
  LuMapPin,
  LuGift,
  LuSparkles,
} from "react-icons/lu";

import { useLoyaltyStore } from "@/app/stores/useLoyaltyStore";
import { apiGetCafes } from "@/app/lib/cafeApi";
import { getAllRegisteredCafes } from "@/app/(customer)/cafe/data/cafesCatalog";

export default function DiscoverCafesSection({ onJoinCafe }) {
  const { isCafeJoined } = useLoyaltyStore();

  const [cafes, setCafes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [joiningSlug, setJoiningSlug] = useState(null);

  // Fetch cafes from the API endpoint and pick up to 2 random cafes on each refresh
  useEffect(() => {
    let isCancelled = false;

    async function loadCafes() {
      setIsLoading(true);
      try {
        let fetched = await apiGetCafes();
        // Fallback to static catalog if backend returns empty during offline or dev
        if (!fetched || fetched.length === 0) {
          fetched = getAllRegisteredCafes();
        }

        if (isCancelled) return;

        // Filter out any cafes the user has already joined
        const unjoined = (fetched || []).filter((c) => !isCafeJoined(c.slug));

        // Shuffle randomly on every mount / refresh
        const shuffled = [...unjoined].sort(() => 0.5 - Math.random());

        // Maximum 2 cafes
        setCafes(shuffled.slice(0, 2));
      } catch (err) {
        if (!isCancelled) {
          console.warn("[DiscoverCafes] API fetch error, falling back to catalog:", err.message);
          const fallback = getAllRegisteredCafes().filter((c) => !isCafeJoined(c.slug));
          const shuffled = [...fallback].sort(() => 0.5 - Math.random());
          setCafes(shuffled.slice(0, 2));
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    loadCafes();

    return () => {
      isCancelled = true;
    };
  }, [isCafeJoined]);

  const handleJoin = (cafe) => {
    setJoiningSlug(cafe.slug);
    try {
      const res = onJoinCafe(cafe.slug);
      if (res?.success) {
        toast.success(`Welcome to ${cafe.name}! 🎉 You've received a welcome stamp!`, {
          position: "top-right",
          autoClose: 3500,
        });
      }
    } finally {
      setJoiningSlug(null);
    }
  };

  // If not loading and no unjoined cafes available, don't show the section
  if (!isLoading && cafes.length === 0) {
    return null;
  }

  return (
    <section
      id="discover-cafes-section"
      aria-labelledby="discover-cafes-heading"
      className="space-y-4"
    >
      {/* Section Header */}
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2
              id="discover-cafes-heading"
              className="text-lg sm:text-xl font-bold tracking-tight text-(--mainColor) flex items-center gap-2"
            >
              <span>Discover Cafés</span>
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-(--secondColor)/25 text-[#3B2418]">
                <LuSparkles className="w-3 h-3 text-[#3B2418]" />
                <span>Featured Picks</span>
              </span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-(--mainColor)/70 mt-0.5">
            Join participating neighborhood cafés and start earning free coffee and rewards.
          </p>
        </div>

        <Link
          href="/my-cafes"
          className="text-xs sm:text-sm font-bold text-(--mainColor) hover:text-[#3B2418] hover:underline flex items-center gap-1 shrink-0"
        >
          <span>Explore All</span>
          <LuArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="rounded-3xl overflow-hidden bg-(--mainColor)/10 animate-pulse h-64 border border-(--mainColor)/15"
            />
          ))}
        </div>
      ) : (
        /* Cards Grid: maximum 2 cafes shown at each time */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {cafes.map((cafe, index) => {
            const firstReward = cafe.rewards?.[0];
            const isJoining = joiningSlug === cafe.slug;

            return (
              <motion.div
                key={cafe.slug || cafe.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.05 }}
                className="group relative flex flex-col justify-between rounded-3xl overflow-hidden bg-(--mainColor) text-(--bgColor) border border-(--bgColor)/15 shadow-sm hover:shadow-md hover:border-(--secondColor) transition-all duration-300"
              >
                <div>
                  {/* Cover Image with gradient overlay */}
                  <div className="relative w-full h-36 sm:h-40 bg-(--bgColor)/10 overflow-hidden">
                    {cafe.coverImage ? (
                      <Image
                        src={cafe.coverImage}
                        alt={cafe.coverImageAlt || cafe.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-(--bgColor)/40">
                        <LuStore className="w-12 h-12" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />

                    {/* Logo & Category floating badge */}
                    <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-white p-0.5 border-2 border-white shadow-sm shrink-0">
                          {cafe.logoImage ? (
                            <Image
                              src={cafe.logoImage}
                              alt={cafe.name}
                              fill
                              sizes="44px"
                              className="object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#3B2418]">
                              <LuStore className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div className="text-white drop-shadow-sm min-w-0">
                          <h3 className="text-base font-bold leading-tight truncate">
                            {cafe.name}
                          </h3>
                          <p className="text-[11px] text-white/90 flex items-center gap-1 mt-0.5">
                            <LuMapPin className="w-3 h-3 shrink-0" />
                            <span className="truncate">
                              {cafe.location?.district || cafe.location?.city || "Local Cafe"}
                            </span>
                          </p>
                        </div>
                      </div>

                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-(--secondColor) text-[#3B2418] shadow-xs shrink-0">
                        {cafe.stampTarget || 10} Stamps
                      </span>
                    </div>
                  </div>

                  {/* Body description & program teaser */}
                  <div className="p-4 sm:p-5">
                    <p className="text-xs sm:text-sm text-(--bgColor)/80 line-clamp-2 leading-relaxed">
                      {cafe.about?.shortDescription || cafe.tagline || "Specialty coffee and local community hub."}
                    </p>

                    {/* Loyalty program preview pill */}
                    {firstReward && (
                      <div className="mt-3.5 p-2.5 sm:p-3 rounded-2xl bg-(--bgColor)/10 border border-(--bgColor)/15 flex items-center justify-between text-xs text-(--bgColor)">
                        <span className="flex items-center gap-1.5 min-w-0">
                          <LuGift className="w-3.5 h-3.5 text-(--secondColor) shrink-0" />
                          <span className="truncate font-semibold">
                            Earn: {firstReward.name || firstReward.title}
                          </span>
                        </span>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-(--secondColor) text-[#3B2418] shrink-0 ml-2">
                          At {firstReward.stampsRequired || firstReward.requiredStamps} stamps
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer CTAs */}
                <div className="p-4 sm:p-5 pt-0 flex items-center gap-2.5">
                  <Link
                    href={`/cafe/${cafe.slug}/info`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-(--bgColor)/30 hover:bg-(--bgColor)/10 text-(--bgColor) font-bold text-xs transition-colors"
                  >
                    <span>View Info</span>
                  </Link>

                  <button
                    type="button"
                    disabled={isJoining}
                    onClick={() => handleJoin(cafe)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-(--secondColor) hover:opacity-95 active:scale-95 text-[#3B2418] font-bold text-xs shadow-xs transition-all cursor-pointer disabled:opacity-50"
                  >
                    <LuPlus className="w-4 h-4" />
                    <span>{isJoining ? "Joining..." : "Join Café"}</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}
