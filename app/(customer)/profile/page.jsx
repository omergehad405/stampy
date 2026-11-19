"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";

import { useLoyaltyStore } from "@/app/stores/useLoyaltyStore";

import ProfileHeader from "./components/ProfileHeader";
import ProfileOverview from "./components/ProfileOverview";
import PersonalInformation from "./components/PersonalInformation";
import AccountSettings from "./components/AccountSettings";
import ProfileLogout from "./components/ProfileLogout";
import EditProfileModal from "./components/EditProfileModal";
import LogoutConfirmModal from "./components/LogoutConfirmModal";

export default function CustomerProfilePage() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const { user, updateUserProfile } = useLoyaltyStore();

  const handleSaveProfile = (form) => {
    if (!form.name.trim()) {
      toast("Name cannot be empty", { type: "error" });
      return;
    }
    updateUserProfile({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
    });
    setIsEditModalOpen(false);
    toast("Profile updated successfully! 🎉", { type: "success" });
  };

  const handleLogout = () => {
    setIsLogoutModalOpen(false);
    toast("You have logged out of your Stampy account.", { type: "info" });
  };

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
      <ProfileHeader />

      <ProfileOverview
        user={user}
        initials={initials}
        onEdit={() => setIsEditModalOpen(true)}
      />

      <PersonalInformation user={user} />

      <AccountSettings user={user} />

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
