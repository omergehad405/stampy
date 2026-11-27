"use client";

import { Suspense, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import CafeSkeleton from "@/app/(customer)/cafe/[slug]/components/CafeSkeleton";
import { getAuthToken } from "@/app/lib/apiClient";

function LegacyCafeScanPageContent() {
  const { slug } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const joinIntent = searchParams.get("join") === "1";

  useEffect(() => {
    if (!slug) return;
    if (!getAuthToken()) {
      router.replace(`/cafe/${encodeURIComponent(slug)}/info`);
      return;
    }
    const query = new URLSearchParams({ scan: "1" });
    if (joinIntent) query.set("join", "1");
    router.replace(`/cafe/${encodeURIComponent(slug)}?${query.toString()}`);
  }, [joinIntent, router, slug]);

  return <CafeSkeleton />;
}

export default function LegacyCafeScanPage() {
  return (
    <Suspense fallback={<CafeSkeleton />}>
      <LegacyCafeScanPageContent />
    </Suspense>
  );
}
