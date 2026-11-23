import SectionCard from "./SectionCard";
import SectionSkeleton from "./SectionSkeleton";
import { formatDate, formatNumber } from "../utils";

export default function TopCustomers({ customers = [], isLoading }) {
  return (
    <SectionCard
      title="Top customers"
      description="The 10 customers with the most visits during the selected period"
    >
      {isLoading ? (
        <SectionSkeleton rows={6} />
      ) : customers.length === 0 ? (
        <p className="rounded-xl bg-(--bgColor)/5 p-5 text-center text-xs text-(--bgColor)/65">
          No visits were recorded during this period.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[440px] text-right text-xs">
            <thead className="text-(--bgColor)/60">
              <tr>
                <th scope="col" className="px-3 py-3 font-semibold">#</th>
                <th scope="col" className="px-3 py-3 font-semibold">Customer</th>
                <th scope="col" className="px-3 py-3 font-semibold">Visits</th>
                <th scope="col" className="px-3 py-3 font-semibold">Last visit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--bgColor)/10">
              {customers.map((customer, index) => (
                <tr key={customer.customerId}>
                  <td className="px-3 py-3 text-(--bgColor)/55">{formatNumber(index + 1)}</td>
                  <td className="px-3 py-3 font-semibold">{customer.name}</td>
                  <td className="px-3 py-3 tabular-nums">{formatNumber(customer.visits)}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-(--bgColor)/70">
                    {formatDate(customer.lastVisitDate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </SectionCard>
  );
}
