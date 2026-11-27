"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LuMail, LuCircleCheck, LuArrowRight, LuArrowLeft } from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { API_BASE } from "@/app/lib/apiClient";
import { useMarketingLanguage, I18N_CONTENT } from "../i18n";

function ContactFormInner() {
  const { language } = useMarketingLanguage();
  const t = I18N_CONTENT[language] || I18N_CONTENT.en;
  const form = t.contactPage.form;
  const isRtl = language === "ar";
  const ArrowIcon = isRtl ? LuArrowLeft : LuArrowRight;

  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan");

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [planOptions, setPlanOptions] = useState([
    { name: "Starter", label: "Starter (Free)" },
    { name: "Growth", label: "Growth (Most Popular)" },
    { name: "Pro Unlimited", label: "Pro Unlimited" },
  ]);

  useEffect(() => {
    let isCancelled = false;
    fetch(`${API_BASE}/api/plans`)
      .then((r) => r.json())
      .then((res) => {
        if (!isCancelled && res.success && Array.isArray(res.data?.plans) && res.data.plans.length > 0) {
          setPlanOptions(
            res.data.plans.map((p) => ({
              name: p.name,
              label: p.name,
            }))
          );
        }
      })
      .catch(() => {});
    return () => { isCancelled = true; };
  }, []);

  const [formData, setFormData] = useState({
    cafeName: "",
    ownerName: "",
    email: "",
    phone: "",
    city: "",
    plan: planParam || "Growth",
    message: "",
    website: "",
  });

  useEffect(() => {
    if (planParam) setFormData((prev) => ({ ...prev, plan: planParam }));
  }, [planParam]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.cafeName.trim() || !formData.email.trim() || !formData.ownerName.trim()) {
      toast.error(
        isRtl
          ? "يرجى ملء اسم الكافيه واسم المالك والبريد الإلكتروني."
          : "Please fill in your cafe name, owner name, and email."
      );
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to submit your inquiry");
      }

      setSubmitted(true);
      toast.success(data.message || form.successTitle);
    } catch (err) {
      console.error("[Contact form submission]:", err);
      toast.error(
        err.message ||
          (isRtl
            ? "فشل إرسال النموذج. يرجى المحاولة مجدداً أو مراسلتنا مباشرة."
            : "Failed to dispatch message. Please try again or email us directly.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-(--mainColor)/15 bg-(--bgColor) p-6 sm:p-10 shadow-sm">
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="submitted"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            className="py-12 text-center space-y-4"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600">
              <LuCircleCheck className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-(--mainColor)">
              {form.successTitle}
            </h2>
            <p className="mx-auto max-w-md text-xs sm:text-sm text-(--mainColor)/75 leading-relaxed">
              {form.successMessage}
            </p>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  cafeName: "",
                  ownerName: "",
                  email: "",
                  phone: "",
                  city: "",
                  plan: "Growth",
                  message: "",
                  website: "",
                });
              }}
              className="mt-4 rounded-xl border border-(--mainColor)/20 px-5 py-2.5 text-xs font-bold text-(--mainColor) hover:bg-(--mainColor)/5 cursor-pointer transition"
            >
              {form.submitAnother}
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-4"
            noValidate
          >
          {/* Honeypot */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input
              id="website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={formData.website}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Cafe Name */}
            <div>
              <label htmlFor="cafeName" className="block text-xs font-bold text-(--mainColor) mb-1.5">
                {form.cafeNameLabel} *
              </label>
              <input
                id="cafeName"
                name="cafeName"
                type="text"
                required
                value={formData.cafeName}
                onChange={handleChange}
                placeholder={form.cafeNamePlaceholder}
                className="w-full h-11 rounded-xl border border-(--mainColor)/20 bg-(--mainColor)/5 px-3.5 text-sm text-(--mainColor) placeholder:text-(--mainColor)/40 outline-none transition focus:border-(--secondColor) focus:ring-2 focus:ring-(--secondColor)/40"
              />
            </div>

            {/* Owner Name */}
            <div>
              <label htmlFor="ownerName" className="block text-xs font-bold text-(--mainColor) mb-1.5">
                {form.ownerNameLabel} *
              </label>
              <input
                id="ownerName"
                name="ownerName"
                type="text"
                required
                value={formData.ownerName}
                onChange={handleChange}
                placeholder={form.ownerNamePlaceholder}
                className="w-full h-11 rounded-xl border border-(--mainColor)/20 bg-(--mainColor)/5 px-3.5 text-sm text-(--mainColor) placeholder:text-(--mainColor)/40 outline-none transition focus:border-(--secondColor) focus:ring-2 focus:ring-(--secondColor)/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-(--mainColor) mb-1.5">
                {form.emailLabel} *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder={form.emailPlaceholder}
                className="w-full h-11 rounded-xl border border-(--mainColor)/20 bg-(--mainColor)/5 px-3.5 text-sm text-(--mainColor) placeholder:text-(--mainColor)/40 outline-none transition focus:border-(--secondColor) focus:ring-2 focus:ring-(--secondColor)/40"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-xs font-bold text-(--mainColor) mb-1.5">
                {form.phoneLabel}
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder={form.phonePlaceholder}
                className="w-full h-11 rounded-xl border border-(--mainColor)/20 bg-(--mainColor)/5 px-3.5 text-sm text-(--mainColor) placeholder:text-(--mainColor)/40 outline-none transition focus:border-(--secondColor) focus:ring-2 focus:ring-(--secondColor)/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* City */}
            <div>
              <label htmlFor="city" className="block text-xs font-bold text-(--mainColor) mb-1.5">
                {form.cityLabel}
              </label>
              <input
                id="city"
                name="city"
                type="text"
                value={formData.city}
                onChange={handleChange}
                placeholder={form.cityPlaceholder}
                className="w-full h-11 rounded-xl border border-(--mainColor)/20 bg-(--mainColor)/5 px-3.5 text-sm text-(--mainColor) placeholder:text-(--mainColor)/40 outline-none transition focus:border-(--secondColor) focus:ring-2 focus:ring-(--secondColor)/40"
              />
            </div>

            {/* Plan */}
            <div>
              <label htmlFor="plan" className="block text-xs font-bold text-(--mainColor) mb-1.5">
                {form.planLabel}
              </label>
              <select
                id="plan"
                name="plan"
                value={formData.plan}
                onChange={handleChange}
                className="w-full h-11 rounded-xl border border-(--mainColor)/20 bg-(--bgColor) px-3.5 text-sm text-(--mainColor) outline-none transition focus:border-(--secondColor) focus:ring-2 focus:ring-(--secondColor)/40"
              >
                {planOptions.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-xs font-bold text-(--mainColor) mb-1.5">
              {form.messageLabel}
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              placeholder={form.messagePlaceholder}
              className="w-full rounded-xl border border-(--mainColor)/20 bg-(--mainColor)/5 p-3.5 text-sm text-(--mainColor) placeholder:text-(--mainColor)/40 outline-none transition focus:border-(--secondColor) focus:ring-2 focus:ring-(--secondColor)/40"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-(--secondColor) text-sm font-extrabold text-[#271307] shadow-sm transition hover:opacity-90 active:scale-[0.99] disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#271307]/30 border-t-[#271307]" />
                <span>{form.submitting}</span>
              </span>
            ) : (
              <>
                <span>{form.submitBtn}</span>
                <ArrowIcon className="h-4 w-4" />
              </>
            )}
          </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ContactForm() {
  return (
    <Suspense
      fallback={
        <div className="h-96 rounded-3xl border border-(--mainColor)/15 bg-(--bgColor) flex items-center justify-center">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-(--mainColor)/30 border-t-(--mainColor)" />
        </div>
      }
    >
      <ContactFormInner />
    </Suspense>
  );
}
