"use client";

import React from "react";
import { LuLink, LuShieldCheck, LuUpload } from "react-icons/lu";

export default function BasicInfoTab({
  profileForm,
  setProfileForm,
  logoMode,
  setLogoMode,
  coverMode,
  setCoverMode,
  logoFileRef,
  coverFileRef,
}) {
  return (
    <div className="space-y-6">
      <div className="border-b border-(--bgColor)/15 pb-3">
        <h3 className="font-bold text-sm text-(--bgColor)">
          Basic Identity & Media
        </h3>
        <p className="text-xs text-(--bgColor)/60">
          Primary business name, branding photography, and category tag.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label className="block text-xs font-bold text-(--bgColor) mb-1.5">
            Cafe Name *
          </label>
          <input
            type="text"
            required
            value={profileForm.name}
            onChange={(e) =>
              setProfileForm({ ...profileForm, name: e.target.value })
            }
            className="w-full h-10 rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 px-3 text-xs font-bold text-(--bgColor) outline-none focus:border-(--secondColor)"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-(--bgColor) mb-1.5">
            Tagline / Subheading
          </label>
          <input
            type="text"
            value={profileForm.tagline}
            onChange={(e) =>
              setProfileForm({ ...profileForm, tagline: e.target.value })
            }
            className="w-full h-10 rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 px-3 text-xs text-(--bgColor) outline-none focus:border-(--secondColor)"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-(--bgColor) mb-1.5">
            Category
          </label>
          <input
            type="text"
            value={profileForm.category}
            onChange={(e) =>
              setProfileForm({ ...profileForm, category: e.target.value })
            }
            className="w-full h-10 rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 px-3 text-xs text-(--bgColor) outline-none focus:border-(--secondColor)"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-(--bgColor) mb-1.5">
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
            className="w-full h-10 rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 px-3 text-xs text-(--bgColor) outline-none focus:border-(--secondColor)"
          />
        </div>
      </div>

      <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-xs text-emerald-900">
        <LuShieldCheck className="h-5 w-5 text-emerald-700" />
        <div>
          <span className="font-bold">Verified Partner Badge: Active</span>
          <p className="text-[11px] text-emerald-800">
            Verification status is granted by Notch compliance and displayed
            publicly on your store profile.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 border-t border-(--bgColor)/15 pt-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-xs font-bold text-(--bgColor)">
            Logo Image
          </label>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setLogoMode("url")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold border transition ${
                logoMode === "url"
                  ? "bg-(--mainColor) text-(--secondColor) border-(--mainColor)"
                  : "border-(--bgColor)/20 text-(--bgColor)/70 hover:bg-(--bgColor)/15"
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
                  : "border-(--bgColor)/20 text-(--bgColor)/70 hover:bg-(--bgColor)/15"
              }`}
            >
              <LuUpload className="h-3.5 w-3.5" />
              Upload from Device
            </button>
          </div>

          {logoMode === "url" && (
            <input
              type="url"
              value={profileForm.logoImage}
              onChange={(e) =>
                setProfileForm({ ...profileForm, logoImage: e.target.value })
              }
              placeholder="https://..."
              className="w-full h-10 rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 px-3 text-xs text-(--bgColor) outline-none focus:border-(--secondColor)"
            />
          )}

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

          {logoMode === "file" && !profileForm.logoImage && (
            <button
              type="button"
              onClick={() => logoFileRef.current?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-(--bgColor)/20 bg-(--bgColor)/10 py-5 text-xs font-semibold text-(--bgColor)/70 hover:border-(--mainColor)/40"
            >
              <LuUpload className="h-5 w-5" />
              Choose logo from device
            </button>
          )}

          <div className="flex items-center gap-3 pt-1">
            {profileForm.logoImage ? (
              <>
                <img
                  src={profileForm.logoImage}
                  alt="Logo preview"
                  className="h-16 w-16 rounded-xl object-cover border-2 border-(--bgColor)/20"
                />
                <div className="text-[11px] text-(--bgColor)/60 space-y-1">
                  <p>Recommended: Square 1:1 (400x400px)</p>
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
              <span className="text-[11px] text-(--bgColor)/50">
                No logo set yet.
              </span>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-(--bgColor)">
            Hero Cover Image
          </label>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setCoverMode("url")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold border transition ${
                coverMode === "url"
                  ? "bg-(--mainColor) text-(--secondColor) border-(--mainColor)"
                  : "border-(--bgColor)/20 text-(--bgColor)/70 hover:bg-(--bgColor)/15"
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
                  : "border-(--bgColor)/20 text-(--bgColor)/70 hover:bg-(--bgColor)/15"
              }`}
            >
              <LuUpload className="h-3.5 w-3.5" />
              Upload from Device
            </button>
          </div>

          {coverMode === "url" && (
            <input
              type="url"
              value={profileForm.coverImage}
              onChange={(e) =>
                setProfileForm({ ...profileForm, coverImage: e.target.value })
              }
              placeholder="https://..."
              className="w-full h-10 rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 px-3 text-xs text-(--bgColor) outline-none focus:border-(--secondColor)"
            />
          )}

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
                setProfileForm({
                  ...profileForm,
                  coverImage: ev.target.result,
                });
                setCoverMode("file");
              };
              reader.readAsDataURL(file);
            }}
          />

          {coverMode === "file" && !profileForm.coverImage && (
            <button
              type="button"
              onClick={() => coverFileRef.current?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-(--bgColor)/20 bg-(--bgColor)/10 py-5 text-xs font-semibold text-(--bgColor)/70 hover:border-(--mainColor)/40"
            >
              <LuUpload className="h-5 w-5" />
              Choose cover photo from device
            </button>
          )}

          <div className="pt-1">
            {profileForm.coverImage ? (
              <>
                <img
                  src={profileForm.coverImage}
                  alt="Cover preview"
                  className="h-24 w-full rounded-xl object-cover border border-(--bgColor)/20"
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
              <span className="text-[11px] text-(--bgColor)/50">
                No cover image set yet.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
