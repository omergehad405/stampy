"use client";

import React, { useState, Suspense } from "react";
import { usePathname } from "next/navigation";
import AdminAuthGuard from "./components/AdminAuthGuard";
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";

function AdminLayoutInner({ children }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // If on admin login page, do not render admin sidebar or header
  if (pathname === "/admin/login") {
    return (
      <div className="-mb-32 md:-mb-28 min-h-screen w-full bg-(--bgColor) text-(--mainColor)">
        {children}
      </div>
    );
  }

  return (
    <AdminAuthGuard>
      <div className="-mb-32 md:-mb-28 min-h-screen flex bg-(--bgColor) text-(--mainColor)">
        {/* Left Admin Sidebar */}
        <AdminSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Admin Area */}
        <div className="flex flex-1 flex-col min-w-0">
          <AdminHeader onToggleSidebar={() => setIsSidebarOpen(true)} />
          <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </AdminAuthGuard>
  );
}

export default function AdminLayout({ children }) {
  return (
    <Suspense fallback={null}>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </Suspense>
  );
}
