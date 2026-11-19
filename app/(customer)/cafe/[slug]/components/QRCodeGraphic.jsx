"use client";

import React from "react";

export default function QRCodeGraphic({ className = "w-36 h-36" }) {
  return (
    <svg
      viewBox="0 0 29 29"
      fill="currentColor"
      className={className}
      shapeRendering="crispEdges"
      aria-label="Loyalty QR Code"
    >
      <rect x="2" y="2" width="7" height="7" fill="currentColor" />
      <rect x="3" y="3" width="5" height="5" fill="var(--whiteCardBg, white)" />
      <rect x="4" y="4" width="3" height="3" fill="currentColor" />
      <rect x="20" y="2" width="7" height="7" fill="currentColor" />
      <rect x="21" y="3" width="5" height="5" fill="var(--whiteCardBg, white)" />
      <rect x="22" y="4" width="3" height="3" fill="currentColor" />
      <rect x="2" y="20" width="7" height="7" fill="currentColor" />
      <rect x="3" y="21" width="5" height="5" fill="var(--whiteCardBg, white)" />
      <rect x="4" y="22" width="3" height="3" fill="currentColor" />
      <rect x="18" y="18" width="5" height="5" fill="currentColor" />
      <rect x="19" y="19" width="3" height="3" fill="var(--whiteCardBg, white)" />
      <rect x="20" y="20" width="1" height="1" fill="currentColor" />
      <rect x="10" y="5" width="1" height="1" fill="currentColor" />
      <rect x="12" y="5" width="1" height="1" fill="currentColor" />
      <rect x="14" y="5" width="1" height="1" fill="currentColor" />
      <rect x="16" y="5" width="1" height="1" fill="currentColor" />
      <rect x="18" y="5" width="1" height="1" fill="currentColor" />
      <rect x="5" y="10" width="1" height="1" fill="currentColor" />
      <rect x="5" y="12" width="1" height="1" fill="currentColor" />
      <rect x="5" y="14" width="1" height="1" fill="currentColor" />
      <rect x="5" y="16" width="1" height="1" fill="currentColor" />
      <rect x="5" y="18" width="1" height="1" fill="currentColor" />
      <rect x="10" y="2" width="2" height="1" fill="currentColor" />
      <rect x="14" y="2" width="1" height="2" fill="currentColor" />
      <rect x="17" y="3" width="2" height="1" fill="currentColor" />
      <rect x="11" y="7" width="3" height="1" fill="currentColor" />
      <rect x="16" y="8" width="2" height="2" fill="currentColor" />
      <rect x="10" y="10" width="2" height="2" fill="currentColor" />
      <rect x="13" y="10" width="2" height="1" fill="currentColor" />
      <rect x="17" y="11" width="1" height="3" fill="currentColor" />
      <rect x="20" y="10" width="2" height="1" fill="currentColor" />
      <rect x="24" y="11" width="2" height="2" fill="currentColor" />
      <rect x="11" y="13" width="1" height="3" fill="currentColor" />
      <rect x="13" y="13" width="3" height="2" fill="currentColor" />
      <rect x="21" y="13" width="3" height="1" fill="currentColor" />
      <rect x="2" y="11" width="2" height="1" fill="currentColor" />
      <rect x="7" y="11" width="1" height="2" fill="currentColor" />
      <rect x="2" y="14" width="1" height="2" fill="currentColor" />
      <rect x="10" y="17" width="2" height="2" fill="currentColor" />
      <rect x="14" y="17" width="2" height="1" fill="currentColor" />
      <rect x="25" y="16" width="2" height="2" fill="currentColor" />
      <rect x="11" y="21" width="2" height="1" fill="currentColor" />
      <rect x="14" y="20" width="1" height="3" fill="currentColor" />
      <rect x="16" y="22" width="2" height="1" fill="currentColor" />
      <rect x="24" y="21" width="2" height="2" fill="currentColor" />
      <rect x="10" y="25" width="3" height="1" fill="currentColor" />
      <rect x="15" y="24" width="2" height="2" fill="currentColor" />
      <rect x="19" y="25" width="2" height="1" fill="currentColor" />
      <rect x="23" y="25" width="3" height="1" fill="currentColor" />
    </svg>
  );
}
