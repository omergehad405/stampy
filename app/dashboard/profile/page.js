"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";
import { LuRotateCcw, LuSave } from "react-icons/lu";
import { toast } from "react-toastify";
import DashboardPageHeader from "../components/DashboardPageHeader";
import { useDashboardStore } from "@/app/stores/useDashboardStore";
import BasicInfoTab from "./components/BasicInfoTab";
import AboutTab from "./components/AboutTab";
import LocationTab from "./components/LocationTab";
import HoursTab from "./components/HoursTab";
import ContactTab from "./components/ContactTab";
import SocialTab from "./components/SocialTab";
import MenuTab from "./components/MenuTab";
import QrTab from "./components/QrTab";

const WEEK_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const TIME_OPTIONS = Array.from({ length: 48 }, (_, idx) => {
  const totalMinutes = idx * 30;
  const hours24 = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 || 12;
  const value = `${hours24.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
  const label = `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
  return { value, label };
});

const extractWhatsAppNumber = (whatsAppData) => {
  const handle = whatsAppData?.handle || "";
  const existingUrl = whatsAppData?.url || "";

  if (handle.trim()) return handle;
  if (!existingUrl.trim()) return "";

  const waMatch = existingUrl.match(/wa\.me\/([^?]+)/i);
  if (waMatch?.[1]) return waMatch[1];

  return existingUrl.replace(/[^\d+]/g, "");
};

const buildWhatsAppUrl = (phoneNumber) => {
  const cleaned = (phoneNumber || "").replace(/[^\d]/g, "");
  return cleaned ? `https://wa.me/${cleaned}` : "";
};

const escapeXml = (value) =>
  value.replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&apos;",
    };
    return entities[character];
  });

const addCafeNameToQrSvg = (svg, cafeName) => {
  const viewBoxMatch = svg.match(/viewBox="([\d.\s-]+)"/);
  if (!viewBoxMatch) throw new Error("Could not prepare the QR code for download.");

  const [x, y, width, height] = viewBoxMatch[1].trim().split(/\s+/).map(Number);
  const labelHeight = width * 0.2;
  const renderedHeight = Number(svg.match(/height="([\d.]+)/)?.[1]) || width;
  const labelHeightInPixels = (labelHeight * renderedHeight) / height;
  const labelY = y + height;
  const extendedSvg = svg
    .replace(
      /viewBox="[^"]+"/,
      `viewBox="${x} ${y} ${width} ${height + labelHeight}"`
    )
    .replace(
      /height="[^"]+"/,
      `height="${renderedHeight + labelHeightInPixels}"`
    );

  return extendedSvg.replace(
    "</svg>",
    `<text x="${x + width / 2}" y="${labelY + width * 0.07}" text-anchor="middle" fill="#3B2418" font-family="Arial, sans-serif" font-size="${width * 0.045}" font-weight="700" textLength="${width * 0.84}" lengthAdjust="spacingAndGlyphs">${escapeXml(cafeName)}</text>` +
      `<text x="${x + width / 2}" y="${labelY + width * 0.14}" text-anchor="middle" fill="#3B2418" font-family="Arial, sans-serif" font-size="${width * 0.03}">Powered by Notch</text></svg>`
  );
};

const sanitizeSchedule = (schedule) => {
  if (!Array.isArray(schedule) || schedule.length === 0) return [];
  return schedule.map((item, idx) => ({
    day: WEEK_DAYS.includes(item?.day)
      ? item.day
      : WEEK_DAYS[idx % WEEK_DAYS.length],
    open: item?.open || "07:30",
    close: item?.close || "19:00",
  }));
};

