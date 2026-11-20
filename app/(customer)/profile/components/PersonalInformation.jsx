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
            {user?.name || "Customer"}
          </span>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-(--bgColor)/15 text-xs sm:text-sm">
          <span className="opacity-75 flex items-center gap-2">
            <LuMail className="w-4 h-4" />
            Email Address
          </span>
          <span className="font-semibold text-(--bgColor)">
            {user?.email || "—"}
          </span>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-(--bgColor)/15 text-xs sm:text-sm">
          <span className="opacity-75 flex items-center gap-2">
            <LuPhone className="w-4 h-4" />
            Phone Number
          </span>
          <span className="font-semibold text-(--bgColor)">
            {user?.phone || "Not set"}
          </span>
        </div>
      </div>
    </section>
  );
}
