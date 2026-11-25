const express = require("express");
const {
  getAdminActivities,
  getAdminAuditLog,
  getAdminOverview,
} = require("../controllers/adminDataController");
const { authorize, protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(protect, authorize("admin"));
router.get("/overview", getAdminOverview);
router.get("/activities", getAdminActivities);
router.get("/audit-log", getAdminAuditLog);

module.exports = router;
