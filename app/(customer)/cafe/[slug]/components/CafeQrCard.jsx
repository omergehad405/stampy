"use client";

import React, { useState, useEffect } from "react";
import { LuScanQrCode } from "react-icons/lu";
import { apiGetQrCode } from "@/app/lib/authApi";
import QRCodeGraphic from "./QRCodeGraphic";

const CafeQrCard = React.forwardRef(function CafeQrCard(
  { cafe, user, isHighlighted, onShowQr },
  ref
) {
  const [liveQrCode, setLiveQrCode] = useState(user?.qrCode || "");

  useEffect(() => {
    if (user?.qrCode) {
      setLiveQrCode(user.qrCode);
    } else if (!liveQrCode) {
      apiGetQrCode()
        .then((res) => {
          if (res?.data?.qrCode) {
            setLiveQrCode(res.data.qrCode);
          }
        })
        .catch(() => {});
    }
  }, [user?.qrCode, liveQrCode]);

  const customerQr = liveQrCode || user?.qrCode || user?.memberCode || "";

  return (
    <section
      ref={ref}
      id="qr-section"
      className={`bg-(--mainColor) text-(--bgColor) rounded-3xl p-5 sm:p-6 lg:p-7 shadow-sm border transition-all duration-500 ${isHighlighted
        ? "border-(--secondColor) ring-4 ring-(--secondColor)/70 shadow-xl scale-[1.01]"
        : "border-(--bgColor)/15"
        }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <LuScanQrCode className="w-4 h-4 lg:w-5 lg:h-5 text-(--secondColor)" />
          <h4 className="text-sm lg:text-base font-bold text-(--bgColor)">
            Your Loyalty QR Code
          </h4>
        </div>
        {user?.name && (
          <span className="text-[11px] font-medium opacity-75 truncate max-w-[120px]">
            {user.name}
          </span>
        )}
      </div>

      <div className="border-2 border-(--bgColor)/20 rounded-2xl lg:rounded-3xl p-4 sm:p-6 bg-white flex items-center justify-center my-3 max-w-[210px] sm:max-w-[230px] lg:max-w-[250px] mx-auto w-full aspect-square transition-colors duration-300">
        <QRCodeGraphic
          value={customerQr}
          className="w-32 h-32 sm:w-36 sm:h-36 lg:w-44 lg:h-44"
          size={180}
        />
      </div>

      <p className="text-xs sm:text-sm text-center text-(--bgColor)/75 mt-3">
        Show this code to the barista at {cafe.name} to collect your visit stamp.
      </p>

      <button
        type="button"
        onClick={onShowQr}
        className="w-full mt-4 lg:mt-6 bg-(--secondColor) hover:opacity-95 active:scale-[0.99] text-[#3b2418] font-bold text-sm lg:text-base py-3.5 px-4 rounded-xl text-center transition-all cursor-pointer shadow-sm"
      >
        Show Full QR Code
      </button>
    </section>
  );
});

export default CafeQrCard;
