"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  LuSearch,
  LuFilter,
  LuStamp,
  LuGift,
  LuStore,
  LuClock,
  LuChevronLeft,
  LuChevronRight,
  LuArrowUpRight,
  LuCoffee,
} from "react-icons/lu";
import AdminPageHeader from "../components/AdminPageHeader";
import AdminMetricCard from "../components/AdminMetricCard";
import { useAdminStore } from "@/app/stores/useAdminStore";

export default function AdminRewardsActivityPage() {
  const { activities, cafes } = useAdminStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [cafeFilter, setCafeFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Filter activities
  const filteredActivities = useMemo(() => {
    let result = [...activities];

    // Customer / Note Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.customerName?.toLowerCase().includes(q) ||
          a.staffName?.toLowerCase().includes(q) ||
          a.note?.toLowerCase().includes(q) ||
          a.title?.toLowerCase().includes(q)
      );
    }

    // Cafe Filter
    if (cafeFilter !== "all") {
      result = result.filter((a) => a.cafeSlug === cafeFilter || a.cafeName === cafeFilter);
    }

    // Type Filter
    if (typeFilter !== "all") {
      result = result.filter((a) => a.type === typeFilter);
    }

    // Date Filter
    if (dateFilter !== "all") {
      const now = new Date();
      const cutoffDays = dateFilter === "7days" ? 7 : dateFilter === "30days" ? 30 : 90;
      const cutoffTime = now.getTime() - cutoffDays * 24 * 60 * 60 * 1000;
      result = result.filter((a) => {
        if (!a.timestamp) return true;
        return new Date(a.timestamp).getTime() >= cutoffTime;
      });
    }

    // Sort by timestamp desc
    result.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));

    return result;
  }, [activities, searchQuery, cafeFilter, typeFilter, dateFilter]);

  // Aggregate Stats
  const totalStampsIssued = activities
    .filter((a) => a.type === "stamp")
    .reduce((acc, a) => acc + (a.stampsDelta || 0), 0);

  const totalRedemptions = activities.filter((a) => a.type === "redemption").length;

  const totalJoins = activities.filter((a) => a.type === "join").length;

  // Cafe Activity Breakdown
  const cafeActivityBreakdown = useMemo(() => {
    const map = {};
    activities.forEach((act) => {
      const name = act.cafeName || "Coffee House";
      if (!map[name]) {
        map[name] = { stamps: 0, redemptions: 0, joins: 0, total: 0 };
      }
      map[name].total += 1;
      if (act.type === "stamp") map[name].stamps += act.stampsDelta || 1;
      if (act.type === "redemption") map[name].redemptions += 1;
      if (act.type === "join") map[name].joins += 1;
    });
    return Object.entries(map).map(([name, data]) => ({ name, ...data }));
  }, [activities]);

  // Pagination
  const totalPages = Math.ceil(filteredActivities.length / pageSize) || 1;
  const paginatedActivities = filteredActivities.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <AdminPageHeader
        title="Rewards & Activity"
        description="Comprehensive audit of all stamps rewarded, rewards redeemed, and loyalty transactions across Stampy."
        breadcrumbs={[{ label: "Rewards & Activity" }]}
      />

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminMetricCard
          title="Stamps Credited"
          value={totalStampsIssued}
          change="+28 this week"
          changeType="positive"
          icon={LuStamp}
          subtitle="Net stamps granted to customers"
        />
        <AdminMetricCard
          title="Rewards Claimed"
          value={totalRedemptions}
          change="8.4% conversion"
          changeType="neutral"
          icon={LuGift}
          subtitle="Total verified reward vouchers"
        />
        <AdminMetricCard
          title="Customer Joins"
          value={totalJoins}
          change="+12 this month"
          changeType="positive"
          icon={LuStore}
          subtitle="New cafe program enrollments"
        />
        <AdminMetricCard
          title="Total Transactions"
          value={activities.length}
          change="Audit Logged"
          changeType="positive"
          icon={LuClock}
          subtitle="All platform loyalty events"
        />
      </div>

      {/* Activity by Cafe Summary Grid */}
      <div className="rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] p-5 shadow-2xs">
        <h3 className="font-bold text-sm text-(--mainColor) border-b border-[#ebdcc8] pb-3">
          Activity Grouped by Cafe
        </h3>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {cafeActivityBreakdown.map((item) => (
            <div
              key={item.name}
              className="rounded-xl border border-[#ebdcc8] bg-[#f5ecdd] p-4 flex flex-col justify-between"
            >
              <div>
                <span className="font-bold text-sm text-(--mainColor) block">{item.name}</span>
                <span className="text-[11px] text-(--mainColor)/60">{item.total} total logged events</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-[#dacdb9]">
                <div>
                  <span className="font-bold text-emerald-800 block">+{item.stamps}</span>
                  <span className="text-[10px] text-(--mainColor)/60">Stamps</span>
                </div>
                <div>
                  <span className="font-bold text-purple-800 block">{item.redemptions}</span>
                  <span className="text-[10px] text-(--mainColor)/60">Redemptions</span>
                </div>
                <div>
                  <span className="font-bold text-blue-800 block">{item.joins}</span>
                  <span className="text-[10px] text-(--mainColor)/60">Joins</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters Bar */}
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
              placeholder="Search customer, staff, notes..."
              className="w-full h-10 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] pl-9 pr-3 text-xs text-(--mainColor) placeholder:text-(--mainColor)/40 outline-none focus:border-(--mainColor)"
            />
          </div>

          {/* Filter by Cafe */}
          <div className="relative">
            <select
              value={cafeFilter}
              onChange={(e) => {
                setCafeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-10 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none focus:border-(--mainColor)"
            >
              <option value="all">All Participating Cafes</option>
              {cafes.map((c) => (
                <option key={c.id} value={c.slug || c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filter by Activity Type */}
          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-10 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none focus:border-(--mainColor)"
            >
              <option value="all">All Event Types</option>
              <option value="stamp">Stamps Issued</option>
              <option value="redemption">Reward Redemptions</option>
              <option value="join">New Cafe Joins</option>
            </select>
          </div>

          {/* Filter by Date Range */}
          <div className="relative">
            <select
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-10 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none focus:border-(--mainColor)"
            >
              <option value="all">All Time</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Activity Table */}
      <div className="rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#ebdcc8] bg-[#f4ece0]/60 text-(--mainColor)/70 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Customer</th>
                <th className="px-5 py-3.5">Activity Event</th>
                <th className="px-5 py-3.5">Points Delta</th>
                <th className="px-5 py-3.5">Cafe</th>
                <th className="px-5 py-3.5">Staff / Source</th>
                <th className="px-5 py-3.5">Notes</th>
                <th className="px-5 py-3.5 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ebdcc8]">
              {paginatedActivities.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-(--mainColor)/60">
                    No activity records found matching filters.
                  </td>
                </tr>
              ) : (
                paginatedActivities.map((act) => (
                  <tr key={act.id} className="hover:bg-[#f6efe4] transition">
                    <td className="px-5 py-3.5 font-bold text-(--mainColor)">
                      {act.customerName}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-semibold text-[11px] ${
                          act.type === "redemption"
                            ? "bg-purple-100 text-purple-800"
                            : act.type === "join"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {act.title}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-bold">
                      <span
                        className={
                          act.stampsDelta > 0
                            ? "text-emerald-700"
                            : act.stampsDelta < 0
                            ? "text-rose-700"
                            : "text-(--mainColor)"
                        }
                      >
                        {act.stampsDelta > 0 ? `+${act.stampsDelta}` : act.stampsDelta}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-(--mainColor)">
                      {act.cafeName || "Coffee House"}
                    </td>
                    <td className="px-5 py-3.5 text-(--mainColor)/70">
                      {act.staffName || "Staff"}
                    </td>
                    <td className="px-5 py-3.5 text-(--mainColor)/60 max-w-[200px] truncate">
                      {act.note || "—"}
                    </td>
                    <td className="px-5 py-3.5 text-(--mainColor)/60 text-right whitespace-nowrap">
                      {act.formattedDate || new Date(act.timestamp).toLocaleDateString()}
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
            Showing {filteredActivities.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, filteredActivities.length)} of {filteredActivities.length} events
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
    </div>
  );
}
