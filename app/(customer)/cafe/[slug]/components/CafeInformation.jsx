"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  LuMapPin,
  LuExternalLink,
  LuCopy,
  LuCheck,
  LuPhone,
  LuMail,
  LuGlobe,
  LuInfo,
} from "react-icons/lu";
import { toast } from "react-toastify";
import CafeOpeningHours from "./CafeOpeningHours";

export default function CafeInformation({ cafe, operatingStatus }) {
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  if (!cafe) return null;

  const { location, openingHours, contact, website } = cafe;

  const handleCopyAddress = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!location?.fullAddress) return;
    navigator.clipboard.writeText(location.fullAddress);
    setCopiedAddress(true);
    toast.success("Address copied to clipboard!");
    setTimeout(() => setCopiedAddress(false), 2200);
  };

  const handleCopyPhone = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!contact?.phone) return;
    navigator.clipboard.writeText(contact.phone);
    setCopiedPhone(true);
    toast.success("Phone number copied!");
    setTimeout(() => setCopiedPhone(false), 2200);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.2, ease: "easeOut" }}
      className="w-full space-y-4"
    >
      <div className="flex items-center gap-2">
        <span className="p-1.5 rounded-lg bg-(--secondColor) text-[#3b2418]">
          <LuInfo className="w-4 h-4" />
        </span>
        <h2 className="text-base sm:text-lg font-bold text-(--mainColor)">
          Cafe Information
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
        {/* 1. Location Card */}
        {location?.fullAddress && (
          <div className="rounded-2xl bg-(--mainColor) text-(--bgColor) border border-(--bgColor)/15 p-4 sm:p-5 shadow-sm flex flex-col justify-between hover:border-(--secondColor) transition-colors">
            <div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-(--bgColor)/15 text-(--bgColor) shrink-0">
                    <LuMapPin className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-(--bgColor)">
                    Location & Address
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={handleCopyAddress}
                  title="Copy full address"
                  className="p-1.5 rounded-lg text-(--bgColor)/75 hover:text-(--bgColor) hover:bg-(--bgColor)/10 transition-colors text-xs inline-flex items-center gap-1 cursor-pointer"
                >
                  {copiedAddress ? (
                    <>
                      <LuCheck className="w-3.5 h-3.5 text-emerald-300" />
                      <span className="text-[11px] text-emerald-300">Copied</span>
                    </>
                  ) : (
                    <>
                      <LuCopy className="w-3.5 h-3.5" />
                      <span className="text-[11px]">Copy</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs sm:text-sm text-(--bgColor)/85 font-medium mt-3 leading-relaxed">
                {location.fullAddress}
              </p>

              {location.directionsHint && (
                <p className="text-[11px] sm:text-xs text-(--bgColor)/65 mt-1 italic">
                  {location.directionsHint}
                </p>
              )}
            </div>

            {location.googleMapsUrl && (
              <div className="mt-4 pt-3 border-t border-(--bgColor)/15">
                <a
                  href={location.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#3B2418] bg-(--secondColor) hover:opacity-95 px-3 py-1.5 rounded-xl transition-colors w-fit"
                >
                  <span>Open in Google Maps</span>
                  <LuExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        )}

        {/* 2. Opening Hours Card */}
        {openingHours && (
          <CafeOpeningHours
            openingHours={openingHours}
            operatingStatus={operatingStatus}
          />
        )}

        {/* 3. Contact Card */}
        {(contact?.phone || contact?.email) && (
          <div className="rounded-2xl bg-(--mainColor) text-(--bgColor) border border-(--bgColor)/15 p-4 sm:p-5 shadow-sm flex flex-col justify-between hover:border-(--secondColor) transition-colors">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="p-2.5 rounded-xl bg-(--bgColor)/15 text-(--bgColor) shrink-0">
                  <LuPhone className="w-5 h-5" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-(--bgColor)">
                  Contact Details
                </h3>
              </div>

              <div className="space-y-3">
                {contact.phone && (
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-[11px] uppercase tracking-wider font-semibold text-(--bgColor)/65">
                        Phone Call
                      </p>
                      <a
                        href={`tel:${contact.phone}`}
                        className="text-xs sm:text-sm font-bold text-(--bgColor) hover:underline block"
                      >
                        {contact.displayPhone || contact.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={handleCopyPhone}
                        title="Copy phone"
                        className="p-2 rounded-lg text-(--bgColor)/75 hover:text-(--bgColor) hover:bg-(--bgColor)/10 transition-colors cursor-pointer"
                      >
                        {copiedPhone ? (
                          <LuCheck className="w-4 h-4 text-emerald-300" />
                        ) : (
                          <LuCopy className="w-4 h-4" />
                        )}
                      </button>
                      <a
                        href={`tel:${contact.phone}`}
                        className="px-2.5 py-1.5 rounded-xl bg-(--secondColor) text-[#3b2418] hover:opacity-95 text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                      >
                        <LuPhone className="w-3.5 h-3.5" />
                        <span>Dial</span>
                      </a>
                    </div>
                  </div>
                )}

                {contact.email && (
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-(--bgColor)/15">
                    <div>
                      <p className="text-[11px] uppercase tracking-wider font-semibold text-(--bgColor)/65">
                        Email Inquiry
                      </p>
                      <a
                        href={`mailto:${contact.email}`}
                        className="text-xs sm:text-sm font-medium text-(--bgColor) hover:underline truncate max-w-[180px] sm:max-w-[240px] block"
                      >
                        {contact.email}
                      </a>
                    </div>
                    <a
                      href={`mailto:${contact.email}`}
                      className="px-2.5 py-1.5 rounded-xl bg-(--bgColor)/15 hover:bg-(--bgColor)/25 text-(--bgColor) text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                    >
                      <LuMail className="w-3.5 h-3.5" />
                      <span>Email</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 4. Website Card */}
        {website?.url && (
          <div className="rounded-2xl bg-(--mainColor) text-(--bgColor) border border-(--bgColor)/15 p-4 sm:p-5 shadow-sm flex flex-col justify-between hover:border-(--secondColor) transition-colors">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="p-2.5 rounded-xl bg-(--bgColor)/15 text-(--bgColor) shrink-0">
                  <LuGlobe className="w-5 h-5" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-(--bgColor)">
                  Official Website
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-(--bgColor)/80 font-medium">
                Visit our official site for seasonal stories, online bean orders, and our newsletter.
              </p>

              <p className="text-xs sm:text-sm font-bold text-(--secondColor) mt-2">
                {website.displayUrl || website.url}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-(--bgColor)/15">
              <a
                href={website.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#3b2418] bg-(--secondColor) hover:opacity-95 px-3 py-1.5 rounded-xl transition-colors w-fit"
              >
                <span>Visit Website</span>
                <LuExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
}
