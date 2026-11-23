import { LuChartNoAxesCombined } from "react-icons/lu";

export default function EmptyState() {
  return (
    <section
      dir="ltr"
      lang="en"
      className="flex flex-col items-center rounded-3xl border border-(--bgColor)/15 bg-(--mainColor) px-6 py-14 text-center text-(--bgColor)"
    >
      <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-(--secondColor)/20 text-(--secondColor)">
        <LuChartNoAxesCombined className="h-8 w-8" aria-hidden="true" />
      </span>
      <h2 className="text-lg font-bold">Your cafe analytics will appear here</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-(--bgColor)/65">
        No visits have been recorded during the selected period yet. Scan a
        customer QR code to record a visit and start seeing loyalty program
        performance.
      </p>
    </section>
  );
}
