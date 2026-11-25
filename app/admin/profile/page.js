"use client";

import React, { useState } from "react";
import {
  LuUser,
  LuMail,
  LuLock,
  LuShieldCheck,
  LuKey,
  LuShield,
  LuSave,
  LuClock,
} from "react-icons/lu";
import { toast } from "react-toastify";
import AdminPageHeader from "../components/AdminPageHeader";
import AdminBadge from "../components/AdminBadge";
import { useAdminAuthStore } from "@/app/stores/useAdminAuthStore";
import { apiChangePassword } from "@/app/lib/authApi";

export default function AdminProfilePage() {
  const { currentAdmin, updateProfile } = useAdminAuthStore();

  const [profileForm, setProfileForm] = useState({
    name: currentAdmin?.name || "",
    email: currentAdmin?.email || "",
    avatar: currentAdmin?.avatar || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const result = await updateProfile(profileForm);
    if (result.success) {
      toast.success("Admin profile updated successfully");
    } else {
      toast.error(result.error || "Failed to update admin profile.");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error("Please fill all password fields.");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setIsChangingPassword(true);
    try {
      await apiChangePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success("Password changed successfully.");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      toast.error(error.message || "Failed to change password.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <AdminPageHeader
        title="Admin Profile & Security"
        description="Manage your platform credentials, account security settings, and administrative session controls."
        breadcrumbs={[{ label: "Profile & Security" }]}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile Card & Avatar */}
        <div className="space-y-6 lg:col-span-1">
          <div className="rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] p-6 shadow-2xs text-center">
            <div className="relative mx-auto h-24 w-24">
              {profileForm.avatar ? (
                <img
                  src={profileForm.avatar}
                  alt={profileForm.name}
                  className="h-24 w-24 rounded-full object-cover border-2 border-[#dacdb9] shadow-sm"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-[#dacdb9] bg-[#f5ecdd] text-2xl font-bold text-(--mainColor)">
                  {profileForm.name.slice(0, 1).toUpperCase() || "A"}
                </div>
              )}
              <span className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center text-white" title="Super Admin Verified">
                <LuShieldCheck className="h-3.5 w-3.5" />
              </span>
            </div>

            <h3 className="mt-4 font-bold text-base text-(--mainColor)">
              {currentAdmin?.name || "Admin"}
            </h3>
            <span className="text-xs text-(--mainColor)/60 block mt-0.5">
              {currentAdmin?.email || "—"}
            </span>

            <div className="mt-3 inline-block">
              <AdminBadge status="active" label="SUPER_ADMIN" />
            </div>

            <div className="mt-6 border-t border-[#ebdcc8] pt-4 text-left text-xs space-y-2">
              <div className="flex items-center justify-between text-(--mainColor)/70">
                <span>Account Role:</span>
                <span className="font-bold text-(--mainColor)">Platform Super Admin</span>
              </div>
              <div className="flex items-center justify-between text-(--mainColor)/70">
                <span>Member Since:</span>
                <span className="font-semibold text-(--mainColor)">
                  {currentAdmin?.joinedDate || "—"}
                </span>
              </div>
              <div className="flex items-center justify-between text-(--mainColor)/70">
                <span>Session Status:</span>
                <span className="font-bold text-emerald-700">Authenticated</span>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5 text-xs text-amber-900 space-y-2">
            <div className="flex items-center gap-2 font-bold">
              <LuShield className="h-4 w-4 text-amber-700" />
              <span>Account Security</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-800">
              Profile changes and password updates are verified by the server. Successful administrator changes are recorded in the platform audit log.
            </p>
          </div>
        </div>

        {/* Right Forms (2 cols): Profile info & Password change */}
        <div className="space-y-6 lg:col-span-2">
          {/* Edit Profile Form */}
          <div className="rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] p-6 shadow-2xs">
            <h3 className="font-bold text-sm text-(--mainColor) border-b border-[#ebdcc8] pb-3">
              Admin Information
            </h3>
            <form onSubmit={handleSaveProfile} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-(--mainColor) block mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, name: e.target.value })
                    }
                    className="w-full h-9 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-(--mainColor) block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={profileForm.email}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, email: e.target.value })
                    }
                    className="w-full h-9 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-(--mainColor) block mb-1">
                    Profile Avatar URL
                  </label>
                  <input
                    type="url"
                    value={profileForm.avatar}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, avatar: e.target.value })
                    }
                    className="w-full h-9 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-(--mainColor) px-4 py-2 font-bold text-(--secondColor) hover:opacity-95 transition text-xs"
                >
                  <LuSave className="h-3.5 w-3.5" />
                  <span>Update Profile</span>
                </button>
              </div>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] p-6 shadow-2xs">
            <h3 className="font-bold text-sm text-(--mainColor) border-b border-[#ebdcc8] pb-3">
              Change Security Password
            </h3>
            <form onSubmit={handleChangePassword} className="mt-4 space-y-4 text-xs">
              <div className="space-y-3">
                <div>
                  <label className="font-semibold text-(--mainColor) block mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        currentPassword: e.target.value,
                      })
                    }
                    placeholder="••••••••"
                    className="w-full h-9 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-(--mainColor) block mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          newPassword: e.target.value,
                        })
                      }
                      placeholder="At least 8 characters"
                      className="w-full h-9 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-(--mainColor) block mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          confirmPassword: e.target.value,
                        })
                      }
                      placeholder="Repeat new password"
                      className="w-full h-9 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="flex items-center gap-2 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-4 py-2 font-bold text-(--mainColor) hover:bg-[#eee3d1] transition text-xs"
                >
                  <LuKey className="h-3.5 w-3.5" />
                  <span>{isChangingPassword ? "Updating..." : "Update Password"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
