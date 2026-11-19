"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  LuPlus,
  LuCheck,
  LuStore,
  LuArrowRight,
  LuMapPin,
  LuGift,
} from "react-icons/lu";

export default function DiscoverCafesSection({ unjoinedCafes, onJoinCafe }) {
  const [joiningSlug, setJoiningSlug] = useState(null);

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
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-(--mainColor)/10 text-(--mainColor)">
                {unjoinedCafes.length} Available
              </span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-(--mainColor)/70 mt-0.5">
            Join participating neighborhood cafés and start earning free coffee and perks.
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

      {/* Cards Grid or All-Joined State */}
      {unjoinedCafes.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 sm:p-10 rounded-3xl bg-(--mainColor) text-(--bgColor) border border-(--bgColor)/15 text-center flex flex-col items-center justify-center shadow-sm"
        >
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center mb-3">
            <LuCheck className="w-7 h-7" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-(--bgColor)">
            You&apos;ve Joined All Partner Cafés!
          </h3>
          <p className="text-xs sm:text-sm text-(--bgColor)/75 mt-1 max-w-sm">
            Awesome! You are an active loyalty member at every participating spot on Stampy. Stay tuned as new partner cafés join our network!
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {unjoinedCafes.map((cafe, index) => {
            const firstReward = cafe.rewards?.[0];
            const isJoining = joiningSlug === cafe.slug;

            return (
              <motion.div
                key={cafe.slug}
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
                      <div className="flex items-center gap-2.5">
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
                              {cafe.location?.district || cafe.location?.city}
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
                      {cafe.about?.shortDescription || cafe.tagline}
                    </p>

                    {/* Loyalty program preview pill */}
                    {firstReward && (
                      <div className="mt-3.5 p-2.5 sm:p-3 rounded-2xl bg-(--bgColor)/10 border border-(--bgColor)/15 flex items-center justify-between text-xs text-(--bgColor)">
                        <span className="flex items-center gap-1.5 min-w-0">
                          <LuGift className="w-3.5 h-3.5 text-(--secondColor) shrink-0" />
                          <span className="truncate font-semibold">
                            Earn: {firstReward.name}
                          </span>
                        </span>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-(--secondColor) text-[#3B2418] shrink-0 ml-2">
                          At {firstReward.stampsRequired} stamps
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
