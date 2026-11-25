"use client";

import { useCallback, useEffect, useState } from "react";
import { apiGetDashboardAnalytics } from "@/app/lib/dashboardApi";

export default function useAnalytics() {
  const [range, setRange] = useState("all");
  const [atRiskDays, setAtRiskDays] = useState(14);
  const [retryCount, setRetryCount] = useState(0);
  const requestKey = `${range}:${atRiskDays}:${retryCount}`;
  const [result, setResult] = useState({
    key: null,
    status: "loading",
    data: null,
  });

  const retry = useCallback(() => setRetryCount((count) => count + 1), []);

  useEffect(() => {
    let active = true;
    let requestInFlight = false;

    const loadAnalytics = async () => {
      if (requestInFlight) return;
      requestInFlight = true;

      try {
        const response = await apiGetDashboardAnalytics({ range, atRiskDays });
        if (active) {
          setResult({ key: requestKey, status: "loaded", data: response });
        }
      } catch (error) {
        if (active) {
          setResult((current) => {
            if (error.status === 403) {
              return { key: requestKey, status: "locked", data: null };
            }
            if (current.key === requestKey && current.status === "loaded") {
              return current;
            }
            return { key: requestKey, status: "error", data: null };
          });
        }
      } finally {
        requestInFlight = false;
      }
    };

    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") loadAnalytics();
    };

    loadAnalytics();
    const intervalId = window.setInterval(refreshWhenVisible, 30000);
    window.addEventListener("focus", refreshWhenVisible);

    return () => {
      active = false;
      window.clearInterval(intervalId);
      window.removeEventListener("focus", refreshWhenVisible);
    };
  }, [range, atRiskDays, requestKey]);

  const isCurrentResult = result.key === requestKey;

  return {
    range,
    setRange,
    atRiskDays,
    setAtRiskDays,
    data: isCurrentResult ? result.data : null,
    isLoading: !isCurrentResult,
    isLocked: isCurrentResult && result.status === "locked",
    hasError: isCurrentResult && result.status === "error",
    retry,
  };
}
