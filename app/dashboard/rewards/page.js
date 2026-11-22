"use client";

import React, { useState, useEffect } from "react";
import {
  LuGift,
  LuPlus,
  LuPencil,
  LuTrash2,
  LuCoffee,
  LuSparkles,
  LuPercent,
  LuX,
  LuTriangleAlert,
  LuLoader,
  LuCheckCircle2,
  LuRefreshCw,
} from "react-icons/lu";
import { toast } from "react-toastify";
import DashboardPageHeader from "../components/DashboardPageHeader";
import { useDashboardStore } from "@/app/stores/useDashboardStore";

const CATEGORIES = [
  { value: "cafee & drinks", label: "Café & Drinks", icon: LuCoffee },
  { value: "bakery & sweets", label: "Bakery & Sweets", icon: LuSparkles },
  { value: "special discount only", label: "Special Discount Only", icon: LuPercent },
];

export default function DashboardRewardsPage() {
  const {
    rewards,
    isLoadingRewards,
    rewardsError,
    fetchRewards,
    createReward,
    updateReward,
    deleteReward,
    toggleRewardStatus,
  } = useDashboardStore();

  const [filterActive, setFilterActive] = useState("all"); // 'all' | 'active' | 'inactive'
  const [showModal, setShowModal] = useState(false);
  const [editingReward, setEditingReward] = useState(null);
  const [deletingReward, setDeletingReward] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  // Form state strictly matching the schema
  const [formData, setFormData] = useState({
    title: "",
    requiredStamps: 5,
    categoryTag: "",
    description: "",
    category: "cafee & drinks",
    status: "active",
  });

  // Fetch real rewards on page load
  useEffect(() => {
    fetchRewards();
  }, [fetchRewards]);

  const openCreateModal = () => {
    setEditingReward(null);
    setFormData({
      title: "",
      requiredStamps: 5,
      categoryTag: "",
      description: "",
      category: "cafee & drinks",
      status: "active",
    });
    setShowModal(true);
  };

  const openEditModal = (reward) => {
    setEditingReward(reward);
    setFormData({
      title: reward.title || reward.name || "",
      requiredStamps: reward.requiredStamps || reward.stampsRequired || 5,
      categoryTag: reward.categoryTag || reward.tag || "",
      description: reward.description || "",
      category: reward.category || "cafee & drinks",
      status: reward.status || (reward.isActive === false ? "inactive" : "active"),
    });
    setShowModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title?.trim() || !formData.description?.trim()) {
      toast.error("Please fill in Reward Title and Description.");
      return;
    }

    if (!formData.requiredStamps || Number(formData.requiredStamps) < 1) {
      toast.error("Required Stamps must be at least 1.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      title: formData.title.trim(),
      requiredStamps: Number(formData.requiredStamps),
      categoryTag: formData.categoryTag ? formData.categoryTag.trim() : "",
      description: formData.description.trim(),
      category: formData.category,
      status: formData.status,
    };

    try {
      if (editingReward) {
        const rewardId = editingReward.id || editingReward._id;
        const res = await updateReward(rewardId, payload);
        if (res.success) {
          toast.success(`Reward "${payload.title}" updated successfully!`);
          setShowModal(false);
        } else {
          toast.error(res.error || "Failed to update reward.");
        }
      } else {
        const res = await createReward(payload);
        if (res.success) {
          toast.success(`Reward "${payload.title}" created successfully!`);
          setShowModal(false);
        } else {
          toast.error(res.error || "Failed to create reward.");
        }
      }
    } catch (err) {
      toast.error(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingReward) return;
    setIsDeleting(true);

    const rewardId = deletingReward.id || deletingReward._id;
    try {
      const res = await deleteReward(rewardId);
      if (res.success) {
        toast.success(`Reward "${deletingReward.title || deletingReward.name}" removed.`);
        setDeletingReward(null);
      } else {
        toast.error(res.error || "Failed to delete reward.");
      }
    } catch (err) {
      toast.error(err.message || "Error deleting reward.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async (reward) => {
    const rewardId = reward.id || reward._id;
    setTogglingId(rewardId);
    try {
      const res = await toggleRewardStatus(rewardId);
      if (res.success) {
        const newStatus = res.reward?.status || (reward.status === "active" ? "inactive" : "active");
        toast.info(`Reward is now ${newStatus}.`);
      } else {
        toast.error(res.error || "Failed to change reward status.");
      }
    } catch (err) {
      toast.error(err.message || "Error changing status.");
    } finally {
      setTogglingId(null);
    }
  };

  const filteredRewards = (rewards || []).filter((r) => {
    const isAct = r.status === "active" || (r.status !== "inactive" && r.isActive !== false);
    if (filterActive === "active") return isAct;
    if (filterActive === "inactive") return !isAct;
    return true;
  });

  const getCategoryIcon = (category) => {
    const cat = (category || "").toLowerCase();
    if (cat.includes("bakery") || cat.includes("sweet")) return LuSparkles;
    if (cat.includes("discount")) return LuPercent;
    return LuCoffee;
  };

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Loyalty Rewards Catalog"
        description="Configure free drinks, artisan treats, and milestone discounts customers can redeem with stamps."
        breadcrumbs={[{ label: "Rewards" }]}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchRewards()}
              disabled={isLoadingRewards}
              className="flex items-center gap-1.5 rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 px-3 py-2 text-xs font-semibold text-(--bgColor) hover:bg-(--bgColor)/20 disabled:opacity-50 cursor-pointer"
              title="Refresh rewards"
            >
              <LuRefreshCw className={`h-3.5 w-3.5 ${isLoadingRewards ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 rounded-xl bg-(--secondColor) px-4 py-2 text-xs font-bold text-[#3B2418] shadow-xs hover:opacity-95 cursor-pointer"
            >
              <LuPlus className="h-4 w-4" />
              <span>Create New Reward</span>
            </button>
          </div>
        }
      />

      {/* Filter Tabs */}
      <div className="flex items-center justify-between rounded-2xl sm:rounded-3xl border border-(--bgColor)/15 bg-(--mainColor) p-3 shadow-sm text-(--bgColor)">
        <div className="flex items-center gap-2">
          {["all", "active", "inactive"].map((tab) => {
            const count =
              tab === "all"
                ? (rewards || []).length
                : tab === "active"
                ? (rewards || []).filter((r) => r.status === "active" || (r.status !== "inactive" && r.isActive !== false)).length
                : (rewards || []).filter((r) => r.status === "inactive" || r.isActive === false).length;

            return (
              <button
                key={tab}
                onClick={() => setFilterActive(tab)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold capitalize transition cursor-pointer ${
                  filterActive === tab
                    ? "bg-(--secondColor) text-[#3B2418] font-bold shadow-xs"
                    : "text-(--bgColor)/75 hover:bg-(--bgColor)/10"
                }`}
              >
                {tab === "all" ? "All Rewards" : tab} ({count})
              </button>
            );
          })}
        </div>

        <span className="text-xs text-(--bgColor)/65">
          Showing {filteredRewards.length} reward{filteredRewards.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Loading Skeleton */}
      {isLoadingRewards && (!rewards || rewards.length === 0) && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-(--bgColor)/15 bg-(--mainColor) text-(--bgColor) p-12 text-center">
          <LuLoader className="h-8 w-8 animate-spin text-(--secondColor)" />
          <p className="mt-3 text-sm font-semibold text-(--bgColor)">Loading rewards from server...</p>
        </div>
      )}

      {/* Error State */}
      {rewardsError && (
        <div className="flex items-center justify-between rounded-2xl border border-rose-500/30 bg-rose-500/20 p-4 text-xs text-rose-200">
          <div className="flex items-center gap-2">
            <LuTriangleAlert className="h-4 w-4 text-rose-300 shrink-0" />
            <span>{rewardsError}</span>
          </div>
          <button
            onClick={() => fetchRewards()}
            className="rounded-lg bg-rose-600 px-3 py-1 font-semibold text-white hover:bg-rose-700 cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoadingRewards && filteredRewards.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl sm:rounded-3xl border border-dashed border-(--bgColor)/20 bg-(--mainColor) text-(--bgColor) p-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-(--bgColor)/10 text-(--secondColor)">
            <LuGift className="h-8 w-8" />
          </div>
          <h3 className="mt-4 font-bold text-base text-(--bgColor)">
            {filterActive === "all"
              ? "No rewards created yet"
              : `No ${filterActive} rewards found`}
          </h3>
          <p className="mt-1.5 max-w-sm text-xs text-(--bgColor)/70 leading-relaxed">
            {filterActive === "all"
              ? "Start building your customer loyalty program by creating your first redeemable reward."
              : `You currently have no rewards matching the "${filterActive}" status.`}
          </p>
          {filterActive === "all" && (
            <button
              onClick={openCreateModal}
              className="mt-5 flex items-center gap-2 rounded-xl bg-(--secondColor) px-4 py-2 text-xs font-bold text-[#3B2418] shadow-sm hover:bg-(--secondColor)/90 cursor-pointer"
            >
              <LuPlus className="h-4 w-4" />
              <span>Create First Reward</span>
            </button>
          )}
        </div>
      )}

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filteredRewards.map((reward) => {
          const rewardId = reward.id || reward._id;
          const isActive =
            reward.status === "active" ||
            (reward.status !== "inactive" && reward.isActive !== false);
          const CategoryIcon = getCategoryIcon(reward.category);
          const isTogglingThis = togglingId === rewardId;

          return (
            <div
              key={rewardId}
              className={`flex flex-col justify-between rounded-2xl sm:rounded-3xl border p-5 transition shadow-sm ${
                isActive
                  ? "border-(--bgColor)/15 bg-(--mainColor) text-(--bgColor) hover:shadow-md"
                  : "border-(--bgColor)/10 bg-(--mainColor)/60 text-(--bgColor)/60 opacity-75"
              }`}
            >
              <div>
                {/* Card Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-(--secondColor) text-[#3B2418]">
                      <CategoryIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-(--bgColor)/60">
                        {reward.category || "cafee & drinks"}
                      </span>
                      <h3 className="font-bold text-sm text-(--bgColor)">
                        {reward.title || reward.name}
                      </h3>
                    </div>
                  </div>

                  {(reward.categoryTag || reward.tag) && (
                    <span className="rounded-md bg-(--secondColor)/20 border border-(--secondColor)/30 px-2 py-0.5 text-[10px] font-bold text-(--secondColor)">
                      {reward.categoryTag || reward.tag}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="mt-3 text-xs text-(--bgColor)/75 leading-relaxed">
                  {reward.description}
                </p>

                {/* Required Stamps Cost Badge */}
                <div className="mt-4 flex items-center justify-between rounded-xl bg-(--bgColor)/10 border border-(--bgColor)/15 p-3 text-xs font-semibold text-(--bgColor)">
                  <div className="flex items-center gap-1.5">
                    <LuCoffee className="h-4 w-4 text-(--secondColor)" />
                    <span>Cost:</span>
                    <strong className="text-sm font-extrabold text-(--secondColor)">
                      {reward.requiredStamps || reward.stampsRequired} Stamps
                    </strong>
                  </div>
                  <span className="text-[11px] text-(--bgColor)/60">
                    {reward.redemptionsCount || 0} claimed
                  </span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-5 flex items-center justify-between border-t border-(--bgColor)/15 pt-3 text-xs">
                {/* Active / Inactive Status Toggle */}
                <button
                  type="button"
                  disabled={isTogglingThis}
                  onClick={() => handleToggleStatus(reward)}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-semibold transition cursor-pointer ${
                    isActive
                      ? "bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 hover:bg-emerald-400/30"
                      : "bg-(--bgColor)/10 text-(--bgColor)/60 border border-(--bgColor)/20 hover:bg-(--bgColor)/20"
                  } disabled:opacity-50`}
                >
                  {isTogglingThis ? (
                    <LuLoader className="h-3 w-3 animate-spin" />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  )}
                  <span>{isActive ? "Active" : "Inactive"}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => openEditModal(reward)}
                    className="rounded-lg border border-(--bgColor)/20 bg-(--bgColor)/10 p-1.5 text-(--bgColor) hover:bg-(--bgColor)/20 transition cursor-pointer"
                    title="Edit reward"
                  >
                    <LuPencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingReward(reward)}
                    className="rounded-lg border border-rose-500/30 bg-rose-500/20 p-1.5 text-rose-200 hover:bg-rose-500/30 transition cursor-pointer"
                    title="Delete reward"
                  >
                    <LuTrash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create / Edit Reward Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl sm:rounded-3xl border border-(--bgColor)/15 bg-(--mainColor) text-(--bgColor) p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-(--bgColor)/15 pb-3">
              <h3 className="font-bold text-base text-(--bgColor)">
                {editingReward ? "Edit Reward" : "Create New Reward"}
              </h3>
              <button
                onClick={() => !isSubmitting && setShowModal(false)}
                className="rounded-lg p-1 text-(--bgColor)/70 hover:bg-(--bgColor)/10 cursor-pointer"
              >
                <LuX className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="mt-4 space-y-3.5">
              {/* Reward Title * */}
              <div>
                <label className="block text-xs font-bold text-(--bgColor) mb-1">
                  Reward Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Free Classic Coffee"
                  className="w-full h-10 rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 px-3 text-xs text-(--bgColor) placeholder:text-(--bgColor)/40 outline-none focus:border-(--secondColor)"
                />
              </div>

              {/* Required Stamps * & Category Tag */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-(--bgColor) mb-1">
                    Required Stamps *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    required
                    value={formData.requiredStamps}
                    onChange={(e) =>
                      setFormData({ ...formData, requiredStamps: Number(e.target.value) })
                    }
                    placeholder="e.g. 5"
                    className="w-full h-10 rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 px-3 text-xs text-(--bgColor) placeholder:text-(--bgColor)/40 outline-none focus:border-(--secondColor)"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-(--bgColor) mb-1">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    value={formData.categoryTag}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryTag: e.target.value })
                    }
                    placeholder="e.g. Most Popular"
                    className="w-full h-10 rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 px-3 text-xs text-(--bgColor) placeholder:text-(--bgColor)/40 outline-none focus:border-(--secondColor)"
                  />
                </div>
              </div>

              {/* Description * */}
              <div>
                <label className="block text-xs font-bold text-(--bgColor) mb-1">
                  Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Details of what the customer receives when redeeming this reward..."
                  className="w-full rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 p-2.5 text-xs text-(--bgColor) placeholder:text-(--bgColor)/40 outline-none focus:border-(--secondColor)"
                />
              </div>

              {/* Category (one of: cafee & drinks, bakery & sweets, special discount only) */}
              <div>
                <label className="block text-xs font-bold text-(--bgColor) mb-1">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full h-10 rounded-xl border border-(--bgColor)/20 bg-(--mainColor) px-3 text-xs text-(--bgColor) outline-none focus:border-(--secondColor) cursor-pointer"
                >
                  <option value="cafee & drinks">cafee & drinks (Café & Drinks)</option>
                  <option value="bakery & sweets">bakery & sweets (Bakery & Sweets)</option>
                  <option value="special discount only">special discount only (Special Discount Only)</option>
                </select>
              </div>

              {/* Status (active and inactive) */}
              <div>
                <label className="block text-xs font-bold text-(--bgColor) mb-1">
                  Status *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: "active" })}
                    className={`flex items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-semibold transition cursor-pointer ${
                      formData.status === "active"
                        ? "border-emerald-400/40 bg-emerald-400/20 text-emerald-200 shadow-2xs font-bold"
                        : "border-(--bgColor)/20 bg-(--bgColor)/10 text-(--bgColor)/70 hover:bg-(--bgColor)/20"
                    }`}
                  >
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span>Active</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: "inactive" })}
                    className={`flex items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-semibold transition cursor-pointer ${
                      formData.status === "inactive"
                        ? "border-gray-400/40 bg-gray-400/20 text-gray-200 shadow-2xs font-bold"
                        : "border-(--bgColor)/20 bg-(--bgColor)/10 text-(--bgColor)/70 hover:bg-(--bgColor)/20"
                    }`}
                  >
                    <span className="h-2 w-2 rounded-full bg-gray-400" />
                    <span>Inactive</span>
                  </button>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="mt-5 flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 px-4 py-2 text-xs font-semibold text-(--bgColor) hover:bg-(--bgColor)/20 disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 rounded-xl bg-(--secondColor) px-4 py-2 text-xs font-bold text-[#3B2418] hover:opacity-95 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting && <LuLoader className="h-3.5 w-3.5 animate-spin" />}
                  <span>{editingReward ? "Save Changes" : "Create Reward"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingReward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl sm:rounded-3xl border border-(--bgColor)/15 bg-(--mainColor) text-(--bgColor) p-6 shadow-xl">
            <div className="flex items-center gap-2.5 text-rose-400">
              <LuTriangleAlert className="h-5 w-5 shrink-0" />
              <h3 className="font-bold text-base text-(--bgColor)">
                Delete Reward
              </h3>
            </div>
            <p className="mt-2 text-xs text-(--bgColor)/75 leading-relaxed">
              Are you sure you want to delete <strong>&ldquo;{deletingReward.title || deletingReward.name}&rdquo;</strong>? Customers will no longer be able to view or redeem this reward.
            </p>
            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeletingReward(null)}
                className="rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 px-4 py-2 text-xs font-semibold text-(--bgColor) hover:bg-(--bgColor)/20 disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteConfirm}
                className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 disabled:opacity-50 cursor-pointer"
              >
                {isDeleting && <LuLoader className="h-3.5 w-3.5 animate-spin" />}
                <span>Delete Reward</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
