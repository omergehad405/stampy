"use client";

import React from "react";
import Link from "next/link";
import { LuChevronRight } from "react-icons/lu";

export default function DashboardPageHeader({
  title,
  description,
  breadcrumbs = [],
  actions,
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        {breadcrumbs.length > 0 && (
          <nav className="mb-1.5 flex items-center gap-1.5 text-xs text-(--mainColor)/60">
            <Link href="/dashboard" className="hover:text-(--mainColor) transition">
              Dashboard
            </Link>
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                <LuChevronRight className="h-3 w-3 text-(--mainColor)/40" />
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-(--mainColor) transition">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="font-semibold text-(--mainColor)/90">
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
        <h1 className="text-2xl font-bold tracking-tight text-(--mainColor) sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-(--mainColor)/70 max-w-2xl">
            {description}
          </p>
        )}
      </div>

      {actions && <div className="flex flex-wrap items-center gap-2.5">{actions}</div>}
    </div>
  );
}
