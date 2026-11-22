"use client";

import React, { useState, useRef } from "react";
import {
  LuSettings,
  LuUser,
  LuShield,
  LuBell,
  LuSave,
  LuLock,
  LuCircleCheck,
  LuUpload,
  LuLink,
} from "react-icons/lu";
import { toast } from "react-toastify";
import DashboardPageHeader from "../components/DashboardPageHeader";
import { useDashboardStore } from "@/app/stores/useDashboardStore";
import { useDashboardAuthStore } from "@/app/stores/useDashboardAuthStore";

export default function DashboardSettingsPage() {
  const { settings, updateSettings } = useDashboardStore();
  const { currentUser, updateProfile } = useDashboardAuthStore();

  const [activeTab, setActiveTab] = useState("account"); // 'account' | 'security' | 'notifications'

  // Avatar upload mode
  const avatarFileRef = useRef(null);
  const [avatarMode, setAvatarMode] = useState("url"); // 'url' | 'file'

  // Account form
  const [accountForm, setAccountForm] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
    avatar: currentUser?.avatar || "",
  });

  // Keep form in sync when currentUser loads from session
  React.useEffect(() => {
    if (currentUser) {
      setAccountForm((prev) => ({
        name: currentUser.name || prev.name,
        email: currentUser.email || prev.email,
        phone: currentUser.phone || prev.phone,
        avatar: currentUser.avatar || prev.avatar,
      }));
    }
  }, [currentUser]);

  // Security form
  const [securityForm, setSecurityForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
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
    });
    toast.success("Security credentials updated!");
  };

  const tabs = [
    { key: "account", label: "Your Profile", icon: LuUser },
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
      <div className="flex gap-2 overflow-x-auto rounded-2xl border border-(--bgColor)/15 bg-(--mainColor) p-2 shadow-2xs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
                activeTab === tab.key
                  ? "bg-(--secondColor) text-[#3B2418] shadow-xs"
                  : "text-(--bgColor)/70 hover:bg-(--bgColor)/10"
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
          className="rounded-2xl sm:rounded-3xl border border-(--bgColor)/15 bg-(--mainColor) text-(--bgColor) p-6 shadow-2xs space-y-6"
        >
          <div className="border-b border-(--bgColor)/15 pb-3">
            <h3 className="font-bold text-sm text-(--bgColor)">
              Your Staff Profile
            </h3>
            <p className="text-xs text-(--bgColor)/60">
              Personal identity details shown when recording visits and stamps.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-(--bgColor) mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={accountForm.name}
                onChange={(e) =>
                  setAccountForm({ ...accountForm, name: e.target.value })
                }
                className="w-full h-10 rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 px-3 text-xs text-(--bgColor) placeholder:text-(--bgColor)/40 outline-none focus:border-(--secondColor)"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-(--bgColor) mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={accountForm.email}
                onChange={(e) =>
                  setAccountForm({ ...accountForm, email: e.target.value })
                }
                className="w-full h-10 rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 px-3 text-xs text-(--bgColor) placeholder:text-(--bgColor)/40 outline-none focus:border-(--secondColor)"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-(--bgColor) mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                value={accountForm.phone}
                onChange={(e) =>
                  setAccountForm({ ...accountForm, phone: e.target.value })
                }
                className="w-full h-10 rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 px-3 text-xs text-(--bgColor) placeholder:text-(--bgColor)/40 outline-none focus:border-(--secondColor)"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-(--bgColor) mb-2">
                Avatar Image
              </label>

              {/* Toggle buttons */}
              <div className="flex gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => {
                    setAvatarMode("url");
                  }}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold border transition cursor-pointer ${
                    avatarMode === "url"
                      ? "bg-(--secondColor) text-[#3B2418] border-(--secondColor)"
                      : "border-(--bgColor)/20 bg-(--bgColor)/10 text-(--bgColor)/70 hover:bg-(--bgColor)/20"
                  }`}
                >
                  <LuLink className="h-3.5 w-3.5" />
                  Paste URL
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAvatarMode("file");
                    setTimeout(() => avatarFileRef.current?.click(), 50);
                  }}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold border transition cursor-pointer ${
                    avatarMode === "file"
                      ? "bg-(--secondColor) text-[#3B2418] border-(--secondColor)"
                      : "border-(--bgColor)/20 bg-(--bgColor)/10 text-(--bgColor)/70 hover:bg-(--bgColor)/20"
                  }`}
                >
                  <LuUpload className="h-3.5 w-3.5" />
                  Upload from Device
                </button>
              </div>

              {/* URL input */}
              {avatarMode === "url" && (
                <input
                  type="url"
                  value={accountForm.avatar}
                  onChange={(e) =>
                    setAccountForm({ ...accountForm, avatar: e.target.value })
                  }
                  placeholder="https://..."
                  className="w-full h-10 rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 px-3 text-xs text-(--bgColor) placeholder:text-(--bgColor)/40 outline-none focus:border-(--secondColor)"
                />
              )}

              {/* File input (hidden, triggered by button) */}
              <input
                ref={avatarFileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    setAccountForm({ ...accountForm, avatar: ev.target.result });
                    setAvatarMode("file");
                  };
                  reader.readAsDataURL(file);
                }}
              />

              {/* Upload prompt shown when file mode active but no file yet */}
              {avatarMode === "file" && !accountForm.avatar && (
                <button
                  type="button"
                  onClick={() => avatarFileRef.current?.click()}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-(--bgColor)/25 bg-(--bgColor)/5 py-6 text-xs font-semibold text-(--bgColor)/70 hover:border-(--secondColor)/50 cursor-pointer"
                >
                  <LuUpload className="h-5 w-5" />
                  Click to choose an image from your device
                </button>
              )}

              {/* Preview */}
              {accountForm.avatar && (
                <div className="mt-3 flex items-center gap-3">
                  <img
                    src={accountForm.avatar}
                    alt="Avatar preview"
                    className="h-14 w-14 rounded-full object-cover border-2 border-(--secondColor)"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setAccountForm({ ...accountForm, avatar: "" });
                      setAvatarMode("url");
                      if (avatarFileRef.current) avatarFileRef.current.value = "";
                    }}
                    className="text-xs font-semibold text-rose-300 hover:text-rose-200 hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-(--secondColor) px-5 py-2.5 text-xs font-bold text-[#3B2418] hover:bg-(--secondColor)/90 transition cursor-pointer"
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
          className="rounded-2xl sm:rounded-3xl border border-(--bgColor)/15 bg-(--mainColor) text-(--bgColor) p-6 shadow-2xs space-y-6"
        >
          <div className="border-b border-(--bgColor)/15 pb-3">
            <h3 className="font-bold text-sm text-(--bgColor)">
              Password & Security Settings
            </h3>
            <p className="text-xs text-(--bgColor)/60">
              Manage your login password and account protection.
            </p>
          </div>

          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-bold text-(--bgColor) mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                value={securityForm.currentPassword}
                onChange={(e) =>
                  setSecurityForm({ ...securityForm, currentPassword: e.target.value })
                }
                placeholder="••••••••"
                className="w-full h-10 rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 px-3 text-xs text-(--bgColor) placeholder:text-(--bgColor)/40 outline-none focus:border-(--secondColor)"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-(--bgColor) mb-1.5">
                New Password
              </label>
              <input
                type="password"
                value={securityForm.newPassword}
                onChange={(e) =>
                  setSecurityForm({ ...securityForm, newPassword: e.target.value })
                }
                placeholder="••••••••"
                className="w-full h-10 rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 px-3 text-xs text-(--bgColor) placeholder:text-(--bgColor)/40 outline-none focus:border-(--secondColor)"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-(--bgColor) mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                value={securityForm.confirmPassword}
                onChange={(e) =>
                  setSecurityForm({ ...securityForm, confirmPassword: e.target.value })
                }
                placeholder="••••••••"
                className="w-full h-10 rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 px-3 text-xs text-(--bgColor) placeholder:text-(--bgColor)/40 outline-none focus:border-(--secondColor)"
              />
            </div>
          </div>


          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-(--secondColor) px-5 py-2.5 text-xs font-bold text-[#3B2418] hover:bg-(--secondColor)/90 transition cursor-pointer"
            >
              <LuLock className="h-4 w-4" />
              <span>Update Password</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
