"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LuLayoutDashboard,
  LuStore,
  LuUsers,
  LuGift,
  LuCreditCard,
  LuChartBar,
  LuMegaphone,
  LuSettings,
  LuUser,
  LuLogOut,
  LuX,
  LuShield,
  LuChevronRight,
} from "react-icons/lu";
import { useAdminAuthStore } from "@/app/stores/useAdminAuthStore";

const navSections = [
  {
    label: "MAIN",
    items: [
      {
        label: "Overview",
        href: "/admin",
        icon: LuLayoutDashboard,
        exact: true,
      },
      {
        label: "Cafes",
        href: "/admin/cafes",
        icon: LuStore,
      },
      {
        label: "Customers",
        href: "/admin/customers",
        icon: LuUsers,
      },
      {
        label: "Rewards & Activity",
        href: "/admin/rewards-activity",
        icon: LuGift,
      },
    ],
  },
  {
    label: "MANAGEMENT",
    items: [
      {
        label: "Subscriptions & Plans",
        href: "/admin/subscriptions",
        icon: LuCreditCard,
      },
      {
        label: "Analytics",
        href: "/admin/analytics",
        icon: LuChartBar,
      },
      {
        label: "Announcements",
        href: "/admin/announcements",
        icon: LuMegaphone,
      },
    ],
  },
  {
    label: "SYSTEM",
    items: [
      {
        label: "Settings",
        href: "/admin/settings",
        icon: LuSettings,
      },
      {
        label: "Admin Profile",
        href: "/admin/profile",
        icon: LuUser,
      },
    ],
  },
];

export default function AdminSidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentAdmin, logout } = useAdminAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.warn("Logout error:", e);
    }
    window.location.href = "/admin/login";
  };

  const isActive = (href, exact = false) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

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
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col justify-between border-r border-[#e3d7c0] bg-[#faf6ed] text-(--mainColor) transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Top Section */}
        <div className="flex flex-col min-h-0 flex-1">
          {/* Brand Header */}
          <div className="flex items-center justify-between border-b border-[#e8ded0] px-5 py-4 shrink-0">
            <Link
              href="/admin"
              className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
              onClick={onClose}
            >
              <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl  flex items-center justify-center text-(--bgColor) shadow-sm shrink-0">
                <img src="/logo.png" alt="" className="rounded-xl" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold tracking-tight text-(--mainColor) text-lg leading-tight">
                    Stampy
                  </span>
                  <span className="rounded-md bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-700 uppercase">
                    Admin
                  </span>
                </div>
                <span className="text-[11px] font-medium text-(--mainColor)/60">
                  Super Admin Dashboard
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

          {/* Navigation */}
          <nav
            className="flex flex-col gap-0.5 overflow-y-auto px-3 py-3 flex-1"
            aria-label="Admin Navigation"
          >
            {navSections.map((section) => (
              <div key={section.label} className="mb-2">
                {/* Section Label */}
                <p className="mb-1 px-3 text-[10px] font-bold tracking-widest text-(--mainColor)/40 uppercase">
                  {section.label}
                </p>

                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href, item.exact);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={`group flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition-all duration-150 ${active
                          ? "bg-(--mainColor) text-(--bgColor) shadow-xs"
                          : "text-(--mainColor)/80 hover:bg-[#eee3d1] hover:text-(--mainColor)"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`h-4.5 w-4.5 transition-transform duration-150 group-hover:scale-105 ${active
                              ? "text-(--secondColor)"
                              : "text-(--mainColor)/70"
                            }`}
                        />
                        <span>{item.label}</span>
                      </div>
                      {active && (
                        <LuChevronRight className="h-3.5 w-3.5 text-(--secondColor)" />
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom User Profile & Logout */}
        <div className="border-t border-[#e8ded0] p-3.5 shrink-0">
          <div className="flex items-center justify-between rounded-xl bg-[#f2e6d6]/60 p-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={
                  currentAdmin?.avatar ||
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
                }
                alt={currentAdmin?.name || "Admin"}
                className="h-8 w-8 rounded-full object-cover border border-[#d6c7b3]"
              />
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-bold text-(--mainColor)">
                  {currentAdmin?.name || "Stampy Admin"}
                </div>
                <div className="truncate text-[10px] font-medium text-(--mainColor)/60">
                  {currentAdmin?.role || "Super Admin"}
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-(--mainColor)/70 transition hover:bg-rose-100 hover:text-rose-700"
              title="Log out of Admin"
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
