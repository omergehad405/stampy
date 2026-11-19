"use client";

import React, { useState } from "react";
import {
  LuGift,
  LuPlus,
  LuPencil,
  LuTrash2,
  LuCheck,
  LuX,
  LuCoffee,
  LuSparkles,
  LuCircleCheck,
  LuTriangleAlert,
  LuImage,
} from "react-icons/lu";
import { toast } from "react-toastify";
import DashboardPageHeader from "../components/DashboardPageHeader";
import { useDashboardStore } from "@/app/stores/useDashboardStore";

const ICON_PRESETS = [
  { key: "coffee", label: "Coffee / Drinks", icon: LuCoffee },
  { key: "dessert", label: "Bakery / Desserts", icon: LuSparkles },
  { key: "discount", label: "Bill Discount", icon: LuGift },
  { key: "beans", label: "Retail Coffee Beans", icon: LuCoffee },
];

export default function DashboardRewardsPage() {
  const {
    rewards,
    createReward,
    updateReward,
    deleteReward,
    toggleRewardStatus,
  } = useDashboardStore();

  const [filterActive, setFilterActive] = useState("all"); // 'all' | 'active' | 'inactive'
  const [showModal, setShowModal] = useState(false);
  const [editingReward, setEditingReward] = useState(null);
  const [deletingReward, setDeletingReward] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    category: "Coffee & Drinks",
    description: "",
    stampsRequired: 5,
    tag: "Popular",
    iconType: "coffee",
    isActive: true,
  });

  const openCreateModal = () => {
    setEditingReward(null);
    setFormData({
      name: "",
      category: "Coffee & Drinks",
      description: "",
      stampsRequired: 5,
      tag: "Special Offer",
      iconType: "coffee",
      isActive: true,
    });
    setShowModal(true);
  };

  const openEditModal = (reward) => {
    setEditingReward(reward);
    setFormData({
      name: reward.name,
      category: reward.category || "Coffee & Drinks",
      description: reward.description || "",
      stampsRequired: reward.stampsRequired || 5,
      tag: reward.tag || "Special",
      iconType: reward.iconType || "coffee",
      isActive: reward.isActive !== false,
    });
    setShowModal(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.description) {
      toast.error("Please fill in reward name and description.");
      return;
    }

    if (editingReward) {
      updateReward(editingReward.id, formData);
      toast.success(`Reward "${formData.name}" updated!`);
    } else {
      createReward(formData);
      toast.success(`Reward "${formData.name}" created!`);
    }

    setShowModal(false);
  };

  const handleDeleteConfirm = () => {
    if (!deletingReward) return;
    deleteReward(deletingReward.id);
    toast.success(`Reward "${deletingReward.name}" removed.`);
    setDeletingReward(null);
  };

  const filteredRewards = rewards.filter((r) => {
    if (filterActive === "active") return r.isActive !== false;
    if (filterActive === "inactive") return r.isActive === false;
    return true;
  });

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Loyalty Rewards Catalog"
        description="Configure free drinks, artisan treats, and milestone discounts customer can redeem with stamps."
        breadcrumbs={[{ label: "Rewards" }]}
        actions={
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 rounded-xl bg-(--mainColor) px-4 py-2 text-xs font-bold text-(--secondColor) shadow-sm hover:opacity-95"
          >
            <LuPlus className="h-4 w-4" />
            <span>Create New Reward</span>
          </button>
        }
      />

      {/* Filter Tabs */}
      <div className="flex items-center justify-between rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] p-3 shadow-2xs">
        <div className="flex items-center gap-2">
          {["all", "active", "inactive"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterActive(tab)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold capitalize transition ${
                filterActive === tab
                  ? "bg-(--mainColor) text-(--secondColor) shadow-2xs"
                  : "text-(--mainColor)/70 hover:bg-[#ebdcc8]"
              }`}
            >
              {tab === "all" ? "All Rewards" : tab} ({
                tab === "all"
                  ? rewards.length
                  : tab === "active"
                  ? rewards.filter((r) => r.isActive !== false).length
                  : rewards.filter((r) => r.isActive === false).length
              })
            </button>
          ))}
        </div>

        <span className="text-xs text-(--mainColor)/60">
          Showing {filteredRewards.length} reward{filteredRewards.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filteredRewards.map((reward) => (
          <div
            key={reward.id}
            className={`flex flex-col justify-between rounded-2xl border p-5 transition shadow-2xs ${
              reward.isActive !== false
                ? "border-[#e3d7c0] bg-[#faf6ed] hover:shadow-xs"
                : "border-gray-300 bg-gray-100/70 opacity-75"
            }`}
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-(--mainColor) text-(--secondColor)">
                    <LuGift className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-(--mainColor)/60">
                      {reward.category || "Beverage"}
                    </span>
                    <h3 className="font-bold text-sm text-(--mainColor)">
                      {reward.name}
                    </h3>
                  </div>
                </div>

                {reward.tag && (
                  <span className="rounded-md bg-(--secondColor)/35 px-2 py-0.5 text-[10px] font-bold text-(--mainColor)">
                    {reward.tag}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="mt-3 text-xs text-(--mainColor)/70 leading-relaxed">
                {reward.description}
              </p>

              {/* Stamps required badge */}
              <div className="mt-4 flex items-center justify-between rounded-xl bg-[#f5ecdd] p-3 text-xs font-semibold text-(--mainColor)">
                <div className="flex items-center gap-1.5">
                  <LuCoffee className="h-4 w-4 text-(--mainColor)" />
                  <span>Cost:</span>
                  <strong className="text-sm font-extrabold">{reward.stampsRequired} Stamps</strong>
                </div>
                <span className="text-[11px] text-(--mainColor)/60">
                  {reward.redemptionsCount || 0} times claimed
                </span>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="mt-5 flex items-center justify-between border-t border-[#ebdcc8] pt-3 text-xs">
              {/* Active Toggle */}
              <button
                type="button"
                onClick={() => {
                  toggleRewardStatus(reward.id);
                  toast.info(`Toggled "${reward.name}" status.`);
                }}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-semibold transition ${
                  reward.isActive !== false
                    ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                <span>{reward.isActive !== false ? "Active" : "Inactive"}</span>
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => openEditModal(reward)}
                  className="rounded-lg border border-[#dacdb9] bg-white/70 p-1.5 text-(--mainColor) hover:bg-white"
                  title="Edit reward"
                >
                  <LuPencil className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeletingReward(reward)}
                  className="rounded-lg border border-rose-200 bg-rose-50 p-1.5 text-rose-700 hover:bg-rose-100"
                  title="Delete reward"
                >
                  <LuTrash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Reward Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-[#ebdcc8] bg-[#faf6ed] p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#ebdcc8] pb-3">
              <h3 className="font-bold text-base text-(--mainColor)">
                {editingReward ? "Edit Reward" : "Create New Reward"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1 text-(--mainColor)/60 hover:bg-[#ebdcc8]"
              >
                <LuX className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-(--mainColor) mb-1">
                  Reward Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Free Classic Coffee"
                  className="w-full h-10 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none focus:border-(--mainColor)"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-(--mainColor) mb-1">
                    Required Stamps *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    required
                    value={formData.stampsRequired}
                    onChange={(e) =>
                      setFormData({ ...formData, stampsRequired: Number(e.target.value) })
                    }
                    className="w-full h-10 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none focus:border-(--mainColor)"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-(--mainColor) mb-1">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    placeholder="e.g. Most Popular"
                    className="w-full h-10 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none focus:border-(--mainColor)"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-(--mainColor) mb-1">
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
                  className="w-full rounded-xl border border-[#dacdb9] bg-[#f5ecdd] p-2.5 text-xs text-(--mainColor) outline-none focus:border-(--mainColor)"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-(--mainColor) mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full h-10 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none"
                >
                  <option value="Coffee & Drinks">Coffee & Drinks</option>
                  <option value="Bakery & Sweets">Bakery & Sweets</option>
                  <option value="Special Discount">Special Discount</option>
                  <option value="Specialty">Specialty / Seasonal</option>
                  <option value="Retail Merch">Retail Merch</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActiveToggle"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4 rounded border-[#dacdb9] text-(--mainColor)"
                />
                <label htmlFor="isActiveToggle" className="text-xs font-semibold text-(--mainColor) cursor-pointer">
                  Activate this reward immediately
                </label>
              </div>

              <div className="mt-5 flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-[#dacdb9] bg-white px-4 py-2 text-xs font-semibold text-(--mainColor)"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-(--mainColor) px-4 py-2 text-xs font-bold text-(--secondColor)"
                >
                  {editingReward ? "Save Changes" : "Create Reward"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingReward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl border border-[#ebdcc8] bg-[#faf6ed] p-6 shadow-xl">
            <div className="flex items-center gap-2.5 text-rose-700">
              <LuTriangleAlert className="h-5 w-5" />
              <h3 className="font-bold text-base text-(--mainColor)">
                Delete Reward
              </h3>
            </div>
            <p className="mt-2 text-xs text-(--mainColor)/75 leading-relaxed">
              Are you sure you want to delete <strong>&ldquo;{deletingReward.name}&rdquo;</strong>? Customers will no longer be able to redeem this reward.
            </p>
            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeletingReward(null)}
                className="rounded-xl border border-[#dacdb9] bg-white px-4 py-2 text-xs font-semibold text-(--mainColor)"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="rounded-xl bg-rose-700 px-4 py-2 text-xs font-bold text-white hover:bg-rose-800"
              >
                Delete Reward
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
