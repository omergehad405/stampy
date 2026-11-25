"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  MdOutlineMailOutline,
  MdLocalPhone,
} from "react-icons/md";
import { ImUser } from "react-icons/im";
import {
  LuLock,
  LuEye,
  LuEyeOff,
  LuCoffee,
  LuStore,
  LuShieldCheck,
  LuArrowRight,
  LuArrowLeft,
  LuUser,
  LuTriangleAlert,
  LuSparkles,
} from "react-icons/lu";
import { toast } from "react-toastify";
import { apiRegister, apiLogin, apiLogout } from "@/app/lib/authApi";
import { useLoyaltyStore } from "@/app/stores/useLoyaltyStore";
import { useDashboardAuthStore } from "@/app/stores/useDashboardAuthStore";
import { useDashboardStore } from "@/app/stores/useDashboardStore";
import { getAuthToken, removeAuthToken } from "@/app/lib/apiClient";
import ThemeToggle from "@/app/components/ui/ThemeToggle";

const inputBase =
  "w-full h-11 rounded-xl border border-(--mainColor)/20 bg-(--bgColor) px-3.5 text-sm " +
  "text-(--mainColor) placeholder:text-(--mainColor)/40 outline-none transition " +
  "focus:border-(--secondColor) focus:ring-2 focus:ring-(--secondColor)/40";

function getSafeRedirect(path, fallback) {
  if (path && typeof path === "string" && path.startsWith("/") && !path.startsWith("//")) {
    return path;
  }
  return fallback;
}

function UnifiedLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Selected portal tab: "customer" or "cafe"
  const asParam = searchParams.get("as");
  const activeTab = asParam === "cafe" ? "cafe" : "customer";

  // Mode for customer: "login" or "signup"
  const modeParam = searchParams.get("mode");
  const [customerMode, setCustomerMode] = useState(modeParam === "signup" ? "signup" : "login");

  // Stores
  const {
    user: customerUser,
    setUser: setCustomerUser,
    fetchCurrentUser,
    isAuthenticated: isCustomerAuth,
    logout: logoutCustomer,
  } = useLoyaltyStore();

  const {
    currentUser: cafeUser,
    isAuthenticated: isCafeAuth,
    checkAuth: checkCafeAuth,
    logout: logoutCafe,
  } = useDashboardAuthStore();

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [roleMismatch, setRoleMismatch] = useState(null); // { detected: "customer"|"cafe", targetTab: "customer"|"cafe" }

  const emailInputRef = useRef(null);

  // If already logged in, redirect user directly to their respective area
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      if (isCustomerAuth && customerUser?.role === "user") {
        const nextUrl = getSafeRedirect(searchParams.get("next") || searchParams.get("redirect"), "/home");
        router.replace(nextUrl);
      } else if (isCafeAuth && cafeUser) {
        const nextUrl = getSafeRedirect(searchParams.get("next") || searchParams.get("redirect"), "/dashboard");
        router.replace(nextUrl);
      }
    }
  }, [isCustomerAuth, isCafeAuth, customerUser, cafeUser, router, searchParams]);

  // Autofocus email input on mount and tab switch
  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, [activeTab, customerMode]);

  const switchTab = (tab) => {
    setErrorMessage("");
    setRoleMismatch(null);
    const params = new URLSearchParams(searchParams.toString());
    params.set("as", tab);
    router.replace(`/login?${params.toString()}`);
  };

  // Handle post-login redirection and pending cafe join
  const handleCustomerSuccess = async (user) => {
    setCustomerUser(user);
    await fetchCurrentUser();

    const scanReturnTo = getSafeRedirect(
      searchParams.get("next") || searchParams.get("redirect"),
      ""
    );
    if (scanReturnTo.startsWith("/c/")) {
      router.push(scanReturnTo);
      return;
    }

    // Check if there was a pending cafe to join
    if (typeof window !== "undefined") {
      const pendingJoinRaw = localStorage.getItem("Notch_pending_cafe_join");
      if (pendingJoinRaw) {
        try {
          const pendingCafe = JSON.parse(pendingJoinRaw);
          localStorage.removeItem("Notch_pending_cafe_join");
          if (pendingCafe?.cafeId || pendingCafe?.slug) {
            const target = pendingCafe.cafeId || pendingCafe.slug;
            const joinRes = await useLoyaltyStore.getState().joinCafe(target);
            if (joinRes?.success) {
              toast.success(`🎉 You've joined ${pendingCafe.name || "the café"}! Your loyalty card is ready.`);
            }
            const cafeSlug = pendingCafe.slug || pendingCafe.cafeId;
            router.push(`/cafe/${cafeSlug}`);
            return;
          }
        } catch (err) {
          console.warn("Could not auto-join pending cafe:", err);
        }
      }
    }

    const nextUrl = getSafeRedirect(searchParams.get("next") || searchParams.get("redirect"), "/home");
    router.push(nextUrl);
  };

  const handleCafeSuccess = async (resData) => {
    await checkCafeAuth();
    if (resData?.cafe) {
      useDashboardStore.getState().setCafe(resData.cafe);
    }
    const nextUrl = getSafeRedirect(searchParams.get("next") || searchParams.get("redirect"), "/dashboard");
    router.push(nextUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setRoleMismatch(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      const msg = "Please enter both email and password.";
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    if (activeTab === "customer" && customerMode === "signup") {
      if (!fullName.trim()) {
        const msg = "Please enter your full name.";
        setErrorMessage(msg);
        toast.error(msg);
        return;
      }
      if (password.length < 8) {
        const msg = "Password must be at least 8 characters long.";
        setErrorMessage(msg);
        toast.error(msg);
        return;
      }
    }

    setIsLoading(true);

    try {
      // 1. Customer Registration
      if (activeTab === "customer" && customerMode === "signup") {
        const res = await apiRegister({
          name: fullName.trim(),
          email: cleanEmail,
          password,
          registrationType: "customer",
        });

        if (res.success && res.data?.user) {
          const registeredUser = res.data.user;
          toast.success(`Welcome to Notch, ${registeredUser.name}! Your loyalty card is ready.`);
          await handleCustomerSuccess(registeredUser);
        }
        return;
      }

      // 2. Login Flow (Customer or Cafe)
      const res = await apiLogin({
        email: cleanEmail,
        password,
      });

      if (!res.success || !res.data?.user) {
        throw new Error(res.message || "Invalid email or password.");
      }

      const loggedUser = res.data.user;
      const role = loggedUser.role;

      // Defense: Admin accounts must NOT be exposed here
      if (role === "admin") {
        await apiLogout();
        removeAuthToken();
        logoutCustomer();
        logoutCafe();
        throw new Error("Invalid email or password. Please check your credentials.");
      }

      const isStaffRole = ["cafeOwner", "cafeManager", "cafeBarista"].includes(role);

      // Verify Role vs Active Tab
      if (activeTab === "customer") {
        if (isStaffRole) {
          // Cafe account logged into Customer tab -> REJECT & CLEAR
          await apiLogout();
          removeAuthToken();
          logoutCustomer();
          logoutCafe();

          setRoleMismatch({
            message: "This is a cafe account. Switch to Cafe to log in.",
            targetTab: "cafe",
          });
          return;
        }

        // Valid Customer
        toast.success(`Welcome back, ${loggedUser.name}!`);
        await handleCustomerSuccess(loggedUser);
      } else {
        // ActiveTab is "cafe"
        if (role === "user") {
          // Customer account logged into Cafe tab -> REJECT & CLEAR
          await apiLogout();
          removeAuthToken();
          logoutCustomer();
          logoutCafe();

          setRoleMismatch({
            message: "This is a customer account. Switch to Customer to log in.",
            targetTab: "customer",
          });
          return;
        }

        if (!isStaffRole) {
          await apiLogout();
          removeAuthToken();
          logoutCustomer();
          logoutCafe();
          throw new Error("Invalid email or password. Please check your credentials.");
        }

        // Valid Cafe Staff
        toast.success(`Welcome back, ${loggedUser.name}!`);
        await handleCafeSuccess(res.data);
      }
    } catch (err) {
      const msg = err.message || "Invalid email or password. Please check your credentials.";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-(--bgColor) px-4 py-10 sm:px-6 lg:px-8">
      <div className="w-full max-w-[1040px] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Desktop Marketing Visual Asset */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-between rounded-3xl border border-(--mainColor)/15 bg-(--mainColor)/5 p-8 shadow-sm min-h-[580px]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-(--secondColor) text-[#3B2418]">
                <LuCoffee className="h-5 w-5" />
              </span>
              <span className="font-extrabold text-base tracking-tight text-(--mainColor)">
                Notch
              </span>
            </div>

            <div className="mt-8 space-y-3">
              <span className="inline-block rounded-full bg-(--secondColor)/30 px-3 py-1 text-xs font-bold text-(--mainColor)">
                {activeTab === "cafe" ? "Staff Terminal Portal" : "Customer Loyalty Card"}
              </span>
              <h2 className="text-2xl font-extrabold text-(--mainColor) leading-tight">
                {activeTab === "cafe"
                  ? "Scan customer visits in under a second."
                  : "All your favorite coffee cards in one place."}
              </h2>
              <p className="text-xs leading-relaxed text-(--mainColor)/75">
                {activeTab === "cafe"
                  ? "Manage reward tiers, view lifetime customer stamps, and invite team baristas."
                  : "Collect digital stamps with every visit. Unlock free drinks, pastries, and member perks."}
              </p>
            </div>
          </div>

          {/* Visual Graphic */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="relative w-full max-w-[280px] aspect-4/3 overflow-hidden rounded-2xl border border-(--mainColor)/15 shadow-sm bg-(--bgColor)">
              <Image
                src="/loginPageDesctop.png"
                alt="Notch Loyalty Experience"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          <div className="border-t border-(--mainColor)/10 pt-4 flex items-center justify-between text-xs text-(--mainColor)/60">
            <span>&copy; 2026 Notch</span>
            <ThemeToggle />
          </div>
        </div>

        {/* Right Side: Unified Card */}
        <div className="lg:col-span-7 w-full max-w-[480px] mx-auto">
          {/* Back to Home & Theme Toggle on mobile */}
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-(--mainColor)/70 hover:text-(--mainColor) transition"
            >
              <LuArrowLeft className="h-3.5 w-3.5" />
              <span>Back to home</span>
            </Link>
            <div className="lg:hidden">
              <ThemeToggle />
            </div>
          </div>

          <div className="rounded-3xl border border-(--mainColor)/15 bg-(--mainColor)/5 p-6 sm:p-9 shadow-sm backdrop-blur-xs">
            {/* Top Switcher: "Customer" | "Cafe" with Sliding Pill */}
            <div className="relative rounded-2xl bg-(--mainColor)/10 p-1 flex">
              <button
                type="button"
                onClick={() => switchTab("customer")}
                className={`relative flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition cursor-pointer flex items-center justify-center gap-2 z-10 ${
                  activeTab === "customer"
                    ? "text-[#3B2418]"
                    : "text-(--mainColor)/70 hover:text-(--mainColor)"
                }`}
              >
                <LuUser className="h-4 w-4" />
                <span>Customer</span>
              </button>

              <button
                type="button"
                onClick={() => switchTab("cafe")}
                className={`relative flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition cursor-pointer flex items-center justify-center gap-2 z-10 ${
                  activeTab === "cafe"
                    ? "text-[#3B2418]"
                    : "text-(--mainColor)/70 hover:text-(--mainColor)"
                }`}
              >
                <LuStore className="h-4 w-4" />
                <span>Cafe</span>
              </button>

              {/* Animated Sliding Pill */}
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
                className={`absolute top-1 bottom-1 rounded-xl bg-(--secondColor) shadow-xs ${
                  activeTab === "customer" ? "left-1 w-[calc(50%-4px)]" : "left-[calc(50%+2px)] w-[calc(50%-4px)]"
                }`}
              />
            </div>

            {/* Dynamic Card Header */}
            <div className="mt-6 text-start">
              <div className="flex items-center gap-2 mb-1">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-(--secondColor)/30 text-(--mainColor)">
                  {activeTab === "cafe" ? <LuStore className="h-4 w-4" /> : <LuCoffee className="h-4 w-4" />}
                </span>
                <span className="text-[11px] font-black uppercase tracking-wider text-(--mainColor)/60">
                  {activeTab === "cafe" ? "Staff & Manager Access" : "Customer Loyalty Card"}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-(--mainColor)">
                {activeTab === "cafe"
                  ? "Cafe Staff Login"
                  : customerMode === "login"
                  ? "Welcome Back"
                  : "Create Your Card"}
              </h1>

              <p className="mt-1 text-xs sm:text-sm text-(--mainColor)/75 leading-relaxed">
                {activeTab === "cafe"
                  ? "Sign in with your barista or manager credentials to verify visits and manage rewards."
                  : customerMode === "login"
                  ? "Sign in to access your digital loyalty cards, QR code, and unlocked treats."
                  : "Register once and collect stamps across all participating neighborhood cafes."}
              </p>
            </div>

            {/* Customer Mode Switcher (Sign In vs Sign Up) */}
            {activeTab === "customer" && (
              <div className="mt-4 grid grid-cols-2 rounded-xl bg-(--mainColor)/10 p-1 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => {
                    setCustomerMode("login");
                    setErrorMessage("");
                    setRoleMismatch(null);
                  }}
                  className={`rounded-lg py-2 transition cursor-pointer ${
                    customerMode === "login"
                      ? "bg-(--bgColor) text-(--mainColor) shadow-xs"
                      : "text-(--mainColor)/60 hover:text-(--mainColor)"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCustomerMode("signup");
                    setErrorMessage("");
                    setRoleMismatch(null);
                  }}
                  className={`rounded-lg py-2 transition cursor-pointer ${
                    customerMode === "signup"
                      ? "bg-(--bgColor) text-(--mainColor) shadow-xs"
                      : "text-(--mainColor)/60 hover:text-(--mainColor)"
                  }`}
                >
                  Sign Up Free
                </button>
              </div>
            )}

            {/* Role Mismatch Banner with One-Click Flip Button */}
            {roleMismatch && (
              <div className="mt-4 rounded-2xl border border-amber-500/30 bg-amber-500/15 p-4 text-xs text-amber-950 dark:text-amber-200 space-y-2">
                <div className="flex items-center gap-2 font-bold">
                  <LuTriangleAlert className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>{roleMismatch.message}</span>
                </div>
                <button
                  type="button"
                  onClick={() => switchTab(roleMismatch.targetTab)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-(--secondColor) px-3 py-1.5 text-xs font-bold text-[#3B2418] hover:opacity-90 shadow-2xs cursor-pointer"
                >
                  <span>Switch to {roleMismatch.targetTab === "cafe" ? "Cafe" : "Customer"} Tab</span>
                  <LuArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {/* General Error Message */}
            {errorMessage && !roleMismatch && (
              <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/15 p-3 text-xs text-(--mainColor)">
                {errorMessage}
              </div>
            )}

            {/* Authentication Form */}
            <form onSubmit={handleSubmit} className="mt-5 space-y-3.5" noValidate>
              {/* Full Name (Customer signup only) */}
              {activeTab === "customer" && customerMode === "signup" && (
                <div>
                  <label htmlFor="fullName" className="mb-1 block text-xs font-bold text-(--mainColor)">
                    Your Full Name *
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-(--mainColor)/50">
                      <ImUser className="h-4 w-4" />
                    </span>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      autoComplete="name"
                      placeholder="e.g. Maya Chen"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className={`${inputBase} pl-10`}
                    />
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="mb-1 block text-xs font-bold text-(--mainColor)">
                  {activeTab === "cafe" ? "Staff Email Address *" : "Email Address *"}
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-(--mainColor)/50">
                    <MdOutlineMailOutline className="h-4 w-4" />
                  </span>
                  <input
                    ref={emailInputRef}
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder={
                      activeTab === "cafe" ? "barista@roastedbean.coffee" : "alex@example.com"
                    }
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={`${inputBase} pl-10`}
                  />
                </div>
              </div>

              {/* Phone (Customer signup only) */}
              {activeTab === "customer" && customerMode === "signup" && (
                <div>
                  <label htmlFor="phone" className="mb-1 block text-xs font-bold text-(--mainColor)">
                    Phone Number (Optional)
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-(--mainColor)/50">
                      <MdLocalPhone className="h-4 w-4" />
                    </span>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="+1 (555) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`${inputBase} pl-10`}
                    />
                  </div>
                </div>
              )}

              {/* Password Field */}
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label htmlFor="password" className="text-xs font-bold text-(--mainColor)">
                    Password *{" "}
                    {activeTab === "customer" && customerMode === "signup" && (
                      <span className="font-normal text-(--mainColor)/60">(min. 8 characters)</span>
                    )}
                  </label>

                  {/* Forgot Password Link */}
                  {(activeTab === "cafe" || customerMode === "login") && (
                    <Link
                      href="/forgot-password"
                      className="text-xs font-bold text-(--mainColor) hover:underline"
                    >
                      Forgot password?
                    </Link>
                  )}
                </div>

                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-(--mainColor)/50">
                    <LuLock className="h-4 w-4" />
                  </span>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete={
                      activeTab === "customer" && customerMode === "signup"
                        ? "new-password"
                        : "current-password"
                    }
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={`${inputBase} pl-10 pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-(--mainColor)/50 hover:text-(--mainColor) cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <LuEyeOff className="h-4 w-4" /> : <LuEye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 h-11 w-full cursor-pointer rounded-xl bg-(--secondColor) text-sm font-bold text-[#3B2418] shadow-xs transition hover:opacity-90 active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#3B2418]/30 border-t-[#3B2418]" />
                    <span>Authenticating...</span>
                  </span>
                ) : (
                  <span>
                    {activeTab === "cafe"
                      ? "Sign In to Dashboard"
                      : customerMode === "signup"
                      ? "Create Free Card"
                      : "Sign In to Card"}
                  </span>
                )}
              </button>

              {/* Privacy Notice */}
              <p className="flex items-start gap-2 pt-1 text-[11px] leading-snug text-(--mainColor)/70">
                <LuShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-(--mainColor)/60" />
                <span>
                  {activeTab === "cafe"
                    ? "Authorized cafe personnel only. Visits and redemptions are cryptographically signed."
                    : "Your personal data is encrypted and never shared. We only track your cafe visits."}
                </span>
              </p>
            </form>

            {/* Bottom Actions per Tab */}
            <div className="mt-6 border-t border-(--mainColor)/10 pt-4 text-center text-xs text-(--mainColor)/75">
              {activeTab === "cafe" ? (
                <div className="space-y-2">
                  <p>
                    Don&apos;t have a cafe account yet?{" "}
                    <Link
                      href="/contact"
                      className="font-bold text-(--mainColor) underline hover:opacity-85"
                    >
                      Apply here to partner your cafe
                    </Link>
                  </p>
                  <p className="text-[11px] text-(--mainColor)/60">
                    Barista accounts can also be created by your Cafe Manager in Dashboard Settings.
                  </p>
                </div>
              ) : customerMode === "login" ? (
                <p>
                  Don&apos;t have a loyalty card yet?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setCustomerMode("signup");
                      setErrorMessage("");
                      setRoleMismatch(null);
                    }}
                    className="font-bold text-(--mainColor) underline hover:opacity-85 cursor-pointer ml-1"
                  >
                    Create one in 10 seconds
                  </button>
                </p>
              ) : (
                <p>
                  Already have a Notch card?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setCustomerMode("login");
                      setErrorMessage("");
                      setRoleMismatch(null);
                    }}
                    className="font-bold text-(--mainColor) underline hover:opacity-85 cursor-pointer ml-1"
                  >
                    Sign in here
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-(--bgColor)">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-(--mainColor)/20 border-t-(--mainColor)" />
        </div>
      }
    >
      <UnifiedLoginContent />
    </Suspense>
  );
}
