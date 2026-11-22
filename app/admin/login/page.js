"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LuShield,
  LuMail,
  LuLock,
  LuEye,
  LuEyeOff,
  LuArrowRight,
  LuInfo,
} from "react-icons/lu";
import { toast } from "react-toastify";
import { useAdminAuthStore } from "@/app/stores/useAdminAuthStore";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isLoading, loginError } = useAdminAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    const res = await login(email, password);
    if (res.success) {
      toast.success(`Welcome back, ${res.admin.name}!`);
      router.push("/admin");
    } else {
      toast.error(res.error || "Login failed. Check your credentials.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-(--bgColor)">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-[#e3d7c0] bg-(--mainColor) p-7 sm:p-10 shadow-sm">
        {/* Brand Header */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-(--bgColor) text-(--secondColor) shadow-sm">
            <LuShield className="h-7 w-7" />
          </div>
          <div className="mt-4 flex items-center justify-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-(--bgColor)">
              Notch Admin
            </h2>
            <span className="rounded-md bg-(--secondColor)/30 px-2 py-0.5 text-xs font-bold text-(--bgColor)">
              Super Admin
            </span>
          </div>
          <p className="mt-1 text-xs text-(--bgColor)/70">
            Platform administration console. Super Admin access only.
          </p>
        </div>

        {/* Error Alert */}
        {loginError && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-800">
            {loginError}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Email */}
          <div>
            <label className="mb-1.5 block text-xs font-bold text-(--bgColor)">
              Admin Email Address
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
                className="w-full h-11 rounded-xl border border-[#e3d7c0] bg-[#f5ecdd] pl-10 pr-3 text-sm text-(--bgColor) placeholder:text-(--bgColor)/40 outline-none transition focus:border-(--mainColor) focus:ring-2 focus:ring-(--secondColor)/40"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="mb-1.5 block text-xs font-bold text-(--bgColor)">
              Password
            </label>
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
                className="w-full h-11 rounded-xl border border-[#e3d7c0] bg-[#f5ecdd] pl-10 pr-10 text-sm text-(--bgColor) placeholder:text-(--bgColor)/40 outline-none transition focus:border-(--mainColor) focus:ring-2 focus:ring-(--secondColor)/40"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-(--bgColor)/50 hover:text-(--bgColor)"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <LuEyeOff className="h-4 w-4" />
                ) : (
                  <LuEye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-(--secondColor) text-sm font-bold text-(--bgColor) shadow-sm transition hover:opacity-95 active:scale-98 disabled:opacity-60 cursor-pointer"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-(--secondColor)/30 border-t-(--secondColor)" />
                Authenticating...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Sign In to Admin Console
                <LuArrowRight className="h-4 w-4" />
              </span>
            )}
          </button>
        </form>



        {/* Navigation Links */}
        <div className="flex flex-col items-center gap-2 pt-1">
          <Link
            href="/"
            className="text-xs font-medium text-(--bgColor)/60 hover:text-(--bgColor) underline transition"
          >
            ← Back to Customer App
          </Link>
          <Link
            href="/dashboard"
            className="text-xs font-medium text-(--bgColor)/60 hover:text-(--bgColor) underline transition"
          >
            Go to Cafe Dashboard →
          </Link>
        </div>

        {/* Security Notice */}
        <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-center text-[11px] text-amber-800 leading-relaxed">
          <LuShield className="inline-block h-3.5 w-3.5 mr-1 -mt-0.5" />
          This portal is restricted to authorized Notch platform administrators only.
        </div>
      </div>
    </div>
  );
}
