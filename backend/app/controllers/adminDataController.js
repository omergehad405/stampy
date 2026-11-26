const Activity = require("../models/Activity");
const AdminAuditLog = require("../models/AdminAuditLog");
const Cafe = require("../models/Cafe");
const Redemption = require("../models/Redemption");
const User = require("../models/User");

const TIMEZONE = "Africa/Cairo";
const MONTH_KEY = {
  $dateToString: {
    format: "%Y-%m",
    date: "$createdAt",
    timezone: TIMEZONE,
  },
};

const getMonthKey = (date) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
  }).formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  return `${year}-${month}`;
};

const getRecentMonthKeys = (now) => {
  const [yearText, monthText] = getMonthKey(now).split("-");
  const currentMonth = new Date(Date.UTC(Number(yearText), Number(monthText) - 1, 1));
  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date(currentMonth);
    date.setUTCMonth(date.getUTCMonth() - (5 - index));
    return getMonthKey(date);
  });
};

const getActivityTotals = async () => {
  const [totals] = await Activity.aggregate([
    {
      $group: {
        _id: null,
        totalTransactions: { $sum: 1 },
        totalStampsIssued: {
          $sum: {
            $cond: [
              { $in: ["$type", ["stamp", "join"]] },
              { $max: [{ $ifNull: ["$stampsDelta", 0] }, 0] },
              0,
            ],
          },
        },
        totalJoins: {
          $sum: { $cond: [{ $eq: ["$type", "join"] }, 1, 0] },
        },
        totalRedemptions: {
          $sum: { $cond: [{ $eq: ["$type", "redemption"] }, 1, 0] },
        },
      },
    },
  ]);
  return totals || {
    totalTransactions: 0,
    totalStampsIssued: 0,
    totalJoins: 0,
    totalRedemptions: 0,
  };
};

