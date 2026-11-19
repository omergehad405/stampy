"use client";

import React, { useState, useMemo } from "react";
import {
  LuHistory,
  LuSearch,
  LuFilter,
  LuDownload,
  LuStamp,
  LuGift,
  LuUserCheck,
  LuCalendar,
  LuClock,
} from "react-icons/lu";
import { toast } from "react-toastify";
import DashboardPageHeader from "../components/DashboardPageHeader";
import { useDashboardStore } from "@/app/stores/useDashboardStore";

export default function DashboardActivityPage() {
  const { activities } = useDashboardStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all"); // 'all' | 'stamp' | 'redemption' | 'join'
  const [staffFilter, setStaffFilter] = useState("all");

  // Extract unique staff names from activity log
  const uniqueStaff = useMemo(() => {
    const set = new Set(activities.map((a) => a.staffName).filter(Boolean));
    return Array.from(set);
  }, [activities]);

  // Filter activities
  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        act.customerName.toLowerCase().includes(q) ||
        act.title.toLowerCase().includes(q) ||
        (act.note && act.note.toLowerCase().includes(q));

      const matchesType = typeFilter === "all" || act.type === typeFilter;
      const matchesStaff = staffFilter === "all" || act.staffName === staffFilter;

      return matchesSearch && matchesType && matchesStaff;
    });
  }, [activities, searchQuery, typeFilter, staffFilter]);

  // CSV Export
  const handleExportCSV = () => {
    const headers = ["Timestamp", "Customer", "Activity", "Delta", "Staff", "Note"];
    const rows = filteredActivities.map((a) => [
      a.formattedDate,
      `"${a.customerName}"`,
      `"${a.title}"`,
      a.stampsDelta,
      `"${a.staffName}"`,
      `"${a.note || ""}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `stampy_activity_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Activity log exported to CSV.");
  };

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Activity & Transaction Log"
        description="Comprehensive audit trail of stamps credited, rewards redeemed, and customer visits at your counters."
        breadcrumbs={[{ label: "Activity History" }]}
        actions={
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-4 py-2 text-xs font-bold text-(--mainColor) hover:bg-white"
          >
            <LuDownload className="h-4 w-4" />
            <span>Export CSV</span>
          </button>
        }
      />

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] p-4 shadow-2xs">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name or note..."
            className="w-full h-10 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] pl-9 pr-3 text-xs text-(--mainColor) placeholder:text-(--mainColor)/40 outline-none focus:border-(--mainColor)"
          />
          <LuSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-(--mainColor)/50" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Type filter */}
          <div className="flex items-center gap-1.5 text-xs text-(--mainColor)/70">
            <LuFilter className="h-3.5 w-3.5" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-lg border border-[#dacdb9] bg-[#f5ecdd] px-2.5 py-1.5 text-xs font-semibold text-(--mainColor) outline-none"
            >
              <option value="all">All Activities</option>
              <option value="stamp">Stamps Issued</option>
              <option value="redemption">Rewards Redeemed</option>
              <option value="join">New Customers</option>
            </select>
          </div>

          {/* Staff filter */}
          <div className="flex items-center gap-1.5 text-xs text-(--mainColor)/70">
            <select
              value={staffFilter}
              onChange={(e) => setStaffFilter(e.target.value)}
              className="rounded-lg border border-[#dacdb9] bg-[#f5ecdd] px-2.5 py-1.5 text-xs font-semibold text-(--mainColor) outline-none"
            >
              <option value="all">All Staff Members</option>
              {uniqueStaff.map((staff) => (
                <option key={staff} value={staff}>
                  {staff}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Activity Log Table */}
      <div className="overflow-hidden rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#ebdcc8] bg-[#f4ece0]/60 text-(--mainColor)/70 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Time</th>
                <th className="px-5 py-3.5">Customer</th>
                <th className="px-5 py-3.5">Activity</th>
                <th className="px-5 py-3.5">Points / Delta</th>
                <th className="px-5 py-3.5">Recorded By</th>
                <th className="px-5 py-3.5">Transaction Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ebdcc8]">
              {filteredActivities.length > 0 ? (
                filteredActivities.map((act) => (
                  <tr key={act.id} className="hover:bg-[#f6efe4] transition">
                    <td className="px-5 py-4 whitespace-nowrap text-(--mainColor)/60 font-medium">
                      {act.formattedDate}
                    </td>
                    <td className="px-5 py-4 font-bold text-(--mainColor) whitespace-nowrap">
                      {act.customerName}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 font-semibold text-[11px] ${
                          act.type === "redemption"
                            ? "bg-purple-100 text-purple-800"
                            : act.type === "join"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {act.type === "redemption" ? (
                          <LuGift className="h-3.5 w-3.5" />
                        ) : (
                          <LuStamp className="h-3.5 w-3.5" />
                        )}
                        <span>{act.title}</span>
                      </span>
                    </td>
                    <td className="px-5 py-4 font-bold whitespace-nowrap">
                      <span
                        className={
                          act.stampsDelta > 0
                            ? "text-emerald-700"
                            : act.stampsDelta < 0
                            ? "text-rose-700"
                            : "text-(--mainColor)"
                        }
                      >
                        {act.stampsDelta > 0 ? `+${act.stampsDelta}` : act.stampsDelta}{" "}
                        {Math.abs(act.stampsDelta) === 1 ? "stamp" : "stamps"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-(--mainColor)/80 font-medium whitespace-nowrap">
                      {act.staffName}
                    </td>
                    <td className="px-5 py-4 text-(--mainColor)/70 max-w-xs truncate">
                      {act.note || "—"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-(--mainColor)/60">
                    No activity found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
