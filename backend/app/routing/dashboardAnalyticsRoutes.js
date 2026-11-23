const express = require("express");
const { getAnalytics } = require("../controllers/dashboardAnalyticsController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const { requireCafeFeature } = require("../middlewares/planFeatureMiddleware");

const router = express.Router();

router.use(
  protect,
  authorize("cafeOwner", "cafeManager", "cafeBarista"),
  requireCafeFeature("analytics")
);

router.get("/", getAnalytics);

module.exports = router;
