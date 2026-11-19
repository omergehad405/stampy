"use client";

import React from "react";
import Image from "next/image";
import { LuMapPin, LuSparkles, LuStore } from "react-icons/lu";

export default function PublicCafeHero({ cafe, isJoining, onJoin }) {
  return (
    <section className="relative mt-6 rounded-3xl overflow-hidden border border-(--mainColor)/15 shadow-sm bg-(--mainColor) text-(--bgColor)">
      <div className="relative h-48 sm:h-64 lg:h-72 w-full">
        {cafe.coverImage && (
          <Image
            src={cafe.coverImage}
            alt={cafe.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover opacity-45"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-(--mainColor) via-(--mainColor)/70 to-transparent" />

        <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-white/20 border-2 border-(--bgColor)/30 shrink-0 shadow-md">
              {cafe.logoImage ? (
                <Image
                  src={cafe.logoImage}
                  alt={cafe.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <LuStore className="w-6 h-6" />
                </div>
              )}
            </div>

            <div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-(--secondColor) text-[#3b2418] px-2.5 py-0.5 rounded-full">
                {cafe.category}
              </span>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold mt-1">
                {cafe.name}
              </h1>
              <p className="text-xs sm:text-sm opacity-80 flex items-center gap-1 mt-0.5">
                <LuMapPin className="w-3.5 h-3.5" />
                <span>{cafe.location?.district || cafe.location?.city}</span>
                <span>•</span>
                <span>{cafe.stampTarget}-Stamp Loyalty Program</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onJoin}
            disabled={isJoining}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-(--secondColor) text-[#3b2418] font-bold text-sm sm:text-base hover:opacity-95 active:scale-95 transition-all shadow-md cursor-pointer shrink-0"
          >
            <LuSparkles className="w-4 h-4 text-amber-800" />
            <span>{isJoining ? "Joining..." : "Join Loyalty Program"}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
