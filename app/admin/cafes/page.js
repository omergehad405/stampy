"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  LuSearch,
  LuFilter,
  LuArrowUpDown,
  LuStore,
  LuExternalLink,
  LuEye,
  LuBan,
  LuCircleCheck,
  LuChevronLeft,
  LuChevronRight,
  LuShieldAlert,
  LuPlus,
  LuMail,
  LuLock,
  LuPhone,
  LuUser,
  LuEyeOff,
  LuX,
  LuInfo,
  LuPencil,
  LuLoader,
  LuTrash2,
} from "react-icons/lu";
import { toast } from "react-toastify";
import AdminPageHeader from "../components/AdminPageHeader";
import AdminBadge from "../components/AdminBadge";
import ConfirmModal from "../components/ConfirmModal";
import { useAdminStore } from "@/app/stores/useAdminStore";

export default function AdminCafesPage() {
  const {
    cafes,
    updateCafeStatus,
    plans,
    createCafe,
    updateCafeInfo,
    assignPlanToCafe,
    deleteCafe,
    fetchCafes,
    isLoadingCafes,
  } = useAdminStore();

  useEffect(() => {
    fetchCafes();
  }, [fetchCafes]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Add Cafe Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [addFormData, setAddFormData] = useState({
    name: "",
    ownerName: "",
    email: "",
    password: "",
    phone: "",
    subscriptionPlanId: "plan-free",
  });

  // Edit Cafe Modal State
  const [editingCafe, setEditingCafe] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    ownerName: "",
    email: "",
    phone: "",
    category: "",
    tagline: "",
    subscriptionPlanId: "plan-free",
  });

  // Created Success Modal (shows credentials summary)
  const [createdSummary, setCreatedSummary] = useState(null);

  // Confirm Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    cafeId: null,
    cafeName: "",
    newStatus: "",
    variant: "danger",
    title: "",
    description: "",
  });
  const [deleteCafeModal, setDeleteCafeModal] = useState({
    isOpen: false,
    cafeId: null,
    cafeName: "",
    isLoading: false,
  });

  // Filter and sort cafes
  const filteredCafes = useMemo(() => {
    let result = [...cafes];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.owner?.name?.toLowerCase().includes(q) ||
          c.owner?.email?.toLowerCase().includes(q) ||
          c.category?.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((c) => c.status === statusFilter);
    }

    // Plan filter
    if (planFilter !== "all") {
      result = result.filter((c) => c.subscriptionPlanId === planFilter);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "date-desc") {
        return new Date(b.registrationDate || 0) - new Date(a.registrationDate || 0);
      }
      if (sortBy === "date-asc") {
        return new Date(a.registrationDate || 0) - new Date(b.registrationDate || 0);
      }
      if (sortBy === "stamps-desc") {
        return (b.totalStampsIssued || 0) - (a.totalStampsIssued || 0);
      }
      if (sortBy === "customers-desc") {
        return (b.customerCount || 0) - (a.customerCount || 0);
      }
      if (sortBy === "name-asc") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    return result;
  }, [cafes, searchQuery, statusFilter, planFilter, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredCafes.length / pageSize) || 1;
  const paginatedCafes = filteredCafes.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Trigger status toggle with confirmation
  const handleOpenStatusModal = (cafe, targetStatus) => {
    const isSuspending = targetStatus === "suspended";
    setConfirmModal({
      isOpen: true,
      cafeId: cafe.id,
      cafeName: cafe.name,
      newStatus: targetStatus,
      variant: isSuspending ? "danger" : "primary",
      title: isSuspending ? `Suspend ${cafe.name}?` : `Activate ${cafe.name}?`,
      description: isSuspending
        ? `Suspending ${cafe.name} will immediately prevent staff from scanning visits and pause their customer loyalty rewards.`
        : `Activating ${cafe.name} will enable full platform features and make their loyalty program live for customers.`,
    });
  };

  const handleConfirmStatusChange = async () => {
    const res = await updateCafeStatus(confirmModal.cafeId, confirmModal.newStatus);
    if (res.success) {
      toast.success(
        `Cafe status updated to ${confirmModal.newStatus.toUpperCase()}`
      );
    } else {
      toast.error(res.error || "Failed to update cafe status");
    }
    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
  };

  const handleConfirmCafeDelete = async () => {
    setDeleteCafeModal((current) => ({ ...current, isLoading: true }));
    const result = await deleteCafe(deleteCafeModal.cafeId);
    if (result.success) {
      toast.success(`Cafe "${deleteCafeModal.cafeName}" and its records were deleted.`);
      setCurrentPage(1);
    } else {
      toast.error(result.error || "Failed to delete cafe.");
    }
    setDeleteCafeModal({
      isOpen: false,
      cafeId: null,
      cafeName: "",
      isLoading: false,
    });
  };

  const handleAddCafeSubmit = async (e) => {
    e.preventDefault();
    if (!addFormData.name.trim()) {
      toast.error("Please enter the cafe name.");
      return;
    }
    if (!addFormData.email.trim()) {
      toast.error("Please enter the staff login email address.");
      return;
    }
    if (!addFormData.password || addFormData.password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }
    if (!addFormData.phone.trim()) {
      toast.error("Please enter a contact phone number.");
      return;
    }

    setIsSubmitting(true);
    const res = await createCafe(addFormData);
    setIsSubmitting(false);

    if (res.success) {
      toast.success(`Cafe "${res.cafe.name}" registered successfully!`);
      setIsAddModalOpen(false);
      setCreatedSummary({
        cafe: res.cafe,
        email: addFormData.email,
        password: addFormData.password,
        phone: addFormData.phone,
        planName: getPlanName(res.cafe.subscriptionPlanId),
      });
      setAddFormData({
        name: "",
        ownerName: "",
        email: "",
        password: "",
        phone: "",
        subscriptionPlanId: plans[0]?.id || "plan-free",
      });
    } else {
      toast.error(res.error || "Failed to create cafe.");
    }
  };

  const handleOpenEditModal = (cafe) => {
    setEditingCafe(cafe);
    setEditFormData({
      name: cafe.name || "",
      ownerName: cafe.owner?.name || "",
      email: cafe.owner?.email || cafe.contact?.email || "",
      phone: cafe.contact?.phone || cafe.owner?.phone || "",
      category: cafe.category || "",
      tagline: cafe.tagline || "",
      subscriptionPlanId: cafe.subscriptionPlanId || "plan-free",
    });
  };

  const handleSaveEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingCafe) return;
    if (!editFormData.name.trim()) {
      toast.error("Please enter the cafe name.");
      return;
    }

    const updatedData = {
      name: editFormData.name.trim(),
      category: editFormData.category.trim(),
      tagline: editFormData.tagline.trim(),
      owner: {
        ...editingCafe.owner,
        name: editFormData.ownerName.trim() || editingCafe.owner?.name,
        email: editFormData.email.trim(),
        phone: editFormData.phone.trim(),
      },
      contact: {
        ...editingCafe.contact,
        email: editFormData.email.trim(),
        phone: editFormData.phone.trim(),
        displayPhone: editFormData.phone.trim(),
      },
    };

    await updateCafeInfo(editingCafe.id, updatedData);

    if (
      editFormData.subscriptionPlanId &&
      editFormData.subscriptionPlanId !== editingCafe.subscriptionPlanId
    ) {
      assignPlanToCafe(editingCafe.id, editFormData.subscriptionPlanId);
    }

    toast.success(`Cafe "${editFormData.name}" updated successfully.`);
    setEditingCafe(null);
  };

  const getPlanName = (planId) => {
    const plan = plans.find((p) => p.id === planId);
    return plan ? plan.name : "None";
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <AdminPageHeader
        title="Cafe Management"
        description="Monitor, approve, configure, or suspend participating cafes on the Notch platform."
        breadcrumbs={[{ label: "Cafes" }]}
        actions={
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-(--mainColor) px-4 py-2 text-xs font-bold text-(--secondColor) hover:opacity-95 transition shadow-2xs cursor-pointer"
          >
            <LuPlus className="h-4 w-4" />
            <span>Add New Cafe</span>
          </button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] p-4 shadow-2xs">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* Search */}
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--mainColor)/50">
              <LuSearch className="h-4 w-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by cafe name or owner..."
              className="w-full h-10 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] pl-9 pr-3 text-xs text-(--mainColor) placeholder:text-(--mainColor)/40 outline-none focus:border-(--mainColor)"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-10 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none focus:border-(--mainColor)"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          {/* Plan Filter */}
          <div className="relative">
            <select
              value={planFilter}
              onChange={(e) => {
                setPlanFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-10 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none focus:border-(--mainColor)"
            >
              <option value="all">All Subscription Plans</option>
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} Plan
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full h-10 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none focus:border-(--mainColor)"
            >
              <option value="date-desc">Newest Registered</option>
              <option value="date-asc">Oldest Registered</option>
              <option value="stamps-desc">Most Stamps Issued</option>
              <option value="customers-desc">Most Customers</option>
              <option value="name-asc">Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cafes Table */}
      <div className="rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#ebdcc8] bg-[#f4ece0]/60 text-(--mainColor)/70 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Cafe</th>
                <th className="px-5 py-3.5">Owner</th>
                <th className="px-5 py-3.5">Registered</th>
                <th className="px-5 py-3.5">Plan</th>
                <th className="px-5 py-3.5">Activity</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ebdcc8]">
              {isLoadingCafes && cafes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-(--mainColor)/60">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <LuLoader className="h-6 w-6 animate-spin text-(--mainColor)" />
                      <span className="text-xs font-semibold">Loading cafes from database...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedCafes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-(--mainColor)/60">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <LuStore className="h-8 w-8 text-(--mainColor)/30" />
                      <p className="font-semibold text-xs text-(--mainColor)/80">No cafes found</p>
                      <p className="text-[11px] text-(--mainColor)/50">
                        {searchQuery || statusFilter !== "all" || planFilter !== "all"
                          ? "No cafes match your current search or filter criteria."
                          : "No cafes registered yet. Click 'Add New Cafe' above to register your first cafe."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedCafes.map((cafe) => (
                  <tr key={cafe.id} className="hover:bg-[#f6efe4] transition">
                    {/* Cafe Info */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            cafe.logoImage ||
                            "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80"
                          }
                          alt={cafe.name}
                          className="h-10 w-10 rounded-lg object-cover border border-[#dacdb9]"
                        />
                        <div className="min-w-0">
                          <Link
                            href={`/admin/cafes/${cafe.slug}`}
                            className="font-bold text-(--mainColor) hover:underline block truncate max-w-[180px]"
                          >
                            {cafe.name}
                          </Link>
                          <span className="text-[11px] text-(--mainColor)/60 block truncate max-w-[180px]">
                            {cafe.category || "Cafe"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Owner */}
                    <td className="px-5 py-3.5">
                      <div className="min-w-0">
                        <span className="font-semibold text-(--mainColor) block truncate">
                          {cafe.owner?.name || "Unassigned"}
                        </span>
                        <span className="text-[11px] text-(--mainColor)/60 block truncate">
                          {cafe.owner?.email || "No email"}
                        </span>
                      </div>
                    </td>

                    {/* Registration Date */}
                    <td className="px-5 py-3.5 text-(--mainColor)/80">
                      {cafe.registrationDate || "Unknown"}
                    </td>

                    {/* Subscription Plan */}
                    <td className="px-5 py-3.5">
                      <span className="inline-flex rounded-md bg-(--secondColor)/30 px-2 py-0.5 text-[11px] font-bold text-(--mainColor)">
                        {getPlanName(cafe.subscriptionPlanId)}
                      </span>
                    </td>

                    {/* Activity (stamps & customers) */}
                    <td className="px-5 py-3.5">
                      <div className="text-[11px]">
                        <span className="font-bold text-(--mainColor)">
                          {cafe.totalStampsIssued || 0} stamps
                        </span>
                        <span className="text-(--mainColor)/60 block">
                          {cafe.customerCount || 0} customers
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5">
                      <AdminBadge status={cafe.status} />
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/cafes/${cafe.slug}`}
                          className="rounded-lg p-1.5 text-(--mainColor)/70 hover:bg-[#ebdcc8] hover:text-(--mainColor) transition"
                          title="View Cafe Details"
                        >
                          <LuEye className="h-4 w-4" />
                        </Link>

                        <button
                          onClick={() => handleOpenEditModal(cafe)}
                          className="rounded-lg p-1.5 text-(--mainColor)/70 hover:bg-[#ebdcc8] hover:text-(--mainColor) transition cursor-pointer"
                          title="Edit Cafe Info"
                        >
                          <LuPencil className="h-4 w-4" />
                        </button>

                        {cafe.status === "active" ? (
                          <button
                            onClick={() => handleOpenStatusModal(cafe, "suspended")}
                            className="rounded-lg p-1.5 text-rose-700 hover:bg-rose-100 transition"
                            title="Suspend Cafe"
                          >
                            <LuBan className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleOpenStatusModal(cafe, "active")}
                            className="rounded-lg p-1.5 text-emerald-700 hover:bg-emerald-100 transition"
                            title="Activate Cafe"
                          >
                            <LuCircleCheck className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() =>
                            setDeleteCafeModal({
                              isOpen: true,
                              cafeId: cafe.id,
                              cafeName: cafe.name,
                              isLoading: false,
                            })
                          }
                          className="rounded-lg p-1.5 text-rose-700 hover:bg-rose-100 transition"
                          title="Delete Cafe and Records"
                          aria-label={`Delete ${cafe.name} and its records`}
                        >
                          <LuTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex items-center justify-between border-t border-[#ebdcc8] px-5 py-3 text-xs text-(--mainColor)/70">
          <span>
            Showing {filteredCafes.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, filteredCafes.length)} of {filteredCafes.length} cafes
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#dacdb9] bg-[#f5ecdd] disabled:opacity-40"
              aria-label="Previous page"
            >
              <LuChevronLeft className="h-3.5 w-3.5" />
            </button>
            <span className="px-2 font-semibold text-(--mainColor)">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#dacdb9] bg-[#f5ecdd] disabled:opacity-40"
              aria-label="Next page"
            >
              <LuChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        description={confirmModal.description}
        confirmLabel={confirmModal.newStatus === "suspended" ? "Yes, Suspend" : "Yes, Activate"}
        confirmVariant={confirmModal.variant}
        onConfirm={handleConfirmStatusChange}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />
      <ConfirmModal
        isOpen={deleteCafeModal.isOpen}
        title={`Delete ${deleteCafeModal.cafeName}?`}
        description="This permanently deletes the cafe, its rewards, redemption and visit history, campaigns, and cafe owner/staff accounts. Customer accounts are retained, but their membership in this cafe is removed. This cannot be undone."
        confirmLabel="Delete Cafe and Records"
        confirmVariant="danger"
        isLoading={deleteCafeModal.isLoading}
        onConfirm={handleConfirmCafeDelete}
        onCancel={() =>
          setDeleteCafeModal({
            isOpen: false,
            cafeId: null,
            cafeName: "",
            isLoading: false,
          })
        }
      />

      {/* Add New Cafe Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg rounded-3xl border border-[#e3d7c0] bg-[#faf6ed] p-6 sm:p-7 shadow-xl">
            {/* Close Button */}
            <button
              onClick={() => setIsAddModalOpen(false)}
              disabled={isSubmitting}
              className="absolute right-4 top-4 rounded-xl p-1.5 text-(--mainColor)/60 hover:bg-[#eee3d1] hover:text-(--mainColor) transition cursor-pointer"
              aria-label="Close modal"
            >
              <LuX className="h-5 w-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 border-b border-[#ebdcc8] pb-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--mainColor) text-(--secondColor)">
                <LuStore className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-(--mainColor)">Add New Cafe</h3>
                <p className="text-xs text-(--mainColor)/65">
                  Create the cafe and set initial login credentials for the cafe manager.
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleAddCafeSubmit} className="mt-5 space-y-4 text-xs">
              {/* Cafe Name */}
              <div>
                <label className="font-bold text-(--mainColor) block mb-1.5">
                  Cafe Name <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-(--mainColor)/50">
                    <LuStore className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={addFormData.name}
                    onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value })}
                    placeholder="e.g. Roastery & Co."
                    className="w-full h-10 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] pl-10 pr-3 text-xs text-(--mainColor) placeholder:text-(--mainColor)/40 outline-none focus:border-(--mainColor)"
                  />
                </div>
              </div>

              {/* Owner / Manager Name */}
              <div>
                <label className="font-bold text-(--mainColor) block mb-1.5">
                  Owner / Manager Name
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-(--mainColor)/50">
                    <LuUser className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    value={addFormData.ownerName}
                    onChange={(e) => setAddFormData({ ...addFormData, ownerName: e.target.value })}
                    placeholder="e.g. Alex Morgan"
                    className="w-full h-10 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] pl-10 pr-3 text-xs text-(--mainColor) placeholder:text-(--mainColor)/40 outline-none focus:border-(--mainColor)"
                  />
                </div>
              </div>

              {/* Email & Password Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Email */}
                <div>
                  <label className="font-bold text-(--mainColor) block mb-1.5">
                    Staff Email (Login) <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--mainColor)/50">
                      <LuMail className="h-4 w-4" />
                    </span>
                    <input
                      type="email"
                      required
                      value={addFormData.email}
                      onChange={(e) => setAddFormData({ ...addFormData, email: e.target.value })}
                      placeholder="manager@cafe.com"
                      className="w-full h-10 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] pl-9 pr-3 text-xs text-(--mainColor) placeholder:text-(--mainColor)/40 outline-none focus:border-(--mainColor)"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="font-bold text-(--mainColor) block mb-1.5">
                    Initial Password <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--mainColor)/50">
                      <LuLock className="h-4 w-4" />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={8}
                      value={addFormData.password}
                      onChange={(e) => setAddFormData({ ...addFormData, password: e.target.value })}
                      placeholder="Min 8 characters"
                      className="w-full h-10 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] pl-9 pr-9 text-xs text-(--mainColor) placeholder:text-(--mainColor)/40 outline-none focus:border-(--mainColor)"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-(--mainColor)/50 hover:text-(--mainColor)"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <LuEyeOff className="h-4 w-4" /> : <LuEye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="font-bold text-(--mainColor) block mb-1.5">
                  Phone Number <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-(--mainColor)/50">
                    <LuPhone className="h-4 w-4" />
                  </span>
                  <input
                    type="tel"
                    required
                    value={addFormData.phone}
                    onChange={(e) => setAddFormData({ ...addFormData, phone: e.target.value })}
                    placeholder="+44 7700 900555"
                    className="w-full h-10 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] pl-10 pr-3 text-xs text-(--mainColor) placeholder:text-(--mainColor)/40 outline-none focus:border-(--mainColor)"
                  />
                </div>
              </div>

              {/* Subscription Plan Selection */}
              <div>
                <label className="font-bold text-(--mainColor) block mb-1.5">
                  Subscription Plan <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <select
                    value={addFormData.subscriptionPlanId || plans[0]?.id || "plan-free"}
                    onChange={(e) =>
                      setAddFormData({ ...addFormData, subscriptionPlanId: e.target.value })
                    }
                    className="w-full h-10 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none focus:border-(--mainColor)"
                  >
                    {plans.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} Plan ({p.price === 0 ? "Free" : `£${p.price}/mo`}) —{" "}
                        {p.maxCustomers ? `Up to ${p.maxCustomers} customers` : "Unlimited customers"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notice Banner */}
              <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-3 text-[11px] text-blue-900 flex items-start gap-2.5">
                <LuInfo className="h-4 w-4 shrink-0 text-blue-700 mt-0.5" />
                <p className="leading-relaxed">
                  These initial credentials allow the cafe manager to sign in immediately at the <strong className="font-bold">Cafe Dashboard</strong> to complete remaining profile details, location, opening hours, and menu.
                </p>
              </div>

              {/* Actions */}
              <div className="mt-5 flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  disabled={isSubmitting}
                  className="rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-4 py-2 font-bold text-(--mainColor) hover:bg-[#eee3d1] transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-(--mainColor) px-5 py-2 font-bold text-(--secondColor) hover:opacity-95 transition shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? "Registering..." : "Create Cafe & Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Created Credentials Success Modal */}
      {createdSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-md rounded-3xl border border-[#e3d7c0] bg-[#faf6ed] p-6 sm:p-7 shadow-xl">
            <div className="flex items-center gap-3 border-b border-[#ebdcc8] pb-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
                <LuCircleCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-(--mainColor)">Cafe Created Successfully!</h3>
                <p className="text-xs text-(--mainColor)/65">
                  Initial credentials generated for {createdSummary.cafe?.name}.
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-[#ebdcc8] bg-[#f5ecdd] p-4 text-xs space-y-2.5">
              <div className="flex justify-between">
                <span className="text-(--mainColor)/60">Cafe Name:</span>
                <span className="font-bold text-(--mainColor)">{createdSummary.cafe?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-(--mainColor)/60">Login Email:</span>
                <span className="font-mono font-bold text-(--mainColor)">{createdSummary.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-(--mainColor)/60">Password:</span>
                <span className="font-mono font-bold text-(--mainColor)">{createdSummary.password}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-(--mainColor)/60">Contact Phone:</span>
                <span className="font-bold text-(--mainColor)">{createdSummary.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-(--mainColor)/60">Subscription Plan:</span>
                <span className="font-bold text-(--mainColor)">
                  {createdSummary.planName || "Free Plan"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-(--mainColor)/60">Cafe URL Slug:</span>
                <span className="font-mono text-xs text-(--mainColor)">{createdSummary.cafe?.slug}</span>
              </div>
            </div>

            <p className="mt-3 text-[11px] text-(--mainColor)/70 leading-relaxed">
              The cafe admin can now open the <strong className="text-(--mainColor)">Cafe Portal</strong>, log in with these credentials, and navigate to <strong className="text-(--mainColor)">Cafe Profile</strong> to complete the rest of the information.
            </p>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <Link
                href="/dashboard/login"
                target="_blank"
                className="flex items-center gap-1.5 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-4 py-2 text-xs font-bold text-(--mainColor) hover:bg-[#eee3d1] transition"
              >
                <span>Test Cafe Login</span>
                <LuExternalLink className="h-3.5 w-3.5" />
              </Link>
              <button
                onClick={() => setCreatedSummary(null)}
                className="rounded-xl bg-(--mainColor) px-5 py-2 text-xs font-bold text-(--secondColor) hover:opacity-95 transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Cafe Modal */}
      {editingCafe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg rounded-3xl border border-[#e3d7c0] bg-[#faf6ed] p-6 sm:p-7 shadow-xl max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setEditingCafe(null)}
              className="absolute right-4 top-4 rounded-xl p-1.5 text-(--mainColor)/60 hover:bg-[#eee3d1] hover:text-(--mainColor) transition cursor-pointer"
              aria-label="Close modal"
            >
              <LuX className="h-5 w-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 border-b border-[#ebdcc8] pb-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--mainColor) text-(--secondColor)">
                <LuPencil className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-(--mainColor)">Edit Cafe Information</h3>
                <p className="text-xs text-(--mainColor)/65">
                  Update identity, contact details, and subscription tier for {editingCafe.name}.
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveEditSubmit} className="mt-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="font-bold text-(--mainColor) block mb-1.5">Cafe Name</label>
                  <input
                    type="text"
                    required
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full h-10 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none focus:border-(--mainColor)"
                  />
                </div>
                <div>
                  <label className="font-bold text-(--mainColor) block mb-1.5">Category</label>
                  <input
                    type="text"
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                    placeholder="e.g. Specialty Coffee & Bakery"
                    className="w-full h-10 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none focus:border-(--mainColor)"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-(--mainColor) block mb-1.5">Tagline</label>
                <input
                  type="text"
                  value={editFormData.tagline}
                  onChange={(e) => setEditFormData({ ...editFormData, tagline: e.target.value })}
                  placeholder="Short brand slogan"
                  className="w-full h-10 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none focus:border-(--mainColor)"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="font-bold text-(--mainColor) block mb-1.5">
                    Owner / Contact Name
                  </label>
                  <input
                    type="text"
                    value={editFormData.ownerName}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, ownerName: e.target.value })
                    }
                    className="w-full h-10 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none focus:border-(--mainColor)"
                  />
                </div>
                <div>
                  <label className="font-bold text-(--mainColor) block mb-1.5">Contact Phone</label>
                  <input
                    type="tel"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="w-full h-10 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none focus:border-(--mainColor)"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-(--mainColor) block mb-1.5">
                  Contact / Admin Email
                </label>
                <input
                  type="email"
                  required
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  className="w-full h-10 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none focus:border-(--mainColor)"
                />
              </div>

              <div>
                <label className="font-bold text-(--mainColor) block mb-1.5">
                  Subscription Plan
                </label>
                <select
                  value={editFormData.subscriptionPlanId}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, subscriptionPlanId: e.target.value })
                  }
                  className="w-full h-10 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none focus:border-(--mainColor)"
                >
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.price === 0 ? "Free" : `£${p.price}/mo`})
                    </option>
                  ))}
                </select>
              </div>

              {/* Actions */}
              <div className="mt-5 flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCafe(null)}
                  className="rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-4 py-2 font-bold text-(--mainColor) hover:bg-[#eee3d1] transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-(--mainColor) px-5 py-2 font-bold text-(--secondColor) hover:opacity-95 transition shadow-xs cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
