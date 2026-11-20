"use client";

import React from "react";

export default function AdminBadge({ status, label }) {
  const normalized = (status || "").toLowerCase();

  let colorClasses = "bg-neutral-100 text-neutral-800 border-neutral-200";

  if (normalized === "active" || normalized === "published") {
    colorClasses = "bg-emerald-100 text-emerald-800 border-emerald-200";
  } else if (normalized === "pending" || normalized === "draft") {
    colorClasses = "bg-amber-100 text-amber-800 border-amber-200";
  } else if (normalized === "suspended" || normalized === "cancelled" || normalized === "inactive") {
    colorClasses = "bg-rose-100 text-rose-800 border-rose-200";
  } else if (normalized === "expired") {
    colorClasses = "bg-slate-100 text-slate-700 border-slate-200";
  }

  const display = label || normalized.charAt(0).toUpperCase() + normalized.slice(1);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${colorClasses}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          normalized === "active" || normalized === "published"
            ? "bg-emerald-600"
            : normalized === "pending" || normalized === "draft"
            ? "bg-amber-600"
            : normalized === "suspended" || normalized === "cancelled"
            ? "bg-rose-600"
            : "bg-slate-500"
        }`}
      />
      {display}
    </span>
  );
}
