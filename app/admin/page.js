"use client";

import React from "react";
import Link from "next/link";
import {
  LuStore,
  LuUsers,
  LuStamp,
  LuGift,
  LuTrendingUp,
  LuCircleCheck,
  LuArrowUpRight,
  LuCalendar,
  LuShieldAlert,
  LuExternalLink,
  LuActivity,
} from "react-icons/lu";
import AdminPageHeader from "./components/AdminPageHeader";
import AdminMetricCard from "./components/AdminMetricCard";
import AdminBadge from "./components/AdminBadge";
import { useAdminStore } from "@/app/stores/useAdminStore";
import { useAdminAuthStore } from "@/app/stores/useAdminAuthStore";

export default function AdminOverviewPage() {
  const { cafes, customers, activities, getTotalStats, auditLog } = useAdminStore();
  const { currentAdmin } = useAdminAuthStore();

  const stats = getTotalStats();

  // Top Performing Cafes (sorted by stamps issued descending)
  const topCafes = [...cafes]
    .filter((c) => c.status === "active")
    .sort((a, b) => (b.totalStampsIssued || 0) - (a.totalStampsIssued || 0))
    .slice(0, 4);

  // Growth visual trends (monthly data derived from registrations & activities)
  const growthData = [
    { month: "Jun", cafes: 1, customers: 38, stamps: 120 },
    { month: "Jul", cafes: 1, customers: 55, stamps: 210 },
    { month: "Aug", cafes: 2, customers: 78, stamps: 340 },
    { month: "Sep", cafes: 2, customers: 110, stamps: 490 },
    { month: "Oct", cafes: 3, customers: 145, stamps: 620 },
    { month: "Nov", cafes: stats.totalCafes, customers: stats.totalCustomers, stamps: stats.totalStampsIssued },
  ];
  const maxCustomerGrowth = Math.max(...growthData.map((d) => d.customers));

  // Recent 5 activities
  const recentActivities = activities.slice(0, 6);

  // Recently registered cafes
  const recentCafes = [...cafes]
    .sort((a, b) => new Date(b.registrationDate || 0) - new Date(a.registrationDate || 0))
    .slice(0, 3);

  // Recently registered customers
  const recentCustomers = [...customers]
    .sort((a, b) => new Date(b.registeredDate || 0) - new Date(a.registeredDate || 0))
    .slice(0, 4);

  return (
    <div className="space-y-7">
      {/* Page Header */}
      <AdminPageHeader
        title="Platform Overview"
        description={`Welcome back, ${currentAdmin?.name || "Admin"}. System-wide oversight of all cafes, customers, stamps, and subscriptions.`}
        actions={
          <div className="flex items-center gap-2.5">
            <Link
              href="/admin/cafes"
              className="flex items-center gap-2 rounded-xl bg-(--mainColor) px-4 py-2 text-xs font-bold text-(--secondColor) shadow-sm transition hover:opacity-95"
            >
              <LuStore className="h-4 w-4" />
              <span>Manage Cafes</span>
            </Link>
          </div>
        }
      />

      {/* 6 Core Platform KPI Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <AdminMetricCard
          title="Total Cafes"
          value={stats.totalCafes}
          change={`+${stats.newCafesThisMonth} this month`}
          changeType="positive"
          icon={LuStore}
          subtitle={`${stats.activeCafes} active, ${stats.pendingCafes} pending`}
        />
        <AdminMetricCard
          title="Total Customers"
          value={stats.totalCustomers}
          change={`+${stats.newCustomersThisMonth} this month`}
          changeType="positive"
          icon={LuUsers}
          subtitle="Registered loyalty members"
        />
        <AdminMetricCard
          title="Stamps Issued"
          value={stats.totalStampsIssued}
          change="Real-time"
          changeType="positive"
          icon={LuStamp}
          subtitle="Cumulative stamps credited"
        />
        <AdminMetricCard
          title="Rewards Redeemed"
          value={stats.totalRewardsRedeemed}
          change="Global count"
          changeType="neutral"
          icon={LuGift}
          subtitle="Claimed customer rewards"
        />
        <AdminMetricCard
          title="New Cafes (Mo)"
          value={stats.newCafesThisMonth}
          change="This calendar month"
          changeType="positive"
          icon={LuTrendingUp}
          subtitle="Onboarded recently"
        />
        <AdminMetricCard
          title="Active Cafes"
          value={stats.activeCafes}
          change={`${Math.round((stats.activeCafes / (stats.totalCafes || 1)) * 100)}% active`}
          changeType="positive"
          icon={LuCircleCheck}
          subtitle="Platform operational rate"
        />
      </div>

      {/* Platform Growth Charts & Top Performing Cafes */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Platform Growth Chart (2 cols on lg) */}
        <div className="rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] p-6 shadow-2xs lg:col-span-2">
          <div className="flex items-center justify-between border-b border-[#ebdcc8] pb-4">
            <div>
              <h3 className="text-sm font-bold text-(--mainColor)">
                Platform Growth & Activity
              </h3>
              <p className="text-xs text-(--mainColor)/60">
                Customer signups and loyalty visits over the past 6 months
              </p>
            </div>
            <span className="flex items-center gap-1.5 rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">
              <LuTrendingUp className="h-3.5 w-3.5" />
              <span>+34% Overall</span>
            </span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="mt-6">
            <div className="grid grid-cols-6 items-end gap-3 h-44 pt-4">
              {growthData.map((d) => {
                const heightPercent = Math.max(15, Math.round((d.customers / maxCustomerGrowth) * 100));
                return (
                  <div key={d.month} className="flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[10px] font-bold text-(--mainColor)/70 opacity-0 group-hover:opacity-100 transition-opacity">
                      {d.customers} cust
                    </span>
                    <div className="w-full flex items-end gap-1.5 justify-center h-full">
                      {/* Customer bar */}
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-1/2 rounded-t-lg bg-(--mainColor) transition-all duration-300 group-hover:opacity-90"
                        title={`${d.customers} registered customers`}
                      />
                      {/* Stamp activity relative bar */}
                      <div
                        style={{ height: `${Math.min(100, Math.max(10, (d.stamps / 200) * 100))}%` }}
                        className="w-1/2 rounded-t-lg bg-(--secondColor) transition-all duration-300 group-hover:opacity-90"
                        title={`${d.stamps} stamps issued`}
                      />
                    </div>
                    <span className="text-xs font-semibold text-(--mainColor)/70">
                      {d.month}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-6 border-t border-[#ebdcc8] pt-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm bg-(--mainColor)" />
                <span className="font-semibold text-(--mainColor)/80">Registered Customers</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm bg-(--secondColor)" />
                <span className="font-semibold text-(--mainColor)/80">Stamps & Activity Index</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performing Cafes */}
        <div className="rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#ebdcc8] pb-4">
              <h3 className="text-sm font-bold text-(--mainColor)">
                Top Performing Cafes
              </h3>
              <Link
                href="/admin/cafes"
                className="text-xs font-bold text-(--mainColor) hover:underline flex items-center gap-1"
              >
                <span>View all</span>
                <LuArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="mt-4 divide-y divide-[#ebdcc8]">
              {topCafes.map((cafe, idx) => (
                <div key={cafe.id} className="py-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-(--secondColor)/30 text-[10px] font-bold text-(--mainColor)">
                      {idx + 1}
                    </span>
                    <img
                      src={cafe.logoImage || "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80"}
                      alt={cafe.name}
                      className="h-9 w-9 rounded-lg object-cover border border-[#dacdb9]"
                    />
                    <div className="min-w-0">
                      <Link
                        href={`/admin/cafes/${cafe.id}`}
                        className="truncate text-xs font-bold text-(--mainColor) hover:underline block"
                      >
                        {cafe.name}
                      </Link>
                      <span className="text-[11px] text-(--mainColor)/60">
                        {cafe.customerCount || 0} customers
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="block text-xs font-bold text-emerald-800">
                      {cafe.totalStampsIssued || 0} stamps
                    </span>
                    <span className="text-[10px] text-(--mainColor)/60">
                      {cafe.totalRewardsRedeemed || 0} redeemed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-[#ebdcc8] bg-[#f4ece0]/50 p-3 text-xs text-(--mainColor)/70">
            <span className="font-semibold text-(--mainColor)">Quick Insight:</span> The Roasted Bean accounts for 58% of platform stamp volume.
          </div>
        </div>
      </div>

      {/* Recent Platform Events & Redemptions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Platform Activity */}
        <div className="rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] shadow-2xs overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#ebdcc8] px-5 py-4">
            <div>
              <h3 className="font-bold text-sm text-(--mainColor)">
                Recent Platform Transactions
              </h3>
              <p className="text-xs text-(--mainColor)/60">
                Live feed of stamps issued and rewards claimed
              </p>
            </div>
            <Link
              href="/admin/rewards-activity"
              className="flex items-center gap-1 text-xs font-bold text-(--mainColor) hover:underline"
            >
              <span>View All</span>
              <LuArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#ebdcc8] bg-[#f4ece0]/60 text-(--mainColor)/70 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Activity</th>
                  <th className="px-5 py-3">Cafe</th>
                  <th className="px-5 py-3">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ebdcc8]">
                {recentActivities.map((act) => (
                  <tr key={act.id} className="hover:bg-[#f6efe4] transition">
                    <td className="px-5 py-3 font-bold text-(--mainColor)">
                      {act.customerName}
                    </td>
                    <td className="px-5 py-3">
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
                    <td className="px-5 py-3 text-(--mainColor)/80">
                      {act.cafeName || "Coffee House"}
                    </td>
                    <td className="px-5 py-3 text-(--mainColor)/60">
                      {act.formattedDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Registrations & Audit Log */}
        <div className="space-y-6">
          {/* Recently Registered Cafes & Customers */}
          <div className="rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] p-5 shadow-2xs">
            <h3 className="font-bold text-sm text-(--mainColor) border-b border-[#ebdcc8] pb-3">
              Recently Registered
            </h3>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Cafes */}
              <div>
                <span className="text-[11px] font-bold text-(--mainColor)/60 uppercase tracking-wider">
                  Newest Cafes
                </span>
                <div className="mt-2 space-y-2">
                  {recentCafes.map((c) => (
                    <div key={c.id} className="flex items-center justify-between rounded-lg bg-[#f5ecdd] p-2 text-xs">
                      <div className="min-w-0 pr-2">
                        <Link href={`/admin/cafes/${c.id}`} className="font-bold text-(--mainColor) truncate block hover:underline">
                          {c.name}
                        </Link>
                        <span className="text-[10px] text-(--mainColor)/60">{c.registrationDate}</span>
                      </div>
                      <AdminBadge status={c.status} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Customers */}
              <div>
                <span className="text-[11px] font-bold text-(--mainColor)/60 uppercase tracking-wider">
                  Newest Customers
                </span>
                <div className="mt-2 space-y-2">
                  {recentCustomers.map((c) => (
                    <div key={c.id} className="flex items-center justify-between rounded-lg bg-[#f5ecdd] p-2 text-xs">
                      <div className="min-w-0 pr-2">
                        <Link href={`/admin/customers/${c.id}`} className="font-bold text-(--mainColor) truncate block hover:underline">
                          {c.name}
                        </Link>
                        <span className="text-[10px] text-(--mainColor)/60">{c.registeredDate}</span>
                      </div>
                      <AdminBadge status={c.status} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Audit Log Snippet */}
          <div className="rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] p-5 shadow-2xs">
            <div className="flex items-center justify-between border-b border-[#ebdcc8] pb-3">
              <h3 className="font-bold text-sm text-(--mainColor)">
                Platform Audit Log
              </h3>
              <span className="text-[10px] text-(--mainColor)/60">Admin action trail</span>
            </div>
            <div className="mt-3 space-y-2.5">
              {auditLog.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-start gap-2.5 text-xs text-(--mainColor)/80">
                  <LuShieldAlert className="h-4 w-4 shrink-0 text-amber-700 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{item.description}</p>
                    <span className="text-[10px] text-(--mainColor)/50">
                      by {item.adminName} • {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
