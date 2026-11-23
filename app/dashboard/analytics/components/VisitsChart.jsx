"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import SectionCard from "./SectionCard";
import SectionSkeleton from "./SectionSkeleton";
import { formatNumber } from "../utils";

const formatDay = (value) => {
  const [, month, day] = value.split("-");
  return `${formatNumber(Number(day))}/${formatNumber(Number(month))}`;
};

export default function VisitsChart({ data = [], isLoading }) {
  return (
    <SectionCard
      title="Visits over time"
      description="Recorded visits per day"
      className="h-full"
    >
      {isLoading ? (
        <SectionSkeleton rows={6} className="h-64 pt-4" />
      ) : (
        <div className="h-64 w-full" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 12, left: -18, bottom: 4 }}>
              <CartesianGrid stroke="rgba(242,235,218,0.12)" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={formatDay}
                tick={{ fill: "rgba(242,235,218,0.65)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                minTickGap={18}
              />
              <YAxis
                allowDecimals={false}
                tickFormatter={formatNumber}
                tick={{ fill: "rgba(242,235,218,0.65)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                labelFormatter={formatDay}
                formatter={(value) => [formatNumber(value), "Visits"]}
                contentStyle={{
                  direction: "rtl",
                  background: "#3B2418",
                  border: "1px solid rgba(242,235,218,0.2)",
                  borderRadius: 12,
                  color: "#F2EBDA",
                }}
              />
              <Line
                type="monotone"
                dataKey="visits"
                name="Visits"
                stroke="#8EC5FF"
                strokeWidth={3}
                dot={{ r: 3, fill: "#8EC5FF", strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </SectionCard>
  );
}
