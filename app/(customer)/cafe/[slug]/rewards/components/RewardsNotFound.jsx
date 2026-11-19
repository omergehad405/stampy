"use client";

import React from "react";
import { LuStore } from "react-icons/lu";

export default function RewardsNotFound() {
  return (
    <div className="w-full max-w-md mx-auto px-4 py-16 text-center">
      <LuStore className="w-10 h-10 mx-auto mb-2 opacity-60" />
      <h2 className="text-xl font-bold">Cafe Not Found</h2>
    </div>
  );
}
