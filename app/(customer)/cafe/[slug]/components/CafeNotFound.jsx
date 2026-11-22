"use client";

import React from "react";
import Link from "next/link";
import { LuStore } from "react-icons/lu";

export default function CafeNotFound() {
  return (
    <div className="w-full max-w-md mx-auto px-4 py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-(--mainColor)/10 text-(--mainColor) flex items-center justify-center mx-auto mb-4">
        <LuStore className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-bold">Cafe Not Found</h2>
      <p className="text-xs opacity-75 mt-1.5">
        The cafe identifier you scanned is not registered on Notch.
      </p>
      <Link
        href="/my-cafes"
        className="mt-6 inline-flex px-5 py-2.5 rounded-xl bg-(--secondColor) text-[#3b2418] font-bold text-xs"
      >
        View My Cafes
      </Link>
    </div>
  );
}
