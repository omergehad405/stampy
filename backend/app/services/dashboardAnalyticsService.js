const Activity = require("../models/Activity");
const Cafe = require("../models/Cafe");
const Redemption = require("../models/Redemption");

const CAIRO_TIMEZONE = "Africa/Cairo";
const configuredSampleSize = Number.parseInt(
  process.env.ANALYTICS_MIN_SAMPLE_SIZE || "10",
  10
);
const SAMPLE_SIZE_MINIMUM =
  Number.isInteger(configuredSampleSize) && configuredSampleSize > 0
    ? configuredSampleSize
    : 10;

const aggregateActivitySummary = async (cafeId, start, end) => {
  const [summary] = await Activity.aggregate([
    {
      $match: {
        cafeId,
        type: "stamp",
        createdAt: { $gte: start, $lt: end },
      },
    },
    {
      $group: {
        _id: "$customerId",
        visits: { $sum: 1 },
        stampsIssued: { $sum: { $max: ["$stampsDelta", 0] } },
      },
    },
    {
      $group: {
        _id: null,
        visits: { $sum: "$visits" },
        customers: {
          $sum: { $cond: [{ $ne: ["$_id", null] }, 1, 0] },
        },
        stampsIssued: { $sum: "$stampsIssued" },
      },
    },
  ]);

  return {
    visits: summary?.visits || 0,
    customers: summary?.customers || 0,
    stampsIssued: summary?.stampsIssued || 0,
  };
};

const aggregateRedeemedRewards = async (cafeId, start, end) =>
  Redemption.countDocuments({
    cafeId,
    status: "used",
    usedAt: { $gte: start, $lt: end },
  });

const fillVisitDates = (visits, start, end) => {
  const visitsByDate = new Map(visits.map((visit) => [visit.date, visit.visits]));
  const dateFormatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: CAIRO_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const dateKeys = new Set();

  for (
    let timestamp = start.getTime();
    timestamp <= end.getTime();
    timestamp += 24 * 60 * 60 * 1000
  ) {
    dateKeys.add(dateFormatter.format(new Date(timestamp)));
  }
  dateKeys.add(dateFormatter.format(end));

  return Array.from(dateKeys)
    .sort()
    .map((date) => ({ date, visits: visitsByDate.get(date) || 0 }));
};

const calculateChange = (current, previous) => {
  if (previous === 0) return current === 0 ? 0 : null;
  return Math.round(((current - previous) / previous) * 1000) / 10;
};

const getSummaryStats = async (cafeId, start, end, previousStart) => {
  const [current, previous, redeemed, previousRedeemed] = await Promise.all([
    aggregateActivitySummary(cafeId, start, end),
    aggregateActivitySummary(cafeId, previousStart, start),
    aggregateRedeemedRewards(cafeId, start, end),
    aggregateRedeemedRewards(cafeId, previousStart, start),
  ]);

  const currentStats = { ...current, rewardsRedeemed: redeemed };
  const previousStats = { ...previous, rewardsRedeemed: previousRedeemed };

  return Object.fromEntries(
    Object.entries(currentStats).map(([key, value]) => [
      key,
      {
        value,
        previous: previousStats[key],
        changePercent: calculateChange(value, previousStats[key]),
      },
    ])
  );
};

const getVisitsOverTime = async (cafeId, start, end) =>
  Activity.aggregate([
    {
      $match: {
        cafeId,
        type: "stamp",
        createdAt: { $gte: start, $lt: end },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt",
            timezone: CAIRO_TIMEZONE,
          },
        },
        visits: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    { $project: { _id: 0, date: "$_id", visits: 1 } },
  ]);

const getPeakHours = async (cafeId, start, end) =>
  Activity.aggregate([
    {
      $match: {
        cafeId,
        type: "stamp",
        createdAt: { $gte: start, $lt: end },
      },
    },
    {
      $addFields: {
        cairoDate: {
          $dateToParts: {
            date: "$createdAt",
            timezone: CAIRO_TIMEZONE,
          },
        },
      },
    },
    {
      $group: {
        _id: {
          weekday: "$cairoDate.dayOfWeek",
          hour: "$cairoDate.hour",
        },
        visits: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        weekday: "$_id.weekday",
        hour: "$_id.hour",
        visits: 1,
      },
    },
  ]);