const buildProfileForm = (cafe) => ({
  name: cafe?.name || "",
  tagline: cafe?.tagline || "",
  category: cafe?.category || "",
  establishedYear: cafe?.establishedYear || 2021,
  coverImage: cafe?.coverImage || "",
  logoImage: cafe?.logoImage || "",
  isVerified: cafe?.isVerified || false,
  about: {
    shortDescription: cafe?.about?.shortDescription || "",
    fullDescription: cafe?.about?.fullDescription || "",
    highlights: cafe?.about?.highlights ? [...cafe.about.highlights] : [],
  },
  location: {
    address: cafe?.location?.address || "",
    district: cafe?.location?.district || "",
    city: cafe?.location?.city || "",
    postcode: cafe?.location?.postcode || "",
    fullAddress: cafe?.location?.fullAddress || "",
    directionsHint: cafe?.location?.directionsHint || "",
    googleMapsUrl: cafe?.location?.googleMapsUrl || "",
    googleMapsReviewUrl: cafe?.location?.googleMapsReviewUrl || "",
  },
  openingHours: {
    timezone: cafe?.openingHours?.timezone || "Africa/Cairo",
    holidayNotice: cafe?.openingHours?.holidayNotice || "",
    schedule: sanitizeSchedule(cafe?.openingHours?.schedule),
  },
  contact: {
    phone: cafe?.contact?.phone || "",
    displayPhone: cafe?.contact?.displayPhone || "",
    email: cafe?.contact?.email || "",
  },
  website: {
    url: cafe?.website?.url || "",
    displayUrl: cafe?.website?.displayUrl || "",
  },
  socialMedia: {
    instagram: {
      handle: cafe?.socialMedia?.instagram?.handle || "",
      url: cafe?.socialMedia?.instagram?.url || "",
    },
    facebook: {
      handle: cafe?.socialMedia?.facebook?.handle || "",
      url: cafe?.socialMedia?.facebook?.url || "",
    },
    tiktok: {
      handle: cafe?.socialMedia?.tiktok?.handle || "",
      url: cafe?.socialMedia?.tiktok?.url || "",
    },
    whatsapp: {
      handle: extractWhatsAppNumber(cafe?.socialMedia?.whatsapp),
      url: buildWhatsAppUrl(extractWhatsAppNumber(cafe?.socialMedia?.whatsapp)),
    },
  },
  menuPreview: {
    isAvailable: cafe?.menuPreview?.isAvailable ?? true,
    note: cafe?.menuPreview?.note || "",
    categories: cafe?.menuPreview?.categories
      ? cafe.menuPreview.categories.map((c) => ({ ...c }))
      : [],
  },
});

