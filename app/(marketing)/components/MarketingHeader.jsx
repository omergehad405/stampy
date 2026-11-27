"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LuMenu,
  LuX,
  LuArrowRight,
  LuArrowLeft,
  LuCoffee,
  LuUser,
  LuLayoutDashboard,
  LuLanguages,
} from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "@/app/components/ui/ThemeToggle";
import { BRAND, NAV_LINKS } from "../content";
import { useMarketingLanguage, I18N_CONTENT } from "../i18n";
import { useLoyaltyStore } from "@/app/stores/useLoyaltyStore";
import { useDashboardAuthStore } from "@/app/stores/useDashboardAuthStore";
import { getAuthToken } from "@/app/lib/apiClient";

const emptySubscribe = () => () => {};

export default function MarketingHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false);

  const { language, toggleLanguage } = useMarketingLanguage();
  const t = I18N_CONTENT[language] || I18N_CONTENT.en;
  const isRtl = language === "ar";

  // Auth stores
  const customerAuth = useLoyaltyStore((s) => s.isAuthenticated);
  const customerUser = useLoyaltyStore((s) => s.user);
  const cafeAuth = useDashboardAuthStore((s) => s.isAuthenticated);

  // Sync dir and lang on client mount
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("dir", isRtl ? "rtl" : "ltr");
      document.documentElement.setAttribute("lang", language);
    }
  }, [isRtl, language]);

  // Determine user logged-in state safely after hydration
  const token = isClient ? getAuthToken() : null;
  const isCustomer = isClient && Boolean(token) && customerAuth && customerUser?.role === "user";
  const isCafe = isClient && Boolean(token) && cafeAuth;

  let authButton = {
    label: t.header.auth.login,
    href: "/login",
    icon: null,
  };

  if (isCustomer) {
    authButton = {
      label: t.header.auth.account,
      href: "/home",
      icon: LuUser,
    };
  } else if (isCafe) {
    authButton = {
      label: t.header.auth.dashboard,
      href: "/dashboard",
      icon: LuLayoutDashboard,
    };
  }

  const localizedNav = [
    { label: t.header.nav.features, href: "/features" },
    { label: t.header.nav.howItWorks, href: "/how-it-works" },
    { label: t.header.nav.pricing, href: "/pricing" },
  ];

  const ArrowIcon = isRtl ? LuArrowLeft : LuArrowRight;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-(--mainColor)/10 bg-(--bgColor)/90 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* 1. Logo & Brand: Enlarge icon with Notch stamp motif & high contrast subtitle */}
        <Link
          href="/"
          className="flex items-center gap-3 transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--secondColor)"
        >
          {/* Enlarged Notch Stamp Icon */}
          <div className="relative flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-dashed border-(--mainColor)/25 bg-(--mainColor)/5 p-1.5 shadow-2xs transition-transform duration-200 hover:rotate-3">
            <Image
              src="/logo.png"
              alt={`${BRAND.name} stamp logo`}
              width={38}
              height={38}
              className="object-contain"
              priority
            />
          </div>

          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-black tracking-tight text-(--mainColor) leading-tight">
              {BRAND.name}
            </span>
            {/* Min 11px, bold, high contrast subtitle */}
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-(--mainColor)/85 leading-tight">
              {t.header.brandSub}
            </span>
          </div>
        </Link>

        {/* 2. Desktop Navigation Links */}
        <nav aria-label="Main Navigation" className="hidden items-center gap-1.5 md:flex">
          {localizedNav.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`rounded-full px-4 py-1.5 text-sm font-bold transition-colors ${
                  isActive
                    ? "bg-(--mainColor)/10 text-(--mainColor)"
                    : "text-(--mainColor)/80 hover:bg-(--mainColor)/5 hover:text-(--mainColor)"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* 3. Action Controls: Language Switcher, Dark Mode, and Styled Login Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Compact AR/EN Language Switcher Toggle */}
          <button
            type="button"
            onClick={toggleLanguage}
            title={t.header.langAria}
            aria-label={t.header.langAria}
            className="flex items-center gap-1.5 rounded-full border border-(--mainColor)/20 bg-(--bgColor) px-2.5 py-1 sm:px-3 text-xs font-bold text-(--mainColor) transition hover:border-(--mainColor)/40 hover:bg-(--mainColor)/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--secondColor) cursor-pointer"
          >
            <LuLanguages className="h-3.5 w-3.5 text-(--secondColor)" />
            <span>{t.header.langSwitch}</span>
          </button>

          {/* Dark Mode Toggle with Accessible Tooltip and Aria-label */}
          <ThemeToggle className="p-2 rounded-full hover:bg-(--mainColor)/10 text-(--mainColor) transition-colors cursor-pointer" />

          {/* Primary Header Action: Login Button styled in filled accent pill */}
          <Link
            href={authButton.href}
            className="inline-flex items-center gap-1.5 rounded-full bg-(--secondColor) px-4 py-1.5 sm:px-5 sm:py-2 text-xs sm:text-sm font-extrabold text-[#271307] shadow-sm transition hover:opacity-95 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--secondColor)"
          >
            {authButton.icon && <authButton.icon className="h-4 w-4" />}
            <span>{authButton.label}</span>
            {!authButton.icon && <ArrowIcon className="h-3.5 w-3.5 ms-0.5" />}
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? t.header.menuClose : t.header.menuOpen}
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
              {localizedNav.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-xl px-3 py-2 text-sm font-bold text-(--mainColor)/85 transition hover:bg-(--mainColor)/5 hover:text-(--mainColor)"
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-3 border-t border-(--mainColor)/10 flex flex-col gap-2">
                <Link
                  href={authButton.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-(--secondColor) py-2.5 text-sm font-extrabold text-[#271307] shadow-xs transition hover:opacity-95"
                >
                  {authButton.icon && <authButton.icon className="h-4 w-4" />}
                  <span>{authButton.label}</span>
                </Link>

                <div className="pt-1">
                  <Link
                    href="/login?as=customer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-(--mainColor)/25 bg-(--bgColor) py-2 text-xs font-bold text-(--mainColor)"
                  >
                    <LuUser className="h-3.5 w-3.5" />
                    <span>{t.common.customerCard}</span>
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
