"use client";

import React, { useState, useRef } from "react";
import {
  LuStore,
  LuExternalLink,
  LuSave,
  LuRotateCcw,
  LuCircleCheck,
  LuShieldCheck,
  LuClock,
  LuMapPin,
  LuPhone,
  LuMail,
  LuGlobe,
  LuInstagram,
  LuFacebook,
  LuUtensils,
  LuPlus,
  LuTrash2,
  LuImage,
  LuUpload,
  LuLink,
} from "react-icons/lu";
import { toast } from "react-toastify";
import DashboardPageHeader from "../components/DashboardPageHeader";
import { useDashboardStore } from "@/app/stores/useDashboardStore";

export default function DashboardCafeProfilePage() {
  const { cafe, updateCafeProfile } = useDashboardStore();

  const [activeTab, setActiveTab] = useState("basic"); // 'basic' | 'about' | 'location' | 'hours' | 'contact' | 'social' | 'menu'
  const [isSaving, setIsSaving] = useState(false);

  // Image upload refs & mode
  const logoFileRef = useRef(null);
  const coverFileRef = useRef(null);
  const [logoMode, setLogoMode] = useState("url"); // 'url' | 'file'
  const [coverMode, setCoverMode] = useState("url"); // 'url' | 'file'

  // Form State initialized from live cafe store
  const [profileForm, setProfileForm] = useState(() => ({
    name: cafe.name || "",
    tagline: cafe.tagline || "",
    category: cafe.category || "",
    establishedYear: cafe.establishedYear || 2021,
    coverImage: cafe.coverImage || "",
    logoImage: cafe.logoImage || "",
    isVerified: cafe.isVerified || false,

    // About
    about: {
      shortDescription: cafe.about?.shortDescription || "",
      fullDescription: cafe.about?.fullDescription || "",
      highlights: cafe.about?.highlights ? [...cafe.about.highlights] : [],
    },

    // Location
    location: {
      address: cafe.location?.address || "",
      district: cafe.location?.district || "",
      city: cafe.location?.city || "",
      postcode: cafe.location?.postcode || "",
      fullAddress: cafe.location?.fullAddress || "",
      directionsHint: cafe.location?.directionsHint || "",
      googleMapsUrl: cafe.location?.googleMapsUrl || "",
    },

    // Opening hours
    openingHours: {
      timezone: cafe.openingHours?.timezone || "Europe/London",
      holidayNotice: cafe.openingHours?.holidayNotice || "",
      schedule: cafe.openingHours?.schedule
        ? cafe.openingHours.schedule.map((s) => ({ ...s }))
        : [
            { day: "Monday", open: "07:30", close: "19:00", isClosed: false },
            { day: "Tuesday", open: "07:30", close: "19:00", isClosed: false },
            { day: "Wednesday", open: "07:30", close: "19:00", isClosed: false },
            { day: "Thursday", open: "07:30", close: "20:00", isClosed: false },
            { day: "Friday", open: "07:30", close: "21:00", isClosed: false },
            { day: "Saturday", open: "08:30", close: "21:00", isClosed: false },
            { day: "Sunday", open: "08:30", close: "18:00", isClosed: false },
          ],
    },

    // Contact
    contact: {
      phone: cafe.contact?.phone || "",
      displayPhone: cafe.contact?.displayPhone || "",
      email: cafe.contact?.email || "",
    },

    // Website
    website: {
      url: cafe.website?.url || "",
      displayUrl: cafe.website?.displayUrl || "",
    },

    // Social Media
    socialMedia: {
      instagram: {
        handle: cafe.socialMedia?.instagram?.handle || "",
        url: cafe.socialMedia?.instagram?.url || "",
      },
      facebook: {
        handle: cafe.socialMedia?.facebook?.handle || "",
        url: cafe.socialMedia?.facebook?.url || "",
      },
      tiktok: {
        handle: cafe.socialMedia?.tiktok?.handle || "",
        url: cafe.socialMedia?.tiktok?.url || "",
      },
      whatsapp: {
        handle: cafe.socialMedia?.whatsapp?.handle || "",
        url: cafe.socialMedia?.whatsapp?.url || "",
      },
    },

    // Menu Categories
    menuPreview: {
      isAvailable: cafe.menuPreview?.isAvailable ?? true,
      note: cafe.menuPreview?.note || "",
      categories: cafe.menuPreview?.categories
        ? cafe.menuPreview.categories.map((c) => ({ ...c }))
        : [],
    },
  }));

  const [newHighlight, setNewHighlight] = useState("");

  // Handle Save
  const handleSave = async (e) => {
    e?.preventDefault();
    setIsSaving(true);

    // Simulate short network delay
    await new Promise((resolve) => setTimeout(resolve, 400));

    updateCafeProfile(profileForm);
    setIsSaving(false);
    toast.success("Cafe profile updated successfully! Changes are live on customer pages.");
  };

  // Reset to current cafe data
  const handleReset = () => {
    setProfileForm({
      ...cafe,
      about: { ...cafe.about, highlights: [...(cafe.about?.highlights || [])] },
      location: { ...cafe.location },
      openingHours: {
        ...cafe.openingHours,
        schedule: (cafe.openingHours?.schedule || []).map((s) => ({ ...s })),
      },
      contact: { ...cafe.contact },
      website: { ...cafe.website },
      socialMedia: { ...cafe.socialMedia },
      menuPreview: {
        ...cafe.menuPreview,
        categories: (cafe.menuPreview?.categories || []).map((c) => ({ ...c })),
      },
    });
    toast.info("Changes reset to saved values.");
  };

  // Add/Remove Highlights
  const addHighlight = () => {
    if (!newHighlight.trim()) return;
    setProfileForm((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        highlights: [...prev.about.highlights, newHighlight.trim()],
      },
    }));
    setNewHighlight("");
  };

  const removeHighlight = (index) => {
    setProfileForm((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        highlights: prev.about.highlights.filter((_, i) => i !== index),
      },
    }));
  };

  // Schedule hours update
  const updateScheduleItem = (index, field, value) => {
    setProfileForm((prev) => {
      const schedule = [...prev.openingHours.schedule];
      schedule[index] = { ...schedule[index], [field]: value };
      return {
        ...prev,
        openingHours: { ...prev.openingHours, schedule },
      };
    });
  };

  // Menu Category Add / Remove
  const addMenuCategory = () => {
    const newCat = {
      id: `cat-${Date.now()}`,
      title: "",
      description: "",
      price: "",
    };
    setProfileForm((prev) => ({
      ...prev,
      menuPreview: {
        ...prev.menuPreview,
        categories: [...prev.menuPreview.categories, newCat],
      },
    }));
  };

  const removeMenuCategory = (id) => {
    setProfileForm((prev) => ({
      ...prev,
      menuPreview: {
        ...prev.menuPreview,
        categories: prev.menuPreview.categories.filter((c) => c.id !== id),
      },
    }));
  };

  const updateMenuCategory = (id, field, value) => {
    setProfileForm((prev) => ({
      ...prev,
      menuPreview: {
        ...prev.menuPreview,
        categories: prev.menuPreview.categories.map((c) =>
          c.id === id ? { ...c, [field]: value } : c
        ),
      },
    }));
  };

  const tabs = [
    { key: "basic", label: "Basic Info & Media" },
    { key: "about", label: "About & Highlights" },
    { key: "location", label: "Location & Address" },
    { key: "hours", label: "Opening Hours" },
    { key: "contact", label: "Contact & Website" },
    { key: "social", label: "Social Media" },
    { key: "menu", label: "Digital Menu" },
  ];

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Cafe Profile Management"
        description="Edit the public information, opening hours, story, and digital menu shown to customers on the Stampy app."
        breadcrumbs={[{ label: "Cafe Profile" }]}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              type="button"
              className="flex items-center gap-1.5 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3.5 py-2 text-xs font-semibold text-(--mainColor) hover:bg-white"
            >
              <LuRotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-1.5 rounded-xl bg-(--mainColor) px-4 py-2 text-xs font-bold text-(--secondColor) shadow-sm hover:opacity-95"
            >
              <LuSave className="h-4 w-4" />
              <span>{isSaving ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        }
      />

      {/* Tabs Bar */}
      <div className="flex gap-1.5 overflow-x-auto rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] p-2 shadow-2xs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === tab.key
                ? "bg-(--mainColor) text-(--secondColor) shadow-xs"
                : "text-(--mainColor)/70 hover:bg-[#ebdcc8]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] p-6 shadow-2xs">
        {/* TAB 1: BASIC INFORMATION & BRANDING */}
        {activeTab === "basic" && (
          <div className="space-y-6">
            <div className="border-b border-[#ebdcc8] pb-3">
              <h3 className="font-bold text-sm text-(--mainColor)">
                Basic Identity & Media
              </h3>
              <p className="text-xs text-(--mainColor)/60">
                Primary business name, branding photography, and category tag.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-(--mainColor) mb-1.5">
                  Cafe Name *
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, name: e.target.value })
                  }
                  className="w-full h-10 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs font-bold text-(--mainColor) outline-none focus:border-(--mainColor)"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-(--mainColor) mb-1.5">
                  Tagline / Subheading
                </label>
                <input
                  type="text"
                  value={profileForm.tagline}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, tagline: e.target.value })
                  }
                  className="w-full h-10 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none focus:border-(--mainColor)"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-(--mainColor) mb-1.5">
                  Category
                </label>
                <input
                  type="text"
                  value={profileForm.category}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, category: e.target.value })
                  }
                  className="w-full h-10 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none focus:border-(--mainColor)"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-(--mainColor) mb-1.5">
                  Established Year
                </label>
                <input
                  type="number"
                  value={profileForm.establishedYear}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      establishedYear: Number(e.target.value),
                    })
                  }
                  className="w-full h-10 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none focus:border-(--mainColor)"
                />
              </div>
            </div>

            {/* Verification status notice */}
            <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-xs text-emerald-900">
              <LuShieldCheck className="h-5 w-5 text-emerald-700" />
              <div>
                <span className="font-bold">Verified Partner Badge: Active</span>
                <p className="text-[11px] text-emerald-800">
                  Verification status is granted by Stampy compliance and displayed publicly on your store profile.
                </p>
              </div>
            </div>

            {/* Visual Assets (Cover & Logo) */}
            <div className="grid grid-cols-1 gap-6 border-t border-[#ebdcc8] pt-6 md:grid-cols-2">
              {/* Logo Image */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-(--mainColor)">
                  Logo Image
                </label>

                {/* Mode toggle */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setLogoMode("url")}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold border transition ${
                      logoMode === "url"
                        ? "bg-(--mainColor) text-(--secondColor) border-(--mainColor)"
                        : "border-[#dacdb9] text-(--mainColor)/70 hover:bg-[#ebdcc8]"
                    }`}
                  >
                    <LuLink className="h-3.5 w-3.5" />
                    Paste URL
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLogoMode("file");
                      setTimeout(() => logoFileRef.current?.click(), 50);
                    }}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold border transition ${
                      logoMode === "file"
                        ? "bg-(--mainColor) text-(--secondColor) border-(--mainColor)"
                        : "border-[#dacdb9] text-(--mainColor)/70 hover:bg-[#ebdcc8]"
                    }`}
                  >
                    <LuUpload className="h-3.5 w-3.5" />
                    Upload from Device
                  </button>
                </div>

                {/* URL input */}
                {logoMode === "url" && (
                  <input
                    type="url"
                    value={profileForm.logoImage}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, logoImage: e.target.value })
                    }
                    placeholder="https://..."
                    className="w-full h-10 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none focus:border-(--mainColor)"
                  />
                )}

                {/* Hidden file input */}
                <input
                  ref={logoFileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      setProfileForm({ ...profileForm, logoImage: ev.target.result });
                      setLogoMode("file");
                    };
                    reader.readAsDataURL(file);
                  }}
                />

                {/* Upload prompt */}
                {logoMode === "file" && !profileForm.logoImage && (
                  <button
                    type="button"
                    onClick={() => logoFileRef.current?.click()}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#dacdb9] bg-[#f5ecdd] py-5 text-xs font-semibold text-(--mainColor)/70 hover:border-(--mainColor)/40"
                  >
                    <LuUpload className="h-5 w-5" />
                    Choose logo from device
                  </button>
                )}

                {/* Preview */}
                <div className="flex items-center gap-3 pt-1">
                  {profileForm.logoImage ? (
                    <>
                      <img
                        src={profileForm.logoImage}
                        alt="Logo preview"
                        className="h-16 w-16 rounded-xl object-cover border-2 border-[#dacdb9]"
                      />
                      <div className="text-[11px] text-(--mainColor)/60 space-y-1">
                        <p>Recommended: Square 1:1 (400×400px)</p>
                        <button
                          type="button"
                          onClick={() => {
                            setProfileForm({ ...profileForm, logoImage: "" });
                            setLogoMode("url");
                            if (logoFileRef.current) logoFileRef.current.value = "";
                          }}
                          className="text-rose-700 font-semibold hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </>
                  ) : (
                    <span className="text-[11px] text-(--mainColor)/50">No logo set yet.</span>
                  )}
                </div>
              </div>

              {/* Cover Image */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-(--mainColor)">
                  Hero Cover Image
                </label>

                {/* Mode toggle */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCoverMode("url")}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold border transition ${
                      coverMode === "url"
                        ? "bg-(--mainColor) text-(--secondColor) border-(--mainColor)"
                        : "border-[#dacdb9] text-(--mainColor)/70 hover:bg-[#ebdcc8]"
                    }`}
                  >
                    <LuLink className="h-3.5 w-3.5" />
                    Paste URL
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCoverMode("file");
                      setTimeout(() => coverFileRef.current?.click(), 50);
                    }}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold border transition ${
                      coverMode === "file"
                        ? "bg-(--mainColor) text-(--secondColor) border-(--mainColor)"
                        : "border-[#dacdb9] text-(--mainColor)/70 hover:bg-[#ebdcc8]"
                    }`}
                  >
                    <LuUpload className="h-3.5 w-3.5" />
                    Upload from Device
                  </button>
                </div>

                {/* URL input */}
                {coverMode === "url" && (
                  <input
                    type="url"
                    value={profileForm.coverImage}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, coverImage: e.target.value })
                    }
                    placeholder="https://..."
                    className="w-full h-10 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none focus:border-(--mainColor)"
                  />
                )}

                {/* Hidden file input */}
                <input
                  ref={coverFileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      setProfileForm({ ...profileForm, coverImage: ev.target.result });
                      setCoverMode("file");
                    };
                    reader.readAsDataURL(file);
                  }}
                />

                {/* Upload prompt */}
                {coverMode === "file" && !profileForm.coverImage && (
                  <button
                    type="button"
                    onClick={() => coverFileRef.current?.click()}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#dacdb9] bg-[#f5ecdd] py-5 text-xs font-semibold text-(--mainColor)/70 hover:border-(--mainColor)/40"
                  >
                    <LuUpload className="h-5 w-5" />
                    Choose cover photo from device
                  </button>
                )}

                {/* Preview */}
                <div className="pt-1">
                  {profileForm.coverImage ? (
                    <>
                      <img
                        src={profileForm.coverImage}
                        alt="Cover preview"
                        className="h-24 w-full rounded-xl object-cover border border-[#dacdb9]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setProfileForm({ ...profileForm, coverImage: "" });
                          setCoverMode("url");
                          if (coverFileRef.current) coverFileRef.current.value = "";
                        }}
                        className="mt-1.5 text-xs font-semibold text-rose-700 hover:underline"
                      >
                        Remove
                      </button>
                    </>
                  ) : (
                    <span className="text-[11px] text-(--mainColor)/50">No cover image set yet.</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ABOUT & HIGHLIGHTS */}
        {activeTab === "about" && (
          <div className="space-y-6">
            <div className="border-b border-[#ebdcc8] pb-3">
              <h3 className="font-bold text-sm text-(--mainColor)">
                Story & Cafe Features
              </h3>
              <p className="text-xs text-(--mainColor)/60">
                Craft the narrative customer read when discovering your cafe.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-(--mainColor) mb-1.5">
                Short Description (Card Teaser)
              </label>
              <textarea
                rows={2}
                value={profileForm.about.shortDescription}
                onChange={(e) =>
                  setProfileForm({
                    ...profileForm,
                    about: {
                      ...profileForm.about,
                      shortDescription: e.target.value,
                    },
                  })
                }
                className="w-full rounded-xl border border-[#dacdb9] bg-[#f5ecdd] p-3 text-xs text-(--mainColor) outline-none focus:border-(--mainColor)"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-(--mainColor) mb-1.5">
                Full Cafe Story
              </label>
              <textarea
                rows={5}
                value={profileForm.about.fullDescription}
                onChange={(e) =>
                  setProfileForm({
                    ...profileForm,
                    about: {
                      ...profileForm.about,
                      fullDescription: e.target.value,
                    },
                  })
                }
                className="w-full rounded-xl border border-[#dacdb9] bg-[#f5ecdd] p-3 text-xs text-(--mainColor) outline-none focus:border-(--mainColor)"
              />
            </div>

            {/* Highlights Tag Manager */}
            <div>
              <label className="block text-xs font-bold text-(--mainColor) mb-1.5">
                Key Features & Amenities
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {profileForm.about.highlights.map((tag, idx) => (
                  <span
                    key={idx}
                    className="flex items-center gap-1.5 rounded-full border border-[#dacdb9] bg-white px-3 py-1 text-xs font-medium text-(--mainColor)"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeHighlight(idx)}
                      className="text-(--mainColor)/50 hover:text-rose-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2 max-w-sm">
                <input
                  type="text"
                  value={newHighlight}
                  onChange={(e) => setNewHighlight(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addHighlight()}
                  placeholder="e.g. Pet-Friendly Patio"
                  className="h-9 flex-1 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none"
                />
                <button
                  type="button"
                  onClick={addHighlight}
                  className="rounded-xl bg-(--mainColor) px-3 py-1.5 text-xs font-bold text-(--secondColor)"
                >
                  Add Tag
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: LOCATION & MAP */}
        {activeTab === "location" && (
          <div className="space-y-6">
            <div className="border-b border-[#ebdcc8] pb-3">
              <h3 className="font-bold text-sm text-(--mainColor)">
                Address & Navigation
              </h3>
              <p className="text-xs text-(--mainColor)/60">
                Physical premises location, postal details, and Google Maps URL.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-(--mainColor) mb-1.5">
                  Street Address
                </label>
                <input
                  type="text"
                  value={profileForm.location.address}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      location: {
                        ...profileForm.location,
                        address: e.target.value,
                      },
                    })
                  }
                  className="w-full h-10 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none focus:border-(--mainColor)"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-(--mainColor) mb-1.5">
                  District / Neighborhood
                </label>
                <input
                  type="text"
                  value={profileForm.location.district}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      location: {
                        ...profileForm.location,
                        district: e.target.value,
                      },
                    })
                  }
                  className="w-full h-10 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none focus:border-(--mainColor)"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-(--mainColor) mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  value={profileForm.location.city}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      location: { ...profileForm.location, city: e.target.value },
                    })
                  }
                  className="w-full h-10 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none focus:border-(--mainColor)"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-(--mainColor) mb-1.5">
                  Postcode / Zip
                </label>
                <input
                  type="text"
                  value={profileForm.location.postcode}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      location: {
                        ...profileForm.location,
                        postcode: e.target.value,
                      },
                    })
                  }
                  className="w-full h-10 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none focus:border-(--mainColor)"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-(--mainColor) mb-1.5">
                  Full Formatted Address
                </label>
                <input
                  type="text"
                  value={profileForm.location.fullAddress}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      location: {
                        ...profileForm.location,
                        fullAddress: e.target.value,
                      },
                    })
                  }
                  className="w-full h-10 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none focus:border-(--mainColor)"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-(--mainColor) mb-1.5">
                  Directions Hint / Landmark
                </label>
                <input
                  type="text"
                  value={profileForm.location.directionsHint}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      location: {
                        ...profileForm.location,
                        directionsHint: e.target.value,
                      },
                    })
                  }
                  className="w-full h-10 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none focus:border-(--mainColor)"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-(--mainColor) mb-1.5">
                  Google Maps URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={profileForm.location.googleMapsUrl}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        location: {
                          ...profileForm.location,
                          googleMapsUrl: e.target.value,
                        },
                      })
                    }
                    className="flex-1 h-10 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none focus:border-(--mainColor)"
                  />
                  {profileForm.location.googleMapsUrl && (
                    <a
                      href={profileForm.location.googleMapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 rounded-xl border border-[#dacdb9] bg-white px-3 text-xs font-semibold text-(--mainColor) hover:bg-white"
                    >
                      <LuExternalLink className="h-3.5 w-3.5" />
                      <span>Test Map Link</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: OPENING HOURS */}
        {activeTab === "hours" && (
          <div className="space-y-6">
            <div className="border-b border-[#ebdcc8] pb-3">
              <h3 className="font-bold text-sm text-(--mainColor)">
                Weekly Operating Schedule
              </h3>
              <p className="text-xs text-(--mainColor)/60">
                Configure opening and closing times for each day of the week.
              </p>
            </div>

            <div className="space-y-2.5">
              {profileForm.openingHours.schedule.map((dayItem, idx) => (
                <div
                  key={dayItem.day}
                  className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-[#dacdb9] bg-[#f5ecdd] p-3 text-xs gap-3"
                >
                  <div className="flex items-center gap-3 w-36">
                    <span className="font-bold text-(--mainColor)">
                      {dayItem.day}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-(--mainColor)">
                      <input
                        type="checkbox"
                        checked={!dayItem.isClosed}
                        onChange={(e) =>
                          updateScheduleItem(idx, "isClosed", !e.target.checked)
                        }
                        className="rounded border-[#dacdb9] text-(--mainColor)"
                      />
                      <span>{dayItem.isClosed ? "Closed" : "Open"}</span>
                    </label>

                    {!dayItem.isClosed && (
                      <div className="flex items-center gap-2">
                        <input
                          type="time"
                          value={dayItem.open}
                          onChange={(e) =>
                            updateScheduleItem(idx, "open", e.target.value)
                          }
                          className="h-8 rounded-lg border border-[#dacdb9] bg-white px-2 font-mono text-xs text-(--mainColor)"
                        />
                        <span className="text-(--mainColor)/60">to</span>
                        <input
                          type="time"
                          value={dayItem.close}
                          onChange={(e) =>
                            updateScheduleItem(idx, "close", e.target.value)
                          }
                          className="h-8 rounded-lg border border-[#dacdb9] bg-white px-2 font-mono text-xs text-(--mainColor)"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-xs font-bold text-(--mainColor) mb-1.5">
                Holiday Notice
              </label>
              <input
                type="text"
                value={profileForm.openingHours.holidayNotice}
                onChange={(e) =>
                  setProfileForm({
                    ...profileForm,
                    openingHours: {
                      ...profileForm.openingHours,
                      holidayNotice: e.target.value,
                    },
                  })
                }
                placeholder="e.g. Open on Bank Holidays (Sunday hours apply)"
                className="w-full h-10 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none focus:border-(--mainColor)"
              />
            </div>
          </div>
        )}

        {/* TAB 5: CONTACT & WEBSITE */}
        {activeTab === "contact" && (
          <div className="space-y-6">
            <div className="border-b border-[#ebdcc8] pb-3">
              <h3 className="font-bold text-sm text-(--mainColor)">
                Contact Channels & Website
              </h3>
              <p className="text-xs text-(--mainColor)/60">
                Official phone, email, and web domain.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-(--mainColor) mb-1.5">
                  Phone (Dialable)
                </label>
                <input
                  type="text"
                  value={profileForm.contact.phone}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      contact: {
                        ...profileForm.contact,
                        phone: e.target.value,
                      },
                    })
                  }
                  className="w-full h-10 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none focus:border-(--mainColor)"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-(--mainColor) mb-1.5">
                  Phone (Display Format)
                </label>
                <input
                  type="text"
                  value={profileForm.contact.displayPhone}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      contact: {
                        ...profileForm.contact,
                        displayPhone: e.target.value,
                      },
                    })
                  }
                  className="w-full h-10 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none focus:border-(--mainColor)"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-(--mainColor) mb-1.5">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={profileForm.contact.email}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      contact: {
                        ...profileForm.contact,
                        email: e.target.value,
                      },
                    })
                  }
                  className="w-full h-10 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none focus:border-(--mainColor)"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-(--mainColor) mb-1.5">
                  Official Website URL
                </label>
                <input
                  type="url"
                  value={profileForm.website.url}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      website: {
                        ...profileForm.website,
                        url: e.target.value,
                      },
                    })
                  }
                  className="w-full h-10 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none focus:border-(--mainColor)"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: SOCIAL MEDIA */}
        {activeTab === "social" && (
          <div className="space-y-6">
            <div className="border-b border-[#ebdcc8] pb-3">
              <h3 className="font-bold text-sm text-(--mainColor)">
                Social Media Accounts
              </h3>
              <p className="text-xs text-(--mainColor)/60">
                Connect your social media presence for customer engagement.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Instagram */}
              <div>
                <label className="block text-xs font-bold text-(--mainColor) mb-1.5">
                  Instagram Handle
                </label>
                <input
                  type="text"
                  value={profileForm.socialMedia.instagram?.handle || ""}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      socialMedia: {
                        ...profileForm.socialMedia,
                        instagram: {
                          ...profileForm.socialMedia.instagram,
                          handle: e.target.value,
                        },
                      },
                    })
                  }
                  placeholder="@coffeehouselondon"
                  className="w-full h-10 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none focus:border-(--mainColor)"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-(--mainColor) mb-1.5">
                  Instagram URL
                </label>
                <input
                  type="url"
                  value={profileForm.socialMedia.instagram?.url || ""}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      socialMedia: {
                        ...profileForm.socialMedia,
                        instagram: {
                          ...profileForm.socialMedia.instagram,
                          url: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full h-10 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none focus:border-(--mainColor)"
                />
              </div>

              {/* Facebook */}
              <div>
                <label className="block text-xs font-bold text-(--mainColor) mb-1.5">
                  Facebook Page Handle
                </label>
                <input
                  type="text"
                  value={profileForm.socialMedia.facebook?.handle || ""}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      socialMedia: {
                        ...profileForm.socialMedia,
                        facebook: {
                          ...profileForm.socialMedia.facebook,
                          handle: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full h-10 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none focus:border-(--mainColor)"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-(--mainColor) mb-1.5">
                  Facebook URL
                </label>
                <input
                  type="url"
                  value={profileForm.socialMedia.facebook?.url || ""}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      socialMedia: {
                        ...profileForm.socialMedia,
                        facebook: {
                          ...profileForm.socialMedia.facebook,
                          url: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full h-10 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none focus:border-(--mainColor)"
                />
              </div>

              {/* TikTok */}
              <div>
                <label className="block text-xs font-bold text-(--mainColor) mb-1.5">
                  TikTok Handle
                </label>
                <input
                  type="text"
                  value={profileForm.socialMedia.tiktok?.handle || ""}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      socialMedia: {
                        ...profileForm.socialMedia,
                        tiktok: {
                          ...profileForm.socialMedia.tiktok,
                          handle: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full h-10 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none focus:border-(--mainColor)"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-(--mainColor) mb-1.5">
                  WhatsApp Contact Link
                </label>
                <input
                  type="url"
                  value={profileForm.socialMedia.whatsapp?.url || ""}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      socialMedia: {
                        ...profileForm.socialMedia,
                        whatsapp: {
                          ...profileForm.socialMedia.whatsapp,
                          url: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full h-10 rounded-xl border border-[#dacdb9] bg-[#f5ecdd] px-3 text-xs text-(--mainColor) outline-none focus:border-(--mainColor)"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: DIGITAL MENU */}
        {activeTab === "menu" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#ebdcc8] pb-3">
              <div>
                <h3 className="font-bold text-sm text-(--mainColor)">
                  Digital Menu Items
                </h3>
                <p className="text-xs text-(--mainColor)/60">
                  Manage menu items displayed in the customer menu preview.
                </p>
              </div>

              <button
                type="button"
                onClick={addMenuCategory}
                className="flex items-center gap-1.5 rounded-xl bg-(--mainColor) px-3 py-1.5 text-xs font-bold text-(--secondColor)"
              >
                <LuPlus className="h-4 w-4" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-3.5">
              {profileForm.menuPreview.categories.map((cat, idx) => (
                <div
                  key={cat.id || idx}
                  className="rounded-xl border border-[#dacdb9] bg-[#f5ecdd] p-4 text-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-(--mainColor)">
                      Item #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeMenuCategory(cat.id)}
                      className="text-rose-700 hover:text-rose-900 font-semibold"
                    >
                      <LuTrash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block font-bold text-(--mainColor) mb-1">
                        Item Title
                      </label>
                      <input
                        type="text"
                        value={cat.title}
                        onChange={(e) =>
                          updateMenuCategory(cat.id, "title", e.target.value)
                        }
                        placeholder="e.g. Flat White"
                        className="w-full h-9 rounded-lg border border-[#dacdb9] bg-white px-2.5 text-xs text-(--mainColor) outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-(--mainColor) mb-1">
                        Item Price
                      </label>
                      <input
                        type="text"
                        value={cat.price}
                        onChange={(e) =>
                          updateMenuCategory(cat.id, "price", e.target.value)
                        }
                        placeholder="e.g. £3.50"
                        className="w-full h-9 rounded-lg border border-[#dacdb9] bg-white px-2.5 text-xs text-(--mainColor) outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-bold text-(--mainColor) mb-1">
                        Item Description
                      </label>
                      <input
                        type="text"
                        value={cat.description}
                        onChange={(e) =>
                          updateMenuCategory(cat.id, "description", e.target.value)
                        }
                        placeholder="e.g. Smooth double shot with steamed milk"
                        className="w-full h-9 rounded-lg border border-[#dacdb9] bg-white px-2.5 text-xs text-(--mainColor) outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Save Confirmation Footer */}
      <div className="flex items-center justify-between rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] p-4 shadow-2xs">
        <div className="flex items-center gap-2 text-xs text-(--mainColor)/70">
          <LuCircleCheck className="h-4 w-4 text-emerald-600" />
          <span>Save changes when you are ready to update the live profile.</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="rounded-xl border border-[#dacdb9] bg-white px-4 py-2 text-xs font-semibold text-(--mainColor)"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-xl bg-(--mainColor) px-5 py-2 text-xs font-bold text-(--secondColor) shadow-sm hover:opacity-95"
          >
            {isSaving ? "Saving..." : "Save Cafe Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}