const getReturnAndCustomerBreakdown = async (cafeId, start, end) => {
  const [repeatSummary] = await Activity.aggregate([
    {
      $match: {
        cafeId,
        type: "stamp",
        customerId: { $ne: null },
        createdAt: { $gte: start, $lt: end },
      },
    },
    { $group: { _id: "$customerId", visits: { $sum: 1 } } },
    {
      $group: {
        _id: null,
        visitingCustomers: { $sum: 1 },
        returningCustomers: {
          $sum: { $cond: [{ $gte: ["$visits", 2] }, 1, 0] },
        },
      },
    },
  ]);

  const [customerBreakdown] = await Activity.aggregate([
    {
      $match: {
        cafeId,
        type: "stamp",
        customerId: { $ne: null },
        createdAt: { $lt: end },
      },
    },
    {
      $group: {
        _id: "$customerId",
        firstVisit: { $min: "$createdAt" },
        visitsInPeriod: {
          $sum: {
            $cond: [
              { $and: [{ $gte: ["$createdAt", start] }, { $lt: ["$createdAt", end] }] },
              1,
              0,
            ],
          },
        },
      },
    },
    { $match: { visitsInPeriod: { $gt: 0 } } },
    {
      $group: {
        _id: null,
        newCustomers: {
          $sum: {
            $cond: [
              { $and: [{ $gte: ["$firstVisit", start] }, { $lt: ["$firstVisit", end] }] },
              1,
              0,
            ],
          },
        },
        returningCustomers: {
          $sum: {
            $cond: [{ $lt: ["$firstVisit", start] }, 1, 0],
          },
        },
      },
    },
  ]);

  const returningCustomers = repeatSummary?.returningCustomers || 0;
  const visitingCustomers = repeatSummary?.visitingCustomers || 0;

  return {
    returnRate: {
      value: visitingCustomers
        ? returningCustomers / visitingCustomers
        : null,
      returningCustomers,
      visitingCustomers,
    },
    newVsReturning: {
      newCustomers: customerBreakdown?.newCustomers || 0,
      returningCustomers: customerBreakdown?.returningCustomers || 0,
      totalCustomers:
        (customerBreakdown?.newCustomers || 0) +
        (customerBreakdown?.returningCustomers || 0),
    },
  };
};

const getRewardsFunnel = async (cafeId, start, end) => {
  const [stamps, earned, redeemed] = await Promise.all([
    Activity.aggregate([
      {
        $match: {
          cafeId,
          type: "stamp",
          createdAt: { $gte: start, $lt: end },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: { $max: ["$stampsDelta", 0] } },
        },
      },
    ]),
    Redemption.countDocuments({
      cafeId,
      createdAt: { $gte: start, $lt: end },
    }),
    Redemption.countDocuments({
      cafeId,
      status: "used",
      createdAt: { $gte: start, $lt: end },
    }),
  ]);

  const stampsIssued = stamps[0]?.total || 0;

  return {
    stampsIssued,
    rewardsEarned: earned,
    rewardsRedeemed: redeemed,
    redemptionRate: {
      value: earned ? redeemed / earned : null,
      redeemed,
      earned,
    },
  };
};

const getAtRiskCustomers = async (cafeId, atRiskDays, now) => {
  const cutoff = new Date(now.getTime() - atRiskDays * 24 * 60 * 60 * 1000);

  return Cafe.aggregate([
    { $match: { _id: cafeId } },
    { $unwind: "$customers" },
    {
      $match: {
        "customers.totalVisits": { $gte: 3 },
        "customers.lastVisitDate": { $lt: cutoff },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "customers.userId",
        foreignField: "_id",
        as: "customer",
      },
    },
    { $unwind: "$customer" },
    {
      $project: {
        _id: 0,
        customerId: "$customer._id",
        name: "$customer.name",
        totalVisits: "$customers.totalVisits",
        lastVisitDate: "$customers.lastVisitDate",
      },
    },
    { $sort: { lastVisitDate: 1 } },
    { $limit: 50 },
  ]);
};

const getTopCustomers = async (cafeId, start, end) =>
  Activity.aggregate([
    {
      $match: {
        cafeId,
        type: "stamp",
        customerId: { $ne: null },
        createdAt: { $gte: start, $lt: end },
      },
    },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: "$customerId",
        name: { $first: "$customerName" },
        visits: { $sum: 1 },
        lastVisitDate: { $first: "$createdAt" },
      },
    },
    { $sort: { visits: -1, lastVisitDate: -1 } },
    { $limit: 10 },
    {
      $project: {
        _id: 0,
        customerId: "$_id",
        name: 1,
        visits: 1,
        lastVisitDate: 1,
      },
    },
  ]);

const getDashboardAnalytics = async ({
  cafeId,
  start,
  end,
  previousStart,
  atRiskDays,
  now,
}) => {
  const [
    stats,
    visitsOverTime,
    peakHours,
    customerMetrics,
    rewardsFunnel,
    atRiskCustomers,
    topCustomers,
  ] = await Promise.all([
    getSummaryStats(cafeId, start, end, previousStart),
    getVisitsOverTime(cafeId, start, end),
    getPeakHours(cafeId, start, end),
    getReturnAndCustomerBreakdown(cafeId, start, end),
    getRewardsFunnel(cafeId, start, end),
    getAtRiskCustomers(cafeId, atRiskDays, now),
    getTopCustomers(cafeId, start, end),
  ]);

  return {
    stats,
    visitsOverTime: fillVisitDates(visitsOverTime, start, end),
    peakHours,
    ...customerMetrics,
    rewardsFunnel,
    atRiskCustomers,
    topCustomers,
    hasData:
      stats.visits.value > 0 ||
      stats.rewardsRedeemed.value > 0 ||
      rewardsFunnel.rewardsEarned > 0 ||
      atRiskCustomers.length > 0,
    sampleSizeMinimum: SAMPLE_SIZE_MINIMUM,
  };
};

module.exports = {
  getSummaryStats,
  getVisitsOverTime,
  getPeakHours,
  getReturnAndCustomerBreakdown,
  getRewardsFunnel,
  getAtRiskCustomers,
  getTopCustomers,
  getDashboardAnalytics,
};
