import Link from "next/link";
import {
  LuScanLine,
  LuUsers,
  LuGift,
  LuShieldCheck,
  LuListOrdered,
  LuSlidersHorizontal,
  LuCoffee,
  LuQrCode,
  LuSparkles,
  LuArrowRight,
  LuLayers,
  LuUtensils,
  LuTrendingUp,
  LuCompass,
  LuRefreshCw,
  LuSmartphone,
} from "react-icons/lu";
import {
  CAFE_FEATURES,
  CUSTOMER_BENEFITS,
  ONLINE_MENU_CONTENT,
  EXPOSURE_CONTENT,
  BRAND,
} from "../content";

export const metadata = {
  title: "Platform Features for Cafes in Egypt | Notch",
  description:
    "Explore Notch features: repeat-customer reward engine, 1-second QR scanner terminal, customer directory, online digital menus, and free Discover exposure.",
};

export default function FeaturesPage() {
  const cafeIcons = {
    gift: LuGift,
    scanner: LuScanLine,
    users: LuUsers,
    sparkles: LuSparkles,
    shield: LuShieldCheck,
    list: LuListOrdered,
    menu: LuUtensils,
    analytics: LuTrendingUp,
  };

  const menuIcons = {
    refresh: LuRefreshCw,
    smartphone: LuSmartphone,
    layers: LuLayers,
  };

  return (
    <div className="space-y-24 py-12 sm:py-16">
      {/* Page Header */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="inline-block rounded-full bg-(--secondColor)/30 px-3 py-1 text-xs font-bold text-(--mainColor)">
          Platform Capabilities
        </span>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-(--mainColor) tracking-tight">
          A Growth Engine for Egyptian Cafes
        </h1>
        <p className="mx-auto max-w-2xl text-sm sm:text-base leading-relaxed text-(--mainColor)/75">
          Everything your coffee shop needs to turn one-time visitors into loyal regulars, showcase your digital menu, and get discovered by new coffee enthusiasts.
        </p>
      </section>

      {/* 1. Cafe Features Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border-b border-(--mainColor)/15 pb-4 mb-8">
          <h2 className="text-xl sm:text-2xl font-extrabold text-(--mainColor)">
            Cafe Staff & Counter Tools
          </h2>
          <p className="text-xs sm:text-sm text-(--mainColor)/70">
            A fast, responsive terminal and management system built for busy Egyptian coffee counters.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {CAFE_FEATURES.features.map((feat) => {
            const Icon = cafeIcons[feat.icon] || LuCoffee;
            return (
              <div
                key={feat.title}
                className="rounded-2xl border border-(--mainColor)/15 bg-(--bgColor) p-6 sm:p-7 shadow-2xs space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-(--secondColor) text-[#3B2418]">
                      <Icon className="h-6 w-6" />
                    </div>
                    {feat.comingSoon && (
                      <span className="rounded-full bg-(--secondColor)/30 px-2 py-0.5 text-[9px] font-bold text-(--mainColor)">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-(--mainColor)">
                    {feat.title}
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-(--mainColor)/75 mt-1">
                    {feat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Online Digital Menu Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-(--mainColor)/15 bg-(--mainColor)/5 p-8 sm:p-12">
          <div className="mx-auto max-w-2xl text-center space-y-3 mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-(--secondColor)">
              {ONLINE_MENU_CONTENT.tag}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-(--mainColor)">
              {ONLINE_MENU_CONTENT.title}
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed text-(--mainColor)/75">
              {ONLINE_MENU_CONTENT.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {ONLINE_MENU_CONTENT.highlights.map((item) => {
              const Icon = menuIcons[item.icon] || LuUtensils;
              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-(--mainColor)/10 bg-(--bgColor) p-6 shadow-2xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-(--secondColor) text-[#3B2418]">
                      <Icon className="h-5 w-5" />
                    </div>
                    {item.comingSoon && (
                      <span className="rounded-full bg-(--secondColor)/30 px-2 py-0.5 text-[9px] font-bold text-(--mainColor)">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-(--mainColor)">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-(--mainColor)/75">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Free Exposure Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-(--mainColor)/15 bg-(--bgColor) p-8 sm:p-12 shadow-sm">
          <div className="mx-auto max-w-2xl text-center space-y-3 mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-(--secondColor)">
              {EXPOSURE_CONTENT.tag}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-(--mainColor)">
              {EXPOSURE_CONTENT.title}
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed text-(--mainColor)/75">
              {EXPOSURE_CONTENT.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {EXPOSURE_CONTENT.points.map((pt) => (
              <div
                key={pt.title}
                className="rounded-2xl border border-(--mainColor)/15 bg-(--mainColor)/5 p-6 shadow-2xs space-y-3"
              >
                <span className="inline-block rounded-full bg-(--secondColor) px-2.5 py-0.5 text-[10px] font-bold text-[#3B2418]">
                  {pt.badge}
                </span>
                <h3 className="text-base font-bold text-(--mainColor)">
                  {pt.title}
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed text-(--mainColor)/75">
                  {pt.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Customer Benefits */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border-b border-(--mainColor)/15 pb-4 mb-8">
          <h2 className="text-xl sm:text-2xl font-extrabold text-(--mainColor)">
            For Coffee Lovers Across Egypt
          </h2>
          <p className="text-xs sm:text-sm text-(--mainColor)/70">
            Discover new neighborhood gems and get rewarded for your daily coffee routine.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CUSTOMER_BENEFITS.items.map((b) => (
            <div
              key={b.title}
              className="rounded-2xl border border-(--mainColor)/15 bg-(--mainColor)/5 p-6 shadow-2xs space-y-3"
            >
              <span className="inline-block rounded-full bg-(--secondColor) px-2.5 py-0.5 text-[10px] font-bold text-[#3B2418]">
                {b.badge}
              </span>
              <h3 className="text-base font-bold text-(--mainColor)">
                {b.title}
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed text-(--mainColor)/75">
                {b.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="rounded-3xl bg-(--mainColor) text-(--bgColor) p-8 sm:p-12 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold">
            Ready to grow your cafe with Notch?
          </h2>
          <p className="text-xs sm:text-sm text-(--bgColor)/75 max-w-lg mx-auto">
            Choose your plan or request an invite to start testing with your baristas today.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-(--secondColor) px-6 py-3 text-xs sm:text-sm font-bold text-[#3B2418] hover:opacity-90"
            >
              <span>Apply for Your Cafe</span>
              <LuArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-(--bgColor)/30 bg-transparent px-6 py-3 text-xs sm:text-sm font-bold text-(--bgColor) hover:bg-(--bgColor)/10"
            >
              <span>View Pricing Plans (EGP)</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
