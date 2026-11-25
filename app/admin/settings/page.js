"use client";

import React, { useEffect, useState } from "react";
import {
  LuSettings,
  LuSave,
  LuShield,
  LuUsers,
  LuStore,
  LuCheck,
  LuSlidersHorizontal,
  LuLoader,
} from "react-icons/lu";
import { toast } from "react-toastify";
import AdminPageHeader from "../components/AdminPageHeader";
import { useAdminStore } from "@/app/stores/useAdminStore";

export default function AdminSettingsPage() {
  const {
    updateSettings,
    fetchSettings,
    isLoadingSettings,
    plans,
  } = useAdminStore();

  const [formData, setFormData] = useState(null);
  const [settingsError, setSettingsError] = useState("");

  useEffect(() => {
    let isCurrent = true;
    fetchSettings().then((result) => {
      if (!isCurrent) return;
      if (result.success) {
        setFormData({ ...result.settings });
      } else {
        setSettingsError(result.error || "Failed to load platform settings.");
      }
    });
    return () => {
      isCurrent = false;
    };
  }, [fetchSettings]);

  const handleSave = async (e) => {
    e.preventDefault();
    const result = await updateSettings(formData);
    if (result.success) {
      toast.success("Platform settings saved successfully");
    } else {
      toast.error(result.error || "Failed to save platform settings.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <AdminPageHeader
        title="Platform Settings"
        description="Global system parameters, onboarding controls, default loyalty rules, and platform preferences."
        breadcrumbs={[{ label: "Settings" }]}
      />

      {isLoadingSettings || (!formData && !settingsError) ? (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] p-12 text-sm text-(--mainColor)/70">
          <LuLoader className="h-5 w-5 animate-spin" />
          Loading platform settings...
        </div>
      ) : settingsError ? (
        <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-800">
          <p className="text-sm font-bold">Platform settings could not be loaded</p>
          <p className="mt-1 text-xs">{settingsError}</p>
          <button
            type="button"
            onClick={() => {
              setSettingsError("");
              fetchSettings().then((result) => {
                if (result.success) {
                  setFormData({ ...result.settings });
                } else {
                  setSettingsError(result.error || "Failed to load platform settings.");
                }
              });
            }}
            className="mt-4 rounded-xl bg-rose-700 px-4 py-2 text-xs font-bold text-white hover:bg-rose-800"
          >
            Try again
          </button>
        </div>
      ) : (
      <form onSubmit={handleSave} className="space-y-6">
        {/* General Platform Identity */}
        <div className="rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] p-6 shadow-2xs">
          <div className="flex items-center gap-2 border-b border-[#ebdcc8] pb-3 text-(--mainColor)">
            <LuSlidersHorizontal className="h-4 w-4" />
            <h3 className="font-bold text-sm">Platform Identity & General</h3>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-(--mainColor) block mb-1">
                Platform Name
              </label>
              <input
                type="text"
                required
                value={formData.platformName}
                onChange={(e) =>
                  setFormData({ ...formData, platformName: e.target.value })
                }
                className="w-full h-9 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-(--mainColor) block mb-1">
                Tagline
              </label>
              <input
                type="text"
                value={formData.platformTagline}
                onChange={(e) =>
                  setFormData({ ...formData, platformTagline: e.target.value })
                }
                className="w-full h-9 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-semibold text-(--mainColor) block mb-1">
                Platform Support Email
              </label>
              <input
                type="email"
                required
                value={formData.platformEmail}
                onChange={(e) =>
                  setFormData({ ...formData, platformEmail: e.target.value })
                }
                className="w-full h-9 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none"
              />
            </div>
          </div>
        </div>

        {/* Cafe & Customer Registration Rules */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Cafe Onboarding Settings */}
          <div className="rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] p-6 shadow-2xs">
            <div className="flex items-center gap-2 border-b border-[#ebdcc8] pb-3 text-(--mainColor)">
              <LuStore className="h-4 w-4" />
              <h3 className="font-bold text-sm">Cafe Onboarding Rules</h3>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.allowPublicCafeRegistration}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      allowPublicCafeRegistration: e.target.checked,
                    })
                  }
                  className="mt-0.5 rounded text-(--mainColor)"
                />
                <div>
                  <span className="font-bold text-(--mainColor) block">
                    Allow Public Cafe Signups
                  </span>
                  <span className="text-[11px] text-(--mainColor)/60">
                    If disabled, new cafes must be provisioned manually by Super Admin.
                  </span>
                </div>
              </label>

              <div>
                <label className="font-semibold text-(--mainColor) block mb-1">
                  Default New Cafe Plan
                </label>
                <select
                  value={formData.defaultSubscriptionPlanId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      defaultSubscriptionPlanId: e.target.value,
                    })
                  }
                  className="w-full h-9 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none"
                >
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} Plan ({p.price === 0 ? "Free" : `£${p.price}/mo`})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Customer Registration & Defaults */}
          <div className="rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] p-6 shadow-2xs">
            <div className="flex items-center gap-2 border-b border-[#ebdcc8] pb-3 text-(--mainColor)">
              <LuUsers className="h-4 w-4" />
              <h3 className="font-bold text-sm">Customer Program Defaults</h3>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.allowPublicCustomerRegistration}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      allowPublicCustomerRegistration: e.target.checked,
                    })
                  }
                  className="mt-0.5 rounded text-(--mainColor)"
                />
                <div>
                  <span className="font-bold text-(--mainColor) block">
                    Public Customer Registration
                  </span>
                  <span className="text-[11px] text-(--mainColor)/60">
                    Allows any user to generate a digital QR loyalty account.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.defaultWelcomeBonus}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      defaultWelcomeBonus: e.target.checked,
                    })
                  }
                  className="mt-0.5 rounded text-(--mainColor)"
                />
                <div>
                  <span className="font-bold text-(--mainColor) block">
                    Grant Welcome Bonus Stamp
                  </span>
                  <span className="text-[11px] text-(--mainColor)/60">
                    Automatically credit 1 stamp when a customer joins a new cafe program.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.defaultEnforceDailyVisit}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      defaultEnforceDailyVisit: e.target.checked,
                    })
                  }
                  className="mt-0.5 rounded text-(--mainColor)"
                />
                <div>
                  <span className="font-bold text-(--mainColor) block">
                    Enforce One Visit Per Calendar Day
                  </span>
                  <span className="text-[11px] text-(--mainColor)/60">
                    Default anti-fraud rule preventing repeated rapid scans on same day.
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-(--mainColor) px-6 py-2.5 text-xs font-bold text-(--secondColor) hover:opacity-95 transition shadow-sm"
          >
            <LuSave className="h-4 w-4" />
            <span>Save Platform Settings</span>
          </button>
        </div>
      </form>
      )}
    </div>
  );
}
