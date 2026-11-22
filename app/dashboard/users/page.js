"use client";

import React, { useState, useEffect } from "react";
import {
  LuUserCheck,
  LuPlus,
  LuSearch,
  LuPencil,
  LuTrash2,
  LuShield,
  LuLock,
  LuX,
  LuTriangleAlert,
  LuEye,
  LuEyeOff,
  LuUserX,
} from "react-icons/lu";
import { toast } from "react-toastify";
import DashboardPageHeader from "../components/DashboardPageHeader";
import PlanLockedFeature from "../components/PlanLockedFeature";
import { useDashboardStore } from "@/app/stores/useDashboardStore";
import { useDashboardAuthStore } from "@/app/stores/useDashboardAuthStore";

const ROLE_OPTIONS = [
  {
    key: "owner",
    name: "Owner / Administrator",
    description: "Full administrative access to cafe profile, billing, and employees.",
  },
  {
    key: "manager",
    name: "Shift Manager / Head Barista",
    description: "Can scan visits, issue rewards, and view analytics.",
  },
  {
    key: "barista",
    name: "Barista / Cashier",
    description: "Counter access to scan customer QR cards and issue stamps.",
  },
];

export default function DashboardUsersPage() {
  const {
    staffMembers,
    fetchStaff,
    createStaff,
    updateStaff,
    deleteStaff,
    toggleStaffStatus,
    hasFeature,
  } = useDashboardStore();
  const { currentUser } = useDashboardAuthStore();

  const isOwner = currentUser?.roleKey === "owner";
  const isFeatureAllowed = hasFeature ? hasFeature("multi_staff") : true;

  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [deletingStaff, setDeletingStaff] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    roleKey: "barista",
    role: "Barista",
  });

  // Load staff from backend on mount
  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const handleOpenAddModal = () => {
    setEditingStaff(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      roleKey: "barista",
      role: "Barista",
    });
    setShowPassword(false);
    setShowAddModal(true);
  };

  const handleOpenEditModal = (staff) => {
    setEditingStaff(staff);
    setFormData({
      name: staff.name,
      email: staff.email,
      phone: staff.phone || "",
      password: "",
      roleKey: staff.roleKey || "barista",
      role: staff.role || "Barista",
    });
    setShowPassword(false);
    setShowAddModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error("Name and email are required.");
      return;
    }
    if (!editingStaff && !formData.password) {
      toast.error("A password is required when creating a new employee.");
      return;
    }
    if (formData.password && formData.password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    const selectedRole = ROLE_OPTIONS.find((r) => r.key === formData.roleKey);
    const roleName = selectedRole ? selectedRole.name : formData.role;

    setIsSaving(true);
    try {
      if (editingStaff) {
        await updateStaff(editingStaff.id, { ...formData, role: roleName });
        toast.success(`Updated staff record for ${formData.name}.`);
      } else {
        await createStaff({ ...formData, role: roleName });
        toast.success(`Employee ${formData.name} added! They can now log in with their email and password.`);
      }
      setShowAddModal(false);
    } catch (err) {
      toast.error(err?.message || "Failed to save employee. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingStaff) return;
    try {
      await deleteStaff(deletingStaff.id);
      toast.success(`Removed ${deletingStaff.name} from the team.`);
    } catch (err) {
      toast.error(err?.message || "Failed to remove employee.");
    }
    setDeletingStaff(null);
  };

  const filteredStaff = staffMembers.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      s.name?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q) ||
      s.role?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Users & Employees"
        description="Manage cafe team members, baristas, and dashboard access credentials."
        breadcrumbs={[{ label: "Users & Staff" }]}
        actions={
          isOwner && isFeatureAllowed ? (
            <button
              onClick={handleOpenAddModal}
              className="flex items-center gap-2 rounded-xl bg-(--mainColor) px-4 py-2 text-xs font-bold text-(--secondColor) shadow-sm hover:opacity-95"
            >
              <LuPlus className="h-4 w-4" />
              <span>Add Team Member</span>
            </button>
          ) : null
        }
      />

      {!isFeatureAllowed ? (
        <PlanLockedFeature
          featureKey="multi_staff"
          featureName="Multi-Staff Accounts"
          description="Multi-staff accounts are not included in your current subscription plan. Upgrade your plan to invite barista and shift manager accounts with dedicated credentials."
        />
      ) : (
        <>
          {/* Non-owner restriction banner */}
      {!isOwner && (
        <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800">
          <LuUserX className="h-5 w-5 shrink-0 text-amber-600" />
          <p>
            <strong>View Only:</strong> Only the café Owner can add, edit, or remove team members.
          </p>
        </div>
      )}

      {/* Search Toolbar */}
      <div className="flex items-center justify-between rounded-2xl sm:rounded-3xl border border-(--bgColor)/15 bg-(--mainColor) p-4 text-(--bgColor) shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or role..."
            className="w-full h-10 rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 pl-9 pr-3 text-xs text-(--bgColor) placeholder:text-(--bgColor)/40 outline-none focus:border-(--secondColor)"
          />
          <LuSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-(--bgColor)/50" />
        </div>

        <span className="text-xs text-(--bgColor)/65 font-semibold">
          {filteredStaff.length} Team Member{filteredStaff.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Staff Table */}
      <div className="overflow-hidden rounded-2xl sm:rounded-3xl border border-(--bgColor)/15 bg-(--mainColor) text-(--bgColor) shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-(--bgColor)/15 bg-(--bgColor)/10 text-(--bgColor)/80 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Employee</th>
                <th className="px-5 py-3.5">Assigned Role</th>
                <th className="px-5 py-3.5">Joined Date</th>
                <th className="px-5 py-3.5">Status</th>
                {isOwner && <th className="px-5 py-3.5 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-(--bgColor)/15">
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan={isOwner ? 5 : 4} className="px-5 py-10 text-center text-(--bgColor)/50">
                    No team members found.
                  </td>
                </tr>
              ) : (
                filteredStaff.map((staff) => (
                  <tr key={staff.id} className="hover:bg-(--bgColor)/5 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {staff.avatar ? (
                          <img
                            src={staff.avatar}
                            alt={staff.name}
                            className="h-9 w-9 rounded-full object-cover border border-(--bgColor)/20"
                          />
                        ) : (
                          <div className="h-9 w-9 rounded-full bg-(--bgColor)/10 border border-(--bgColor)/20 flex items-center justify-center text-sm font-bold text-(--secondColor)">
                            {staff.name?.[0]?.toUpperCase() || "?"}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-(--bgColor) text-sm">
                            {staff.name}
                          </div>
                          <div className="text-[11px] text-(--bgColor)/60">
                            {staff.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-lg border border-(--bgColor)/20 bg-(--bgColor)/10 px-2.5 py-1 text-xs font-semibold text-(--secondColor)">
                        <LuShield className="h-3.5 w-3.5 text-(--secondColor)" />
                        <span>{staff.role}</span>
                      </span>
                    </td>
                    <td className="px-5 py-4 text-(--bgColor)/75 font-medium">
                      {staff.joinedDate || "—"}
                    </td>
                    <td className="px-5 py-4">
                      {isOwner ? (
                        <button
                          type="button"
                          onClick={() => toggleStaffStatus(staff.id)}
                          className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase transition ${
                            staff.status === "active"
                              ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          <span>{staff.status ?? "active"}</span>
                        </button>
                      ) : (
                        <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
                          staff.status === "active"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-gray-200 text-gray-700"
                        }`}>
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {staff.status ?? "active"}
                        </span>
                      )}
                    </td>
                    {isOwner && (
                      <td className="px-5 py-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditModal(staff)}
                            className="rounded-lg border border-[#dacdb9] bg-white/70 p-1.5 text-(--mainColor) hover:bg-white"
                            title="Edit employee"
                          >
                            <LuPencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingStaff(staff)}
                            className="rounded-lg border border-rose-200 bg-rose-50 p-1.5 text-rose-700 hover:bg-rose-100"
                            title="Delete employee"
                          >
                            <LuTrash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl sm:rounded-3xl border border-(--bgColor)/15 bg-(--mainColor) text-(--bgColor) p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-(--bgColor)/15 pb-3">
              <h3 className="font-bold text-base text-(--bgColor)">
                {editingStaff ? "Edit Employee" : "Add Team Member"}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-lg p-1 text-(--bgColor)/70 hover:bg-(--bgColor)/10 cursor-pointer"
              >
                <LuX className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-(--bgColor) mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Liam Davies"
                  className="w-full h-10 rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 px-3 text-xs text-(--bgColor) placeholder:text-(--bgColor)/40 outline-none focus:border-(--secondColor)"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-(--bgColor) mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  disabled={!!editingStaff}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="liam@coffeehouse.london"
                  className="w-full h-10 rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 px-3 text-xs text-(--bgColor) placeholder:text-(--bgColor)/40 outline-none focus:border-(--secondColor) disabled:opacity-60"
                />
                {editingStaff && (
                  <p className="mt-1 text-[11px] text-(--bgColor)/50">Email cannot be changed after account creation.</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-(--bgColor) mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+44 7700 900555"
                  className="w-full h-10 rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 px-3 text-xs text-(--bgColor) placeholder:text-(--bgColor)/40 outline-none focus:border-(--secondColor)"
                />
              </div>

              {/* Password field */}
              <div>
                <label className="block text-xs font-bold text-(--bgColor) mb-1">
                  {editingStaff ? "New Password (leave blank to keep current)" : "Password *"}
                </label>
                <div className="relative">
                  <LuLock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-(--bgColor)/50" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder={editingStaff ? "••••••••" : "Min. 8 characters"}
                    minLength={formData.password ? 8 : undefined}
                    className="w-full h-10 rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 pl-9 pr-10 text-xs text-(--bgColor) placeholder:text-(--bgColor)/40 outline-none focus:border-(--secondColor)"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-(--bgColor)/50 hover:text-(--bgColor) cursor-pointer"
                  >
                    {showPassword ? <LuEyeOff className="h-3.5 w-3.5" /> : <LuEye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              {/* Role Selection — owners can't be created from here */}
              <div>
                <label className="block text-xs font-bold text-(--bgColor) mb-1.5">
                  Select Role & Responsibilities
                </label>
                <div className="space-y-2">
                  {ROLE_OPTIONS.filter((o) => o.key !== "owner").map((opt) => (
                    <label
                      key={opt.key}
                      className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition ${
                        formData.roleKey === opt.key
                          ? "border-(--secondColor) bg-(--bgColor)/15 text-(--bgColor)"
                          : "border-(--bgColor)/15 bg-(--bgColor)/5 hover:bg-(--bgColor)/10 text-(--bgColor)/75"
                      }`}
                    >
                      <input
                        type="radio"
                        name="roleSelect"
                        checked={formData.roleKey === opt.key}
                        onChange={() =>
                          setFormData({
                            ...formData,
                            roleKey: opt.key,
                            role: opt.name,
                          })
                        }
                        className="mt-0.5 accent-(--secondColor)"
                      />
                      <div className="text-xs">
                        <span className="font-bold text-(--bgColor)">
                          {opt.name}
                        </span>
                        <p className="mt-0.5 text-[11px] text-(--bgColor)/65">
                          {opt.description}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 px-4 py-2 text-xs font-semibold text-(--bgColor) hover:bg-(--bgColor)/20 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-xl bg-(--secondColor) px-4 py-2 text-xs font-bold text-[#3B2418] hover:bg-(--secondColor)/90 transition cursor-pointer disabled:opacity-60"
                >
                  {isSaving ? "Saving..." : editingStaff ? "Update Employee" : "Add Employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl sm:rounded-3xl border border-(--bgColor)/15 bg-(--mainColor) text-(--bgColor) p-6 shadow-2xl">
            <div className="flex items-center gap-2.5 text-rose-400">
              <LuTriangleAlert className="h-5 w-5" />
              <h3 className="font-bold text-base text-(--bgColor)">
                Delete Employee Account
              </h3>
            </div>
            <p className="mt-2 text-xs text-(--bgColor)/75 leading-relaxed">
              Are you sure you want to remove <strong>&ldquo;{deletingStaff.name}&rdquo;</strong>? They will immediately lose access to the cafe dashboard.
            </p>
            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeletingStaff(null)}
                className="rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 px-4 py-2 text-xs font-semibold text-(--bgColor) hover:bg-(--bgColor)/20 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 transition cursor-pointer"
              >
                Remove User
              </button>
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
}
