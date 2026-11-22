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

const FEATURE_CONFIG = [
  {
    id: "digital_menu",
    label: "Digital Menu",
    desc: "Public menu items & pricing preview",
  },
  {
    id: "activity_history",
    label: "Activity History Page",
    desc: "Real-time timeline of customer visits and redemptions",
  },
  {
    id: "multi_staff",
    label: "Multi-staff Accounts",
    desc: "Multiple barista/manager logins with distinct permissions",
  },
  {
    id: "promotional_campaigns",
    label: "Promotional Campaigns",
    desc: "Showcase cafe in the customer Suggested Cafes section",
  },
  {
    id: "unlimited_customers",
    label: "Unlimited Customers",
    desc: "No cap on registered customer loyalty cards",
  },
  {
    id: "unlimited_rewards",
    label: "Unlimited Rewards",
    desc: "No limit on active reward tiers",
  },
];

const DEFAULT_FEATURES = FEATURE_CONFIG.map((f) => f.id);

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
    maxCustomers: "50",
    maxRewards: "3",
    maxStaff: "3",
    isPopular: false,
    features: ["digital_menu", "activity_history"],
  });

  // Assign Plan Modal
  const [assignModal, setAssignModal] = useState({
    isOpen: false,
    cafeId: "",
    planId: "",
    isSubmitting: false,
  });

  const handleOpenCreate = () => {
    setEditingPlan(null);
    setFormData({
      name: "",
      description: "",
      price: 0,
      billingPeriod: "month",
      maxCustomers: "50",
      maxRewards: "3",
      maxStaff: "3",
      isPopular: false,
      features: ["digital_menu", "activity_history"],
    });
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (plan) => {
    setEditingPlan(plan);
    const rawFeatures = Array.isArray(plan.features) ? plan.features : [];

    // Map raw/legacy features to current canonical IDs and filter out obsolete ones
    const mappedFeatures = rawFeatures
      .map((f) => {
        const lower = (f || "").toLowerCase().trim();
        if (
          lower === "digital_menu" ||
          lower.includes("digital menu") ||
          lower.includes("menu")
        )
          return "digital_menu";
        if (
          lower === "activity_history" ||
          lower.includes("activity")
        )
          return "activity_history";
        if (
          lower === "multi_staff" ||
          lower.includes("staff")
        )
          return "multi_staff";
        if (
          lower === "promotional_campaigns" ||
          lower.includes("promotional")
        )
          return "promotional_campaigns";
        if (
          lower === "unlimited_customers" ||
          (lower.includes("unlimited") && lower.includes("customer"))
        )
          return "unlimited_customers";
        if (
          lower === "unlimited_rewards" ||
          (lower.includes("unlimited") && lower.includes("reward"))
        )
          return "unlimited_rewards";
        return null;
      })
      .filter(Boolean);

    const cleanFeatures = Array.from(new Set(mappedFeatures));

    const isUnlimCust =
      Boolean(plan.isUnlimitedCustomers) ||
      cleanFeatures.includes("unlimited_customers");
    const isUnlimRew =
      Boolean(plan.isUnlimitedRewards) ||
      cleanFeatures.includes("unlimited_rewards");

    if (isUnlimCust && !cleanFeatures.includes("unlimited_customers")) {
      cleanFeatures.push("unlimited_customers");
    }
    if (isUnlimRew && !cleanFeatures.includes("unlimited_rewards")) {
      cleanFeatures.push("unlimited_rewards");
    }

    setFormData({
      name: plan.name,
      description: plan.description,
      price: plan.price,
      billingPeriod: plan.billingPeriod || "month",
      maxCustomers:
        plan.maxCustomers !== null && plan.maxCustomers !== undefined
          ? String(plan.maxCustomers)
          : "50",
      maxRewards:
        plan.maxRewards !== null && plan.maxRewards !== undefined
          ? String(plan.maxRewards)
          : "3",
      maxStaff: plan.maxStaff ? String(plan.maxStaff) : "3",
      isPopular: Boolean(plan.isPopular),
      features: cleanFeatures,
    });
    setIsCreateModalOpen(true);
  };

  const toggleFeatureSelection = (featId) => {
    const config = FEATURE_CONFIG.find((f) => f.id === featId);
    const labelLower = config ? config.label.toLowerCase() : "";

    setFormData((prev) => {
      const exists = prev.features.some(
        (f) =>
          f === featId ||
          (f && f.toLowerCase() === featId.toLowerCase()) ||
          (labelLower && f && f.toLowerCase() === labelLower)
      );
      const updated = exists
        ? prev.features.filter(
          (f) =>
            f !== featId &&
            f.toLowerCase() !== featId.toLowerCase() &&
            (!labelLower || f.toLowerCase() !== labelLower)
        )
        : [
          ...prev.features.filter(
            (f) =>
              f !== featId &&
              f.toLowerCase() !== featId.toLowerCase() &&
              (!labelLower || f.toLowerCase() !== labelLower)
          ),
          featId,
        ];

      const newFormData = {
        ...prev,
        features: updated,
      };

      if (featId === "unlimited_rewards" && exists && !newFormData.maxRewards) {
        newFormData.maxRewards = "3";
      }
      if (featId === "unlimited_customers" && exists && !newFormData.maxCustomers) {
        newFormData.maxCustomers = "50";
      }

      return newFormData;
    });
  };

  const handleSavePlan = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formData.name.trim()) {
      toast.error("Please enter a plan name.");
      return;
    }

    const isUnlimCust = formData.features.includes("unlimited_customers");
    const isUnlimRew = formData.features.includes("unlimited_rewards");
    const hasMultiStaff = formData.features.includes("multi_staff");

    const rawRewards = Number(formData.maxRewards);
    const resolvedMaxRewards = isUnlimRew
      ? null
      : !isNaN(rawRewards) && rawRewards >= 1
        ? rawRewards
        : 3;

    const rawCustomers = Number(formData.maxCustomers);
    const resolvedMaxCustomers = isUnlimCust
      ? null
      : !isNaN(rawCustomers) && rawCustomers >= 1
        ? rawCustomers
        : 50;

    setIsSubmitting(true);

    const planPayload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: Number(formData.price),
      billingPeriod: formData.billingPeriod,
      features: formData.features,
      isUnlimitedCustomers: isUnlimCust,
      maxCustomers: resolvedMaxCustomers,
      isUnlimitedRewards: isUnlimRew,
      maxRewards: resolvedMaxRewards,
      maxStaff: hasMultiStaff
        ? formData.maxStaff
          ? Number(formData.maxStaff)
          : 3
        : 1,
      isPopular: Boolean(formData.isPopular),
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
          <span className="font-bold">Monetization Ready Architecture:</span> Plans configured here establish business entitlements (customer caps, reward limits, analytics tiering) across Notch. Each plan validates against our platform feature catalog.
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
                className={`flex flex-col justify-between rounded-3xl border p-6 shadow-sm transition hover:shadow-md ${plan.isPopular
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
                        /{plan.billingPeriod === "week" ? "week" : plan.billingPeriod === "year" ? "year" : "month"}
                      </span>
                    )}
                  </div>

                  {/* Features List */}
                  <div className="mt-5 space-y-2.5">
                    <span className="text-[11px] font-bold text-(--mainColor)/60 uppercase tracking-wider block">
                      Entitlements & Features
                    </span>
                    <div className="text-xs space-y-2 max-h-56 overflow-y-auto pr-1">
                      {/* Max Customers */}
                      <div className="flex items-center gap-2 text-(--mainColor)/80">
                        <LuCheck className="h-4 w-4 shrink-0 text-emerald-700" />
                        <span>
                          {plan.isUnlimitedCustomers ||
                            plan.features?.includes("unlimited_customers")
                            ? "Unlimited customers"
                            : `Up to ${plan.maxCustomers || 50} customers`}
                        </span>
                      </div>

                      {/* Max Rewards */}
                      <div className="flex items-center gap-2 text-(--mainColor)/80">
                        <LuCheck className="h-4 w-4 shrink-0 text-emerald-700" />
                        <span>
                          {plan.isUnlimitedRewards ||
                            plan.features?.includes("unlimited_rewards")
                            ? "Unlimited rewards"
                            : `Up to ${plan.maxRewards || 3} reward tiers`}
                        </span>
                      </div>

                      {/* Max Staff if multi-staff */}
                      {(plan.features?.includes("multi_staff") ||
                        plan.features?.includes("Multi-staff Accounts")) && (
                          <div className="flex items-center gap-2 text-(--mainColor)/80">
                            <LuCheck className="h-4 w-4 shrink-0 text-emerald-700" />
                            <span>
                              Multi-staff: Up to {plan.maxStaff || 3} team accounts
                            </span>
                          </div>
                        )}

                      {/* Other features */}
                      {(plan.features || [])
                        .filter(
                          (f) =>
                            !f.toLowerCase().includes("unlimited") &&
                            !f.toLowerCase().includes("multi_staff") &&
                            !f.toLowerCase().includes("multi-staff")
                        )
                        .map((feat, idx) => {
                          const config = FEATURE_CONFIG.find(
                            (fc) =>
                              fc.id === feat ||
                              fc.label.toLowerCase() === feat.toLowerCase()
                          );
                          return (
                            <div
                              key={idx}
                              className="flex items-center gap-2 text-(--mainColor)/80"
                            >
                              <LuCheck className="h-4 w-4 shrink-0 text-emerald-700" />
                              <span>{config?.label || feat}</span>
                            </div>
                          );
                        })}
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
                      className={`rounded-xl px-3 py-2 text-xs font-bold transition ${plan.isActive
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
                    <option value="week">Weekly</option>
                    <option value="month">Monthly</option>
                    <option value="year">Yearly</option>
                  </select>
                </div>
              </div>

              {/* Limits Configuration */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-(--mainColor) block mb-1">
                    Max Customers
                    {formData.features.includes("unlimited_customers") && (
                      <span className="ml-1 text-[10px] text-emerald-700 font-bold">
                        (Unlimited)
                      </span>
                    )}
                  </label>
                  <input
                    type="number"
                    min="1"
                    disabled={formData.features.includes("unlimited_customers")}
                    value={
                      formData.features.includes("unlimited_customers")
                        ? ""
                        : formData.maxCustomers
                    }
                    onChange={(e) =>
                      setFormData({ ...formData, maxCustomers: e.target.value })
                    }
                    placeholder={
                      formData.features.includes("unlimited_customers")
                        ? "Unlimited"
                        : "e.g. 50"
                    }
                    className="w-full h-9 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none focus:border-(--mainColor) disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="font-semibold text-(--mainColor) block mb-1">
                    Max Rewards
                    {formData.features.includes("unlimited_rewards") && (
                      <span className="ml-1 text-[10px] text-emerald-700 font-bold">
                        (Unlimited)
                      </span>
                    )}
                  </label>
                  <input
                    type="number"
                    min="1"
                    disabled={formData.features.includes("unlimited_rewards")}
                    value={
                      formData.features.includes("unlimited_rewards")
                        ? ""
                        : formData.maxRewards
                    }
                    onChange={(e) =>
                      setFormData({ ...formData, maxRewards: e.target.value })
                    }
                    placeholder={
                      formData.features.includes("unlimited_rewards")
                        ? "Unlimited"
                        : "e.g. 3"
                    }
                    className="w-full h-9 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none focus:border-(--mainColor) disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Multi-Staff accounts count (if multi_staff feature enabled) */}
              {formData.features.includes("multi_staff") && (
                <div className="rounded-xl border border-amber-300 bg-amber-50/80 p-3">
                  <label className="font-semibold text-(--mainColor) block mb-1">
                    Available Staff User Accounts <span className="text-rose-500">*</span>
                  </label>
                  <p className="text-[11px] text-(--mainColor)/70 mb-2">
                    Enter how many staff / barista accounts can be created by a cafe on this plan.
                  </p>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={formData.maxStaff}
                    onChange={(e) =>
                      setFormData({ ...formData, maxStaff: e.target.value })
                    }
                    placeholder="e.g. 3"
                    className="w-full h-9 rounded-xl border border-[#dacdb9] bg-white px-3 text-xs text-(--mainColor) outline-none focus:border-(--mainColor)"
                  />
                </div>
              )}

              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.isPopular}
                    onChange={(e) =>
                      setFormData({ ...formData, isPopular: e.target.checked })
                    }
                    className="rounded accent-(--mainColor) h-4 w-4"
                  />
                  <span className="font-semibold text-(--mainColor)">
                    Mark as Popular Tier
                  </span>
                </label>
              </div>

              {/* Features Selection */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-semibold text-(--mainColor) block">
                    Allowed Features in Plan <span className="text-xs font-normal text-(--mainColor)/60">(Optional)</span>
                  </label>
                  <span className="text-[11px] text-(--mainColor)/60">
                    {formData.features.length} selected
                  </span>
                </div>
                <p className="text-[11px] text-(--mainColor)/60 mb-2">
                  Select which features are permitted under this subscription tier (optional):
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto p-2 rounded-xl border border-[#dacdb9] bg-[#f5ecdd]/60">
                  {FEATURE_CONFIG.map((feat) => {
                    const isSelected = formData.features.some(
                      (f) =>
                        f === feat.id ||
                        (f && f.toLowerCase() === feat.id.toLowerCase()) ||
                        (f && f.toLowerCase() === feat.label.toLowerCase())
                    );
                    return (
                      <button
                        type="button"
                        key={feat.id}
                        onClick={() => toggleFeatureSelection(feat.id)}
                        className={`flex items-start gap-2 rounded-xl p-2.5 text-left text-xs transition border cursor-pointer ${isSelected
                          ? "border-(--mainColor) bg-(--mainColor) text-(--secondColor)"
                          : "border-[#dacdb9] bg-[#faf6ed] text-(--mainColor)/80 hover:border-(--mainColor)/50"
                          }`}
                      >
                        <div
                          className={`h-4 w-4 rounded flex items-center justify-center shrink-0 border mt-0.5 ${isSelected
                            ? "bg-(--secondColor) border-(--secondColor) text-(--mainColor)"
                            : "border-[#dacdb9] bg-white"
                            }`}
                        >
                          {isSelected && <LuCheck className="h-3 w-3 stroke-[3]" />}
                        </div>
                        <div className="min-w-0">
                          <span
                            className={`block font-bold truncate ${isSelected ? "text-(--secondColor)" : "text-(--mainColor)"
                              }`}
                          >
                            {feat.label}
                          </span>
                          <span
                            className={`block text-[10px] line-clamp-2 ${isSelected ? "text-(--secondColor)/80" : "text-(--mainColor)/60"
                              }`}
                          >
                            {feat.desc}
                          </span>
                        </div>
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
                        {p.name} (£{p.price}/{p.billingPeriod === "week" ? "wk" : p.billingPeriod === "year" ? "yr" : "mo"})
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
