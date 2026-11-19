"use client";

import React, { useState } from "react";
import { LuX } from "react-icons/lu";

export default function EditProfileModal({ user, onClose, onSave }) {
  const [editForm, setEditForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editForm);
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 bg-white text-[#3b2418] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#3b2418]"
      >
        <button
          type="button"
          aria-label="Close modal"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-(--bgColor) hover:bg-(--bgColor)/10 transition cursor-pointer"
        >
          <LuX className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold">Edit Personal Information</h3>
        <p className="text-xs opacity-70 mt-1">
          Update your customer name, email address, and phone number.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
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
              className="w-full h-11 px-3.5 rounded-xl border border-[#3b2418] bg-[#3b2418]/10 text-sm text-[#3b2418] placeholder:text-(--bgColor)/50 outline-none focus:border-(--secondColor) focus:ring-2 focus:ring-(--secondColor)/30"
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
              className="w-full h-11 px-3.5 rounded-xl border border-[#3b2418] bg-[#3b2418]/10 text-sm text-[#3b2418] placeholder:text-(--bgColor)/50 outline-none focus:border-(--secondColor) focus:ring-2 focus:ring-(--secondColor)/30"
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
              className="w-full h-11 px-3.5 rounded-xl border border-[#3b2418] bg-[#3b2418]/10 text-sm text-[#3b2418] placeholder:text-(--bgColor)/50 outline-none focus:border-(--secondColor) focus:ring-2 focus:ring-(--secondColor)/30"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold hover:bg-(--bgColor)/10 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-(--secondColor) text-[#3b2418] text-xs sm:text-sm font-bold shadow-sm hover:opacity-90 active:scale-95 transition cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
