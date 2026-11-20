"use client";

import React, { useState } from "react";
import {
  LuChartBar,
  LuTrendingUp,
  LuUsers,
  LuStamp,
  LuGift,
  LuCalendar,
  LuActivity,
  LuCoffee,
  LuPercent,
} from "react-icons/lu";
import AdminPageHeader from "../components/AdminPageHeader";
import AdminMetricCard from "../components/AdminMetricCard";
import { useAdminStore } from "@/app/stores/useAdminStore";

export default function AdminAnalyticsPage() {
  const { cafes, customers, activities, getTotalStats } = useAdminStore();
  const [timeRange, setTimeRange] = useState("30days");

  const stats = getTotalStats();

  // Dynamic calculations based on selected timeframe
  const multiplier = timeRange === "7days" ? 0.3 : timeRange === "30days" ? 1 : timeRange === "3months" ? 2.5 : 7;

  // Monthly trends representation
  const monthlyTrends = [
    { period: "May", cafes: 1, customers: 24, stamps: 88, redemptions: 6 },
    { period: "Jun", cafes: 1, customers: 41, stamps: 142, redemptions: 11 },
    { period: "Jul", cafes: 2, customers: 68, stamps: 230, redemptions: 19 },
    { period: "Aug", cafes: 2, customers: 92, stamps: 345, redemptions: 28 },
    { period: "Sep", cafes: 3, customers: 125, stamps: 480, redemptions: 40 },
    { period: "Oct", cafes: 4, customers: 160, stamps: 620, redemptions: 54 },
    { period: "Nov", cafes: stats.totalCafes, customers: stats.totalCustomers, stamps: stats.totalStampsIssued, redemptions: stats.totalRewardsRedeemed },
  ];

  const maxCustomers = Math.max(...monthlyTrends.map((t) => t.customers));
  const maxStamps = Math.max(...monthlyTrends.map((t) => t.stamps));

  // Top Most Active Cafes by Volume
  const activeCafes = [...cafes]
    .filter((c) => c.status === "active")
    .sort((a, b) => (b.totalStampsIssued || 0) - (a.totalStampsIssued || 0));

  // Highest Customer Engagement (by lifetime stamps)
  const topCustomers = [...customers]
    .sort((a, b) => (b.totalLifetimeStamps || b.lifetimeStamps || 0) - (a.totalLifetimeStamps || a.lifetimeStamps || 0))
    .slice(0, 5);

  // Conversion / Redemption Rate
  const redemptionRate = stats.totalStampsIssued > 0
    ? ((stats.totalRewardsRedeemed / (stats.totalStampsIssued / 8)) * 100).toFixed(1)
    : 0;

  return (
    <div className="space-y-7">
      {/* Page Header with Date Filter */}
      <AdminPageHeader
        title="Platform Analytics"
        description="Comprehensive insights into network growth, member acquisition, daily stamps, and reward economics."
        breadcrumbs={[{ label: "Analytics" }]}
        actions={
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-(--mainColor)/60">Timeframe:</span>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="h-9 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs font-bold text-(--mainColor) outline-none"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="3months">Last 3 Months</option>
              <option value="12months">Last 12 Months</option>
            </select>
          </div>
        }
      />

      {/* Primary Analytical KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminMetricCard
          title="Customer Retention"
          value="78.4%"
          change="+4.2%"
          changeType="positive"
          icon={LuUsers}
          subtitle="Return visit rate within 14 days"
        />
        <AdminMetricCard
          title="Avg Stamps / Member"
          value={(stats.totalStampsIssued / (stats.totalCustomers || 1)).toFixed(1)}
          change="Strong loyalty"
          changeType="positive"
          icon={LuStamp}
          subtitle="Mean stamps collected per customer"
        />
        <AdminMetricCard
          title="Reward Claim Rate"
          value={`${redemptionRate}%`}
          change="Healthy turnover"
          changeType="neutral"
          icon={LuPercent}
          subtitle="Completed stamp cards redeemed"
        />
        <AdminMetricCard
          title="Avg Days to Reward"
          value="18.5"
          change="-2.1 days"
          changeType="positive"
          icon={LuCalendar}
          subtitle="Speed to unlocking free reward"
        />
      </div>

      {/* Growth Visualization Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Customer & Cafe Growth Chart */}
        <div className="rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] p-6 shadow-2xs">
          <div className="flex items-center justify-between border-b border-[#ebdcc8] pb-4">
            <div>
              <h3 className="font-bold text-sm text-(--mainColor)">
                Cumulative Customer Signups
              </h3>
              <p className="text-xs text-(--mainColor)/60">
                Monthly growth across all connected venues
              </p>
            </div>
            <span className="flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
              <LuTrendingUp className="h-3.5 w-3.5" />
              <span>+28% MoM</span>
            </span>
          </div>

          <div className="mt-6 h-48 flex items-end gap-3 justify-between pt-4">
            {monthlyTrends.map((item) => {
              const height = Math.max(15, Math.round((item.customers / maxCustomers) * 100));
              return (
                <div key={item.period} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <span className="text-[10px] font-bold text-(--mainColor)/70 opacity-0 group-hover:opacity-100 transition">
                    {item.customers}
                  </span>
                  <div
                    style={{ height: `${height}%` }}
                    className="w-full max-w-[40px] rounded-t-lg bg-(--mainColor) transition-all duration-300 group-hover:bg-(--mainColor)/80"
                  />
                  <span className="text-xs font-semibold text-(--mainColor)/70">
                    {item.period}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stamps & Redemptions Volume Chart */}
        <div className="rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] p-6 shadow-2xs">
          <div className="flex items-center justify-between border-b border-[#ebdcc8] pb-4">
            <div>
              <h3 className="font-bold text-sm text-(--mainColor)">
                Stamps Issued vs Rewards Redeemed
              </h3>
              <p className="text-xs text-(--mainColor)/60">
                Tracking monthly counter activity velocity
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-(--secondColor)" />
                <span className="text-[11px] font-medium text-(--mainColor)/70">Stamps</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />
                <span className="text-[11px] font-medium text-(--mainColor)/70">Rewards</span>
              </div>
            </div>
          </div>

          <div className="mt-6 h-48 flex items-end gap-3 justify-between pt-4">
            {monthlyTrends.map((item) => {
              const stampHeight = Math.max(12, Math.round((item.stamps / maxStamps) * 100));
              const rewardHeight = Math.max(10, Math.round(((item.redemptions * 6) / maxStamps) * 100));
              return (
                <div key={item.period} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="w-full flex items-end gap-1 justify-center h-full">
                    <div
                      style={{ height: `${stampHeight}%` }}
                      className="w-1/2 max-w-[20px] rounded-t bg-(--secondColor) transition-all"
                      title={`${item.stamps} stamps issued`}
                    />
                    <div
                      style={{ height: `${rewardHeight}%` }}
                      className="w-1/2 max-w-[20px] rounded-t bg-purple-500 transition-all"
                      title={`${item.redemptions} rewards redeemed`}
                    />
                  </div>
                  <span className="text-xs font-semibold text-(--mainColor)/70">
                    {item.period}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Engagement Tables: Most Active Cafes & Top Customers */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Most Active Cafes */}
        <div className="rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] shadow-2xs overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#ebdcc8] px-5 py-4">
            <h3 className="font-bold text-sm text-(--mainColor)">
              Most Active Cafes
            </h3>
            <span className="text-xs text-(--mainColor)/60">By transaction volume</span>
          </div>
          <div className="divide-y divide-[#ebdcc8]">
            {activeCafes.map((cafe, idx) => (
              <div key={cafe.id} className="p-4 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#f5ecdd] font-bold text-(--mainColor) text-[10px]">
                    {idx + 1}
                  </span>
                  <img
                    src={cafe.logoImage || "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80"}
                    alt={cafe.name}
                    className="h-8 w-8 rounded-lg object-cover border border-[#dacdb9]"
                  />
                  <div className="min-w-0">
                    <span className="font-bold text-(--mainColor) block truncate">{cafe.name}</span>
                    <span className="text-[11px] text-(--mainColor)/60">{cafe.customerCount || 0} members</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-bold text-emerald-800 block">
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

        {/* Highest Customer Engagement */}
        <div className="rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] shadow-2xs overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#ebdcc8] px-5 py-4">
            <h3 className="font-bold text-sm text-(--mainColor)">
              Top Loyal Customers
            </h3>
            <span className="text-xs text-(--mainColor)/60">By lifetime stamps</span>
          </div>
          <div className="divide-y divide-[#ebdcc8]">
            {topCustomers.map((cust, idx) => (
              <div key={cust.id} className="p-4 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#f5ecdd] font-bold text-(--mainColor) text-[10px]">
                    {idx + 1}
                  </span>
                  <img
                    src={cust.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"}
                    alt={cust.name}
                    className="h-8 w-8 rounded-full object-cover border border-[#dacdb9]"
                  />
                  <div className="min-w-0">
                    <span className="font-bold text-(--mainColor) block truncate">{cust.name}</span>
                    <span className="text-[11px] text-(--mainColor)/60">{cust.email}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-bold text-(--mainColor) block">
                    {cust.totalLifetimeStamps || cust.lifetimeStamps || cust.stamps || 0} stamps
                  </span>
                  <span className="text-[10px] text-purple-700 font-semibold">
                    {cust.totalRewardsRedeemed || cust.rewardsRedeemedCount || 0} redeemed
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
