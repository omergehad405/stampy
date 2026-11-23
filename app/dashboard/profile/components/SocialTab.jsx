"use client";

import React from "react";

const buildWhatsAppUrl = (phoneNumber) => {
  const cleaned = (phoneNumber || "").replace(/[^\d]/g, "");
  return cleaned ? `https://wa.me/${cleaned}` : "";
};

export default function SocialTab({ profileForm, setProfileForm }) {
  return (
    <div className="space-y-6">
      <div className="border-b border-(--bgColor)/15 pb-3">
        <h3 className="font-bold text-sm text-(--bgColor)">
          Social Media Accounts
        </h3>
        <p className="text-xs text-(--bgColor)/60">
          Connect your social media presence for customer engagement.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label className="block text-xs font-bold text-(--bgColor) mb-1.5">
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
            className="w-full h-10 rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 px-3 text-xs text-(--bgColor) outline-none focus:border-(--secondColor)"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-(--bgColor) mb-1.5">
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
            className="w-full h-10 rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 px-3 text-xs text-(--bgColor) outline-none focus:border-(--secondColor)"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-(--bgColor) mb-1.5">
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
            className="w-full h-10 rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 px-3 text-xs text-(--bgColor) outline-none focus:border-(--secondColor)"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-(--bgColor) mb-1.5">
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
            className="w-full h-10 rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 px-3 text-xs text-(--bgColor) outline-none focus:border-(--secondColor)"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-(--bgColor) mb-1.5">
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
            className="w-full h-10 rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 px-3 text-xs text-(--bgColor) outline-none focus:border-(--secondColor)"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-(--bgColor) mb-1.5">
            WhatsApp Number
          </label>
          <input
            type="tel"
            value={profileForm.socialMedia.whatsapp?.handle || ""}
            onChange={(e) =>
              setProfileForm({
                ...profileForm,
                socialMedia: {
                  ...profileForm.socialMedia,
                  whatsapp: {
                    ...profileForm.socialMedia.whatsapp,
                    handle: e.target.value,
                    url: buildWhatsAppUrl(e.target.value),
                  },
                },
              })
            }
            placeholder="e.g. +447700900123"
            className="w-full h-10 rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 px-3 text-xs text-(--bgColor) outline-none focus:border-(--secondColor)"
          />
          <p className="mt-1 text-[11px] text-(--bgColor)/60">
            We will automatically generate your WhatsApp link:{" "}
            <span className="font-mono">
              {buildWhatsAppUrl(
                profileForm.socialMedia.whatsapp?.handle || "",
              ) || "https://wa.me/..."}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
