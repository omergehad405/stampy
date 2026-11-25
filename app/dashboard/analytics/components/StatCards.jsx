import { LuActivity, LuGift, LuStamp, LuUsers } from "react-icons/lu";
import { formatChange, formatNumber } from "../utils";
import SectionSkeleton from "./SectionSkeleton";

const CARD_CONFIG = [
  { key: "visits", label: "Visits", icon: LuActivity },
  { key: "customers", label: "Active Customers", icon: LuUsers },
  { key: "stampsIssued", label: "Stamps Issued", icon: LuStamp },
  { key: "rewardsRedeemed", label: "Rewards Redeemed", icon: LuGift },
];

export default function StatCards({ stats, isLoading, isLifetime }) {
  return (
    <div dir="ltr" lang="en" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {CARD_CONFIG.map(({ key, label, icon: Icon }) => {
        const stat = stats?.[key];
        return (
          <section
            key={key}
            className="rounded-2xl border border-(--bgColor)/15 bg-(--mainColor) p-4 text-(--bgColor) shadow-2xs sm:p-5"
          >
            {isLoading ? (
              <SectionSkeleton rows={3} />
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-(--bgColor)/70">{label}</p>
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-(--secondColor)/20 text-(--secondColor)">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>
                <p className="mt-3 text-2xl font-extrabold tabular-nums">
                  {formatNumber(stat?.value)}
                </p>
                <p className="mt-1 text-[11px] text-(--bgColor)/60">
                  {isLifetime
                    ? "Since cafe registration"
                    : `${formatChange(stat?.changePercent)} compared with the previous period`}
                </p>
              </>
            )}
          </section>
        );
      })}
    </div>
  );
}
