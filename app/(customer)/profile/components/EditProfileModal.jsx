"use client";

import React, { useState } from "react";
import { LuX, LuCamera, LuCheck, LuTrash2 } from "react-icons/lu";

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80",
];

export default function EditProfileModal({ user, onClose, onSave }) {
  const [editForm, setEditForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    avatar: user?.avatar || "",
  });

  const [customAvatarInput, setCustomAvatarInput] = useState(
    user?.avatar && !PRESET_AVATARS.includes(user.avatar) ? user.avatar : ""
  );

  const initials = editForm.name
    ? editForm.name
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "SP";

  const handleSelectPreset = (url) => {
    setEditForm((prev) => ({ ...prev, avatar: url }));
    setCustomAvatarInput("");
  };

  const handleCustomAvatarChange = (e) => {
    const val = e.target.value;
    setCustomAvatarInput(val);
    setEditForm((prev) => ({ ...prev, avatar: val }));
  };

  const handleRemoveAvatar = () => {
    setEditForm((prev) => ({ ...prev, avatar: "" }));
    setCustomAvatarInput("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editForm);
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-profile-title"
        className="relative z-10 bg-[#faf6ed] text-[#3b2418] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-[#e3d7c0] max-h-[90vh] overflow-y-auto"
      >
        <button
          type="button"
          aria-label="Close modal"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#3b2418]/70 hover:bg-[#3b2418]/10 transition cursor-pointer"
        >
          <LuX className="w-5 h-5" />
        </button>

        <h3 id="edit-profile-title" className="text-xl font-bold tracking-tight">
          Edit Profile
        </h3>
        <p className="text-xs text-[#3b2418]/70 mt-1">
          Customize your customer avatar, name, and contact details.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Avatar Section */}
          <div className="p-4 rounded-2xl bg-white border border-[#e3d7c0] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-[#3b2418]">
                Profile Picture / Avatar
              </label>
              {editForm.avatar && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 hover:underline cursor-pointer"
                >
                  <LuTrash2 className="w-3.5 h-3.5" />
                  <span>Remove Avatar</span>
                </button>
              )}
            </div>

            {/* Current Avatar Preview */}
            <div className="flex items-center gap-3.5">
              <div className="w-16 h-16 rounded-2xl bg-(--secondColor) text-[#3b2418] flex items-center justify-center text-xl font-extrabold shadow-sm overflow-hidden shrink-0 border-2 border-(--secondColor)">
                {editForm.avatar ? (
                  <img
                    src={editForm.avatar}
                    alt="Avatar preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <span>{initials}</span>
                )}
              </div>
              <div className="min-w-0 flex-1 text-xs">
                <p className="font-semibold text-[#3b2418]">
                  {editForm.avatar ? "Custom Avatar Selected" : "Initial Badge (Default)"}
                </p>
                <p className="text-[11px] text-[#3b2418]/65 mt-0.5">
                  Pick a friendly portrait below or paste an image link.
                </p>
              </div>
            </div>

            {/* Preset Avatars */}
            <div>
              <p className="text-[11px] font-semibold text-[#3b2418]/75 mb-2">
                Choose from presets:
              </p>
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                {PRESET_AVATARS.map((url, idx) => {
                  const isSelected = editForm.avatar === url;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPreset(url)}
                      className={`relative w-11 h-11 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        isSelected
                          ? "border-(--mainColor) ring-2 ring-(--secondColor) scale-105"
                          : "border-transparent opacity-80 hover:opacity-100 hover:border-[#3b2418]/30"
                      }`}
                    >
                      <img
                        src={url}
                        alt={`Preset avatar ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {isSelected && (
                        <span className="absolute inset-0 bg-[#3b2418]/35 flex items-center justify-center text-white">
                          <LuCheck className="w-4 h-4" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom URL Input */}
            <div>
              <label htmlFor="custom-avatar-url" className="block text-[11px] font-semibold text-[#3b2418]/75 mb-1">
                Or paste image URL:
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#3b2418]/50">
                  <LuCamera className="w-3.5 h-3.5" />
                </span>
                <input
                  id="custom-avatar-url"
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  value={customAvatarInput}
                  onChange={handleCustomAvatarChange}
                  className="w-full h-9 pl-9 pr-3 rounded-xl border border-[#e3d7c0] bg-[#faf6ed] text-xs text-[#3b2418] placeholder:text-[#3b2418]/40 outline-none focus:border-[#3b2418] focus:ring-1 focus:ring-(--secondColor)"
                />
              </div>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold mb-1.5 text-[#3b2418]">
              Full Name
            </label>
            <input
              type="text"
              value={editForm.name}
              onChange={(e) =>
                setEditForm({ ...editForm, name: e.target.value })
              }
              required
              placeholder="Your full name"
              className="w-full h-11 px-3.5 rounded-xl border border-[#e3d7c0] bg-white text-sm text-[#3b2418] placeholder:text-[#3b2418]/40 outline-none transition focus:border-[#3b2418] focus:ring-2 focus:ring-(--secondColor)/40"
            />
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold mb-1.5 text-[#3b2418]">
              Email Address
            </label>
            <input
              type="email"
              value={editForm.email}
              onChange={(e) =>
                setEditForm({ ...editForm, email: e.target.value })
              }
              required
              placeholder="name@example.com"
              className="w-full h-11 px-3.5 rounded-xl border border-[#e3d7c0] bg-white text-sm text-[#3b2418] placeholder:text-[#3b2418]/40 outline-none transition focus:border-[#3b2418] focus:ring-2 focus:ring-(--secondColor)/40"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-bold mb-1.5 text-[#3b2418]">
              Phone Number
            </label>
            <input
              type="tel"
              value={editForm.phone}
              onChange={(e) =>
                setEditForm({ ...editForm, phone: e.target.value })
              }
              placeholder="+44 7700 900111"
              className="w-full h-11 px-3.5 rounded-xl border border-[#e3d7c0] bg-white text-sm text-[#3b2418] placeholder:text-[#3b2418]/40 outline-none transition focus:border-[#3b2418] focus:ring-2 focus:ring-(--secondColor)/40"
            />
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#3b2418]/80 hover:bg-[#3b2418]/10 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-(--secondColor) text-[#3b2418] text-xs sm:text-sm font-bold shadow-xs hover:opacity-95 active:scale-98 transition cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
