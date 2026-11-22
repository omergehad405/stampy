"use client";

import React from "react";
import QRCodeImage from "@/app/components/ui/QRCodeImage";

export default function QRCodeGraphic({
  value = "",
  className = "w-36 h-36",
  size = 180,
}) {
  return (
    <QRCodeImage
      value={value}
      size={size}
      className={className}
      alt="Notch QR Code"
      darkColor="#1B120C"
      lightColor="#FFFFFF"
    />
  );
}
