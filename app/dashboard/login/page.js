"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LuCoffee } from "react-icons/lu";

export default function DashboardLoginRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login?as=cafe");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-(--bgColor) text-(--mainColor) p-4">
      <div className="text-center space-y-3">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-(--secondColor) text-[#3B2418]">
          <LuCoffee className="h-6 w-6 animate-pulse" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-wider text-(--mainColor)/70">
          Redirecting to Notch Cafe Portal...
        </p>
        <div>
          <Link
            href="/login?as=cafe"
            className="text-xs font-bold text-(--mainColor) underline"
          >
            Click here if not redirected automatically &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
