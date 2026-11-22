"use client";

import { useState } from "react";
import Link from "next/link";
import { MdOutlineMailOutline, MdCheckCircleOutline } from "react-icons/md";
import { LuCoffee, LuClock, LuShieldCheck, LuSend } from "react-icons/lu";
import { toast } from "react-toastify";
import { apiForgotPassword } from "@/app/lib/authApi";

const inputBase =
  "w-full h-[44px] rounded-xl border border-[#e8dfca] bg-[#ffffff] px-3 text-sm " +
  "text-[#3b2418] placeholder-[#3b2418]/40 outline-none transition " +
  "focus:border-[#8ec5ff] focus:ring-2 focus:ring-[#8ec5ff]/40";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await apiForgotPassword({ email: cleanEmail });
      setIsSubmitted(true);
      setSubmittedEmail(cleanEmail);
      toast.success(res.message || "Reset link sent! Please check your email.");
    } catch (err) {
      const msg = err.message || "Failed to process request. Please try again.";
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

          {!isSubmitted ? (
            <>
              <h1 className="mt-5 text-2xl font-bold text-[#3b2418] sm:text-3xl">
                Forgot Password?
              </h1>

              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#3b2418]/75">
                Enter your email address and we will send you a secure link to reset your account password.
              </p>

              {/* 15 Minutes Expiration Warning Notice */}
              <div className="mt-5 flex items-start gap-3 rounded-xl border border-[#d6a543]/40 bg-[#fff5df] p-3.5 text-xs text-[#6e4605]">
                <LuClock className="mt-0.5 h-4 w-4 shrink-0 text-[#b47a16]" />
                <div className="leading-snug">
                  <span className="font-bold">15-Minute Expiry: </span>
                  For your security, the reset link will be valid for <strong>15 minutes</strong> only.
                </div>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="mt-4 rounded-xl border border-rose-300 bg-rose-50 px-3.5 py-2.5 text-xs text-rose-800">
                  {errorMessage}
                </div>
              )}

              {/* Form: One Input + One Button */}
              <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
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
                      autoFocus
                      autoComplete="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrorMessage("");
                      }}
                      required
                      className={`${inputBase} pl-10`}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-2 h-[44px] w-full cursor-pointer rounded-xl bg-[#8ec5ff] text-sm font-bold text-[#3b2418] shadow-xs transition hover:opacity-90 active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#3b2418]/30 border-t-[#3b2418]" />
                      <span>Sending Reset Link...</span>
                    </>
                  ) : (
                    <>
                      <LuSend className="h-4 w-4" />
                      <span>Send Reset Link</span>
                    </>
                  )}
                </button>

                <p className="flex items-start gap-2 pt-1 text-[11px] leading-snug text-[#3b2418]/70">
                  <LuShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#3b2418]/60" />
                  <span>
                    We will never ask for your password via email. Follow the secure link to reset your credentials.
                  </span>
                </p>
              </form>

              {/* Bottom Link Back to Sign In */}
              <div className="mt-6 border-t border-[#e8dfca] pt-4 text-center">
                <p className="text-xs text-[#3b2418]/75">
                  Remember your password?{" "}
                  <Link
                    href="/login"
                    className="font-bold text-[#3b2418] underline hover:opacity-85 ml-1"
                  >
                    Sign in here
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

              <h2 className="mt-4 text-xl font-bold text-[#3b2418]">Check Your Email</h2>

              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#3b2418]/80">
                We have dispatched a password reset link to:
                <br />
                <strong className="font-bold text-[#3b2418]">{submittedEmail}</strong>
              </p>

              {/* Expiry Highlight */}
              <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-[#d6a543]/40 bg-[#fff5df] p-3 text-xs text-[#6e4605]">
                <LuClock className="mt-0.5 h-4 w-4 shrink-0 text-[#b47a16]" />
                <div className="leading-snug">
                  Please check your inbox right away. The link will expire in <strong>15 minutes</strong>.
                </div>
              </div>

              <p className="mt-3 text-xs text-[#3b2418]/70">
                Didn&apos;t receive the email? Check your spam/junk folder or request a new link below.
              </p>

              <div className="mt-6 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setEmail(submittedEmail);
                  }}
                  className="h-[42px] w-full cursor-pointer rounded-xl border border-[#d8cdb5] bg-transparent text-xs font-bold text-[#3b2418] hover:bg-[#e8dfca]/50 transition"
                >
                  Resend or Try Another Email
                </button>

                <Link
                  href="/login"
                  className="h-[44px] w-full rounded-xl bg-[#8ec5ff] text-sm font-bold text-[#3b2418] flex items-center justify-center transition hover:opacity-90"
                >
                  Return to Sign In
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
