const express = require("express");
const { getAdminAnalytics } = require("../controllers/adminAnalyticsController");
const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(protect, authorize("admin"));
router.get("/", getAdminAnalytics);

module.exports = router;
