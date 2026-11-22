"use client";

import React from "react";

export default function DashboardMetricCard({
  title,
  value,
  change,
  changeType = "positive", // 'positive' | 'neutral' | 'negative'
  icon: Icon,
  subtitle,
}) {
  return (
    <div className="flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-(--bgColor)/15 bg-(--mainColor) text-(--bgColor) p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold text-(--bgColor)/75 uppercase tracking-wider">
          {title}
        </span>
        {Icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--secondColor) text-[#3B2418] shadow-xs">
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-(--bgColor) sm:text-3xl">
          {value}
        </span>
        {change && (
          <span
            className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-semibold ${
              changeType === "positive"
                ? "bg-emerald-400/20 text-emerald-200 border border-emerald-400/30"
                : changeType === "negative"
                ? "bg-rose-400/20 text-rose-200 border border-rose-400/30"
                : "bg-amber-400/20 text-amber-200 border border-amber-400/30"
            }`}
          >
            {change}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-2 text-xs text-(--bgColor)/65">
          {subtitle}
        </p>
      )}
    </div>
  );
}
