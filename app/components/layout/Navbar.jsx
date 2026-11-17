"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Rewards", href: "/rewards" },
    { label: "Cafe", href: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-(--mainColor) border-t border-(--mainColor) py-3 shadow-[0_-2px_8px_rgba(59,36,24,0.04)] md:bottom-6 md:left-1/2 md:-translate-x-1/2 md:right-auto md:w-auto md:min-w-[380px] md:rounded-full md:border md:border-[var(--mainColor)]/15 md:shadow-xl md:py-2.5 md:px-6 md:bg-[var(--mainColor)] md:backdrop-blur-md">
      <div className="max-w-md md:max-w-none mx-auto flex items-center justify-around md:justify-center md:gap-8 px-6 md:px-0">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/" || pathname === "/home"
              : pathname.startsWith(item.href) ||
                (item.href === "/profile" && pathname.startsWith("/cafe"));

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`text-sm md:text-base px-3.5 py-1.5 rounded-full transition-all ${isActive
                ? "font-bold text-[var(--bgColor)] bg-[var(--bgColor)]/10"
                : "font-medium text-[var(--bgColor)]/70 hover:text-[var(--bgColor)] hover:bg-[var(--bgColor)]/5"
                }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
