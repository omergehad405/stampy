"use client";

import React from "react";
import {
  LuCheck,
  LuCopy,
  LuDownload,
  LuExternalLink,
  LuInfo,
  LuQrCode,
} from "react-icons/lu";
import QRCodeImage from "@/app/components/ui/QRCodeImage";

export default function QrTab({
  cafe,
  cafeInfoUrl,
  handleDownloadQr,
  handleCopyUrl,
  copiedUrl,
}) {
  return (
    <div className="space-y-6">
      <div className="border-b border-(--bgColor)/15 pb-3">
        <h3 className="font-bold text-sm text-(--bgColor)">
          Cafe Public QR Code
        </h3>
        <p className="text-xs text-(--bgColor)/60">
          Share this QR code with customers. When scanned, it opens your cafe
          public info page on Notch.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="flex flex-col items-center gap-4 shrink-0">
          <div className="relative bg-(--bgColor)/10 rounded-3xl border-2 border-(--bgColor)/20 p-6 shadow-sm flex items-center justify-center">
            <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-(--mainColor) flex items-center justify-center shadow">
              <LuQrCode className="w-4 h-4 text-(--secondColor)" />
            </div>
            {cafeInfoUrl ? (
              <QRCodeImage
                id="dashboard-cafe-qr-img"
                value={cafeInfoUrl}
                size={220}
                alt={`${cafe?.name || "Cafe"} Notch QR Code`}
                darkColor="#1B120C"
                lightColor="#FFFFFF"
              />
            ) : (
              <div
                style={{ width: 220, height: 220 }}
                className="flex items-center justify-center rounded-2xl bg-(--bgColor)/10 text-xs text-(--bgColor)/50 text-center px-4"
              >
                Cafe slug not set. Save a cafe profile first.
              </div>
            )}
          </div>

          {cafe?.name && (
            <div className="text-center space-y-0.5">
              <p className="text-sm font-bold text-(--bgColor)">{cafe.name}</p>
              <p className="text-xs text-(--bgColor)/50">Powered by Notch</p>
            </div>
          )}

          <div className="flex gap-2 w-full" style={{ maxWidth: 232 }}>
            <button
              type="button"
              onClick={handleDownloadQr}
              disabled={!cafeInfoUrl}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-(--mainColor) px-3 py-2.5 text-xs font-bold text-(--secondColor) hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <LuDownload className="h-3.5 w-3.5" />
              Download
            </button>
            <button
              type="button"
              onClick={handleCopyUrl}
              disabled={!cafeInfoUrl}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 px-3 py-2.5 text-xs font-bold text-(--bgColor) hover:bg-(--bgColor)/10 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              {copiedUrl ? (
                <>
                  <LuCheck className="h-3.5 w-3.5 text-emerald-600" />
                  Copied!
                </>
              ) : (
                <>
                  <LuCopy className="h-3.5 w-3.5" />
                  Copy URL
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-5 min-w-0">
          <div>
            <label className="block text-xs font-bold text-(--bgColor) mb-1.5">
              QR Code Destination URL
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-10 rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 px-3 flex items-center text-xs text-(--bgColor)/80 font-mono truncate select-all">
                {cafeInfoUrl || (
                  <span className="text-(--bgColor)/40 italic">
                    No slug set yet
                  </span>
                )}
              </div>
              {cafeInfoUrl && (
                <a
                  href={cafeInfoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 h-10 rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 px-3 text-xs font-semibold text-(--bgColor) hover:bg-(--bgColor)/15 transition shrink-0"
                >
                  <LuExternalLink className="h-3.5 w-3.5" />
                  Preview
                </a>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-(--bgColor)/15 bg-(--mainColor) p-4 space-y-3">
            <h4 className="text-xs font-bold text-(--bgColor) flex items-center gap-1.5">
              <LuInfo className="h-3.5 w-3.5 text-(--bgColor)/60" />
              How to use this QR code
            </h4>
            <ul className="space-y-2 text-xs text-(--bgColor)/70 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-(--secondColor) shrink-0" />
                Print it and display it at your counter, tables, or window.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-(--secondColor) shrink-0" />
                Customers scan it with their phone camera, no app required.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-(--secondColor) shrink-0" />
                They land on your public Notch page: opening hours, location,
                about, menu preview, and your loyalty program.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-(--secondColor) shrink-0" />
                From there they can join your loyalty card and start collecting
                stamps.
              </li>
            </ul>
          </div>

          {!cafe?.slug ? (
            <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-900">
              <LuInfo className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <p>
                Your cafe does not have a public slug yet. Save your cafe
                profile with a name and the system will generate one
                automatically.
              </p>
            </div>
          ) : (
            <div className="flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-xs text-emerald-900">
              <LuCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">QR code is ready.</span>
                <p className="text-[11px] text-emerald-800 mt-0.5">
                  Public page slug:{" "}
                  <span className="font-mono font-semibold">{cafe.slug}</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
