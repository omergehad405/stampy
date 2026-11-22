"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
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
  LuX,
  LuCheck,
} from "react-icons/lu";
import { toast } from "react-toastify";
import DashboardPageHeader from "../components/DashboardPageHeader";
import { useDashboardStore } from "@/app/stores/useDashboardStore";
import { useDashboardAuthStore } from "@/app/stores/useDashboardAuthStore";
import { useLoyaltyStore } from "@/app/stores/useLoyaltyStore";
import { useNotificationStore } from "@/app/stores/useNotificationStore";
import {
  apiScanCustomer,
  apiAwardCustomerStamp,
  apiFulfillRewardRedemption,
} from "@/app/lib/dashboardApi";

export default function DashboardScanPage() {
  const {
    customers,
    rewards,
    settings,
    fetchCustomers,
    recordVisitAndStamps,
    redeemCustomerReward,
  } = useDashboardStore();
  const { currentUser } = useDashboardAuthStore();

  // Scanner UI & Camera states
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [facingMode, setFacingMode] = useState("environment"); // 'environment' (back) | 'user' (front)
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [codeInput, setCodeInput] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [stampsToAdd, setStampsToAdd] = useState(1);
  const [visitNote, setVisitNote] = useState("");
  const [allowDailyOverride, setAllowDailyOverride] = useState(false);

  // Scanned Customer Centered Verification Modal State
  const [scanModal, setScanModal] = useState(null);
  const [rewardRedemptionModal, setRewardRedemptionModal] = useState(null);
  const [isScanningQuery, setIsScanningQuery] = useState(false);

  // Modals & Feedback
  const [rewardToRedeem, setRewardToRedeem] = useState(null);
  const [actionSuccessData, setActionSuccessData] = useState(null);

  // Stop camera tracks cleanly
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  }, []);

  // Start real device camera
  const startCamera = useCallback(async (desiredFacingMode = facingMode) => {
    setCameraError(null);
    try {
      if (typeof window === "undefined" || !navigator?.mediaDevices?.getUserMedia) {
        setCameraError("Camera API is not supported in this browser environment.");
        return;
      }

      // Stop any existing stream before starting a new one
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: desiredFacingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsCameraActive(true);
      toast.success("Camera opened. Align customer QR code.");
    } catch (err) {
      console.error("Camera access failed:", err);
      setIsCameraActive(false);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setCameraError(
          "Camera permission was denied. Please allow camera permissions in your browser address bar or settings."
        );
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setCameraError("No camera device was detected on this computer or phone.");
      } else {
        setCameraError(`Camera error: ${err.message || "Unable to access camera"}`);
      }
    }
  }, [facingMode]);

  const toggleCamera = () => {
    if (isCameraActive) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  const switchCameraFacing = () => {
    const nextMode = facingMode === "environment" ? "user" : "environment";
    setFacingMode(nextMode);
    if (isCameraActive) {
      startCamera(nextMode);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Active customer object in local view
  const activeCustomer = customers.find((c) => c.id === selectedCustomerId);

  // Check if customer visited today
  const [todayStr, setTodayStr] = useState("");
  useEffect(() => {
    setTodayStr(new Date().toISOString().split("T")[0]);
  }, []);
  const hasVisitedToday = Boolean(todayStr && activeCustomer?.lastVisitDate === todayStr);

  // Find rewards this customer can redeem
  const availableRewards = activeCustomer
    ? rewards.filter(
        (r) => r.isActive && activeCustomer.stamps >= r.stampsRequired
      )
    : [];

  // Primary Scan Verification handler (checks if user joined this cafe & opens centered popup)
  const handleIdentifyCustomer = useCallback(
    async (codeOrId) => {
      const query = (codeOrId || codeInput).trim();
      if (!query) return;

      setIsScanningQuery(true);
      try {
        const res = await apiScanCustomer(query);
        if (res?.success && res.data) {
          // If the scanned QR is a Reward Redemption Voucher
          if (res.type === "reward") {
            setRewardRedemptionModal({
              isOpen: true,
              isFulfilling: false,
              fulfilledSuccess: null,
              error: null,
              redemption: res.data.redemption,
              customer: res.data.customer,
              cafe: res.data.cafe,
            });
            setCodeInput("");
            setActionSuccessData(null);
            if (res.data.redemption?.isValid) {
              toast.success(`🎁 Reward Voucher: ${res.data.redemption.rewardName} is valid!`);
            } else if (res.data.redemption?.isUsed) {
              toast.warn(`⚠️ Reward Voucher has already been claimed.`);
            } else {
              toast.error(`⚠️ Reward Voucher has expired.`);
            }
            return;
          }

          const { customer, cafe, isJoined, stamps, totalStamps, alreadyVisitedToday } = res.data;

          // Open the centered confirmation & stamp awarding popup
          setScanModal({
            isOpen: true,
            isLoading: false,
            isAwarding: false,
            awardSuccess: null,
            error: null,
            customer,
            cafe,
            isJoined,
            stamps,
            totalStamps: totalStamps || 10,
            alreadyVisitedToday,
            stampsToAward: 1,
            note: "",
            allowOverride: false,
          });

          // Also set local selection for the side details view
          setSelectedCustomerId(customer.id);
          setCodeInput("");
          setActionSuccessData(null);

          if (isJoined) {
            toast.success(`Verified: ${customer.name} is enrolled in ${cafe.name}!`);
          } else {
            toast.warn(`Customer found, but has not joined ${cafe.name} yet.`);
          }
        }
      } catch (err) {
        // Fallback to local store if server offline
        const localFound = customers.find(
          (c) =>
            (c.code && c.code.toUpperCase() === query.toUpperCase()) ||
            (c.id && c.id.toUpperCase() === query.toUpperCase()) ||
            (c.email && c.email.toUpperCase() === query.toUpperCase()) ||
            (c.phone && c.phone.replace(/\s+/g, "") === query.replace(/\s+/g, ""))
        );

        if (localFound) {
          setScanModal({
            isOpen: true,
            isLoading: false,
            isAwarding: false,
            awardSuccess: null,
            error: null,
            customer: {
              id: localFound.id,
              name: localFound.name,
              email: localFound.email,
              phone: localFound.phone || "",
              avatar: localFound.avatar || "",
              joinedDate: localFound.registeredDate || "Recently",
            },
            cafe: {
              name: currentUser?.cafeName || "This Café",
              stampTarget: settings.stampTarget || 10,
            },
            isJoined: true,
            stamps: localFound.stamps || 0,
            totalStamps: settings.stampTarget || 10,
            alreadyVisitedToday: localFound.lastVisitDate === todayStr,
            stampsToAward: 1,
            note: "",
            allowOverride: false,
          });
          setSelectedCustomerId(localFound.id);
          setCodeInput("");
        } else {
          setScanModal({
            isOpen: true,
            isLoading: false,
            error: err.message || `No customer found matching "${query}".`,
            customer: null,
            isJoined: false,
          });
        }
      } finally {
        setIsScanningQuery(false);
      }
    },
    [customers, codeInput, currentUser, settings, todayStr]
  );

  // Automatic QR code detection if native BarcodeDetector is available
  useEffect(() => {
    if (!isCameraActive || typeof window === "undefined" || !("BarcodeDetector" in window)) {
      return;
    }

    let isScanning = true;
    let detector;
    try {
      detector = new window.BarcodeDetector({ formats: ["qr_code"] });
    } catch {
      return;
    }

    const intervalId = setInterval(async () => {
      // Don't auto-scan while a modal is already open
      if (!isScanning || scanModal?.isOpen || !videoRef.current || videoRef.current.readyState < 2) {
        return;
      }
      try {
        const barcodes = await detector.detect(videoRef.current);
        if (barcodes.length > 0 && barcodes[0].rawValue) {
          const raw = barcodes[0].rawValue;
          handleIdentifyCustomer(raw);
        }
      } catch {
        // frame busy or no barcode detected in frame
      }
    }, 450);

    return () => {
      isScanning = false;
      clearInterval(intervalId);
    };
  }, [isCameraActive, handleIdentifyCustomer, scanModal?.isOpen]);

  // Award stamp from the centered modal popup
  const handleAwardStampFromModal = async () => {
    if (!scanModal?.customer) return;

    setScanModal((prev) => ({ ...prev, isAwarding: true }));
    const count = scanModal.stampsToAward || 1;
    const note = scanModal.note || "Visit recorded via Barista QR Scan";

    try {
      const res = await apiAwardCustomerStamp({
        customerId: scanModal.customer.id,
        stampsCount: count,
        note,
      });

      if (res?.success) {
        const newStamps = res.data?.newStamps ?? (scanModal.stamps + count);
        const cafeName = scanModal.cafe?.name || "Café";
        const customerName = scanModal.customer?.name || "Customer";

        // Update modal state to show celebratory success
        setScanModal((prev) => ({
          ...prev,
          isAwarding: false,
          isJoined: true,
          stamps: newStamps,
          awardSuccess: {
            stampsAwarded: count,
            newStamps,
            unlockedReward: res.data?.unlockedReward,
          },
        }));

        // Refresh dashboard customer list in background
        fetchCustomers();

        // Sync with local customer loyalty store and notifications if in same browser
        try {
          useLoyaltyStore.getState().recordVisit(scanModal.cafe?.slug || "coffee-house", count);
        } catch (e) {
          console.warn("Could not sync loyalty store:", e);
        }

        try {
          useNotificationStore.getState().addNotification({
            title: "New Stamp Collected!",
            message: `Barista verified your visit at ${cafeName}! (+${count} Stamp)`,
            type: "stamp",
          });
        } catch (e) {
          console.warn("Could not push notification:", e);
        }

        toast.success(`🎉 +${count} stamp(s) awarded to ${customerName}!`);
      }
    } catch (err) {
      console.warn("Server award error, falling back to local action:", err.message);

      // Fallback local update
      const localRes = recordVisitAndStamps({
        customerId: scanModal.customer.id,
        stampsCount: count,
        note,
        staffName: currentUser?.name || "Barista",
      });

      setScanModal((prev) => ({
        ...prev,
        isAwarding: false,
        isJoined: true,
        stamps: localRes.newStamps || prev.stamps + count,
        awardSuccess: {
          stampsAwarded: count,
          newStamps: localRes.newStamps || prev.stamps + count,
          unlockedReward: localRes.unlockedReward,
        },
      }));

      try {
        useLoyaltyStore.getState().recordVisit(scanModal.cafe?.slug || "coffee-house", count);
        useNotificationStore.getState().addNotification({
          title: "New Stamp Collected!",
          message: `Barista recorded your visit at ${scanModal.cafe?.name || "Café"}! (+${count} Stamp)`,
          type: "stamp",
        });
      } catch (e) {
        console.warn("Could not sync loyalty store:", e);
      }

      toast.success(`+${count} stamp(s) recorded!`);
    }
  };

  // Record visit & add stamp from side panel
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

      // Push notification
      useNotificationStore.getState().addNotification({
        title: "New Stamp Collected!",
        message: `Barista credited +${stampsToAdd} stamp(s)! Total: ${res.newStamps} stamps.`,
        type: "stamp",
      });

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

  // Fulfill Scanned Reward Voucher from Barista Centered Modal
  const handleFulfillRewardFromModal = async () => {
    if (!rewardRedemptionModal?.redemption?.code) return;
    setRewardRedemptionModal((prev) => ({ ...prev, isFulfilling: true, error: null }));
    try {
      const res = await apiFulfillRewardRedemption({
        code: rewardRedemptionModal.redemption.code,
      });

      if (res?.success) {
        setRewardRedemptionModal((prev) => ({
          ...prev,
          isFulfilling: false,
          fulfilledSuccess: true,
          redemption: {
            ...prev.redemption,
            status: "used",
            isValid: false,
            isUsed: true,
            usedAt: new Date().toISOString(),
          },
        }));
        toast.success(
          `🎉 Reward "${rewardRedemptionModal.redemption.rewardName}" confirmed and fulfilled!`
        );
        fetchCustomers();
        // Refresh live activities if supported
        useDashboardStore.getState().fetchActivities?.();
      }
    } catch (err) {
      setRewardRedemptionModal((prev) => ({
        ...prev,
        isFulfilling: false,
        error: err.message || "Failed to fulfill reward redemption voucher.",
      }));
      toast.error(err.message || "Failed to fulfill reward.");
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
          <div className="overflow-hidden rounded-2xl sm:rounded-3xl border border-(--bgColor)/15 bg-(--mainColor) text-(--bgColor) shadow-xs">
            <div className="flex items-center justify-between border-b border-(--bgColor)/15 px-5 py-3.5">
              <div className="flex items-center gap-2">
                <LuQrCode className="h-4 w-4 text-(--secondColor)" />
                <h2 className="font-bold text-xs uppercase tracking-wider text-(--bgColor)">
                  QR Viewfinder
                </h2>
              </div>
              <div className="flex items-center gap-2">
                {isCameraActive && (
                  <button
                    type="button"
                    onClick={switchCameraFacing}
                    className="flex items-center gap-1 rounded-lg border border-(--bgColor)/20 bg-(--bgColor)/10 px-2 py-1 text-xs font-semibold text-(--bgColor) hover:bg-(--bgColor)/20 cursor-pointer"
                    title="Switch camera (front/back)"
                  >
                    <LuRefreshCw className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Flip</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={toggleCamera}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition cursor-pointer ${
                    isCameraActive
                      ? "bg-rose-500/20 text-rose-200 border border-rose-500/30 hover:bg-rose-500/30"
                      : "bg-(--secondColor) text-[#3B2418] hover:bg-(--secondColor)/90"
                  }`}
                >
                  {isCameraActive ? (
                    <>
                      <LuCameraOff className="h-3.5 w-3.5" />
                      <span>Stop Camera</span>
                    </>
                  ) : (
                    <>
                      <LuCamera className="h-3.5 w-3.5" />
                      <span>Start Camera</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Viewfinder Viewport */}
            <div className="relative flex aspect-square w-full flex-col items-center justify-center bg-[#2a1a12] p-6 text-center text-(--bgColor) overflow-hidden">
              {/* Actual HTML5 Video element streaming the camera */}
              <video
                ref={videoRef}
                playsInline
                autoPlay
                muted
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                  isCameraActive ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              />

              {isCameraActive ? (
                <>
                  {/* Darkened overlay with centered scanning reticle */}
                  <div className="relative z-10 flex h-52 w-52 items-center justify-center rounded-2xl border-2 border-(--secondColor) bg-black/25 shadow-2xl backdrop-blur-[1px]">
                    {/* Animated scanning laser */}
                    <div className="absolute inset-x-2 top-0 h-0.5 bg-gradient-to-r from-transparent via-(--secondColor) to-transparent animate-pulse shadow-[0_0_12px_#8EC5FF]" />
                    <span className="absolute bottom-3 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-bold text-(--secondColor)">
                      Align Customer QR
                    </span>
                  </div>
                  <div className="relative z-10 mt-4 rounded-full bg-black/60 px-3 py-1 text-[11px] font-medium text-(--bgColor)/90 backdrop-blur-xs">
                    Live camera stream active
                  </div>
                </>
              ) : cameraError ? (
                <div className="relative z-10 flex flex-col items-center px-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-900/60 text-rose-300">
                    <LuTriangleAlert className="h-7 w-7" />
                  </div>
                  <h3 className="mt-3 text-sm font-bold text-(--bgColor)">
                    Camera Unavailable
                  </h3>
                  <p className="mt-1 text-xs text-rose-200/90 leading-relaxed max-w-xs">
                    {cameraError}
                  </p>
                  <button
                    onClick={() => startCamera()}
                    className="mt-4 rounded-xl bg-white/20 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-white/30 cursor-pointer"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <div className="relative z-10 flex flex-col items-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-(--secondColor)">
                    <LuCamera className="h-8 w-8" />
                  </div>
                  <h3 className="mt-3 text-sm font-bold text-(--bgColor)">
                    Camera Standby
                  </h3>
                  <p className="mt-1 max-w-xs text-xs text-(--bgColor)/60">
                    Click &ldquo;Start Camera&rdquo; above to stream live video, or enter customer QR code below.
                  </p>
                  <button
                    onClick={() => startCamera()}
                    className="mt-4 rounded-xl bg-(--secondColor) px-4 py-2 text-xs font-bold text-[#3B2418] shadow-sm transition hover:bg-(--secondColor)/90 cursor-pointer"
                  >
                    Activate Phone / Web Camera
                  </button>
                </div>
              )}
            </div>

            {/* Fallback Manual Code / ID Lookup */}
            <div className="p-4 border-t border-(--bgColor)/15">
              <label className="block text-xs font-bold text-(--bgColor) mb-1.5">
                Scan Code / Customer Identifier Entry
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleIdentifyCustomer()}
                    placeholder="Scan QR or enter customer code..."
                    disabled={isScanningQuery}
                    className="w-full h-10 rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 pl-9 pr-3 text-xs font-semibold text-(--bgColor) placeholder:text-(--bgColor)/40 outline-none focus:border-(--secondColor)"
                  />
                  <LuSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-(--bgColor)/50" />
                </div>
                <button
                  type="button"
                  onClick={() => handleIdentifyCustomer()}
                  disabled={isScanningQuery || !codeInput.trim()}
                  className="rounded-xl bg-(--secondColor) px-4 text-xs font-bold text-[#3B2418] hover:bg-(--secondColor)/90 disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                >
                  {isScanningQuery ? (
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#3B2418]/30 border-t-[#3B2418]" />
                  ) : (
                    <LuStamp className="h-3.5 w-3.5" />
                  )}
                  <span>Scan</span>
                </button>
              </div>

              {/* Recent Enrolled Customers */}
              {customers.length > 0 && (
                <div className="mt-3">
                  <span className="text-[10px] font-bold text-(--bgColor)/60 uppercase tracking-wider">
                    Recent Enrolled Customers:
                  </span>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {customers.slice(0, 4).map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleIdentifyCustomer(c.code || c.id)}
                        className={`rounded-lg border px-2 py-1 text-[11px] font-semibold transition cursor-pointer ${
                          selectedCustomerId === c.id
                            ? "border-(--secondColor) bg-(--secondColor) text-[#3B2418]"
                            : "border-(--bgColor)/20 bg-(--bgColor)/10 text-(--bgColor) hover:bg-(--bgColor)/20"
                        }`}
                      >
                        {c.name.split(" ")[0]} ({c.stamps}/10)
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Customer Details & Actions (7 cols) */}
        <div className="space-y-5 lg:col-span-7">
          {activeCustomer ? (
            <div className="space-y-5">
              {/* Customer Profile Card */}
              <div className="rounded-2xl sm:rounded-3xl border border-(--bgColor)/15 bg-(--mainColor) text-(--bgColor) p-5 shadow-xs">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-(--bgColor)/15 pb-4">
                  <div className="flex items-center gap-3.5">
                    {activeCustomer.avatar ? (
                      <img
                        src={activeCustomer.avatar}
                        alt={activeCustomer.name}
                        className="h-14 w-14 rounded-2xl object-cover border-2 border-(--secondColor) shadow-2xs"
                      />
                    ) : (
                      <div className="h-14 w-14 rounded-2xl bg-(--secondColor) text-[#3B2418] flex items-center justify-center font-bold text-lg border-2 border-(--secondColor)">
                        {activeCustomer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-(--bgColor)">
                          {activeCustomer.name}
                        </h2>
                        <span className="rounded-md bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 px-2 py-0.5 text-[10px] font-bold uppercase">
                          {activeCustomer.status || "Active Member"}
                        </span>
                      </div>
                      <div className="mt-0.5 flex flex-wrap items-center gap-3 text-xs text-(--bgColor)/70">
                        <span className="font-mono font-semibold text-(--secondColor)">{activeCustomer.code || "MEMBER"}</span>
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
                    className="flex items-center gap-1.5 rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 px-3 py-1.5 text-xs font-semibold text-(--bgColor) hover:bg-(--bgColor)/20 self-start sm:self-auto cursor-pointer"
                  >
                    <LuRefreshCw className="h-3.5 w-3.5" />
                    <span>Scan Next</span>
                  </button>
                </div>

                {/* Stamp Balance & Visual Slots */}
                <div className="mt-5 rounded-2xl border border-(--bgColor)/15 bg-(--bgColor)/10 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-(--bgColor)/70">
                        Current Card Progress
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-extrabold text-(--secondColor)">
                          {activeCustomer.stamps}
                        </span>
                        <span className="text-sm font-semibold text-(--bgColor)/60">
                          / {settings.stampTarget} stamps
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-semibold text-(--bgColor)/70">
                        Lifetime Stamps: <strong className="text-(--bgColor)">{activeCustomer.lifetimeStamps}</strong>
                      </span>
                      <div className="text-xs text-(--bgColor)/70">
                        Total Visits: <strong className="text-(--bgColor)">{activeCustomer.totalVisits}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Stamp grid slots */}
                  <div className="mt-4 grid grid-cols-5 sm:grid-cols-10 gap-2">
                    {Array.from({ length: settings.stampTarget }).map((_, idx) => {
                      const isStamped = idx < activeCustomer.stamps;
                      return (
                        <div
                          key={idx}
                          className={`aspect-square rounded-xl flex items-center justify-center border transition-all ${
                            isStamped
                              ? "bg-(--secondColor) text-[#3B2418] border-(--secondColor) shadow-xs"
                              : "bg-(--bgColor)/5 border-(--bgColor)/15 text-(--bgColor)/30"
                          }`}
                        >
                          <LuCoffee className="h-4 w-4" />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Action Feedback Notification */}
                {actionSuccessData && (
                  <div className="mt-4 rounded-xl border border-emerald-400/30 bg-emerald-400/20 p-3 text-xs text-emerald-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <LuCircleCheck className="h-5 w-5 text-emerald-300 shrink-0" />
                      <span>{actionSuccessData.message}</span>
                    </div>
                    {actionSuccessData.unlockedReward && (
                      <span className="rounded-md bg-emerald-300/30 text-emerald-200 border border-emerald-300/40 px-2 py-0.5 font-bold uppercase text-[10px]">
                        Reward Unlocked!
                      </span>
                    )}
                  </div>
                )}

                {/* Stamp Action Controls */}
                <div className="mt-5 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-(--bgColor) mb-1.5">
                      Order / Item Note (Optional)
                    </label>
                    <input
                      type="text"
                      value={visitNote}
                      onChange={(e) => setVisitNote(e.target.value)}
                      placeholder="e.g. Flat white & croissant"
                      className="w-full h-9 rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 px-3 text-xs text-(--bgColor) placeholder:text-(--bgColor)/40 outline-none focus:border-(--secondColor)"
                    />
                  </div>
                </div>

                <div className="mt-5 flex justify-end">
                  <button
                    type="button"
                    onClick={handleRecordVisit}
                    disabled={hasVisitedToday && !allowDailyOverride}
                    className="flex items-center gap-2 rounded-xl bg-(--secondColor) px-5 py-2.5 text-xs font-bold text-[#3B2418] shadow-sm transition hover:bg-(--secondColor)/90 disabled:opacity-50 cursor-pointer"
                  >
                    <LuCircleCheck className="h-4 w-4" />
                    <span>
                      {hasVisitedToday && !allowDailyOverride
                        ? "Already Visited Today (1 Stamp/Day)"
                        : "Confirm Visit & Credit 1 Stamp"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Action Box: Available Rewards Redemption */}
              <div className="rounded-2xl sm:rounded-3xl border border-(--bgColor)/15 bg-(--mainColor) text-(--bgColor) p-5 shadow-xs">
                <div className="flex items-center justify-between border-b border-(--bgColor)/15 pb-3">
                  <div className="flex items-center gap-2">
                    <LuGift className="h-4 w-4 text-(--secondColor)" />
                    <h3 className="font-bold text-xs uppercase tracking-wider text-(--bgColor)">
                      Eligible Rewards for Redemption
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-(--secondColor)">
                    {availableRewards.length} Unlocked
                  </span>
                </div>

                <div className="mt-4 space-y-2.5">
                  {availableRewards.length > 0 ? (
                    availableRewards.map((reward) => (
                      <div
                        key={reward.id}
                        className="flex items-center justify-between rounded-xl border border-(--bgColor)/15 bg-(--bgColor)/10 p-3 transition hover:border-(--secondColor)/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--secondColor) text-[#3B2418]">
                            <LuGift className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-xs text-(--bgColor)">
                                {reward.name}
                              </h4>
                              <span className="rounded bg-(--secondColor)/20 border border-(--secondColor)/30 px-1.5 py-0.5 text-[10px] font-bold text-(--secondColor)">
                                {reward.stampsRequired} Stamps
                              </span>
                            </div>
                            <p className="text-[11px] text-(--bgColor)/70 max-w-sm line-clamp-1">
                              {reward.description}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setRewardToRedeem(reward)}
                          className="rounded-xl bg-(--secondColor) px-3.5 py-1.5 text-xs font-bold text-[#3B2418] shadow-2xs transition hover:bg-(--secondColor)/90 cursor-pointer"
                        >
                          Redeem Now
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-xl border border-dashed border-(--bgColor)/20 p-4 text-center">
                      <LuSparkles className="mx-auto h-6 w-6 text-(--bgColor)/40" />
                      <p className="mt-1 text-xs font-semibold text-(--bgColor)/70">
                        No rewards unlocked yet.
                      </p>
                      <p className="text-[11px] text-(--bgColor)/50">
                        Customer needs {Math.max(0, 5 - (activeCustomer.stamps || 0))} more stamp(s) to unlock the first reward.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Empty state when no customer is scanned */
            <div className="flex h-96 flex-col items-center justify-center rounded-2xl sm:rounded-3xl border-2 border-dashed border-(--bgColor)/20 bg-(--mainColor) text-(--bgColor) p-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-(--bgColor)/10 text-(--secondColor)">
                <LuQrCode className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-base font-bold text-(--bgColor)">
                No Customer Scanned Yet
              </h3>
              <p className="mt-1.5 max-w-sm text-xs text-(--bgColor)/70">
                Point the camera at a customer&apos;s Stampy QR card, or enter their code to verify membership and issue stamps.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🌟 CENTERED QR VERIFICATION & STAMP AWARDING POPUP MODAL                */}
      {/* ========================================================================= */}
      {scanModal?.isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-md rounded-2xl sm:rounded-3xl border border-(--bgColor)/15 bg-(--mainColor) p-6 sm:p-7 shadow-2xl text-(--bgColor)">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setScanModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-(--bgColor)/60 hover:text-(--bgColor) hover:bg-(--bgColor)/10 transition cursor-pointer"
              aria-label="Close modal"
            >
              <LuX className="w-5 h-5" />
            </button>

            {/* Error State */}
            {scanModal.error ? (
              <div className="text-center py-4 space-y-3">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center justify-center shadow-xs">
                  <LuTriangleAlert className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-(--bgColor)">Customer Not Found</h3>
                <p className="text-xs text-rose-200 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 leading-relaxed">
                  {scanModal.error}
                </p>
                <button
                  type="button"
                  onClick={() => setScanModal(null)}
                  className="w-full mt-4 rounded-xl bg-(--secondColor) py-2.5 text-xs font-bold text-[#3B2418] hover:bg-(--secondColor)/90 cursor-pointer"
                >
                  Close & Try Again
                </button>
              </div>
            ) : scanModal.customer && (
              <div className="space-y-4">
                {/* Header Badge */}
                <div className="flex items-center justify-center">
                  {scanModal.isJoined ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/20 border border-emerald-400/30 px-3 py-1 text-xs font-bold text-emerald-200">
                      <LuCircleCheck className="w-4 h-4 text-emerald-300" />
                      Verified Member • {scanModal.cafe?.name || "This Café"}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 border border-amber-400/30 px-3 py-1 text-xs font-bold text-amber-200">
                      <LuCircleAlert className="w-4 h-4 text-amber-300" />
                      Not Joined to {scanModal.cafe?.name || "This Café"}
                    </span>
                  )}
                </div>

                {/* Customer Information Card */}
                <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-(--bgColor)/10 border border-(--bgColor)/15 shadow-xs">
                  {scanModal.customer.avatar ? (
                    <img
                      src={scanModal.customer.avatar}
                      alt={scanModal.customer.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-(--secondColor) shadow-xs"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-(--secondColor) text-[#3B2418] flex items-center justify-center font-bold text-lg border border-(--secondColor)">
                      {scanModal.customer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-(--bgColor) truncate">
                      {scanModal.customer.name}
                    </h3>
                    <div className="flex flex-col gap-0.5 text-xs text-(--bgColor)/70 mt-0.5">
                      {scanModal.customer.email && (
                        <span className="truncate">{scanModal.customer.email}</span>
                      )}
                      <div className="flex items-center gap-1 text-[11px] text-(--bgColor)/60">
                        <LuCalendar className="w-3 h-3 shrink-0" />
                        <span>Member since: <strong className="text-(--bgColor)">{scanModal.customer.joinedDate || "Recently"}</strong></span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Membership & Stamp Status */}
                {scanModal.isJoined ? (
                  <div className="rounded-2xl border border-(--bgColor)/15 bg-(--bgColor)/10 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-(--bgColor)/70">
                        Current Loyalty Card
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-(--secondColor)">
                          {scanModal.stamps}
                        </span>
                        <span className="text-xs font-bold text-(--bgColor)/60">
                          / {scanModal.totalStamps} Stamps
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2.5 rounded-full bg-(--bgColor)/15 overflow-hidden border border-(--bgColor)/20">
                      <div
                        className="h-full bg-(--secondColor) rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(
                            100,
                            (scanModal.stamps / scanModal.totalStamps) * 100
                          )}%`,
                        }}
                      />
                    </div>

                    {scanModal.alreadyVisitedToday && (
                      <div className="rounded-xl border border-amber-400/30 bg-amber-400/20 px-3 py-2 text-[11px] text-amber-200 flex items-center gap-2">
                        <LuTriangleAlert className="w-4 h-4 shrink-0 text-amber-300" />
                        <span>Customer already received today&apos;s visit stamp. (Rule: 1 stamp per calendar day)</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-amber-400/30 bg-amber-400/20 p-4 space-y-2">
                    <div className="flex items-center gap-2 text-amber-200 font-bold text-xs">
                      <LuCircleAlert className="w-4 h-4 shrink-0 text-amber-300" />
                      <span>Not a member of this café yet</span>
                    </div>
                    <p className="text-xs text-amber-100/80 leading-relaxed">
                      {scanModal.customer.name} has a Stampy account, but has not yet joined{" "}
                      <strong>{scanModal.cafe?.name || "your café"}</strong>. You can enroll them right now and credit their first stamp!
                    </p>
                  </div>
                )}

                {/* Celebratory Award Success Banner */}
                {scanModal.awardSuccess ? (
                  <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/20 p-4 text-center space-y-2 animate-in fade-in">
                    <div className="w-10 h-10 mx-auto rounded-full bg-emerald-400/30 text-emerald-200 flex items-center justify-center">
                      <LuCheck className="w-6 h-6 stroke-[3]" />
                    </div>
                    <h4 className="font-extrabold text-sm text-emerald-200">
                      🎉 Stamp Successfully Awarded!
                    </h4>
                    <p className="text-xs text-emerald-100">
                      {scanModal.customer.name} now has{" "}
                      <strong>
                        {scanModal.awardSuccess.newStamps} / {scanModal.totalStamps} stamps
                      </strong>{" "}
                      at {scanModal.cafe?.name}.
                    </p>
                    {scanModal.awardSuccess.unlockedReward && (
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/30 text-emerald-100 border border-emerald-400/40 px-3 py-1 text-xs font-bold mt-1">
                        <LuSparkles className="w-3.5 h-3.5" />
                        <span>Reward Target Reached! Unlocked reward tier.</span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => setScanModal(null)}
                      className="w-full mt-3 rounded-xl bg-emerald-700 text-white font-bold text-xs py-2.5 hover:bg-emerald-600 transition cursor-pointer"
                    >
                      Done • Scan Next Customer
                    </button>
                  </div>
                ) : (
                  /* Action Button to Award 1 Stamp */
                  <div className="space-y-3 pt-2">
                    {scanModal.alreadyVisitedToday ? (
                      <button
                        type="button"
                        disabled
                        className="w-full flex items-center justify-center gap-2 rounded-2xl bg-amber-400/20 border border-amber-400/30 text-amber-200 py-3.5 px-4 font-bold text-sm opacity-80 cursor-not-allowed"
                      >
                        <LuTriangleAlert className="w-5 h-5 text-amber-300" />
                        <span>Already Received Today&apos;s Stamp</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleAwardStampFromModal}
                        disabled={scanModal.isAwarding}
                        className="w-full flex items-center justify-center gap-2 rounded-2xl bg-(--secondColor) text-[#3B2418] py-3.5 px-4 font-extrabold text-sm shadow-md hover:bg-(--secondColor)/90 active:scale-[0.99] transition cursor-pointer disabled:opacity-50"
                      >
                        {scanModal.isAwarding ? (
                          <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#3B2418]/30 border-t-[#3B2418]" />
                            <span>Crediting Stamp to Account...</span>
                          </>
                        ) : (
                          <>
                            <LuCoffee className="w-5 h-5" />
                            <span>
                              {scanModal.isJoined
                                ? `Give Stamp to ${scanModal.customer.name.split(" ")[0]}`
                                : `Enroll & Give First Stamp`}
                            </span>
                          </>
                        )}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setScanModal(null)}
                      className="w-full text-center text-xs font-bold text-(--bgColor)/60 hover:text-(--bgColor) py-1 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🎁 CENTERED REWARD REDEMPTION VOUCHER SCAN MODAL                          */}
      {/* ========================================================================= */}
      {rewardRedemptionModal?.isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-md rounded-2xl sm:rounded-3xl border border-(--bgColor)/15 bg-(--mainColor) p-6 sm:p-7 shadow-2xl text-(--bgColor)">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setRewardRedemptionModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-(--bgColor)/60 hover:text-(--bgColor) hover:bg-(--bgColor)/10 transition cursor-pointer"
              aria-label="Close modal"
            >
              <LuX className="w-5 h-5" />
            </button>

            {/* Error Message */}
            {rewardRedemptionModal.error && (
              <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/20 p-3 text-xs text-rose-200 flex items-center gap-2">
                <LuTriangleAlert className="w-4 h-4 shrink-0 text-rose-300" />
                <span>{rewardRedemptionModal.error}</span>
              </div>
            )}

            <div className="space-y-4">
              {/* Header Badge & Title */}
              <div className="text-center space-y-1">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-(--secondColor)/20 text-(--secondColor) border border-(--secondColor)/30 flex items-center justify-center shadow-xs">
                  <LuGift className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-(--bgColor)">
                  Reward Voucher Verification
                </h3>
                <p className="text-xs text-(--bgColor)/60">
                  Scanned single-use reward QR code
                </p>
              </div>

              {/* Status Badge */}
              <div className="flex items-center justify-center">
                {rewardRedemptionModal.redemption?.isValid ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/20 border border-emerald-400/30 px-3 py-1 text-xs font-bold text-emerald-200">
                    <LuCircleCheck className="w-4 h-4 text-emerald-300" />
                    Valid Voucher • Ready to Claim
                  </span>
                ) : rewardRedemptionModal.redemption?.isUsed ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 border border-amber-400/30 px-3 py-1 text-xs font-bold text-amber-200">
                    <LuTriangleAlert className="w-4 h-4 text-amber-300" />
                    Voucher Already Claimed / Used
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/20 border border-rose-500/30 px-3 py-1 text-xs font-bold text-rose-200">
                    <LuCircleAlert className="w-4 h-4 text-rose-300" />
                    Voucher Expired
                  </span>
                )}
              </div>

              {/* Voucher Card Info */}
              <div className="rounded-2xl border border-(--bgColor)/15 bg-(--bgColor)/10 p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <LuGift className="w-5 h-5 text-(--secondColor) shrink-0" />
                    <h4 className="font-extrabold text-base text-(--bgColor)">
                      {rewardRedemptionModal.redemption?.rewardName}
                    </h4>
                  </div>
                  <span className="rounded-md bg-(--secondColor)/20 border border-(--secondColor)/30 px-2 py-0.5 text-xs font-bold text-(--secondColor)">
                    -{rewardRedemptionModal.redemption?.stampsSpent || 0} Stamps
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-(--bgColor)/15 text-xs text-(--bgColor)/80">
                  <span>Voucher Code:</span>
                  <span className="font-mono font-bold text-(--bgColor) bg-(--bgColor)/15 px-2 py-0.5 rounded border border-(--bgColor)/20">
                    {rewardRedemptionModal.redemption?.code}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-(--bgColor)/80">
                  <span>Eligible Café:</span>
                  <span className="font-semibold text-(--bgColor)">
                    {rewardRedemptionModal.cafe?.name || "This Café"}
                  </span>
                </div>
              </div>

              {/* Customer Info Card */}
              {rewardRedemptionModal.customer && (
                <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-(--bgColor)/10 border border-(--bgColor)/15 shadow-2xs">
                  {rewardRedemptionModal.customer.avatar ? (
                    <img
                      src={rewardRedemptionModal.customer.avatar}
                      alt={rewardRedemptionModal.customer.name}
                      className="w-12 h-12 rounded-xl object-cover border border-(--secondColor)"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-(--secondColor) text-[#3B2418] flex items-center justify-center font-bold text-base border border-(--secondColor)">
                      {rewardRedemptionModal.customer.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase() || "CU"}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-sm text-(--bgColor) truncate">
                      {rewardRedemptionModal.customer.name}
                    </h5>
                    <p className="text-xs text-(--bgColor)/60 truncate">
                      {rewardRedemptionModal.customer.email || "Registered Member"}
                    </p>
                  </div>
                </div>
              )}

              {/* Celebratory Success Banner */}
              {rewardRedemptionModal.fulfilledSuccess ? (
                <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/20 p-4 text-center space-y-2 animate-in fade-in">
                  <div className="w-10 h-10 mx-auto rounded-full bg-emerald-400/30 text-emerald-200 flex items-center justify-center">
                    <LuCheck className="w-6 h-6 stroke-[3]" />
                  </div>
                  <h4 className="font-extrabold text-sm text-emerald-200">
                    🎉 Reward Confirmed & Fulfilled!
                  </h4>
                  <p className="text-xs text-emerald-100">
                    {rewardRedemptionModal.redemption?.rewardName} has been verified and given to{" "}
                    <strong>{rewardRedemptionModal.customer?.name}</strong>.
                  </p>
                  <p className="text-[11px] text-emerald-200/80">
                    Recorded in café activity and customer redemption history.
                  </p>
                  <button
                    type="button"
                    onClick={() => setRewardRedemptionModal(null)}
                    className="w-full mt-2 rounded-xl bg-emerald-700 text-white font-bold text-xs py-2.5 hover:bg-emerald-600 transition cursor-pointer"
                  >
                    Done • Close
                  </button>
                </div>
              ) : (
                /* Action Button */
                <div className="space-y-2.5 pt-2">
                  {rewardRedemptionModal.redemption?.isValid ? (
                    <button
                      type="button"
                      onClick={handleFulfillRewardFromModal}
                      disabled={rewardRedemptionModal.isFulfilling}
                      className="w-full flex items-center justify-center gap-2 rounded-2xl bg-(--secondColor) hover:bg-(--secondColor)/90 text-[#3B2418] py-3.5 px-4 font-extrabold text-sm shadow-md transition cursor-pointer disabled:opacity-50"
                    >
                      {rewardRedemptionModal.isFulfilling ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#3B2418]/30 border-t-[#3B2418]" />
                          <span>Fulfilling Reward...</span>
                        </>
                      ) : (
                        <>
                          <LuGift className="w-5 h-5" />
                          <span>Confirm & Fulfill Reward</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="w-full flex items-center justify-center gap-2 rounded-2xl bg-(--bgColor)/10 text-(--bgColor)/50 py-3.5 px-4 font-bold text-sm cursor-not-allowed opacity-80"
                    >
                      <LuTriangleAlert className="w-4 h-4 text-(--bgColor)/40" />
                      <span>Reward Already Claimed • Cannot Fulfill</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setRewardRedemptionModal(null)}
                    className="w-full text-center text-xs font-bold text-(--bgColor)/60 hover:text-(--bgColor) py-1 transition cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Reward Redemption */}
      {rewardToRedeem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl sm:rounded-3xl border border-(--bgColor)/15 bg-(--mainColor) text-(--bgColor) p-6 shadow-2xl">
            <div className="flex items-center gap-2.5 text-(--secondColor)">
              <LuGift className="h-6 w-6" />
              <h3 className="font-bold text-base text-(--bgColor)">
                Confirm Reward Redemption
              </h3>
            </div>
            <p className="mt-2 text-xs text-(--bgColor)/80">
              Are you sure you want to redeem <strong>{rewardToRedeem.name}</strong> for <strong>{activeCustomer?.name}</strong>?
            </p>
            <div className="mt-3 rounded-xl border border-(--bgColor)/15 bg-(--bgColor)/10 p-3 text-xs text-(--bgColor)">
              <div className="flex justify-between">
                <span>Stamps to deduct:</span>
                <strong className="font-bold text-(--secondColor)">-{rewardToRedeem.stampsRequired} stamps</strong>
              </div>
              <div className="mt-1 flex justify-between">
                <span>Remaining balance:</span>
                <strong className="font-bold text-(--bgColor)">
                  {(activeCustomer?.stamps || 0) - rewardToRedeem.stampsRequired} stamps
                </strong>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setRewardToRedeem(null)}
                className="rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 px-4 py-2 text-xs font-semibold text-(--bgColor) hover:bg-(--bgColor)/20 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRedeem}
                className="rounded-xl bg-(--secondColor) px-4 py-2 text-xs font-bold text-[#3B2418] hover:bg-(--secondColor)/90 transition cursor-pointer"
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
