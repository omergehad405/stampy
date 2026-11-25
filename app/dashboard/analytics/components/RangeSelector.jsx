const RANGES = [
  { value: "all", label: "All time" },
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "90d", label: "90 days" },
];

export default function RangeSelector({ value, onChange }) {
  return (
    <div
      dir="ltr"
      lang="en"
      role="group"
      aria-label="Date range"
      className="flex flex-wrap gap-2"
    >
      {RANGES.map((range) => (
        <button
          key={range.value}
          type="button"
          aria-pressed={value === range.value}
          onClick={() => onChange(range.value)}
          className={`min-h-10 rounded-xl px-4 text-xs font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--secondColor) ${
            value === range.value
              ? "bg-(--secondColor) text-[#3B2418]"
              : "border border-(--mainColor) bg-(--bgColor) text-(--mainColor)/75 hover:bg-(--bgColor)/10"
          }`}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}
