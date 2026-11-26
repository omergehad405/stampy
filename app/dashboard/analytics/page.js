"use client";

import { useDashboardStore } from "@/app/stores/useDashboardStore";
import DashboardPageHeader from "../components/DashboardPageHeader";
import AnalyticsLockedState from "./components/AnalyticsLockedState";
import AtRiskCustomers from "./components/AtRiskCustomers";
import EmptyState from "./components/EmptyState";
import PeakHoursHeatmap from "./components/PeakHoursHeatmap";
import RangeSelector from "./components/RangeSelector";
import ReturnRateCard from "./components/ReturnRateCard";
import RewardsFunnel from "./components/RewardsFunnel";
import StatCards from "./components/StatCards";
import TopCustomers from "./components/TopCustomers";
import VisitsChart from "./components/VisitsChart";
import useAnalytics from "./hooks/useAnalytics";

export default function DashboardAnalyticsPage() {
  const { cafe, hasFeature } = useDashboardStore();
  const {
    range,
    setRange,
    atRiskDays,
    setAtRiskDays,
    data,
    isLoading,
    isLocked,
    hasError,
    retry,
  } = useAnalytics();
  const subscriptionIsCurrent = ["active", "trial"].includes(
    cafe?.subscriptionStatus || "active"
  );
  const planAllowsAnalytics = hasFeature("analytics") && subscriptionIsCurrent;

  if (isLocked || (!isLoading && !planAllowsAnalytics)) {
    return <AnalyticsLockedState />;
  }

  return (
    <div dir="ltr" lang="en" className="space-y-5">
      <DashboardPageHeader
        title="Cafe Analytics"
        description={`Track visits, customer retention, and rewards performance for ${cafe.name || "your cafe"}.`}
        onRefresh={retry}
        isRefreshing={isLoading}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-(--mainColor)/65">
          {range === "all"
            ? "All-time metrics include recorded activity since cafe registration."
            : "Metrics use the selected date range."}{" "}
          Stamps issued are gross grants and are not reduced when customers
          redeem rewards. Peak hours are grouped in{" "}
          {data?.timezone || "the cafe's configured timezone"} time.
        </p>
        <RangeSelector value={range} onChange={setRange} />
      </div>

      {hasError ? (
        <section
          role="alert"
          className="rounded-2xl border border-rose-300/50 bg-rose-50 p-5 text-right text-sm text-rose-900"
        >
          <p className="font-bold">Unable to load analytics.</p>
          <p className="mt-1 text-xs">Check your connection and try again.</p>
          <button
            type="button"
            onClick={retry}
            className="mt-4 min-h-10 rounded-xl bg-(--mainColor) px-4 text-xs font-bold text-(--secondColor) focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Retry
          </button>
        </section>
      ) : !isLoading && data && !data.hasData ? (
        <EmptyState />
      ) : (
        <>
          <StatCards
            stats={data?.stats}
            isLoading={isLoading}
            isLifetime={range === "all"}
          />
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <VisitsChart data={data?.visitsOverTime} isLoading={isLoading} />
            <PeakHoursHeatmap
              data={data?.peakHours}
              timezone={data?.timezone}
              isLoading={isLoading}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <ReturnRateCard
              returnRate={data?.returnRate}
              newVsReturning={data?.newVsReturning}
              sampleSizeMinimum={data?.sampleSizeMinimum}
              isLoading={isLoading}
            />
            <RewardsFunnel data={data?.rewardsFunnel} isLoading={isLoading} />
          </div>
          <AtRiskCustomers
            customers={data?.atRiskCustomers}
            atRiskDays={atRiskDays}
            onAtRiskDaysChange={setAtRiskDays}
            isNotificationsAvailable={
              hasFeature("notifications") && subscriptionIsCurrent
            }
            cafeName={cafe.name}
            isLoading={isLoading}
          />
          <TopCustomers customers={data?.topCustomers} isLoading={isLoading} />
        </>
      )}
    </div>
  );
}
