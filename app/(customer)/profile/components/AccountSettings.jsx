"use client";

import React, { useState, useEffect } from "react";
import { LuBell, LuFingerprint } from "react-icons/lu";
import { toast } from "react-toastify";
import { useLoyaltyStore } from "@/app/stores/useLoyaltyStore";

export default function AccountSettings({ user }) {
  const { updateUserProfile } = useLoyaltyStore();

  const [notificationsEnabled, setNotificationsEnabled] = useState(
    user?.notificationsEnabled ?? true
  );
  const [biometricsEnabled, setBiometricsEnabled] = useState(
    user?.biometricsEnabled ?? true
  );

  useEffect(() => {
    if (user?.notificationsEnabled !== undefined) {
      setNotificationsEnabled(user.notificationsEnabled);
    }
    if (user?.biometricsEnabled !== undefined) {
      setBiometricsEnabled(user.biometricsEnabled);
    }
  }, [user?.notificationsEnabled, user?.biometricsEnabled]);

  const handleToggleNotifications = () => {
    const nextVal = !notificationsEnabled;
    setNotificationsEnabled(nextVal);
    updateUserProfile({ notificationsEnabled: nextVal });
    toast(`Notifications ${nextVal ? "enabled" : "muted"}`, { type: "info" });
  };

  const handleToggleBiometrics = () => {
    const nextVal = !biometricsEnabled;
    setBiometricsEnabled(nextVal);
    updateUserProfile({ biometricsEnabled: nextVal });
    toast(`Quick auth ${nextVal ? "enabled" : "disabled"}`, { type: "info" });
  };

  return (
    <section className="mt-6 p-5 sm:p-6 rounded-3xl bg-(--mainColor) text-(--bgColor) border border-(--bgColor)/15 shadow-sm">
      <h3 className="text-base sm:text-lg font-bold text-(--bgColor) mb-4">
        Account Settings
      </h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between py-1 text-xs sm:text-sm">
          <div className="flex items-center gap-2.5">
            <LuBell className="w-4 h-4 opacity-75" />
            <div>
              <p className="font-semibold text-(--bgColor)">
                Visit Notifications
              </p>
              <p className="text-[11px] text-(--bgColor)/70">
                Receive alerts when stamps are recorded or rewards unlock
              </p>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={notificationsEnabled}
            onClick={handleToggleNotifications}
            className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative p-0.5 ${
              notificationsEnabled ? "bg-(--secondColor)" : "bg-(--bgColor)/20"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                notificationsEnabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between py-1 border-t border-(--bgColor)/15 pt-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2.5">
            <LuFingerprint className="w-4 h-4 opacity-75" />
            <div>
              <p className="font-semibold text-(--bgColor)">
                Fast QR Authorization
              </p>
              <p className="text-[11px] text-(--bgColor)/70">
                Quick verification for in-store redemption
              </p>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={biometricsEnabled}
            onClick={handleToggleBiometrics}
            className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative p-0.5 ${
              biometricsEnabled ? "bg-(--secondColor)" : "bg-(--bgColor)/20"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                biometricsEnabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>
    </section>
  );
}
