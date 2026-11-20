"use client";

import React, { useState } from "react";
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
  LuInfo,
} from "react-icons/lu";
import { toast } from "react-toastify";
import { useDashboardAuthStore } from "@/app/stores/useDashboardAuthStore";

export default function DashboardLoginPage() {
  const router = useRouter();
  const { login, isLoading, loginError } = useDashboardAuthStore();

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

  const handleQuickFill = (accountEmail, accountPassword) => {
    setEmail(accountEmail);
    setPassword(accountPassword);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-(--bgColor)">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-[#e3d7c0] bg-[#faf6ed] p-7 sm:p-10 shadow-sm">
        {/* Brand Header */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-(--mainColor) text-(--secondColor) shadow-sm">
            <LuCoffee className="h-7 w-7" />
          </div>
          <div className="mt-4 flex items-center justify-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-(--mainColor)">
              Stampy Cafe Portal
            </h2>
            <span className="rounded-md bg-(--secondColor)/30 px-2 py-0.5 text-xs font-bold text-(--mainColor)">
              Staff
            </span>
          </div>
          <p className="mt-1 text-xs text-(--mainColor)/70">
            Sign in to manage your cafe loyalty program and scan customer visits.
          </p>
        </div>

        {/* Error Alert */}
        {loginError && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-800">
            {loginError}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          {/* Email */}
          <div>
            <label className="mb-1.5 block text-xs font-bold text-(--mainColor)">
              Staff Email Address
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-(--mainColor)/50">
                <LuMail className="h-4 w-4" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@roastedbean.coffee"
                className="w-full h-11 rounded-xl border border-[#e3d7c0] bg-[#f5ecdd] pl-10 pr-3 text-sm text-(--mainColor) placeholder:text-(--mainColor)/40 outline-none transition focus:border-(--mainColor) focus:ring-2 focus:ring-(--secondColor)/40"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-(--mainColor)">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-xs font-medium text-(--mainColor)/70 hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-(--mainColor)/50">
                <LuLock className="h-4 w-4" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 rounded-xl border border-[#e3d7c0] bg-[#f5ecdd] pl-10 pr-10 text-sm text-(--mainColor) placeholder:text-(--mainColor)/40 outline-none transition focus:border-(--mainColor) focus:ring-2 focus:ring-(--secondColor)/40"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-(--mainColor)/50 hover:text-(--mainColor)"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <LuEyeOff className="h-4 w-4" /> : <LuEye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-(--mainColor)/80">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-[#dacdb9] text-(--mainColor) focus:ring-(--secondColor)"
              />
              <span>Remember this workstation</span>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-(--mainColor) text-sm font-bold text-(--secondColor) shadow-sm transition hover:opacity-95 active:scale-98 disabled:opacity-60 cursor-pointer"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-(--secondColor)/30 border-t-(--secondColor)" />
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
        <div className="text-center pt-2">
          <Link
            href="/"
            className="text-xs font-medium text-(--mainColor)/60 hover:text-(--mainColor) underline"
          >
            Looking for customer loyalty card? Go to customer app
          </Link>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl border border-[#ebdcc8] bg-[#faf6ed] p-6 shadow-xl">
            <div className="flex items-center gap-2 text-(--mainColor)">
              <LuShieldCheck className="h-5 w-5 text-emerald-600" />
              <h3 className="font-bold text-sm">Reset Password</h3>
            </div>
            <p className="mt-2 text-xs text-(--mainColor)/75 leading-relaxed">
              For security, employee password resets are initiated by your cafe owner or administrator. Please reach out to your cafe manager or contact support at <strong className="text-(--mainColor)">support@stampy.app</strong>.
            </p>
            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setShowForgotModal(false)}
                className="rounded-xl bg-(--mainColor) px-4 py-2 text-xs font-bold text-(--secondColor)"
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
