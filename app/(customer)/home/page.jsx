"use client";

import React, { useState, useEffect } from "react";
import { LuBell, LuCoffee, LuScanQrCode, LuX } from "react-icons/lu";
import ThemeToggle from "@/app/components/ui/ThemeToggle";

// Barista coffee tamper icon for earned stamps
function TamperIcon({ className = "w-5 h-5" }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className={className}
            aria-hidden="true"
        >
            <circle cx="12" cy="4.8" r="2.8" />
            <rect x="10.8" y="7.6" width="2.4" height="4.2" rx="0.4" />
            <path d="M8.5 11.8h7a0.8 0.8 0 0 1 0.8 0.8v1.2H7.7v-1.2a0.8 0.8 0 0 1 0.8-0.8z" />
            <rect x="6.5" y="14.2" width="11" height="2.6" rx="0.6" />
            <rect x="5.5" y="17.4" width="13" height="1.6" rx="0.5" />
        </svg>
    );
}

// Clean scalable QR Code SVG
function QRCodeGraphic({ className = "w-36 h-36" }) {
    return (
        <svg
            viewBox="0 0 29 29"
            fill="currentColor"
            className={className}
            shapeRendering="crispEdges"
            aria-label="Loyalty QR Code"
        >
            {/* Top-Left Finder */}
            <rect x="2" y="2" width="7" height="7" fill="currentColor" />
            <rect x="3" y="3" width="5" height="5" fill="var(--whiteCardBg)" />
            <rect x="4" y="4" width="3" height="3" fill="currentColor" />
            {/* Top-Right Finder */}
            <rect x="20" y="2" width="7" height="7" fill="currentColor" />
            <rect x="21" y="3" width="5" height="5" fill="var(--whiteCardBg)" />
            <rect x="22" y="4" width="3" height="3" fill="currentColor" />
            {/* Bottom-Left Finder */}
            <rect x="2" y="20" width="7" height="7" fill="currentColor" />
            <rect x="3" y="21" width="5" height="5" fill="var(--whiteCardBg)" />
            <rect x="4" y="22" width="3" height="3" fill="currentColor" />
            {/* Alignment Pattern */}
            <rect x="18" y="18" width="5" height="5" fill="currentColor" />
            <rect x="19" y="19" width="3" height="3" fill="var(--whiteCardBg)" />
            <rect x="20" y="20" width="1" height="1" fill="currentColor" />
            {/* Timing Patterns */}
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
            {/* Data Modules */}
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

export default function HomePage() {
    const [isQrModalOpen, setIsQrModalOpen] = useState(false);

    const currentStamps = 6;
    const totalStamps = 10;
    const stamps = Array.from({ length: totalStamps }, (_, i) => i + 1);

    // Close modal on Escape key and lock body scroll
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") setIsQrModalOpen(false);
        };
        if (isQrModalOpen) {
            window.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [isQrModalOpen]);

    return (
        <div className="w-full max-w-md md:max-w-4xl lg:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-10 pb-8">
            {/* Top Bar */}
            <header className="flex items-center justify-between pb-2">
                {/* Brand */}
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-[var(--mainColor)] flex items-center justify-center text-[var(--bgColor)] shadow-sm">
                        <LuCoffee className="w-4 h-4 lg:w-5 lg:h-5" />
                    </div>
                    <div>
                        <h2 className="text-sm lg:text-base font-bold leading-tight">
                            Coffee House
                        </h2>
                        <p className="text-xs lg:text-sm font-medium leading-tight opacity-70">
                            Your loyalty card
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1">
                    <ThemeToggle />
                    <button
                        type="button"
                        aria-label="Notifications"
                        className="p-2 rounded-full hover:bg-[var(--mainColor)]/10 transition-colors cursor-pointer"
                    >
                        <LuBell className="w-5 h-5 lg:w-6 lg:h-6" />
                    </button>
                </div>
            </header>

            {/* Main Responsive Layout: single column on mobile, 2 cols on md+ */}
            <div className="md:grid md:grid-cols-12 md:gap-6 lg:gap-10 items-start mt-4 lg:mt-8">
                {/* Left Column: Greeting, Progress, Stamps */}
                <div className="md:col-span-7 flex flex-col gap-6">
                    {/* Greeting */}
                    <section>
                        <p className="text-xs font-semibold tracking-wider uppercase opacity-60">
                            WELCOME BACK
                        </p>
                        <h1 className="text-2xl lg:text-3xl font-bold mt-0.5 flex items-center gap-2">
                            <span>Hello, Omar</span>
                            <span className="text-2xl lg:text-3xl">👋</span>
                        </h1>
                        <p className="text-xs sm:text-sm lg:text-base opacity-70 mt-1">
                            Your next reward is getting closer!
                        </p>
                    </section>

                    {/* Progress Card */}
                    <section className="bg-(--mainColor) text-(--bgColor) rounded-2xl lg:rounded-3xl p-4 sm:p-5 lg:p-6 shadow-sm transition-colors duration-300">
                        <div className="flex items-center justify-between text-sm lg:text-base font-bold">
                            <span>Your Progress</span>
                            <span>
                                {currentStamps} / {totalStamps}
                            </span>
                        </div>

                        <div className="grid grid-cols-10 gap-1.5 sm:gap-2 my-3 lg:my-4">
                            {stamps.map((num) => (
                                <div
                                    key={num}
                                    className={`h-1.5 sm:h-2 rounded-full transition-colors duration-300 ${num <= currentStamps
                                        ? "bg-[var(--bgColor)]"
                                        : "opacity-30 bg-[var(--bgColor)]"
                                        }`}
                                />
                            ))}
                        </div>

                        <p className="text-xs sm:text-sm opacity-70">
                            Collect {totalStamps - currentStamps} more stamps to unlock your reward.
                        </p>
                    </section>

                    {/* Stamps Grid */}
                    <section>
                        <h3 className="text-base lg:text-lg font-bold mb-3">Your Stamps</h3>

                        <div className="grid grid-cols-5 gap-2 sm:gap-3 lg:gap-3.5">
                            {stamps.map((num) => {
                                const isCollected = num <= currentStamps;
                                return (
                                    <div
                                        key={num}
                                        className={`aspect-[4/5] rounded-2xl lg:rounded-3xl flex flex-col items-center justify-center gap-1.5 lg:gap-2 transition-all duration-300 ${isCollected
                                            ? "bg-[var(--mainColor)] text-[var(--bgColor)] shadow-sm hover:scale-[1.03]"
                                            : "bg-[var(--bgColor)] text-[var(--mainColor)] border border-(--mainColor) opacity-70"
                                            }`}
                                    >
                                        {isCollected ? (
                                            <TamperIcon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                                        ) : (
                                            <LuCoffee className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                                        )}
                                        <span className="text-[11px] sm:text-xs lg:text-sm font-semibold">
                                            {num}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                </div>

                {/* Right Column: QR Code Card */}
                <div className="md:col-span-5 mt-6 md:mt-0 md:sticky md:top-6 lg:top-8">
                    <section className="bg-white rounded-3xl p-5 sm:p-6 lg:p-7 shadow-sm border border-[#3b2418] transition-colors duration-300">
                        <div className="flex items-center gap-2 mb-3">
                            <LuScanQrCode className="w-4 h-4 lg:w-5 lg:h-5 opacity-70" />
                            <h4 className="text-sm lg:text-base font-bold text-[#3b2418]">
                                Your Personal QR Code
                            </h4>
                        </div>

                        <div className="border border-[#3b2418] rounded-2xl lg:rounded-3xl p-4 sm:p-6 bg-white flex items-center justify-center my-3 max-w-[210px] sm:max-w-[230px] lg:max-w-[250px] mx-auto w-full aspect-square transition-colors duration-300">
                            <QRCodeGraphic className="w-32 h-32 sm:w-36 sm:h-36 lg:w-44 lg:h-44 text-[#3b2418]" />
                        </div>

                        <p className="text-xs sm:text-sm text-center opacity-70 mt-3 text-[#3b2418]">
                            Show this code at the cashier to collect stamps.
                        </p>

                        <button
                            type="button"
                            onClick={() => setIsQrModalOpen(true)}
                            className="w-full mt-4 lg:mt-6 bg-[var(--secondColor)] hover:opacity-90 active:scale-[0.99] text-[var(--mainColor)] font-semibold text-sm lg:text-base py-3.5 px-4 rounded-xl text-center transition-all cursor-pointer shadow-sm"
                        >
                            Show QR Code
                        </button>
                    </section>
                </div>
            </div>

            {/* QR Code Modal */}
            {isQrModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsQrModalOpen(false)}
                    />

                    {/* Modal Card */}
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="qr-modal-title"
                        className="relative z-10 bg-white text-[#3b2418] rounded-3xl p-6 sm:p-8 max-w-sm sm:max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col items-center text-center transition-colors duration-300"
                    >
                        {/* Close Button */}
                        <button
                            type="button"
                            aria-label="Close modal"
                            onClick={() => setIsQrModalOpen(false)}
                            className="absolute top-4 right-4 p-2 rounded-full text-[#3b2418] hover:bg-[#f2ebda] transition cursor-pointer"
                        >
                            <LuX className="w-5 h-5" />
                        </button>

                        <h3
                            id="qr-modal-title"
                            className="text-xl sm:text-2xl font-bold mt-2"
                        >
                            Scan to Collect Stamps
                        </h3>
                        <p className="text-xs sm:text-sm opacity-70 mt-1">
                            Show this QR code to the barista at the cashier
                        </p>

                        {/* Enlarged QR Code */}
                        <div className="w-52 h-52 sm:w-64 sm:h-64 p-4 border-2 border-[#3b2418] rounded-2xl bg-white shadow-md my-4 flex items-center justify-center transition-colors duration-300">
                            <QRCodeGraphic className="w-full h-full text-[#3b2418]" />
                        </div>

                        {/* Member Badge */}
                        <div className="text-xs sm:text-sm font-semibold bg-[var(--cardBg)] px-4 py-1.5 rounded-full transition-colors duration-300">
                            Omar • STAMPY-7842
                        </div>

                        <p className="text-xs opacity-60 mt-3">
                            One visit per calendar day. Reward unlocked automatically at 10 stamps.
                        </p>

                        <button
                            type="button"
                            onClick={() => setIsQrModalOpen(false)}
                            className="w-full mt-5 bg-[var(--mainColor)] hover:opacity-90 active:scale-[0.99] text-[var(--bgColor)] font-semibold text-sm sm:text-base py-3.5 px-4 rounded-xl text-center transition-all cursor-pointer shadow-sm"
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
