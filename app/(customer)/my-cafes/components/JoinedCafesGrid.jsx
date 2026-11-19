"use client";

import React from "react";
import { AnimatePresence } from "framer-motion";

import JoinedCafeCard from "./JoinedCafeCard";

export default function JoinedCafesGrid({ cafes, onLeave }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
      <AnimatePresence>
        {cafes.map((cafe) => (
          <JoinedCafeCard key={cafe.slug} cafe={cafe} onLeave={onLeave} />
        ))}
      </AnimatePresence>
    </div>
  );
}
