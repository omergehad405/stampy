"use client";

import React from "react";
import { LuExternalLink } from "react-icons/lu";

export default function LocationTab({ profileForm, setProfileForm }) {
  return (
    <div className="space-y-6">
      <div className="border-b border-(--bgColor)/15 pb-3">
        <h3 className="font-bold text-sm text-(--bgColor)">
          Address & Navigation
        </h3>
        <p className="text-xs text-(--bgColor)/60">
          Physical premises location, postal details, and Google Maps URL.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label className="block text-xs font-bold text-(--bgColor) mb-1.5">
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
            className="w-full h-10 rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 px-3 text-xs text-(--bgColor) outline-none focus:border-(--secondColor)"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-(--bgColor) mb-1.5">
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
            className="w-full h-10 rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 px-3 text-xs text-(--bgColor) outline-none focus:border-(--secondColor)"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-(--bgColor) mb-1.5">
            City
          </label>
          <input
            type="text"
            value={profileForm.location.city}
            onChange={(e) =>
              setProfileForm({
                ...profileForm,
                location: {
                  ...profileForm.location,
                  city: e.target.value,
                },
              })
            }
            className="w-full h-10 rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 px-3 text-xs text-(--bgColor) outline-none focus:border-(--secondColor)"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-(--bgColor) mb-1.5">
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
            className="w-full h-10 rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 px-3 text-xs text-(--bgColor) outline-none focus:border-(--secondColor)"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-(--bgColor) mb-1.5">
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
            className="w-full h-10 rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 px-3 text-xs text-(--bgColor) outline-none focus:border-(--secondColor)"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-(--bgColor) mb-1.5">
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
            className="w-full h-10 rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 px-3 text-xs text-(--bgColor) outline-none focus:border-(--secondColor)"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-(--bgColor) mb-1.5">
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
              className="flex-1 h-10 rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 px-3 text-xs text-(--bgColor) outline-none focus:border-(--secondColor)"
            />
            {profileForm.location.googleMapsUrl && (
              <a
                href={profileForm.location.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 px-3 text-xs font-semibold text-(--bgColor) hover:bg-(--bgColor)/10"
              >
                <LuExternalLink className="h-3.5 w-3.5" />
                <span>Test Map Link</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
