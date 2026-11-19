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

  const handleLogout = () => {
    logout();
    router.push("/dashboard/login");
  };

  const navItems = [
    {
      label: "Overview",
      href: "/dashboard",
      icon: LuLayoutDashboard,
      isActive: pathname === "/dashboard",
    },
    {
      label: "Scan & Visits",
      href: "/dashboard/scan",
      icon: LuQrCode,
      isActive: pathname === "/dashboard/scan",
      badge: "Scanner",
      highlight: true,
    },
    {
      label: "Customers",
      href: "/dashboard/customers",
      icon: LuUsers,
      isActive: pathname.startsWith("/dashboard/customers"),
    },
    {
      label: "Rewards",
      href: "/dashboard/rewards",
      icon: LuGift,
      isActive: pathname.startsWith("/dashboard/rewards"),
    },
    {
      label: "Cafe Profile",
      href: "/dashboard/profile",
      icon: LuStore,
      isActive: pathname.startsWith("/dashboard/profile"),
    },
    {
      label: "Users & Staff",
      href: "/dashboard/users",
      icon: LuUserCheck,
      isActive: pathname.startsWith("/dashboard/users"),
    },
    {
      label: "Activity History",
      href: "/dashboard/activity",
      icon: LuHistory,
      isActive: pathname.startsWith("/dashboard/activity"),
    },
    {
      label: "Settings",
      href: "/dashboard/settings",
      icon: LuSettings,
      isActive: pathname.startsWith("/dashboard/settings"),
    },
  ];

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
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col justify-between border-r border-[#e3d7c0] bg-[#faf6ed] text-(--mainColor) transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top Section */}
        <div className="flex flex-col">
          {/* Brand Header */}
          <div className="flex items-center justify-between border-b border-[#e8ded0] px-5 py-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
              onClick={onClose}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-(--mainColor) text-(--secondColor) shadow-xs">
                <LuCoffee className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold tracking-tight text-(--mainColor) text-lg leading-tight">
                    Stampy
                  </span>
                  <span className="rounded-md bg-(--secondColor)/25 px-1.5 py-0.5 text-[10px] font-bold text-(--mainColor) uppercase">
                    Portal
                  </span>
                </div>
                <span className="text-[11px] font-medium text-(--mainColor)/60">
                  Business Dashboard
                </span>
              </div>
            </Link>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-(--mainColor)/70 hover:bg-[#ebdcc8] hover:text-(--mainColor) lg:hidden"
              aria-label="Close sidebar"
            >
              <LuX className="h-5 w-5" />
            </button>
          </div>

          {/* Cafe Mini Identity Card */}
          <div className="m-3.5 rounded-xl border border-[#ebdcc8] bg-[#f4ebe0]/60 p-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <img
                src={cafe.logoImage || "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80"}
                alt={cafe.name}
                className="h-10 w-10 rounded-lg object-cover border border-[#dacdb9]"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <h3 className="truncate text-xs font-bold text-(--mainColor)">
                    {cafe.name}
                  </h3>
                  {cafe.isVerified && (
                    <LuShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-700" title="Verified Cafe" />
                  )}
                </div>
                <p className="truncate text-[11px] text-(--mainColor)/65">
                  {cafe.category || "Specialty Coffee"}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 px-3 py-2" aria-label="Dashboard Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`group flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition-all duration-150 ${
                    item.isActive
                      ? "bg-(--mainColor) text-(--bgColor) shadow-xs"
                      : item.highlight
                      ? "bg-(--secondColor)/30 text-(--mainColor) hover:bg-(--secondColor)/50"
                      : "text-(--mainColor)/80 hover:bg-[#eee3d1] hover:text-(--mainColor)"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-4.5 w-4.5 transition-transform duration-150 group-hover:scale-105 ${
                        item.isActive
                          ? "text-(--secondColor)"
                          : item.highlight
                          ? "text-(--mainColor)"
                          : "text-(--mainColor)/70"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        item.isActive
                          ? "bg-(--secondColor) text-(--mainColor)"
                          : "bg-(--mainColor)/15 text-(--mainColor)"
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
        <div className="border-t border-[#e8ded0] p-3.5">
          <div className="flex items-center justify-between rounded-xl bg-[#f2e6d6]/60 p-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={
                  currentUser?.avatar ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                }
                alt={currentUser?.name || "Staff"}
                className="h-8 w-8 rounded-full object-cover border border-[#d6c7b3]"
              />
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-bold text-(--mainColor)">
                  {currentUser?.name || "Elena Rostova"}
                </div>
                <div className="truncate text-[10px] font-medium text-(--mainColor)/60">
                  {currentUser?.role || "Manager"}
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-(--mainColor)/70 transition hover:bg-rose-100 hover:text-rose-700"
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
