const { getDashboardAnalytics } = require("../services/dashboardAnalyticsService");

const RANGE_DAYS = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
};

const getAnalytics = async (req, res) => {
  const range = req.query.range || "30d";
  if (!Object.prototype.hasOwnProperty.call(RANGE_DAYS, range)) {
    return res.status(400).json({
      success: false,
      message: "Invalid range. Choose 7, 30, or 90 days.",
    });
  }

  const rawAtRiskDays = req.query.atRiskDays;
  const atRiskDays =
    rawAtRiskDays === undefined ? 14 : Number(rawAtRiskDays);
  if (!Number.isInteger(atRiskDays) || atRiskDays < 1 || atRiskDays > 365) {
    return res.status(400).json({
      success: false,
      message: "At-risk inactivity days must be between 1 and 365.",
    });
  }

  try {
    const now = new Date();
    const duration = RANGE_DAYS[range] * 24 * 60 * 60 * 1000;
    const end = now;
    const start = new Date(now.getTime() - duration);
    const previousStart = new Date(start.getTime() - duration);
    const data = await getDashboardAnalytics({
      cafeId: req.cafe._id,
      start,
      end,
      previousStart,
      atRiskDays,
      now,
    });

    return res.status(200).json({
      success: true,
      data: {
        range,
        start,
        end,
        atRiskDays,
        ...data,
      },
    });
  } catch (error) {
    console.error("[Dashboard Analytics] Failed to load cafe analytics:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load analytics right now. Please try again.",
    });
  }
};

module.exports = {
  getAnalytics,
};
