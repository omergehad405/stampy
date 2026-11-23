"use client";

import { useCallback, useEffect, useState } from "react";
import PlanLockedFeature from "../../components/PlanLockedFeature";
import { useDashboardStore } from "@/app/stores/useDashboardStore";
import {
  apiGetNotificationCampaignStatus,
  apiGetNotificationCampaigns,
  apiGetNotificationRecipientCount,
  apiSendNotificationCampaign,
} from "@/app/lib/dashboardApi";

export default function NotificationCampaignTab({ initialSubject = "" }) {
  const { cafe, hasFeature } = useDashboardStore();
  const subscriptionStatus = cafe?.subscriptionStatus || "active";
  const planAllowsFeature =
    hasFeature("notifications") &&
    ["active", "trial"].includes(subscriptionStatus);

  const [apiLocked, setApiLocked] = useState(false);
  const [recipientCount, setRecipientCount] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [subject, setSubject] = useState(initialSubject.slice(0, 100));
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeCampaignId, setActiveCampaignId] = useState(null);
  const [activeCampaign, setActiveCampaign] = useState(null);
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const isLocked = !planAllowsFeature || apiLocked;
  const isSending = isSubmitting || Boolean(activeCampaignId);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [countResponse, historyResponse] = await Promise.all([
        apiGetNotificationRecipientCount(),
        apiGetNotificationCampaigns(),
      ]);
      setRecipientCount(countResponse.data.count);
      setCampaigns(historyResponse.data.campaigns || []);
      const sendingCampaign = (historyResponse.data.campaigns || []).find(
        (campaign) => campaign.status === "sending"
      );
      if (sendingCampaign) {
        setActiveCampaign(sendingCampaign);
        setActiveCampaignId(sendingCampaign._id || sendingCampaign.id);
      }
      setErrorMessage("");
    } catch (error) {
      if (error.status === 403) {
        setApiLocked(true);
      } else {
        setErrorMessage(error.message || "Unable to load notification data.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!planAllowsFeature || apiLocked) return undefined;
    const timeoutId = setTimeout(loadData, 0);
    return () => clearTimeout(timeoutId);
  }, [planAllowsFeature, apiLocked, loadData]);

  useEffect(() => {
    if (!activeCampaignId) return undefined;
    let cancelled = false;
    let timeoutId;

    const pollCampaign = async () => {
      try {
        const response = await apiGetNotificationCampaignStatus(activeCampaignId);
        if (cancelled) return;
        const campaign = response.data.campaign;
        setActiveCampaign(campaign);
        if (campaign.status === "sending") {
          timeoutId = setTimeout(pollCampaign, 1500);
          return;
        }

        setResult(campaign);
        setActiveCampaignId(null);
        setSubject("");
        setBody("");
        await loadData();
      } catch (error) {
        if (cancelled) return;
        if (error.status === 403) {
          setApiLocked(true);
          setActiveCampaignId(null);
        } else {
          setErrorMessage(error.message || "Unable to check campaign status.");
          timeoutId = setTimeout(pollCampaign, 3000);
        }
      }
    };

    pollCampaign();
    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [activeCampaignId, loadData]);

  const confirmSend = async () => {
    if (isSending || recipientCount < 1) return;
    setIsSubmitting(true);
    setErrorMessage("");
    setResult(null);
    setIsConfirmOpen(false);
    try {
      const response = await apiSendNotificationCampaign({ subject, body });
      setActiveCampaign(response.data.campaign);
      setActiveCampaignId(response.data.campaign.id);
    } catch (error) {
      if (error.status === 403) {
        setApiLocked(true);
      } else {
        setErrorMessage(error.message || "Unable to start the campaign.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLocked) {
    return (
      <PlanLockedFeature
        featureKey="notifications"
        featureName="Email Notifications"
        description="This feature is not included in your current plan. Contact us to upgrade your cafe's plan."
      />
    );
  }

  return (
    <div lang="en" className="space-y-6">
      <section className="space-y-5 rounded-2xl border border-(--bgColor)/15 bg-(--mainColor) p-5 text-(--bgColor) shadow-2xs sm:rounded-3xl sm:p-6">
        <div className="border-b border-(--bgColor)/15 pb-3">
          <h3 className="text-sm font-bold">Send an Email to Subscribers</h3>
          <p className="mt-1 text-xs text-(--bgColor)/65">
            Send an update to customers subscribed to your cafe&apos;s emails.
          </p>
        </div>

        {errorMessage && (
          <p
            role="alert"
            className="rounded-xl border border-red-300/40 bg-red-500/10 p-3 text-xs text-red-200"
          >
            {errorMessage}
          </p>
        )}

        {result && (
          <p
            role="status"
            className="rounded-xl border border-(--secondColor)/40 bg-(--secondColor)/10 p-3 text-xs leading-6"
          >
            {result.status === "stopped"
              ? `The campaign stopped after sending ${result.sentCount} emails. ${result.failedCount} failed.`
              : `Sent to ${result.sentCount} subscribers. ${result.failedCount} emails failed.`}
          </p>
        )}

        {activeCampaign?.status === "sending" && (
          <p role="status" className="rounded-xl bg-(--bgColor)/10 p-3 text-xs">
            Sending to {activeCampaign.recipientsCount} subscribers...
          </p>
        )}

        <div className="space-y-4">
          <div>
            <label
              htmlFor="notification-subject"
              className="mb-1.5 block text-xs font-bold"
            >
              Subject
            </label>
            <input
              id="notification-subject"
              type="text"
              required
              maxLength={100}
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              className="h-11 w-full rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 px-3 text-sm text-(--bgColor) outline-none focus:border-(--secondColor)"
              placeholder="Enter an email subject"
            />
            <p className="mt-1 text-left text-[11px] text-(--bgColor)/55">
              {subject.length}/100
            </p>
          </div>

          <div>
            <label
              htmlFor="notification-body"
              className="mb-1.5 block text-xs font-bold"
            >
              Message
            </label>
            <textarea
              id="notification-body"
              required
              maxLength={1000}
              rows={6}
              value={body}
              onChange={(event) => setBody(event.target.value)}
              className="w-full resize-y rounded-xl border border-(--bgColor)/20 bg-(--bgColor)/10 p-3 text-sm leading-6 text-(--bgColor) outline-none focus:border-(--secondColor)"
              placeholder="Write your message to subscribers"
            />
            <p className="mt-1 text-left text-[11px] text-(--bgColor)/55">
              {body.length}/1000
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-(--bgColor)/15 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-semibold" aria-live="polite">
            {recipientCount === 0
              ? "There are no subscribers yet."
              : recipientCount === null
                ? "Loading subscriber count..."
                : `This email will be sent to ${recipientCount} subscribers.`}
          </p>
          <button
            type="button"
            disabled={
              isLoading ||
              isSending ||
              recipientCount === null ||
              recipientCount === 0 ||
              !subject.trim() ||
              !body.trim()
            }
            onClick={() => setIsConfirmOpen(true)}
            className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-(--secondColor) px-5 py-2.5 text-xs font-bold text-[#3B2418] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSending ? "Sending..." : "Send"}
          </button>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-(--bgColor)/15 bg-(--mainColor) text-(--bgColor) shadow-2xs sm:rounded-3xl">
        <div className="border-b border-(--bgColor)/15 px-5 py-4">
          <h3 className="text-sm font-bold">Recent Campaigns</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-xs">
            <thead className="bg-(--bgColor)/5 text-(--bgColor)/65">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Subject
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Date
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Recipients
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Failed
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--bgColor)/10">
              {campaigns.map((campaign) => (
                <tr key={campaign._id || campaign.id}>
                  <td className="max-w-[240px] truncate px-4 py-3">
                    {campaign.subject}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {new Date(campaign.createdAt).toLocaleDateString("en-US")}
                  </td>
                  <td className="px-4 py-3">{campaign.recipientsCount}</td>
                  <td className="px-4 py-3">{campaign.failedCount}</td>
                </tr>
              ))}
              {!isLoading && campaigns.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-(--bgColor)/60"
                  >
                    No campaigns have been sent yet.
                  </td>
                </tr>
              )}
              {isLoading && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-(--bgColor)/60"
                  >
                    Loading campaign history...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {isConfirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-notification-title"
            className="w-full max-w-md space-y-5 rounded-2xl border border-[#e3d7c0] bg-[#faf6ed] p-6 text-left text-[#3B2418] shadow-2xl"
          >
            <div>
              <h3 id="confirm-notification-title" className="font-bold">
                Confirm Campaign
              </h3>
              <p className="mt-3 text-sm leading-6">
                Send “{subject}” to {recipientCount} subscribers?
              </p>
            </div>
            <div className="flex justify-start gap-2">
              <button
                type="button"
                onClick={() => setIsConfirmOpen(false)}
                className="rounded-xl border border-[#3B2418]/20 px-4 py-2 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmSend}
                disabled={isSubmitting}
                className="rounded-xl bg-[#8EC5FF] px-4 py-2 text-xs font-bold disabled:opacity-50"
              >
                Confirm Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
