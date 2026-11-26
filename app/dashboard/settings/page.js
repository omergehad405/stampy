"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { LuBell, LuShield, LuUser } from "react-icons/lu";
import DashboardPageHeader from "../components/DashboardPageHeader";
import { useDashboardAuthStore } from "@/app/stores/useDashboardAuthStore";
import { useDashboardStore } from "@/app/stores/useDashboardStore";
import AccountSettingsTab from "./components/AccountSettingsTab";
import SecuritySettingsTab from "./components/SecuritySettingsTab";
import NotificationCampaignTab from "./components/NotificationCampaignTab";

const TABS = [
  { key: "account", label: "Your Profile", icon: LuUser },
  { key: "security", label: "Password & Security", icon: LuShield },
  { key: "notifications", label: "Notifications", icon: LuBell },
];

export default function DashboardSettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="h-48 animate-pulse rounded-2xl bg-(--mainColor)" />
      }
    >
      <DashboardSettingsContent />
    </Suspense>
  );
}

function DashboardSettingsContent() {
  const searchParams = useSearchParams();
  const { checkAuth } = useDashboardAuthStore();
  const { fetchCafeProfile, isLoadingCafe } = useDashboardStore();
  const requestedTab = searchParams.get("tab");
  const initialTab = TABS.some((tab) => tab.key === requestedTab)
    ? requestedTab
    : "account";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const initialSubject = searchParams.get("subject") || "";

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const [session, profile] = await Promise.all([
        checkAuth(),
        fetchCafeProfile(),
      ]);
      setRefreshKey((key) => key + 1);
      if (session.success && profile.success) {
        toast.success("Settings refreshed.");
      } else {
        toast.error(profile.error || "Unable to refresh all settings.");
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Settings & Preferences"
        description="Manage your staff profile, security, and notification settings."
        breadcrumbs={[{ label: "Settings" }]}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing || isLoadingCafe}
      />

      <div
        aria-label="Settings tabs"
        className="flex gap-2 overflow-x-auto rounded-2xl border border-(--bgColor)/15 bg-(--mainColor) p-2 shadow-2xs"
      >
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActiveTab(tab.key)}
              className={`flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 text-xs font-bold transition ${
                isActive
                  ? "bg-(--secondColor) text-[#3B2418] shadow-xs"
                  : "text-(--bgColor)/70 hover:bg-(--bgColor)/10"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div hidden={activeTab !== "account"}>
        <AccountSettingsTab />
      </div>
      <div hidden={activeTab !== "security"}>
        <SecuritySettingsTab />
      </div>
      {activeTab === "notifications" && (
        <div aria-label="Notifications">
          <NotificationCampaignTab
            initialSubject={initialSubject}
            refreshKey={refreshKey}
          />
        </div>
      )}
    </div>
  );
}
