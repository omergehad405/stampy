"use client";

import React from "react";
import { LuUser, LuMail, LuPhone } from "react-icons/lu";

export default function PersonalInformation({ user }) {
  return (
    <section className="mt-6 p-5 sm:p-6 rounded-3xl bg-(--mainColor) text-(--bgColor) border border-(--bgColor)/15 shadow-sm">
      <h3 className="text-base sm:text-lg font-bold text-(--bgColor) mb-4">
        Personal Information
      </h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between py-2 border-b border-(--bgColor)/15 text-xs sm:text-sm">
          <span className="opacity-75 flex items-center gap-2">
            <LuUser className="w-4 h-4" />
            Full Name
          </span>
          <span className="font-semibold text-(--bgColor)">
            {user?.name || "Omar Hassan"}
          </span>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-(--bgColor)/15 text-xs sm:text-sm">
          <span className="opacity-75 flex items-center gap-2">
            <LuMail className="w-4 h-4" />
            Email Address
          </span>
          <span className="font-semibold text-(--bgColor)">
            {user?.email || "omar.hassan@example.com"}
          </span>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-(--bgColor)/15 text-xs sm:text-sm">
          <span className="opacity-75 flex items-center gap-2">
            <LuPhone className="w-4 h-4" />
            Phone Number
          </span>
          <span className="font-semibold text-(--bgColor)">
            {user?.phone || "+44 7700 900456"}
          </span>
        </div>
      </div>
    </section>
  );
}
