"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { MdOutlineMailOutline, MdLocalPhone } from "react-icons/md";
import { ImUser } from "react-icons/im";
import { LuLock, LuEye, LuEyeOff, LuCoffee, LuUserCheck, LuShieldCheck } from "react-icons/lu";
import { toast } from "react-toastify";
import { apiRegister, apiLogin } from "@/app/lib/authApi";
import { useLoyaltyStore } from "@/app/stores/useLoyaltyStore";
import { getAuthToken } from "@/app/lib/apiClient";

const inputBase =
  "w-full h-[44px] rounded-xl border border-[#e8dfca] bg-[#ffffff] px-3 text-sm " +
  "text-[#3b2418] placeholder-[#3b2418]/40 outline-none transition " +
  "focus:border-[#8ec5ff] focus:ring-2 focus:ring-[#8ec5ff]/40";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, setUser, fetchCurrentUser, isAuthenticated } = useLoyaltyStore();

  const handleRoleRedirect = async (currentUser) => {
    const role = currentUser?.role;
    if (role === "cafeOwner" || role === "cafeManager" || role === "cafeBarista") {
      router.push("/dashboard");
      return;
    } else if (role === "admin") {
      router.push("/admin");
      return;
    }

    // Customer role: check if there was a pending cafe to join
    const pendingJoinRaw =
      typeof window !== "undefined"
        ? localStorage.getItem("stampy_pending_cafe_join")
        : null;

    if (pendingJoinRaw) {
      try {
        const pendingCafe = JSON.parse(pendingJoinRaw);
        localStorage.removeItem("stampy_pending_cafe_join");

        if (pendingCafe?.cafeId || pendingCafe?.slug) {
          const target = pendingCafe.cafeId || pendingCafe.slug;
          const joinRes = await useLoyaltyStore.getState().joinCafe(target);
          if (joinRes?.success) {
            toast.success(
              `🎉 You've joined ${pendingCafe.name || "the café"}! Your loyalty card is ready.`
            );
          }
          const cafeSlug = pendingCafe.slug || pendingCafe.cafeId;
          if (typeof window !== "undefined") {
            sessionStorage.setItem(`stampy_welcome_stamp_${cafeSlug}`, "true");
          }
          router.push(`/cafe/${cafeSlug}?welcome=true`);
          return;
        }
      } catch (err) {
        console.warn("Could not auto-join pending cafe:", err);
      }
    }

    const redirectParam = searchParams.get("redirect");
    if (redirectParam && redirectParam.startsWith("/")) {
      router.push(redirectParam);
      return;
    }

    router.push("/");
  };

  useEffect(() => {
    if (isAuthenticated && getAuthToken()) {
      handleRoleRedirect(user);
    }
  }, [isAuthenticated, user]);

  const modeParam = searchParams.get("mode");
  const [mode, setMode] = useState(modeParam === "signup" ? "signup" : "login");
  const [accountType, setAccountType] = useState("customer"); // "customer" or "cafeOwner"
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    countryCode: "+1",
    phone: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setErrorMessage("");
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!form.email || !form.password) {
      const msg = "Please enter both email and password.";
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    if (mode === "signup") {
      if (!form.fullName.trim()) {
        const msg = "Please enter your name.";
        setErrorMessage(msg);
        toast.error(msg);
        return;
      }
      if (form.password.length < 8) {
        const msg = "Password must be at least 8 characters long.";
        setErrorMessage(msg);
        toast.error(msg);
        return;
      }
    }

    setIsLoading(true);

    try {
      if (mode === "signup") {
        const res = await apiRegister({
          name: form.fullName.trim(),
          email: form.email.trim(),
          password: form.password,
          registrationType: accountType === "cafeOwner" ? "cafeOwner" : "customer",
        });

        if (res.success && res.data?.user) {
          const registeredUser = res.data.user;
          toast.success(
            accountType === "cafeOwner"
              ? `Welcome, Cafe Owner ${registeredUser.name}! Your account is ready.`
              : `Welcome to Stampy, ${registeredUser.name}! Your loyalty card is ready.`
          );

          if (registeredUser.role === "user") {
            setUser({
              ...registeredUser,
              phone: form.phone ? `${form.countryCode} ${form.phone}` : registeredUser.phone,
            });
            fetchCurrentUser();
          }

          handleRoleRedirect(registeredUser);
        }
      } else {
        // Mode: Login
        const res = await apiLogin({
          email: form.email.trim(),
          password: form.password,
        });

        if (res.success && res.data?.user) {
          const loggedInUser = res.data.user;
          toast.success(`Welcome back, ${loggedInUser.name}!`);

          if (loggedInUser.role === "user") {
            setUser(loggedInUser);
            fetchCurrentUser();
          }

          handleRoleRedirect(loggedInUser);
        }
      }
    } catch (err) {
      const msg = err.message || "Authentication failed. Please check your credentials.";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f2ebda] px-4 py-10 sm:px-6">
      <div className="w-full max-w-[440px]">
        {/* Card */}
        <div className="rounded-2xl border border-[#e8dfca] bg-[#faf6ec] p-6 sm:p-8 shadow-sm">
          {/* Brand Header */}
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#d3e0e8] text-[#3b2418]">
              <LuCoffee className="h-5 w-5" />
            </span>
            <span className="text-xs font-bold tracking-wider text-[#3b2418]">STAMPY LOYALTY</span>
          </div>

          <h1 className="mt-5 text-2xl font-bold text-[#3b2418] sm:text-3xl">
            {mode === "login"
              ? "Welcome Back"
              : accountType === "cafeOwner"
              ? "Register Your Cafe"
              : "Create Loyalty Card"}
          </h1>

          <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#3b2418]/75">
            {mode === "login"
              ? "Sign in to access your digital loyalty card, rewards, and account settings."
              : accountType === "cafeOwner"
              ? "Register your cafe to start issuing loyalty stamps and rewarding customers."
              : "Join our digital loyalty program and enjoy exclusive rewards with every visit."}
          </p>

          {/* Mode Switcher Tabs */}
          <div className="mt-5 grid grid-cols-2 rounded-xl bg-[#e8dfca]/60 p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setErrorMessage("");
              }}
              className={`rounded-lg py-2 transition cursor-pointer ${
                mode === "login"
                  ? "bg-[#faf6ec] text-[#3b2418] shadow-xs font-bold"
                  : "text-[#3b2418]/65 hover:text-[#3b2418]"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setErrorMessage("");
              }}
              className={`rounded-lg py-2 transition cursor-pointer ${
                mode === "signup"
                  ? "bg-[#faf6ec] text-[#3b2418] shadow-xs font-bold"
                  : "text-[#3b2418]/65 hover:text-[#3b2418]"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Account Type Toggle in Sign Up mode */}
          {mode === "signup" && (
            <div className="mt-4 flex rounded-xl border border-[#e8dfca] bg-[#faf6ec] p-1 text-xs font-medium text-[#3b2418]">
              <button
                type="button"
                onClick={() => setAccountType("customer")}
                className={`flex-1 py-1.5 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  accountType === "customer"
                    ? "bg-[#8ec5ff] text-[#3b2418] font-bold shadow-xs"
                    : "text-[#3b2418]/70 hover:text-[#3b2418]"
                }`}
              >
                <LuUserCheck className="h-3.5 w-3.5" />
                <span>Customer</span>
              </button>
              <button
                type="button"
                onClick={() => setAccountType("cafeOwner")}
                className={`flex-1 py-1.5 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  accountType === "cafeOwner"
                    ? "bg-[#8ec5ff] text-[#3b2418] font-bold shadow-xs"
                    : "text-[#3b2418]/70 hover:text-[#3b2418]"
                }`}
              >
                <LuCoffee className="h-3.5 w-3.5" />
                <span>Cafe Owner</span>
              </button>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="mt-4 rounded-xl border border-rose-300 bg-rose-50 px-3.5 py-2.5 text-xs text-rose-800">
              {errorMessage}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-5 space-y-3.5" noValidate>
            {/* Full Name (Sign Up only) */}
            {mode === "signup" && (
              <div>
                <label htmlFor="fullName" className="mb-1 block text-xs font-semibold text-[#3b2418]">
                  {accountType === "cafeOwner" ? "Owner Full Name" : "Full Name"}
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#3b2418]/50">
                    <ImUser className="h-4 w-4" />
                  </span>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    placeholder={accountType === "cafeOwner" ? "e.g. Elena Rostova" : "Enter your full name"}
                    value={form.fullName}
                    onChange={handleChange}
                    required
                    className={`${inputBase} pl-10`}
                  />
                </div>
              </div>
            )}

            {/* Email Address */}
            <div>
              <label htmlFor="email" className="mb-1 block text-xs font-semibold text-[#3b2418]">
                Email Address
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#3b2418]/50">
                  <MdOutlineMailOutline className="h-4 w-4" />
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email address"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className={`${inputBase} pl-10`}
                />
              </div>
            </div>

            {/* Phone (Sign Up only) */}
            {mode === "signup" && (
              <div>
                <label htmlFor="phone" className="mb-1 block text-xs font-semibold text-[#3b2418]">
                  Phone Number (Optional)
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#3b2418]/50">
                    <MdLocalPhone className="h-4 w-4" />
                  </span>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="e.g. +44 7700 900111"
                    value={form.phone}
                    onChange={handleChange}
                    className={`${inputBase} pl-10`}
                  />
                </div>
              </div>
            )}

            {/* Password */}
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label htmlFor="password" className="text-xs font-semibold text-[#3b2418]">
                  Password {mode === "signup" && <span className="font-normal text-[#3b2418]/60">(min. 8 characters)</span>}
                </label>

                {/* Forget Password Link in Login Mode */}
                {mode === "login" && (
                  <Link
                    href="/forgot-password"
                    className="text-xs font-bold text-[#3b2418] hover:text-[#1d110b] hover:underline transition cursor-pointer"
                  >
                    Forgot password?
                  </Link>
                )}
              </div>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#3b2418]/50">
                  <LuLock className="h-4 w-4" />
                </span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className={`${inputBase} pl-10 pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3b2418]/50 hover:text-[#3b2418] cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <LuEyeOff className="h-4 w-4" /> : <LuEye className="h-4 w-4" />}
                </button>
              </div>

              {/* Bottom Reminder for Forget Password in Login Mode */}
              {mode === "login" && (
                <div className="mt-2 flex items-center justify-between pt-0.5">
                  <span className="text-[11px] text-[#3b2418]/65">Trouble remembering your password?</span>
                  <Link
                    href="/forgot-password"
                    className="text-[11px] font-semibold text-[#3b2418] underline hover:text-[#180e08] transition"
                  >
                    Reset it here
                  </Link>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-3 h-[44px] w-full cursor-pointer rounded-xl bg-[#8ec5ff] text-sm font-bold text-[#3b2418] shadow-xs transition hover:opacity-90 active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#3b2418]/30 border-t-[#3b2418]" />
                  <span>{mode === "signup" ? "Creating Account..." : "Signing In..."}</span>
                </>
              ) : (
                <span>
                  {mode === "signup"
                    ? accountType === "cafeOwner"
                      ? "Register Cafe Account"
                      : "Sign Up Now"
                    : "Sign In to Account"}
                </span>
              )}
            </button>

            {/* Privacy / Safety Notice */}
            <p className="flex items-start gap-2 pt-1 text-[11px] leading-snug text-[#3b2418]/70">
              <LuShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#3b2418]/60" />
              <span>
                Your data is safe and encrypted. We only use it to manage your loyalty rewards and account.
              </span>
            </p>
          </form>

          {/* Bottom Switcher */}
          <div className="mt-6 border-t border-[#e8dfca] pt-4 text-center">
            {mode === "login" ? (
              <p className="text-xs text-[#3b2418]/75">
                Don&apos;t have an account yet?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setErrorMessage("");
                  }}
                  className="font-bold text-[#3b2418] underline hover:opacity-85 cursor-pointer ml-1"
                >
                  Create one now
                </button>
              </p>
            ) : (
              <p className="text-xs text-[#3b2418]/75">
                Already registered with Stampy?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setErrorMessage("");
                  }}
                  className="font-bold text-[#3b2418] underline hover:opacity-85 cursor-pointer ml-1"
                >
                  Sign in here
                </button>
              </p>
            )}
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
        <div className="min-h-screen flex items-center justify-center bg-[#f2ebda]">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#3b2418]/20 border-t-[#3b2418]" />
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
