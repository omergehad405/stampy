"use client";

import React, { useEffect, useState } from "react";
import {
  LuChartBar,
  LuCoffee,
  LuGift,
  LuLoader,
  LuStamp,
  LuTrendingUp,
  LuUsers,
} from "react-icons/lu";
import AdminPageHeader from "../components/AdminPageHeader";
import AdminMetricCard from "../components/AdminMetricCard";
import { apiAdminGetAnalytics } from "@/app/lib/adminApi";

const formatPeriod = (period, monthly) => {
  const date = new Date(`${period}${monthly ? "-01" : ""}T12:00:00Z`);
  return date.toLocaleDateString("en-US", {
    month: monthly ? "short" : "numeric",
    day: monthly ? undefined : "numeric",
    year: monthly ? "2-digit" : undefined,
    timeZone: "Africa/Cairo",
  });
};

const formatCount = (value) => (Number(value) || 0).toLocaleString();

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d");
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let isCurrent = true;

    apiAdminGetAnalytics(timeRange)
      .then((response) => {
        if (!response?.success || !response?.data) {
          throw new Error(response?.message || "Analytics data was not returned.");
        }
        if (isCurrent) setAnalytics(response.data);
      })
      .catch((requestError) => {
        if (isCurrent) {
          setError(requestError.message || "Failed to load analytics.");
        }
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [timeRange, retryCount]);

  const totals = analytics?.totals;
  const trends = analytics?.trends || [];
  const monthly = timeRange === "90d" || timeRange === "365d";
  const maxSignup = Math.max(
    1,
    ...trends.map((item) => Math.max(item.customers || 0, item.cafes || 0))
  );
  const maxActivity = Math.max(
    1,
    ...trends.map((item) => Math.max(item.stamps || 0, item.redemptions || 0))
  );
  const hasRegistrations = trends.some((item) => item.customers > 0 || item.cafes > 0);
  const hasActivity = trends.some((item) => item.stamps > 0 || item.redemptions > 0);

  return (
    <div className="space-y-7">
      <AdminPageHeader
        title="Platform Analytics"
        description="Metrics and activity recorded in the platform database."
        breadcrumbs={[{ label: "Analytics" }]}
        actions={
          <div className="flex items-center gap-2">
            <label
              htmlFor="analytics-time-range"
              className="text-xs font-semibold text-(--mainColor)/60"
            >
              Timeframe:
            </label>
            <select
              id="analytics-time-range"
              value={timeRange}
              onChange={(event) => {
                setAnalytics(null);
                setError("");
                setIsLoading(true);
                setTimeRange(event.target.value);
              }}
              className="h-9 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs font-bold text-(--mainColor) outline-none focus:border-(--mainColor)"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 3 Months</option>
              <option value="365d">Last 12 Months</option>
            </select>
          </div>
        }
      />

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] p-12 text-sm text-(--mainColor)/70">
          <LuLoader className="h-5 w-5 animate-spin" />
          Loading analytics from the database...
        </div>
      ) : error ? (
        <div
          role="alert"
          className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-800"
        >
          <p className="text-sm font-bold">Analytics could not be loaded</p>
          <p className="mt-1 text-xs">{error}</p>
          <button
            type="button"
          onClick={() => {
            setAnalytics(null);
            setError("");
            setIsLoading(true);
            setRetryCount((count) => count + 1);
          }}
            className="mt-4 rounded-xl bg-rose-700 px-4 py-2 text-xs font-bold text-white hover:bg-rose-800"
          >
            Try again
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <AdminMetricCard
              title="New Cafes"
              value={formatCount(totals.newCafes)}
              icon={LuCoffee}
              subtitle="Registered in this timeframe"
            />
            <AdminMetricCard
              title="New Customers"
              value={formatCount(totals.newCustomers)}
              icon={LuUsers}
              subtitle="Customer accounts registered"
            />
            <AdminMetricCard
              title="Stamps Issued"
              value={formatCount(totals.stampsIssued)}
              icon={LuStamp}
              subtitle="Recorded stamp and enrollment activity"
            />
            <AdminMetricCard
              title="Rewards Redeemed"
              value={formatCount(totals.rewardsRedeemed)}
              icon={LuGift}
              subtitle="Redemptions marked as used"
            />
            <AdminMetricCard
              title="Return Visit Rate"
              value={
                totals.returnRate === null
                  ? "N/A"
                  : `${(totals.returnRate * 100).toFixed(1)}%`
              }
              icon={LuTrendingUp}
              subtitle={`${formatCount(totals.returningVisitors)} of ${formatCount(
                totals.visitors
              )} customers visited more than once`}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] p-6 shadow-2xs">
              <div className="flex items-center justify-between border-b border-[#ebdcc8] pb-4">
                <div>
                  <h3 className="font-bold text-sm text-(--mainColor)">
                    New Cafes and Customer Accounts
                  </h3>
                  <p className="text-xs text-(--mainColor)/60">
                    Database registrations by {monthly ? "month" : "day"}
                  </p>
                </div>
                <LuChartBar className="h-5 w-5 text-(--mainColor)/60" />
              </div>
              <div className="mt-5 flex flex-wrap gap-4 text-[11px] text-(--mainColor)/70">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm bg-(--mainColor)" />
                  Customers
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm bg-(--secondColor)" />
                  Cafes
                </span>
              </div>
              {!hasRegistrations ? (
                <p className="py-12 text-center text-xs text-(--mainColor)/60">
                  No registration records for this timeframe.
                </p>
              ) : (
                <div className="mt-4 flex h-48 items-end justify-between gap-1 overflow-x-auto border-b border-[#ebdcc8] pb-1">
                  {trends.map((item) => (
                    <div
                      key={item.period}
                      className="group flex h-full min-w-5 flex-1 flex-col items-center justify-end gap-1"
                      title={`${formatPeriod(item.period, monthly)}: ${item.customers} customers, ${item.cafes} cafes`}
                    >
                      <div className="flex h-[85%] w-full items-end justify-center gap-0.5">
                        <div
                          className="w-2/5 max-w-5 rounded-t-sm bg-(--mainColor)"
                          style={{
                            height: `${(item.customers / maxSignup) * 100}%`,
                          }}
                        />
                        <div
                          className="w-2/5 max-w-5 rounded-t-sm bg-(--secondColor)"
                          style={{ height: `${(item.cafes / maxSignup) * 100}%` }}
                        />
                      </div>
                      <span className="max-w-full truncate text-[9px] text-(--mainColor)/60">
                        {formatPeriod(item.period, monthly)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] p-6 shadow-2xs">
              <div className="flex items-center justify-between border-b border-[#ebdcc8] pb-4">
                <div>
                  <h3 className="font-bold text-sm text-(--mainColor)">
                    Stamps Issued and Rewards Redeemed
                  </h3>
                  <p className="text-xs text-(--mainColor)/60">
                    Recorded activity by {monthly ? "month" : "day"}
                  </p>
                </div>
                <LuChartBar className="h-5 w-5 text-(--mainColor)/60" />
              </div>
              <div className="mt-5 flex flex-wrap gap-4 text-[11px] text-(--mainColor)/70">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm bg-(--mainColor)" />
                  Stamps
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm bg-(--secondColor)" />
                  Redemptions
                </span>
              </div>
              {!hasActivity ? (
                <p className="py-12 text-center text-xs text-(--mainColor)/60">
                  No activity records for this timeframe.
                </p>
              ) : (
                <div className="mt-4 flex h-48 items-end justify-between gap-1 overflow-x-auto border-b border-[#ebdcc8] pb-1">
                  {trends.map((item) => (
                    <div
                      key={item.period}
                      className="group flex h-full min-w-5 flex-1 flex-col items-center justify-end gap-1"
                      title={`${formatPeriod(item.period, monthly)}: ${item.stamps} stamps, ${item.redemptions} redemptions`}
                    >
                      <div className="flex h-[85%] w-full items-end justify-center gap-0.5">
                        <div
                          className="w-2/5 max-w-5 rounded-t-sm bg-(--mainColor)"
                          style={{
                            height: `${(item.stamps / maxActivity) * 100}%`,
                          }}
                        />
                        <div
                          className="w-2/5 max-w-5 rounded-t-sm bg-(--secondColor)"
                          style={{
                            height: `${(item.redemptions / maxActivity) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="max-w-full truncate text-[9px] text-(--mainColor)/60">
                        {formatPeriod(item.period, monthly)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <section className="overflow-hidden rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] shadow-2xs">
              <div className="flex items-center justify-between border-b border-[#ebdcc8] px-5 py-4">
                <h3 className="font-bold text-sm text-(--mainColor)">Most Active Cafes</h3>
                <span className="text-xs text-(--mainColor)/60">By issued stamps</span>
              </div>
              {analytics.topCafes.length === 0 ? (
                <p className="p-6 text-center text-xs text-(--mainColor)/60">
                  No cafe activity recorded for this timeframe.
                </p>
              ) : (
                <ol className="divide-y divide-[#ebdcc8]">
                  {analytics.topCafes.map((cafe, index) => (
                    <li
                      key={cafe.id}
                      className="flex items-center justify-between gap-3 p-4 text-xs"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f5ecdd] text-[10px] font-bold text-(--mainColor)">
                          {index + 1}
                        </span>
                        <div className="min-w-0">
                          <span className="block truncate font-bold text-(--mainColor)">
                            {cafe.name}
                          </span>
                          <span className="text-[11px] text-(--mainColor)/60">
                            {formatCount(cafe.visits)} visits
                          </span>
                        </div>
                      </div>
                      <span className="shrink-0 font-bold text-(--mainColor)">
                        {formatCount(cafe.stamps)} stamps
                      </span>
                    </li>
                  ))}
                </ol>
              )}
            </section>

            <section className="overflow-hidden rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] shadow-2xs">
              <div className="flex items-center justify-between border-b border-[#ebdcc8] px-5 py-4">
                <h3 className="font-bold text-sm text-(--mainColor)">Most Active Customers</h3>
                <span className="text-xs text-(--mainColor)/60">By recorded visits</span>
              </div>
              {analytics.topCustomers.length === 0 ? (
                <p className="p-6 text-center text-xs text-(--mainColor)/60">
                  No customer activity recorded for this timeframe.
                </p>
              ) : (
                <ol className="divide-y divide-[#ebdcc8]">
                  {analytics.topCustomers.map((customer, index) => (
                    <li
                      key={customer.id}
                      className="flex items-center justify-between gap-3 p-4 text-xs"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f5ecdd] text-[10px] font-bold text-(--mainColor)">
                          {index + 1}
                        </span>
                        <span className="truncate font-bold text-(--mainColor)">
                          {customer.name || "Customer"}
                        </span>
                      </div>
                      <div className="shrink-0 text-right">
                        <span className="block font-bold text-(--mainColor)">
                          {formatCount(customer.visits)} visits
                        </span>
                        <span className="text-[10px] text-(--mainColor)/60">
                          {formatCount(customer.stamps)} stamps
                        </span>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </section>
          </div>

          <p className="text-right text-[11px] text-(--mainColor)/50">
            Platform totals: {formatCount(totals.totalCafes)} cafes (
            {formatCount(totals.activeCafes)} active) ·{" "}
            {formatCount(totals.totalCustomers)} customers
          </p>
        </>
      )}
    </div>
  );
}
