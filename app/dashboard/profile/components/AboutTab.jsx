"use client";

import React from "react";

export default function AboutTab({
  profileForm,
  setProfileForm,
  newHighlight,
  setNewHighlight,
  addHighlight,
  removeHighlight,
}) {
  return (
    <div className="space-y-6">
      <div className="border-b border-(--bgColor)/15 pb-3">
        <h3 className="font-bold text-sm text-(--bgColor)">
          Story & Cafe Features
        </h3>
        <p className="text-xs text-(--bgColor)/60">
          Craft the narrative customer read when discovering your cafe.
        </p>
      </div>

      <div>
        <label className="block text-xs font-bold text-(--bgColor) mb-1.5">
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
          className="w-full rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 p-3 text-xs text-(--bgColor) outline-none focus:border-(--secondColor)"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-(--bgColor) mb-1.5">
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
          className="w-full rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 p-3 text-xs text-(--bgColor) outline-none focus:border-(--secondColor)"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-(--bgColor) mb-1.5">
          Key Features & Amenities
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {profileForm.about.highlights.map((tag, idx) => (
            <span
              key={idx}
              className="flex items-center gap-1.5 rounded-full border border-(--bgColor)/20 bg-(--bgColor)/10 px-3 py-1 text-xs font-medium text-(--bgColor)"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => removeHighlight(idx)}
                className="text-(--bgColor)/50 hover:text-rose-700"
              >
                x
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
            className="h-9 flex-1 rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 px-3 text-xs text-(--bgColor) outline-none"
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
  );
}
