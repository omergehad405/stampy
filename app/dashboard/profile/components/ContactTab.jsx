"use client";

import React from "react";

export default function ContactTab({ profileForm, setProfileForm }) {
  return (
    <div className="space-y-6">
      <div className="border-b border-(--bgColor)/15 pb-3">
        <h3 className="font-bold text-sm text-(--bgColor)">
          Contact Channels & Website
        </h3>
        <p className="text-xs text-(--bgColor)/60">
          Official phone, email, and web domain.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label className="block text-xs font-bold text-(--bgColor) mb-1.5">
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
            className="w-full h-10 rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 px-3 text-xs text-(--bgColor) outline-none focus:border-(--secondColor)"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-(--bgColor) mb-1.5">
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
            className="w-full h-10 rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 px-3 text-xs text-(--bgColor) outline-none focus:border-(--secondColor)"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-(--bgColor) mb-1.5">
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
            className="w-full h-10 rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 px-3 text-xs text-(--bgColor) outline-none focus:border-(--secondColor)"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-(--bgColor) mb-1.5">
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
            className="w-full h-10 rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 px-3 text-xs text-(--bgColor) outline-none focus:border-(--secondColor)"
          />
        </div>
      </div>
    </div>
  );
}
