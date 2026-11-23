import SectionCard from "./SectionCard";
import SectionSkeleton from "./SectionSkeleton";
import { formatNumber, getHeatColor } from "../utils";

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function PeakHoursHeatmap({ data = [], isLoading }) {
  const values = new Map(
    data.map((cell) => [`${cell.weekday}-${cell.hour}`, cell.visits])
  );
  const max = Math.max(0, ...data.map((cell) => cell.visits));

  return (
    <SectionCard
      title="Peak hours and days"
      description="Visits by weekday and hour in Africa/Cairo time"
    >
      {isLoading ? (
        <SectionSkeleton rows={8} />
      ) : (
        <div className="overflow-x-auto pb-2">
          <div className="min-w-[740px]">
            <div className="mb-2 grid grid-cols-[76px_repeat(24,minmax(18px,1fr))] gap-1">
              <span className="text-[10px] text-(--bgColor)/50">Hour</span>
              {Array.from({ length: 24 }, (_, hour) => (
                <span key={hour} className="text-center text-[9px] text-(--bgColor)/55">
                  {hour % 3 === 0 ? formatNumber(hour) : ""}
                </span>
              ))}
            </div>
            {WEEKDAYS.map((day, index) => {
              const weekday = index + 1;
              return (
                <div
                  key={day}
                  className="mb-1 grid grid-cols-[76px_repeat(24,minmax(18px,1fr))] items-center gap-1"
                >
                  <span className="text-[10px] text-(--bgColor)/75">{day}</span>
                  {Array.from({ length: 24 }, (_, hour) => {
                    const count = values.get(`${weekday}-${hour}`) || 0;
                    return (
                      <span
                        key={hour}
                        title={`${day}, ${String(hour).padStart(2, "0")}:00 — ${formatNumber(count)} visits`}
                        aria-label={`${day}, ${formatNumber(hour)}:00: ${formatNumber(count)} visits`}
                        className="h-5 rounded-[4px] border border-(--bgColor)/5"
                        style={{ backgroundColor: getHeatColor(count, max) }}
                      />
                    );
                  })}
                </div>
              );
            })}
            <div className="mt-3 flex items-center justify-end gap-2 text-[10px] text-(--bgColor)/60">
              <span>Less</span>
              {[0.06, 0.35, 0.65, 1].map((opacity) => (
                <span
                  key={opacity}
                  aria-hidden="true"
                  className="h-3 w-3 rounded-sm"
                  style={{ backgroundColor: `rgba(142, 197, 255, ${opacity})` }}
                />
              ))}
              <span>More</span>
            </div>
          </div>
        </div>
      )}
    </SectionCard>
  );
}
