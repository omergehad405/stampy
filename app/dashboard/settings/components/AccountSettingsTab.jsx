"use client";

import React, { useEffect, useRef, useState } from "react";
import { LuLink, LuSave, LuUpload } from "react-icons/lu";
import { toast } from "react-toastify";
import { useDashboardAuthStore } from "@/app/stores/useDashboardAuthStore";

export default function AccountSettingsTab() {
  const { currentUser, updateProfile } = useDashboardAuthStore();
  const avatarFileRef = useRef(null);
  const [avatarMode, setAvatarMode] = useState("url");
  const [accountForm, setAccountForm] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
    avatar: currentUser?.avatar || "",
  });

  useEffect(() => {
    if (currentUser) {
      setAccountForm((prev) => ({
        name: currentUser.name || prev.name,
        email: currentUser.email || prev.email,
        phone: currentUser.phone || prev.phone,
        avatar: currentUser.avatar || prev.avatar,
      }));
    }
  }, [currentUser]);

  const handleSaveAccount = (event) => {
    event.preventDefault();
    updateProfile(accountForm);
    toast.success("Account profile updated!");
  };

  return (
    <form
      onSubmit={handleSaveAccount}
      className="space-y-6 rounded-2xl border border-(--bgColor)/15 bg-(--mainColor) p-6 text-(--bgColor) shadow-2xs sm:rounded-3xl"
    >
      <div className="border-b border-(--bgColor)/15 pb-3">
        <h3 className="text-sm font-bold">Your Staff Profile</h3>
        <p className="text-xs text-(--bgColor)/60">
          Personal identity details shown when recording visits and stamps.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="staff-name" className="mb-1.5 block text-xs font-bold">
            Full Name
          </label>
          <input
            id="staff-name"
            type="text"
            required
            value={accountForm.name}
            onChange={(event) =>
              setAccountForm({ ...accountForm, name: event.target.value })
            }
            className="h-10 w-full rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 px-3 text-xs text-(--bgColor) outline-none focus:border-(--secondColor)"
          />
        </div>

        <div>
          <label htmlFor="staff-email" className="mb-1.5 block text-xs font-bold">
            Email Address
          </label>
          <input
            id="staff-email"
            type="email"
            required
            value={accountForm.email}
            onChange={(event) =>
              setAccountForm({ ...accountForm, email: event.target.value })
            }
            className="h-10 w-full rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 px-3 text-xs text-(--bgColor) outline-none focus:border-(--secondColor)"
          />
        </div>

        <div>
          <label htmlFor="staff-phone" className="mb-1.5 block text-xs font-bold">
            Phone Number
          </label>
          <input
            id="staff-phone"
            type="tel"
            value={accountForm.phone}
            onChange={(event) =>
              setAccountForm({ ...accountForm, phone: event.target.value })
            }
            className="h-10 w-full rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 px-3 text-xs text-(--bgColor) outline-none focus:border-(--secondColor)"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-xs font-bold">Avatar Image</label>

          <div className="mb-3 flex gap-2">
            <button
              type="button"
              onClick={() => setAvatarMode("url")}
              className={`flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold transition ${
                avatarMode === "url"
                  ? "border-(--secondColor) bg-(--secondColor) text-[#3B2418]"
                  : "border-(--bgColor)/20 bg-(--bgColor)/10 text-(--bgColor)/70 hover:bg-(--bgColor)/20"
              }`}
            >
              <LuLink className="h-3.5 w-3.5" />
              <span>Paste URL</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAvatarMode("file");
                setTimeout(() => avatarFileRef.current?.click(), 50);
              }}
              className={`flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold transition ${
                avatarMode === "file"
                  ? "border-(--secondColor) bg-(--secondColor) text-[#3B2418]"
                  : "border-(--bgColor)/20 bg-(--bgColor)/10 text-(--bgColor)/70 hover:bg-(--bgColor)/20"
              }`}
            >
              <LuUpload className="h-3.5 w-3.5" />
              <span>Upload from Device</span>
            </button>
          </div>

          {avatarMode === "url" && (
            <input
              type="url"
              value={accountForm.avatar}
              onChange={(event) =>
                setAccountForm({ ...accountForm, avatar: event.target.value })
              }
              placeholder="https://..."
              className="h-10 w-full rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 px-3 text-xs text-(--bgColor) outline-none focus:border-(--secondColor)"
            />
          )}

          <input
            ref={avatarFileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = (loadEvent) => {
                setAccountForm({ ...accountForm, avatar: loadEvent.target.result });
                setAvatarMode("file");
              };
              reader.readAsDataURL(file);
            }}
          />

          {avatarMode === "file" && !accountForm.avatar && (
            <button
              type="button"
              onClick={() => avatarFileRef.current?.click()}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-(--bgColor)/25 bg-(--bgColor)/5 py-6 text-xs font-semibold text-(--bgColor)/70 hover:border-(--secondColor)/50"
            >
              <LuUpload className="h-5 w-5" />
              Click to choose an image from your device
            </button>
          )}

          {accountForm.avatar && (
            <div className="mt-3 flex items-center gap-3">
              <img
                src={accountForm.avatar}
                alt="Avatar preview"
                className="h-14 w-14 rounded-full border-2 border-(--secondColor) object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setAccountForm({ ...accountForm, avatar: "" });
                  setAvatarMode("url");
                  if (avatarFileRef.current) avatarFileRef.current.value = "";
                }}
                className="cursor-pointer text-xs font-semibold text-rose-300 hover:text-rose-200 hover:underline"
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
          className="flex cursor-pointer items-center gap-2 rounded-xl bg-(--secondColor) px-5 py-2.5 text-xs font-bold text-[#3B2418] transition hover:bg-(--secondColor)/90"
        >
          <LuSave className="h-4 w-4" />
          <span>Update Profile</span>
        </button>
      </div>
    </form>
  );
}
