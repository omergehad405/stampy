"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { LuLock, LuEye, LuEyeOff, LuCoffee, LuClock, LuShieldCheck } from "react-icons/lu";
import { MdCheckCircleOutline, MdWarningAmber } from "react-icons/md";
import { toast } from "react-toastify";
import { apiResetPassword } from "@/app/lib/authApi";

const inputBase =
  "w-full h-[44px] rounded-xl border border-[#e8dfca] bg-[#ffffff] px-3 text-sm " +
  "text-[#3b2418] placeholder-[#3b2418]/40 outline-none transition " +
  "focus:border-[#8ec5ff] focus:ring-2 focus:ring-[#8ec5ff]/40";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(4);

  // Auto redirect after successful password reset
  useEffect(() => {
    let timer;
    if (isSuccess && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (isSuccess && countdown === 0) {
      router.push("/login");
    }
    return () => clearTimeout(timer);
  }, [isSuccess, countdown, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!token) {
      setErrorMessage("Reset token is missing. Please follow the link sent to your email.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Password and password confirmation do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await apiResetPassword({
        token,
        password,
        confirmPassword,
      });

      setIsSuccess(true);
      toast.success(res.message || "Password reset successfully!");
    } catch (err) {
      const msg = err.message || "Failed to reset password. The link may have expired.";
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
            <span className="text-xs font-bold tracking-wider text-[#3b2418]">Notch LOYALTY</span>
          </div>

          {!token ? (
            /* Missing Token Warning */
            <div className="mt-5 text-left">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                <MdWarningAmber className="h-7 w-7" />
              </div>

              <h2 className="mt-4 text-xl font-bold text-[#3b2418]">
                Invalid or Missing Link
              </h2>

              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#3b2418]/80">
                This password reset link is missing its security token. Please make sure you clicked the complete link sent to your email.
              </p>

              <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-100/70 p-3 text-xs text-amber-900">
                <LuClock className="mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  Remember that password reset links are time-limited and expire in <strong>15 minutes</strong>.
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-2.5">
                <Link
                  href="/forgot-password"
                  className="h-[44px] w-full rounded-xl bg-[#8ec5ff] text-sm font-bold text-[#3b2418] flex items-center justify-center transition hover:opacity-90"
                >
                  Request a New Link
                </Link>
                <Link
                  href="/login"
                  className="h-[42px] w-full rounded-xl border border-[#d8cdb5] text-xs font-bold text-[#3b2418] flex items-center justify-center hover:bg-[#e8dfca]/50 transition"
                >
                  Back to Sign In
                </Link>
              </div>
            </div>
          ) : !isSuccess ? (
            /* Reset Password Form */
            <>
              <h1 className="mt-5 text-2xl font-bold text-[#3b2418] sm:text-3xl">
                Reset Password
              </h1>

              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#3b2418]/75">
                Choose a new secure password for your Notch loyalty account.
              </p>

              {/* 15 Minutes Expiration Warning Notice */}
              <div className="mt-5 flex items-start gap-3 rounded-xl border border-[#d6a543]/40 bg-[#fff5df] p-3.5 text-xs text-[#6e4605]">
                <LuClock className="mt-0.5 h-4 w-4 shrink-0 text-[#b47a16]" />
                <div className="leading-snug">
                  <span className="font-bold">15-Minute Expiry: </span>
                  This session is temporary and valid for <strong>15 minutes</strong> from the time requested.
                </div>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="mt-4 rounded-xl border border-rose-300 bg-rose-50 px-3.5 py-2.5 text-xs text-rose-800 space-y-1.5">
                  <div className="font-medium">{errorMessage}</div>
                  {errorMessage.includes("expired") && (
                    <div>
                      <Link
                        href="/forgot-password"
                        className="underline font-bold text-rose-900 hover:text-black"
                      >
                        Request a fresh reset link &rarr;
                      </Link>
                    </div>
                  )}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-5 space-y-3.5" noValidate>
                {/* New Password */}
                <div>
                  <label htmlFor="password" className="mb-1 block text-xs font-semibold text-[#3b2418]">
                    New Password <span className="font-normal text-[#3b2418]/60">(min. 8 characters)</span>
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#3b2418]/50">
                      <LuLock className="h-4 w-4" />
                    </span>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setErrorMessage("");
                      }}
                      required
                      minLength={8}
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
                </div>

                {/* Confirm New Password */}
                <div>
                  <label htmlFor="confirmPassword" className="mb-1 block text-xs font-semibold text-[#3b2418]">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#3b2418]/50">
                      <LuLock className="h-4 w-4" />
                    </span>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setErrorMessage("");
                      }}
                      required
                      minLength={8}
                      className={`${inputBase} pl-10 pr-10`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3b2418]/50 hover:text-[#3b2418] cursor-pointer"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <LuEyeOff className="h-4 w-4" /> : <LuEye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-3 h-[44px] w-full cursor-pointer rounded-xl bg-[#8ec5ff] text-sm font-bold text-[#3b2418] shadow-xs transition hover:opacity-90 active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#3b2418]/30 border-t-[#3b2418]" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <span>Reset Password</span>
                  )}
                </button>

                <p className="flex items-start gap-2 pt-1 text-[11px] leading-snug text-[#3b2418]/70">
                  <LuShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#3b2418]/60" />
                  <span>
                    Your connection is encrypted. Once updated, your old password will no longer work.
                  </span>
                </p>
              </form>

              {/* Bottom Link Back to Sign In */}
              <div className="mt-6 border-t border-[#e8dfca] pt-4 text-center">
                <p className="text-xs text-[#3b2418]/75">
                  Back to safety?{" "}
                  <Link
                    href="/login"
                    className="font-bold text-[#3b2418] underline hover:opacity-85 ml-1"
                  >
                    Return to sign in
                  </Link>
                </p>
              </div>
            </>
          ) : (
            /* Success State */
            <div className="mt-4 text-left">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <MdCheckCircleOutline className="h-7 w-7" />
              </div>

              <h2 className="mt-4 text-xl font-bold text-[#3b2418]">Password Updated!</h2>

              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#3b2418]/80">
                Your password has been changed successfully. You can now use your new password to sign in.
              </p>

              <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#e8dfca]/60 p-3 text-xs text-[#3b2418]/85">
                <span>Redirecting to login in <strong>{countdown}</strong> seconds...</span>
              </div>

              <div className="mt-5">
                <Link
                  href="/login"
                  className="h-[44px] w-full rounded-xl bg-[#8ec5ff] text-sm font-bold text-[#3b2418] flex items-center justify-center transition hover:opacity-90"
                >
                  Sign In Now
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f2ebda]">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#3b2418]/20 border-t-[#3b2418]" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
