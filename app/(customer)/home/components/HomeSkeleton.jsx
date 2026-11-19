"use client";

import React from "react";

export default function HomeSkeleton() {
  return (
    <div className="w-full max-w-md md:max-w-4xl lg:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-10 pb-16 space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between pb-3 border-b border-(--mainColor)/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-(--mainColor)/15 shrink-0" />
          <div className="space-y-1.5">
            <div className="w-24 h-4 rounded-md bg-(--mainColor)/15" />
            <div className="w-16 h-3 rounded-md bg-(--mainColor)/10" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-(--mainColor)/10" />
          <div className="w-9 h-9 rounded-full bg-(--mainColor)/10" />
        </div>
      </div>

      {/* Greeting Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div className="space-y-2">
          <div className="w-48 sm:w-64 h-8 sm:h-10 rounded-xl bg-(--mainColor)/15" />
          <div className="w-60 sm:w-80 h-4 rounded-md bg-(--mainColor)/10" />
        </div>
        <div className="w-36 h-11 rounded-2xl bg-(--mainColor)/10 shrink-0" />
      </div>

      {/* Overview Stat Cards Skeleton (4 cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-(--mainColor)/20 border border-(--mainColor)/10 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-(--mainColor)/15" />
              <div className="w-12 h-3 rounded-md bg-(--mainColor)/10" />
            </div>
            <div className="w-16 h-7 rounded-lg bg-(--mainColor)/25" />
            <div className="w-24 h-3.5 rounded-md bg-(--mainColor)/15" />
          </div>
        ))}
      </div>

      {/* Continue Journey Skeleton */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="w-44 h-6 rounded-lg bg-(--mainColor)/15" />
            <div className="w-32 h-3.5 rounded-md bg-(--mainColor)/10" />
          </div>
          <div className="w-16 h-4 rounded-md bg-(--mainColor)/10" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-5 rounded-3xl bg-(--mainColor)/20 border border-(--mainColor)/10 space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-(--mainColor)/15 shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <div className="w-28 h-4 rounded-md bg-(--mainColor)/20" />
                  <div className="w-20 h-3 rounded-md bg-(--mainColor)/15" />
                </div>
              </div>
              <div className="w-full h-2 rounded-full bg-(--mainColor)/15" />
              <div className="w-full h-9 rounded-xl bg-(--mainColor)/15" />
            </div>
          ))}
        </div>
      </div>

      {/* Discover Cafes Skeleton */}
      <div className="space-y-4">
        <div className="w-36 h-6 rounded-lg bg-(--mainColor)/15" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-64 rounded-3xl bg-(--mainColor)/20 border border-(--mainColor)/10"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
