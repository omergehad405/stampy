"use client";

import React, { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LuMenu, LuX, LuArrowRight, LuCoffee, LuUser, LuLayoutDashboard } from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "@/app/components/ui/ThemeToggle";
import { BRAND, NAV_LINKS } from "../content";
import { useLoyaltyStore } from "@/app/stores/useLoyaltyStore";
import { useDashboardAuthStore } from "@/app/stores/useDashboardAuthStore";
import { getAuthToken } from "@/app/lib/apiClient";

const emptySubscribe = () => () => {};

export default function MarketingHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false);

  // Auth stores
  const customerAuth = useLoyaltyStore((s) => s.isAuthenticated);
  const customerUser = useLoyaltyStore((s) => s.user);
  const cafeAuth = useDashboardAuthStore((s) => s.isAuthenticated);

  // Determine user logged-in state safely after hydration
  const token = isClient ? getAuthToken() : null;
  const isCustomer = isClient && Boolean(token) && customerAuth && customerUser?.role === "user";
  const isCafe = isClient && Boolean(token) && cafeAuth;

  let authButton = {
    label: "Log in",
    href: "/login",
    icon: null,
  };

  if (isCustomer) {
    authButton = {
      label: "Open my account",
      href: "/home",
      icon: LuUser,
    };
  } else if (isCafe) {
    authButton = {
      label: "Open dashboard",
      href: "/dashboard",
      icon: LuLayoutDashboard,
    };
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-(--mainColor)/10 bg-(--bgColor)/85 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand & Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--secondColor)"
        >
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl p-1 rounded-lg">
            <Image
              src="/logo.png"
              alt={BRAND.name}
              width={32}
              height={32}
              className="object-contain rounded-lg"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-extrabold tracking-tight text-(--mainColor)">
              {BRAND.name}
            </span>
            <span className="hidden text-[10px] font-semibold uppercase tracking-wider text-(--mainColor)/60 sm:inline-block">
              Digital Loyalty
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav aria-label="Main Navigation" className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-(--mainColor)/10 text-(--mainColor)"
                    : "text-(--mainColor)/75 hover:bg-(--mainColor)/5 hover:text-(--mainColor)"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls & Theme Toggle */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <ThemeToggle />

          {/* Dynamic Account / Login Button */}
          <Link
            href={authButton.href}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-(--mainColor)/20 bg-(--bgColor) px-4 py-1.5 text-xs sm:text-sm font-bold text-(--mainColor) transition hover:border-(--mainColor)/40 hover:bg-(--mainColor)/5"
          >
            {authButton.icon && <authButton.icon className="h-4 w-4" />}
            <span>{authButton.label}</span>
          </Link>

          {/* Secondary CTA: Get started */}
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 rounded-full bg-(--secondColor) px-4 py-1.5 text-xs sm:text-sm font-bold text-(--mainColor) shadow-xs transition hover:opacity-90 active:scale-[0.98]"
          >
            <span>Get started</span>
            <LuArrowRight className="h-3.5 w-3.5" />
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-(--mainColor)/15 text-(--mainColor) transition hover:bg-(--mainColor)/5 md:hidden"
          >
            {mobileMenuOpen ? <LuX className="h-5 w-5" /> : <LuMenu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-b border-(--mainColor)/10 bg-(--bgColor) md:hidden"
          >
            <div className="space-y-1.5 px-4 pt-3 pb-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-xl px-3 py-2 text-sm font-semibold text-(--mainColor)/85 transition hover:bg-(--mainColor)/5 hover:text-(--mainColor)"
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-3 border-t border-(--mainColor)/10 flex flex-col gap-2">
                <Link
                  href={authButton.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-(--mainColor)/20 py-2.5 text-sm font-bold text-(--mainColor)"
                >
                  {authButton.icon && <authButton.icon className="h-4 w-4" />}
                  <span>{authButton.label}</span>
                </Link>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    href="/login?as=customer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-(--secondColor) py-2.5 text-xs font-bold text-[#3B2418]"
                  >
                    <LuUser className="h-3.5 w-3.5" />
                    <span>Customer Card</span>
                  </Link>
                  <Link
                    href="/contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-(--mainColor) py-2.5 text-xs font-bold text-(--bgColor)"
                  >
                    <LuCoffee className="h-3.5 w-3.5" />
                    <span>Cafe Partner</span>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
