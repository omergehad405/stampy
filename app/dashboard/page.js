"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LuUsers,
  LuStamp,
  LuGift,
  LuActivity,
  LuQrCode,
  LuPlus,
  LuStore,
  LuArrowUpRight,
  LuCalendar,
  LuClock,
  LuCircleCheck,
  LuSparkles,
} from "react-icons/lu";
import DashboardPageHeader from "./components/DashboardPageHeader";
import DashboardMetricCard from "./components/DashboardMetricCard";
import { useDashboardStore } from "@/app/stores/useDashboardStore";
import { useDashboardAuthStore } from "@/app/stores/useDashboardAuthStore";

export default function DashboardOverviewPage() {
  const { customers, rewards, activities, cafe, createCustomer } = useDashboardStore();
  const { currentUser } = useDashboardAuthStore();

  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [newCustomerForm, setNewCustomerForm] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });

  // Calculate dynamic metrics
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c) => c.status === "active").length;
  const totalStampsIssued = customers.reduce(
    (acc, c) => acc + (c.lifetimeStamps || c.stamps || 0),
    0
  );
  const totalRewardsRedeemed = customers.reduce(
    (acc, c) => acc + (c.rewardsRedeemedCount || 0),
    0
  );

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

  const handleAddCustomerSubmit = (e) => {
    e.preventDefault();
    if (!newCustomerForm.name || !newCustomerForm.email) return;

    createCustomer({
      name: newCustomerForm.name,
      email: newCustomerForm.email,
      phone: newCustomerForm.phone || "+44 7700 900000",
      notes: newCustomerForm.notes,
    });

    setNewCustomerForm({ name: "", email: "", phone: "", notes: "" });
    setShowAddCustomerModal(false);
  };

  return (
    <div className="space-y-7">
      {/* Page Header */}
      <DashboardPageHeader
        title="Loyalty Overview"
        description={`Welcome back, ${currentUser?.name || "Elena"}. Here is what's happening with ${cafe.name}'s loyalty program today.`}
        actions={
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowAddCustomerModal(true)}
              className="flex items-center gap-1.5 rounded-xl border border-[#decfa8] bg-[#f5ebdb] px-3.5 py-2 text-xs font-bold text-(--mainColor) transition hover:bg-[#edd9c0]"
            >
              <LuPlus className="h-4 w-4" />
              <span>Add Customer</span>
            </button>

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
          className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-(--mainColor)/20 bg-(--mainColor) p-5 text-(--bgColor) shadow-sm transition hover:shadow-md"
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
          className="group flex flex-col justify-between rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] p-5 shadow-2xs transition hover:shadow-xs"
        >
          <div className="flex items-center justify-between">
            <span className="rounded-lg bg-(--secondColor)/30 px-2.5 py-1 text-[11px] font-bold text-(--mainColor) uppercase">
              Loyalty Catalog
            </span>
            <LuGift className="h-6 w-6 text-(--mainColor) transition group-hover:scale-110" />
          </div>
          <div className="mt-4">
            <h3 className="text-base font-bold text-(--mainColor)">
              Manage Rewards
            </h3>
            <p className="mt-1 text-xs text-(--mainColor)/70">
              Configure free drinks, artisan pastries, and stamp thresholds.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-(--mainColor)">
            <span>View & Edit Rewards</span>
            <LuArrowUpRight className="h-4 w-4" />
          </div>
        </Link>

        {/* Quick Action 3: Edit Cafe Profile */}
        <Link
          href="/dashboard/profile"
          className="group flex flex-col justify-between rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] p-5 shadow-2xs transition hover:shadow-xs"
        >
          <div className="flex items-center justify-between">
            <span className="rounded-lg bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-800 uppercase">
              Customer Storefront
            </span>
            <LuStore className="h-6 w-6 text-(--mainColor) transition group-hover:scale-110" />
          </div>
          <div className="mt-4">
            <h3 className="text-base font-bold text-(--mainColor)">
              Update Cafe Profile
            </h3>
            <p className="mt-1 text-xs text-(--mainColor)/70">
              Update opening hours, story, menu highlights, and social links.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-(--mainColor)">
            <span>Open Profile Editor</span>
            <LuArrowUpRight className="h-4 w-4" />
          </div>
        </Link>
      </div>

      {/* Performance Chart & Shift Info */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Weekly Visits & Stamps Chart */}
        <div className="rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] p-5 shadow-2xs lg:col-span-2">
          <div className="flex items-center justify-between border-b border-[#ebdcc8] pb-4">
            <div>
              <h3 className="font-bold text-sm text-(--mainColor)">
                Weekly Visit Volume & Stamps
              </h3>
              <p className="text-xs text-(--mainColor)/60">
                Customer visits recorded at the counter over the past 7 days
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-(--mainColor)">
                <span className="h-3 w-3 rounded-sm bg-(--mainColor)" /> Visits
              </span>
              <span className="flex items-center gap-1.5 text-(--mainColor)">
                <span className="h-3 w-3 rounded-sm bg-(--secondColor)" /> Stamps
              </span>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="mt-6 flex h-48 items-end justify-between gap-2 pt-4 px-2 sm:px-6">
            {weeklyTrends.map((t) => {
              const visitHeight = Math.round((t.visits / maxVisits) * 130);
              const stampHeight = Math.round((t.stamps / (maxVisits * 1.3)) * 130);

              return (
                <div key={t.day} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex w-full items-end justify-center gap-1">
                    {/* Visits Bar */}
                    <div
                      style={{ height: `${visitHeight}px` }}
                      className="w-full max-w-[16px] rounded-t-md bg-(--mainColor) transition-all hover:opacity-85"
                      title={`${t.day}: ${t.visits} customer visits`}
                    />
                    {/* Stamps Bar */}
                    <div
                      style={{ height: `${stampHeight}px` }}
                      className="w-full max-w-[16px] rounded-t-md bg-(--secondColor) transition-all hover:opacity-85"
                      title={`${t.day}: ${t.stamps} stamps credited`}
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-(--mainColor)/70">
                    {t.day}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-[#ebdcc8] pt-3 text-xs text-(--mainColor)/70">
            <span>Peak Day: <strong>Saturday (78 visits)</strong></span>
            <span>Average: <strong>48 visits/day</strong></span>
          </div>
        </div>

        {/* Current Station & Shift Card */}
        <div className="flex flex-col justify-between rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] p-5 shadow-2xs">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-(--mainColor) uppercase tracking-wider">
                Shift & Rules
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Active Station
              </span>
            </div>

            <div className="mt-4 space-y-3.5">
              <div className="flex items-start gap-3 rounded-xl bg-[#f4ebe0]/60 p-3">
                <LuClock className="mt-0.5 h-4 w-4 shrink-0 text-(--mainColor)" />
                <div className="text-xs">
                  <span className="font-bold text-(--mainColor)">Daily Visit Policy</span>
                  <p className="text-(--mainColor)/70">
                    1 stamp per customer per calendar day is enforced.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-[#f4ebe0]/60 p-3">
                <LuStamp className="mt-0.5 h-4 w-4 shrink-0 text-(--mainColor)" />
                <div className="text-xs">
                  <span className="font-bold text-(--mainColor)">Stamp Target</span>
                  <p className="text-(--mainColor)/70">
                    10 stamps complete a full card and unlock top-tier rewards.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-[#f4ebe0]/60 p-3">
                <LuSparkles className="mt-0.5 h-4 w-4 shrink-0 text-(--mainColor)" />
                <div className="text-xs">
                  <span className="font-bold text-(--mainColor)">Staff on Duty</span>
                  <p className="text-(--mainColor)/70">
                    {currentUser?.name || "Elena Rostova"} ({currentUser?.role || "Manager"})
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/dashboard/settings"
            className="mt-4 block rounded-xl border border-[#dacdb9] bg-white/70 py-2 text-center text-xs font-semibold text-(--mainColor) transition hover:bg-white"
          >
            Station & Account Settings
          </Link>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] shadow-2xs overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#ebdcc8] px-5 py-4">
          <div>
            <h3 className="font-bold text-sm text-(--mainColor)">
              Recent Counter Activity
            </h3>
            <p className="text-xs text-(--mainColor)/60">
              Live log of visits, stamps issued, and rewards redeemed
            </p>
          </div>
          <Link
            href="/dashboard/activity"
            className="flex items-center gap-1 text-xs font-bold text-(--mainColor) hover:underline"
          >
            <span>View Full History</span>
            <LuArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#ebdcc8] bg-[#f4ece0]/60 text-(--mainColor)/70 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Activity</th>
                <th className="px-5 py-3">Points Delta</th>
                <th className="px-5 py-3">Confirmed By</th>
                <th className="px-5 py-3">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ebdcc8]">
              {activities.slice(0, 5).map((act) => (
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
                  <td className="px-5 py-3.5 text-(--mainColor)/75 font-medium">
                    {act.staffName}
                  </td>
                  <td className="px-5 py-3.5 text-(--mainColor)/60">
                    {act.formattedDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-[#ebdcc8] bg-[#faf6ed] p-6 shadow-xl">
            <h3 className="font-bold text-base text-(--mainColor)">
              Register New Customer
            </h3>
            <p className="mt-1 text-xs text-(--mainColor)/70">
              Create a customer account directly from the counter.
            </p>

            <form onSubmit={handleAddCustomerSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-(--mainColor) mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newCustomerForm.name}
                  onChange={(e) =>
                    setNewCustomerForm({ ...newCustomerForm, name: e.target.value })
                  }
                  placeholder="e.g. David Miller"
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
                  value={newCustomerForm.email}
                  onChange={(e) =>
                    setNewCustomerForm({ ...newCustomerForm, email: e.target.value })
                  }
                  placeholder="david.miller@example.com"
                  className="w-full h-10 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none focus:border-(--mainColor)"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-(--mainColor) mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={newCustomerForm.phone}
                  onChange={(e) =>
                    setNewCustomerForm({ ...newCustomerForm, phone: e.target.value })
                  }
                  placeholder="+44 7700 900555"
                  className="w-full h-10 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none focus:border-(--mainColor)"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-(--mainColor) mb-1">
                  Customer Notes
                </label>
                <textarea
                  rows={2}
                  value={newCustomerForm.notes}
                  onChange={(e) =>
                    setNewCustomerForm({ ...newCustomerForm, notes: e.target.value })
                  }
                  placeholder="e.g. Regular morning latte"
                  className="w-full rounded-xl border border-[#dacdb9] bg-[#f5ecdd] p-2.5 text-xs text-(--mainColor) outline-none focus:border-(--mainColor)"
                />
              </div>

              <div className="mt-5 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddCustomerModal(false)}
                  className="rounded-xl border border-[#dacdb9] bg-white/70 px-4 py-2 text-xs font-semibold text-(--mainColor) hover:bg-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-(--mainColor) px-4 py-2 text-xs font-bold text-(--secondColor)"
                >
                  Register Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
