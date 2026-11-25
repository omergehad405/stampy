"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  LuUsers,
  LuMail,
  LuPhone,
  LuCalendar,
  LuQrCode,
  LuStamp,
  LuGift,
  LuClock,
  LuCoffee,
  LuBan,
  LuCircleCheck,
  LuArrowLeft,
  LuShieldAlert,
} from "react-icons/lu";
import { toast } from "react-toastify";
import AdminPageHeader from "../../components/AdminPageHeader";
import AdminBadge from "../../components/AdminBadge";
import ConfirmModal from "../../components/ConfirmModal";
import { useAdminStore } from "@/app/stores/useAdminStore";
import { apiAdminGetCustomer } from "@/app/lib/adminApi";

export default function AdminCustomerDetailPage({ params }) {
  const unwrappedParams = use(params);
  const { updateCustomerStatus } = useAdminStore();

  const customerId = unwrappedParams.id;
  const [customerRequest, setCustomerRequest] = useState({
    id: "",
    customer: null,
    activities: [],
    isLoading: true,
    error: "",
  });

  useEffect(() => {
    let isCurrent = true;
    apiAdminGetCustomer(customerId)
      .then((response) => {
        if (!response?.success || !response?.data?.customer) {
          throw new Error(response?.message || "Customer details were not returned.");
        }
        if (isCurrent) {
          setCustomerRequest({
            id: customerId,
            customer: response.data.customer,
            activities: response.data.activities || [],
            isLoading: false,
            error: "",
          });
        }
      })
      .catch((error) => {
        if (isCurrent) {
          setCustomerRequest({
            id: customerId,
            customer: null,
            activities: [],
            isLoading: false,
            error: error.message || "Failed to load customer details.",
          });
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [customerId]);

  const isLoading = customerRequest.id !== customerId || customerRequest.isLoading;
  const customer = customerRequest.id === customerId ? customerRequest.customer : null;
  const customerActivities =
    customerRequest.id === customerId ? customerRequest.activities : [];

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    newStatus: "",
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] p-10 text-sm text-(--mainColor)/70">
        <LuClock className="h-5 w-5 animate-spin" />
        Loading customer details...
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="space-y-6">
        <Link
          href="/admin/customers"
          className="inline-flex items-center gap-2 text-xs font-semibold text-(--mainColor) hover:underline"
        >
          <LuArrowLeft className="h-4 w-4" />
          <span>Back to Customers</span>
        </Link>
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-800">
          <h3 className="font-bold">Customer Not Found</h3>
          <p className="mt-1 text-xs">{customerRequest.error || "The requested customer could not be found."}</p>
        </div>
      </div>
    );
  }

  const handleStatusToggle = () => {
    const targetStatus = customer.status === "active" ? "suspended" : "active";
    setConfirmModal({
      isOpen: true,
      newStatus: targetStatus,
    });
  };

  const confirmStatusExecution = async () => {
    const res = await updateCustomerStatus(customer.id, confirmModal.newStatus);
    if (res.success) {
      setCustomerRequest((current) => ({
        ...current,
        customer: { ...current.customer, status: confirmModal.newStatus },
      }));
      toast.success(`Customer status changed to ${confirmModal.newStatus}`);
    } else {
      toast.error(res.error || "Update failed");
    }
    setConfirmModal({ isOpen: false, newStatus: "" });
  };

  // Resolve joined cafes
  const joinedCafesData = Array.isArray(customer.memberships) ? customer.memberships : [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <AdminPageHeader
        title={customer.name}
        description={`Customer ID: ${customer.code || customer.id}. Review loyalty balance, visits, and registered status.`}
        breadcrumbs={[
          { label: "Customers", href: "/admin/customers" },
          { label: customer.name },
        ]}
        actions={
          <div className="flex items-center gap-2.5">
            {customer.status === "active" ? (
              <button
                onClick={handleStatusToggle}
                className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-rose-700 transition shadow-2xs"
              >
                <LuBan className="h-3.5 w-3.5" />
                <span>Suspend Customer</span>
              </button>
            ) : (
              <button
                onClick={handleStatusToggle}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-700 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-800 transition shadow-2xs"
              >
                <LuCircleCheck className="h-3.5 w-3.5" />
                <span>Reactivate Account</span>
              </button>
            )}
          </div>
        }
      />

      {/* Customer Profile Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] p-6 shadow-2xs">
        <div className="flex items-center gap-4">
          <img
            src={
              customer.avatar ||
              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"
            }
            alt={customer.name}
            className="h-16 w-16 rounded-full object-cover border border-[#dacdb9]"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-(--mainColor)">{customer.name}</h2>
              <AdminBadge status={customer.status} />
            </div>
            <p className="text-xs text-(--mainColor)/70 mt-0.5">{customer.email}</p>
            <div className="mt-1 flex items-center gap-3 text-[11px] text-(--mainColor)/60">
              <span>Code: <strong>{customer.code || "N/A"}</strong></span>
              <span>•</span>
              <span>Member since {customer.registeredDate || "N/A"}</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#ebdcc8] bg-[#f5ecdd] p-3 text-right">
          <span className="block text-[11px] text-(--mainColor)/60">Last In-Store Visit</span>
          <span className="text-xs font-bold text-(--mainColor)">
            {customer.lastVisitDate
              ? new Date(customer.lastVisitDate).toLocaleString()
              : "No visit recorded"}
          </span>
        </div>
      </div>

      {/* Customer Stats Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] p-5 shadow-2xs text-center">
          <LuCoffee className="h-5 w-5 mx-auto text-(--mainColor)/70 mb-1" />
          <span className="block text-2xl font-bold text-(--mainColor)">
            {customer.joinedCafesCount || 0}
          </span>
          <span className="text-xs text-(--mainColor)/60">Joined Cafes</span>
        </div>
        <div className="rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] p-5 shadow-2xs text-center">
          <LuStamp className="h-5 w-5 mx-auto text-emerald-700 mb-1" />
          <span className="block text-2xl font-bold text-(--mainColor)">
            {customer.totalLifetimeStamps || customer.lifetimeStamps || customer.stamps || 0}
          </span>
          <span className="text-xs text-(--mainColor)/60">Lifetime Stamps</span>
        </div>
        <div className="rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] p-5 shadow-2xs text-center">
          <LuGift className="h-5 w-5 mx-auto text-purple-700 mb-1" />
          <span className="block text-2xl font-bold text-(--mainColor)">
            {customer.totalRewardsRedeemed || customer.rewardsRedeemedCount || 0}
          </span>
          <span className="text-xs text-(--mainColor)/60">Rewards Redeemed</span>
        </div>
        <div className="rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] p-5 shadow-2xs text-center">
          <LuClock className="h-5 w-5 mx-auto text-(--mainColor)/70 mb-1" />
          <span className="block text-2xl font-bold text-(--mainColor)">
            {customer.totalVisits || 0}
          </span>
          <span className="text-xs text-(--mainColor)/60">Total Store Visits</span>
        </div>
      </div>

      {/* Details Split: Joined Cafes + Activity Timeline */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Joined Cafes & Stamp Balances */}
        <div className="rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] p-6 shadow-2xs">
          <h3 className="font-bold text-sm text-(--mainColor) border-b border-[#ebdcc8] pb-3">
            Participating Cafe Memberships
          </h3>
          <div className="mt-4 space-y-3">
            {joinedCafesData.length === 0 ? (
              <p className="py-4 text-center text-xs text-(--mainColor)/60">
                This customer has not joined a cafe loyalty program.
              </p>
            ) : joinedCafesData.map((c) => (
              <div
                key={c.slug}
                className="flex items-center justify-between rounded-xl border border-[#ebdcc8] bg-[#f5ecdd] p-3.5"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={
                      c.logoImage ||
                      "/logo.png"
                    }
                    alt={c.name}
                    className="h-10 w-10 rounded-lg object-cover border border-[#dacdb9]"
                  />
                  <div>
                    <span className="font-bold text-xs text-(--mainColor) block">{c.name}</span>
                    <span className="text-[11px] text-(--mainColor)/60">{c.category || "Loyalty program"}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="rounded-lg bg-(--mainColor) px-2.5 py-1 text-xs font-bold text-(--secondColor)">
                    {c.stamps} / {c.stampTarget} Stamps
                  </span>
                  <span className="block text-[10px] text-(--mainColor)/60 mt-1">
                    Card Progress
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Notes */}
          {customer.notes && (
            <div className="mt-5 rounded-xl border border-[#dacdb9] bg-[#f2e6d6]/60 p-3 text-xs text-(--mainColor)/80">
              <span className="font-bold text-(--mainColor) block mb-0.5">Staff Notes:</span>
              <p>{customer.notes}</p>
            </div>
          )}
        </div>

        {/* Recent Customer Activity */}
        <div className="rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] p-6 shadow-2xs">
          <h3 className="font-bold text-sm text-(--mainColor) border-b border-[#ebdcc8] pb-3">
            Recent In-Store Activity
          </h3>
          <div className="mt-4 space-y-3">
            {customerActivities.length === 0 ? (
              <p className="text-xs text-(--mainColor)/60 italic py-4 text-center">
                No recent activity recorded for this customer.
              </p>
            ) : (
              customerActivities.map((act) => (
                <div
                  key={act.id}
                  className="flex items-start justify-between rounded-xl bg-[#f5ecdd] p-3 text-xs"
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className={`h-2 w-2 rounded-full mt-1.5 ${
                        act.type === "redemption"
                          ? "bg-purple-600"
                          : act.type === "join"
                          ? "bg-blue-600"
                          : "bg-emerald-600"
                      }`}
                    />
                    <div>
                      <span className="font-bold text-(--mainColor) block">{act.title}</span>
                      <span className="text-[11px] text-(--mainColor)/60">
                        {act.cafeName || "—"} • {act.staffName || "—"}
                      </span>
                      {act.note && (
                        <p className="mt-0.5 text-[11px] text-(--mainColor)/70">{act.note}</p>
                      )}
                    </div>
                  </div>
                  <span className="text-[11px] text-(--mainColor)/50 shrink-0">
                    {act.formattedDate}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={
          confirmModal.newStatus === "suspended"
            ? `Suspend ${customer.name}?`
            : `Reactivate ${customer.name}?`
        }
        description={
          confirmModal.newStatus === "suspended"
            ? "The customer will not be able to present their QR code to earn stamps or redeem rewards."
            : "The customer account will be restored to active status."
        }
        confirmLabel={confirmModal.newStatus === "suspended" ? "Suspend Account" : "Reactivate"}
        confirmVariant={confirmModal.newStatus === "suspended" ? "danger" : "primary"}
        onConfirm={confirmStatusExecution}
        onCancel={() => setConfirmModal({ isOpen: false, newStatus: "" })}
      />
    </div>
  );
}
