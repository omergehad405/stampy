"use client";

import React from "react";
import { LuPlus, LuTrash2 } from "react-icons/lu";
import PlanLockedFeature from "../../components/PlanLockedFeature";

export default function MenuTab({
  hasFeature,
  profileForm,
  addMenuCategory,
  removeMenuCategory,
  updateMenuCategory,
}) {
  if (!hasFeature("digital_menu")) {
    return (
      <PlanLockedFeature
        featureKey="digital_menu"
        featureName="Digital Menu"
        description="The Digital Menu showcase is not included in your current subscription plan. Upgrade your plan to display categories and items on your public Notch customer page."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-(--bgColor)/15 pb-3">
        <div>
          <h3 className="font-bold text-sm text-(--bgColor)">
            Digital Menu Items
          </h3>
          <p className="text-xs text-(--bgColor)/60">
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
            className="rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 p-4 text-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-(--bgColor)">
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
                <label className="block font-bold text-(--bgColor) mb-1">
                  Item Title
                </label>
                <input
                  type="text"
                  value={cat.title}
                  onChange={(e) =>
                    updateMenuCategory(cat.id, "title", e.target.value)
                  }
                  placeholder="e.g. Flat White"
                  className="w-full h-9 rounded-lg border border-(--bgColor)/20 bg-(--bgColor)/10 px-2.5 text-xs text-(--bgColor) outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-(--bgColor) mb-1">
                  Item Price
                </label>
                <input
                  type="text"
                  value={cat.price}
                  onChange={(e) =>
                    updateMenuCategory(cat.id, "price", e.target.value)
                  }
                  placeholder="e.g. GBP 3.50"
                  className="w-full h-9 rounded-lg border border-(--bgColor)/20 bg-(--bgColor)/10 px-2.5 text-xs text-(--bgColor) outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-(--bgColor) mb-1">
                  Item Description
                </label>
                <input
                  type="text"
                  value={cat.description}
                  onChange={(e) =>
                    updateMenuCategory(cat.id, "description", e.target.value)
                  }
                  placeholder="e.g. Smooth double shot with steamed milk"
                  className="w-full h-9 rounded-lg border border-(--bgColor)/20 bg-(--bgColor)/10 px-2.5 text-xs text-(--bgColor) outline-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
