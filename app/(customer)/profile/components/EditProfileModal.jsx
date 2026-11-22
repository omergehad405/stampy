"use client";

import React, { useState, useRef } from "react";
import { LuX, LuCamera, LuTrash2, LuUpload } from "react-icons/lu";

export default function EditProfileModal({ user, onClose, onSave }) {
  const [editForm, setEditForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    avatar: user?.avatar || "",
  });

  const fileInputRef = useRef(null);

  const initials = editForm.name
    ? editForm.name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
    : "SP";

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image type
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (PNG, JPG, JPEG, WEBP).");
      return;
    }

    // Limit to 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setEditForm((prev) => ({ ...prev, avatar: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setEditForm((prev) => ({ ...prev, avatar: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
          <div className="p-4 rounded-2xl bg-white border border-[#e3d7c0] shadow-xs space-y-4">
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

            {/* Current Avatar Preview & Device Upload Action */}
            <div className="flex items-center gap-4">
              <div className="relative group w-20 h-20 rounded-2xl bg-(--secondColor) text-[#3b2418] flex items-center justify-center text-2xl font-extrabold shadow-sm overflow-hidden shrink-0 border-2 border-(--secondColor)">
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

                {/* Overlay camera icon click trigger */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity cursor-pointer"
                  title="Upload from device"
                >
                  <LuCamera className="w-6 h-6" />
                </button>
              </div>

              <div className="min-w-0 flex-1 space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-(--mainColor) hover:opacity-90 text-(--bgColor) text-xs font-bold shadow-xs transition-all cursor-pointer"
                >
                  <LuUpload className="w-3.5 h-3.5" />
                  <span>Upload Image from Device</span>
                </button>

                <p className="text-[11px] text-[#3b2418]/65 leading-tight">
                  Supports JPG, PNG or WEBP (up to 5MB). Photo is saved to your Notch profile.
                </p>
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
