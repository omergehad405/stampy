"use client";

import React, { useState } from "react";
import {
  LuQrCode,
  LuCamera,
  LuCameraOff,
  LuSearch,
  LuStamp,
  LuGift,
  LuCircleCheck,
  LuTriangleAlert,
  LuCoffee,
  LuRefreshCw,
  LuUser,
  LuPhone,
  LuMail,
  LuCalendar,
  LuSparkles,
  LuCircleAlert,
} from "react-icons/lu";
import { toast } from "react-toastify";
import DashboardPageHeader from "../components/DashboardPageHeader";
import { useDashboardStore } from "@/app/stores/useDashboardStore";
import { useDashboardAuthStore } from "@/app/stores/useDashboardAuthStore";

export default function DashboardScanPage() {
  const {
    customers,
    rewards,
    settings,
    recordVisitAndStamps,
    redeemCustomerReward,
  } = useDashboardStore();
  const { currentUser } = useDashboardAuthStore();

  // Scanner UI states
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [stampsToAdd, setStampsToAdd] = useState(1);
  const [visitNote, setVisitNote] = useState("");
  const [allowDailyOverride, setAllowDailyOverride] = useState(false);

  // Modals & Feedback
  const [rewardToRedeem, setRewardToRedeem] = useState(null);
  const [actionSuccessData, setActionSuccessData] = useState(null);

  // Active customer object
  const activeCustomer = customers.find((c) => c.id === selectedCustomerId);

  // Check if customer visited today
  const todayStr = new Date().toISOString().split("T")[0];
  const hasVisitedToday = activeCustomer?.lastVisitDate === todayStr;

  // Find rewards this customer can redeem
  const availableRewards = activeCustomer
    ? rewards.filter(
        (r) => r.isActive && activeCustomer.stamps >= r.stampsRequired
      )
    : [];

  // Handle identification by code or ID
  const handleIdentifyCustomer = (codeOrId) => {
    const query = (codeOrId || codeInput).trim().toUpperCase();
    if (!query) return;

    const found = customers.find(
      (c) =>
        c.code.toUpperCase() === query ||
        c.id.toUpperCase() === query ||
        c.email.toUpperCase() === query ||
        c.phone.replace(/\s+/g, "") === query.replace(/\s+/g, "")
    );

    if (found) {
      setSelectedCustomerId(found.id);
      setCodeInput("");
      setActionSuccessData(null);
      toast.success(`Customer identified: ${found.name}`);
    } else {
      toast.error(`No customer found matching "${query}". Try code like STAMPY-7842.`);
    }
  };

  // Record visit & add stamp
  const handleRecordVisit = () => {
    if (!activeCustomer) return;

    const note = allowDailyOverride
      ? `${visitNote} [Override: Allowed duplicate daily visit]`.trim()
      : visitNote;

    const res = recordVisitAndStamps({
      customerId: activeCustomer.id,
      stampsCount: stampsToAdd,
      note,
      staffName: currentUser?.name || "Barista",
    });

    if (res.success) {
      setActionSuccessData({
        type: "stamp",
        message: `Successfully credited +${stampsToAdd} stamp(s) to ${activeCustomer.name}!`,
        newStamps: res.newStamps,
        unlockedReward: res.unlockedReward,
      });
      setVisitNote("");
      setAllowDailyOverride(false);
      toast.success(`+${stampsToAdd} stamp(s) issued!`);
    } else {
      toast.error(res.error || "Could not record visit.");
    }
  };

  // Confirm redemption of reward
  const handleConfirmRedeem = () => {
    if (!activeCustomer || !rewardToRedeem) return;

    const res = redeemCustomerReward({
      customerId: activeCustomer.id,
      rewardId: rewardToRedeem.id,
      staffName: currentUser?.name || "Barista",
    });

    if (res.success) {
      setActionSuccessData({
        type: "reward",
        message: `Redeemed ${rewardToRedeem.name} for ${activeCustomer.name}!`,
        newStamps: res.customer.stamps,
      });
      setRewardToRedeem(null);
      toast.success(`Reward "${rewardToRedeem.name}" redeemed successfully!`);
    } else {
      toast.error(res.error || "Failed to redeem reward.");
    }
  };

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Scan & Manage Visits"
        description="Scan customer QR codes to record visits, issue stamps, and redeem rewards in real-time."
        breadcrumbs={[{ label: "Scan & Visits" }]}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: QR Scanner & Lookup (5 cols) */}
        <div className="space-y-5 lg:col-span-5">
          {/* Scanner Card */}
          <div className="overflow-hidden rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] shadow-2xs">
            <div className="flex items-center justify-between border-b border-[#ebdcc8] px-5 py-3.5">
              <div className="flex items-center gap-2">
                <LuQrCode className="h-4 w-4 text-(--mainColor)" />
                <h2 className="font-bold text-xs uppercase tracking-wider text-(--mainColor)">
                  QR Viewfinder
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsCameraActive(!isCameraActive)}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  isCameraActive
                    ? "bg-rose-100 text-rose-800 hover:bg-rose-200"
                    : "bg-(--secondColor)/30 text-(--mainColor) hover:bg-(--secondColor)/50"
                }`}
              >
                {isCameraActive ? (
                  <>
                    <LuCameraOff className="h-3.5 w-3.5" />
                    <span>Pause Camera</span>
                  </>
                ) : (
                  <>
                    <LuCamera className="h-3.5 w-3.5" />
                    <span>Start Camera</span>
                  </>
                )}
              </button>
            </div>

            {/* Viewfinder Viewport */}
            <div className="relative flex aspect-square w-full flex-col items-center justify-center bg-[#2a1a12] p-6 text-center text-(--bgColor)">
              {isCameraActive ? (
                <>
                  {/* Camera simulated viewfinder with animated laser line */}
                  <div className="relative flex h-52 w-52 items-center justify-center rounded-2xl border-2 border-dashed border-(--secondColor)/70 bg-black/40">
                    {/* Animated scanning laser */}
                    <div className="absolute inset-x-2 top-0 h-0.5 bg-gradient-to-r from-transparent via-(--secondColor) to-transparent animate-pulse shadow-[0_0_12px_#8EC5FF]" />
                    <LuQrCode className="h-20 w-20 text-(--secondColor)/40 animate-pulse" />
                    <span className="absolute bottom-3 text-[11px] font-semibold text-(--secondColor)">
                      Align Customer QR Code
                    </span>
                  </div>
                  <p className="mt-4 text-xs text-(--bgColor)/70">
                    Camera streaming active. Point at customer&apos;s device.
                  </p>
                </>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-(--secondColor)">
                    <LuCamera className="h-8 w-8" />
                  </div>
                  <h3 className="mt-3 text-sm font-bold text-(--bgColor)">
                    Camera Standby
                  </h3>
                  <p className="mt-1 max-w-xs text-xs text-(--bgColor)/60">
                    Click &ldquo;Start Camera&rdquo; above to activate device camera, or use the code lookup below.
                  </p>
                  <button
                    onClick={() => setIsCameraActive(true)}
                    className="mt-4 rounded-xl bg-(--secondColor) px-4 py-2 text-xs font-bold text-(--mainColor) shadow-sm transition hover:opacity-90"
                  >
                    Activate Optical Scanner
                  </button>
                </div>
              )}
            </div>

            {/* Fallback Manual Code / ID Lookup */}
            <div className="p-4 border-t border-[#ebdcc8]">
              <label className="block text-xs font-bold text-(--mainColor) mb-1.5">
                Manual Code / Member ID Entry
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleIdentifyCustomer()}
                    placeholder="e.g. STAMPY-7842"
                    className="w-full h-10 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] pl-9 pr-3 text-xs font-semibold text-(--mainColor) placeholder:text-(--mainColor)/40 outline-none focus:border-(--mainColor)"
                  />
                  <LuSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-(--mainColor)/50" />
                </div>
                <button
                  type="button"
                  onClick={() => handleIdentifyCustomer()}
                  className="rounded-xl bg-(--mainColor) px-4 text-xs font-bold text-(--secondColor) hover:opacity-95"
                >
                  Lookup
                </button>
              </div>

              {/* Fast Test Presets */}
              <div className="mt-3">
                <span className="text-[10px] font-bold text-(--mainColor)/60 uppercase tracking-wider">
                  Test Customer Shortcuts:
                </span>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {customers.slice(0, 4).map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleIdentifyCustomer(c.code)}
                      className={`rounded-lg border px-2 py-1 text-[11px] font-semibold transition ${
                        selectedCustomerId === c.id
                          ? "border-(--mainColor) bg-(--mainColor) text-(--secondColor)"
                          : "border-[#dacdb9] bg-white/70 text-(--mainColor) hover:bg-white"
                      }`}
                    >
                      {c.name.split(" ")[0]} ({c.stamps}/10)
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Customer Details & Actions (7 cols) */}
        <div className="space-y-5 lg:col-span-7">
          {activeCustomer ? (
            <div className="space-y-5">
              {/* Customer Profile Card */}
              <div className="rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] p-5 shadow-2xs">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#ebdcc8] pb-4">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={activeCustomer.avatar}
                      alt={activeCustomer.name}
                      className="h-14 w-14 rounded-2xl object-cover border-2 border-[#decfa8] shadow-2xs"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-(--mainColor)">
                          {activeCustomer.name}
                        </h2>
                        <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 uppercase">
                          {activeCustomer.status}
                        </span>
                      </div>
                      <div className="mt-0.5 flex flex-wrap items-center gap-3 text-xs text-(--mainColor)/70">
                        <span className="font-mono font-semibold">{activeCustomer.code}</span>
                        <span>•</span>
                        <span>{activeCustomer.email}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedCustomerId(null);
                      setActionSuccessData(null);
                    }}
                    className="flex items-center gap-1.5 rounded-xl border border-[#dacdb9] bg-white/70 px-3 py-1.5 text-xs font-semibold text-(--mainColor) hover:bg-white self-start sm:self-auto"
                  >
                    <LuRefreshCw className="h-3.5 w-3.5" />
                    <span>Scan Next</span>
                  </button>
                </div>

                {/* Stamp Balance & Visual Slots */}
                <div className="mt-5 rounded-2xl border border-[#dacdb9] bg-[#f5ecdd] p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-(--mainColor)/70">
                        Current Card Progress
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-extrabold text-(--mainColor)">
                          {activeCustomer.stamps}
                        </span>
                        <span className="text-sm font-semibold text-(--mainColor)/60">
                          / {settings.stampTarget} stamps
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-semibold text-(--mainColor)/70">
                        Lifetime Stamps: <strong>{activeCustomer.lifetimeStamps}</strong>
                      </span>
                      <div className="text-xs text-(--mainColor)/70">
                        Total Visits: <strong>{activeCustomer.totalVisits}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Stamp Card Visual Slots */}
                  <div className="mt-4 grid grid-cols-5 gap-2 sm:grid-cols-10">
                    {Array.from({ length: settings.stampTarget }).map((_, idx) => {
                      const isStamped = idx < activeCustomer.stamps;
                      const isNext = idx === activeCustomer.stamps;

                      return (
                        <div
                          key={idx}
                          className={`flex aspect-square flex-col items-center justify-center rounded-xl border transition-all ${
                            isStamped
                              ? "border-(--mainColor) bg-(--mainColor) text-(--secondColor) shadow-2xs"
                              : isNext
                              ? "border-dashed border-(--mainColor)/60 bg-white/60 text-(--mainColor)/50 animate-pulse"
                              : "border-[#dfd2be] bg-white/30 text-(--mainColor)/30"
                          }`}
                        >
                          <LuCoffee className="h-4 w-4" />
                          <span className="mt-0.5 text-[9px] font-bold">
                            {idx + 1}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Daily Visit Notice / Alert */}
                <div className="mt-4">
                  {hasVisitedToday ? (
                    <div className="flex items-start gap-2.5 rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900">
                      <LuTriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                      <div className="flex-1">
                        <span className="font-bold">
                          Daily Visit Already Recorded Today
                        </span>
                        <p className="mt-0.5 text-amber-800">
                          This customer already received a stamp today. Under normal rules, only 1 visit per day counts.
                        </p>
                        <label className="mt-2 flex items-center gap-2 cursor-pointer font-semibold text-amber-900">
                          <input
                            type="checkbox"
                            checked={allowDailyOverride}
                            onChange={(e) => setAllowDailyOverride(e.target.checked)}
                            className="rounded border-amber-400 text-(--mainColor)"
                          />
                          <span>Allow Barista Override (+ extra stamp)</span>
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-xs font-semibold text-emerald-800">
                      <LuCircleCheck className="h-4 w-4 text-emerald-600" />
                      <span>Ready for today&apos;s visit stamp!</span>
                    </div>
                  )}
                </div>

                {/* Action Feedback Notification */}
                {actionSuccessData && (
                  <div className="mt-4 rounded-xl border border-emerald-300 bg-emerald-100/70 p-3.5 text-xs text-emerald-900">
                    <div className="flex items-center gap-2 font-bold">
                      <LuCircleCheck className="h-4 w-4 text-emerald-700" />
                      <span>{actionSuccessData.message}</span>
                    </div>
                    {actionSuccessData.unlockedReward && (
                      <p className="mt-1 font-semibold text-emerald-800">
                        🎉 Stamp card completed! Customer is now eligible for all rewards.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Action Box: Issue Stamp */}
              <div className="rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] p-5 shadow-2xs">
                <div className="flex items-center justify-between border-b border-[#ebdcc8] pb-3">
                  <div className="flex items-center gap-2">
                    <LuStamp className="h-4 w-4 text-(--mainColor)" />
                    <h3 className="font-bold text-xs uppercase tracking-wider text-(--mainColor)">
                      Issue Visit Stamps
                    </h3>
                  </div>
                  <span className="text-xs font-medium text-(--mainColor)/60">
                    Staff: {currentUser?.name || "Elena"}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-(--mainColor) mb-1.5">
                      Stamps to Add
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setStampsToAdd(num)}
                          className={`flex-1 rounded-xl py-2 text-xs font-bold transition ${
                            stampsToAdd === num
                              ? "bg-(--mainColor) text-(--secondColor) shadow-2xs"
                              : "border border-[#dacdb9] bg-[#f5ecdd] text-(--mainColor) hover:bg-white"
                          }`}
                        >
                          +{num} Stamp{num > 1 ? "s" : ""}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-(--mainColor) mb-1.5">
                      Order / Item Note (Optional)
                    </label>
                    <input
                      type="text"
                      value={visitNote}
                      onChange={(e) => setVisitNote(e.target.value)}
                      placeholder="e.g. Flat white & muffin"
                      className="w-full h-9 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none focus:border-(--mainColor)"
                    />
                  </div>
                </div>

                <div className="mt-5 flex justify-end">
                  <button
                    type="button"
                    onClick={handleRecordVisit}
                    disabled={hasVisitedToday && !allowDailyOverride}
                    className="flex items-center gap-2 rounded-xl bg-(--mainColor) px-5 py-2.5 text-xs font-bold text-(--secondColor) shadow-sm transition hover:opacity-95 disabled:opacity-50 cursor-pointer"
                  >
                    <LuCircleCheck className="h-4 w-4" />
                    <span>Confirm Visit & Credit +{stampsToAdd} Stamp</span>
                  </button>
                </div>
              </div>

              {/* Action Box: Available Rewards Redemption */}
              <div className="rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] p-5 shadow-2xs">
                <div className="flex items-center justify-between border-b border-[#ebdcc8] pb-3">
                  <div className="flex items-center gap-2">
                    <LuGift className="h-4 w-4 text-(--mainColor)" />
                    <h3 className="font-bold text-xs uppercase tracking-wider text-(--mainColor)">
                      Eligible Rewards for Redemption
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-(--mainColor)">
                    {availableRewards.length} Unlocked
                  </span>
                </div>

                <div className="mt-4 space-y-2.5">
                  {availableRewards.length > 0 ? (
                    availableRewards.map((reward) => (
                      <div
                        key={reward.id}
                        className="flex items-center justify-between rounded-xl border border-[#dacdb9] bg-[#f5ecdd] p-3 transition hover:border-(--mainColor)"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--mainColor) text-(--secondColor)">
                            <LuGift className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-xs text-(--mainColor)">
                                {reward.name}
                              </h4>
                              <span className="rounded bg-(--secondColor)/30 px-1.5 py-0.5 text-[10px] font-bold text-(--mainColor)">
                                {reward.stampsRequired} Stamps
                              </span>
                            </div>
                            <p className="text-[11px] text-(--mainColor)/70 max-w-sm line-clamp-1">
                              {reward.description}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setRewardToRedeem(reward)}
                          className="rounded-xl bg-purple-700 px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs transition hover:bg-purple-800"
                        >
                          Redeem Now
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-xl border border-dashed border-[#dacdb9] p-4 text-center">
                      <LuSparkles className="mx-auto h-6 w-6 text-(--mainColor)/40" />
                      <p className="mt-1 text-xs font-semibold text-(--mainColor)/70">
                        No rewards unlocked yet.
                      </p>
                      <p className="text-[11px] text-(--mainColor)/50">
                        Customer needs {Math.max(0, 5 - activeCustomer.stamps)} more stamp(s) to unlock the first reward (Free Classic Coffee).
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Empty state when no customer is scanned */
            <div className="flex h-96 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#e3d7c0] bg-[#faf6ed]/50 p-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-(--secondColor)/20 text-(--mainColor)">
                <LuQrCode className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-base font-bold text-(--mainColor)">
                No Customer Scanned Yet
              </h3>
              <p className="mt-1.5 max-w-sm text-xs text-(--mainColor)/70">
                Point the camera at a customer&apos;s Stampy QR card, or type their code (e.g. <strong>STAMPY-7842</strong>) to view their card and issue stamps.
              </p>
              <div className="mt-5 flex gap-2">
                <button
                  onClick={() => handleIdentifyCustomer("STAMPY-7842")}
                  className="rounded-xl bg-(--mainColor) px-4 py-2 text-xs font-bold text-(--secondColor)"
                >
                  Load Omar Hassan (Test Demo)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal for Reward Redemption */}
      {rewardToRedeem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl border border-[#ebdcc8] bg-[#faf6ed] p-6 shadow-xl">
            <div className="flex items-center gap-2.5 text-purple-700">
              <LuGift className="h-6 w-6" />
              <h3 className="font-bold text-base text-(--mainColor)">
                Confirm Reward Redemption
              </h3>
            </div>
            <p className="mt-2 text-xs text-(--mainColor)/75">
              Are you sure you want to redeem <strong>{rewardToRedeem.name}</strong> for <strong>{activeCustomer?.name}</strong>?
            </p>
            <div className="mt-3 rounded-xl bg-purple-50 p-3 text-xs text-purple-900">
              <div className="flex justify-between">
                <span>Stamps to deduct:</span>
                <strong className="font-bold">-{rewardToRedeem.stampsRequired} stamps</strong>
              </div>
              <div className="mt-1 flex justify-between">
                <span>Remaining balance:</span>
                <strong className="font-bold">
                  {(activeCustomer?.stamps || 0) - rewardToRedeem.stampsRequired} stamps
                </strong>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setRewardToRedeem(null)}
                className="rounded-xl border border-[#dacdb9] bg-white px-4 py-2 text-xs font-semibold text-(--mainColor)"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRedeem}
                className="rounded-xl bg-purple-700 px-4 py-2 text-xs font-bold text-white hover:bg-purple-800"
              >
                Yes, Redeem Reward
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
