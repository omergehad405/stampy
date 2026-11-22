"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  LuUsers,
  LuStamp,
  LuGift,
  LuActivity,
  LuQrCode,
  LuStore,
  LuArrowUpRight,
  LuCalendar,
  LuClock,
  LuCircleCheck,
  LuSparkles,
  LuLoader,
} from "react-icons/lu";
import DashboardPageHeader from "./components/DashboardPageHeader";
import DashboardMetricCard from "./components/DashboardMetricCard";
import { useDashboardStore } from "@/app/stores/useDashboardStore";
import { useDashboardAuthStore } from "@/app/stores/useDashboardAuthStore";

export default function DashboardOverviewPage() {
  const {
    customers,
    rewards,
    activities,
    cafe,
    fetchCustomers,
    fetchActivities,
    fetchRewards,
    fetchCafeProfile,
    isLoadingCustomers,
    isLoadingActivities,
  } = useDashboardStore();
  const { currentUser } = useDashboardAuthStore();

  // Load live data from server on initial mount
  useEffect(() => {
    fetchCustomers();
    fetchActivities();
    fetchRewards();
    fetchCafeProfile();
  }, [fetchCustomers, fetchActivities, fetchRewards, fetchCafeProfile]);

  // Calculate dynamic metrics
  const totalCustomers = customers.length || cafe.customerCount || 0;
  const activeCustomers = customers.filter((c) => c.status === "active").length;
  const totalStampsIssued =
    customers.length > 0
      ? customers.reduce((acc, c) => acc + (c.lifetimeStamps || c.stamps || 0), 0)
      : cafe.totalStampsIssued || 0;
  const totalRewardsRedeemed =
    customers.length > 0
      ? customers.reduce((acc, c) => acc + (c.rewardsRedeemedCount || 0), 0)
      : cafe.totalRewardsRedeemed || 0;

  // 7-day visit trend sample data for visualization
  const weeklyTrends = [
    { day: "Mon", visits: 28, stamps: 34 },
    { day: "Tue", visits: 35, stamps: 41 },
    { day: "Wed", visits: 42, stamps: 49 },
    { day: "Thu", visits: 39, stamps: 45 },
    { day: "Fri", visits: 62, stamps: 74 },
    { day: "Sat", visits: 78, stamps: 95 },
    { day: "Sun", visits: 54, stamps: 62 },
  ];
  const maxVisits = Math.max(...weeklyTrends.map((t) => t.visits));

  return (
    <div className="space-y-7">
      {/* Page Header */}
      <DashboardPageHeader
        title="Loyalty Overview"
        description={`Welcome back, ${currentUser?.name || "Staff Member"}. Here is what's happening with ${cafe.name || "your café"}'s loyalty program today.`}
        actions={
          <div className="flex items-center gap-2.5">
            <Link
              href="/dashboard/scan"
              className="flex items-center gap-2 rounded-xl bg-(--mainColor) px-4 py-2 text-xs font-bold text-(--secondColor) shadow-sm transition hover:opacity-95"
            >
              <LuQrCode className="h-4 w-4" />
              <span>Scan QR Code</span>
            </Link>
          </div>
        }
      />

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardMetricCard
          title="Total Customers"
          value={totalCustomers}
          change="+14% this month"
          changeType="positive"
          icon={LuUsers}
          subtitle={`${activeCustomers} active members visited recently`}
        />
        <DashboardMetricCard
          title="Stamps Issued"
          value={totalStampsIssued}
          change="+28 this week"
          changeType="positive"
          icon={LuStamp}
          subtitle="Cumulative stamps rewarded to date"
        />
        <DashboardMetricCard
          title="Rewards Redeemed"
          value={totalRewardsRedeemed}
          change="8.4% conversion"
          changeType="neutral"
          icon={LuGift}
          subtitle={`${rewards.filter((r) => r.isActive).length} active rewards in catalog`}
        />
        <DashboardMetricCard
          title="Active Rate"
          value={`${Math.round((activeCustomers / (totalCustomers || 1)) * 100)}%`}
          change="+5.2%"
          changeType="positive"
          icon={LuActivity}
          subtitle="Retention over the last 30 days"
        />
      </div>

      {/* Quick Action Banner */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Quick Action 1: QR Scan */}
        <Link
          href="/dashboard/scan"
          className="group relative flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl border border-(--bgColor)/15 bg-(--mainColor) p-5 text-(--bgColor) shadow-sm transition hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="rounded-lg bg-(--secondColor)/20 px-2.5 py-1 text-[11px] font-bold text-(--secondColor) uppercase">
              Fast Cashier Action
            </span>
            <LuQrCode className="h-6 w-6 text-(--secondColor) transition group-hover:scale-110" />
          </div>
          <div className="mt-4">
            <h3 className="text-base font-bold text-(--bgColor)">
              Scan Customer Visit
            </h3>
            <p className="mt-1 text-xs text-(--bgColor)/75">
              Open the barista scanner to scan customer QR codes and credit stamps instantly.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-(--secondColor)">
            <span>Launch Barista Scanner</span>
            <LuArrowUpRight className="h-4 w-4" />
          </div>
        </Link>

        {/* Quick Action 2: Manage Rewards */}
        <Link
          href="/dashboard/rewards"
          className="group flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-(--bgColor)/15 bg-(--mainColor) p-5 text-(--bgColor) shadow-sm transition hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="rounded-lg bg-(--secondColor)/20 px-2.5 py-1 text-[11px] font-bold text-(--secondColor) uppercase">
              Loyalty Catalog
            </span>
            <LuGift className="h-6 w-6 text-(--secondColor) transition group-hover:scale-110" />
          </div>
          <div className="mt-4">
            <h3 className="text-base font-bold text-(--bgColor)">
              Manage Rewards
            </h3>
            <p className="mt-1 text-xs text-(--bgColor)/75">
              Configure free drinks, artisan pastries, and stamp thresholds.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-(--secondColor)">
            <span>View & Edit Rewards</span>
            <LuArrowUpRight className="h-4 w-4" />
          </div>
        </Link>

        {/* Quick Action 3: Edit Cafe Profile */}
        <Link
          href="/dashboard/profile"
          className="group flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-(--bgColor)/15 bg-(--mainColor) p-5 text-(--bgColor) shadow-sm transition hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="rounded-lg bg-emerald-400/20 px-2.5 py-1 text-[11px] font-bold text-emerald-200 uppercase">
              Customer Storefront
            </span>
            <LuStore className="h-6 w-6 text-(--secondColor) transition group-hover:scale-110" />
          </div>
          <div className="mt-4">
            <h3 className="text-base font-bold text-(--bgColor)">
              Update Cafe Profile
            </h3>
            <p className="mt-1 text-xs text-(--bgColor)/75">
              Update opening hours, story, menu highlights, and social links.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-(--secondColor)">
            <span>Open Profile Editor</span>
            <LuArrowUpRight className="h-4 w-4" />
          </div>
        </Link>
      </div>

      {/* Recent Activity Table */}
      <div className="rounded-2xl sm:rounded-3xl border border-(--bgColor)/15 bg-(--mainColor) text-(--bgColor) shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-(--bgColor)/15 px-5 py-4">
          <div>
            <h3 className="font-bold text-sm text-(--bgColor)">
              Recent Counter Activity
            </h3>
            <p className="text-xs text-(--bgColor)/60">
              Live log of visits, stamps issued, and rewards redeemed
            </p>
          </div>
          <Link
            href="/dashboard/activity"
            className="flex items-center gap-1 text-xs font-bold text-(--secondColor) hover:underline"
          >
            <span>View Full History</span>
            <LuArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {isLoadingActivities && activities.length === 0 ? (
          <div className="flex items-center justify-center py-10 text-xs text-(--bgColor)/70">
            <LuLoader className="h-4 w-4 animate-spin text-(--secondColor) mr-2" />
            <span>Loading live counter activity from server...</span>
          </div>
        ) : activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center text-xs text-(--bgColor)/60">
            <LuActivity className="h-7 w-7 mb-2 text-(--bgColor)/30" />
            <span className="font-bold text-(--bgColor)/80">No counter activity recorded yet</span>
            <span className="text-[11px] text-(--bgColor)/50 mt-0.5 max-w-sm">
              Visits and stamp redemptions confirmed by baristas will appear here immediately.
            </span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-(--bgColor)/15 bg-(--bgColor)/10 text-(--bgColor)/80 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Activity</th>
                  <th className="px-5 py-3">Points Delta</th>
                  <th className="px-5 py-3">Confirmed By</th>
                  <th className="px-5 py-3">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-(--bgColor)/15">
                {activities.slice(0, 5).map((act) => (
                  <tr key={act.id} className="hover:bg-(--bgColor)/5 transition">
                    <td className="px-5 py-3.5 font-bold text-(--bgColor)">
                      {act.customerName}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-semibold text-[11px] ${act.type === "redemption"
                          ? "bg-purple-400/20 text-purple-200 border border-purple-400/30"
                          : act.type === "join"
                            ? "bg-blue-400/20 text-blue-200 border border-blue-400/30"
                            : "bg-emerald-400/20 text-emerald-200 border border-emerald-400/30"
                          }`}
                      >
                        {act.title}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-bold">
                      <span
                        className={
                          act.stampsDelta > 0
                            ? "text-emerald-400"
                            : act.stampsDelta < 0
                              ? "text-rose-400"
                              : "text-(--bgColor)"
                        }
                      >
                        {act.stampsDelta > 0 ? `+${act.stampsDelta}` : act.stampsDelta}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-(--bgColor)/75 font-medium">
                      {act.staffName}
                    </td>
                    <td className="px-5 py-3.5 text-(--bgColor)/60">
                      {act.formattedDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
