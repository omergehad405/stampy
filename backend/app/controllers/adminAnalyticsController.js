const Activity = require("../models/Activity");
const Cafe = require("../models/Cafe");
const Redemption = require("../models/Redemption");
const User = require("../models/User");

const RANGE_DAYS = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
  "365d": 365,
};
const TIMEZONE = "Africa/Cairo";

const timeKeyExpression = (dateField, monthly) => ({
  $dateToString: {
    format: monthly ? "%Y-%m" : "%Y-%m-%d",
    date: dateField,
    timezone: TIMEZONE,
  },
});

const getLocalDateParts = (date) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  return Object.fromEntries(parts.map(({ type, value }) => [type, value]));
};

const getLocalDateKey = (date) => {
  const parts = getLocalDateParts(date);
  return `${parts.year}-${parts.month}-${parts.day}`;
};

const buildTrend = ({ start, now, monthly, customers, cafes, activity, redemptions }) => {
  const keys = [];
  const endDateParts = getLocalDateParts(now);

  if (monthly) {
    const startParts = getLocalDateParts(start);
    let year = Number(startParts.year);
    let month = Number(startParts.month);
    const endYear = Number(endDateParts.year);
    const endMonth = Number(endDateParts.month);

    while (year < endYear || (year === endYear && month <= endMonth)) {
      keys.push(`${year}-${String(month).padStart(2, "0")}`);
      month += 1;
      if (month > 12) {
        month = 1;
        year += 1;
      }
    }
  } else {
    let dateKey = getLocalDateKey(start);
    const endDateKey = getLocalDateKey(now);

    while (dateKey <= endDateKey) {
      keys.push(dateKey);
      const nextDate = new Date(`${dateKey}T00:00:00Z`);
      nextDate.setUTCDate(nextDate.getUTCDate() + 1);
      dateKey = nextDate.toISOString().slice(0, 10);
    }
  }

  const trendByKey = new Map(
    keys.map((key) => [
      key,
      { period: key, customers: 0, cafes: 0, stamps: 0, redemptions: 0 },
    ])
  );

  const addCounts = (rows, field, target) => {
    rows.forEach((row) => {
      const point = trendByKey.get(row._id);
      if (point) point[target] = row[field] || 0;
    });
  };

  addCounts(customers, "count", "customers");
  addCounts(cafes, "count", "cafes");
  addCounts(activity, "stamps", "stamps");
  addCounts(redemptions, "count", "redemptions");
  return Array.from(trendByKey.values());
};

