"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LuCoffee,
  LuMail,
  LuLock,
  LuEye,
  LuEyeOff,
  LuArrowRight,
  LuShieldCheck,
} from "react-icons/lu";
import { toast } from "react-toastify";
import { useDashboardAuthStore } from "@/app/stores/useDashboardAuthStore";
import { getAuthToken } from "@/app/lib/apiClient";

export default function DashboardLoginPage() {
  const router = useRouter();
  const { login, isLoading, loginError, isAuthenticated } = useDashboardAuthStore();

  useEffect(() => {
    if (isAuthenticated && getAuthToken()) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    const res = await login(email, password);
    if (res.success) {
      toast.success(`Welcome back, ${res.user.name}!`);
      router.push("/dashboard");
    } else {
      toast.error(res.error || "Login failed. Check your credentials.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-(--bgColor)">
      <div className="w-full max-w-md space-y-7 rounded-3xl border border-(--bgColor)/15 bg-(--mainColor) p-7 sm:p-10 shadow-xl text-(--bgColor)">
        {/* Brand Header */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-(--secondColor) text-[#3B2418] shadow-sm">
            <LuCoffee className="h-7 w-7" />
          </div>
          <div className="mt-4 flex items-center justify-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-(--bgColor)">
              Notch Cafe Portal
            </h2>
            <span className="rounded-md bg-(--secondColor) px-2 py-0.5 text-xs font-bold text-[#3B2418]">
              Staff
            </span>
          </div>
          <p className="mt-1.5 text-xs text-(--bgColor)/75 leading-relaxed">
            Sign in to manage your cafe loyalty program, verify members, and scan visits.
          </p>
        </div>

        {/* Error Alert */}
        {loginError && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/15 p-3.5 text-xs text-rose-200">
            {loginError}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          {/* Email */}
          <div>
            <label className="mb-1.5 block text-xs font-bold text-(--bgColor)">
              Staff Email Address
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-(--bgColor)/50">
                <LuMail className="h-4 w-4" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@roastedbean.coffee"
                className="w-full h-11 rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 pl-10 pr-3 text-sm text-(--bgColor) placeholder:text-(--bgColor)/40 outline-none transition focus:border-(--secondColor) focus:ring-2 focus:ring-(--secondColor)/40"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-(--bgColor)">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-xs font-semibold text-(--secondColor) hover:underline cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-(--bgColor)/50">
                <LuLock className="h-4 w-4" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 pl-10 pr-10 text-sm text-(--bgColor) placeholder:text-(--bgColor)/40 outline-none transition focus:border-(--secondColor) focus:ring-2 focus:ring-(--secondColor)/40"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-(--bgColor)/50 hover:text-(--bgColor) cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <LuEyeOff className="h-4 w-4" /> : <LuEye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-(--bgColor)/80">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-(--bgColor)/30 bg-(--bgColor)/10 accent-(--secondColor)"
              />
              <span>Remember this workstation</span>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-(--secondColor) text-sm font-bold text-[#3B2418] shadow-sm transition hover:opacity-95 active:scale-98 disabled:opacity-60 cursor-pointer"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#3B2418]/30 border-t-[#3B2418]" />
                Authenticating...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Sign In to Dashboard
                <LuArrowRight className="h-4 w-4" />
              </span>
            )}
          </button>
        </form>

        {/* Return to Customer App Link */}
        <div className="text-center pt-2 border-t border-(--bgColor)/15">
          <Link
            href="/"
            className="text-xs font-medium text-(--bgColor)/70 hover:text-(--bgColor) underline transition"
          >
            Looking for customer loyalty card? Go to customer app
          </Link>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl border border-(--bgColor)/15 bg-(--mainColor) p-6 shadow-2xl text-(--bgColor)">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-(--secondColor)/20 flex items-center justify-center text-(--secondColor)">
                <LuShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-sm text-(--bgColor)">Reset Password</h3>
            </div>
            <p className="mt-3 text-xs text-(--bgColor)/80 leading-relaxed">
              If your account is registered as a cafe owner or customer, you can use the automated self-service recovery:
            </p>
            <div className="mt-3">
              <Link
                href="/forgot-password"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-(--secondColor) underline hover:opacity-90"
              >
                Go to Password Reset Page &rarr;
              </Link>
            </div>
            <p className="mt-3 text-[11px] text-(--bgColor)/60 leading-relaxed border-t border-(--bgColor)/15 pt-2">
              For barista and staff credentials, password resets can also be updated directly by your Cafe Manager in the Dashboard Users panel.
            </p>
            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setShowForgotModal(false)}
                className="rounded-xl bg-(--secondColor) px-4 py-2 text-xs font-bold text-[#3B2418] cursor-pointer hover:opacity-90 transition"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
