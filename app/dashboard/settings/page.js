"use client";

import React, { useState } from "react";
import {
  LuSettings,
  LuUser,
  LuShield,
  LuBell,
  LuSave,
  LuLock,
  LuCircleCheck,
} from "react-icons/lu";
import { toast } from "react-toastify";
import DashboardPageHeader from "../components/DashboardPageHeader";
import { useDashboardStore } from "@/app/stores/useDashboardStore";
import { useDashboardAuthStore } from "@/app/stores/useDashboardAuthStore";

export default function DashboardSettingsPage() {
  const { settings, updateSettings } = useDashboardStore();
  const { currentUser, updateProfile } = useDashboardAuthStore();

  const [activeTab, setActiveTab] = useState("account"); // 'account' | 'security' | 'notifications'

  // Account form
  const [accountForm, setAccountForm] = useState({
    name: currentUser?.name || "Elena Rostova",
    email: currentUser?.email || "elena@coffeehouse.london",
    phone: currentUser?.phone || "+44 7700 900111",
    avatar: currentUser?.avatar || "",
  });

  // Security form
  const [securityForm, setSecurityForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false,
  });

  // Notifications form
  const [notifications, setNotifications] = useState({
    emailDigests: settings.emailDigests ?? true,
    instantScanNotification: settings.instantScanNotification ?? true,
    autoRewardAlert: settings.autoRewardAlert ?? true,
  });

  const handleSaveAccount = (e) => {
    e.preventDefault();
    updateProfile(accountForm);
    toast.success("Account profile updated!");
  };

  const handleSaveSecurity = (e) => {
    e.preventDefault();
    if (securityForm.newPassword && securityForm.newPassword !== securityForm.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    setSecurityForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      twoFactorEnabled: securityForm.twoFactorEnabled,
    });
    toast.success("Security credentials updated!");
  };

  const handleSaveNotifications = (e) => {
    e.preventDefault();
    updateSettings(notifications);
    toast.success("Notification preferences saved!");
  };

  const tabs = [
    { key: "account", label: "Staff Profile", icon: LuUser },
    { key: "security", label: "Password & Security", icon: LuShield },
    { key: "notifications", label: "Notifications", icon: LuBell },
  ];

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Settings & Preferences"
        description="Manage your staff profile credentials, security passwords, and notification triggers."
        breadcrumbs={[{ label: "Settings" }]}
      />

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] p-2 shadow-2xs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 text-xs font-bold transition ${
                activeTab === tab.key
                  ? "bg-(--mainColor) text-(--secondColor) shadow-xs"
                  : "text-(--mainColor)/70 hover:bg-[#ebdcc8]"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Staff Profile */}
      {activeTab === "account" && (
        <form
          onSubmit={handleSaveAccount}
          className="rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] p-6 shadow-2xs space-y-6"
        >
          <div className="border-b border-[#ebdcc8] pb-3">
            <h3 className="font-bold text-sm text-(--mainColor)">
              Your Staff Profile
            </h3>
            <p className="text-xs text-(--mainColor)/60">
              Personal identity details shown when recording visits and stamps.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-(--mainColor) mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={accountForm.name}
                onChange={(e) =>
                  setAccountForm({ ...accountForm, name: e.target.value })
                }
                className="w-full h-10 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none focus:border-(--mainColor)"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-(--mainColor) mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={accountForm.email}
                onChange={(e) =>
                  setAccountForm({ ...accountForm, email: e.target.value })
                }
                className="w-full h-10 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none focus:border-(--mainColor)"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-(--mainColor) mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                value={accountForm.phone}
                onChange={(e) =>
                  setAccountForm({ ...accountForm, phone: e.target.value })
                }
                className="w-full h-10 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none focus:border-(--mainColor)"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-(--mainColor) mb-1.5">
                Avatar Image URL
              </label>
              <input
                type="url"
                value={accountForm.avatar}
                onChange={(e) =>
                  setAccountForm({ ...accountForm, avatar: e.target.value })
                }
                className="w-full h-10 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none focus:border-(--mainColor)"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-(--mainColor) px-5 py-2 text-xs font-bold text-(--secondColor)"
            >
              <LuSave className="h-4 w-4" />
              <span>Update Profile</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Password & Security */}
      {activeTab === "security" && (
        <form
          onSubmit={handleSaveSecurity}
          className="rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] p-6 shadow-2xs space-y-6"
        >
          <div className="border-b border-[#ebdcc8] pb-3">
            <h3 className="font-bold text-sm text-(--mainColor)">
              Password & Security Settings
            </h3>
            <p className="text-xs text-(--mainColor)/60">
              Manage your login password and account protection.
            </p>
          </div>

          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-bold text-(--mainColor) mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                value={securityForm.currentPassword}
                onChange={(e) =>
                  setSecurityForm({ ...securityForm, currentPassword: e.target.value })
                }
                placeholder="••••••••"
                className="w-full h-10 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none focus:border-(--mainColor)"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-(--mainColor) mb-1.5">
                New Password
              </label>
              <input
                type="password"
                value={securityForm.newPassword}
                onChange={(e) =>
                  setSecurityForm({ ...securityForm, newPassword: e.target.value })
                }
                placeholder="••••••••"
                className="w-full h-10 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none focus:border-(--mainColor)"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-(--mainColor) mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                value={securityForm.confirmPassword}
                onChange={(e) =>
                  setSecurityForm({ ...securityForm, confirmPassword: e.target.value })
                }
                placeholder="••••••••"
                className="w-full h-10 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none focus:border-(--mainColor)"
              />
            </div>
          </div>

          <div className="border-t border-[#ebdcc8] pt-4">
            <label className="flex items-start gap-3 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] p-3.5 cursor-pointer max-w-md">
              <input
                type="checkbox"
                checked={securityForm.twoFactorEnabled}
                onChange={(e) =>
                  setSecurityForm({
                    ...securityForm,
                    twoFactorEnabled: e.target.checked,
                  })
                }
                className="mt-0.5 rounded text-(--mainColor)"
              />
              <div className="text-xs">
                <span className="font-bold text-(--mainColor)">
                  Two-Factor Authentication (2FA)
                </span>
                <p className="mt-0.5 text-[11px] text-(--mainColor)/70">
                  Require a verification code when signing in from an unrecognized device.
                </p>
              </div>
            </label>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-(--mainColor) px-5 py-2 text-xs font-bold text-(--secondColor)"
            >
              <LuLock className="h-4 w-4" />
              <span>Update Password</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 4: Notifications */}
      {activeTab === "notifications" && (
        <form
          onSubmit={handleSaveNotifications}
          className="rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] p-6 shadow-2xs space-y-6"
        >
          <div className="border-b border-[#ebdcc8] pb-3">
            <h3 className="font-bold text-sm text-(--mainColor)">
              Notification Preferences
            </h3>
            <p className="text-xs text-(--mainColor)/60">
              Email digests and instant cashier alerts.
            </p>
          </div>

          <div className="space-y-3.5">
            <label className="flex items-start gap-3 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] p-3.5 cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.emailDigests}
                onChange={(e) =>
                  setNotifications({
                    ...notifications,
                    emailDigests: e.target.checked,
                  })
                }
                className="mt-0.5 rounded text-(--mainColor)"
              />
              <div className="text-xs">
                <span className="font-bold text-(--mainColor)">
                  Daily Loyalty Digest
                </span>
                <p className="mt-0.5 text-[11px] text-(--mainColor)/70">
                  Receive a daily morning summary of stamps awarded, new member registrations, and top active customers.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] p-3.5 cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.autoRewardAlert}
                onChange={(e) =>
                  setNotifications({
                    ...notifications,
                    autoRewardAlert: e.target.checked,
                  })
                }
                className="mt-0.5 rounded text-(--mainColor)"
              />
              <div className="text-xs">
                <span className="font-bold text-(--mainColor)">
                  High-Tier Reward Redemption Alerts
                </span>
                <p className="mt-0.5 text-[11px] text-(--mainColor)/70">
                  Send an email notification whenever a 10+ stamp reward (e.g. 20% discount or retail coffee beans) is redeemed.
                </p>
              </div>
            </label>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-(--mainColor) px-5 py-2 text-xs font-bold text-(--secondColor)"
            >
              <LuSave className="h-4 w-4" />
              <span>Save Preferences</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
