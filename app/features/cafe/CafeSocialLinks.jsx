"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaInstagram, FaFacebook, FaTiktok, FaWhatsapp } from "react-icons/fa6";
import { LuShare2, LuExternalLink } from "react-icons/lu";

export default function CafeSocialLinks({ socialMedia }) {
  if (!socialMedia) return null;

  // Platform definitions with respective brand styles
  const platforms = [
    {
      key: "instagram",
      label: "Instagram",
      icon: FaInstagram,
      data: socialMedia.instagram,
      accentColor: "hover:border-[#E1306C] hover:text-[#E1306C]",
      badgeBg: "bg-[#E1306C]/10 text-[#E1306C]",
    },
    {
      key: "facebook",
      label: "Facebook",
      icon: FaFacebook,
      data: socialMedia.facebook,
      accentColor: "hover:border-[#1877F2] hover:text-[#1877F2]",
      badgeBg: "bg-[#1877F2]/10 text-[#1877F2]",
    },
    {
      key: "tiktok",
      label: "TikTok",
      icon: FaTiktok,
      data: socialMedia.tiktok,
      accentColor: "hover:border-[#000000] dark:hover:border-[#ffffff]",
      badgeBg: "bg-[var(--mainColor)]/10 text-[var(--mainColor)]",
    },
    {
      key: "whatsapp",
      label: "WhatsApp",
      icon: FaWhatsapp,
      data: socialMedia.whatsapp,
      accentColor: "hover:border-[#25D366] hover:text-[#25D366]",
      badgeBg: "bg-[#25D366]/10 text-[#25D366]",
    },
  ];

  // Only keep configured platforms that have a valid URL
  const activePlatforms = platforms.filter(
    (item) => item.data && item.data.url
  );

  if (activePlatforms.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.25, ease: "easeOut" }}
      className="w-full space-y-3"
    >
      <div className="flex items-center gap-2">
        <span className="p-1.5 rounded-lg bg-[var(--secondColor)]/30 text-[var(--mainColor)]">
          <LuShare2 className="w-4 h-4" />
        </span>
        <h2 className="text-base sm:text-lg font-bold text-[var(--mainColor)]">
          Follow & Connect
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {activePlatforms.map(({ key, label, icon: Icon, data, accentColor, badgeBg }) => (
          <a
            key={key}
            href={data.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`group flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl bg-[var(--bgColor)] border border-[var(--mainColor)]/12 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${accentColor}`}
          >
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-xl bg-[var(--mainColor)]/5 group-hover:scale-110 transition-transform">
                <Icon className="w-5 h-5 transition-colors" />
              </span>
              <LuExternalLink className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="mt-3">
              <p className="text-xs font-bold text-[var(--mainColor)] leading-tight">
                {label}
              </p>
              {data.handle && (
                <p className="text-[11px] font-medium text-[var(--mainColor)]/65 truncate mt-0.5">
                  {data.handle}
                </p>
              )}
              {data.followersCount && (
                <span className={`inline-block mt-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md ${badgeBg}`}>
                  {data.followersCount} followers
                </span>
              )}
            </div>
          </a>
        ))}
      </div>
    </motion.section>
  );
}
