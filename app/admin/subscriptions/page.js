"use client";

import React, { useState, useEffect } from "react";
import {
  LuCreditCard,
  LuPlus,
  LuPencil,
  LuCheck,
  LuX,
  LuStore,
  LuSparkles,
  LuShieldCheck,
  LuTag,
  LuLoader,
  LuTrash2,
} from "react-icons/lu";
import { toast } from "react-toastify";
import AdminPageHeader from "../components/AdminPageHeader";
import AdminBadge from "../components/AdminBadge";
import ConfirmModal from "../components/ConfirmModal";
import { useAdminStore } from "@/app/stores/useAdminStore";

const DEFAULT_FEATURES = [
  "QR Stamp Card",
  "Basic Analytics",
  "Full Analytics",
  "Advanced Analytics",
  "1 Reward Tier",
  "3 Reward Tiers",
  "5 Reward Tiers",
  "Unlimited Reward Tiers",
  "Up to 50 Customers",
  "Up to 250 Customers",
  "Up to 500 Customers",
  "Unlimited Customers",
  "Email Support",
  "Priority Support",
  "24/7 Dedicated Support",
  "Custom Branding",
  "Multi-staff Accounts",
  "API Access",
  "Custom Integrations",
  "Push Notifications",
  "Promotional Campaigns",
  "Automated Retention",
];

