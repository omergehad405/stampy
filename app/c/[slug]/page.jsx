"use client";

import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { LuArrowLeft, LuCircleAlert, LuLoader, LuStamp } from "react-icons/lu";
import { toast } from "react-toastify";
import { getAuthToken } from "@/app/lib/apiClient";
import { apiGetCafeForScan, apiSelfScanCafe } from "@/app/lib/cafeApi";
import { useLoyaltyStore } from "@/app/stores/useLoyaltyStore";
import CafeAbout from "@/app/(customer)/cafe/[slug]/components/CafeAbout";
import CafeHeader from "@/app/(customer)/cafe/[slug]/components/CafeHeader";
import CafeInformation from "@/app/(customer)/cafe/[slug]/components/CafeInformation";
import CafeMenuTeaser from "@/app/(customer)/cafe/[slug]/components/CafeMenuTeaser";
import CafeSkeleton from "@/app/(customer)/cafe/[slug]/components/CafeSkeleton";
import CafeSocialLinks from "@/app/(customer)/cafe/[slug]/components/CafeSocialLinks";
import { useCafeData } from "@/app/(customer)/cafe/data/useCafeData";

const subscribeLocale = () => () => {};
const getBrowserLanguage = () =>
  typeof navigator === "undefined" ? "en" : navigator.language;

