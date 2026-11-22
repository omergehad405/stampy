"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { apiLogout } from "@/app/lib/authApi";

import { useLoyaltyStore } from "@/app/stores/useLoyaltyStore";

import ProfileHeader from "./components/ProfileHeader";
import ProfileOverview from "./components/ProfileOverview";
import PersonalInformation from "./components/PersonalInformation";
import ProfileLogout from "./components/ProfileLogout";
import EditProfileModal from "./components/EditProfileModal";
import LogoutConfirmModal from "./components/LogoutConfirmModal";

export default function CustomerProfilePage() {
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const { user, updateUserProfile, fetchCurrentUser, logout, isAuthenticated } = useLoyaltyStore();

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("stampy_auth_token") : null;
    if (!token && !isAuthenticated) {
      router.replace("/login");
      return;
    }
    fetchCurrentUser();
  }, [fetchCurrentUser, isAuthenticated, router]);

  const handleSaveProfile = async (form) => {
    if (!form.name.trim()) {
      toast("Name cannot be empty", { type: "error" });
      return;
    }
    const res = await updateUserProfile({
      name: form.name.trim(),
      email: form.email?.trim(),
      phone: form.phone?.trim() || "",
      avatar: form.avatar?.trim() || "",
    });

    if (res?.success) {
      toast("Profile updated successfully! 🎉", { type: "success" });
    } else if (res?.error) {
      toast(res.error, { type: "error" });
    } else {
      toast("Profile updated successfully! 🎉", { type: "success" });
    }
    setIsEditModalOpen(false);
  };

  const handleLogout = async () => {
    setIsLogoutModalOpen(false);
    try {
      await apiLogout();
    } catch (e) {
      console.warn("Logout error:", e);
    }
    logout();
    toast("You have logged out of your Stampy account.", { type: "info" });
    window.location.href = "/login";
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "SP";

  return (
    <div className="w-full max-w-md md:max-w-3xl lg:max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-10 pb-16">
      <ProfileHeader />

      <ProfileOverview
        user={user}
        initials={initials}
        onEdit={() => setIsEditModalOpen(true)}
      />

      <PersonalInformation user={user} />

      <ProfileLogout onLogout={() => setIsLogoutModalOpen(true)} />

      {isEditModalOpen && (
        <EditProfileModal
          user={user}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveProfile}
        />
      )}

      {isLogoutModalOpen && (
        <LogoutConfirmModal
          onClose={() => setIsLogoutModalOpen(false)}
          onConfirm={handleLogout}
        />
      )}
    </div>
  );
}