export default function AdminSubscriptionsPage() {
  const {
    plans,
    availableFeatures,
    isLoadingPlans,
    cafes,
    fetchPlans,
    fetchCafes,
    createPlan,
    updatePlan,
    togglePlanStatus,
    assignPlanToCafe,
    deletePlan,
    auditLog,
  } = useAdminStore();

  useEffect(() => {
    fetchPlans();
    fetchCafes();
  }, [fetchPlans, fetchCafes]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Plan Modal State
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    planId: null,
    planName: "",
    isDeleting: false,
  });

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    billingPeriod: "month",
    maxCustomers: "",
    isPopular: false,
    features: ["QR Stamp Card", "Basic Analytics"],
  });

  // Assign Plan Modal
  const [assignModal, setAssignModal] = useState({
    isOpen: false,
    cafeId: "",
    planId: "",
    isSubmitting: false,
  });

  const featureOptions =
    availableFeatures && availableFeatures.length > 0
      ? availableFeatures
      : DEFAULT_FEATURES;

  const handleOpenCreate = () => {
    setEditingPlan(null);
    setFormData({
      name: "",
      description: "",
      price: 0,
      billingPeriod: "month",
      maxCustomers: "",
      isPopular: false,
      features: ["QR Stamp Card", "Basic Analytics"],
    });
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      description: plan.description,
      price: plan.price,
      billingPeriod: plan.billingPeriod || "month",
      maxCustomers: plan.maxCustomers || "",
      isPopular: Boolean(plan.isPopular),
      features: Array.isArray(plan.features) ? [...plan.features] : [],
    });
    setIsCreateModalOpen(true);
  };

  const toggleFeatureSelection = (feat) => {
    setFormData((prev) => {
      const exists = prev.features.includes(feat);
      return {
        ...prev,
        features: exists
          ? prev.features.filter((f) => f !== feat)
          : [...prev.features, feat],
      };
    });
  };

  const handleSavePlan = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formData.name.trim()) {
      toast.error("Please enter a plan name.");
      return;
    }

    if (formData.features.length === 0) {
      toast.error("Please select at least one feature for the plan.");
      return;
    }

    setIsSubmitting(true);

    const planPayload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: Number(formData.price),
      billingPeriod: formData.billingPeriod,
      maxCustomers: formData.maxCustomers ? Number(formData.maxCustomers) : null,
      isPopular: Boolean(formData.isPopular),
      features: formData.features,
    };

    try {
      if (editingPlan) {
        const planId = editingPlan.id || editingPlan._id;
        const res = await updatePlan(planId, planPayload);
        if (res.success) {
          toast.success("Subscription plan updated successfully");
          setIsCreateModalOpen(false);
        } else {
          toast.error(res.error || "Failed to update plan");
        }
      } else {
        const res = await createPlan(planPayload);
        if (res.success) {
          toast.success("New subscription plan created successfully");
          setIsCreateModalOpen(false);
        } else {
          toast.error(res.error || "Failed to create plan");
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (plan) => {
    const planId = plan.id || plan._id;
    const res = await togglePlanStatus(planId);
    if (res?.success) {
      toast.success(
        `Plan ${plan.name} status updated to ${plan.isActive ? "inactive" : "active"}`
      );
    } else {
      toast.error("Failed to toggle plan status");
    }
  };

  const handleOpenDelete = (plan) => {
    setDeleteModal({
      isOpen: true,
      planId: plan.id || plan._id,
      planName: plan.name,
      isDeleting: false,
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.planId) return;
    setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
    const res = await deletePlan(deleteModal.planId);
    setDeleteModal({ isOpen: false, planId: null, planName: "", isDeleting: false });
    if (res?.success) {
      toast.success(`Plan '${deleteModal.planName}' deleted successfully`);
    } else {
      toast.error(res?.error || "Failed to delete plan");
    }
  };

  const handleAssignPlan = async (e) => {
    e.preventDefault();
    if (!assignModal.cafeId || !assignModal.planId) {
      toast.error("Please select both a cafe and a plan");
      return;
    }

    setAssignModal((prev) => ({ ...prev, isSubmitting: true }));
    const res = await assignPlanToCafe(assignModal.cafeId, assignModal.planId);
    setAssignModal((prev) => ({ ...prev, isSubmitting: false }));

    if (res?.success) {
      toast.success("Plan assigned to cafe successfully");
      setAssignModal({ isOpen: false, cafeId: "", planId: "", isSubmitting: false });
    } else {
      toast.error(res?.error || "Failed to assign plan to cafe");
    }
  };

  // Count active cafes on each plan
  const getCafeCountForPlan = (plan) => {
    const planId = plan.id || plan._id;
    return cafes.filter(
      (c) =>
        c.subscriptionPlanId === planId ||
        (plan.name && c.subscriptionPlanId === `plan-${plan.name.toLowerCase()}`) ||
        (plan.name && c.subscriptionPlanId === plan.name.toLowerCase())
    ).length;
  };

  return (
    <div className="space-y-7">
      {/* Page Header */}
      <AdminPageHeader
        title="Subscriptions & Plans"
        description="Configure tier structures, feature entitlements, pricing tiers, and cafe assignments."
        breadcrumbs={[{ label: "Subscriptions" }]}
        actions={
          <div className="flex items-center gap-2.5">
            <button
              onClick={() =>
                setAssignModal({
                  isOpen: true,
                  cafeId: cafes[0]?.id || cafes[0]?._id || "",
                  planId: plans[0]?.id || plans[0]?._id || "",
                  isSubmitting: false,
                })
              }
              className="flex items-center gap-1.5 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-4 py-2 text-xs font-bold text-(--mainColor) hover:bg-[#eee3d1] transition shadow-2xs"
            >
              <LuStore className="h-4 w-4" />
              <span>Assign to Cafe</span>
            </button>
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-1.5 rounded-xl bg-(--mainColor) px-4 py-2 text-xs font-bold text-(--secondColor) hover:opacity-95 transition shadow-2xs"
            >
              <LuPlus className="h-4 w-4" />
              <span>Create New Plan</span>
            </button>
          </div>
        }
      />

      {/* Monetization Architecture Notice */}
      <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-4 text-xs text-blue-900 flex items-start gap-3">
        <LuTag className="h-5 w-5 shrink-0 text-blue-700 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold">Monetization Ready Architecture:</span> Plans configured here establish business entitlements (customer caps, reward limits, analytics tiering) across Stampy. Each plan validates against our platform feature catalog.
        </div>
      </div>

      {/* Loading State */}
      {isLoadingPlans && plans.length === 0 ? (
        <div className="flex h-56 w-full items-center justify-center rounded-3xl border border-[#e3d7c0] bg-[#faf6ed]">
          <div className="flex flex-col items-center gap-2 text-(--mainColor)">
            <LuLoader className="h-7 w-7 animate-spin" />
            <span className="text-xs font-semibold">Loading subscription plans...</span>
          </div>
        </div>
      ) : plans.length === 0 ? (
        /* Empty State */
        <div className="flex h-56 w-full flex-col items-center justify-center rounded-3xl border border-[#e3d7c0] bg-[#faf6ed] text-center p-6">
          <LuCreditCard className="h-10 w-10 text-(--mainColor)/30 mb-2" />
          <h3 className="text-sm font-bold text-(--mainColor)">No Subscription Plans Yet</h3>
          <p className="mt-1 text-xs text-(--mainColor)/60 max-w-sm">
            Create plans to configure pricing, feature allowances, and entitlements for participating cafes.
          </p>
          <button
            onClick={handleOpenCreate}
            className="mt-4 flex items-center gap-1.5 rounded-xl bg-(--mainColor) px-4 py-2 text-xs font-bold text-(--secondColor)"
          >
            <LuPlus className="h-4 w-4" />
            <span>Create First Plan</span>
          </button>
        </div>
      ) : (
        /* Plans Grid */
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map((plan) => {
            const planKey = plan.id || plan._id;
            const cafeCount = getCafeCountForPlan(plan);
            return (
              <div
                key={planKey}
                className={`flex flex-col justify-between rounded-3xl border p-6 shadow-sm transition hover:shadow-md ${
                  plan.isPopular
                    ? "border-(--mainColor) bg-[#faf6ed] ring-2 ring-(--mainColor)/15"
                    : "border-[#e3d7c0] bg-[#faf6ed]"
                }`}
              >
                <div>
                  {/* Header Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-(--mainColor)">{plan.name}</h3>
                      {plan.isPopular && (
                        <span className="rounded-full bg-(--secondColor)/30 px-2.5 py-0.5 text-[10px] font-bold text-(--mainColor) uppercase">
                          Popular
                        </span>
                      )}
                    </div>
                    <AdminBadge status={plan.isActive ? "active" : "inactive"} />
                  </div>

                  <p className="mt-2 text-xs text-(--mainColor)/70 min-h-[32px]">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="mt-5 flex items-baseline gap-1 border-b border-[#ebdcc8] pb-5">
                    <span className="text-3xl font-extrabold text-(--mainColor)">
                      {plan.price === 0 ? "Free" : `£${plan.price}`}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-xs font-semibold text-(--mainColor)/60">
                        /{plan.billingPeriod || "month"}
                      </span>
                    )}
                  </div>

                  {/* Features List */}
                  <div className="mt-5 space-y-2.5">
                    <span className="text-[11px] font-bold text-(--mainColor)/60 uppercase tracking-wider block">
                      Entitlements & Features ({plan.features?.length || 0})
                    </span>
                    <div className="text-xs space-y-2 max-h-56 overflow-y-auto pr-1">
                      <div className="flex items-center gap-2 text-(--mainColor)/80">
                        <LuCheck className="h-4 w-4 shrink-0 text-emerald-700" />
                        <span>
                          {plan.maxCustomers
                            ? `Up to ${plan.maxCustomers} customers`
                            : "Unlimited customers"}
                        </span>
                      </div>
                      {(plan.features || []).map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-(--mainColor)/80">
                          <LuCheck className="h-4 w-4 shrink-0 text-emerald-700" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-7 border-t border-[#ebdcc8] pt-4">
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="text-(--mainColor)/60">Assigned Cafes:</span>
                    <span className="font-bold text-(--mainColor)">
                      {cafeCount} {cafeCount === 1 ? "cafe" : "cafes"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(plan)}
                      className="flex-1 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] py-2 text-xs font-bold text-(--mainColor) hover:bg-[#eee3d1] transition flex items-center justify-center gap-1"
                    >
                      <LuPencil className="h-3.5 w-3.5" />
                      <span>Edit Plan</span>
                    </button>
                    <button
                      onClick={() => handleToggleStatus(plan)}
                      className={`rounded-xl px-3 py-2 text-xs font-bold transition ${
                        plan.isActive
                          ? "bg-rose-100 text-rose-800 hover:bg-rose-200"
                          : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                      }`}
                    >
                      {plan.isActive ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      onClick={() => handleOpenDelete(plan)}
                      className="rounded-xl border border-rose-200 bg-rose-50 px-2.5 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition flex items-center justify-center"
                      title="Delete Plan"
                      aria-label="Delete Plan"
                    >
                      <LuTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Subscription Assignment History (Audit Log) */}
      <div className="rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] shadow-2xs p-6">
        <h3 className="font-bold text-sm text-(--mainColor) border-b border-[#ebdcc8] pb-3">
          Recent Plan Assignments & Audit History
        </h3>
        <div className="mt-4 divide-y divide-[#ebdcc8]">
          {auditLog
            .filter((item) => item.action === "PLAN_ASSIGNED")
            .map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-(--mainColor) block">{item.description}</span>
                  <span className="text-[11px] text-(--mainColor)/60">
                    By {item.adminName}
                  </span>
                </div>
                <span className="text-[11px] text-(--mainColor)/50">
                  {new Date(item.timestamp).toLocaleDateString()}
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* Create / Edit Plan Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] p-6 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-[#ebdcc8]">
              <h3 className="font-bold text-base text-(--mainColor)">
                {editingPlan ? `Edit ${editingPlan.name} Plan` : "Create New Subscription Plan"}
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-(--mainColor)/60 hover:text-(--mainColor)"
              >
                <LuX className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSavePlan} className="mt-4 space-y-4 text-xs overflow-y-auto pr-1">
              <div>
                <label className="font-semibold text-(--mainColor) block mb-1">
                  Plan Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Starter or Enterprise"
                  className="w-full h-9 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none focus:border-(--mainColor)"
                />
              </div>

              <div>
                <label className="font-semibold text-(--mainColor) block mb-1">
                  Description <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief summary of the plan entitlements"
                  className="w-full h-9 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none focus:border-(--mainColor)"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-(--mainColor) block mb-1">
                    Price (£/mo) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full h-9 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none focus:border-(--mainColor)"
                  />
                </div>
                <div>
                  <label className="font-semibold text-(--mainColor) block mb-1">Billing Period</label>
                  <select
                    value={formData.billingPeriod}
                    onChange={(e) => setFormData({ ...formData, billingPeriod: e.target.value })}
                    className="w-full h-9 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none focus:border-(--mainColor)"
                  >
                    <option value="month">Monthly</option>
                    <option value="year">Yearly</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-(--mainColor) block mb-1">
                    Max Customers (blank=unlimited)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.maxCustomers}
                    onChange={(e) => setFormData({ ...formData, maxCustomers: e.target.value })}
                    placeholder="Unlimited"
                    className="w-full h-9 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none focus:border-(--mainColor)"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.isPopular}
                      onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                      className="rounded accent-(--mainColor) h-4 w-4"
                    />
                    <span className="font-semibold text-(--mainColor)">Mark as Popular Tier</span>
                  </label>
                </div>
              </div>

              {/* Features Enum Selection */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-semibold text-(--mainColor) block">
                    Features Enum Catalog <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] text-(--mainColor)/60">
                    {formData.features.length} selected
                  </span>
                </div>
                <p className="text-[11px] text-(--mainColor)/60 mb-2">
                  Select the feature entitlements included in this subscription tier:
                </p>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 rounded-xl border border-[#dacdb9] bg-[#f5ecdd]/60">
                  {featureOptions.map((feat) => {
                    const isSelected = formData.features.includes(feat);
                    return (
                      <button
                        type="button"
                        key={feat}
                        onClick={() => toggleFeatureSelection(feat)}
                        className={`flex items-center gap-2 rounded-lg p-2 text-left text-xs transition border ${
                          isSelected
                            ? "border-(--mainColor) bg-(--mainColor) text-(--secondColor) font-bold"
                            : "border-[#dacdb9] bg-[#faf6ed] text-(--mainColor)/80 hover:border-(--mainColor)/50"
                        }`}
                      >
                        <div
                          className={`h-4 w-4 rounded flex items-center justify-center shrink-0 border ${
                            isSelected
                              ? "bg-(--secondColor) border-(--secondColor) text-(--mainColor)"
                              : "border-[#dacdb9] bg-white"
                          }`}
                        >
                          {isSelected && <LuCheck className="h-3 w-3 stroke-[3]" />}
                        </div>
                        <span className="truncate">{feat}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-2 pt-2 border-t border-[#ebdcc8]">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="rounded-xl border border-[#dacdb9] px-4 py-2 font-bold text-(--mainColor)"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-(--mainColor) px-5 py-2 font-bold text-(--secondColor) hover:opacity-95 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting && <LuLoader className="h-3.5 w-3.5 animate-spin" />}
                  <span>{editingPlan ? "Save Changes" : "Create Plan"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Plan to Cafe Modal */}
      {assignModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] p-6 shadow-xl">
            <h3 className="font-bold text-base text-(--mainColor)">Assign Plan to Cafe</h3>
            <p className="mt-1 text-xs text-(--mainColor)/70">
              Immediately update a cafe&apos;s subscription tier and feature allowances.
            </p>
            <form onSubmit={handleAssignPlan} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-(--mainColor) block mb-1">Select Cafe</label>
                <select
                  value={assignModal.cafeId}
                  onChange={(e) => setAssignModal({ ...assignModal, cafeId: e.target.value })}
                  className="w-full h-9 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none"
                >
                  {cafes.map((c) => {
                    const cid = c.id || c._id;
                    return (
                      <option key={cid} value={cid}>
                        {c.name} ({c.status})
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="font-semibold text-(--mainColor) block mb-1">Select Tier</label>
                <select
                  value={assignModal.planId}
                  onChange={(e) => setAssignModal({ ...assignModal, planId: e.target.value })}
                  className="w-full h-9 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none"
                >
                  {plans.map((p) => {
                    const pid = p.id || p._id;
                    return (
                      <option key={pid} value={pid}>
                        {p.name} (£{p.price}/mo)
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="mt-5 flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    setAssignModal({ isOpen: false, cafeId: "", planId: "", isSubmitting: false })
                  }
                  className="rounded-xl border border-[#dacdb9] px-4 py-2 font-bold text-(--mainColor)"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={assignModal.isSubmitting}
                  className="rounded-xl bg-(--mainColor) px-4 py-2 font-bold text-(--secondColor) hover:opacity-95 transition disabled:opacity-50 flex items-center gap-1.5"
                >
                  {assignModal.isSubmitting && <LuLoader className="h-3.5 w-3.5 animate-spin" />}
                  <span>Assign Plan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title={`Delete '${deleteModal.planName}' Plan?`}
        description={`Are you sure you want to delete the '${deleteModal.planName}' subscription plan? This will remove the tier permanently. Any assigned cafes will be unlinked.`}
        confirmLabel="Delete Plan"
        confirmVariant="danger"
        isLoading={deleteModal.isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() =>
          setDeleteModal({ isOpen: false, planId: null, planName: "", isDeleting: false })
        }
      />
    </div>
  );
}
