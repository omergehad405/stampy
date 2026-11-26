"use client";

import React, { useState, useMemo, useEffect } from "react";
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
import PlanLockedFeature from "../components/PlanLockedFeature";
import { useDashboardStore } from "@/app/stores/useDashboardStore";

export default function DashboardActivityPage() {
  const { activities, fetchActivities, isLoadingActivities, hasFeature } = useDashboardStore();

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all"); // 'all' | 'stamp' | 'redemption' | 'join'
  const [staffFilter, setStaffFilter] = useState("all");

  const isFeatureAllowed = hasFeature ? hasFeature("activity_history") : true;

  const handleRefresh = async () => {
    const result = await fetchActivities();
    if (!result.success) {
      toast.error(result.error || "Unable to refresh activity history.");
    } else {
      toast.success("Activity history refreshed.");
    }
  };

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
    link.setAttribute("download", `Notch_activity_export_${Date.now()}.csv`);
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
        onRefresh={handleRefresh}
        isRefreshing={isLoadingActivities}
        actions={
          isFeatureAllowed ? (
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 rounded-xl bg-(--secondColor) px-4 py-2 text-xs font-bold text-[#3B2418] shadow-xs hover:opacity-95 cursor-pointer"
            >
              <LuDownload className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
          ) : null
        }
      />

      {!isFeatureAllowed ? (
        <PlanLockedFeature
          featureKey="activity_history"
          featureName="Activity History Page"
          description="The detailed Activity History log is not included in your current subscription plan. Upgrade your plan to view complete stamp records, redemptions, staff audits, and export CSV reports."
        />
      ) : (
        <>
          {/* Toolbar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl sm:rounded-3xl border border-(--bgColor)/15 bg-(--mainColor) p-4 text-(--bgColor) shadow-sm">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by customer name or note..."
                className="w-full h-10 rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 pl-9 pr-3 text-xs text-(--bgColor) placeholder:text-(--bgColor)/40 outline-none focus:border-(--secondColor)"
              />
              <LuSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-(--bgColor)/50" />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Type filter */}
              <div className="flex items-center gap-1.5 text-xs text-(--bgColor)/75">
                <LuFilter className="h-3.5 w-3.5 text-(--secondColor)" />
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="rounded-lg border border-(--bgColor)/20 bg-(--mainColor) px-2.5 py-1.5 text-xs font-semibold text-(--bgColor) outline-none cursor-pointer"
                >
                  <option value="all">All Activities</option>
                  <option value="stamp">Stamps Issued</option>
                  <option value="redemption">Rewards Redeemed</option>
                  <option value="join">New Customers</option>
                </select>
              </div>

              {/* Staff filter */}
              <div className="flex items-center gap-1.5 text-xs text-(--bgColor)/75">
                <select
                  value={staffFilter}
                  onChange={(e) => setStaffFilter(e.target.value)}
                  className="rounded-lg border border-(--bgColor)/20 bg-(--mainColor) px-2.5 py-1.5 text-xs font-semibold text-(--bgColor) outline-none cursor-pointer"
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
          <div className="overflow-hidden rounded-2xl sm:rounded-3xl border border-(--bgColor)/15 bg-(--mainColor) text-(--bgColor) shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-(--bgColor)/15 bg-(--bgColor)/10 text-(--bgColor)/80 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5">Time</th>
                    <th className="px-5 py-3.5">Customer</th>
                    <th className="px-5 py-3.5">Activity</th>
                    <th className="px-5 py-3.5">Points / Delta</th>
                    <th className="px-5 py-3.5">Recorded By</th>
                    <th className="px-5 py-3.5">Transaction Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-(--bgColor)/15">
                  {isLoadingActivities ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-xs text-(--bgColor)/60">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="h-6 w-6 animate-spin rounded-full border-2 border-(--secondColor)/30 border-t-(--secondColor)" />
                          <span>Loading live activity history from server...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredActivities.length > 0 ? (
                    filteredActivities.map((act) => (
                      <tr key={act.id} className="hover:bg-(--bgColor)/5 transition">
                        <td className="px-5 py-4 whitespace-nowrap text-(--bgColor)/60 font-medium">
                          {act.formattedDate}
                        </td>
                        <td className="px-5 py-4 font-bold text-(--bgColor) whitespace-nowrap">
                          {act.customerName}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 font-semibold text-[11px] ${act.type === "redemption"
                              ? "bg-purple-400/20 text-purple-200 border border-purple-400/30"
                              : act.type === "join"
                                ? "bg-blue-400/20 text-blue-200 border border-blue-400/30"
                                : "bg-emerald-400/20 text-emerald-200 border border-emerald-400/30"
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
                                ? "text-emerald-400"
                                : act.stampsDelta < 0
                                  ? "text-rose-400"
                                  : "text-(--bgColor)"
                            }
                          >
                            {act.stampsDelta > 0 ? `+${act.stampsDelta}` : act.stampsDelta}{" "}
                            {Math.abs(act.stampsDelta) === 1 ? "stamp" : "stamps"}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-(--bgColor)/80 font-medium whitespace-nowrap">
                          {act.staffName}
                        </td>
                        <td className="px-5 py-4 text-(--bgColor)/70 max-w-xs truncate">
                          {act.note || "—"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-xs text-(--bgColor)/60">
                        No activity found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
