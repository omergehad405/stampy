"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LuLayoutDashboard,
  LuQrCode,
  LuUsers,
  LuGift,
  LuStore,
  LuUserCheck,
  LuHistory,
  LuSettings,
  LuLogOut,
  LuX,
  LuCoffee,
  LuShieldCheck,
} from "react-icons/lu";
import { useDashboardAuthStore } from "@/app/stores/useDashboardAuthStore";
import { useDashboardStore } from "@/app/stores/useDashboardStore";

export default function DashboardSidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout } = useDashboardAuthStore();
  const { cafe } = useDashboardStore();

  const handleLogout = async () => {
    await logout();
    window.location.href = "/dashboard/login";
  };

  const role = currentUser?.backendRole || currentUser?.role;
  const roleKey =
    currentUser?.roleKey ||
    (role === "cafeOwner" || role === "admin"
      ? "owner"
      : role === "cafeManager"
        ? "manager"
        : "barista");

  const navItems = [
    {
      label: "Overview",
      href: "/dashboard",
      icon: LuLayoutDashboard,
      isActive: pathname === "/dashboard",
      roles: ["owner", "manager"],
    },
    {
      label: "Scan & Visits",
      href: "/dashboard/scan",
      icon: LuQrCode,
      isActive: pathname === "/dashboard/scan",
      badge: "Scanner",
      highlight: true,
      roles: ["owner", "manager", "barista"],
    },
    {
      label: "Customers",
      href: "/dashboard/customers",
      icon: LuUsers,
      isActive: pathname.startsWith("/dashboard/customers"),
      roles: ["owner", "manager"],
    },
    {
      label: "Rewards",
      href: "/dashboard/rewards",
      icon: LuGift,
      isActive: pathname.startsWith("/dashboard/rewards"),
      roles: ["owner", "manager"],
    },
    {
      label: "Cafe Profile",
      href: "/dashboard/profile",
      icon: LuStore,
      isActive: pathname.startsWith("/dashboard/profile"),
      roles: ["owner", "manager"],
    },
    {
      label: "Users & Staff",
      href: "/dashboard/users",
      icon: LuUserCheck,
      isActive: pathname.startsWith("/dashboard/users"),
      roles: ["owner"], // Only Cafe Owner can manage staff & accounts
    },
    {
      label: "Activity History",
      href: "/dashboard/activity",
      icon: LuHistory,
      isActive: pathname.startsWith("/dashboard/activity"),
      roles: ["owner", "manager", "barista"],
    },
    {
      label: "Settings",
      href: "/dashboard/settings",
      icon: LuSettings,
      isActive: pathname.startsWith("/dashboard/settings"),
      roles: ["owner"], // Only Cafe Owner can alter core settings
    },
  ];

  // Filter navigation items strictly according to the staff member's role
  const visibleNavItems = navItems.filter(
    (item) => !item.roles || item.roles.includes(roleKey)
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col justify-between border-r border-(--bgColor)/15 bg-(--mainColor) text-(--bgColor) transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Top Section */}
        <div className="flex flex-col">
          {/* Brand Header */}
          <div className="flex items-center justify-between border-b border-(--bgColor)/15 px-5 py-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
              onClick={onClose}
            >
              <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl  flex items-center justify-center text-(--bgColor) shadow-sm shrink-0">
                <img src="/logo.png" alt="" className="rounded-xl" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold tracking-tight text-(--bgColor) text-lg leading-tight">
                    Notch
                  </span>
                  <span className="rounded-md bg-(--secondColor) px-1.5 py-0.5 text-[10px] font-bold text-[#3B2418] uppercase">
                    Portal
                  </span>
                </div>
                <span className="text-[11px] font-medium text-(--bgColor)/70">
                  Business Dashboard
                </span>
              </div>
            </Link>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-(--bgColor)/70 hover:bg-(--bgColor)/10 hover:text-(--bgColor) lg:hidden cursor-pointer"
              aria-label="Close sidebar"
            >
              <LuX className="h-5 w-5" />
            </button>
          </div>

          {/* Cafe Mini Identity Card */}
          <div className="m-3.5 rounded-xl border border-(--bgColor)/15 bg-(--bgColor)/10 p-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <img
                src={cafe.logoImage || "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80"}
                alt={cafe.name}
                className="h-10 w-10 rounded-lg object-cover border border-(--bgColor)/20"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <h3 className="truncate text-xs font-bold text-(--bgColor)">
                    {cafe.name}
                  </h3>
                  {cafe.isVerified && (
                    <LuShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-400" title="Verified Cafe" />
                  )}
                </div>
                <p className="truncate text-[11px] text-(--bgColor)/70">
                  {cafe.category || "Specialty Coffee"}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Links (Filtered strictly by Role) */}
          <nav className="flex flex-col gap-1 px-3 py-2" aria-label="Dashboard Navigation">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`group flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition-all duration-150 ${item.isActive
                    ? "bg-(--secondColor) text-[#3B2418] font-bold shadow-xs"
                    : item.highlight
                      ? "bg-(--secondColor)/20 text-(--secondColor) hover:bg-(--secondColor)/30"
                      : "text-(--bgColor)/80 hover:bg-(--bgColor)/10 hover:text-(--bgColor)"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-4.5 w-4.5 transition-transform duration-150 group-hover:scale-105 ${item.isActive
                        ? "text-[#3B2418]"
                        : item.highlight
                          ? "text-(--secondColor)"
                          : "text-(--bgColor)/70"
                        }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${item.isActive
                        ? "bg-(--mainColor) text-(--secondColor)"
                        : "bg-(--secondColor) text-[#3B2418]"
                        }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Profile & Logout */}
        <div className="border-t border-(--bgColor)/15 p-3.5">
          <div className="flex items-center justify-between rounded-xl bg-(--bgColor)/10 border border-(--bgColor)/15 p-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={
                  currentUser?.avatar ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                }
                alt={currentUser?.name || "Staff"}
                className="h-8 w-8 rounded-full object-cover border border-(--bgColor)/20"
              />
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-bold text-(--bgColor)">
                  {currentUser?.name || "Staff Member"}
                </div>
                <div className="mt-0.5 flex items-center gap-1.5">
                  <span
                    className={`inline-block rounded-md px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider ${roleKey === "owner"
                      ? "bg-amber-400/20 text-amber-200 border border-amber-400/40"
                      : roleKey === "manager"
                        ? "bg-blue-400/20 text-blue-200 border border-blue-400/40"
                        : "bg-emerald-400/20 text-emerald-200 border border-emerald-400/40"
                      }`}
                  >
                    {roleKey === "owner"
                      ? "Owner"
                      : roleKey === "manager"
                        ? "Manager"
                        : "Barista"}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-(--bgColor)/70 transition hover:bg-rose-500/20 hover:text-rose-200 cursor-pointer"
              title="Log out of Dashboard"
              aria-label="Log out"
            >
              <LuLogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
