"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  LuCoffee,
  LuMapPin,
  LuPhone,
  LuShare2,
  LuBadgeCheck,
  LuCheck,
} from "react-icons/lu";
import { toast } from "react-toastify";

export default function CafeHeader({ cafe, operatingStatus }) {
  const [imageError, setImageError] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  if (!cafe) return null;

  const {
    name,
    tagline,
    category,
    isActive = true,
    isVerified = true,
    coverImage,
    coverImageAlt,
    logoImage,
    logoAlt,
    location,
    contact,
  } = cafe;

  const handleShare = async () => {
    const shareData = {
      title: name,
      text: `${name} on Stampy - Digital Loyalty`,
      url: typeof window !== "undefined" ? window.location.href : "",
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // Fallback to clipboard if user cancels or share fails
      }
    }

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareData.url);
      setCopiedShare(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="relative w-full"
    >
      {/* Cover Image Container */}
      <div className="relative w-full h-44 sm:h-56 md:h-64 lg:h-72 rounded-3xl overflow-hidden bg-[var(--mainColor)]/10 shadow-sm border border-[var(--mainColor)]/10">
        {coverImage && !imageError ? (
          <Image
            src={coverImage}
            alt={coverImageAlt || `${name} cover`}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1100px"
            className="object-cover transition-transform duration-700 hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[var(--mainColor)]/15 via-[var(--secondColor)]/20 to-[var(--mainColor)]/10 text-[var(--mainColor)]">
            <LuCoffee className="w-16 h-16 opacity-30 mb-2" />
            <span className="text-xs uppercase tracking-widest font-semibold opacity-50">
              {category || "Specialty Cafe"}
            </span>
          </div>
        )}

        {/* Ambient Dark Gradient on bottom for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent pointer-events-none" />

        {/* Floating Active Badge on top-right of cover */}
        <div className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-10 flex items-center gap-2">
          {isActive && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md bg-[var(--bgColor)]/90 text-[var(--mainColor)] shadow-sm border border-[var(--bgColor)]/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Active Partner</span>
            </span>
          )}
        </div>
      </div>

      {/* Identity Info Bar (Overlapping Logo + Title + Quick Actions) */}
      <div className="relative px-2 sm:px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-14 mb-4">
          {/* Logo + Cafe Title */}
          <div className="flex items-end gap-3.5 sm:gap-4">
            {/* Overlapping Logo */}
            <div className="relative w-22 h-22 sm:w-28 sm:h-28 rounded-2xl sm:rounded-3xl border-4 border-[var(--bgColor)] shadow-lg bg-[var(--bgColor)] overflow-hidden shrink-0 flex items-center justify-center">
              {logoImage && !logoError ? (
                <Image
                  src={logoImage}
                  alt={logoAlt || `${name} logo`}
                  fill
                  sizes="(max-width: 640px) 96px, 120px"
                  className="object-cover"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[var(--mainColor)] text-[var(--bgColor)]">
                  <LuCoffee className="w-10 h-10" />
                </div>
              )}
            </div>

            {/* Title & Category Info */}
            <div className="pb-1 sm:pb-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-[var(--mainColor)]">
                  {name}
                </h1>
                {isVerified && (
                  <span
                    title="Verified Stampy Cafe"
                    className="inline-flex text-[var(--secondColor)] hover:scale-110 transition-transform"
                  >
                    <LuBadgeCheck className="w-5 h-5 sm:w-6 sm:h-6 fill-[var(--secondColor)] text-[var(--bgColor)]" />
                  </span>
                )}
              </div>

              {category && (
                <p className="text-xs sm:text-sm font-medium text-[var(--mainColor)]/75 mt-0.5">
                  {category}
                </p>
              )}

              {/* Real-time open/closed status pill */}
              {operatingStatus?.statusLabel && (
                <div className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-semibold">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      operatingStatus.isOpenNow
                        ? "bg-emerald-500"
                        : "bg-amber-500"
                    }`}
                  />
                  <span
                    className={
                      operatingStatus.isOpenNow
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "text-amber-700 dark:text-amber-400"
                    }
                  >
                    {operatingStatus.statusLabel}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 self-start sm:self-end pt-1">
            {location?.googleMapsUrl && (
              <a
                href={location.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[var(--secondColor)] text-[var(--mainColor)] hover:opacity-90 active:scale-95 transition-all shadow-sm"
              >
                <LuMapPin className="w-4 h-4 shrink-0" />
                <span>Directions</span>
              </a>
            )}

            {contact?.phone && (
              <a
                href={`tel:${contact.phone}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[var(--mainColor)]/10 text-[var(--mainColor)] hover:bg-[var(--mainColor)]/15 active:scale-95 transition-all border border-[var(--mainColor)]/10"
              >
                <LuPhone className="w-4 h-4 shrink-0" />
                <span className="hidden xs:inline">Call</span>
              </a>
            )}

            <button
              type="button"
              onClick={handleShare}
              aria-label="Share Cafe"
              className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[var(--mainColor)]/10 text-[var(--mainColor)] hover:bg-[var(--mainColor)]/15 active:scale-95 transition-all border border-[var(--mainColor)]/10 inline-flex items-center gap-1.5"
            >
              {copiedShare ? (
                <>
                  <LuCheck className="w-4 h-4 text-emerald-600" />
                  <span className="hidden sm:inline text-emerald-600">Copied</span>
                </>
              ) : (
                <>
                  <LuShare2 className="w-4 h-4 shrink-0" />
                  <span className="hidden sm:inline">Share</span>
                </>
              )}
            </button>
          </div>
        </div>

        {tagline && (
          <p className="text-xs sm:text-sm font-medium italic text-[var(--mainColor)]/70 pb-2">
            &ldquo;{tagline}&rdquo;
          </p>
        )}
      </div>
    </motion.header>
  );
}
