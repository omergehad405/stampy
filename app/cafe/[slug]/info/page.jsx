"use client";

import React from "react";
import { useParams } from "next/navigation";
import { LuCoffee, LuStore } from "react-icons/lu";

import CafeTopBar from "../CafeTopBar";
import { useCafeData } from "@/app/features/cafe/useCafeData";

import CafeHeader from "@/app/features/cafe/CafeHeader";
import CafeAbout from "@/app/features/cafe/CafeAbout";
import CafeInformation from "@/app/features/cafe/CafeInformation";
import CafeSocialLinks from "@/app/features/cafe/CafeSocialLinks";
import CafeMenuTeaser from "@/app/features/cafe/CafeMenuTeaser";
import CafeSkeleton from "@/app/features/cafe/CafeSkeleton";

function DedicatedCafeInfoContent() {
  const params = useParams();
  const slug = params?.slug;

  const { cafe, isLoading, operatingStatus } = useCafeData(slug);

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

          {/* Section B: About the Cafe */}
          <CafeAbout about={cafe?.about} />

          {/* Section C: Cafe Information (Location, Hours, Contact, Website) */}
          <CafeInformation cafe={cafe} operatingStatus={operatingStatus} />

          {/* Section D: Social Media Accounts */}
          <CafeSocialLinks socialMedia={cafe?.socialMedia} />

          {/* Section E: Digital Menu Teaser Section */}
          <CafeMenuTeaser menuPreview={cafe?.menuPreview} />

          {/* Trust & Brand Footer Note */}
          <footer className="pt-6 sm:pt-8 text-center text-xs text-[var(--mainColor)]/50 border-t border-[var(--mainColor)]/10">
            <p className="flex items-center justify-center gap-1.5">
              <LuCoffee className="w-3.5 h-3.5 text-[var(--mainColor)]/40" />
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
