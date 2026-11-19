"use client";

import React, { useState } from "react";
import {
  LuUserCheck,
  LuPlus,
  LuSearch,
  LuPencil,
  LuTrash2,
  LuShield,
  LuMail,
  LuPhone,
  LuCalendar,
  LuClock,
  LuX,
  LuTriangleAlert,
} from "react-icons/lu";
import { toast } from "react-toastify";
import DashboardPageHeader from "../components/DashboardPageHeader";
import { useDashboardStore } from "@/app/stores/useDashboardStore";

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
    createStaff,
    updateStaff,
    deleteStaff,
    toggleStaffStatus,
  } = useDashboardStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [deletingStaff, setDeletingStaff] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    roleKey: "barista",
    role: "Barista",
  });

  const handleOpenAddModal = () => {
    setEditingStaff(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      roleKey: "barista",
      role: "Barista",
    });
    setShowAddModal(true);
  };

  const handleOpenEditModal = (staff) => {
    setEditingStaff(staff);
    setFormData({
      name: staff.name,
      email: staff.email,
      phone: staff.phone || "",
      roleKey: staff.roleKey || "barista",
      role: staff.role || "Barista",
    });
    setShowAddModal(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error("Name and email are required.");
      return;
    }

    const selectedRole = ROLE_OPTIONS.find((r) => r.key === formData.roleKey);
    const roleName = selectedRole ? selectedRole.name : formData.role;

    if (editingStaff) {
      updateStaff(editingStaff.id, {
        ...formData,
        role: roleName,
      });
      toast.success(`Updated staff record for ${formData.name}.`);
    } else {
      createStaff({
        ...formData,
        role: roleName,
      });
      toast.success(`Employee ${formData.name} added!`);
    }

    setShowAddModal(false);
  };

  const handleDeleteConfirm = () => {
    if (!deletingStaff) return;
    deleteStaff(deletingStaff.id);
    toast.success(`Deleted employee ${deletingStaff.name}.`);
    setDeletingStaff(null);
  };

  const filteredStaff = staffMembers.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.role.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Users & Employees"
        description="Manage cafe team members, baristas, and dashboard access credentials."
        breadcrumbs={[{ label: "Users & Staff" }]}
        actions={
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 rounded-xl bg-(--mainColor) px-4 py-2 text-xs font-bold text-(--secondColor) shadow-sm hover:opacity-95"
          >
            <LuPlus className="h-4 w-4" />
            <span>Add Team Member</span>
          </button>
        }
      />

      {/* Search Toolbar */}
      <div className="flex items-center justify-between rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] p-4 shadow-2xs">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or role..."
            className="w-full h-10 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] pl-9 pr-3 text-xs text-(--mainColor) placeholder:text-(--mainColor)/40 outline-none focus:border-(--mainColor)"
          />
          <LuSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-(--mainColor)/50" />
        </div>

        <span className="text-xs text-(--mainColor)/60 font-semibold">
          {filteredStaff.length} Team Member{filteredStaff.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Staff Table */}
      <div className="overflow-hidden rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#ebdcc8] bg-[#f4ece0]/60 text-(--mainColor)/70 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Employee</th>
                <th className="px-5 py-3.5">Assigned Role</th>
                <th className="px-5 py-3.5">Joined Date</th>
                <th className="px-5 py-3.5">Last Active</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ebdcc8]">
              {filteredStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-[#f6efe4] transition">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={staff.avatar}
                        alt={staff.name}
                        className="h-9 w-9 rounded-full object-cover border border-[#decfa8]"
                      />
                      <div>
                        <div className="font-bold text-(--mainColor) text-sm">
                          {staff.name}
                        </div>
                        <div className="text-[11px] text-(--mainColor)/60">
                          {staff.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#dacdb9] bg-[#f5ecdd] px-2.5 py-1 text-xs font-semibold text-(--mainColor)">
                      <LuShield className="h-3.5 w-3.5 text-(--mainColor)/70" />
                      <span>{staff.role}</span>
                    </span>
                  </td>
                  <td className="px-5 py-4 text-(--mainColor)/75 font-medium">
                    {staff.joinedDate}
                  </td>
                  <td className="px-5 py-4 text-(--mainColor)/60">
                    {staff.lastActive}
                  </td>
                  <td className="px-5 py-4">
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
                      <span>{staff.status}</span>
                    </button>
                  </td>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-[#ebdcc8] bg-[#faf6ed] p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#ebdcc8] pb-3">
              <h3 className="font-bold text-base text-(--mainColor)">
                {editingStaff ? "Edit Employee" : "Add Team Member"}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-lg p-1 text-(--mainColor)/60 hover:bg-[#ebdcc8]"
              >
                <LuX className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-(--mainColor) mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Liam Davies"
                  className="w-full h-10 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none focus:border-(--mainColor)"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-(--mainColor) mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="liam@coffeehouse.london"
                  className="w-full h-10 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none focus:border-(--mainColor)"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-(--mainColor) mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+44 7700 900555"
                  className="w-full h-10 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none focus:border-(--mainColor)"
                />
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-xs font-bold text-(--mainColor) mb-1.5">
                  Select Role & Responsibilities
                </label>
                <div className="space-y-2">
                  {ROLE_OPTIONS.map((opt) => (
                    <label
                      key={opt.key}
                      className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition ${
                        formData.roleKey === opt.key
                          ? "border-(--mainColor) bg-[#f5ecdd]"
                          : "border-[#dacdb9] bg-white/60 hover:bg-white"
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
                        className="mt-0.5 text-(--mainColor)"
                      />
                      <div className="text-xs">
                        <span className="font-bold text-(--mainColor)">
                          {opt.name}
                        </span>
                        <p className="mt-0.5 text-[11px] text-(--mainColor)/65">
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
                  className="rounded-xl border border-[#dacdb9] bg-white px-4 py-2 text-xs font-semibold text-(--mainColor)"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-(--mainColor) px-4 py-2 text-xs font-bold text-(--secondColor)"
                >
                  {editingStaff ? "Update Employee" : "Add Employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl border border-[#ebdcc8] bg-[#faf6ed] p-6 shadow-xl">
            <div className="flex items-center gap-2.5 text-rose-700">
              <LuTriangleAlert className="h-5 w-5" />
              <h3 className="font-bold text-base text-(--mainColor)">
                Delete Employee Account
              </h3>
            </div>
            <p className="mt-2 text-xs text-(--mainColor)/75 leading-relaxed">
              Are you sure you want to remove <strong>&ldquo;{deletingStaff.name}&rdquo;</strong>? They will immediately lose access to the cafe dashboard.
            </p>
            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeletingStaff(null)}
                className="rounded-xl border border-[#dacdb9] bg-white px-4 py-2 text-xs font-semibold text-(--mainColor)"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="rounded-xl bg-rose-700 px-4 py-2 text-xs font-bold text-white hover:bg-rose-800"
              >
                Remove User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