export default function DashboardCafeProfilePage() {
  const { cafe, updateCafeProfile, hasFeature } = useDashboardStore();

  const [activeTab, setActiveTab] = useState("basic");
  const [isSaving, setIsSaving] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [newHighlight, setNewHighlight] = useState("");
  const [logoMode, setLogoMode] = useState("url");
  const [coverMode, setCoverMode] = useState("url");
  const [profileForm, setProfileForm] = useState(() => buildProfileForm(cafe));

  const logoFileRef = useRef(null);
  const coverFileRef = useRef(null);

  const scheduleRows = sanitizeSchedule(profileForm.openingHours.schedule);
  const cafeSlug = cafe?.slug || "";
  const cafeName = cafe?.name || "Cafe";

  const cafeInfoUrl = useMemo(() => {
    if (!cafeSlug) return "";
    if (typeof window !== "undefined")
      return `${window.location.origin}/c/${cafeSlug}`;
    return `/c/${cafeSlug}`;
  }, [cafeSlug]);

  const handleCopyUrl = useCallback(async () => {
    if (!cafeInfoUrl) return;
    try {
      await navigator.clipboard.writeText(cafeInfoUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch {
      // Ignore clipboard failures in unsupported browsers.
    }
  }, [cafeInfoUrl]);

  const handleDownloadQr = useCallback(async () => {
    if (!cafeInfoUrl) return;
    try {
      const qrDataUrl = await QRCode.toDataURL(cafeInfoUrl, {
        width: 720,
        margin: 2,
        errorCorrectionLevel: "M",
        color: { dark: "#1B120C", light: "#FFFFFF" },
      });
      const qrImage = await new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error("Could not prepare the QR code."));
        image.src = qrDataUrl;
      });
      const canvas = document.createElement("canvas");
      canvas.width = 840;
      canvas.height = 1020;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Could not prepare the QR code image.");
      context.fillStyle = "#FFFFFF";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(qrImage, 60, 60, 720, 720);
      context.fillStyle = "#3B2418";
      context.textAlign = "center";
      context.font = "700 38px Arial, sans-serif";
      context.fillText(cafeName, 420, 860, 760);
      context.font = "24px Arial, sans-serif";
      context.fillText("Powered by Notch", 420, 915);

      const blob = await new Promise((resolve, reject) => {
        canvas.toBlob((result) => {
          if (result) resolve(result);
          else reject(new Error("Could not create the QR code image."));
        }, "image/png");
      });
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${cafeSlug || "cafe"}-Notch-qr.png`;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    } catch (error) {
      toast.error(error.message || "Could not download the QR code.");
    }
  }, [cafeInfoUrl, cafeName, cafeSlug]);

  const handleDownloadQrSvg = useCallback(async () => {
    if (!cafeInfoUrl) return;
    try {
      const qrSvg = await QRCode.toString(cafeInfoUrl, {
        type: "svg",
        width: 720,
        margin: 2,
        errorCorrectionLevel: "M",
        color: { dark: "#1B120C", light: "#FFFFFF" },
      });
      const svg = addCafeNameToQrSvg(qrSvg, cafeName);
      const blobUrl = URL.createObjectURL(
        new Blob([svg], { type: "image/svg+xml;charset=utf-8" })
      );
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${cafeSlug || "cafe"}-Notch-qr.svg`;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    } catch (error) {
      toast.error(error.message || "Could not download the QR code.");
    }
  }, [cafeName, cafeSlug, cafeInfoUrl]);

  const handlePrintQr = useCallback(async () => {
    if (!cafeInfoUrl) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Allow pop-ups to print or save the QR code as PDF.");
      return;
    }

    try {
      const svg = await QRCode.toString(cafeInfoUrl, {
        type: "svg",
        width: 720,
        margin: 2,
        errorCorrectionLevel: "M",
        color: { dark: "#1B120C", light: "#FFFFFF" },
      });
      const printDocument = printWindow.document;
      printDocument.title = `${cafeName} QR Code`;
      printDocument.body.replaceChildren();

      const style = printDocument.createElement("style");
      style.textContent =
        "body{font-family:Arial,sans-serif;color:#3B2418;text-align:center;padding:40px}" +
        "img{display:block;width:min(78vw,420px);height:auto;margin:20px auto 8px}" +
        "h1{font-size:24px;margin:8px 0}" +
        "@media print{body{padding:10mm}}";
      const heading = printDocument.createElement("h1");
      heading.textContent = cafeName;
      const image = printDocument.createElement("img");
      image.alt = `${cafeName} cafe QR code`;
      image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
      const instruction = printDocument.createElement("p");
      instruction.textContent = "Scan to open the cafe page and collect a stamp.";
      printDocument.head.append(style);
      printDocument.body.append(image, heading, instruction);
      image.onload = () => {
        printWindow.focus();
        printWindow.print();
      };
      image.onerror = () => {
        printWindow.close();
        toast.error("Could not prepare the QR code for printing.");
      };
    } catch (error) {
      printWindow.close();
      toast.error(error.message || "Could not prepare the QR code for printing.");
    }
  }, [cafeName, cafeInfoUrl]);

  const handleSave = async (e) => {
    e?.preventDefault();
    setIsSaving(true);
    try {
      const whatsappNumber = profileForm.socialMedia?.whatsapp?.handle || "";
      const payload = {
        ...profileForm,
        socialMedia: {
          ...profileForm.socialMedia,
          whatsapp: {
            ...(profileForm.socialMedia?.whatsapp || {}),
            handle: whatsappNumber,
            url: buildWhatsAppUrl(whatsappNumber),
          },
        },
      };

      await updateCafeProfile(payload);
      toast.success(
        "Cafe profile updated successfully! Changes are live on customer pages.",
      );
    } catch (error) {
      toast.error(error?.message || "Failed to save cafe profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setProfileForm(buildProfileForm(cafe));
    toast.info("Changes reset to saved values.");
  };

  const addHighlight = () => {
    if (!newHighlight.trim()) return;
    setProfileForm((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        highlights: [...prev.about.highlights, newHighlight.trim()],
      },
    }));
    setNewHighlight("");
  };

  const removeHighlight = (index) => {
    setProfileForm((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        highlights: prev.about.highlights.filter((_, i) => i !== index),
      },
    }));
  };

  const updateScheduleItem = (index, field, value) => {
    setProfileForm((prev) => {
      const schedule = sanitizeSchedule(prev.openingHours.schedule);
      schedule[index] = { ...schedule[index], [field]: value };
      return {
        ...prev,
        openingHours: { ...prev.openingHours, schedule },
      };
    });
  };

  const addScheduleRow = () => {
    const usedDays = new Set(scheduleRows.map((row) => row.day));
    const firstAvailableDay =
      WEEK_DAYS.find((day) => !usedDays.has(day)) || "Monday";

    setProfileForm((prev) => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        schedule: [
          ...prev.openingHours.schedule,
          { day: firstAvailableDay, open: "07:30", close: "19:00" },
        ],
      },
    }));
  };

  const removeScheduleRow = (index) => {
    setProfileForm((prev) => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        schedule: prev.openingHours.schedule.filter((_, idx) => idx !== index),
      },
    }));
  };

  const addMenuCategory = () => {
    const newCat = {
      id: `cat-${Date.now()}`,
      title: "",
      description: "",
      price: "",
    };
    setProfileForm((prev) => ({
      ...prev,
      menuPreview: {
        ...prev.menuPreview,
        categories: [...prev.menuPreview.categories, newCat],
      },
    }));
  };

  const removeMenuCategory = (id) => {
    setProfileForm((prev) => ({
      ...prev,
      menuPreview: {
        ...prev.menuPreview,
        categories: prev.menuPreview.categories.filter((c) => c.id !== id),
      },
    }));
  };

  const updateMenuCategory = (id, field, value) => {
    setProfileForm((prev) => ({
      ...prev,
      menuPreview: {
        ...prev.menuPreview,
        categories: prev.menuPreview.categories.map((c) =>
          c.id === id ? { ...c, [field]: value } : c,
        ),
      },
    }));
  };

  const tabs = [
    { key: "basic", label: "Basic Info & Media" },
    { key: "about", label: "About & Highlights" },
    { key: "location", label: "Location & Address" },
    { key: "hours", label: "Opening Hours" },
    { key: "contact", label: "Contact & Website" },
    { key: "social", label: "Social Media" },
    { key: "menu", label: "Digital Menu" },
    { key: "qr", label: "Cafe QR Code" },
  ];

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Cafe Profile Management"
        description="Edit the public information, opening hours, story, and digital menu shown to customers on the Notch app."
        breadcrumbs={[{ label: "Cafe Profile" }]}
        actions={
          <>
            <button
              onClick={handleReset}
              type="button"
              className="flex items-center gap-1.5 rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 px-3.5 py-2 text-xs font-semibold text-(--bgColor) hover:bg-(--bgColor)/20 transition cursor-pointer"
            >
              <LuRotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-1.5 rounded-xl bg-(--secondColor) px-4 py-2 text-xs font-bold text-[#3B2418] shadow-sm hover:bg-(--secondColor)/90 transition cursor-pointer disabled:opacity-70"
            >
              <LuSave className="h-4 w-4" />
              <span>{isSaving ? "Saving..." : "Save Changes"}</span>
            </button>
          </>
        }
      />

      <div className="flex gap-1.5 overflow-x-auto rounded-2xl border border-(--bgColor)/15 bg-(--mainColor) p-2 shadow-2xs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === tab.key
                ? "bg-(--mainColor) text-(--secondColor) shadow-xs"
                : "text-(--bgColor)/70 hover:bg-(--bgColor)/15"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl sm:rounded-3xl border border-(--bgColor)/15 bg-(--mainColor) text-(--bgColor) p-6 shadow-xs">
        {activeTab === "basic" && (
          <BasicInfoTab
            profileForm={profileForm}
            setProfileForm={setProfileForm}
            logoMode={logoMode}
            setLogoMode={setLogoMode}
            coverMode={coverMode}
            setCoverMode={setCoverMode}
            logoFileRef={logoFileRef}
            coverFileRef={coverFileRef}
          />
        )}

        {activeTab === "about" && (
          <AboutTab
            profileForm={profileForm}
            setProfileForm={setProfileForm}
            newHighlight={newHighlight}
            setNewHighlight={setNewHighlight}
            addHighlight={addHighlight}
            removeHighlight={removeHighlight}
          />
        )}

        {activeTab === "location" && (
          <LocationTab
            profileForm={profileForm}
            setProfileForm={setProfileForm}
          />
        )}

        {activeTab === "hours" && (
          <HoursTab
            scheduleRows={scheduleRows}
            addScheduleRow={addScheduleRow}
            handleSave={handleSave}
            updateScheduleItem={updateScheduleItem}
            removeScheduleRow={removeScheduleRow}
            profileForm={profileForm}
            setProfileForm={setProfileForm}
            timeOptions={TIME_OPTIONS}
            weekDays={WEEK_DAYS}
          />
        )}

        {activeTab === "contact" && (
          <ContactTab
            profileForm={profileForm}
            setProfileForm={setProfileForm}
          />
        )}

        {activeTab === "social" && (
          <SocialTab
            profileForm={profileForm}
            setProfileForm={setProfileForm}
          />
        )}

        {activeTab === "menu" && (
          <MenuTab
            hasFeature={hasFeature}
            profileForm={profileForm}
            addMenuCategory={addMenuCategory}
            removeMenuCategory={removeMenuCategory}
            updateMenuCategory={updateMenuCategory}
          />
        )}

        {activeTab === "qr" && (
          <QrTab
            cafe={cafe}
            cafeInfoUrl={cafeInfoUrl}
            handleDownloadQr={handleDownloadQr}
            handleDownloadQrSvg={handleDownloadQrSvg}
            handlePrintQr={handlePrintQr}
            handleCopyUrl={handleCopyUrl}
            copiedUrl={copiedUrl}
          />
        )}
      </div>
    </div>
  );
}
