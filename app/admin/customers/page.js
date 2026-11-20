"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  LuSearch,
  LuUsers,
  LuEye,
  LuBan,
  LuCircleCheck,
  LuChevronLeft,
  LuChevronRight,
  LuCoffee,
  LuStamp,
  LuLoader,
} from "react-icons/lu";
import { toast } from "react-toastify";
import AdminPageHeader from "../components/AdminPageHeader";
import AdminBadge from "../components/AdminBadge";
import ConfirmModal from "../components/ConfirmModal";
import { useAdminStore } from "@/app/stores/useAdminStore";

export default function AdminCustomersPage() {
  const { customers, updateCustomerStatus, fetchCustomers, isLoadingCustomers } = useAdminStore();

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Confirm Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    customerId: null,
    customerName: "",
    newStatus: "",
    variant: "danger",
    title: "",
    description: "",
  });

  // Filter and sort
  const filteredCustomers = useMemo(() => {
    let result = [...customers];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          (c.phone && c.phone.toLowerCase().includes(q)) ||
          (c.code && c.code.toLowerCase().includes(q))
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((c) => c.status === statusFilter);
    }

    result.sort((a, b) => {
      if (sortBy === "date-desc") {
        return new Date(b.registeredDate || 0) - new Date(a.registeredDate || 0);
      }
      if (sortBy === "date-asc") {
        return new Date(a.registeredDate || 0) - new Date(b.registeredDate || 0);
      }
      if (sortBy === "stamps-desc") {
        return (b.totalLifetimeStamps || b.lifetimeStamps || 0) - (a.totalLifetimeStamps || a.lifetimeStamps || 0);
      }
      if (sortBy === "name-asc") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    return result;
  }, [customers, searchQuery, statusFilter, sortBy]);

  const totalPages = Math.ceil(filteredCustomers.length / pageSize) || 1;
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleOpenStatusModal = (customer, targetStatus) => {
    const isSuspending = targetStatus === "suspended";
    setConfirmModal({
      isOpen: true,
      customerId: customer.id,
      customerName: customer.name,
      newStatus: targetStatus,
      variant: isSuspending ? "danger" : "primary",
      title: isSuspending ? `Suspend ${customer.name}?` : `Reactivate ${customer.name}?`,
      description: isSuspending
        ? `Suspending ${customer.name}'s account will disable their QR loyalty card and prevent them from collecting or redeeming stamps.`
        : `Reactivating ${customer.name}'s account will restore their access to all joined cafe programs.`,
    });
  };

  const handleConfirmStatusChange = async () => {
    const res = await updateCustomerStatus(confirmModal.customerId, confirmModal.newStatus);
    if (res.success) {
      toast.success(`Customer status updated to ${confirmModal.newStatus}`);
    } else {
      toast.error(res.error || "Update failed");
    }
    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <AdminPageHeader
        title="Customer Management"
        description="View, search, and manage registered loyalty patrons across all participating cafes."
        breadcrumbs={[{ label: "Customers" }]}
      />

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] p-4 shadow-2xs">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {/* Search */}
          <div className="relative sm:col-span-1">
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
              placeholder="Search by name, email, or phone..."
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
              <option value="suspended">Suspended</option>
              <option value="inactive">Inactive</option>
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
              <option value="stamps-desc">Most Lifetime Stamps</option>
              <option value="name-asc">Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#ebdcc8] bg-[#f4ece0]/60 text-(--mainColor)/70 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Customer</th>
                <th className="px-5 py-3.5">Phone</th>
                <th className="px-5 py-3.5">Registered</th>
                <th className="px-5 py-3.5">Joined Cafes</th>
                <th className="px-5 py-3.5">Total Stamps</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ebdcc8]">
              {isLoadingCustomers && customers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-(--mainColor)/60">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <LuLoader className="h-6 w-6 animate-spin text-(--mainColor)" />
                      <span className="text-xs font-semibold">Loading customers from database...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-(--mainColor)/60">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <LuUsers className="h-8 w-8 text-(--mainColor)/30" />
                      <p className="font-semibold text-xs text-(--mainColor)/80">No customers found</p>
                      <p className="text-[11px] text-(--mainColor)/50">
                        {searchQuery || statusFilter !== "all"
                          ? "No customers match your current search or filter criteria."
                          : "No registered customers yet."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-[#f6efe4] transition">
                    {/* Customer */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            c.avatar ||
                            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"
                          }
                          alt={c.name}
                          className="h-9 w-9 rounded-full object-cover border border-[#dacdb9]"
                        />
                        <div className="min-w-0">
                          <Link
                            href={`/admin/customers/${c.id}`}
                            className="font-bold text-(--mainColor) hover:underline block truncate max-w-[160px]"
                          >
                            {c.name}
                          </Link>
                          <span className="text-[11px] text-(--mainColor)/60 block truncate max-w-[160px]">
                            {c.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="px-5 py-3.5 text-(--mainColor)/80">
                      {c.phone || "—"}
                    </td>

                    {/* Registration Date */}
                    <td className="px-5 py-3.5 text-(--mainColor)/80">
                      {c.registeredDate || "N/A"}
                    </td>

                    {/* Joined Cafes */}
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1 rounded-md bg-(--secondColor)/30 px-2 py-0.5 text-[11px] font-bold text-(--mainColor)">
                        <LuCoffee className="h-3 w-3" />
                        <span>{c.joinedCafesCount || (c.joinedCafes?.length) || 1} Cafes</span>
                      </span>
                    </td>

                    {/* Stamps */}
                    <td className="px-5 py-3.5">
                      <div className="text-[11px]">
                        <span className="font-bold text-(--mainColor)">
                          {c.totalLifetimeStamps || c.lifetimeStamps || c.stamps || 0} lifetime
                        </span>
                        <span className="text-(--mainColor)/60 block">
                          {c.totalVisits || 1} total visits
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5">
                      <AdminBadge status={c.status} />
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/customers/${c.id}`}
                          className="rounded-lg p-1.5 text-(--mainColor)/70 hover:bg-[#ebdcc8] hover:text-(--mainColor) transition"
                          title="View Customer Details"
                        >
                          <LuEye className="h-4 w-4" />
                        </Link>

                        {c.status === "active" ? (
                          <button
                            onClick={() => handleOpenStatusModal(c, "suspended")}
                            className="rounded-lg p-1.5 text-rose-700 hover:bg-rose-100 transition"
                            title="Suspend Customer"
                          >
                            <LuBan className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleOpenStatusModal(c, "active")}
                            className="rounded-lg p-1.5 text-emerald-700 hover:bg-emerald-100 transition"
                            title="Reactivate Customer"
                          >
                            <LuCircleCheck className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-[#ebdcc8] px-5 py-3 text-xs text-(--mainColor)/70">
          <span>
            Showing {filteredCustomers.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, filteredCustomers.length)} of {filteredCustomers.length} customers
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
        confirmLabel={confirmModal.newStatus === "suspended" ? "Suspend Account" : "Reactivate"}
        confirmVariant={confirmModal.variant}
        onConfirm={handleConfirmStatusChange}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
