"use client";

import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import { LuLoader } from "react-icons/lu";

/**
 * Reusable Scannable QR Code Component
 * Generates an ISO/IEC 18004 compliant, high-contrast, scannable QR code
 */
export default function QRCodeImage({
  value,
  size = 200,
  className = "",
  alt = "Loyalty QR Code",
  darkColor = "#1B120C", // Crisp high-contrast brand dark
  lightColor = "#FFFFFF",
  id,
}) {
  const [dataUrl, setDataUrl] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    if (!value || typeof value !== "string") {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Generate high-resolution data URL with 2-module quiet zone for instant scanning
    QRCode.toDataURL(value, {
      width: Math.max(size * 2, 360), // High DPI for retina / phone screens
      margin: 2, // Required quiet zone for camera scanners
      errorCorrectionLevel: "M", // Standard medium error correction (~15% recovery)
      color: {
        dark: darkColor,
        light: lightColor,
      },
    })
      .then((url) => {
        if (isMounted) {
          setDataUrl(url);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("QR Code generation error:", err);
        if (isMounted) {
          setError("Failed to generate QR code");
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [value, size, darkColor, lightColor]);

  if (!value) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`flex items-center justify-center bg-black/5 rounded-2xl text-xs text-neutral-500 ${className}`}
      >
        No identifier
      </div>
    );
  }

  if (loading) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`flex flex-col items-center justify-center bg-white rounded-2xl text-neutral-400 gap-2 ${className}`}
      >
        <LuLoader className="w-6 h-6 animate-spin text-[#3B2418]" />
        <span className="text-[11px] font-medium text-neutral-500">Generating QR...</span>
      </div>
    );
  }

  if (error || !dataUrl) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`flex items-center justify-center bg-red-50 text-red-600 rounded-2xl text-xs p-3 text-center ${className}`}
      >
        Failed to render QR
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      id={id}
      src={dataUrl}
      alt={alt}
      width={size}
      height={size}
      className={`block object-contain select-none ${className}`}
      style={{ imageRendering: "pixelated" }}
    />
  );
}
