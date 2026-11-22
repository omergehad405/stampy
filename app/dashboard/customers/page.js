"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  LuUsers,
  LuSearch,
  LuFilter,
  LuArrowUpDown,
  LuMail,
  LuPhone,
  LuCalendar,
  LuCoffee,
  LuGift,
  LuStamp,
  LuCircleCheck,
  LuX,
  LuPencil,
  LuClock,
} from "react-icons/lu";
import { toast } from "react-toastify";
import DashboardPageHeader from "../components/DashboardPageHeader";
import { useDashboardStore } from "@/app/stores/useDashboardStore";

export default function DashboardCustomersPage() {
  const {
    customers,
    isLoadingCustomers,
    fetchCustomers,
    settings,
    updateCustomer,
    activities,
  } = useDashboardStore();

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'active' | 'inactive'
  const [sortBy, setSortBy] = useState("stamps"); // 'stamps' | 'name' | 'date' | 'visits'

  // Modal states
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Stamp adjustment state within customer details
  const [adjustAmount, setAdjustAmount] = useState(1);
  const [adjustReason, setAdjustReason] = useState("");

  // Filtered & sorted customers
  const filteredCustomers = useMemo(() => {
    return customers
      .filter((c) => {
        const matchesSearch =
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.phone?.includes(searchQuery);

        const matchesStatus =
          statusFilter === "all" || c.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "stamps") return b.stamps - a.stamps;
        if (sortBy === "visits") return b.totalVisits - a.totalVisits;
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "date") return new Date(b.registeredDate) - new Date(a.registeredDate);
        return 0;
      });
  }, [customers, searchQuery, statusFilter, sortBy]);

  // Handle Manual Stamp Adjustment
  const handleAdjustStamps = (type) => {
    if (!selectedCustomer) return;
    const delta = type === "add" ? adjustAmount : -adjustAmount;
    const newStamps = Math.max(
      0,
      Math.min(settings.stampTarget, selectedCustomer.stamps + delta)
    );

    updateCustomer(selectedCustomer.id, {
      stamps: newStamps,
      lifetimeStamps:
        type === "add"
          ? selectedCustomer.lifetimeStamps + adjustAmount
          : selectedCustomer.lifetimeStamps,
    });

    setSelectedCustomer((prev) => ({
      ...prev,
      stamps: newStamps,
    }));

    toast.success(
      `Adjusted stamps: ${type === "add" ? "+" : "-"}${adjustAmount} for ${selectedCustomer.name}`
    );
    setAdjustReason("");
  };

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Customer Directory"
        description="Search, view, and manage registered cafe loyalty members and their visit records."
        breadcrumbs={[{ label: "Customers" }]}
      />

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl sm:rounded-3xl border border-(--bgColor)/15 bg-(--mainColor) p-4 text-(--bgColor) shadow-sm">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or code (e.g. Omar, Notch-7842)..."
            className="w-full h-10 rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 pl-9 pr-3 text-xs text-(--bgColor) placeholder:text-(--bgColor)/40 outline-none focus:border-(--secondColor)"
          />
          <LuSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-(--bgColor)/50" />
        </div>

        {/* Filters & Sorting */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status filter */}
          <div className="flex items-center gap-1.5 text-xs text-(--bgColor)/75">
            <LuFilter className="h-3.5 w-3.5 text-(--secondColor)" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-(--bgColor)/20 bg-(--mainColor) px-2.5 py-1.5 text-xs font-semibold text-(--bgColor) outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Members</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 text-xs text-(--bgColor)/75">
            <LuArrowUpDown className="h-3.5 w-3.5 text-(--secondColor)" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-(--bgColor)/20 bg-(--mainColor) px-2.5 py-1.5 text-xs font-semibold text-(--bgColor) outline-none cursor-pointer"
            >
              <option value="stamps">Most Stamps</option>
              <option value="visits">Most Visits</option>
              <option value="name">Name (A-Z)</option>
              <option value="date">Newest Registered</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="overflow-hidden rounded-2xl sm:rounded-3xl border border-(--bgColor)/15 bg-(--mainColor) text-(--bgColor) shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-(--bgColor)/15 bg-(--bgColor)/10 text-(--bgColor)/80 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Customer</th>
                <th className="px-5 py-3.5">Member Code</th>
                <th className="px-5 py-3.5">Current Card</th>
                <th className="px-5 py-3.5">Total Visits</th>
                <th className="px-5 py-3.5">Rewards Claimed</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--bgColor)/15">
              {isLoadingCustomers ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-xs text-(--bgColor)/70">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-(--secondColor)/30 border-t-(--secondColor)" />
                      <span className="font-semibold">Loading enrolled customers...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredCustomers.length > 0 ? (
                filteredCustomers.map((cust) => (
                  <tr
                    key={cust.id}
                    onClick={() => setSelectedCustomer(cust)}
                    className="hover:bg-(--bgColor)/5 transition cursor-pointer"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={cust.avatar}
                          alt={cust.name}
                          className="h-9 w-9 rounded-full object-cover border border-(--bgColor)/20"
                        />
                        <div>
                          <div className="font-bold text-(--bgColor) text-sm">
                            {cust.name}
                          </div>
                          <div className="text-[11px] text-(--bgColor)/60">
                            {cust.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono font-semibold text-(--secondColor)">
                      {cust.code}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 font-bold text-sm text-(--bgColor)">
                          <LuCoffee className="h-4 w-4 text-(--secondColor)" />
                          <span>{cust.stamps}/{settings.stampTarget}</span>
                        </div>
                        {cust.stamps >= settings.stampTarget && (
                          <span className="rounded bg-purple-400/20 text-purple-200 border border-purple-400/30 px-1.5 py-0.5 text-[10px] font-bold">
                            Full Card
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 font-semibold text-(--mainColor)/80">
                      {cust.totalVisits} visits
                    </td>
                    <td className="px-5 py-4 font-semibold text-(--mainColor)/80">
                      {cust.rewardsRedeemedCount || 0} rewards
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${cust.status === "active"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-gray-200 text-gray-700"
                          }`}
                      >
                        {cust.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCustomer(cust);
                        }}
                        className="rounded-lg border border-[#dacdb9] bg-white/80 px-2.5 py-1 text-xs font-semibold text-(--mainColor) hover:bg-white cursor-pointer"
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-xs text-(--mainColor)/70">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <LuUsers className="h-8 w-8 text-(--mainColor)/40" />
                      <div className="font-bold text-sm text-(--mainColor)">
                        {searchQuery || statusFilter !== "all"
                          ? "No matching customers found"
                          : "No customers enrolled yet"}
                      </div>
                      <p className="max-w-xs text-(--mainColor)/60">
                        {searchQuery || statusFilter !== "all"
                          ? "Try clearing your search query or status filter to see all members."
                          : "Customers will appear here in real-time as soon as they join your cafe loyalty program!"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Drawer / Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-xs">
          <div className="h-full w-full max-w-lg overflow-y-auto border-l border-(--bgColor)/15 bg-(--mainColor) text-(--bgColor) p-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-(--bgColor)/15 pb-4">
              <div className="flex items-center gap-3.5">
                <img
                  src={selectedCustomer.avatar}
                  alt={selectedCustomer.name}
                  className="h-14 w-14 rounded-2xl object-cover border-2 border-(--bgColor)/20"
                />
                <div>
                  <h3 className="text-lg font-bold text-(--bgColor)">
                    {selectedCustomer.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-(--bgColor)/65">
                    <span className="font-mono text-(--secondColor)">{selectedCustomer.code}</span>
                    <span>•</span>
                    <span className="capitalize">{selectedCustomer.status}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="rounded-lg p-1.5 text-(--bgColor)/70 hover:bg-(--bgColor)/10 cursor-pointer"
              >
                <LuX className="h-5 w-5" />
              </button>
            </div>

            {/* Profile Information */}
            <div className="mt-5 space-y-4">
              <div className="rounded-xl border border-(--bgColor)/15 bg-(--bgColor)/10 p-4 text-xs space-y-2.5">
                <div className="flex items-center gap-2">
                  <LuMail className="h-4 w-4 text-(--secondColor)" />
                  <span className="font-semibold text-(--bgColor)">{selectedCustomer.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <LuPhone className="h-4 w-4 text-(--secondColor)" />
                  <span className="font-semibold text-(--bgColor)">{selectedCustomer.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <LuCalendar className="h-4 w-4 text-(--secondColor)" />
                  <span>Joined: <strong>{selectedCustomer.registeredDate}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <LuClock className="h-4 w-4 text-(--secondColor)" />
                  <span>Last Visit: <strong>{selectedCustomer.lastVisitDate || "None"}</strong></span>
                </div>
                {selectedCustomer.favoriteItem && (
                  <div className="pt-1 text-(--bgColor)/75 border-t border-(--bgColor)/15">
                    Favorite: <strong>{selectedCustomer.favoriteItem}</strong>
                  </div>
                )}
              </div>

              {/* Stamp Balance Card */}
              <div className="rounded-xl border border-(--bgColor)/15 bg-(--bgColor)/10 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-(--bgColor)/75">
                    Card Stamps
                  </span>
                  <span className="text-2xl font-black text-(--bgColor)">
                    {selectedCustomer.stamps} / {settings.stampTarget}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-5 gap-1.5">
                  {Array.from({ length: settings.stampTarget }).map((_, idx) => (
                    <div
                      key={idx}
                      className={`flex aspect-square items-center justify-center rounded-lg border text-xs font-bold ${idx < selectedCustomer.stamps
                        ? "border-(--secondColor) bg-(--secondColor) text-[#3B2418]"
                        : "border-(--bgColor)/20 bg-(--bgColor)/5 text-(--bgColor)/30"
                        }`}
                    >
                      <LuCoffee className="h-3.5 w-3.5" />
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex justify-between text-xs text-(--bgColor)/70">
                  <span>Lifetime Stamps: <strong>{selectedCustomer.lifetimeStamps}</strong></span>
                  <span>Rewards Claimed: <strong>{selectedCustomer.rewardsRedeemedCount || 0}</strong></span>
                </div>
              </div>

              {/* Manual Stamp Adjustment */}
              <div className="rounded-xl border border-(--bgColor)/15 bg-(--bgColor)/10 p-4 text-xs">
                <h4 className="font-bold text-(--bgColor) mb-1.5">
                  Manual Stamp Correction
                </h4>
                <p className="text-(--bgColor)/70 mb-3 text-[11px]">
                  Use when a stamp was missed or credited in error.
                </p>

                <div className="flex items-center gap-2 mb-3">
                  <select
                    value={adjustAmount}
                    onChange={(e) => setAdjustAmount(Number(e.target.value))}
                    className="h-8 rounded-lg border border-(--bgColor)/20 bg-(--mainColor) px-2 font-bold text-(--bgColor) outline-none"
                  >
                    <option value={1}>1 stamp</option>
                    <option value={2}>2 stamps</option>
                    <option value={3}>3 stamps</option>
                  </select>

                  <input
                    type="text"
                    value={adjustReason}
                    onChange={(e) => setAdjustReason(e.target.value)}
                    placeholder="Correction reason (optional)"
                    className="h-8 flex-1 rounded-lg border border-(--bgColor)/20 bg-(--bgColor)/10 px-2.5 text-(--bgColor) placeholder:text-(--bgColor)/40 outline-none focus:border-(--secondColor)"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleAdjustStamps("add")}
                    className="flex-1 rounded-lg bg-(--secondColor) py-1.5 font-bold text-[#3B2418] cursor-pointer hover:opacity-90 transition"
                  >
                    + Add Stamp
                  </button>
                  <button
                    onClick={() => handleAdjustStamps("remove")}
                    disabled={selectedCustomer.stamps <= 0}
                    className="flex-1 rounded-lg border border-rose-500/30 bg-rose-500/20 py-1.5 font-bold text-rose-200 disabled:opacity-40 cursor-pointer"
                  >
                    - Deduct Stamp
                  </button>
                </div>
              </div>

              {/* Customer Notes */}
              <div className="rounded-xl border border-(--bgColor)/15 bg-(--bgColor)/10 p-4 text-xs">
                <h4 className="font-bold text-(--bgColor) mb-1">Customer Notes</h4>
                <p className="text-(--bgColor)/75 italic">
                  {selectedCustomer.notes || "No notes added yet."}
                </p>
              </div>

              {/* Activity History for Customer */}
              <div className="rounded-xl border border-(--bgColor)/15 bg-(--bgColor)/10 p-4 text-xs">
                <h4 className="font-bold text-(--bgColor) mb-2">Recent Interactions</h4>
                <div className="space-y-2">
                  {activities
                    .filter((a) => a.customerId === selectedCustomer.id)
                    .slice(0, 4)
                    .map((act) => (
                      <div
                        key={act.id}
                        className="flex items-center justify-between rounded-lg bg-(--bgColor)/10 p-2 border border-(--bgColor)/15"
                      >
                        <div>
                          <div className="font-semibold text-(--bgColor)">{act.title}</div>
                          <div className="text-[10px] text-(--bgColor)/60">
                            {act.formattedDate} • {act.staffName}
                          </div>
                        </div>
                        <span
                          className={`font-bold ${act.stampsDelta > 0 ? "text-emerald-400" : "text-rose-400"
                            }`}
                        >
                          {act.stampsDelta > 0 ? `+${act.stampsDelta}` : act.stampsDelta}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
