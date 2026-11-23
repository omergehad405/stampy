"use client";

import { useState } from "react";
import { LuLock } from "react-icons/lu";
import { toast } from "react-toastify";

export default function SecuritySettingsTab() {
  const [securityForm, setSecurityForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSaveSecurity = (event) => {
    event.preventDefault();
    if (
      securityForm.newPassword &&
      securityForm.newPassword !== securityForm.confirmPassword
    ) {
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

  return (
    <form
      onSubmit={handleSaveSecurity}
      className="space-y-6 rounded-2xl border border-(--bgColor)/15 bg-(--mainColor) p-6 text-(--bgColor) shadow-2xs sm:rounded-3xl"
    >
      <div className="border-b border-(--bgColor)/15 pb-3">
        <h3 className="text-sm font-bold">Password &amp; Security Settings</h3>
        <p className="text-xs text-(--bgColor)/60">
          Manage your login password and account protection.
        </p>
      </div>

      <div className="max-w-md space-y-4">
        <div>
          <label htmlFor="current-password" className="mb-1.5 block text-xs font-bold">
            Current Password
          </label>
          <input
            id="current-password"
            type="password"
            value={securityForm.currentPassword}
            onChange={(event) =>
              setSecurityForm({
                ...securityForm,
                currentPassword: event.target.value,
              })
            }
            placeholder="••••••••"
            className="h-10 w-full rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 px-3 text-xs text-(--bgColor) outline-none focus:border-(--secondColor)"
          />
        </div>

        <div>
          <label htmlFor="new-password" className="mb-1.5 block text-xs font-bold">
            New Password
          </label>
          <input
            id="new-password"
            type="password"
            value={securityForm.newPassword}
            onChange={(event) =>
              setSecurityForm({
                ...securityForm,
                newPassword: event.target.value,
              })
            }
            placeholder="••••••••"
            className="h-10 w-full rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 px-3 text-xs text-(--bgColor) outline-none focus:border-(--secondColor)"
          />
        </div>

        <div>
          <label htmlFor="confirm-password" className="mb-1.5 block text-xs font-bold">
            Confirm New Password
          </label>
          <input
            id="confirm-password"
            type="password"
            value={securityForm.confirmPassword}
            onChange={(event) =>
              setSecurityForm({
                ...securityForm,
                confirmPassword: event.target.value,
              })
            }
            placeholder="••••••••"
            className="h-10 w-full rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 px-3 text-xs text-(--bgColor) outline-none focus:border-(--secondColor)"
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="flex cursor-pointer items-center gap-2 rounded-xl bg-(--secondColor) px-5 py-2.5 text-xs font-bold text-[#3B2418] transition hover:bg-(--secondColor)/90"
        >
          <LuLock className="h-4 w-4" />
          <span>Update Password</span>
        </button>
      </div>
    </form>
  );
}
