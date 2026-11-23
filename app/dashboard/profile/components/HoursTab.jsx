"use client";

import React from "react";
import { LuPlus, LuSave, LuTrash2 } from "react-icons/lu";

export default function HoursTab({
  scheduleRows,
  addScheduleRow,
  handleSave,
  updateScheduleItem,
  removeScheduleRow,
  profileForm,
  setProfileForm,
  timeOptions,
  weekDays,
}) {
  return (
    <div className="space-y-4">
      <div className="border-b border-(--bgColor)/15 pb-2.5">
        <h3 className="font-bold text-sm text-(--bgColor)">
          Weekly Operating Schedule
        </h3>
        <p className="text-xs text-(--bgColor)/60">
          Start empty and add only the days your cafe actually works.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={addScheduleRow}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-(--bgColor)/20 bg-(--bgColor)/10 px-2.5 text-[11px] font-semibold text-(--bgColor) hover:bg-(--bgColor)/15"
        >
          <LuPlus className="h-3.5 w-3.5" />
          <span>Add Day</span>
        </button>

        <button
          type="button"
          onClick={handleSave}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-(--secondColor) px-2.5 text-[11px] font-bold text-[#3B2418] hover:bg-(--secondColor)/90"
        >
          <LuSave className="h-3.5 w-3.5" />
          <span>Save</span>
        </button>
      </div>

      <div className="space-y-2.5">
        {scheduleRows.length === 0 && (
          <div className="rounded-lg border border-dashed border-(--bgColor)/25 bg-(--bgColor)/5 p-3 text-[11px] text-(--bgColor)/70">
            No days added yet. Click Add Day to create your first working day.
          </div>
        )}

        {scheduleRows.map((dayItem, idx) => (
          <div
            key={`${idx}-${dayItem.day}`}
            className="rounded-lg border border-(--bgColor)/20 bg-(--bgColor)/10 p-2.5 text-[11px]"
          >
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_1fr_auto]">
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-(--bgColor)/70">
                  Day
                </label>
                <select
                  value={dayItem.day}
                  onChange={(e) =>
                    updateScheduleItem(idx, "day", e.target.value)
                  }
                  className="h-8 w-full rounded-md border border-(--bgColor)/20 bg-(--mainColor) px-2 text-[11px] font-semibold text-(--bgColor) outline-none focus:border-(--secondColor)"
                >
                  {weekDays.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-(--bgColor)/70">
                  From
                </label>
                <select
                  value={dayItem.open}
                  onChange={(e) =>
                    updateScheduleItem(idx, "open", e.target.value)
                  }
                  className="h-8 w-full rounded-md border border-(--bgColor)/20 bg-(--mainColor) px-2 text-[11px] font-semibold text-(--bgColor) outline-none focus:border-(--secondColor)"
                >
                  {timeOptions.map((timeOpt) => (
                    <option key={timeOpt.value} value={timeOpt.value}>
                      {timeOpt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-(--bgColor)/70">
                  To
                </label>
                <select
                  value={dayItem.close}
                  onChange={(e) =>
                    updateScheduleItem(idx, "close", e.target.value)
                  }
                  className="h-8 w-full rounded-md border border-(--bgColor)/20 bg-(--mainColor) px-2 text-[11px] font-semibold text-(--bgColor) outline-none focus:border-(--secondColor)"
                >
                  {timeOptions.map((timeOpt) => (
                    <option key={timeOpt.value} value={timeOpt.value}>
                      {timeOpt.value === "00:00"
                        ? "12:00 AM (next day)"
                        : timeOpt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => removeScheduleRow(idx)}
                  className="inline-flex h-8 items-center gap-1 rounded-md border border-rose-300/30 bg-rose-400/10 px-2 text-[10px] font-semibold text-rose-200 hover:bg-rose-400/20"
                  title="Remove this day"
                >
                  <LuTrash2 className="h-3.5 w-3.5" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <label className="block text-xs font-bold text-(--bgColor) mb-1.5">
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
          className="w-full h-10 rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 px-3 text-xs text-(--bgColor) outline-none focus:border-(--secondColor)"
        />
      </div>
    </div>
  );
}
