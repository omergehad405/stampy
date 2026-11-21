"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MdOutlineMailOutline, MdLocalPhone } from "react-icons/md";
import { ImUser } from "react-icons/im";
import { LuLock, LuEye, LuEyeOff, LuCoffee, LuUserCheck, LuShieldCheck } from "react-icons/lu";
import { toast } from "react-toastify";
import { apiRegister, apiLogin } from "@/app/lib/authApi";
import { useLoyaltyStore } from "@/app/stores/useLoyaltyStore";
import { getAuthToken } from "@/app/lib/apiClient";

const HERO_IMAGE = "/loginPageDesctop.png";

const inputBase =
  "w-full h-[42px] rounded-xl border border-[#e8dfca] bg-[#faf6ec] px-3 text-sm " +
  "text-(--mainColor) placeholder:text-(--mainColor)/45 outline-none transition " +
  "focus:border-(--secondColor) focus:ring-2 focus:ring-(--secondColor)/40";

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

  const [mode, setMode] = useState("signup"); // "signup" or "login"
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
          const user = res.data.user;
          toast.success(
            accountType === "cafeOwner"
              ? `Welcome, Cafe Owner ${user.name}! Your account is ready.`
              : `Welcome to Stampy, ${user.name}! Your loyalty card is ready.`
          );

          if (user.role === "user") {
            setUser({
              ...user,
              phone: form.phone ? `${form.countryCode} ${form.phone}` : user.phone,
            });
            fetchCurrentUser();
          }

          handleRoleRedirect(user);
        }
      } else {
        // Mode: Login
        const res = await apiLogin({
          email: form.email.trim(),
          password: form.password,
        });

        if (res.success && res.data?.user) {
          const user = res.data.user;
          toast.success(`Welcome back, ${user.name}!`);

          if (user.role === "user") {
            setUser(user);
            fetchCurrentUser();
          }

          handleRoleRedirect(user);
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
    <main className="min-h-screen text-(--mainColor) lg:grid lg:grid-cols-[1fr_0.85fr] bg-[#f2ebda]">
      {/* Left: form */}
      <section className="flex items-center justify-center px-5 py-8 sm:px-10 lg:px-16">
        <div className="w-full max-w-[420px]">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#d3e0e8]">
              <LuCoffee className="h-4 w-4" />
            </span>
            <span className="text-xs font-bold tracking-wide">STAMPY LOYALTY</span>
          </div>

          <h1 className="mt-5 text-[2rem] leading-[1.15] font-semibold sm:text-4xl">
            {mode === "signup" ? (
              <>
                Create Your
                <br />
                {accountType === "cafeOwner" ? "Cafe Account" : "Loyalty Card"}
              </>
            ) : (
              <>
                Welcome Back
                <br />
                To Stampy
              </>
            )}
          </h1>

          <p className="mt-3 max-w-[340px] text-sm leading-relaxed text-(--mainColor)/80">
            {mode === "signup"
              ? accountType === "cafeOwner"
                ? "Register your cafe to issue loyalty stamps and reward returning patrons."
                : "Join our digital loyalty program and enjoy exclusive rewards with every visit."
              : "Sign in to access your digital loyalty card, rewards, and account settings."}
          </p>

          {/* Mode Tabs (Sign Up vs Sign In) */}
          <div className="mt-5 grid grid-cols-2 rounded-xl bg-[#e8dfca]/60 p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setErrorMessage("");
              }}
              className={`rounded-lg py-2 transition cursor-pointer ${
                mode === "signup"
                  ? "bg-[#faf6ec] text-(--mainColor) shadow-xs"
                  : "text-(--mainColor)/70 hover:text-(--mainColor)"
              }`}
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setErrorMessage("");
              }}
              className={`rounded-lg py-2 transition cursor-pointer ${
                mode === "login"
                  ? "bg-[#faf6ec] text-(--mainColor) shadow-xs"
                  : "text-(--mainColor)/70 hover:text-(--mainColor)"
              }`}
            >
              Sign In
            </button>
          </div>

          {/* Account Type Selector (Only in Sign Up Mode) */}
          {mode === "signup" && (
            <div className="mt-3.5 flex items-center justify-between rounded-xl border border-[#e8dfca] bg-[#faf6ec] p-1.5 text-xs">
              <span className="pl-2 font-medium text-(--mainColor)/70">Account Type:</span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setAccountType("customer")}
                  className={`flex items-center gap-1 rounded-lg px-3 py-1 font-semibold transition cursor-pointer ${
                    accountType === "customer"
                      ? "bg-(--secondColor) text-(--mainColor)"
                      : "text-(--mainColor)/70 hover:bg-[#e8dfca]/50"
                  }`}
                >
                  <LuUserCheck className="h-3.5 w-3.5" />
                  Customer
                </button>
                <button
                  type="button"
                  onClick={() => setAccountType("cafeOwner")}
                  className={`flex items-center gap-1 rounded-lg px-3 py-1 font-semibold transition cursor-pointer ${
                    accountType === "cafeOwner"
                      ? "bg-(--secondColor) text-(--mainColor)"
                      : "text-(--mainColor)/70 hover:bg-[#e8dfca]/50"
                  }`}
                >
                  <LuCoffee className="h-3.5 w-3.5" />
                  Cafe Owner
                </button>
              </div>
            </div>
          )}

          {/* Mobile banner image */}
          <img
            src={HERO_IMAGE}
            alt="Latte in a ceramic cup beside coffee beans"
            className="mt-4 h-[120px] w-full rounded-2xl object-cover object-[50%_65%] shadow-sm lg:hidden"
          />

          {/* Inline Error Message */}
          {errorMessage && (
            <div className="mt-4 rounded-xl border border-rose-300 bg-rose-50 px-3.5 py-2.5 text-xs text-rose-800">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-5 space-y-3.5" noValidate>
            {/* Full name (Sign Up only) */}
            {mode === "signup" && (
              <div>
                <label htmlFor="fullName" className="mb-1 block text-xs font-semibold">
                  {accountType === "cafeOwner" ? "Owner Full Name" : "Full Name"}
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--mainColor)/60">
                    <ImUser />
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

            {/* Email */}
            <div>
              <label htmlFor="email" className="mb-1 block text-xs font-semibold">
                Email Address
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--mainColor)/60">
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
                <label htmlFor="phone" className="mb-1 block text-xs font-semibold">
                  Phone Number (Optional)
                </label>
                <div className="flex gap-2 relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--mainColor)/60">
                    <MdLocalPhone className="h-4 w-4" />
                  </span>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel-national"
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
              <label htmlFor="password" className="mb-1 block text-xs font-semibold">
                Password {mode === "signup" && <span className="font-normal text-(--mainColor)/60">(min. 8 characters)</span>}
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--mainColor)/60">
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-(--mainColor)/60 hover:text-(--mainColor) cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <LuEyeOff className="h-4 w-4" /> : <LuEye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 h-[42px] w-full cursor-pointer rounded-xl bg-(--secondColor) text-sm font-semibold text-(--mainColor) transition hover:opacity-90 active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-(--mainColor)/30 border-t-(--mainColor)" />
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

            <p className="flex max-w-[320px] items-start gap-2 pt-1 text-[11px] leading-snug text-(--mainColor)/75">
              <LuShieldCheck className="mt-0.5 h-3 w-3 shrink-0" />
              <span>
                Your information is safe with us. We only use it to manage your loyalty rewards and account.
              </span>
            </p>
          </form>
        </div>
      </section>

      {/* Right: image panel (desktop only) */}
      <aside className="hidden bg-[#f7f2e6] p-4 lg:block">
        <div className="relative h-full min-h-[calc(100vh-2rem)] overflow-hidden rounded-2xl shadow-sm">
          <img
            src={HERO_IMAGE}
            alt="Latte in a ceramic cup beside coffee beans"
            className="absolute inset-0 h-full w-full rounded-2xl object-cover object-[50%_65%] shadow-sm"
          />
          <span className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full bg-[#faf6ec]/90 px-4 py-2 text-xs backdrop-blur-sm">
            Crafted daily · Earn rewards every cup
          </span>
        </div>
      </aside>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f2ebda]">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-(--mainColor)/20 border-t-(--mainColor)" />
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
