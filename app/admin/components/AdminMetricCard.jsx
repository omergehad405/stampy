"use client";

import React from "react";

export default function AdminMetricCard({
  title,
  value,
  change,
  changeType = "positive", // 'positive' | 'neutral' | 'negative'
  icon: Icon,
  subtitle,
}) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] p-5 shadow-2xs transition hover:shadow-xs">
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold text-(--mainColor)/70 uppercase tracking-wider">
          {title}
        </span>
        {Icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--secondColor)/25 text-(--mainColor)">
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-(--mainColor) sm:text-3xl">
          {value}
        </span>
        {change && (
          <span
            className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-semibold ${
              changeType === "positive"
                ? "bg-emerald-100 text-emerald-800"
                : changeType === "negative"
                ? "bg-rose-100 text-rose-800"
                : "bg-amber-100 text-amber-800"
            }`}
          >
            {change}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-2 text-xs text-(--mainColor)/60">
          {subtitle}
        </p>
      )}
    </div>
  );
}