const getAdminOverview = async (req, res) => {
  try {
    const now = new Date();
    const monthKeys = getRecentMonthKeys(now);
    const firstMonth = new Date(
      new Date(`${monthKeys[0]}-01T00:00:00.000Z`).getTime() - 24 * 60 * 60 * 1000
    );
    const [totalCafes, activeCafes, pendingCafes, totalCustomers, activityTotals,
      totalRewardsRedeemed, customerTrend, cafeTrend, stampTrend, topCafeActivity,
      recentActivities, recentCafes, recentCustomers, auditLog] = await Promise.all([
      Cafe.countDocuments(),
      Cafe.countDocuments({ status: "active" }),
      Cafe.countDocuments({ status: "pending" }),
      User.countDocuments({ role: "user" }),
      getActivityTotals(),
      Redemption.countDocuments({ status: "used" }),
      User.aggregate([
        { $match: { role: "user", createdAt: { $gte: firstMonth, $lte: now } } },
        { $group: { _id: MONTH_KEY, count: { $sum: 1 } } },
      ]),
      Cafe.aggregate([
        { $match: { createdAt: { $gte: firstMonth, $lte: now } } },
        { $group: { _id: MONTH_KEY, count: { $sum: 1 } } },
      ]),
      Activity.aggregate([
        {
          $match: {
            createdAt: { $gte: firstMonth, $lte: now },
            type: { $in: ["stamp", "join"] },
          },
        },
        {
          $group: {
            _id: MONTH_KEY,
            stamps: {
              $sum: { $max: [{ $ifNull: ["$stampsDelta", 0] }, 0] },
            },
          },
        },
      ]),
      Activity.aggregate([
        { $match: { type: { $in: ["stamp", "join"] }, cafeId: { $ne: null } } },
        {
          $group: {
            _id: "$cafeId",
            stamps: {
              $sum: { $max: [{ $ifNull: ["$stampsDelta", 0] }, 0] },
            },
            visits: { $sum: { $cond: [{ $eq: ["$type", "stamp"] }, 1, 0] } },
          },
        },
        { $sort: { stamps: -1, visits: -1 } },
        { $limit: 4 },
      ]),
      Activity.find()
        .sort({ createdAt: -1 })
        .limit(6)
        .populate("cafeId", "name slug")
        .lean(),
      Cafe.find().sort({ createdAt: -1 }).limit(3).lean(),
      User.find({ role: "user" }).sort({ createdAt: -1 }).limit(4).lean(),
      AdminAuditLog.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    const countByMonth = (rows, field) =>
      new Map(rows.map((row) => [row._id, row[field]]));
    const customersByMonth = countByMonth(customerTrend, "count");
    const cafesByMonth = countByMonth(cafeTrend, "count");
    const stampsByMonth = countByMonth(stampTrend, "stamps");
    const growthData = monthKeys.map((month) => ({
      month,
      cafes: cafesByMonth.get(month) || 0,
      customers: customersByMonth.get(month) || 0,
      stamps: stampsByMonth.get(month) || 0,
    }));
    const currentMonth = getMonthKey(now);

    const cafeIds = topCafeActivity.map((item) => item._id);
    const [cafeRecords, redemptionTotals] = await Promise.all([
      Cafe.find({ _id: { $in: cafeIds } })
        .select("name slug logoImage customers customerCount")
        .lean(),
      Redemption.aggregate([
        { $match: { cafeId: { $in: cafeIds }, status: "used" } },
        { $group: { _id: "$cafeId", count: { $sum: 1 } } },
      ]),
    ]);
    const cafeById = new Map(cafeRecords.map((cafe) => [cafe._id.toString(), cafe]));
    const redemptionsByCafeId = new Map(
      redemptionTotals.map((item) => [item._id.toString(), item.count])
    );
    const topCafes = topCafeActivity
      .map((item) => {
        const cafe = cafeById.get(item._id.toString());
        return cafe
          ? {
              id: cafe._id.toString(),
              slug: cafe.slug,
              name: cafe.name,
              logoImage: cafe.logoImage,
              customerCount: cafe.customers?.length ?? cafe.customerCount ?? 0,
              totalStampsIssued: item.stamps,
              totalRewardsRedeemed: redemptionsByCafeId.get(item._id.toString()) || 0,
            }
          : null;
      })
      .filter(Boolean);

    const serializeRecentActivity = (activity) => ({
      id: activity._id.toString(),
      type: activity.type,
      title: activity.title,
      customerName: activity.customerName,
      cafeName: activity.cafeId?.name || "",
      cafeSlug: activity.cafeId?.slug || "",
      stampsDelta: activity.stampsDelta || 0,
      staffName: activity.staffName || "",
      note: activity.note || "",
      timestamp: activity.createdAt,
      formattedDate: activity.createdAt
        ? new Date(activity.createdAt).toLocaleString("en-US", {
            timeZone: TIMEZONE,
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })
        : "",
    });

    return res.status(200).json({
      success: true,
      data: {
        stats: {
          totalCafes,
          activeCafes,
          pendingCafes,
          totalCustomers,
          totalStampsIssued: activityTotals.totalStampsIssued,
          totalRewardsRedeemed,
          newCafesThisMonth: cafesByMonth.get(currentMonth) || 0,
          newCustomersThisMonth: customersByMonth.get(currentMonth) || 0,
        },
        growthData,
        topCafes,
        recentActivities: recentActivities.map(serializeRecentActivity),
        recentCafes: recentCafes.map((cafe) => ({
          id: cafe._id.toString(),
          slug: cafe.slug,
          name: cafe.name,
          status: cafe.status,
          registrationDate: cafe.createdAt
            ? new Date(cafe.createdAt).toISOString().slice(0, 10)
            : "",
        })),
        recentCustomers: recentCustomers.map((customer) => ({
          id: customer._id.toString(),
          name: customer.name,
          status: customer.isActive ? "active" : "suspended",
          registeredDate: customer.createdAt
            ? new Date(customer.createdAt).toISOString().slice(0, 10)
            : "",
        })),
        auditLog: auditLog.map((item) => ({
          id: item._id.toString(),
          action: item.action,
          description: item.description,
          adminName: item.adminName,
          timestamp: item.createdAt,
        })),
      },
    });
  } catch (error) {
    console.error("[Admin Data] Failed to load platform overview:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load platform overview right now. Please try again.",
    });
  }
};

const getAdminActivities = async (req, res) => {
  try {
    const [activityTotals, activities, totalEvents, totalRedemptions] = await Promise.all([
      getActivityTotals(),
      Activity.find()
        .sort({ createdAt: -1 })
        .limit(500)
        .populate("cafeId", "name slug")
        .lean(),
      Activity.countDocuments(),
      Redemption.countDocuments({ status: "used" }),
    ]);
    return res.status(200).json({
      success: true,
      data: {
        ...activityTotals,
        totalRedemptions,
        totalEvents,
        activities: activities.map((activity) => ({
          id: activity._id.toString(),
          type: activity.type,
          title: activity.title,
          customerId: activity.customerId?.toString() || "",
          customerName: activity.customerName,
          cafeName: activity.cafeId?.name || "",
          cafeSlug: activity.cafeId?.slug || "",
          stampsDelta: activity.stampsDelta || 0,
          staffName: activity.staffName || "",
          note: activity.note || "",
          timestamp: activity.createdAt,
          formattedDate: activity.createdAt
            ? new Date(activity.createdAt).toLocaleString("en-US", {
                timeZone: TIMEZONE,
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })
            : "",
        })),
      },
    });
  } catch (error) {
    console.error("[Admin Data] Failed to load platform activities:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load platform activity right now. Please try again.",
    });
  }
};

const getAdminAuditLog = async (req, res) => {
  try {
    const items = await AdminAuditLog.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();
    return res.status(200).json({
      success: true,
      data: {
        auditLog: items.map((item) => ({
          id: item._id.toString(),
          action: item.action,
          resource: item.resource,
          description: item.description,
          adminName: item.adminName,
          timestamp: item.createdAt,
        })),
      },
    });
  } catch (error) {
    console.error("[Admin Data] Failed to load audit log:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load the platform audit log right now. Please try again.",
    });
  }
};

module.exports = { getAdminOverview, getAdminActivities, getAdminAuditLog };
