import Link from "next/link";
import { LuArrowUpLeft, LuMail } from "react-icons/lu";
import SectionCard from "./SectionCard";
import SectionSkeleton from "./SectionSkeleton";
import { formatDate, formatNumber } from "../utils";

const DAY_OPTIONS = [7, 14, 30, 60, 90];

export default function AtRiskCustomers({
  customers = [],
  atRiskDays,
  onAtRiskDaysChange,
  isNotificationsAvailable,
  cafeName,
  isLoading,
}) {
  const subject = `We miss you at ${cafeName || "our cafe"}`;

  return (
    <SectionCard
      title="At-risk customers"
      description="Customers with at least 3 visits who have not returned recently. Creating a message opens an email campaign for subscribers."
    >
      {isLoading ? (
        <SectionSkeleton rows={5} />
      ) : (
        <>
          <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
            <label htmlFor="at-risk-days" className="font-semibold">
              Last visit more than
            </label>
            <select
              id="at-risk-days"
              value={atRiskDays}
              onChange={(event) => onAtRiskDaysChange(Number(event.target.value))}
              className="min-h-10 rounded-lg border border-(--bgColor)/20 bg-(--mainColor) px-3 text-(--bgColor) outline-none focus-visible:border-(--secondColor)"
            >
              {DAY_OPTIONS.map((days) => (
                <option key={days} value={days}>
                  {formatNumber(days)} days ago
                </option>
              ))}
            </select>
          </div>

          {customers.length === 0 ? (
            <p className="rounded-xl bg-(--bgColor)/5 p-5 text-center text-xs text-(--bgColor)/65">
              No customers currently match this criteria.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-right text-xs">
                <thead className="text-(--bgColor)/60">
                  <tr>
                    <th scope="col" className="px-3 py-3 font-semibold">Customer</th>
                    <th scope="col" className="px-3 py-3 font-semibold">Visits</th>
                    <th scope="col" className="px-3 py-3 font-semibold">Last visit</th>
                    <th scope="col" className="px-3 py-3 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-(--bgColor)/10">
                  {customers.map((customer) => (
                    <tr key={customer.customerId}>
                      <td className="px-3 py-3 font-semibold">{customer.name}</td>
                      <td className="px-3 py-3 tabular-nums">
                        {formatNumber(customer.totalVisits)}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-(--bgColor)/70">
                        {formatDate(customer.lastVisitDate)}
                      </td>
                      <td className="px-3 py-3">
                        {isNotificationsAvailable ? (
                          <Link
                            href={`/dashboard/settings?tab=notifications&subject=${encodeURIComponent(subject)}`}
                            className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-(--secondColor) px-3 font-bold text-[#3B2418] hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--secondColor)"
                            aria-label={`Set up a win-back email for ${customer.name}`}
                          >
                            <LuMail className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>Set up email</span>
                            <LuArrowUpLeft className="h-3.5 w-3.5" aria-hidden="true" />
                          </Link>
                        ) : (
                          <span className="text-(--bgColor)/45">Not included in plan</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </SectionCard>
  );
}
