"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuCoffee, LuGift, LuStore, LuHouse, LuCompass, LuUser } from "react-icons/lu";

export default function Navbar() {
  const pathname = usePathname();

  // If on login, auth screens, cafe dashboard, or admin dashboard, hide customer navbar
  if (
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password" ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin")
  ) {
    return null;
  }

  // Detect whether we are in an individual cafe context: /cafe/[slug]...
  const isCafeRoute = pathname.startsWith("/cafe/");

  if (isCafeRoute) {
    // Extract cafe slug: /cafe/:slug(/rewards|/info|...)
    const pathSegments = pathname.split("/").filter(Boolean);
    const cafeSlug = pathSegments[1];

    if (!cafeSlug) return null;

    const cafeNavItems = [
      {
        label: "Home",
        href: `/cafe/${cafeSlug}`,
        icon: LuCoffee,
        isActive: pathname === `/cafe/${cafeSlug}`,
      },
      {
        label: "Rewards",
        href: `/cafe/${cafeSlug}/rewards`,
        icon: LuGift,
        isActive: pathname === `/cafe/${cafeSlug}/rewards`,
      },
      {
        label: "Cafe",
        href: `/cafe/${cafeSlug}/info`,
        icon: LuStore,
        isActive:
          pathname === `/cafe/${cafeSlug}/info` ||
          pathname === `/cafe/${cafeSlug}/about`,
      },
    ];

    return (
      <nav
        aria-label="Cafe Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 bg-(--mainColor) border-t border-(--mainColor) py-3 shadow-[0_-2px_12px_rgba(59,36,24,0.06)] md:bottom-6 md:left-1/2 md:-translate-x-1/2 md:right-auto md:w-auto md:min-w-[360px] md:rounded-full md:border md:border-(--mainColor)/15 md:shadow-xl md:py-2.5 md:px-6 md:backdrop-blur-md"
      >
        <div className="max-w-md md:max-w-none mx-auto flex items-center justify-around md:justify-center md:gap-8 px-6 md:px-0">
          {cafeNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-2 text-sm md:text-base px-4 py-1.5 rounded-full transition-all cursor-pointer ${item.isActive
                  ? "font-bold text-(--bgColor) bg-(--bgColor)/15 shadow-xs"
                  : "font-medium text-(--bgColor)/75 hover:text-(--bgColor) hover:bg-(--bgColor)/5"
                  }`}
              >
                <Icon className="w-4 h-4 md:w-4.5 md:h-4.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    );
  }

  // Global Navigation: Home, My Cafes, Profile
  const globalNavItems = [
    {
      label: "Home",
      href: "/",
      icon: LuHouse,
      isActive: pathname === "/" || pathname === "/home",
    },
    {
      label: "Cafes",
      href: "/my-cafes",
      icon: LuCompass,
      isActive: pathname.startsWith("/my-cafes"),
    },
    {
      label: "Profile",
      href: "/profile",
      icon: LuUser,
      isActive: pathname.startsWith("/profile"),
    },
  ];

  return (
    <nav
      aria-label="Global Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-(--mainColor) border-t border-(--mainColor) py-3 shadow-[0_-2px_12px_rgba(59,36,24,0.06)] md:bottom-6 md:left-1/2 md:-translate-x-1/2 md:right-auto md:w-auto md:min-w-[380px] md:rounded-full md:border md:border-(--mainColor)/15 md:shadow-xl md:py-2.5 md:px-6 md:backdrop-blur-md"
    >
      <div className="max-w-md md:max-w-none mx-auto flex items-center justify-around md:justify-center md:gap-8 px-6 md:px-0">
        {globalNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-2 text-sm md:text-base px-4 py-1.5 rounded-full transition-all cursor-pointer ${item.isActive
                ? "font-bold text-(--bgColor) bg-(--bgColor)/15 shadow-xs"
                : "font-medium text-(--bgColor)/75 hover:text-(--bgColor) hover:bg-(--bgColor)/5"
                }`}
            >
              <Icon className="w-4 h-4 md:w-4.5 md:h-4.5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
