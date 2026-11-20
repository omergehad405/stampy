"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import AuthGuard from "./components/AuthGuard";
import DashboardSidebar from "./components/DashboardSidebar";
import DashboardHeader from "./components/DashboardHeader";
import DashboardAnnouncementBanner from "./components/DashboardAnnouncementBanner";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // If on dashboard login page, do not render sidebar or header
  if (pathname === "/dashboard/login") {
    return (
      <div className="-mb-32 md:-mb-28 min-h-screen w-full bg-(--bgColor) text-(--mainColor)">
        {children}
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="-mb-32 md:-mb-28 min-h-screen flex bg-(--bgColor) text-(--mainColor)">
        {/* Left Sidebar */}
        <DashboardSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col min-w-0">
          <DashboardHeader onToggleSidebar={() => setIsSidebarOpen(true)} />
          <DashboardAnnouncementBanner />
          <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
