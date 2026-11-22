"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LuMail, LuCircleCheck, LuArrowRight } from "react-icons/lu";
import { toast } from "react-toastify";
import { CONTACT_PAGE_CONTENT } from "../content";
import { API_BASE } from "@/app/lib/apiClient";

function ContactForm() {
  const { form } = CONTACT_PAGE_CONTENT;
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
              label: `${p.name} (${p.price === 0 ? "Free" : `${p.price} ${p.currency || "EGP"}/${p.billingPeriod || "mo"}`})`,
            }))
          );
        }
      })
      .catch(() => {});

    return () => {
      isCancelled = true;
    };
  }, []);

  const [formData, setFormData] = useState({
    cafeName: "",
    ownerName: "",
    email: "",
    phone: "",
    city: "",
    plan: planParam || "Growth",
    message: "",
    website: "", // Honeypot field
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.cafeName.trim() || !formData.email.trim() || !formData.ownerName.trim()) {
      toast.error("Please fill in your cafe name, owner name, and email.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
      toast.error(err.message || "Failed to dispatch message. Please try again or email us directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-(--mainColor)/15 bg-(--bgColor) p-6 sm:p-10 shadow-sm">
      {submitted ? (
        <div className="py-12 text-center space-y-4">
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
            className="mt-4 rounded-xl border border-(--mainColor)/20 px-5 py-2.5 text-xs font-bold text-(--mainColor) hover:bg-(--mainColor)/5 cursor-pointer"
          >
            Submit another inquiry
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Honeypot field hidden from real humans */}
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
                className="w-full h-11 rounded-xl border border-(--mainColor)/20 bg-(--mainColor)/5 px-3.5 text-sm text-(--mainColor) placeholder:(--mainColor)/40 outline-none transition focus:border-(--secondColor) focus:ring-2 focus:ring-(--secondColor)/40"
              />
            </div>

            {/* Owner / Manager Name */}
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
                className="w-full h-11 rounded-xl border border-(--mainColor)/20 bg-(--mainColor)/5 px-3.5 text-sm text-(--mainColor) placeholder:(--mainColor)/40 outline-none transition focus:border-(--secondColor) focus:ring-2 focus:ring-(--secondColor)/40"
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
                className="w-full h-11 rounded-xl border border-(--mainColor)/20 bg-(--mainColor)/5 px-3.5 text-sm text-(--mainColor) placeholder:(--mainColor)/40 outline-none transition focus:border-(--secondColor) focus:ring-2 focus:ring-(--secondColor)/40"
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
                className="w-full h-11 rounded-xl border border-(--mainColor)/20 bg-(--mainColor)/5 px-3.5 text-sm text-(--mainColor) placeholder:(--mainColor)/40 outline-none transition focus:border-(--secondColor) focus:ring-2 focus:ring-(--secondColor)/40"
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
                className="w-full h-11 rounded-xl border border-(--mainColor)/20 bg-(--mainColor)/5 px-3.5 text-sm text-(--mainColor) placeholder:(--mainColor)/40 outline-none transition focus:border-(--secondColor) focus:ring-2 focus:ring-(--secondColor)/40"
              />
            </div>

            {/* Interested Plan Tier */}
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
              className="w-full rounded-xl border border-(--mainColor)/20 bg-(--mainColor)/5 p-3.5 text-sm text-(--mainColor) placeholder:(--mainColor)/40 outline-none transition focus:border-(--secondColor) focus:ring-2 focus:ring-(--secondColor)/40"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-(--mainColor) text-sm font-bold text-(--bgColor) shadow-sm transition hover:opacity-90 active:scale-[0.99] disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-(--bgColor)/30 border-t-(--bgColor)" />
                <span>Submitting application...</span>
              </span>
            ) : (
              <>
                <span>{form.submitBtn}</span>
                <LuArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ContactPage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Information & Partnership Column */}
          <div className="lg:col-span-5 space-y-6">
            <span className="inline-block rounded-full bg-(--secondColor)/30 px-3 py-1 text-xs font-bold text-(--mainColor)">
              {CONTACT_PAGE_CONTENT.tag}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-(--mainColor) tracking-tight">
              {CONTACT_PAGE_CONTENT.title}
            </h1>
            <p className="text-sm sm:text-base leading-relaxed text-(--mainColor)/75">
              {CONTACT_PAGE_CONTENT.subtitle}
            </p>

            <div className="rounded-2xl border border-(--mainColor)/15 bg-(--mainColor)/5 p-6 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-(--mainColor)">
                What happens after you apply?
              </h2>
              <ul className="space-y-3 text-xs sm:text-sm text-(--mainColor)/80">
                <li className="flex items-start gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-(--secondColor) text-[#3B2418] font-bold text-xs">
                    1
                  </span>
                  <span>We confirm your cafe details and customize your stamp targets.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-(--secondColor) text-[#3B2418] font-bold text-xs">
                    2
                  </span>
                  <span>We issue your manager login and barista staff invitations.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-(--secondColor) text-[#3B2418] font-bold text-xs">
                    3
                  </span>
                  <span>Your staff starts scanning visits immediately—no new hardware required.</span>
                </li>
              </ul>

              <div className="pt-3 border-t border-(--mainColor)/10 text-xs text-(--mainColor)/70 flex items-center gap-1.5">
                <LuMail className="h-4 w-4 text-(--mainColor)/60 shrink-0" />
                <span>Direct inquiries: </span>
                <a
                  href={`mailto:${CONTACT_PAGE_CONTENT.contactEmail}`}
                  className="font-bold text-(--mainColor) underline"
                >
                  {CONTACT_PAGE_CONTENT.contactEmail}
                </a>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7">
            <Suspense
              fallback={
                <div className="h-96 rounded-3xl border border-(--mainColor)/15 bg-(--bgColor) flex items-center justify-center">
                  <span className="h-6 w-6 animate-spin rounded-full border-2 border-(--mainColor)/30 border-t-(--mainColor)" />
                </div>
              }
            >
              <ContactForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
