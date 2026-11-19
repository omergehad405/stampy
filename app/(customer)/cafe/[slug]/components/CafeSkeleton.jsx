"use client";

import React from "react";

export default function CafeSkeleton() {
  return (
    <div className="w-full space-y-6 animate-pulse">
      {/* Cover Skeleton */}
      <div className="w-full h-44 sm:h-56 md:h-64 lg:h-72 rounded-3xl bg-(--mainColor)/10" />

      {/* Identity Bar Skeleton */}
      <div className="px-2 sm:px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-14 mb-4">
          <div className="flex items-end gap-3.5 sm:gap-4">
            <div className="w-22 h-22 sm:w-28 sm:h-28 rounded-2xl sm:rounded-3xl border-4 border-(--bgColor) bg-(--mainColor)/15 shrink-0" />
            <div className="space-y-2 pb-2">
              <div className="w-48 sm:w-64 h-6 sm:h-8 rounded-lg bg-(--mainColor)/15" />
              <div className="w-32 h-4 rounded-md bg-(--mainColor)/10" />
              <div className="w-24 h-4 rounded-full bg-(--mainColor)/10" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="w-24 h-9 rounded-xl bg-(--mainColor)/15" />
            <div className="w-16 h-9 rounded-xl bg-(--mainColor)/10" />
          </div>
        </div>
      </div>

      {/* About Skeleton */}
      <div className="w-full h-40 rounded-3xl bg-(--mainColor)/8" />

      {/* Info Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-36 rounded-2xl bg-(--mainColor)/8" />
        <div className="h-36 rounded-2xl bg-(--mainColor)/8" />
        <div className="h-36 rounded-2xl bg-(--mainColor)/8" />
        <div className="h-36 rounded-2xl bg-(--mainColor)/8" />
      </div>

      {/* Social Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="h-24 rounded-2xl bg-(--mainColor)/8" />
        <div className="h-24 rounded-2xl bg-(--mainColor)/8" />
        <div className="h-24 rounded-2xl bg-(--mainColor)/8" />
        <div className="h-24 rounded-2xl bg-(--mainColor)/8" />
      </div>
    </div>
  );
}