function CafeScanPageContent() {
  const { slug } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const joinIntent = searchParams.get("join") === "1";
  const fetchCurrentUser = useLoyaltyStore((state) => state.fetchCurrentUser);
  const [cafeResult, setCafeResult] = useState({
    slug: null,
    cafe: null,
    unavailable: false,
    error: "",
  });
  const [isJoining, setIsJoining] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [notice, setNotice] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const attemptStarted = useRef(false);

  const cafe = cafeResult.slug === slug ? cafeResult.cafe : null;
  const loadingCafe = cafeResult.slug !== slug;
  const isUnavailable = cafeResult.slug === slug && cafeResult.unavailable;
  const loadError = cafeResult.slug === slug ? cafeResult.error : "";
  const isArabic = useSyncExternalStore(
    subscribeLocale,
    getBrowserLanguage,
    () => "en"
  ).toLowerCase().startsWith("ar");
  const { operatingStatus } = useCafeData(cafe);

  useEffect(() => {
    let active = true;
    apiGetCafeForScan(slug)
      .then((data) => {
        if (active) {
          setCafeResult({
            slug,
            cafe: data,
            unavailable: false,
            error: "",
          });
        }
      })
      .catch((error) => {
        if (!active) return;
        setCafeResult({
          slug,
          cafe: null,
          unavailable: error.status === 404,
          error:
            error.status === 404
              ? ""
              : error.message || "Could not load this cafe. Please retry.",
        });
      })

    return () => {
      active = false;
    };
  }, [retryCount, slug]);

  const loginForScan = useCallback((join = false) => {
    const returnTo = `/c/${encodeURIComponent(slug)}${join ? "?join=1" : ""}`;
    router.push(`/login?next=${encodeURIComponent(returnTo)}`);
  }, [router, slug]);

  const award = useCallback(async (join = false) => {
    setIsJoining(true);
    setNotice("");
    try {
      const response = await apiSelfScanCafe(slug, { join });
      try {
        await fetchCurrentUser();
      } catch (refreshError) {
        console.warn("[Cafe QR] Could not refresh customer membership:", refreshError);
      }
      toast.success(
        isArabic ? "تمت إضافة ختم إلى بطاقتك!" : "Your stamp has been added!"
      );
      router.replace(`/cafe/${encodeURIComponent(slug)}`);
      return response;
    } catch (error) {
      if (error.code === "DAILY_LIMIT") {
        setNotice(
          isArabic
            ? "حصلت على ختم اليوم بالفعل. نراك غدًا!"
            : "You already got today’s stamp. Come back tomorrow."
        );
      } else if (error.code === "CARD_FULL") {
        setNotice(
          isArabic
            ? "بطاقتك مكتملة. استبدل مكافأتك عند الكاشير."
            : "Your card is complete, redeem your reward at the counter."
        );
      } else if (error.code === "JOIN_REQUIRED") {
        setNotice("");
      } else if (error.code === "CAFE_UNAVAILABLE") {
        setCafeResult((previous) => ({
          ...previous,
          unavailable: true,
        }));
      } else if (error.status === 401) {
        loginForScan(join);
      } else {
        setNotice(
          error.message ||
            (isArabic
              ? "تعذر تسجيل الختم. حاول مرة أخرى."
              : "Could not record your stamp. Please try again.")
        );
      }
      return null;
    } finally {
      setIsJoining(false);
    }
  }, [fetchCurrentUser, isArabic, loginForScan, router, slug]);

  useEffect(() => {
    let active = true;
    const tryAutomaticMemberScan = async () => {
      if (loadingCafe || !cafe || attemptStarted.current) return;
      if (!slug) return;
      if (!getAuthToken()) {
        setIsAuthenticated(false);
        return;
      }

      attemptStarted.current = true;
      setIsAuthenticated(true);
      let authResult;
      try {
        authResult = await fetchCurrentUser();
      } catch (error) {
        if (active) {
          setNotice(
            error.message ||
              (isArabic
                ? "تعذر التحقق من تسجيل الدخول."
                : "Could not verify your sign-in.")
          );
        }
        return;
      }
      if (!active) return;
      if (authResult?.unauthenticated || !getAuthToken()) {
        setIsAuthenticated(false);
        attemptStarted.current = false;
        return;
      }

      const state = useLoyaltyStore.getState();
      setIsMember(
        state.isCafeJoined(slug) ||
          Object.values(state.memberships).some(
            (membership) => membership.cafeId?.toString() === cafe.id
          )
      );
      await award(joinIntent);
    };

    tryAutomaticMemberScan();
    return () => {
      active = false;
    };
  }, [award, cafe, fetchCurrentUser, isArabic, joinIntent, loadingCafe, slug]);

  const handleJoin = () => {
    if (isMember) {
      router.push(`/cafe/${encodeURIComponent(slug)}`);
      return;
    }
    if (!getAuthToken()) {
      loginForScan(true);
      return;
    }
    attemptStarted.current = true;
    award(true);
  };

  if (loadingCafe) return <CafeSkeleton />;

  if (loadError && !cafe) {
    return (
      <main
        lang={isArabic ? "ar" : "en"}
        dir={isArabic ? "rtl" : "ltr"}
        className="mx-auto flex min-h-[65vh] max-w-lg flex-col items-center justify-center px-5 text-center"
      >
        <LuCircleAlert className="mb-3 h-10 w-10 text-(--mainColor)/50" />
        <h1 className="text-xl font-extrabold text-(--mainColor)">
          {isArabic ? "تعذر تحميل بيانات المقهى" : "Could not load cafe"}
        </h1>
        <p role="alert" className="mt-2 text-sm text-(--mainColor)/70">
          {loadError}
        </p>
        <button
          type="button"
          onClick={() => setRetryCount((count) => count + 1)}
          className="mt-5 rounded-xl bg-(--mainColor) px-4 py-2.5 text-sm font-bold text-(--bgColor)"
        >
          {isArabic ? "إعادة المحاولة" : "Try again"}
        </button>
      </main>
    );
  }

  if (isUnavailable || !cafe) {
    return (
      <main
        lang={isArabic ? "ar" : "en"}
        dir={isArabic ? "rtl" : "ltr"}
        className="mx-auto flex min-h-[65vh] max-w-lg flex-col items-center justify-center px-5 text-center"
      >
        <LuCircleAlert className="mb-3 h-10 w-10 text-(--mainColor)/50" />
        <h1 className="text-xl font-extrabold text-(--mainColor)">
          {isArabic ? "المقهى غير متاح" : "Cafe unavailable"}
        </h1>
        <p className="mt-2 text-sm text-(--mainColor)/70">
          {isArabic
            ? "الرابط غير صالح أو أن برنامج الولاء غير نشط حاليًا."
            : "This QR link is invalid or the cafe’s loyalty program is inactive."}
        </p>
        <Link
          href="/home"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-(--mainColor) px-4 py-2.5 text-sm font-bold text-(--bgColor)"
        >
          <LuArrowLeft className="h-4 w-4" />
          {isArabic ? "العودة للرئيسية" : "Back to home"}
        </Link>
      </main>
    );
  }

  return (
    <main
      lang={isArabic ? "ar" : "en"}
      dir={isArabic ? "rtl" : "ltr"}
      className="mx-auto w-full max-w-3xl space-y-5 px-4 pb-14 pt-5 sm:px-6"
    >
      <CafeHeader cafe={cafe} operatingStatus={operatingStatus} />

      <section className="rounded-3xl border border-(--mainColor)/10 bg-(--bgColor)/80 p-5 text-center shadow-sm sm:p-7">
        <LuStamp className="mx-auto h-8 w-8 text-(--mainColor)" />
        <h2 className="mt-2 text-lg font-extrabold text-(--mainColor)">
          {isArabic ? "اجمع ختمك من زيارتك" : "Collect a stamp for your visit"}
        </h2>
        <p className="mx-auto mt-1 max-w-md text-sm text-(--mainColor)/70">
          {isArabic
            ? "امسح رمز المقهى عند زيارتك. يمكنك جمع ختم واحد يوميًا."
            : "Scan the cafe QR when you visit. You can collect one stamp per day."}
        </p>

        {notice && (
          <p
            role="status"
            className="mx-auto mt-4 max-w-md rounded-xl border border-(--mainColor)/15 bg-(--bgColor) px-4 py-3 text-sm font-semibold text-(--mainColor)"
          >
            {notice}
          </p>
        )}

        <button
          type="button"
          onClick={handleJoin}
          disabled={isJoining}
          className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-(--secondColor) px-6 py-3 text-sm font-extrabold text-[#3b2418] transition hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
        >
          {isJoining && <LuLoader className="h-4 w-4 animate-spin" />}
          {isJoining
            ? isArabic ? "جارٍ تسجيل الختم..." : "Recording stamp..."
            : isArabic
              ? isMember
                ? "عرض بطاقة الولاء"
                : isAuthenticated ? "انضم واجمع ختمك الأول" : "سجّل الدخول أو انضم واجمع ختمك"
              : isMember
                ? "View my loyalty card"
                : isAuthenticated ? "Join and get your first stamp" : "Sign in or join to get your stamp"}
        </button>
      </section>

      <CafeAbout about={cafe.about} />
      <CafeInformation cafe={cafe} operatingStatus={operatingStatus} />
      <CafeSocialLinks socialMedia={cafe.socialMedia} />
      <CafeMenuTeaser menuPreview={cafe.menuPreview} />
    </main>
  );
}

export default function CafeScanPage() {
  return (
    <Suspense fallback={<CafeSkeleton />}>
      <CafeScanPageContent />
    </Suspense>
  );
}