const getAdminAnalytics = async (req, res) => {
  const range = req.query.range || "30d";
  const days = RANGE_DAYS[range];
  if (!days) {
    return res.status(400).json({
      success: false,
      message: "Invalid range. Choose 7d, 30d, 90d, or 365d.",
    });
  }

  try {
    const now = new Date();
    const start = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    const monthly = days > 30;
    const periodMatch = { $gte: start, $lte: now };
    const activityPeriod = { createdAt: periodMatch };
    const periodKey = (field) => timeKeyExpression(field, monthly);

    const [
      totalCafes,
      activeCafes,
      totalCustomers,
      newCafes,
      newCustomers,
      activityTotals,
      rewardsRedeemed,
      customerTrend,
      cafeTrend,
      activityTrend,
      redemptionTrend,
      repeatVisits,
      cafeActivity,
      customerActivity,
    ] = await Promise.all([
      Cafe.countDocuments(),
      Cafe.countDocuments({ status: "active" }),
      User.countDocuments({ role: "user" }),
      Cafe.countDocuments({ createdAt: periodMatch }),
      User.countDocuments({ role: "user", createdAt: periodMatch }),
      Activity.aggregate([
        { $match: { ...activityPeriod, type: { $in: ["stamp", "join"] } } },
        {
          $group: {
            _id: null,
            stamps: {
              $sum: { $max: [{ $ifNull: ["$stampsDelta", 0] }, 0] },
            },
          },
        },
      ]),
      Redemption.countDocuments({
        status: "used",
        usedAt: periodMatch,
      }),
      User.aggregate([
        { $match: { role: "user", createdAt: periodMatch } },
        { $group: { _id: periodKey("$createdAt"), count: { $sum: 1 } } },
      ]),
      Cafe.aggregate([
        { $match: { createdAt: periodMatch } },
        { $group: { _id: periodKey("$createdAt"), count: { $sum: 1 } } },
      ]),
      Activity.aggregate([
        {
          $match: {
            ...activityPeriod,
            type: { $in: ["stamp", "join"] },
          },
        },
        {
          $group: {
            _id: periodKey("$createdAt"),
            stamps: {
              $sum: { $max: [{ $ifNull: ["$stampsDelta", 0] }, 0] },
            },
          },
        },
      ]),
      Redemption.aggregate([
        { $match: { status: "used", usedAt: periodMatch } },
        { $group: { _id: periodKey("$usedAt"), count: { $sum: 1 } } },
      ]),
      Activity.aggregate([
        {
          $match: {
            ...activityPeriod,
            type: "stamp",
            customerId: { $ne: null },
          },
        },
        { $group: { _id: "$customerId", visits: { $sum: 1 } } },
        {
          $group: {
            _id: null,
            visitors: { $sum: 1 },
            returningVisitors: {
              $sum: { $cond: [{ $gt: ["$visits", 1] }, 1, 0] },
            },
          },
        },
      ]),
      Activity.aggregate([
        {
          $match: {
            ...activityPeriod,
            type: { $in: ["stamp", "join"] },
          },
        },
        {
          $group: {
            _id: "$cafeId",
            stamps: {
              $sum: { $max: [{ $ifNull: ["$stampsDelta", 0] }, 0] },
            },
            visits: {
              $sum: { $cond: [{ $eq: ["$type", "stamp"] }, 1, 0] },
            },
          },
        },
        { $sort: { stamps: -1, visits: -1 } },
        { $limit: 5 },
      ]),
      Activity.aggregate([
        {
          $match: {
            ...activityPeriod,
            type: "stamp",
            customerId: { $ne: null },
          },
        },
        {
          $group: {
            _id: "$customerId",
            name: { $last: "$customerName" },
            stamps: {
              $sum: { $max: [{ $ifNull: ["$stampsDelta", 0] }, 0] },
            },
            visits: { $sum: 1 },
          },
        },
        { $sort: { visits: -1, stamps: -1 } },
        { $limit: 5 },
        {
          $project: {
            _id: 0,
            id: "$_id",
            name: 1,
            stamps: 1,
            visits: 1,
          },
        },
      ]),
    ]);

    const topCafeIds = cafeActivity.map((item) => item._id);
    const cafeRecords = await Cafe.find({ _id: { $in: topCafeIds } })
      .select("name slug logoImage")
      .lean();
    const cafeById = new Map(cafeRecords.map((cafe) => [cafe._id.toString(), cafe]));
    const topCafes = cafeActivity
      .map((item) => {
        const cafe = cafeById.get(item._id.toString());
        return cafe
          ? {
              id: cafe._id.toString(),
              slug: cafe.slug,
              name: cafe.name,
              logoImage: cafe.logoImage,
              stamps: item.stamps,
              visits: item.visits,
            }
          : null;
      })
      .filter(Boolean);

    const visitorSummary = repeatVisits[0] || { visitors: 0, returningVisitors: 0 };
    const trends = buildTrend({
      start,
      now,
      monthly,
      customers: customerTrend,
      cafes: cafeTrend,
      activity: activityTrend,
      redemptions: redemptionTrend,
    });

    return res.status(200).json({
      success: true,
      data: {
        range,
        start,
        end: now,
        timezone: TIMEZONE,
        totals: {
          totalCafes,
          activeCafes,
          totalCustomers,
          newCafes,
          newCustomers,
          stampsIssued: activityTotals[0]?.stamps || 0,
          rewardsRedeemed,
          returningVisitors: visitorSummary.returningVisitors,
          visitors: visitorSummary.visitors,
          returnRate: visitorSummary.visitors
            ? visitorSummary.returningVisitors / visitorSummary.visitors
            : null,
        },
        trends,
        topCafes,
        topCustomers: customerActivity.map((customer) => ({
          ...customer,
          id: customer.id.toString(),
        })),
      },
    });
  } catch (error) {
    console.error("[Admin Analytics] Failed to load platform analytics:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load analytics right now. Please try again.",
    });
  }
};

module.exports = { getAdminAnalytics };
