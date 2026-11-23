const englishNumber = new Intl.NumberFormat("en-US");
const englishPercent = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
});

export const formatNumber = (value) => englishNumber.format(value || 0);

export const formatPercent = (value) =>
  value === null || value === undefined
    ? "—"
    : `${englishPercent.format(value)}%`;

export const formatDate = (value) => {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeZone: "Africa/Cairo",
  }).format(date);
};

export const getHeatColor = (value, max) => {
  if (!value || max <= 0) return "rgba(142, 197, 255, 0.06)";
  const intensity = Math.min(value / max, 1);
  return `rgba(142, 197, 255, ${0.18 + intensity * 0.82})`;
};

export const formatChange = (value) => {
  if (value === null || value === undefined) return "New comparison";
  if (value === 0) return "No change";
  const sign = value > 0 ? "+" : "";
  return `${sign}${formatPercent(value)}`;
};
