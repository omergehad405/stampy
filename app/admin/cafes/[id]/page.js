"use client";

import React, { useState, use, useEffect } from "react";
import Link from "next/link";
import {
  LuStore,
  LuMail,
  LuPhone,
  LuMapPin,
  LuCalendar,
  LuGift,
  LuUsers,
  LuStamp,
  LuExternalLink,
  LuCreditCard,
  LuBan,
  LuCircleCheck,
  LuPencil,
  LuShieldCheck,
  LuArrowLeft,
  LuCoffee,
  LuLoader,
} from "react-icons/lu";
import { toast } from "react-toastify";
import AdminPageHeader from "../../components/AdminPageHeader";
import AdminBadge from "../../components/AdminBadge";
import ConfirmModal from "../../components/ConfirmModal";
import { useAdminStore } from "@/app/stores/useAdminStore";
import { apiAdminGetCafe } from "@/app/lib/adminApi";

export default function AdminCafeDetailPage({ params }) {
  const unwrappedParams = use(params);
  const { updateCafeStatus, updateCafeInfo, assignPlanToCafe, plans } = useAdminStore();

  const cafeIdentifier = unwrappedParams.id;
  const [cafeRequest, setCafeRequest] = useState({
    identifier: null,
    cafe: null,
    isLoading: true,
    error: "",
  });

  useEffect(() => {
    let isCurrent = true;

    apiAdminGetCafe(cafeIdentifier)
      .then((response) => {
        if (isCurrent && response?.success && response?.data?.cafe) {
          setCafeRequest({
            identifier: cafeIdentifier,
            cafe: response.data.cafe,
            isLoading: false,
            error: "",
          });
        } else if (isCurrent) {
          setCafeRequest({
            identifier: cafeIdentifier,
            cafe: null,
            isLoading: false,
            error: "Cafe details were not returned by the server.",
          });
        }
      })
      .catch((error) => {
        if (isCurrent) {
          setCafeRequest({
            identifier: cafeIdentifier,
            cafe: null,
            isLoading: false,
            error: error.message || "Failed to load cafe details.",
          });
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [cafeIdentifier]);
  const isLoadingCafe =
    cafeRequest.identifier !== cafeIdentifier || cafeRequest.isLoading;
  const cafe =
    cafeRequest.identifier === cafeIdentifier ? cafeRequest.cafe : null;
  const cafeLoadError =
    cafeRequest.identifier === cafeIdentifier ? cafeRequest.error : "";
  const setCafe = (updatedCafe) =>
    setCafeRequest((current) => ({
      ...current,
      cafe:
        typeof updatedCafe === "function"
          ? updatedCafe(current.cafe)
          : updatedCafe,
    }));

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    category: "",
    tagline: "",
    stampTarget: "",
  });

  // Plan Selection Modal
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState("plan-free");

  // Status Confirm Modal
  const [confirmStatusModal, setConfirmStatusModal] = useState({
    isOpen: false,
    newStatus: "",
    title: "",
    description: "",
  });

  if (isLoadingCafe) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] p-10 text-sm text-(--mainColor)/70">
        <LuLoader className="h-5 w-5 animate-spin" />
        Loading cafe details...
      </div>
    );
  }

  if (!cafe) {
    return (
      <div className="space-y-6">
        <Link
          href="/admin/cafes"
          className="inline-flex items-center gap-2 text-xs font-semibold text-(--mainColor) hover:underline"
        >
          <LuArrowLeft className="h-4 w-4" />
          <span>Back to Cafes</span>
        </Link>
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-800">
          <h3 className="font-bold">Cafe Not Found</h3>
          <p className="mt-1 text-xs">{cafeLoadError || `No cafe was found for "${cafeIdentifier}".`}</p>
        </div>
      </div>
    );
  }

  const currentPlan = plans.find((p) => p.id === cafe.subscriptionPlanId);

  const handleStatusChange = (newStatus) => {
    setConfirmStatusModal({
      isOpen: true,
      newStatus,
      title: newStatus === "suspended" ? `Suspend ${cafe.name}?` : `Activate ${cafe.name}?`,
      description:
        newStatus === "suspended"
          ? "This will pause their program and stop stamp scanning across all branches."
          : "This will enable full loyalty features for this cafe immediately.",
    });
  };

  const confirmStatusExecution = async () => {
    const res = await updateCafeStatus(cafe.id, confirmStatusModal.newStatus);
    if (res.success) {
      setCafe((current) => ({
        ...current,
        status: confirmStatusModal.newStatus,
        isActive: confirmStatusModal.newStatus === "active",
      }));
      toast.success(`Cafe status updated to ${confirmStatusModal.newStatus}`);
    } else {
      toast.error(res.error || "Update failed");
    }
    setConfirmStatusModal({ isOpen: false, newStatus: "", title: "", description: "" });
  };

  const handleSaveInfo = async (e) => {
    e.preventDefault();
    const updates = {
      name: editFormData.name,
      category: editFormData.category,
      tagline: editFormData.tagline,
      stampTarget: Number(editFormData.stampTarget),
    };
    const result = await updateCafeInfo(cafe.id, updates);
    if (result.success) {
      setCafe((current) => ({ ...current, ...updates }));
      setIsEditModalOpen(false);
      toast.success("Cafe information updated successfully");
    } else {
      toast.error(result.error || "Failed to update cafe information.");
    }
  };

  const handleSavePlan = async () => {
    const result = await assignPlanToCafe(cafe.id, selectedPlanId);
    if (result.success) {
      setCafe((current) => ({ ...current, subscriptionPlanId: selectedPlanId }));
      setIsPlanModalOpen(false);
      toast.success("Subscription plan updated");
    } else {
      toast.error(result.error || "Failed to update subscription plan.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <AdminPageHeader
        title={cafe.name}
        description={`Manage settings, program parameters, and subscription for ${cafe.name}.`}
        breadcrumbs={[{ label: "Cafes", href: "/admin/cafes" }, { label: cafe.name }]}
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                setEditFormData({
                  name: cafe.name || "",
                  category: cafe.category || "",
                  tagline: cafe.tagline || "",
                  stampTarget: String(cafe.stampTarget ?? ""),
                });
                setIsEditModalOpen(true);
              }}
              className="flex items-center gap-1.5 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3.5 py-2 text-xs font-bold text-(--mainColor) hover:bg-[#eee3d1] transition shadow-2xs"
            >
              <LuPencil className="h-3.5 w-3.5" />
              <span>Edit Info</span>
            </button>

            {cafe.status === "active" ? (
              <button
                onClick={() => handleStatusChange("suspended")}
                className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-rose-700 transition shadow-2xs"
              >
                <LuBan className="h-3.5 w-3.5" />
                <span>Suspend Cafe</span>
              </button>
            ) : (
              <button
                onClick={() => handleStatusChange("active")}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-700 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-800 transition shadow-2xs"
              >
                <LuCircleCheck className="h-3.5 w-3.5" />
                <span>Activate Cafe</span>
              </button>
            )}

            {cafe.slug && (
              <Link
                href={`/cafe/${cafe.slug}`}
                target="_blank"
                className="flex items-center gap-1.5 rounded-xl bg-(--mainColor) px-3.5 py-2 text-xs font-bold text-(--secondColor) hover:opacity-95 transition shadow-2xs"
              >
                <LuExternalLink className="h-3.5 w-3.5" />
                <span>View Public Page</span>
              </Link>
            )}
          </div>
        }
      />

      {/* Hero Identity Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] p-6 shadow-2xs">
        <div className="flex items-center gap-4">
          <img
            src={
              cafe.logoImage ||
              "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80"
            }
            alt={cafe.name}
            className="h-16 w-16 rounded-xl object-cover border border-[#dacdb9]"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-(--mainColor)">{cafe.name}</h2>
              {cafe.isVerified && (
                <LuShieldCheck className="h-5 w-5 text-emerald-700" title="Verified Cafe" />
              )}
              <AdminBadge status={cafe.status} />
            </div>
            <p className="text-xs text-(--mainColor)/70 mt-0.5">{cafe.tagline || cafe.category}</p>
            <span className="text-[11px] text-(--mainColor)/50 block mt-1">
              Registered on {cafe.registrationDate || "Unknown date"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-center">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 py-2 text-xs font-semibold text-(--mainColor) hover:bg-[#eee3d1] transition"
            title="Open Cafe Dashboard in support mode"
          >
            <LuCoffee className="h-4 w-4" />
            <span>Support Mode</span>
          </Link>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column (2 spans): Cafe Info & Program */}
        <div className="space-y-6 lg:col-span-2">
          {/* Cafe Information */}
          <div className="rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] p-6 shadow-2xs">
            <h3 className="font-bold text-sm text-(--mainColor) border-b border-[#ebdcc8] pb-3">
              Cafe Profile & Contact
            </h3>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-(--mainColor)/60 block font-medium">Category</span>
                <span className="font-semibold text-(--mainColor)">{cafe.category || "Cafe"}</span>
              </div>
              <div>
                <span className="text-(--mainColor)/60 block font-medium">Established</span>
                <span className="font-semibold text-(--mainColor)">{cafe.establishedYear || "N/A"}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-(--mainColor)/60 block font-medium">Address</span>
                <span className="font-semibold text-(--mainColor)">
                  {cafe.location?.fullAddress || cafe.location?.address || "Address not provided"}
                </span>
              </div>
              <div>
                <span className="text-(--mainColor)/60 block font-medium">Email</span>
                <span className="font-semibold text-(--mainColor)">{cafe.contact?.email || "N/A"}</span>
              </div>
              <div>
                <span className="text-(--mainColor)/60 block font-medium">Phone</span>
                <span className="font-semibold text-(--mainColor)">{cafe.contact?.phone || "N/A"}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-(--mainColor)/60 block font-medium">Description</span>
                <p className="mt-1 text-(--mainColor)/80 leading-relaxed">
                  {cafe.about?.shortDescription || "No description provided."}
                </p>
              </div>
            </div>
          </div>

          {/* Owner Information */}
          <div className="rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] p-6 shadow-2xs">
            <h3 className="font-bold text-sm text-(--mainColor) border-b border-[#ebdcc8] pb-3">
              Owner Information
            </h3>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-(--mainColor)/60 block font-medium">Owner Name</span>
                <span className="font-semibold text-(--mainColor)">{cafe.owner?.name || "Unassigned"}</span>
              </div>
              <div>
                <span className="text-(--mainColor)/60 block font-medium">Email</span>
                <span className="font-semibold text-(--mainColor)">{cafe.owner?.email || "N/A"}</span>
              </div>
              <div>
                <span className="text-(--mainColor)/60 block font-medium">Phone</span>
                <span className="font-semibold text-(--mainColor)">{cafe.owner?.phone || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Loyalty Program Information */}
          <div className="rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] p-6 shadow-2xs">
            <h3 className="font-bold text-sm text-(--mainColor) border-b border-[#ebdcc8] pb-3">
              Loyalty Program Configuration
            </h3>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="rounded-xl bg-[#f5ecdd] p-3 text-center">
                <span className="block text-xl font-bold text-(--mainColor)">{cafe.customerCount || 0}</span>
                <span className="text-[11px] text-(--mainColor)/60">Customers</span>
              </div>
              <div className="rounded-xl bg-[#f5ecdd] p-3 text-center">
                <span className="block text-xl font-bold text-(--mainColor)">{cafe.totalStampsIssued || 0}</span>
                <span className="text-[11px] text-(--mainColor)/60">Stamps Issued</span>
              </div>
              <div className="rounded-xl bg-[#f5ecdd] p-3 text-center">
                <span className="block text-xl font-bold text-(--mainColor)">{cafe.totalRewardsRedeemed || 0}</span>
                <span className="text-[11px] text-(--mainColor)/60">Redeemed</span>
              </div>
              <div className="rounded-xl bg-[#f5ecdd] p-3 text-center">
                <span className="block text-xl font-bold text-(--mainColor)">{cafe.stampTarget || 10}</span>
                <span className="text-[11px] text-(--mainColor)/60">Target Stamps</span>
              </div>
            </div>

            {/* Configured Rewards Tiers */}
            <div className="mt-5">
              <span className="text-xs font-bold text-(--mainColor)/70 block mb-2">
                Configured Rewards
              </span>
              {(cafe.rewards || []).length === 0 ? (
                <p className="text-xs text-(--mainColor)/60 italic">No rewards configured.</p>
              ) : (
                <div className="space-y-2">
                  {cafe.rewards.map((r) => (
                    <div
                      key={r.id}
                      className="flex items-center justify-between rounded-xl bg-[#f5ecdd] p-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <LuGift className="h-4 w-4 text-(--mainColor)/70" />
                        <div>
                          <span className="font-bold text-(--mainColor) block">{r.name}</span>
                          <span className="text-[11px] text-(--mainColor)/60">{r.description}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <AdminBadge status={r.status} />
                        <span className="rounded-lg bg-(--secondColor)/30 px-2.5 py-1 font-bold text-(--mainColor)">
                          {r.stampsRequired} Stamps
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Subscription & Admin Tools */}
        <div className="space-y-6">
          {/* Subscription Information Card */}
          <div className="rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] p-6 shadow-2xs">
            <div className="flex items-center justify-between border-b border-[#ebdcc8] pb-3">
              <h3 className="font-bold text-sm text-(--mainColor)">
                Subscription Plan
              </h3>
              <AdminBadge status={cafe.subscriptionStatus || "inactive"} />
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-(--mainColor)/60">Current Tier</span>
                <span className="font-bold text-(--mainColor) text-sm">
                  {currentPlan ? currentPlan.name : "Free Plan"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-(--mainColor)/60">Billing Amount</span>
                <span className="font-semibold text-(--mainColor)">
                  {currentPlan ? `£${currentPlan.price}/month` : "Free"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-(--mainColor)/60">Start Date</span>
                <span className="font-semibold text-(--mainColor)">
                  {cafe.subscriptionStart || "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-(--mainColor)/60">Expires</span>
                <span className="font-semibold text-(--mainColor)">
                  {cafe.subscriptionExpiry || "Renews monthly"}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedPlanId(cafe.subscriptionPlanId || "plan-free");
                setIsPlanModalOpen(true);
              }}
              className="mt-5 w-full flex items-center justify-center gap-1.5 rounded-xl bg-(--mainColor) py-2 text-xs font-bold text-(--secondColor) hover:opacity-95 transition"
            >
              <LuCreditCard className="h-4 w-4" />
              <span>Change Subscription Plan</span>
            </button>
          </div>

          {/* Quick Support Guidance */}
          <div className="rounded-2xl border border-[#ebdcc8] bg-[#f4ece0]/50 p-5 text-xs text-(--mainColor)/80">
            <h4 className="font-bold text-(--mainColor) mb-1.5">Admin Support Guidelines</h4>
            <ul className="list-disc pl-4 space-y-1.5 leading-relaxed text-[11px]">
              <li>Suspending a cafe immediately halts customer check-ins.</li>
              <li>Always notify the cafe owner prior to plan changes or account suspension.</li>
              <li>All administrative changes are logged to the platform audit trail.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Edit Cafe Information Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] p-6 shadow-xl">
            <h3 className="font-bold text-base text-(--mainColor)">Edit Cafe Information</h3>
            <form onSubmit={handleSaveInfo} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-(--mainColor) block mb-1">Cafe Name</label>
                <input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full h-9 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-(--mainColor) block mb-1">Category</label>
                <input
                  type="text"
                  value={editFormData.category}
                  onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                  className="w-full h-9 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-(--mainColor) block mb-1">Tagline</label>
                <input
                  type="text"
                  value={editFormData.tagline}
                  onChange={(e) => setEditFormData({ ...editFormData, tagline: e.target.value })}
                  className="w-full h-9 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-(--mainColor) block mb-1">Stamp Target (Cards)</label>
                <input
                  type="number"
                  required
                  min="1"
                  step="1"
                  value={editFormData.stampTarget}
                  onChange={(e) => setEditFormData({ ...editFormData, stampTarget: e.target.value })}
                  className="w-full h-9 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none"
                />
              </div>
              <div className="mt-5 flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded-xl border border-[#dacdb9] px-4 py-2 font-bold text-(--mainColor)"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-(--mainColor) px-4 py-2 font-bold text-(--secondColor)"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Plan Selection Modal */}
      {isPlanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] p-6 shadow-xl">
            <h3 className="font-bold text-base text-(--mainColor)">Assign Subscription Plan</h3>
            <p className="mt-1 text-xs text-(--mainColor)/70">
              Select a tier for {cafe.name}. This adjusts allowed features and limits.
            </p>
            <div className="mt-4 space-y-2.5">
              {plans.map((p) => (
                <label
                  key={p.id}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                    selectedPlanId === p.id
                      ? "border-(--mainColor) bg-[#f5ecdd]"
                      : "border-[#e3d7c0] hover:bg-[#faf6ed]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="plan"
                      value={p.id}
                      checked={selectedPlanId === p.id}
                      onChange={() => setSelectedPlanId(p.id)}
                      className="text-(--mainColor)"
                    />
                    <div>
                      <span className="font-bold text-xs text-(--mainColor) block">{p.name} Plan</span>
                      <span className="text-[11px] text-(--mainColor)/60">{p.description}</span>
                    </div>
                  </div>
                  <span className="font-bold text-xs text-(--mainColor)">
                    {p.price === 0 ? "Free" : `£${p.price}/mo`}
                  </span>
                </label>
              ))}
            </div>
            <div className="mt-5 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsPlanModalOpen(false)}
                className="rounded-xl border border-[#dacdb9] px-4 py-2 text-xs font-bold text-(--mainColor)"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePlan}
                className="rounded-xl bg-(--mainColor) px-4 py-2 text-xs font-bold text-(--secondColor)"
              >
                Assign Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Status Modal */}
      <ConfirmModal
        isOpen={confirmStatusModal.isOpen}
        title={confirmStatusModal.title}
        description={confirmStatusModal.description}
        confirmLabel={confirmStatusModal.newStatus === "suspended" ? "Confirm Suspension" : "Activate"}
        confirmVariant={confirmStatusModal.newStatus === "suspended" ? "danger" : "primary"}
        onConfirm={confirmStatusExecution}
        onCancel={() =>
          setConfirmStatusModal({ isOpen: false, newStatus: "", title: "", description: "" })
        }
      />
    </div>
  );
}
