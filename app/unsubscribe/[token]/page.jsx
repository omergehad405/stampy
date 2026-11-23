"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { API_BASE } from "@/app/lib/apiClient";

export default function UnsubscribePage() {
  const { token } = useParams();
  const [status, setStatus] = useState("ready");
  const [message, setMessage] = useState("");

  const unsubscribe = async () => {
    if (!token || status === "submitting") return;
    setStatus("submitting");
    try {
      const response = await fetch(
        `${API_BASE}/api/dashboard/notifications/unsubscribe/${encodeURIComponent(token)}`,
        { method: "POST" }
      );
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.message || "Unable to unsubscribe using this link.");
        setStatus("error");
        return;
      }
      setMessage(data.message || "You have unsubscribed from this cafe's emails.");
      setStatus("done");
    } catch {
      setMessage("Unable to unsubscribe right now. Please try again later.");
      setStatus("error");
    }
  };

  return (
    <main
      lang="en"
      className="flex min-h-screen items-center justify-center bg-[#F2EBDA] p-5 text-[#3B2418]"
    >
      <section className="w-full max-w-lg space-y-5 rounded-3xl border border-[#3B2418]/10 bg-[#faf6ed] p-7 text-center shadow-lg sm:p-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#8EC5FF] text-2xl" aria-hidden="true">
          ✉
        </div>
        <h1 className="text-xl font-bold">Cafe Email Preferences</h1>
        {status === "ready" ? (
          <>
            <p className="text-sm leading-7 text-[#3B2418]/75">
              Do you want to unsubscribe from this cafe&apos;s emails?
            </p>
            <button
              type="button"
              onClick={unsubscribe}
              className="min-h-11 rounded-xl bg-[#8EC5FF] px-5 py-3 text-sm font-bold transition hover:opacity-90"
            >
              Unsubscribe
            </button>
          </>
        ) : (
          <>
            <p role={status === "error" ? "alert" : "status"} className="text-sm leading-7">
              {status === "submitting" ? "Updating your email preferences..." : message}
            </p>
            {status === "error" && (
              <button
                type="button"
                onClick={unsubscribe}
                className="min-h-11 rounded-xl bg-[#8EC5FF] px-5 py-3 text-sm font-bold transition hover:opacity-90"
              >
                Try Again
              </button>
            )}
          </>
        )}
      </section>
    </main>
  );
}
