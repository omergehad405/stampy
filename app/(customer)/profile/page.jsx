"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LuUser,
  LuMail,
  LuPhone,
  LuShieldCheck,
  LuBell,
  LuLogOut,
  LuPencil,
  LuCheck,
  LuX,
  LuFingerprint,
} from "react-icons/lu";
import { toast } from "react-toastify";

import ThemeToggle from "@/app/components/ui/ThemeToggle";
import NotificationBox from "@/app/components/layout/NotificationBox";
import { useLoyaltyStore } from "@/app/stores/useLoyaltyStore";

export default function CustomerProfilePage() {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const { user, updateUserProfile } = useLoyaltyStore();

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: user?.name || "Omar Hassan",
    email: user?.email || "omar.hassan@example.com",
    phone: user?.phone || "+44 7700 900456",
  });

  // Settings toggles
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    user?.notificationsEnabled ?? true
  );
  const [biometricsEnabled, setBiometricsEnabled] = useState(
    user?.biometricsEnabled ?? true
  );

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!editForm.name.trim()) {
      toast("Name cannot be empty", { type: "error" });
      return;
    }
    updateUserProfile({
      name: editForm.name.trim(),
      email: editForm.email.trim(),
      phone: editForm.phone.trim(),
    });
    setIsEditModalOpen(false);
    toast("Profile updated successfully! 🎉", { type: "success" });
  };

  const handleLogout = () => {
    setIsLogoutModalOpen(false);
    toast("You have logged out of your Stampy account.", { type: "info" });
  };

  // User initials
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "OH";

  return (
    <div className="w-full max-w-md md:max-w-3xl lg:max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-10 pb-16">
      {/* Top Bar Navigation */}
      <header className="flex items-center justify-between gap-3 pb-3 border-b border-[var(--mainColor)]/10">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-[var(--mainColor)] flex items-center justify-center text-[var(--bgColor)] shadow-sm shrink-0">
            <LuUser className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm lg:text-base font-bold leading-tight text-[var(--mainColor)] truncate">
              Stampy Account
            </h2>
            <p className="text-[11px] sm:text-xs font-medium opacity-70 truncate">
              Customer Profile
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <ThemeToggle />
          <button
            type="button"
            aria-label="Open notifications"
            onClick={() => setIsNotificationOpen(true)}
            className="relative p-2 rounded-full hover:bg-[var(--mainColor)]/10 text-[var(--mainColor)] transition-colors cursor-pointer shrink-0"
          >
            <LuBell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--secondColor)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--secondColor)]"></span>
            </span>
          </button>
        </div>
      </header>

      {/* Profile Overview Card */}
      <section className="mt-6 p-6 sm:p-8 rounded-3xl bg-[var(--mainColor)] text-[var(--bgColor)] shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          {/* Avatar Initials Pill */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-[var(--secondColor)] text-[#3b2418] flex items-center justify-center text-2xl sm:text-3xl font-extrabold shadow-md shrink-0">
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
                onClick={() => {
                  setEditForm({
                    name: user?.name || "",
                    email: user?.email || "",
                    phone: user?.phone || "",
                  });
                  setIsEditModalOpen(true);
                }}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[var(--secondColor)] text-[#3b2418] font-bold text-xs sm:text-sm hover:opacity-90 active:scale-95 transition-all shadow-xs cursor-pointer"
              >
                <LuPencil className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-[var(--bgColor)]/15 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs opacity-85">
              <span className="flex items-center gap-1.5">
                <LuShieldCheck className="w-4 h-4 text-emerald-400" />
                Verified Account
              </span>
              <span>Member since {user?.joinedDate || "October 2026"}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Personal Information Section */}
      <section className="mt-6 p-5 sm:p-6 rounded-3xl bg-[var(--mainColor)] text-[var(--bgColor)] border border-[var(--bgColor)]/15 shadow-sm">
        <h3 className="text-base sm:text-lg font-bold text-[var(--bgColor)] mb-4">
          Personal Information
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-[var(--bgColor)]/15 text-xs sm:text-sm">
            <span className="opacity-75 flex items-center gap-2">
              <LuUser className="w-4 h-4" />
              Full Name
            </span>
            <span className="font-semibold text-[var(--bgColor)]">
              {user?.name || "Omar Hassan"}
            </span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-[var(--bgColor)]/15 text-xs sm:text-sm">
            <span className="opacity-75 flex items-center gap-2">
              <LuMail className="w-4 h-4" />
              Email Address
            </span>
            <span className="font-semibold text-[var(--bgColor)]">
              {user?.email || "omar.hassan@example.com"}
            </span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-[var(--bgColor)]/15 text-xs sm:text-sm">
            <span className="opacity-75 flex items-center gap-2">
              <LuPhone className="w-4 h-4" />
              Phone Number
            </span>
            <span className="font-semibold text-[var(--bgColor)]">
              {user?.phone || "+44 7700 900456"}
            </span>
          </div>
        </div>
      </section>

      {/* Account Settings & Preferences */}
      <section className="mt-6 p-5 sm:p-6 rounded-3xl bg-[var(--mainColor)] text-[var(--bgColor)] border border-[var(--bgColor)]/15 shadow-sm">
        <h3 className="text-base sm:text-lg font-bold text-[var(--bgColor)] mb-4">
          Account Settings
        </h3>

        <div className="space-y-4">
          {/* Notification Toggle */}
          <div className="flex items-center justify-between py-1 text-xs sm:text-sm">
            <div className="flex items-center gap-2.5">
              <LuBell className="w-4 h-4 opacity-75" />
              <div>
                <p className="font-semibold text-[var(--bgColor)]">
                  Visit Notifications
                </p>
                <p className="text-[11px] text-[var(--bgColor)]/70">
                  Receive alerts when stamps are recorded or rewards unlock
                </p>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={notificationsEnabled}
              onClick={() => {
                setNotificationsEnabled(!notificationsEnabled);
                toast(
                  `Notifications ${!notificationsEnabled ? "enabled" : "muted"}`,
                  { type: "info" }
                );
              }}
              className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative p-0.5 ${
                notificationsEnabled ? "bg-[var(--secondColor)]" : "bg-[var(--bgColor)]/20"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                  notificationsEnabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Biometrics Toggle */}
          <div className="flex items-center justify-between py-1 border-t border-[var(--bgColor)]/15 pt-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2.5">
              <LuFingerprint className="w-4 h-4 opacity-75" />
              <div>
                <p className="font-semibold text-[var(--bgColor)]">
                  Fast QR Authorization
                </p>
                <p className="text-[11px] text-[var(--bgColor)]/70">
                  Quick verification for in-store redemption
                </p>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={biometricsEnabled}
              onClick={() => {
                setBiometricsEnabled(!biometricsEnabled);
                toast(
                  `Quick auth ${!biometricsEnabled ? "enabled" : "disabled"}`,
                  { type: "info" }
                );
              }}
              className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative p-0.5 ${
                biometricsEnabled ? "bg-[var(--secondColor)]" : "bg-[var(--bgColor)]/20"
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

      {/* Log Out Action */}
      <section className="mt-8 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setIsLogoutModalOpen(true)}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border border-rose-300 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs sm:text-sm font-bold transition-all cursor-pointer"
        >
          <LuLogOut className="w-4 h-4" />
          <span>Log Out of Stampy</span>
        </button>

        <p className="text-[11px] opacity-50 text-center sm:text-right">
          Stampy v1.2 • Digital Loyalty Multi-Cafe Platform
        </p>
      </section>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsEditModalOpen(false)}
          />

          <div
            role="dialog"
            aria-modal="true"
            className="relative z-10 bg-[var(--mainColor)] text-[var(--bgColor)] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[var(--bgColor)]/15"
          >
            <button
              type="button"
              aria-label="Close modal"
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-[var(--bgColor)] hover:bg-[var(--bgColor)]/10 transition cursor-pointer"
            >
              <LuX className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold">Edit Personal Information</h3>
            <p className="text-xs opacity-70 mt-1">
              Update your customer name, email address, and phone number.
            </p>

            <form onSubmit={handleSaveProfile} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  required
                  className="w-full h-11 px-3.5 rounded-xl border border-[var(--bgColor)]/20 bg-[var(--bgColor)]/10 text-sm text-[var(--bgColor)] placeholder:text-[var(--bgColor)]/50 outline-none focus:border-[var(--secondColor)] focus:ring-2 focus:ring-[var(--secondColor)]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                  required
                  className="w-full h-11 px-3.5 rounded-xl border border-[var(--bgColor)]/20 bg-[var(--bgColor)]/10 text-sm text-[var(--bgColor)] placeholder:text-[var(--bgColor)]/50 outline-none focus:border-[var(--secondColor)] focus:ring-2 focus:ring-[var(--secondColor)]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) =>
                    setEditForm({ ...editForm, phone: e.target.value })
                  }
                  required
                  className="w-full h-11 px-3.5 rounded-xl border border-[var(--bgColor)]/20 bg-[var(--bgColor)]/10 text-sm text-[var(--bgColor)] placeholder:text-[var(--bgColor)]/50 outline-none focus:border-[var(--secondColor)] focus:ring-2 focus:ring-[var(--secondColor)]/30"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold hover:bg-[var(--bgColor)]/10 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[var(--secondColor)] text-[#3b2418] text-xs sm:text-sm font-bold shadow-sm hover:opacity-90 active:scale-95 transition cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsLogoutModalOpen(false)}
          />

          <div
            role="dialog"
            aria-modal="true"
            className="relative z-10 bg-[var(--mainColor)] text-[var(--bgColor)] rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center border border-[var(--bgColor)]/15"
          >
            <h3 className="text-xl font-bold">Log Out?</h3>
            <p className="text-xs opacity-75 mt-2">
              Are you sure you want to log out of your Stampy customer account?
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsLogoutModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-[var(--bgColor)]/20 text-xs sm:text-sm font-semibold hover:bg-[var(--bgColor)]/10 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white text-xs sm:text-sm font-bold shadow-sm hover:bg-rose-700 active:scale-95 transition cursor-pointer"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Box Drawer */}
      <NotificationBox
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </div>
  );
}
