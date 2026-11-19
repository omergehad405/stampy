"use client";

import React from "react";
import { LuPencil, LuShieldCheck } from "react-icons/lu";

export default function ProfileOverview({ user, initials, onEdit }) {
  return (
    <section className="mt-6 p-6 sm:p-8 rounded-3xl bg-(--mainColor) text-(--bgColor) shadow-sm">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-(--secondColor) text-[#3b2418] flex items-center justify-center text-2xl sm:text-3xl font-extrabold shadow-md shrink-0">
          {initials}
        </div>

        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {user?.name || "Omar Hassan"}
              </h1>
              <p className="text-xs sm:text-sm opacity-80 mt-0.5">
                Stampy Member ID:{" "}
                <span className="font-mono font-semibold tracking-wider">
                  {user?.memberCode || "STAMPY-7842"}
                </span>
              </p>
            </div>

            <button
              type="button"
              onClick={onEdit}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-(--secondColor) text-[#3b2418] font-bold text-xs sm:text-sm hover:opacity-90 active:scale-95 transition-all shadow-xs cursor-pointer"
            >
              <LuPencil className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-(--bgColor)/15 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs opacity-85">
            <span className="flex items-center gap-1.5">
              <LuShieldCheck className="w-4 h-4 text-emerald-400" />
              Verified Account
            </span>
            <span>Member since {user?.joinedDate || "October 2026"}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
