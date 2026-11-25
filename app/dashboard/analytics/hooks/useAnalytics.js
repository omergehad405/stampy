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

    apiGetDashboardAnalytics({ range, atRiskDays })
      .then((response) => {
        if (!active) return;
        setResult({ key: requestKey, status: "loaded", data: response });
      })
      .catch((error) => {
        if (!active) return;
        if (error.status === 403) {
          setResult({ key: requestKey, status: "locked", data: null });
        } else {
          setResult({ key: requestKey, status: "error", data: null });
        }
      });

    return () => {
      active = false;
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
