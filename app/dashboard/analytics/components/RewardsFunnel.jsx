import SectionCard from "./SectionCard";
import SectionSkeleton from "./SectionSkeleton";
import { formatNumber, formatPercent } from "../utils";

const STEPS = [
  { key: "stampsIssued", label: "Stamps issued" },
  { key: "rewardsEarned", label: "Rewards earned" },
  { key: "rewardsRedeemed", label: "Rewards redeemed" },
];

export default function RewardsFunnel({ data, isLoading }) {
  const sampleIsSmall = (data?.rewardsEarned || 0) < 10;

  return (
    <SectionCard
      title="Rewards funnel"
      description="Earned rewards are vouchers created by customers; redeemed rewards are vouchers confirmed by staff."
      className="h-full"
    >
      {isLoading ? (
        <SectionSkeleton rows={5} />
      ) : (
        <div className="space-y-4">
          {STEPS.map((step) => (
            <div key={step.key} className="flex items-center justify-between gap-3">
              <span className="text-xs text-(--bgColor)/75">{step.label}</span>
              <span className="text-sm font-bold tabular-nums">
                {formatNumber(data?.[step.key])}
              </span>
            </div>
          ))}
          <div className="flex items-center justify-between border-t border-(--bgColor)/10 pt-4">
            <span className="text-xs font-semibold">Redemption rate</span>
            <span className="text-lg font-extrabold tabular-nums">
              {sampleIsSmall
                ? "—"
                : formatPercent((data?.redemptionRate?.value || 0) * 100)}
            </span>
          </div>
          <p className="text-[11px] leading-5 text-(--bgColor)/55">
            {formatNumber(data?.redemptionRate?.redeemed)} redeemed from{" "}
            {formatNumber(data?.redemptionRate?.earned)} vouchers created during this period
            {sampleIsSmall && " · Not enough data yet"}
          </p>
        </div>
      )}
    </SectionCard>
  );
}
