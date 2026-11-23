import SectionCard from "./SectionCard";
import SectionSkeleton from "./SectionSkeleton";
import { formatNumber, formatPercent } from "../utils";

export default function ReturnRateCard({ returnRate, newVsReturning, sampleSizeMinimum = 10, isLoading }) {
  const sampleIsSmall =
    (returnRate?.visitingCustomers || 0) < sampleSizeMinimum;
  const total = newVsReturning?.totalCustomers || 0;
  const newWidth = total
    ? (newVsReturning.newCustomers / total) * 100
    : 0;

  return (
    <SectionCard
      title="Returning and new customers"
      description="Return rate counts customers with 2 or more visits in this range. New vs. returning compares each customer's first recorded visit with this range."
      className="h-full"
    >
      {isLoading ? (
        <SectionSkeleton rows={5} />
      ) : (
        <div className="space-y-5">
          <div>
            <div className="flex items-end justify-between gap-3">
              <span className="text-xs text-(--bgColor)/70">Return rate</span>
              <span className="text-2xl font-extrabold tabular-nums">
                {sampleIsSmall ? "—" : formatPercent((returnRate?.value || 0) * 100)}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-(--bgColor)/55">
              {formatNumber(returnRate?.returningCustomers)} of{" "}
              {formatNumber(returnRate?.visitingCustomers)} customers visited during this period
              {sampleIsSmall && " · Not enough data yet"}
            </p>
          </div>

          <div className="border-t border-(--bgColor)/10 pt-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold">New</span>
              <span className="tabular-nums">{formatNumber(newVsReturning?.newCustomers)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="font-semibold">Returning</span>
              <span className="tabular-nums">{formatNumber(newVsReturning?.returningCustomers)}</span>
            </div>
            <div
              className="mt-3 flex h-2 overflow-hidden rounded-full bg-(--bgColor)/10"
              role="img"
              aria-label={`${formatNumber(newVsReturning?.newCustomers)} new customers and ${formatNumber(newVsReturning?.returningCustomers)} returning customers`}
            >
              <span
                className="h-full bg-(--secondColor)"
                style={{ width: `${newWidth}%` }}
              />
              <span className="h-full flex-1 bg-(--bgColor)/20" />
            </div>
          </div>
        </div>
      )}
    </SectionCard>
  );
}
